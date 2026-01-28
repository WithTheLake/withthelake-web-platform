import { Suspense } from 'react'
import { getPosts, type SearchType, type FreeBoardTopic } from '@/actions/communityActions'
import FreeBoardList from '../_components/FreeBoardList'
import { BoardListSkeleton } from '@/components/ui/Skeleton'

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; searchType?: string; topic?: string }>
}

export const metadata = {
  title: '자유게시판 | 커뮤니티 | WithTheLake',
  description: '힐링로드 ON 사용자들과 자유롭게 이야기를 나눠보세요.',
  openGraph: {
    title: '자유게시판 | WithTheLake 커뮤니티',
    description: '힐링로드 ON 사용자들과 자유롭게 이야기를 나눠보세요.',
  },
}

export default async function FreeBoardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''
  const searchType = (params.searchType as SearchType) || 'all'
  const topic = params.topic as FreeBoardTopic | undefined

  const postsResult = await getPosts('free', { page, limit: 20, search, searchType, topic })

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 w-32 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-48 bg-white/20 rounded animate-pulse mt-2" />
          </div>
        </section>
        <div className="max-w-4xl mx-auto px-5 py-8">
          <BoardListSkeleton count={20} />
        </div>
      </div>
    }>
      <FreeBoardList
        posts={postsResult.data || []}
        currentPage={page}
        totalPages={postsResult.totalPages || 1}
        totalCount={postsResult.total || 0}
      />
    </Suspense>
  )
}
