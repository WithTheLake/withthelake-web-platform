// 오디오 아이템 타입 (Supabase audio_tracks 테이블과 일치)
export interface AudioItem {
  id: string // UUID
  title: string
  description: string | null
  filename: string
  emoji: string | null
  category: 'walk_guide' | 'affirmation'
  duration?: number | null
  is_active?: boolean
  order_index?: number
  created_at?: string
  updated_at?: string
}

// 오디오 카테고리 타입
export type AudioCategory = 'walk_guide' | 'affirmation'

// 재생 상태 타입
export type PlaybackState = 'playing' | 'paused' | 'stopped'
