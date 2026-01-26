'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'
import { updateProductRating } from './storeActions'

export type BoardType = 'notice' | 'event' | 'free' | 'review'
export type FreeBoardTopic = 'chat' | 'question' | 'info' | 'review'

// JOIN된 상품 정보 타입
export interface ProductInfo {
  id: string
  name: string
  image_url: string | null
  rating: number
  review_count: number
}

export interface CommunityPost {
  id: string
  user_id: string | null
  board_type: BoardType
  topic: FreeBoardTopic | null
  title: string
  content: string
  thumbnail_url: string | null
  images: string[] | null
  author_nickname: string | null
  view_count: number
  comment_count: number
  is_pinned: boolean
  is_active: boolean
  // 후기 게시판 전용 필드
  rating: number | null
  product_id: string | null
  product?: ProductInfo | null  // JOIN된 상품 정보
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

export type SearchType = 'all' | 'title' | 'author'
export type SortBy = 'newest' | 'rating_high' | 'rating_low'

// 이전/다음 게시글 타입
export interface AdjacentPost {
  id: string
  title: string
  content?: string  // 후기 게시판에서만 사용 (제목 대신 본문 첫 줄 표시)
}

interface GetPostsOptions {
  page?: number
  limit?: number
  search?: string
  searchType?: SearchType
  topic?: FreeBoardTopic
  sortBy?: SortBy  // 정렬 옵션 (기본: newest)
}

/**
 * 게시글 목록 조회 (검색 기능 포함)
 */
export async function getPosts(boardType: BoardType, options: GetPostsOptions = {}) {
  const { page = 1, limit = 20, search = '', searchType = 'all', topic, sortBy = 'newest' } = options

  try {
    const supabase = await createClient()

    const offset = (page - 1) * limit
    const searchTerm = search.trim()

    // 리뷰 게시판일 경우 상품 정보를 JOIN
    const selectFields = boardType === 'review'
      ? '*, product:store_products(id, name, image_url, rating, review_count)'
      : '*'

    // 기본 쿼리 조건
    let countQuery = supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('board_type', boardType)
      .eq('is_active', true)

    let dataQuery = supabase
      .from('community_posts')
      .select(selectFields)
      .eq('board_type', boardType)
      .eq('is_active', true)

    // 주제 필터 (자유게시판용)
    if (topic) {
      countQuery = countQuery.eq('topic', topic)
      dataQuery = dataQuery.eq('topic', topic)
    }

    // 검색 조건 적용
    if (searchTerm) {
      switch (searchType) {
        case 'title':
          // 제목만 검색
          countQuery = countQuery.ilike('title', `%${searchTerm}%`)
          dataQuery = dataQuery.ilike('title', `%${searchTerm}%`)
          break
        case 'author':
          // 작성자 검색
          countQuery = countQuery.ilike('author_nickname', `%${searchTerm}%`)
          dataQuery = dataQuery.ilike('author_nickname', `%${searchTerm}%`)
          break
        case 'all':
        default:
          // 전체 검색 (제목 + 내용)
          countQuery = countQuery.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
          dataQuery = dataQuery.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
          break
      }
    }

    // 총 게시글 수 조회 (페이지네이션용)
    const { count } = await countQuery

    // 정렬 조건 적용
    // 고정 글은 항상 최상단
    dataQuery = dataQuery.order('is_pinned', { ascending: false })

    // 정렬 옵션에 따른 추가 정렬
    if (boardType === 'review' && sortBy !== 'newest') {
      // 후기 게시판에서 평점순 정렬
      if (sortBy === 'rating_high') {
        dataQuery = dataQuery.order('rating', { ascending: false })
      } else if (sortBy === 'rating_low') {
        dataQuery = dataQuery.order('rating', { ascending: true })
      }
      // 같은 평점일 경우 최신순
      dataQuery = dataQuery.order('created_at', { ascending: false })
    } else {
      // 기본: 최신순
      dataQuery = dataQuery.order('created_at', { ascending: false })
    }

    const { data, error } = await dataQuery.range(offset, offset + limit - 1)

    if (error) throw error

    return {
      success: true,
      data: data as unknown as CommunityPost[],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Get posts error:', JSON.stringify(error, null, 2))
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
  noStore() // 캐싱 비활성화

  try {
    const supabase = await createClient()

    // 게시글 조회
    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .select('*')
      .eq('id', postId)
      .eq('is_active', true)
      .single()

    // 게시글이 없거나 삭제된 경우
    if (postError?.code === 'PGRST116' || !post) {
      return {
        success: false,
        error: 'NOT_FOUND',
        message: '삭제되었거나 존재하지 않는 게시글입니다.'
      }
    }
    if (postError) throw postError

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

    // 사용자 프로필 조회 (닉네임 + 관리자 여부)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('nickname, is_admin')
      .eq('user_id', user.id)
      .single()

    const boardType = formData.get('board_type') as BoardType

    // 공지사항/이벤트 게시판은 관리자만 작성 가능
    if ((boardType === 'notice' || boardType === 'event') && !profile?.is_admin) {
      return {
        success: false,
        error: 'ADMIN_ONLY',
        message: '관리자만 작성할 수 있는 게시판입니다.'
      }
    }
    const topic = formData.get('topic') as FreeBoardTopic | null
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const thumbnailUrl = formData.get('thumbnail_url') as string | null
    const imagesJson = formData.get('images') as string | null
    const images = imagesJson ? JSON.parse(imagesJson) : null

    // 후기 게시판 전용 필드
    const ratingStr = formData.get('rating') as string | null
    const rating = ratingStr ? parseFloat(ratingStr) : null
    const productId = formData.get('product_id') as string | null

    // 입력값 검증
    if (!boardType || !['notice', 'event', 'free', 'review'].includes(boardType)) {
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

    // 후기 게시판 유효성 검사
    if (boardType === 'review') {
      // 평점은 1~5 사이, 0.5 단위만 허용
      const isValidRating = rating && rating >= 1 && rating <= 5 && (rating * 2) % 1 === 0
      if (!isValidRating) {
        return {
          success: false,
          error: 'INVALID_RATING',
          message: '평점을 선택해주세요. (1~5점, 0.5 단위)'
        }
      }
      if (!productId) {
        return {
          success: false,
          error: 'INVALID_PRODUCT',
          message: '리뷰할 상품을 선택해주세요.'
        }
      }
    }

    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        board_type: boardType,
        topic: boardType === 'free' ? (topic || 'chat') : null,
        title: title.trim(),
        content: content.trim(),
        thumbnail_url: thumbnailUrl || null,
        images: images || null,
        author_nickname: profile?.nickname || user.email?.split('@')[0] || '익명',
        // 후기 게시판 전용 필드
        rating: boardType === 'review' ? rating : null,
        product_id: boardType === 'review' ? productId : null
      })
      .select()
      .single()

    if (error) throw error

    // 후기 게시판인 경우 상품 평점 업데이트
    if (boardType === 'review' && productId) {
      await updateProductRating(productId)
    }

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
    const topic = formData.get('topic') as FreeBoardTopic | null
    const thumbnailUrl = formData.get('thumbnail_url') as string | null
    const imagesJson = formData.get('images') as string | null
    const images = imagesJson ? JSON.parse(imagesJson) : null

    // 후기 게시판 전용 필드
    const ratingStr = formData.get('rating') as string | null
    const rating = ratingStr ? parseFloat(ratingStr) : null
    const productId = formData.get('product_id') as string | null

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

    // 기존 게시글 정보 조회 (board_type, product_id 확인용)
    const { data: existingPost } = await supabase
      .from('community_posts')
      .select('board_type, product_id')
      .eq('id', postId)
      .single()

    const boardType = existingPost?.board_type as BoardType | undefined

    // topic이 있으면 함께 업데이트
    const updateData: Record<string, unknown> = {
      title: title.trim(),
      content: content.trim(),
      thumbnail_url: thumbnailUrl,
      images: images
    }
    if (topic) {
      updateData.topic = topic
    }

    // 후기 게시판인 경우 rating, product_id 업데이트
    if (boardType === 'review') {
      if (rating !== null) {
        updateData.rating = rating
      }
      if (productId !== null) {
        updateData.product_id = productId
      }
    }

    const { data, error } = await supabase
      .from('community_posts')
      .update(updateData)
      .eq('id', postId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    // 후기 게시판인 경우 상품 평점 업데이트
    if (boardType === 'review') {
      // 기존 상품과 새 상품 모두 업데이트
      const oldProductId = existingPost?.product_id
      if (oldProductId && oldProductId !== productId) {
        await updateProductRating(oldProductId)
      }
      if (productId) {
        await updateProductRating(productId)
      }
    }

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
 * - 본인 글: 삭제 가능
 * - 관리자: 모든 글 삭제 가능
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

    // 사용자 프로필 조회 (관리자 여부 확인)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    const isAdmin = profile?.is_admin === true

    // 게시글 정보 확인 (product_id 포함)
    const { data: post } = await supabase
      .from('community_posts')
      .select('user_id, board_type, product_id')
      .eq('id', postId)
      .single()

    if (!post) {
      return {
        success: false,
        error: 'POST_NOT_FOUND',
        message: '게시글을 찾을 수 없습니다.'
      }
    }

    // 권한 확인: 본인 글이거나 관리자
    if (post.user_id !== user.id && !isAdmin) {
      return {
        success: false,
        error: 'PERMISSION_DENIED',
        message: '본인이 작성한 글만 삭제할 수 있습니다.'
      }
    }

    // 관리자는 모든 글 삭제 가능, 일반 사용자는 본인 글만
    const query = supabase
      .from('community_posts')
      .update({ is_active: false })
      .eq('id', postId)

    if (!isAdmin) {
      query.eq('user_id', user.id)
    }

    const { error } = await query

    if (error) throw error

    // 후기 게시판인 경우 상품 평점 업데이트
    if (post.board_type === 'review' && post.product_id) {
      await updateProductRating(post.product_id)
    }

    revalidatePath(`/community`)
    revalidatePath(`/community/${post.board_type}`)

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
 * 게시글 고정/해제 (관리자 전용)
 */
export async function togglePinPost(postId: string) {
  console.log('[togglePinPost] 시작, postId:', postId)

  try {
    const supabase = await createClient()

    // 인증 확인
    const { data: { user } } = await supabase.auth.getUser()
    console.log('[togglePinPost] user:', user?.id)

    if (!user) {
      return {
        success: false,
        error: 'LOGIN_REQUIRED',
        message: '로그인이 필요합니다.'
      }
    }

    // 관리자 여부 확인
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    console.log('[togglePinPost] profile:', profile, 'error:', profileError)

    if (!profile?.is_admin) {
      return {
        success: false,
        error: 'ADMIN_ONLY',
        message: '관리자만 게시글을 고정할 수 있습니다.'
      }
    }

    // 현재 게시글 상태 확인
    const { data: post, error: fetchError } = await supabase
      .from('community_posts')
      .select('is_pinned, board_type')
      .eq('id', postId)
      .single()

    console.log('[togglePinPost] 현재 게시글:', post, 'error:', fetchError)

    if (fetchError || !post) {
      return {
        success: false,
        error: 'POST_NOT_FOUND',
        message: '게시글을 찾을 수 없습니다.'
      }
    }

    // 고정 상태 토글
    const newPinnedState = !post.is_pinned
    console.log('[togglePinPost] 고정 상태 변경:', post.is_pinned, '->', newPinnedState)

    const { data: updateData, error: updateError } = await supabase
      .from('community_posts')
      .update({ is_pinned: newPinnedState })
      .eq('id', postId)
      .select()

    console.log('[togglePinPost] 업데이트 결과:', updateData, 'error:', updateError)

    if (updateError) throw updateError

    revalidatePath(`/community`)
    revalidatePath(`/community/${post.board_type}`)
    revalidatePath(`/community/${post.board_type}/${postId}`)

    console.log('[togglePinPost] 완료, isPinned:', newPinnedState)

    return {
      success: true,
      isPinned: newPinnedState
    }
  } catch (error) {
    console.error('[togglePinPost] 에러:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle pin post'
    }
  }
}

/**
 * 현재 로그인한 사용자 ID 조회
 */
export async function getCurrentUserId() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id || null
  } catch {
    return null
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

    // 게시글의 comment_count 증가
    await supabase.rpc('increment_comment_count', { post_id: postId })

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
 * - 본인 댓글: 삭제 가능
 * - 관리자: 모든 댓글 삭제 가능
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

    // 사용자 프로필 조회 (관리자 여부 확인)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    const isAdmin = profile?.is_admin === true

    // 먼저 댓글의 post_id와 user_id를 조회
    const { data: comment } = await supabase
      .from('community_comments')
      .select('post_id, user_id')
      .eq('id', commentId)
      .single()

    if (!comment) {
      return {
        success: false,
        error: 'COMMENT_NOT_FOUND',
        message: '댓글을 찾을 수 없습니다.'
      }
    }

    // 권한 확인: 본인 댓글이거나 관리자
    if (comment.user_id !== user.id && !isAdmin) {
      return {
        success: false,
        error: 'PERMISSION_DENIED',
        message: '본인이 작성한 댓글만 삭제할 수 있습니다.'
      }
    }

    // 관리자는 모든 댓글 삭제 가능, 일반 사용자는 본인 댓글만
    const query = supabase
      .from('community_comments')
      .update({ is_active: false })
      .eq('id', commentId)

    if (!isAdmin) {
      query.eq('user_id', user.id)
    }

    const { error } = await query

    if (error) throw error

    // 게시글의 comment_count 감소
    await supabase.rpc('decrement_comment_count', { post_id: comment.post_id })

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

/**
 * 이전글/다음글 조회
 * - 후기 게시판: content도 포함 (제목 대신 본문 첫 줄 표시용)
 */
export async function getAdjacentPosts(postId: string, boardType: BoardType): Promise<{
  success: boolean
  error?: string
  prevPost: AdjacentPost | null
  nextPost: AdjacentPost | null
}> {
  try {
    const supabase = await createClient()

    // 현재 게시글의 created_at 조회
    const { data: currentPost, error: currentError } = await supabase
      .from('community_posts')
      .select('created_at')
      .eq('id', postId)
      .single()

    if (currentError) throw currentError
    if (!currentPost) {
      return { success: false, error: 'Post not found', prevPost: null, nextPost: null }
    }

    // 후기 게시판은 content도 조회 (제목 대신 본문 첫 줄 표시)
    const selectFields = boardType === 'review' ? 'id, title, content' : 'id, title'

    // 이전글 (현재 글보다 오래된 글 중 가장 최신)
    const { data: prevPost } = await supabase
      .from('community_posts')
      .select(selectFields)
      .eq('board_type', boardType)
      .eq('is_active', true)
      .lt('created_at', currentPost.created_at)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // 다음글 (현재 글보다 최신 글 중 가장 오래된)
    const { data: nextPost } = await supabase
      .from('community_posts')
      .select(selectFields)
      .eq('board_type', boardType)
      .eq('is_active', true)
      .gt('created_at', currentPost.created_at)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    return {
      success: true,
      prevPost: (prevPost as unknown as AdjacentPost) || null,
      nextPost: (nextPost as unknown as AdjacentPost) || null
    }
  } catch (error) {
    console.error('Get adjacent posts error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch adjacent posts',
      prevPost: null,
      nextPost: null
    }
  }
}
