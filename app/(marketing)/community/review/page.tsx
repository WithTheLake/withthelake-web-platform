import { Suspense } from 'react'
import { getPosts, type SearchType, type SortBy } from '@/actions/communityActions'
import ReviewList from '../_components/ReviewList'
import { ReviewListSkeleton } from '@/components/ui/Skeleton'
import { getSiteUrl, getImageUrl } from '@/lib/utils/url'

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; searchType?: string; sortBy?: string }>
}

export const metadata = {
  title: '힐링 후기 | 커뮤니티 | WithTheLake',
  description: '힐링로드 ON 이용 후기를 공유하고 다른 분들의 경험을 확인해보세요.',
  openGraph: {
    title: '힐링 후기 | WithTheLake 커뮤니티',
    description: '힐링로드 ON 이용 후기를 공유하고 다른 분들의 경험을 확인해보세요.',
    url: `${getSiteUrl()}/community/review`,
    images: [
      {
        url: getImageUrl('/images/withthelake_logo.png'),
        width: 1200,
        height: 630,
        alt: 'WithTheLake 커뮤니티 힐링 후기',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '힐링 후기 | WithTheLake 커뮤니티',
    description: '힐링로드 ON 이용 후기를 공유하고 다른 분들의 경험을 확인해보세요.',
    images: [getImageUrl('/images/withthelake_logo.png')],
  },
}

export default async function ReviewPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''
  const searchType = (params.searchType as SearchType) || 'all'
  const sortBy = (params.sortBy as SortBy) || 'newest'

  const postsResult = await getPosts('review', { page, limit: 12, search, searchType, sortBy })

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-5 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="h-8 w-32 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-48 bg-white/20 rounded animate-pulse mt-2" />
          </div>
        </section>
        <div className="max-w-6xl mx-auto px-5 py-8">
          <ReviewListSkeleton count={12} />
        </div>
      </div>
    }>
      <ReviewList
        posts={postsResult.data || []}
        currentPage={page}
        totalPages={postsResult.totalPages || 1}
        totalCount={postsResult.total || 0}
      />
    </Suspense>
  )
}
