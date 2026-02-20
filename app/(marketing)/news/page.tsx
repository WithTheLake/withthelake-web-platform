import { Suspense } from 'react'
import type { Metadata } from 'next'
import NewsClient from './NewsClient'
import { getNewsArticles } from '@/actions/newsActions'
import { getSiteUrl, getImageUrl } from '@/lib/utils/url'
import { NewsListSkeleton } from '@/components/ui/Skeleton'

export const metadata: Metadata = {
  title: 'NEWS - WithTheLake',
  description: '위드더레이크의 언론 보도, 블로그 포스트, 미디어 소식을 확인하세요.',
  openGraph: {
    title: 'NEWS - WithTheLake',
    description: '위드더레이크의 언론 보도, 블로그 포스트, 미디어 소식을 확인하세요.',
    url: `${getSiteUrl()}/news`,
    images: [
      {
        url: getImageUrl('/images/withthelake_logo.png'),
        width: 1200,
        height: 630,
        alt: 'WithTheLake NEWS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEWS - WithTheLake',
    description: '위드더레이크의 언론 보도, 블로그 포스트, 미디어 소식을 확인하세요.',
    images: [getImageUrl('/images/withthelake_logo.png')],
  },
}

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-white pb-16">
      {/* 히어로 섹션 - 즉시 렌더링 */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">NEWS</h1>
          <p className="text-gray-300">
            맨발걷기 관련 언론 보도와 미디어 소식
          </p>
        </div>
      </section>

      {/* 데이터 로딩 영역 - 스트리밍 */}
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><NewsListSkeleton /></div>}>
        <NewsContent />
      </Suspense>
    </div>
  )
}

async function NewsContent() {
  const { data: newsArticles } = await getNewsArticles()

  const newsItems = newsArticles.map(article => ({
    id: article.id,
    title: article.title,
    source: article.source,
    date: article.published_at,
    category: article.category,
    thumbnail: article.thumbnail_url,
    link: article.link,
  }))

  return <NewsClient newsItems={newsItems} />
}
