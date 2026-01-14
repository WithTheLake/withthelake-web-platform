'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Newspaper, Calendar, ExternalLink, ChevronRight } from 'lucide-react'
import {
  NEWS_CATEGORIES,
  getNewsCategoryButtonStyle,
  getNewsBadgeStyle,
  getNewsSectionStyle,
} from '@/lib/constants'

interface NewsItem {
  id: string
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

// 뉴스 카드 컴포넌트
function NewsCard({ news }: { news: NewsItem }) {
  return (
    <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
      {/* 썸네일 영역 - 해외자료만 표시 */}
      {news.thumbnail && (
        <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
          <Image
            src={news.thumbnail}
            alt={news.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* 콘텐츠 */}
      <div className={`p-3 ${!news.thumbnail ? 'pt-4' : ''}`}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getNewsBadgeStyle(news.category)}`}
          >
            {news.category}
          </span>
          <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
            <Calendar size={10} />
            {news.date}
          </span>
        </div>

        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {news.title}
        </h3>

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
  )
}

// 카테고리 섹션 컴포넌트
function CategorySection({
  category,
  items,
  onViewAll
}: {
  category: string
  items: NewsItem[]
  onViewAll: () => void
}) {
  const colors = getNewsSectionStyle(category)

  if (items.length === 0) return null

  // 4개 초과일 때만 전체보기 버튼 표시
  const showViewAll = items.length > 4

  return (
    <section className={`py-10 ${colors.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${colors.title}`}>
            {category}
            <span className="ml-2 text-base font-normal opacity-70">({items.length})</span>
          </h2>
          {showViewAll && (
            <button
              onClick={onViewAll}
              className={`inline-flex items-center gap-1 text-sm font-medium ${colors.title} hover:underline`}
            >
              전체보기
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* 뉴스 그리드 - 최대 4개 표시 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.slice(0, 4).map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function NewsClient({ newsItems }: NewsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('전체')

  // 카테고리별 뉴스 그룹화
  const newsByCategory = NEWS_CATEGORIES.slice(1).reduce((acc, category) => {
    acc[category] = newsItems.filter(news => news.category === category)
    return acc
  }, {} as Record<string, NewsItem[]>)

  // 선택된 카테고리의 뉴스
  const filteredNews = selectedCategory === '전체'
    ? newsItems
    : newsItems.filter(news => news.category === selectedCategory)

  return (
    <>
      {/* 카테고리 필터 */}
      <section className="py-6 border-b sticky top-16 md:top-20 bg-white z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {NEWS_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category
              const count = category === '전체' ? newsItems.length : (newsByCategory[category]?.length || 0)

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${getNewsCategoryButtonStyle(category, isSelected)}`}
                >
                  {category}
                  <span className={`ml-1.5 ${isSelected ? 'opacity-80' : 'opacity-70'}`}>
                    ({count})
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* 전체 보기: 카테고리별 섹션 */}
      {selectedCategory === '전체' ? (
        <div className="divide-y divide-gray-100">
          {NEWS_CATEGORIES.slice(1).map((category) => (
            <CategorySection
              key={category}
              category={category}
              items={newsByCategory[category] || []}
              onViewAll={() => setSelectedCategory(category)}
            />
          ))}

          {/* 모든 카테고리가 비어있을 때 */}
          {Object.values(newsByCategory).every(items => items.length === 0) && (
            <div className="py-16 text-center">
              <Newspaper size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">등록된 뉴스가 없습니다.</p>
            </div>
          )}
        </div>
      ) : (
        /* 카테고리 선택 시: 해당 카테고리만 표시 */
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredNews.length > 0 ? (
              <>
                {/* 결과 개수 */}
                <p className="text-sm text-gray-500 mb-6">
                  총 <span className="font-semibold text-gray-900">{filteredNews.length}</span>개의 뉴스
                </p>

                {/* 뉴스 그리드 */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredNews.map((news) => (
                    <NewsCard key={news.id} news={news} />
                  ))}
                </div>
              </>
            ) : (
              /* 필터 결과 없음 */
              <div className="text-center py-12">
                <Newspaper size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">해당 카테고리의 뉴스가 없습니다.</p>
                <button
                  onClick={() => setSelectedCategory('전체')}
                  className="text-blue-600 font-medium hover:underline"
                >
                  전체 뉴스 보기
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}
