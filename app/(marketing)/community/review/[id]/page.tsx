import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getPost } from '@/actions/communityActions'
import PostDetail from '../../_components/PostDetail'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const result = await getPost(id)

  if (!result.success || !result.post) {
    return {
      title: '게시글을 찾을 수 없습니다 | 힐링 후기 | WithTheLake',
    }
  }

  return {
    title: `${result.post.title} | 힐링 후기 | WithTheLake`,
    description: result.post.content.slice(0, 150),
    openGraph: {
      title: result.post.title,
      description: result.post.content.slice(0, 150),
    },
  }
}

export default async function ReviewPostPage({ params }: PageProps) {
  const { id } = await params
  const result = await getPost(id)

  if (!result.success || !result.post) {
    notFound()
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <PostDetail
        post={result.post}
        comments={result.comments || []}
      />
    </Suspense>
  )
}
