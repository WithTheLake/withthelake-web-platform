import { checkAuthStatus } from '@/actions/emotionActions'
import { getMyProfile } from '@/actions/profileActions'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'

export const metadata = {
  title: '설정 - 힐링로드 ON',
  description: '프로필 설정 및 계정 관리',
}

export default async function SettingsPage() {
  const authStatus = await checkAuthStatus()

  // 비로그인 시 로그인 페이지로 리다이렉트
  if (!authStatus.isAuthenticated) {
    redirect('/login?next=/mypage/settings')
  }

  // 프로필 조회
  let userProfile: {
    nickname: string | null
    email: string | null
    gender: string | null
    age_group: string | null
    created_at: string | null
  } | null = null

  const profileResult = await getMyProfile()
  if (profileResult.success && profileResult.data) {
    userProfile = profileResult.data
  }

  return (
    <SettingsClient
      user={authStatus.user}
      userProfile={userProfile}
    />
  )
}
