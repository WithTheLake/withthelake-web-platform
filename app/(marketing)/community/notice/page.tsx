import { Suspense } from 'react'
import { getPosts, type SearchType } from '@/actions/communityActions'
import { checkIsAdmin } from '@/actions/profileActions'
import BoardList from '../_components/BoardList'
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

export default async function NoticePage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''
  const searchType = (params.searchType as SearchType) || 'all'

  const [postsResult, adminStatus] = await Promise.all([
    getPosts('notice', { page, limit: 10, search, searchType }),
    checkIsAdmin()
  ])

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 w-32 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-48 bg-white/20 rounded animate-pulse mt-2" />
          </div>
        </section>
        <div className="max-w-4xl mx-auto px-5 py-8">
          <BoardListSkeleton count={10} />
        </div>
      </div>
    }>
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
