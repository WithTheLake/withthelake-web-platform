import type { User as SupabaseUser } from '@supabase/supabase-js'

// Supabase User 타입 재사용 (필요한 필드만 추출 가능)
export type User = SupabaseUser

// 사용자 프로필 타입 (DB user_profiles 테이블과 일치)
export interface UserProfile {
  id: string
  user_id: string
  nickname: string | null
  email: string | null
  gender: string | null
  age_group: string | null
  created_at: string
  updated_at: string
}

// 성별 선택 옵션
export const GENDER_OPTIONS = ['남성', '여성'] as const
export type Gender = (typeof GENDER_OPTIONS)[number]

// 연령대 선택 옵션
export const AGE_GROUP_OPTIONS = ['20대', '30대', '40대', '50대', '60대', '70대 이상'] as const
export type AgeGroup = (typeof AGE_GROUP_OPTIONS)[number]
