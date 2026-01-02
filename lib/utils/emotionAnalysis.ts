/**
 * 감정 데이터 분석 유틸리티 (클라이언트/서버 공용)
 */

interface EmotionRecord {
  id: string
  emotion_type: string
  intensity: number
  note: string | null
  created_at: string
}

interface EmotionSummary {
  type: string
  count: number
  avgIntensity: number
  label: string
  emoji: string
}

export const EMOTION_LABELS: Record<string, { emoji: string; label: string }> = {
  happy: { emoji: '😊', label: '행복' },
  calm: { emoji: '😌', label: '평온' },
  grateful: { emoji: '🙏', label: '감사' },
  energetic: { emoji: '💪', label: '활기' },
  tired: { emoji: '😴', label: '피곤' },
  sad: { emoji: '😢', label: '슬픔' },
  anxious: { emoji: '😰', label: '불안' },
  angry: { emoji: '😠', label: '화남' },
}

/**
 * 감정 데이터를 분석하여 요약 통계 생성
 */
export function analyzeEmotionData(records: EmotionRecord[]) {
  if (records.length === 0) {
    return {
      totalRecords: 0,
      summary: [] as EmotionSummary[],
      dailyRecords: {} as Record<string, EmotionRecord[]>,
      positiveRatio: 0,
      mostFrequent: null as EmotionSummary | null,
      highestIntensity: null as EmotionRecord | null,
    }
  }

  // 감정별 집계
  const emotionMap = new Map<string, { count: number; totalIntensity: number }>()
  const dailyRecords: Record<string, EmotionRecord[]> = {}

  records.forEach((record) => {
    // 감정별 집계
    const existing = emotionMap.get(record.emotion_type) || { count: 0, totalIntensity: 0 }
    emotionMap.set(record.emotion_type, {
      count: existing.count + 1,
      totalIntensity: existing.totalIntensity + record.intensity,
    })

    // 일별 기록
    const dateKey = new Date(record.created_at).toLocaleDateString('ko-KR')
    if (!dailyRecords[dateKey]) {
      dailyRecords[dateKey] = []
    }
    dailyRecords[dateKey].push(record)
  })

  // 요약 데이터 생성
  const summary: EmotionSummary[] = Array.from(emotionMap.entries())
    .map(([type, data]) => ({
      type,
      count: data.count,
      avgIntensity: Math.round((data.totalIntensity / data.count) * 10) / 10,
      label: EMOTION_LABELS[type]?.label || type,
      emoji: EMOTION_LABELS[type]?.emoji || '😊',
    }))
    .sort((a, b) => b.count - a.count)

  // 긍정적 감정 비율
  const positiveEmotions = ['happy', 'calm', 'grateful', 'energetic']
  const positiveCount = records.filter((r) => positiveEmotions.includes(r.emotion_type)).length
  const positiveRatio = Math.round((positiveCount / records.length) * 100)

  // 가장 빈번한 감정
  const mostFrequent = summary[0] || null

  // 가장 강도가 높았던 감정
  const highestIntensity = records.reduce(
    (max, record) =>
      record.intensity > (max?.intensity || 0) ? record : max,
    null as EmotionRecord | null
  )

  return {
    totalRecords: records.length,
    summary,
    dailyRecords,
    positiveRatio,
    mostFrequent,
    highestIntensity,
  }
}

/**
 * API 실패 시 기본 인사이트 생성
 */
export function generateFallbackInsight(analysis: ReturnType<typeof analyzeEmotionData>): string {
  if (analysis.totalRecords === 0) {
    return '이번 주에는 아직 기록된 감정이 없습니다. 힐링로드 ON에서 매일 감정을 기록해보세요! 🌱'
  }

  const { mostFrequent, positiveRatio, totalRecords } = analysis

  let insight = `이번 주 ${totalRecords}회의 감정을 기록하셨네요! `

  if (mostFrequent) {
    insight += `가장 많이 느끼신 감정은 ${mostFrequent.emoji} ${mostFrequent.label}이었어요. `
  }

  if (positiveRatio >= 70) {
    insight += `긍정적인 감정이 ${positiveRatio}%로, 정말 좋은 한 주를 보내셨네요! 💚 `
  } else if (positiveRatio >= 50) {
    insight += `긍정과 부정의 감정이 균형을 이루고 있어요. 자신의 감정을 잘 인식하고 계시네요. 🌿 `
  } else {
    insight += `힘든 감정이 많았던 한 주였군요. 맨발걷기로 마음의 평화를 찾아보시는 건 어떨까요? 🤗 `
  }

  insight += '다음 주도 함께 걸어요!'

  return insight
}
