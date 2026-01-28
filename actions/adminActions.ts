'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'

/**
 * 현재 로그인한 사용자가 대표(SUPER_ADMIN)인지 확인
 * 환경변수 SUPER_ADMIN_USER_ID와 비교
 */
export async function checkIsSuperAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const superAdminId = process.env.SUPER_ADMIN_USER_ID
  if (!superAdminId) return false

  return user.id === superAdminId
}

export type AdminMember = {
  id: string
  user_id: string
  nickname: string | null
  avatar_url: string | null
  age_group: string | null
  is_admin: boolean
  is_blocked: boolean
  total_walks: number
  total_duration: number
  created_at: string
  updated_at: string
  email?: string
  post_count?: number
  comment_count?: number
}

export type MemberDetail = AdminMember & {
  post_count: number
  comment_count: number
  is_banned: boolean
}

/**
 * 대시보드 통계 조회
 */
export async function getAdminStats() {
  const supabase = await createClient()

  // 관리자 권한 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: '로그인이 필요합니다.' }
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) {
    return { success: false, error: '관리자 권한이 필요합니다.' }
  }

  try {
    // 뉴스 수
    const { count: newsCount } = await supabase
      .from('news_articles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // 제품 수
    const { count: productCount } = await supabase
      .from('store_products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // 게시글 수
    const { count: postCount } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // 댓글 수
    const { count: commentCount } = await supabase
      .from('community_comments')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // 회원 수
    const { count: userCount } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    return {
      success: true,
      data: {
        newsCount: newsCount || 0,
        productCount: productCount || 0,
        postCount: postCount || 0,
        commentCount: commentCount || 0,
        userCount: userCount || 0,
      },
    }
  } catch (error) {
    console.error('통계 조회 실패:', error)
    return { success: false, error: '통계를 불러오는데 실패했습니다.' }
  }
}

/**
 * 최근 게시글 조회
 */
export async function getRecentPosts(limit = 5) {
  const supabase = await createClient()

  // 관리자 권한 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: '로그인이 필요합니다.', data: [] }
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) {
    return { success: false, error: '관리자 권한이 필요합니다.', data: [] }
  }

  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('id, title, board_type, author_nickname, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return {
      success: true,
      data: data || [],
    }
  } catch (error) {
    console.error('최근 게시글 조회 실패:', error)
    return { success: false, error: '게시글을 불러오는데 실패했습니다.', data: [] }
  }
}

/**
 * 최근 뉴스 조회
 */
export async function getRecentNews(limit = 5) {
  const supabase = await createClient()

  // 관리자 권한 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: '로그인이 필요합니다.', data: [] }
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) {
    return { success: false, error: '관리자 권한이 필요합니다.', data: [] }
  }

  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('id, title, source, category, published_at')
      .eq('is_active', true)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return {
      success: true,
      data: data || [],
    }
  } catch (error) {
    console.error('최근 뉴스 조회 실패:', error)
    return { success: false, error: '뉴스를 불러오는데 실패했습니다.', data: [] }
  }
}

/**
 * 회원 목록 조회 (관리자 전용)
 */
export async function getAdminMembers({
  search,
  filter,
  page = 1,
  limit = 20,
}: {
  search?: string
  filter?: 'all' | 'admin' | 'general'
  page?: number
  limit?: number
}): Promise<{ data: AdminMember[]; count: number }> {
  const supabase = await createClient()

  // 관리자 권한 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], count: 0 }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { data: [], count: 0 }

  try {
    let query = supabase
      .from('user_profiles')
      .select('*', { count: 'exact' })

    // 필터
    if (filter === 'admin') {
      query = query.eq('is_admin', true)
    } else if (filter === 'general') {
      query = query.eq('is_admin', false)
    }

    // 검색 (닉네임)
    if (search) {
      query = query.ilike('nickname', `%${search}%`)
    }

    // 정렬 및 페이지네이션
    query = query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    const { data, count, error } = await query

    if (error) throw error

    return {
      data: (data || []) as AdminMember[],
      count: count || 0,
    }
  } catch (error) {
    console.error('회원 목록 조회 실패:', error)
    return { data: [], count: 0 }
  }
}

/**
 * 회원 관리자 권한 토글 (대표 전용)
 * SUPER_ADMIN만 다른 회원의 관리자 권한을 변경할 수 있음
 */
export async function toggleMemberAdmin(targetUserId: string, isAdmin: boolean) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '로그인이 필요합니다.' }

  // 대표 권한 확인
  const isSuperAdmin = await checkIsSuperAdmin()
  if (!isSuperAdmin) {
    return { success: false, error: '대표만 관리자 권한을 변경할 수 있습니다.' }
  }

  // 자기 자신의 관리자 권한은 해제할 수 없음
  if (user.id === targetUserId && !isAdmin) {
    return { success: false, error: '자신의 관리자 권한은 해제할 수 없습니다.' }
  }

  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ is_admin: isAdmin })
      .eq('user_id', targetUserId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('관리자 권한 변경 실패:', error)
    return { success: false, error: '권한 변경에 실패했습니다.' }
  }
}

/**
 * SUPER_ADMIN의 user_id를 반환 (클라이언트에서 대표 뱃지 표시용)
 * 관리자만 조회 가능
 */
export async function getSuperAdminUserId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return null

  return process.env.SUPER_ADMIN_USER_ID || null
}

/**
 * 회원 상세 정보 조회 (게시글 수, 댓글 수 포함)
 * 관리자 전용
 */
export async function getMemberDetail(targetUserId: string): Promise<{ success: boolean; data?: MemberDetail; error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '로그인이 필요합니다.' }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { success: false, error: '관리자 권한이 필요합니다.' }

  try {
    // 프로필 조회
    const { data: memberProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', targetUserId)
      .single()

    if (profileError || !memberProfile) {
      return { success: false, error: '회원 정보를 찾을 수 없습니다.' }
    }

    // 게시글 수
    const { count: postCount } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', targetUserId)
      .eq('is_active', true)

    // 댓글 수
    const { count: commentCount } = await supabase
      .from('community_comments')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', targetUserId)
      .eq('is_active', true)

    // Auth 사용자 ban 상태 확인
    let isBanned = false
    try {
      const adminClient = createAdminClient()
      const { data: authUser } = await adminClient.auth.admin.getUserById(targetUserId)
      if (authUser?.user?.banned_until) {
        const bannedUntil = new Date(authUser.user.banned_until)
        isBanned = bannedUntil.getTime() > Date.now()
      }
    } catch {
      // service_role 키가 없으면 무시
    }

    return {
      success: true,
      data: {
        ...memberProfile,
        is_blocked: memberProfile.is_blocked ?? false,
        is_banned: isBanned,
        post_count: postCount || 0,
        comment_count: commentCount || 0,
      } as MemberDetail,
    }
  } catch (error) {
    console.error('회원 상세 조회 실패:', error)
    return { success: false, error: '회원 정보를 불러오는데 실패했습니다.' }
  }
}

/**
 * 회원 차단/해제 (관리자 전용)
 * 차단된 회원은 글쓰기/댓글 작성이 제한됨
 */
export async function toggleMemberBlock(targetUserId: string, isBlocked: boolean) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '로그인이 필요합니다.' }

  // 관리자 권한 확인
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) {
    return { success: false, error: '관리자 권한이 필요합니다.' }
  }

  // 대표/관리자는 차단 불가
  const superAdminId = process.env.SUPER_ADMIN_USER_ID
  if (targetUserId === superAdminId) {
    return { success: false, error: '대표는 차단할 수 없습니다.' }
  }

  const { data: targetProfile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', targetUserId)
    .single()

  if (targetProfile?.is_admin) {
    return { success: false, error: '관리자는 차단할 수 없습니다. 먼저 관리자 권한을 해제하세요.' }
  }

  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ is_blocked: isBlocked })
      .eq('user_id', targetUserId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('회원 차단 상태 변경 실패:', error)
    return { success: false, error: '차단 상태 변경에 실패했습니다.' }
  }
}

/**
 * 회원 강퇴 (관리자 전용)
 * Supabase Auth ban을 통해 로그인 자체를 차단
 * 같은 카카오 계정으로 재가입 불가
 */
export async function banMember(targetUserId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '로그인이 필요합니다.' }

  // 관리자 권한 확인
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) {
    return { success: false, error: '관리자 권한이 필요합니다.' }
  }

  // 대표는 강퇴 불가
  const superAdminId = process.env.SUPER_ADMIN_USER_ID
  if (targetUserId === superAdminId) {
    return { success: false, error: '대표는 강퇴할 수 없습니다.' }
  }

  // 관리자는 강퇴 불가 (먼저 권한 해제 필요)
  const { data: targetProfile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', targetUserId)
    .single()

  if (targetProfile?.is_admin) {
    return { success: false, error: '관리자는 강퇴할 수 없습니다. 먼저 관리자 권한을 해제하세요.' }
  }

  try {
    const adminClient = createAdminClient()

    // Supabase Auth에서 사용자 ban (영구: 100년)
    const { error: banError } = await adminClient.auth.admin.updateUserById(targetUserId, {
      ban_duration: '876600h',
    })

    if (banError) throw banError

    // user_profiles에도 차단 표시
    await supabase
      .from('user_profiles')
      .update({ is_blocked: true })
      .eq('user_id', targetUserId)

    return { success: true }
  } catch (error) {
    console.error('회원 강퇴 실패:', error)
    return { success: false, error: '강퇴 처리에 실패했습니다.' }
  }
}

/**
 * 회원 강퇴 해제 (관리자 전용)
 * Supabase Auth ban 해제 → 로그인 다시 가능
 */
export async function unbanMember(targetUserId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: '로그인이 필요합니다.' }

  // 관리자 권한 확인
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) {
    return { success: false, error: '관리자 권한이 필요합니다.' }
  }

  try {
    const adminClient = createAdminClient()

    // Supabase Auth ban 해제
    const { error: unbanError } = await adminClient.auth.admin.updateUserById(targetUserId, {
      ban_duration: 'none',
    })

    if (unbanError) throw unbanError

    // user_profiles 차단도 해제
    await supabase
      .from('user_profiles')
      .update({ is_blocked: false })
      .eq('user_id', targetUserId)

    return { success: true }
  } catch (error) {
    console.error('강퇴 해제 실패:', error)
    return { success: false, error: '강퇴 해제에 실패했습니다.' }
  }
}
