import { checkAuthStatus, getEmotionRecordsPaginated } from '@/actions/emotionActions'
import { redirect } from 'next/navigation'
import RecordsClient from './RecordsClient'

export const metadata = {
  title: '감정 기록 - 힐링로드 ON',
  description: '나의 모든 감정 기록을 확인하세요',
}

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function RecordsPage({ searchParams }: PageProps) {
  const authStatus = await checkAuthStatus()

  // 비로그인 시 로그인 페이지로 리다이렉트
  if (!authStatus.isAuthenticated) {
    redirect('/login?next=/mypage/records')
  }

  const params = await searchParams
  const page = parseInt(params.page || '1', 10)

  const result = await getEmotionRecordsPaginated(page, 20)

  return (
    <RecordsClient
      records={result.data || []}
      totalCount={result.totalCount || 0}
      totalPages={result.totalPages || 0}
      currentPage={result.currentPage || 1}
    />
  )
}
