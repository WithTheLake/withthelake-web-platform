/**
 * 감정 데이터 분석 유틸리티 (EAMRA 프레임워크)
 * 클라이언트/서버 공용
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

interface EmotionSummary {
  type: string
  count: number
  label: string
  emoji: string
}

// 감정 레이블 (EAMRA - E. Emotion)
export const EMOTION_LABELS: Record<string, { emoji: string; label: string }> = {
  joy: { emoji: '😊', label: '기쁨' },
  calm: { emoji: '😌', label: '평온' },
  gratitude: { emoji: '🙏', label: '감사' },
  neutral: { emoji: '😐', label: '담담함' },
  bored: { emoji: '😑', label: '지루함' },
  tired: { emoji: '😴', label: '피곤함' },
  anxious: { emoji: '😰', label: '불안' },
  sad: { emoji: '😢', label: '우울' },
  angry: { emoji: '😠', label: '분노' },
  // 하위 호환성 (기존 감정 타입)
  happy: { emoji: '😊', label: '행복' },
  grateful: { emoji: '🙏', label: '감사' },
  energetic: { emoji: '💪', label: '활기' },
}

// 행동 레이블 (EAMRA - A. Action)
export const ACTION_LABELS: Record<string, string> = {
  walking: '걷기',
  barefoot_walking: '맨발걷기',
  affirmation: '긍정확언',
  deep_breathing: '심호흡',
  conversation: '대화',
  stretching: '스트레칭',
  music: '음악듣기',
  rest: '휴식',
  writing: '글쓰기',
  other: '기타',
}

// 변화 레이블 (EAMRA - R. Reflect)
export const CHANGE_LABELS: Record<string, { emoji: string; label: string }> = {
  lighter: { emoji: '🎈', label: '가벼워요' },
  calm: { emoji: '😌', label: '평온해요' },
  happy: { emoji: '😊', label: '기뻐요' },
  comfortable: { emoji: '☺️', label: '편안해요' },
  good: { emoji: '👍', label: '좋아요' },
  energized: { emoji: '⚡', label: '활력있어요' },
  hopeful: { emoji: '🌈', label: '희망적이예요' },
  grateful: { emoji: '🙏', label: '감사해요' },
  other: { emoji: '✨', label: '기타' },
}

/**
 * 감정 데이터를 분석하여 요약 통계 생성 (EAMRA 프레임워크)
 */
export function analyzeEmotionData(records: EmotionRecord[]) {
  if (records.length === 0) {
    return {
      totalRecords: 0,
      summary: [] as EmotionSummary[],
      dailyRecords: {} as Record<string, EmotionRecord[]>,
      positiveRatio: 0,
      mostFrequent: null as EmotionSummary | null,
      topActions: [] as { action: string; label: string; count: number }[],
      topChanges: [] as { change: string; label: string; emoji: string; count: number }[],
    }
  }

  // 감정별 집계
  const emotionMap = new Map<string, number>()
  const dailyRecords: Record<string, EmotionRecord[]> = {}

  // 행동별 집계
  const actionMap = new Map<string, number>()

  // 변화별 집계
  const changeMap = new Map<string, number>()

  records.forEach((record) => {
    // 감정별 집계
    const existing = emotionMap.get(record.emotion_type) || 0
    emotionMap.set(record.emotion_type, existing + 1)

    // 일별 기록
    const dateKey = new Date(record.created_at).toLocaleDateString('ko-KR')
    if (!dailyRecords[dateKey]) {
      dailyRecords[dateKey] = []
    }
    dailyRecords[dateKey].push(record)

    // 행동별 집계
    if (record.helpful_actions) {
      record.helpful_actions.forEach((action) => {
        const actionCount = actionMap.get(action) || 0
        actionMap.set(action, actionCount + 1)
      })
    }

    // 변화별 집계
    if (record.positive_changes) {
      record.positive_changes.forEach((change) => {
        const changeCount = changeMap.get(change) || 0
        changeMap.set(change, changeCount + 1)
      })
    }
  })

  // 요약 데이터 생성
  const summary: EmotionSummary[] = Array.from(emotionMap.entries())
    .map(([type, count]) => ({
      type,
      count,
      label: EMOTION_LABELS[type]?.label || type,
      emoji: EMOTION_LABELS[type]?.emoji || '😊',
    }))
    .sort((a, b) => b.count - a.count)

  // 긍정적 감정 비율
  const positiveEmotions = ['joy', 'calm', 'gratitude', 'happy', 'grateful', 'energetic']
  const positiveCount = records.filter((r) => positiveEmotions.includes(r.emotion_type)).length
  const positiveRatio = Math.round((positiveCount / records.length) * 100)

  // 가장 빈번한 감정
  const mostFrequent = summary[0] || null

  // 상위 행동들
  const topActions = Array.from(actionMap.entries())
    .map(([action, count]) => ({
      action,
      label: ACTION_LABELS[action] || action,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  // 상위 변화들
  const topChanges = Array.from(changeMap.entries())
    .map(([change, count]) => ({
      change,
      label: CHANGE_LABELS[change]?.label || change,
      emoji: CHANGE_LABELS[change]?.emoji || '✨',
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  return {
    totalRecords: records.length,
    summary,
    dailyRecords,
    positiveRatio,
    mostFrequent,
    topActions,
    topChanges,
  }
}

/**
 * API 실패 시 기본 인사이트 생성
 */
export function generateFallbackInsight(analysis: ReturnType<typeof analyzeEmotionData>): string {
  if (analysis.totalRecords === 0) {
    return '지난 주에는 아직 기록된 감정이 없습니다. 힐링로드 ON에서 매일 감정을 기록해보세요! 🌱'
  }

  const { mostFrequent, positiveRatio, totalRecords, topActions, topChanges } = analysis

  let insight = `지난 주 ${totalRecords}회의 감정을 기록하셨네요! `

  if (mostFrequent) {
    insight += `가장 많이 느끼신 감정은 ${mostFrequent.emoji} ${mostFrequent.label}이었어요. `
  }

  if (topActions.length > 0) {
    const actionNames = topActions.map((a) => a.label).join(', ')
    insight += `${actionNames}이(가) 도움이 되셨군요. `
  }

  if (positiveRatio >= 70) {
    insight += `긍정적인 감정이 ${positiveRatio}%로, 정말 좋은 한 주를 보내셨네요! 💚 `
  } else if (positiveRatio >= 50) {
    insight += `긍정과 부정의 감정이 균형을 이루고 있어요. 자신의 감정을 잘 인식하고 계시네요. 🌿 `
  } else {
    insight += `힘든 감정이 많았던 한 주였군요. 맨발걷기로 마음의 평화를 찾아보시는 건 어떨까요? 🤗 `
  }

  if (topChanges.length > 0) {
    const changeNames = topChanges.map((c) => c.label).join(', ')
    insight += `걷기 후 "${changeNames}" 같은 긍정적 변화를 경험하셨어요. `
  }

  insight += '다음 주도 함께 걸어요!'

  return insight
}
