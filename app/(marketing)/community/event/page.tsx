import { Suspense } from 'react'
import { getPosts, type SearchType } from '@/actions/communityActions'
import { checkIsAdmin } from '@/actions/profileActions'
import GalleryList from '../_components/GalleryList'

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; searchType?: string }>
}

export const metadata = {
  title: '이벤트 | 커뮤니티 | WithTheLake',
  description: '힐링로드 ON의 다양한 이벤트와 캠페인을 확인하세요.',
  openGraph: {
    title: '이벤트 | WithTheLake 커뮤니티',
    description: '힐링로드 ON의 다양한 이벤트와 캠페인을 확인하세요.',
  },
}

export default async function EventPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''
  const searchType = (params.searchType as SearchType) || 'all'

  const [postsResult, adminStatus] = await Promise.all([
    getPosts('event', { page, limit: 12, search, searchType }),
    checkIsAdmin()
  ])

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <GalleryList
        boardType="event"
        posts={postsResult.data || []}
        currentPage={page}
        totalPages={postsResult.totalPages || 1}
        totalCount={postsResult.total || 0}
        isAdmin={adminStatus.isAdmin}
      />
    </Suspense>
  )
}
