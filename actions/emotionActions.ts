'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { PRE_EMOTIONS, HELPFUL_ACTIONS, POSITIVE_CHANGES } from '@/types/emotion'

/**
 * EAMRA 프레임워크 기반 감정 기록 입력
 * E: Emotion (감정)
 * M: Meaning (의미)
 * A: Action (행동)
 * R: Reflect (성찰)
 * A: Anchor (고정)
 */
interface EmotionRecordInput {
  // E. Emotion: 걷기 전 감정
  emotionType: string

  // M. Meaning: 감정의 이유
  emotionReason: string

  // A. Action: 도움이 된 행동들
  helpfulActions: string[]

  // R. Reflect: 긍정적 변화들
  positiveChanges: string[]

  // A. Anchor: 나를 위한 한마디
  selfMessage: string

  // 체험 장소 (선택)
  experienceLocation?: string
}

// 유효한 감정 타입 목록
const VALID_EMOTION_TYPES: readonly string[] = PRE_EMOTIONS.map(e => e.type)

// 유효한 행동 목록
const VALID_ACTIONS: readonly string[] = HELPFUL_ACTIONS.map(a => a.type)

// 유효한 변화 목록
const VALID_CHANGES: readonly string[] = POSITIVE_CHANGES.map(c => c.type)

/**
 * 감정 기록 저장 (EAMRA 프레임워크)
 */
export async function saveEmotionRecord(input: EmotionRecordInput) {
  try {
    // E. Emotion 검증
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

    // M. Meaning 검증
    if (!input.emotionReason || typeof input.emotionReason !== 'string') {
      return {
        success: false,
        error: 'INVALID_REASON',
        message: '감정의 이유가 필요합니다.'
      }
    }

    if (input.emotionReason.length > 2000) {
      return {
        success: false,
        error: 'REASON_TOO_LONG',
        message: '감정 이유는 2000자를 초과할 수 없습니다.'
      }
    }

    // A. Action 검증
    if (!Array.isArray(input.helpfulActions) || input.helpfulActions.length === 0) {
      return {
        success: false,
        error: 'INVALID_ACTIONS',
        message: '도움이 된 행동을 선택해주세요.'
      }
    }

    const invalidActions = input.helpfulActions.filter(a => !VALID_ACTIONS.includes(a))
    if (invalidActions.length > 0) {
      return {
        success: false,
        error: 'INVALID_ACTION_TYPE',
        message: '유효하지 않은 행동이 포함되어 있습니다.'
      }
    }

    // R. Reflect 검증
    if (!Array.isArray(input.positiveChanges) || input.positiveChanges.length === 0) {
      return {
        success: false,
        error: 'INVALID_CHANGES',
        message: '긍정적 변화를 선택해주세요.'
      }
    }

    const invalidChanges = input.positiveChanges.filter(c => !VALID_CHANGES.includes(c))
    if (invalidChanges.length > 0) {
      return {
        success: false,
        error: 'INVALID_CHANGE_TYPE',
        message: '유효하지 않은 변화가 포함되어 있습니다.'
      }
    }

    // A. Anchor 검증
    if (!input.selfMessage || typeof input.selfMessage !== 'string') {
      return {
        success: false,
        error: 'INVALID_MESSAGE',
        message: '나를 위한 한마디가 필요합니다.'
      }
    }

    if (input.selfMessage.length > 500) {
      return {
        success: false,
        error: 'MESSAGE_TOO_LONG',
        message: '나를 위한 한마디는 500자를 초과할 수 없습니다.'
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
        emotion_reason: input.emotionReason,
        helpful_actions: input.helpfulActions,
        positive_changes: input.positiveChanges,
        self_message: input.selfMessage,
        experience_location: input.experienceLocation || null,
      })

    if (error) throw error

    revalidatePath('/healing')
    revalidatePath('/mypage')

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
 * 지난 주 월요일 00:00:00 ~ 일요일 23:59:59 범위의 기록을 조회
 */
export async function getWeeklyEmotionRecords() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'LOGIN_REQUIRED', data: [], weekStart: null, weekEnd: null }
    }

    // 이번 주 월요일 계산
    const now = new Date()
    const dayOfWeek = now.getDay() // 0=일, 1=월, ..., 6=토
    const diffToThisMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    const thisMonday = new Date(now)
    thisMonday.setDate(now.getDate() - diffToThisMonday)
    thisMonday.setHours(0, 0, 0, 0)

    // 지난 주 월요일 00:00:00 계산 (이번 주 월요일 - 7일)
    const lastMonday = new Date(thisMonday)
    lastMonday.setDate(thisMonday.getDate() - 7)

    // 지난 주 일요일 23:59:59 계산 (지난 주 월요일 + 6일)
    const lastSunday = new Date(lastMonday)
    lastSunday.setDate(lastMonday.getDate() + 6)
    lastSunday.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
      .from('emotion_records')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', lastMonday.toISOString())
      .lte('created_at', lastSunday.toISOString())
      .order('created_at', { ascending: true })

    if (error) throw error

    return {
      success: true,
      data: data || [],
      weekStart: lastMonday,
      weekEnd: lastSunday
    }
  } catch (error) {
    console.error('Get weekly emotion records error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch weekly records',
      data: [],
      weekStart: null,
      weekEnd: null
    }
  }
}

/**
 * 이번 주 감정 기록 조회 (테스트용)
 * 이번 주 월요일 00:00:00 ~ 현재 시각 범위의 기록을 조회
 */
export async function getCurrentWeekEmotionRecords() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'LOGIN_REQUIRED', data: [], weekStart: null, weekEnd: null }
    }

    // 이번 주 월요일 00:00:00 계산
    const now = new Date()
    const dayOfWeek = now.getDay() // 0=일, 1=월, ..., 6=토
    const diffToThisMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    const thisMonday = new Date(now)
    thisMonday.setDate(now.getDate() - diffToThisMonday)
    thisMonday.setHours(0, 0, 0, 0)

    // 이번 주 일요일 23:59:59 계산
    const thisSunday = new Date(thisMonday)
    thisSunday.setDate(thisMonday.getDate() + 6)
    thisSunday.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
      .from('emotion_records')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', thisMonday.toISOString())
      .lte('created_at', thisSunday.toISOString())
      .order('created_at', { ascending: true })

    if (error) throw error

    return {
      success: true,
      data: data || [],
      weekStart: thisMonday,
      weekEnd: thisSunday
    }
  } catch (error) {
    console.error('Get current week emotion records error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch current week records',
      data: [],
      weekStart: null,
      weekEnd: null
    }
  }
}

/**
 * 감정 기록 페이지네이션 조회
 */
export async function getEmotionRecordsPaginated(page = 1, pageSize = 20) {
  try {
    const safePage = Math.max(1, Math.floor(page))
    const safePageSize = Math.min(Math.max(1, Math.floor(pageSize)), 50)
    const offset = (safePage - 1) * safePageSize

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: true, data: [], totalCount: 0, totalPages: 0 }
    }

    // 전체 개수 조회
    const { count, error: countError } = await supabase
      .from('emotion_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (countError) throw countError

    // 페이지 데이터 조회
    const { data, error } = await supabase
      .from('emotion_records')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + safePageSize - 1)

    if (error) throw error

    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / safePageSize)

    return {
      success: true,
      data: data || [],
      totalCount,
      totalPages,
      currentPage: safePage
    }
  } catch (error) {
    console.error('Get paginated emotion records error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch emotion records',
      data: [],
      totalCount: 0,
      totalPages: 0
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
