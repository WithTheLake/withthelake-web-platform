// 감정 기록에서 사용하는 모든 상수들

// E. 감정 | Emotion - 걷기 전 감정 (9가지)
export const PRE_EMOTIONS = [
  { type: 'joy', emoji: '😊', label: '기쁨' },
  { type: 'calm', emoji: '😌', label: '평온' },
  { type: 'grateful', emoji: '🙏', label: '감사' },
  { type: 'neutral', emoji: '😐', label: '담담함' },
  { type: 'bored', emoji: '😑', label: '지루함' },
  { type: 'tired', emoji: '😴', label: '피곤함' },
  { type: 'anxious', emoji: '😰', label: '불안' },
  { type: 'depressed', emoji: '😢', label: '우울' },
  { type: 'angry', emoji: '😠', label: '분노' },
] as const

// A. 행동 | Action - 긍정적 감정에 도움이 된 행동 (9가지)
export const HELPFUL_ACTIONS = [
  { type: 'walking', label: '걷기' },
  { type: 'barefoot_walking', label: '맨발걷기' },
  { type: 'affirmation', label: '긍정확언' },
  { type: 'deep_breathing', label: '심호흡' },
  { type: 'conversation', label: '대화' },
  { type: 'stretching', label: '스트레칭' },
  { type: 'listening_music', label: '음악듣기' },
  { type: 'rest', label: '휴식' },
  { type: 'writing', label: '글쓰기' },
] as const

// R. 성찰 | Reflect - 행동 후 긍정적 변화 (8가지)
export const POSITIVE_CHANGES = [
  { type: 'lighter', emoji: '🪶', label: '가벼워요' },
  { type: 'peaceful', emoji: '☁️', label: '평온해요' },
  { type: 'happy', emoji: '😊', label: '기뻐요' },
  { type: 'comfortable', emoji: '🛋️', label: '편안해요' },
  { type: 'good', emoji: '👍', label: '좋아요' },
  { type: 'energetic', emoji: '⚡', label: '활력있어요' },
  { type: 'hopeful', emoji: '🌈', label: '희망적이예요' },
  { type: 'thankful', emoji: '💚', label: '감사해요' },
] as const

// 체험 장소 옵션
export const EXPERIENCE_LOCATIONS = [
  '느티나무길',
  '군탄공원',
  '호수공원',
  '산책로',
  '해변',
  '숲길',
  '기타',
] as const

// 감정 타입으로 감정 정보 찾기 헬퍼
export const getEmotionByType = (type: string) => {
  return PRE_EMOTIONS.find(e => e.type === type)
}

// 감정 라벨 매핑 (마이페이지 등에서 사용)
export const EMOTION_LABELS: Record<string, { emoji: string; label: string }> =
  PRE_EMOTIONS.reduce((acc, emotion) => {
    acc[emotion.type] = { emoji: emotion.emoji, label: emotion.label }
    return acc
  }, {} as Record<string, { emoji: string; label: string }>)

// 행동 라벨 매핑
export const ACTION_LABELS: Record<string, string> =
  HELPFUL_ACTIONS.reduce((acc, action) => {
    acc[action.type] = action.label
    return acc
  }, {} as Record<string, string>)

// 변화 라벨 매핑
export const CHANGE_LABELS: Record<string, { emoji: string; label: string }> =
  POSITIVE_CHANGES.reduce((acc, change) => {
    acc[change.type] = { emoji: change.emoji, label: change.label }
    return acc
  }, {} as Record<string, { emoji: string; label: string }>)

// 체험 장소 라벨 매핑
export const LOCATION_LABELS: Record<string, string> =
  EXPERIENCE_LOCATIONS.reduce((acc, location) => {
    acc[location] = location
    return acc
  }, {} as Record<string, string>)

// 타입 정의
export type EmotionType = typeof PRE_EMOTIONS[number]['type']
export type ActionType = typeof HELPFUL_ACTIONS[number]['type']
export type ChangeType = typeof POSITIVE_CHANGES[number]['type']
export type ExperienceLocation = typeof EXPERIENCE_LOCATIONS[number]
