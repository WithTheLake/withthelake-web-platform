import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Star } from 'lucide-react'

export const metadata = {
  title: '스토어 - WithTheLake',
  description: '맨발걷기를 위한 프리미엄 제품을 만나보세요.',
}

// 네이버 스토어 기본 URL
const NAVER_STORE_BASE_URL = 'https://smartstore.naver.com/withlab201'

// 상품 데이터 (네이버스토어 연동)
// 새 상품 추가 시: naverProductUrl에 전체 링크, image에 /images/ 경로 이미지 추가
const products = [
  {
    id: 1,
    name: '[위드웰미] 데일리 파워 쿨링 미스트 100ml 풋미스트 발관리',
    price: 37800,
    originalPrice: 42000,
    rating: 5.0,
    reviews: 18,
    category: '케어',
    badge: '베스트',
    image: '/images/withwellme_powercoolingmist.jpg',
    naverProductUrl: 'https://smartstore.naver.com/withlab201/products/12254246304',
  },
  {
    id: 2,
    name: '[위드웰미] 데일리 풋샴푸 풋워시 200ml 지장수 맨발걷기 발세정제',
    price: 17820,
    originalPrice: 19800,
    rating: 5.0,
    reviews: 19,
    category: '케어',
    badge: '인기',
    image: '/images/withwellme_dailyfootwash.jpg',
    naverProductUrl: 'https://smartstore.naver.com/withlab201/products/12248115925',
  },
  {
    id: 3,
    name: '[숨토프랜드] 어싱 패드 접지 전자파차단 맨발걷기 맨땅밟기 매트 슈퍼싱글 퀸',
    price: 270000,
    originalPrice: null,
    rating: 0.0,
    reviews: 0,
    category: '어싱',
    badge: null,
    image: '/images/soomtofriend_earthingpad.jpg',
    naverProductUrl: 'https://smartstore.naver.com/withlab201/products/12362102946',
  },
  {
    id: 4,
    name: '[숨토프랜드] 접지 어싱 베개 커버 숙면 맨발걷기 효과 힐링 60X70cm',
    price: 60000,
    originalPrice: null,
    rating: 0.0,
    reviews: 0,
    category: '어싱',
    badge: '추천',
    image: '/images/soomtofriend_earthingcover.jpg',
    naverProductUrl: 'https://smartstore.naver.com/withlab201/products/12314861939',
  },
  {
    id: 5,
    name: '[힐링로드ON] 태백 웰니스 걷기 투어 (당일형)',
    price: 10000,
    originalPrice: null,
    rating: 0.0,
    reviews: 0,
    category: '기록',
    badge: null,
    image: '/images/withwellme_logo1.jpeg',
    naverProductUrl: 'https://smartstore.naver.com/withlab201/products/12679438666',
  },
  {
    id: 6,
    name: '맨발걷기 기록 다이어리',
    price: 18000,
    originalPrice: null,
    rating: 4.5,
    reviews: 34,
    category: '기록',
    badge: null,
    image: null,
    naverProductUrl: null,
  },
  {
    id: 7,
    name: '프리미엄 어싱 양말 (3켤레)',
    price: 45000,
    originalPrice: 54000,
    rating: 4.8,
    reviews: 167,
    category: '어싱',
    badge: '신상품',
    image: null,
    naverProductUrl: null,
  },
]

const categories = ['전체', '발 보호', '어싱', '케어', '마사지', '기록']

const badgeColors: Record<string, string> = {
  베스트: 'bg-red-500 text-white',
  인기: 'bg-orange-500 text-white',
  추천: 'bg-blue-500 text-white',
  신상품: 'bg-green-500 text-white',
}

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR')
}

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 - 이미지 배너 (중앙 정렬) */}
      <section className="bg-white py-4 md:py-6">
        <div className="max-w-lg mx-auto px-4">
          <div className="relative w-full aspect-[3/1] rounded-xl overflow-hidden ">
            <Image
              src="/images/withwellme-market_logo.jpg"
              alt="위드웰미 마켓 - 맨발걷기를 위한 프리미엄 제품"
              fill
              className="object-contain bg-white"
              priority
            />
          </div>
        </div>
      </section>

      {/* 카테고리 필터 */}
      <section className="py-6 bg-white sticky top-16 md:top-20 z-30 border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                  index === 0
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 상품 그리드 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => {
              // 네이버스토어 상품 링크 생성 (전체 URL 또는 기본 스토어)
              const productUrl = product.naverProductUrl || NAVER_STORE_BASE_URL

              return (
                <Link
                  key={product.id}
                  href={productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1"
                >
                  <article>
                    {/* 상품 이미지 */}
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoppingBag size={48} className="text-gray-300" />
                        </div>
                      )}

                      {/* 뱃지 */}
                      {product.badge && (
                        <span
                          className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold ${
                            badgeColors[product.badge]
                          }`}
                        >
                          {product.badge}
                        </span>
                      )}

                    </div>

                    {/* 상품 정보 */}
                    <div className="p-4">
                      <span className="text-xs text-gray-500 mb-1 block">
                        {product.category}
                      </span>
                      <h3 className="font-medium text-gray-900 text-sm md:text-base mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {product.name}
                      </h3>

                      {/* 평점 */}
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {product.rating}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({product.reviews})
                        </span>
                      </div>

                      {/* 가격 */}
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-lg text-gray-900">
                          {formatPrice(product.price)}원
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}원
                          </span>
                        )}
                      </div>

                      {/* 할인율 (고정 높이로 간격 일정하게) */}
                      <div className="h-5">
                        {product.originalPrice && (
                          <span className="text-sm text-red-500 font-medium">
                            {Math.round(
                              ((product.originalPrice - product.price) /
                                product.originalPrice) *
                                100
                            )}
                            % 할인
                          </span>
                        )}
                      </div>

                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 준비 중 안내 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            스토어 오픈 준비 중입니다
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            더 좋은 제품으로 찾아뵙기 위해 준비 중입니다.
            <br />
            오픈 소식을 받아보시려면 아래 버튼을 눌러주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors">
              오픈 알림 신청하기
            </button>
            <Link
              href="/healing"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              힐링로드 ON 체험하기
            </Link>
          </div>
        </div>
      </section>

      {/* 입점 문의 */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            입점 및 제휴 문의
          </h3>
          <p className="text-gray-600 mb-4">
            맨발걷기 관련 제품 입점을 원하시는 분은 아래 이메일로 연락주세요
          </p>
          <a
            href="mailto:store@withthelake.com"
            className="text-green-600 font-medium hover:underline"
          >
            store@withthelake.com
          </a>
        </div>
      </section>
    </div>
  )
}
