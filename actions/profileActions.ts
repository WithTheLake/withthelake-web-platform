'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 내 프로필 조회 (로그인 필수)
 */
export async function getMyProfile() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'login_required' }
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = row not found (프로필이 없는 경우)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Get profile error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch profile'
    }
  }
}

/**
 * 프로필 생성 또는 업데이트
 */
export async function upsertProfile(formData: {
  nickname?: string
  age_group?: string
}) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'login_required' }
    }

    const profileData = {
      user_id: user.id,
      nickname: formData.nickname,
      age_group: formData.age_group,
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/mypage')

    return { success: true, data }
  } catch (error) {
    console.error('Upsert profile error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile'
    }
  }
}

/**
 * 걷기 통계 업데이트 (걷기 세션 완료 시 호출)
 */
export async function updateWalkStats(duration: number) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'login_required' }
    }

    // 현재 프로필 조회
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('total_walks, total_duration')
      .eq('user_id', user.id)
      .single()

    const updatedData = {
      user_id: user.id,
      total_walks: (profile?.total_walks || 0) + 1,
      total_duration: (profile?.total_duration || 0) + duration,
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(updatedData, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/mypage')

    return { success: true, data }
  } catch (error) {
    console.error('Update walk stats error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update walk stats'
    }
  }
}
