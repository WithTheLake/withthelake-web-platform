import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getPost, getAdjacentPosts, getCurrentUserId } from '@/actions/communityActions'
import { checkIsAdmin } from '@/actions/profileActions'
import PostDetail from '../../_components/PostDetail'
import { PostDetailSkeleton } from '@/components/ui/Skeleton'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const result = await getPost(id)

  if (!result.success || !result.post) {
    return {
      title: '게시글을 찾을 수 없습니다 | 이벤트 | WithTheLake',
    }
  }

  return {
    title: `${result.post.title} | 이벤트 | WithTheLake`,
    description: result.post.content.slice(0, 150),
    openGraph: {
      title: result.post.title,
      description: result.post.content.slice(0, 150),
      images: result.post.thumbnail_url ? [result.post.thumbnail_url] : [],
    },
  }
}

export default async function EventPostPage({ params }: PageProps) {
  const { id } = await params
  const [result, adjacentResult, currentUserId, adminStatus] = await Promise.all([
    getPost(id),
    getAdjacentPosts(id, 'event'),
    getCurrentUserId(),
    checkIsAdmin()
  ])

  if (!result.success || !result.post) {
    notFound()
  }

  return (
    <Suspense fallback={<PostDetailSkeleton />}>
      <PostDetail
        post={result.post}
        comments={result.comments || []}
        prevPost={adjacentResult.prevPost}
        nextPost={adjacentResult.nextPost}
        currentUserId={currentUserId}
        isAdmin={adminStatus.isAdmin}
      />
    </Suspense>
  )
}
