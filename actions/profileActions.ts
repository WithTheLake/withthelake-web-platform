'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 관리자 여부 확인
 */
export async function checkIsAdmin(): Promise<{ isAdmin: boolean; userId: string | null }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { isAdmin: false, userId: null }
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    return {
      isAdmin: profile?.is_admin === true,
      userId: user.id
    }
  } catch (error) {
    console.error('Check admin error:', error)
    return { isAdmin: false, userId: null }
  }
}

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
  gender?: string
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

    const profileData: Record<string, string | null> = {
      user_id: user.id,
      nickname: formData.nickname || null,
      gender: formData.gender || null,
      age_group: formData.age_group || null,
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