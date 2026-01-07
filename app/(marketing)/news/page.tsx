import NewsClient from './NewsClient'

export const metadata = {
  title: 'NEWS - WithTheLake',
  description: '위드더레이크의 언론 보도, 블로그 포스트, 미디어 소식을 확인하세요.',
}

// 뉴스 데이터 (실제 언론 보도 기사)
// 모든 기사는 공인 언론사 또는 신뢰할 수 있는 매체의 보도입니다.
const newsItems = [
  // 국내 언론 보도 - 최신순 정렬
  {
    id: 1,
    title: '화성시, 맨발걷기 산책로 24곳 조성 완료…일상 속 힐링 공간 확대',
    source: '중앙이코노미뉴스',
    date: '2025-01-23',
    category: '언론보도',
    thumbnail: null,
    link: 'https://www.joongangenews.com/news/articleView.html?idxno=478843',
  },
  {
    id: 2,
    title: '\'맨발로 느끼는 힐링\' 보령시, 해변 맨발 걷기 \'눈길\'',
    source: '서울신문',
    date: '2025-01-02',
    category: '언론보도',
    thumbnail: null,
    link: 'https://news.zum.com/articles/100313495',
  },
  {
    id: 3,
    title: '양홍식 제주도의원, 해변 맨발걷기 활성화 조례안 대표발의',
    source: '겟뉴스',
    date: '2025-12-18',
    category: '언론보도',
    thumbnail: null,
    link: 'https://www.getnews.co.kr/news/articleView.html?idxno=854027',
  },
  {
    id: 4,
    title: '속초시, 맨발걷기 성지 입지 다진다…청초호 맨발걷기 길 본격 착공',
    source: '뉴스로',
    date: '2024-12-20',
    category: '언론보도',
    thumbnail: null,
    link: 'https://www.newsro.kr/article243/1005387/',
  },
  {
    id: 5,
    title: '순천시, 노르딕워킹·맨발걷기 교실 수강생 모집',
    source: '뉴스로',
    date: '2024-12-15',
    category: '언론보도',
    thumbnail: null,
    link: 'https://www.newsro.kr/article243/779144/',
  },
  {
    id: 6,
    title: '양평군, 맨발걷기국민운동본부와 \'맨발 걷기 딱 좋은 양평!\' 개최',
    source: '천지일보',
    date: '2024-10-31',
    category: '언론보도',
    thumbnail: null,
    link: 'https://www.newscj.com/news/articleView.html?idxno=3334562',
  },
  {
    id: 7,
    title: '전진선 양평군수, 맨발걷기국민운동본부와 \'맨발걷기 활성화\' 협약',
    source: '위키트리',
    date: '2024-10-30',
    category: '언론보도',
    thumbnail: null,
    link: 'https://www.wikitree.co.kr/articles/1091779',
  },
  {
    id: 8,
    title: '완도군, \'제2회 명사십리 치유길 맨발 걷기 페스티벌\' 개최',
    source: '더팩트',
    date: '2024-10-28',
    category: '언론보도',
    thumbnail: null,
    link: 'https://news.tf.co.kr/read/national/2256646.htm',
  },
  {
    id: 9,
    title: '문경새재 맨발페스티벌, 국내 최고의 힐링 걷기 축제와 건강 여행 명소 부상',
    source: '한국일보',
    date: '2024-08-17',
    category: '언론보도',
    thumbnail: null,
    link: 'https://www.hankookilbo.com/News/Read/A2025081708090000676',
  },
  {
    id: 10,
    title: '산림치유·힐링·관광 한번에…대청호가 반기는 \'맨발걷기 성지\'',
    source: '서울경제',
    date: '2025-11-13',
    category: '언론보도',
    thumbnail: null,
    link: 'https://www.sedaily.com/NewsView/2H0FULUQ6F',
  },
  {
    id: 11,
    title: '강원관광재단, 맨발걷기 프로그램 운영',
    source: '아주경제',
    date: '2024-05-08',
    category: '언론보도',
    thumbnail: null,
    link: 'https://www.ajunews.com/view/20240508134819150',
  },
  {
    id: 12,
    title: '목포시, 부흥동 둥근공원에 황토맨발길 조성',
    source: '파이낸셜뉴스',
    date: '2024-05-03',
    category: '언론보도',
    thumbnail: null,
    link: 'https://www.fnnews.com/news/202405031446421698',
  },
  // 해외 건강/웰니스 기사 - 신뢰할 수 있는 글로벌 매체
  {
    id: 13,
    title: 'Walking barefoot on grass: 7 health benefits',
    source: 'Times of India',
    date: '2024-12-10',
    category: '해외자료',
    thumbnail: '/images/news/news_walking-barefoot-on-grass.jpg',
    link: 'https://timesofindia.indiatimes.com/life-style/health-fitness/health-news/walking-barefoot-on-grass-in-the-morning-7-health-benefits-from-improved-sleep-to-heart-health/articleshow/125869191.cms',
  },
  {
    id: 14,
    title: 'Why walking barefoot can actually help your feet',
    source: 'National Geographic',
    date: '2024-11-15',
    category: '해외자료',
    thumbnail: '/images/news/news_why-walking-barefoot-help.jpg',
    link: 'https://www.nationalgeographic.com/science/article/why-walking-barefoot-can-actually-help-your-feet',
  },
  {
    id: 15,
    title: '"Ditch your shoes": Why podiatrists advise 5-minute barefoot walking everyday',
    source: 'Economic Times',
    date: '2024-10-20',
    category: '해외자료',
    thumbnail: '/images/news/news_ditch-your-shoes.jpg',
    link: 'https://economictimes.indiatimes.com/news/india/ditch-your-shoes-why-podiatrists-advise-5-minute-barefoot-walking-everyday/boost-circulation-naturally/slideshow/123852206.cms',
  },
]

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-white">
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
