import { getEmotionRecords, checkAuthStatus } from '@/actions/emotionActions'
import { getMyProfile, checkIsAdmin } from '@/actions/profileActions'
import MypageClient from './MypageClient'

export const metadata = {
  title: '마이페이지 - 힐링로드 ON',
  description: '나의 걷기 기록과 감정 변화를 확인하세요',
}

export default async function MypagePage() {
  const [authStatus, adminStatus] = await Promise.all([
    checkAuthStatus(),
    checkIsAdmin(),
  ])

  let emotionRecords: Array<{
    id: string
    emotion_type: string
    intensity?: number
    emotion_reason?: string | null
    helpful_actions?: string[] | null
    positive_changes?: string[] | null
    self_message?: string | null
    experience_location?: string | null
    note?: string | null
    created_at: string
  }> = []
  let userProfile: {
    nickname: string | null
    gender: string | null
    age_group: string | null
  } | null = null

  if (authStatus.isAuthenticated) {
    // 감정 기록 조회
    const emotionResult = await getEmotionRecords(20)
    if (emotionResult.success && emotionResult.data) {
      emotionRecords = emotionResult.data
    }

    // 프로필 조회
    const profileResult = await getMyProfile()
    if (profileResult.success && profileResult.data) {
      userProfile = profileResult.data
    }
  }

  const hasGeminiKey = !!process.env.GEMINI_API_KEY

  return (
    <MypageClient
      isAuthenticated={authStatus.isAuthenticated}
      user={authStatus.user}
      emotionRecords={emotionRecords}
      userProfile={userProfile}
      isAdmin={adminStatus.isAdmin}
      hasGeminiKey={hasGeminiKey}
    />
  )
}
