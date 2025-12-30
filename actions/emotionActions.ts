'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface EmotionRecordInput {
  emotionType: string
  intensity: number
  note?: string
}

/**
 * 감정 기록 저장
 * 로그인 사용자는 user_id로, 비로그인 사용자는 session_id로 저장
 */
export async function saveEmotionRecord(input: EmotionRecordInput) {
  try {
    const supabase = await createClient()

    // 현재 로그인한 사용자 확인
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'LOGIN_REQUIRED',
        message: '로그인이 필요합니다.'
      }
    }

    const { error } = await supabase
      .from('emotion_records')
      .insert({
        user_id: user.id,
        emotion_type: input.emotionType,
        intensity: input.intensity,
        note: input.note || null
      })

    if (error) throw error

    revalidatePath('/healing')

    return { success: true }
  } catch (error) {
    console.error('Save emotion record error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save emotion record'
    }
  }
}

/**
 * 사용자의 감정 기록 조회
 */
export async function getEmotionRecords(limit = 10) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: true, data: [] }
    }

    const { data, error } = await supabase
      .from('emotion_records')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

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
 * 현재 인증 상태 확인
 */
export async function checkAuthStatus() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return {
      success: true,
      isAuthenticated: !!user,
      user: user ? {
        id: user.id,
        email: user.email
      } : null
    }
  } catch (error) {
    console.error('Check auth status error:', error)
    return {
      success: false,
      isAuthenticated: false,
      user: null
    }
  }
}
