import Image from 'next/image'
import Link from 'next/link'
import { Newspaper, Calendar, ExternalLink, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'NEWS - WithTheLake',
  description: '위드더레이크의 언론 보도, 블로그 포스트, 미디어 소식을 확인하세요.',
}

// 샘플 뉴스 데이터
const newsItems = [
  {
    id: 1,
    title: '"맨발걷기로 시니어 건강 챙긴다"... 위드더레이크, 힐링로드 ON 서비스 출시',
    source: '강원일보',
    date: '2024-12-28',
    category: '언론보도',
    thumbnail: null,
    link: '#',
  },
  {
    id: 2,
    title: '철원군, 위드더레이크와 맨발걷기 활성화 업무협약 체결',
    source: '뉴스1',
    date: '2024-12-20',
    category: '언론보도',
    thumbnail: null,
    link: '#',
  },
  {
    id: 3,
    title: '액티브 시니어를 위한 맨발걷기의 과학적 효과',
    source: '위드더레이크 블로그',
    date: '2024-12-15',
    category: '블로그',
    thumbnail: null,
    link: '#',
  },
  {
    id: 4,
    title: '2024년 웰니스 관광 트렌드와 맨발걷기의 부상',
    source: '한국경제',
    date: '2024-12-10',
    category: '언론보도',
    thumbnail: null,
    link: '#',
  },
  {
    id: 5,
    title: '겨울철 맨발걷기, 이렇게 하면 안전해요',
    source: '위드더레이크 블로그',
    date: '2024-12-05',
    category: '블로그',
    thumbnail: null,
    link: '#',
  },
  {
    id: 6,
    title: '강원도 철원 느티나무 삼십리길 맨발걷기 명소로 주목',
    source: '연합뉴스',
    date: '2024-11-28',
    category: '언론보도',
    thumbnail: null,
    link: '#',
  },
]

const categoryColors: Record<string, string> = {
  언론보도: 'bg-blue-100 text-blue-700',
  블로그: 'bg-green-100 text-green-700',
  영상: 'bg-red-100 text-red-700',
}

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Newspaper size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">NEWS</h1>
          <p className="text-gray-300 text-lg">
            위드더레이크의 언론 보도와 미디어 소식
          </p>
        </div>
      </section>

      {/* 카테고리 필터 */}
      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-sm">
              전체
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors">
              언론보도
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors">
              블로그
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors">
              영상
            </button>
          </div>
        </div>
      </section>

      {/* 뉴스 그리드 */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((news) => (
              <article
                key={news.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* 썸네일 영역 */}
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Newspaper size={48} className="text-gray-300" />
                </div>

                {/* 콘텐츠 */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        categoryColors[news.category] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {news.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} />
                      {news.date}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {news.title}
                  </h2>

                  <p className="text-sm text-gray-500 mb-4">{news.source}</p>

                  <a
                    href={news.link}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline"
                  >
                    자세히 보기
                    <ExternalLink size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* 더보기 버튼 */}
          <div className="mt-12 text-center">
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              더 많은 소식 보기
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 미디어 문의 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">미디어 문의</h2>
          <p className="text-gray-600 mb-8">
            인터뷰, 취재, 협업 제안은 아래 이메일로 연락주세요
          </p>
          <a
            href="mailto:press@withthelake.com"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            press@withthelake.com
          </a>
        </div>
      </section>
    </div>
  )
}
