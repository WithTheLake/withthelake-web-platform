import type { User as SupabaseUser } from '@supabase/supabase-js'

// Supabase User 타입 재사용 (필요한 필드만 추출 가능)
export type User = SupabaseUser

// 사용자 프로필 타입 (DB user_profiles 테이블과 일치)
export interface UserProfile {
  id: string
  user_id: string
  nickname: string | null
  age_group: string | null
  total_walks: number
  total_duration: number
  created_at: string
  updated_at: string
}
