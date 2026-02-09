import type { Metadata } from 'next'
import NewsClient from './NewsClient'
import { getNewsArticles } from '@/actions/newsActions'
import { getSiteUrl, getImageUrl } from '@/lib/utils/url'

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

export default async function NewsPage() {
  // DB에서 뉴스 데이터 조회
  const { data: newsArticles } = await getNewsArticles()

  // NewsClient에 전달할 형식으로 변환
  const newsItems = newsArticles.map(article => ({
    id: article.id,
    title: article.title,
    source: article.source,
    date: article.published_at,
    category: article.category,
    thumbnail: article.thumbnail_url,
    link: article.link,
  }))
  return (
    <div className="min-h-screen bg-white pb-16">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">NEWS</h1>
          <p className="text-gray-300">
            맨발걷기 관련 언론 보도와 미디어 소식
          </p>
        </div>
      </section>

      {/* 클라이언트 컴포넌트: 카테고리 필터 + 뉴스 그리드 */}
      <NewsClient newsItems={newsItems} />
    </div>
  )
}
