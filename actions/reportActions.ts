'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import {
  analyzeEmotionData,
  generateFallbackInsight,
  EMOTION_LABELS,
  ACTION_LABELS,
  CHANGE_LABELS,
} from '@/lib/utils/emotionAnalysis'

/**
 * EAMRA 프레임워크 기반 감정 기록 타입
 */
interface EmotionRecord {
  id: string
  emotion_type: string
  emotion_reason: string | null
  helpful_actions: string[] | null
  positive_changes: string[] | null
  self_message: string | null
  experience_location: string | null
  note: string | null // 하위 호환성
  created_at: string
}

/**
 * AI를 사용하여 감정 보고서 인사이트 생성 (Gemini)
 */
export async function generateEmotionInsight(records: EmotionRecord[]) {
  try {
    if (records.length === 0) {
      return {
        success: true,
        insight: '이번 주에는 아직 기록된 감정이 없습니다. 힐링로드 ON에서 매일 감정을 기록해보세요!',
      }
    }

    const analysis = analyzeEmotionData(records)

    // Gemini API 키 확인
    if (!process.env.GEMINI_API_KEY) {
      return {
        success: true,
        insight: generateFallbackInsight(analysis),
      }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    // 2025년 12월 기준 최신 모델: gemini-2.5-flash (무료 티어: 일 250회)
    // 더 높은 품질이 필요하면 gemini-2.5-pro (무료 티어: 일 100회) 사용 가능
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // 감정 요약 텍스트 생성 (EAMRA - intensity 없음)
    const emotionSummaryText = analysis.summary
      .map((e) => `${e.label}(${e.emoji}): ${e.count}회`)
      .join('\n')

    // 감정 이유 텍스트 (EAMRA - M. Meaning)
    const reasonsText = records
      .filter((r) => r.emotion_reason)
      .map((r) => `- ${EMOTION_LABELS[r.emotion_type]?.label || r.emotion_type}: "${r.emotion_reason}"`)
      .slice(0, 5)
      .join('\n')

    // 도움이 된 행동 통계 (EAMRA - A. Action, 복수 선택)
    const actionStats: Record<string, number> = {}
    records.forEach((r) => {
      if (r.helpful_actions) {
        r.helpful_actions.forEach((action) => {
          actionStats[action] = (actionStats[action] || 0) + 1
        })
      }
    })
    const topActions = Object.entries(actionStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([action, count]) => `${ACTION_LABELS[action] || action}: ${count}회`)
      .join(', ')

    // 긍정적 변화 통계 (EAMRA - R. Reflect, 복수 선택)
    const changeStats: Record<string, number> = {}
    records.forEach((r) => {
      if (r.positive_changes) {
        r.positive_changes.forEach((change) => {
          changeStats[change] = (changeStats[change] || 0) + 1
        })
      }
    })
    const topChanges = Object.entries(changeStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([change]) => CHANGE_LABELS[change]?.label || change)
      .join(', ')

    // 나를 위한 한마디 모음
    const selfMessages = records
      .filter((r) => r.self_message)
      .map((r) => `"${r.self_message}"`)
      .slice(0, 3)
      .join(' / ')

    // 프롬프트 엔지니어링 (Gemini 최적화) - 더 풍부한 인사이트 생성
    const prompt = `# 역할
당신은 15년 경력의 임상심리 전문가이자, 40-70대 시니어를 위한 정서 웰니스 코치입니다.
당신의 역할은 사용자의 감정 기록 데이터를 깊이 있게 분석하고, 따뜻하면서도 전문적인 주간 감정 보고서를 작성하는 것입니다.

# 서비스 배경
- 서비스명: 힐링로드 ON (맨발걷기 웰니스 플랫폼)
- 대상: 맨발걷기를 통해 심신 건강을 가꾸는 액티브 시니어
- 목적: 감정을 인식하고 표현하는 습관을 통해 정서적 건강 증진

# 지난 주 감정 기록 데이터

## 📊 기본 통계
- 총 기록 횟수: ${analysis.totalRecords}회
- 긍정적 감정 비율: ${analysis.positiveRatio}%
- 부정적 감정 비율: ${100 - analysis.positiveRatio}%

## 🎭 감정별 상세 분석
${emotionSummaryText}

${topActions ? `## 🌿 도움이 된 활동 (TOP 3)\n${topActions}` : ''}

${topChanges ? `## ✨ 걷기 후 경험한 긍정적 변화\n${topChanges}` : ''}

${selfMessages ? `## 💬 사용자가 스스로에게 건넨 말\n${selfMessages}` : ''}

${reasonsText ? `## 📝 왜 그런 감정을 느꼈는지 (감정의 이유)\n${reasonsText}` : ''}

# 보고서 작성 구조

아래는 출력 구조 예시이며, 실제 출력에는 포함하지 않음. 
숫자는 순서를 나타내는 것이므로 숫자를 제외하여 구조만 모방할 것.

1. {주간 감정 한줄 요약}

2. {감정 패턴 분석}

3. {의미 있는 발견}

4. {맞춤 조언}

5. {마무리 메시지}

# 보고서 작성 형식

## 주간 감정 한줄 요약 
지난 한 주의 감정 흐름을 시적이고 은유적인 한 문장으로 표현해주세요.
예: "고요한 호수 위에 잔잔한 파문이 이는 듯한 한 주였어요"

## 감정 패턴 분석 (3-4문장)
- 가장 자주 느낀 감정과 그 의미를 설명
- 감정의 빈도나 패턴이 있다면 언급
- 긍정/부정 감정의 균형에 대한 전문적 해석
- 구체적인 숫자와 데이터를 자연스럽게 포함

## 의미 있는 발견 (2-3문장)
- 도움이 된 활동이 있다면 왜 효과적이었는지 심리학적 관점에서 설명
- 사용자가 기록한 메모나 스스로에게 건넨 말이 있다면 그 의미 짚어주기
- 걷기 후 긍정적 변화가 있었다면 그 연결고리 설명

## 맞춤 조언 (2문장)
- 다음 주에 시도해볼 수 있는 구체적이고 실천 가능한 제안 1가지
- 현재 잘 하고 있는 점을 인정하고 격려

## 마무리 메시지 (1문장)
따뜻하고 희망적인 마무리 인사 (이모지 1개 포함)

# 작성 규칙
- 존댓말(해요체) 사용
- 이모지는 섹션당 0-1개로 절제하여 사용
- 부정적 감정도 성장의 기회로 재해석 (하지만 억지스럽지 않게)
- 전체 분량: 400-500자
- JSON이나 마크다운 형식 없이 자연스러운 문단 형태로 작성
- 각 섹션을 빈 줄로 구분

# 출력 예시

"바쁜 일상 속에서도 나를 돌보는 시간을 꾸준히 만들어가신 한 주였어요"

지난 주 총 7번의 감정 기록 중 '평온함'을 4번이나 느끼셨네요. 전체 기록의 57%가 긍정적인 감정이었다는 건, 마음의 중심을 잘 잡고 계시다는 뜻이에요. 꾸준히 감정을 기록하시며 자신을 돌아보는 습관을 만들어가고 계시네요. 안정적인 일주일을 보내셨어요.

맨발걷기 후에 '마음이 가벼워졌다'는 변화를 가장 많이 경험하셨어요. 맨발로 땅을 디딜 때 느껴지는 자연의 감촉이 부교감신경을 활성화시켜 이완 효과를 준다고 해요. 또한 "오늘 하루도 잘 버텼다"라고 스스로에게 건넨 말씀이 마음에 남아요. 이렇게 자신을 인정해주는 습관은 정서 건강에 정말 중요해요.

다음 주에는 걷기 전후로 심호흡을 3번씩 해보시는 건 어떨까요? 호흡에 집중하면 현재에 더 머물 수 있어서 걷기의 효과가 배가 될 거예요. 일주일 동안 꾸준히 감정을 돌아보신 점, 정말 대단해요!

새로운 한 주도 한 걸음씩 가벼운 마음으로 걸어가시길 바라요 🌿`

    const result = await model.generateContent(prompt)
    const response = result.response
    const insight = response.text() || generateFallbackInsight(analysis)

    return {
      success: true,
      insight: insight.trim(),
    }
  } catch (error) {
    console.error('Generate emotion insight error:', error)
    // 에러 시 기본 인사이트 반환
    const analysis = analyzeEmotionData(records)
    return {
      success: true,
      insight: generateFallbackInsight(analysis),
    }
  }
}

// 보고서 타입 정의 (EAMRA 프레임워크 - intensity 없음)
export interface EmotionReport {
  id: string
  user_id: string
  week_start: string
  week_end: string
  total_records: number
  positive_ratio: number
  emotion_summary: Array<{
    type: string
    label: string
    emoji: string
    count: number
  }>
  top_helpful_actions: string[]
  top_positive_changes: string[]
  ai_insight: string
  created_at: string
}

/**
 * 주간 보고서 저장
 */
export async function saveEmotionReport(
  weekStart: Date,
  weekEnd: Date,
  records: EmotionRecord[],
  aiInsight: string
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' }
    }

    const analysis = analyzeEmotionData(records)

    // 도움이 된 행동 통계 (EAMRA - A. Action, 복수 선택)
    const actionStats: Record<string, number> = {}
    records.forEach((r) => {
      if (r.helpful_actions) {
        r.helpful_actions.forEach((action) => {
          actionStats[action] = (actionStats[action] || 0) + 1
        })
      }
    })
    const topActions = Object.entries(actionStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([action]) => action)

    // 긍정적 변화 통계 (EAMRA - R. Reflect, 복수 선택)
    const changeStats: Record<string, number> = {}
    records.forEach((r) => {
      if (r.positive_changes) {
        r.positive_changes.forEach((change) => {
          changeStats[change] = (changeStats[change] || 0) + 1
        })
      }
    })
    const topChanges = Object.entries(changeStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([change]) => change)

    const { data, error } = await supabase
      .from('emotion_reports')
      .insert({
        user_id: user.id,
        week_start: weekStart.toISOString().split('T')[0],
        week_end: weekEnd.toISOString().split('T')[0],
        total_records: analysis.totalRecords,
        positive_ratio: analysis.positiveRatio,
        emotion_summary: analysis.summary,
        top_helpful_actions: topActions,
        top_positive_changes: topChanges,
        ai_insight: aiInsight,
      })
      .select()
      .single()

    if (error) {
      // 이미 해당 주차 보고서가 존재하는 경우 (unique constraint)
      if (error.code === '23505') {
        // 테스트 모드: 중복이어도 성공으로 처리 (이미 보고서가 있다는 의미)
        // 프로덕션에서는 이 로직으로 주당 1회만 생성되도록 제한
        console.log('Report already exists for this week, skipping save')
        return { success: true, data: null, alreadyExists: true }
      }
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Save emotion report error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '보고서 저장에 실패했습니다.',
    }
  }
}

/**
 * 사용자의 보고서 목록 조회
 */
export async function getEmotionReports(limit: number = 10, offset: number = 0) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다.', data: [] }
    }

    const { data, error, count } = await supabase
      .from('emotion_reports')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('week_start', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return {
      success: true,
      data: data as EmotionReport[],
      total: count || 0,
    }
  } catch (error) {
    console.error('Get emotion reports error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '보고서 조회에 실패했습니다.',
      data: [],
    }
  }
}

/**
 * 특정 보고서 상세 조회
 */
export async function getEmotionReport(reportId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' }
    }

    const { data, error } = await supabase
      .from('emotion_reports')
      .select('*')
      .eq('id', reportId)
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    return { success: true, data: data as EmotionReport }
  } catch (error) {
    console.error('Get emotion report error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '보고서 조회에 실패했습니다.',
    }
  }
}

/**
 * 보고서 삭제
 */
export async function deleteEmotionReport(reportId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' }
    }

    const { error } = await supabase
      .from('emotion_reports')
      .delete()
      .eq('id', reportId)
      .eq('user_id', user.id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Delete emotion report error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '보고서 삭제에 실패했습니다.',
    }
  }
}
