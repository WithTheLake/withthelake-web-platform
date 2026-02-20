import { Suspense } from 'react'
import { getPosts, type SearchType } from '@/actions/communityActions'
import { checkIsAdmin } from '@/actions/profileActions'
import BoardList from './_components/BoardList'
import { BoardListSkeleton } from '@/components/ui/Skeleton'

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; searchType?: string }>
}

export const metadata = {
  title: '공지사항 | 커뮤니티 | WithTheLake',
  description: '힐링로드 ON의 새로운 소식과 공지사항을 확인하세요.',
  openGraph: {
    title: '공지사항 | WithTheLake 커뮤니티',
    description: '힐링로드 ON의 새로운 소식과 공지사항을 확인하세요.',
  },
}

export default async function CommunityPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''
  const searchType = (params.searchType as SearchType) || 'all'

  const [postsResult, adminStatus] = await Promise.all([
    getPosts('notice', { page, limit: 20, search, searchType }),
    checkIsAdmin()
  ])

  return (
    <Suspense fallback={<BoardListSkeleton />}>
      <BoardList
        boardType="notice"
        posts={postsResult.data || []}
        currentPage={page}
        totalPages={postsResult.totalPages || 1}
        totalCount={postsResult.total || 0}
        isAdmin={adminStatus.isAdmin}
      />
    </Suspense>
  )
}
