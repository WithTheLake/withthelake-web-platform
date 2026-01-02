import { Suspense } from 'react'
import { getPosts } from '@/actions/communityActions'
import BoardList from './_components/BoardList'

interface PageProps {
  searchParams: Promise<{ page?: string }>
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

  const postsResult = await getPosts('notice', page, 20)

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <BoardList
        boardType="notice"
        posts={postsResult.data || []}
        currentPage={page}
        totalPages={postsResult.totalPages || 1}
      />
    </Suspense>
  )
}
