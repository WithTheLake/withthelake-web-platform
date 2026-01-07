'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Newspaper, Calendar, ExternalLink, ArrowRight } from 'lucide-react'

interface NewsItem {
  id: number
  title: string
  source: string
  date: string
  category: string
  thumbnail: string | null
  link: string
}

interface NewsClientProps {
  newsItems: NewsItem[]
}

const categoryColors: Record<string, string> = {
  언론보도: 'bg-blue-100 text-blue-700',
  해외자료: 'bg-purple-100 text-purple-700',
}

const categories = ['전체', '언론보도', '해외자료']

export default function NewsClient({ newsItems }: NewsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const filteredNews = selectedCategory === '전체'
    ? newsItems
    : newsItems.filter(news => news.category === selectedCategory)

  return (
    <>
      {/* 카테고리 필터 */}
      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 뉴스 그리드 */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNews.map((news) => (
              <article
                key={news.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* 썸네일 영역 - 해외자료만 표시 */}
                {news.category === '해외자료' && (
                  <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                    {news.thumbnail ? (
                      <Image
                        src={news.thumbnail}
                        alt={news.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Newspaper size={28} className="text-gray-300" />
                    )}
                  </div>
                )}

                {/* 콘텐츠 */}
                <div className={`p-3 ${news.category === '언론보도' ? 'pt-4' : ''}`}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                        categoryColors[news.category] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {news.category}
                    </span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                      <Calendar size={10} />
                      {news.date}
                    </span>
                  </div>

                  <h2 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {news.title}
                  </h2>

                  <p className="text-xs text-gray-500 mb-2">{news.source}</p>

                  <a
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline"
                  >
                    기사 보기
                    <ExternalLink size={12} />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* 필터 결과 없음 */}
          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <Newspaper size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">해당 카테고리의 뉴스가 없습니다.</p>
            </div>
          )}

          {/* 더보기 버튼 */}
          <div className="mt-12 text-center">
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              더 많은 소식 보기
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
