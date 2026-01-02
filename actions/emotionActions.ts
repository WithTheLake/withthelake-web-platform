'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { PRE_EMOTIONS } from '@/types/emotion'

interface EmotionRecordInput {
  emotionType: string
  intensity: number
  note?: string
}

// 유효한 감정 타입 목록
const VALID_EMOTION_TYPES = PRE_EMOTIONS.map(e => e.type)

/**
 * 감정 기록 저장
 * 로그인 사용자는 user_id로, 비로그인 사용자는 session_id로 저장
 */
export async function saveEmotionRecord(input: EmotionRecordInput) {
  try {
    // 입력값 검증
    if (!input.emotionType || typeof input.emotionType !== 'string') {
      return {
        success: false,
        error: 'INVALID_INPUT',
        message: '감정 유형이 필요합니다.'
      }
    }

    if (!VALID_EMOTION_TYPES.includes(input.emotionType)) {
      return {
        success: false,
        error: 'INVALID_EMOTION_TYPE',
        message: '유효하지 않은 감정 유형입니다.'
      }
    }

    if (typeof input.intensity !== 'number' || input.intensity < 1 || input.intensity > 5) {
      return {
        success: false,
        error: 'INVALID_INTENSITY',
        message: '감정 강도는 1-5 사이의 숫자여야 합니다.'
      }
    }

    if (input.note && typeof input.note !== 'string') {
      return {
        success: false,
        error: 'INVALID_NOTE',
        message: '메모는 문자열이어야 합니다.'
      }
    }

    // note 길이 제한 (최대 2000자)
    if (input.note && input.note.length > 2000) {
      return {
        success: false,
        error: 'NOTE_TOO_LONG',
        message: '메모는 2000자를 초과할 수 없습니다.'
      }
    }

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
    // limit 검증 (1-100 사이)
    const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 100)

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
      .limit(safeLimit)

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
 * 주간 감정 기록 조회 (보고서용)
 */
export async function getWeeklyEmotionRecords() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'LOGIN_REQUIRED', data: [] }
    }

    // 7일 전 날짜 계산
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    weekAgo.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('emotion_records')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', weekAgo.toISOString())
      .order('created_at', { ascending: true })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Get weekly emotion records error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch weekly records',
      data: []
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
