import { getEmotionRecords, checkAuthStatus } from '@/actions/emotionActions'
import MypageClient from './MypageClient'

export const metadata = {
  title: '마이페이지 - 힐링로드 ON',
  description: '나의 걷기 기록과 감정 변화를 확인하세요',
}

export default async function MypagePage() {
  const authStatus = await checkAuthStatus()

  let emotionRecords = []
  if (authStatus.isAuthenticated) {
    const result = await getEmotionRecords(20)
    if (result.success && result.data) {
      emotionRecords = result.data
    }
  }

  return (
    <MypageClient
      isAuthenticated={authStatus.isAuthenticated}
      user={authStatus.user}
      emotionRecords={emotionRecords}
    />
  )
}
