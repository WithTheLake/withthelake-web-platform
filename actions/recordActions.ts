'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 감정 기록 저장
 * Lazy Auth: 로그인 상태면 user_id로, 비로그인이면 session_id로 저장
 */
export async function saveEmotionRecord(formData: {
  emotion_type: string
  intensity: number
  note?: string
  session_id?: string
}) {
  try {
    const supabase = await createClient()

    // 사용자 인증 상태 확인
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const recordData = {
      emotion_type: formData.emotion_type,
      intensity: formData.intensity,
      note: formData.note || null,
      user_id: user?.id || null,
      session_id: formData.session_id || null,
    }

    const { data, error } = await supabase
      .from('emotion_records')
      .insert(recordData)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/record')
    revalidatePath('/mypage')

    return { success: true, data, requiresAuth: false }
  } catch (error) {
    console.error('Save emotion record error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save emotion record'
    }
  }
}

/**
 * 내 감정 기록 조회 (로그인 필수)
 */
export async function getMyEmotionRecords(limit = 50, offset = 0) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'login_required' }
    }

    const { data, error } = await supabase
      .from('emotion_records')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Get emotion records error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch emotion records'
    }
  }
}

/**
 * 걷기 세션 저장
 */
export async function saveWalkSession(formData: {
  audio_track_id?: string
  start_location?: { lat: number; lng: number }
  end_location?: { lat: number; lng: number }
  duration?: number
  session_id: string
}) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const sessionData = {
      user_id: user?.id || null,
      session_id: formData.session_id,
      audio_track_id: formData.audio_track_id || null,
      start_location: formData.start_location || null,
      end_location: formData.end_location || null,
      duration: formData.duration || null,
      started_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('walk_sessions')
      .insert(sessionData)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/mypage')

    return { success: true, data }
  } catch (error) {
    console.error('Save walk session error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save walk session'
    }
  }
}

/**
 * 내 걷기 세션 조회 (로그인 필수)
 */
export async function getMyWalkSessions(limit = 50, offset = 0) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'login_required' }
    }

    const { data, error } = await supabase
      .from('walk_sessions')
      .select('*, audio_tracks(*)')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Get walk sessions error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch walk sessions'
    }
  }
}
