import { Suspense } from 'react'
import { getPosts } from '@/actions/communityActions'
import BoardList from '../_components/BoardList'

interface PageProps {
  searchParams: Promise<{ page?: string }>
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

  const postsResult = await getPosts('free', page, 20)

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <BoardList
        boardType="free"
        posts={postsResult.data || []}
        currentPage={page}
        totalPages={postsResult.totalPages || 1}
      />
    </Suspense>
  )
}
