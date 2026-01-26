'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * 30일이 지난 soft-deleted 데이터를 hard delete
 * Vercel Cron에서 매일 호출
 */
export async function cleanupOldDeletedData() {
  try {
    const supabase = await createClient()

    // 30일 전 날짜 계산
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const cutoffDate = thirtyDaysAgo.toISOString()

    const results = {
      community_posts: 0,
      community_comments: 0,
      errors: [] as string[]
    }

    // 1. 커뮤니티 댓글 삭제 (게시글보다 먼저 삭제해야 FK 문제 없음)
    const { data: deletedComments, error: commentsError } = await supabase
      .from('community_comments')
      .delete()
      .eq('is_active', false)
      .lt('updated_at', cutoffDate)
      .select('id')

    if (commentsError) {
      results.errors.push(`Comments error: ${commentsError.message}`)
    } else {
      results.community_comments = deletedComments?.length || 0
    }

    // 2. 커뮤니티 게시글 삭제
    const { data: deletedPosts, error: postsError } = await supabase
      .from('community_posts')
      .delete()
      .eq('is_active', false)
      .lt('updated_at', cutoffDate)
      .select('id')

    if (postsError) {
      results.errors.push(`Posts error: ${postsError.message}`)
    } else {
      results.community_posts = deletedPosts?.length || 0
    }

    console.log('[Cleanup] Results:', results)

    return {
      success: true,
      message: `Cleanup completed: ${results.community_posts} posts, ${results.community_comments} comments deleted`,
      details: results
    }
  } catch (error) {
    console.error('[Cleanup] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Cleanup failed'
    }
  }
}

/**
 * 삭제 대기 중인 데이터 현황 조회 (관리자용)
 */
export async function getPendingDeletionStats() {
  try {
    const supabase = await createClient()

    // 삭제 대기 중인 게시글 수
    const { count: postsCount } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', false)

    // 삭제 대기 중인 댓글 수
    const { count: commentsCount } = await supabase
      .from('community_comments')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', false)

    // 30일 이상된 삭제 대기 데이터
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const cutoffDate = thirtyDaysAgo.toISOString()

    const { count: oldPostsCount } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', false)
      .lt('updated_at', cutoffDate)

    const { count: oldCommentsCount } = await supabase
      .from('community_comments')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', false)
      .lt('updated_at', cutoffDate)

    return {
      success: true,
      data: {
        pending: {
          posts: postsCount || 0,
          comments: commentsCount || 0
        },
        readyForDeletion: {
          posts: oldPostsCount || 0,
          comments: oldCommentsCount || 0
        }
      }
    }
  } catch (error) {
    console.error('[Cleanup Stats] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get stats'
    }
  }
}
