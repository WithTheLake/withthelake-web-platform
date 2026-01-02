'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type BoardType = 'notice' | 'free' | 'review'

interface CommunityPost {
  id: string
  user_id: string | null
  board_type: BoardType
  title: string
  content: string
  author_nickname: string | null
  view_count: number
  is_pinned: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

interface Comment {
  id: string
  post_id: string
  user_id: string | null
  content: string
  author_nickname: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * 게시글 목록 조회
 */
export async function getPosts(boardType: BoardType, page = 1, limit = 20) {
  try {
    const supabase = await createClient()

    const offset = (page - 1) * limit

    // 총 게시글 수 조회 (페이지네이션용)
    const { count } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('board_type', boardType)
      .eq('is_active', true)

    // 게시글 조회 (고정 글 먼저, 그 다음 최신순)
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .eq('board_type', boardType)
      .eq('is_active', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return {
      success: true,
      data: data as CommunityPost[],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Get posts error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch posts',
      data: [],
      total: 0,
      page: 1,
      totalPages: 0
    }
  }
}

/**
 * 게시글 상세 조회 (조회수 증가)
 */
export async function getPost(postId: string) {
  try {
    const supabase = await createClient()

    // 게시글 조회
    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .select('*')
      .eq('id', postId)
      .eq('is_active', true)
      .single()

    if (postError) throw postError
    if (!post) {
      return {
        success: false,
        error: 'Post not found'
      }
    }

    // 조회수 증가
    await supabase
      .from('community_posts')
      .update({ view_count: post.view_count + 1 })
      .eq('id', postId)

    // 댓글 조회
    const { data: comments, error: commentsError } = await supabase
      .from('community_comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (commentsError) throw commentsError

    return {
      success: true,
      post: { ...post, view_count: post.view_count + 1 } as CommunityPost,
      comments: (comments || []) as Comment[]
    }
  } catch (error) {
    console.error('Get post error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch post'
    }
  }
}

/**
 * 게시글 작성
 */
export async function createPost(formData: FormData) {
  try {
    const supabase = await createClient()

    // 인증 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'LOGIN_REQUIRED',
        message: '로그인이 필요합니다.'
      }
    }

    // 사용자 닉네임 조회
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('nickname')
      .eq('user_id', user.id)
      .single()

    const boardType = formData.get('board_type') as BoardType
    const title = formData.get('title') as string
    const content = formData.get('content') as string

    // 입력값 검증
    if (!boardType || !['notice', 'free', 'review'].includes(boardType)) {
      return {
        success: false,
        error: 'INVALID_BOARD_TYPE',
        message: '유효하지 않은 게시판 타입입니다.'
      }
    }

    if (!title || title.trim().length === 0) {
      return {
        success: false,
        error: 'INVALID_TITLE',
        message: '제목을 입력해주세요.'
      }
    }

    if (title.length > 200) {
      return {
        success: false,
        error: 'TITLE_TOO_LONG',
        message: '제목은 200자를 초과할 수 없습니다.'
      }
    }

    if (!content || content.trim().length === 0) {
      return {
        success: false,
        error: 'INVALID_CONTENT',
        message: '내용을 입력해주세요.'
      }
    }

    if (content.length > 10000) {
      return {
        success: false,
        error: 'CONTENT_TOO_LONG',
        message: '내용은 10,000자를 초과할 수 없습니다.'
      }
    }

    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        board_type: boardType,
        title: title.trim(),
        content: content.trim(),
        author_nickname: profile?.nickname || user.email?.split('@')[0] || '익명'
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/community`)

    return {
      success: true,
      data: data as CommunityPost
    }
  } catch (error) {
    console.error('Create post error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create post'
    }
  }
}

/**
 * 게시글 수정
 */
export async function updatePost(postId: string, formData: FormData) {
  try {
    const supabase = await createClient()

    // 인증 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'LOGIN_REQUIRED',
        message: '로그인이 필요합니다.'
      }
    }

    const title = formData.get('title') as string
    const content = formData.get('content') as string

    // 입력값 검증
    if (!title || title.trim().length === 0) {
      return {
        success: false,
        error: 'INVALID_TITLE',
        message: '제목을 입력해주세요.'
      }
    }

    if (title.length > 200) {
      return {
        success: false,
        error: 'TITLE_TOO_LONG',
        message: '제목은 200자를 초과할 수 없습니다.'
      }
    }

    if (!content || content.trim().length === 0) {
      return {
        success: false,
        error: 'INVALID_CONTENT',
        message: '내용을 입력해주세요.'
      }
    }

    if (content.length > 10000) {
      return {
        success: false,
        error: 'CONTENT_TOO_LONG',
        message: '내용은 10,000자를 초과할 수 없습니다.'
      }
    }

    const { data, error } = await supabase
      .from('community_posts')
      .update({
        title: title.trim(),
        content: content.trim()
      })
      .eq('id', postId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/community`)

    return {
      success: true,
      data: data as CommunityPost
    }
  } catch (error) {
    console.error('Update post error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update post'
    }
  }
}

/**
 * 게시글 삭제 (soft delete)
 */
export async function deletePost(postId: string) {
  try {
    const supabase = await createClient()

    // 인증 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'LOGIN_REQUIRED',
        message: '로그인이 필요합니다.'
      }
    }

    const { error } = await supabase
      .from('community_posts')
      .update({ is_active: false })
      .eq('id', postId)
      .eq('user_id', user.id)

    if (error) throw error

    revalidatePath(`/community`)

    return { success: true }
  } catch (error) {
    console.error('Delete post error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete post'
    }
  }
}

/**
 * 댓글 작성
 */
export async function createComment(postId: string, content: string) {
  try {
    const supabase = await createClient()

    // 인증 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'LOGIN_REQUIRED',
        message: '로그인이 필요합니다.'
      }
    }

    // 사용자 닉네임 조회
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('nickname')
      .eq('user_id', user.id)
      .single()

    // 입력값 검증
    if (!content || content.trim().length === 0) {
      return {
        success: false,
        error: 'INVALID_CONTENT',
        message: '댓글 내용을 입력해주세요.'
      }
    }

    if (content.length > 1000) {
      return {
        success: false,
        error: 'CONTENT_TOO_LONG',
        message: '댓글은 1,000자를 초과할 수 없습니다.'
      }
    }

    const { data, error } = await supabase
      .from('community_comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: content.trim(),
        author_nickname: profile?.nickname || user.email?.split('@')[0] || '익명'
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/community`)

    return {
      success: true,
      data: data as Comment
    }
  } catch (error) {
    console.error('Create comment error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create comment'
    }
  }
}

/**
 * 댓글 삭제 (soft delete)
 */
export async function deleteComment(commentId: string) {
  try {
    const supabase = await createClient()

    // 인증 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'LOGIN_REQUIRED',
        message: '로그인이 필요합니다.'
      }
    }

    const { error } = await supabase
      .from('community_comments')
      .update({ is_active: false })
      .eq('id', commentId)
      .eq('user_id', user.id)

    if (error) throw error

    revalidatePath(`/community`)

    return { success: true }
  } catch (error) {
    console.error('Delete comment error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete comment'
    }
  }
}
