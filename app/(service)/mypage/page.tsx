import { getEmotionRecords, checkAuthStatus } from '@/actions/emotionActions'
import { getMyProfile } from '@/actions/profileActions'
import MypageClient from './MypageClient'

export const metadata = {
  title: '마이페이지 - 힐링로드 ON',
  description: '나의 걷기 기록과 감정 변화를 확인하세요',
}

export default async function MypagePage() {
  const authStatus = await checkAuthStatus()

  let emotionRecords: Array<{
    id: string
    emotion_type: string
    intensity: number
    note: string | null
    created_at: string
  }> = []
  let userProfile: {
    nickname: string | null
    age_group: string | null
    total_walks: number
    total_duration: number
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

  return (
    <MypageClient
      isAuthenticated={authStatus.isAuthenticated}
      user={authStatus.user}
      emotionRecords={emotionRecords}
      userProfile={userProfile}
    />
  )
}
