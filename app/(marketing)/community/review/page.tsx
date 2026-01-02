import { Suspense } from 'react'
import { getPosts } from '@/actions/communityActions'
import BoardList from '../_components/BoardList'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export const metadata = {
  title: '힐링 후기 | 커뮤니티 | WithTheLake',
  description: '힐링로드 ON 이용 후기를 공유하고 다른 분들의 경험을 확인해보세요.',
  openGraph: {
    title: '힐링 후기 | WithTheLake 커뮤니티',
    description: '힐링로드 ON 이용 후기를 공유하고 다른 분들의 경험을 확인해보세요.',
  },
}

export default async function ReviewPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1

  const postsResult = await getPosts('review', page, 20)

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <BoardList
        boardType="review"
        posts={postsResult.data || []}
        currentPage={page}
        totalPages={postsResult.totalPages || 1}
      />
    </Suspense>
  )
}
