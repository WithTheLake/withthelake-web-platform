import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Star, Heart, Truck, Shield, Clock } from 'lucide-react'

export const metadata = {
  title: '스토어 - WithTheLake',
  description: '맨발걷기를 위한 프리미엄 제품을 만나보세요.',
}

// 샘플 상품 데이터
const products = [
  {
    id: 1,
    name: '맨발걷기 전용 발 보호 밴드',
    price: 19800,
    originalPrice: 25000,
    rating: 4.8,
    reviews: 127,
    category: '발 보호',
    badge: '베스트',
    image: null,
  },
  {
    id: 2,
    name: '어싱 그라운딩 매트 (실내용)',
    price: 89000,
    originalPrice: 110000,
    rating: 4.9,
    reviews: 89,
    category: '어싱',
    badge: '인기',
    image: null,
  },
  {
    id: 3,
    name: '맨발걷기 전용 세척 스프레이',
    price: 12500,
    originalPrice: null,
    rating: 4.6,
    reviews: 56,
    category: '케어',
    badge: null,
    image: null,
  },
  {
    id: 4,
    name: '휴대용 발 마사지 볼 세트',
    price: 35000,
    originalPrice: 42000,
    rating: 4.7,
    reviews: 203,
    category: '마사지',
    badge: '추천',
    image: null,
  },
  {
    id: 5,
    name: '맨발걷기 기록 다이어리',
    price: 18000,
    originalPrice: null,
    rating: 4.5,
    reviews: 34,
    category: '기록',
    badge: null,
    image: null,
  },
  {
    id: 6,
    name: '프리미엄 어싱 양말 (3켤레)',
    price: 45000,
    originalPrice: 54000,
    rating: 4.8,
    reviews: 167,
    category: '어싱',
    badge: '신상품',
    image: null,
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
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">위드더레이크 스토어</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            맨발걷기 전문가가 엄선한 프리미엄 제품으로
            <br className="hidden md:block" />
            더 건강하고 즐거운 걷기 경험을 만들어보세요
          </p>
        </div>
      </section>

      {/* 혜택 배너 */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Truck size={18} className="text-green-600" />
              <span>5만원 이상 무료배송</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Shield size={18} className="text-green-600" />
              <span>100% 정품 보장</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Clock size={18} className="text-green-600" />
              <span>평일 오후 2시 이전 주문 당일 발송</span>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 필터 */}
      <section className="py-6 bg-white sticky top-16 md:top-20 z-30 border-b">
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
            {products.map((product) => (
              <article
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
              >
                {/* 상품 이미지 */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag size={48} className="text-gray-300" />
                  </div>

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

                  {/* 찜하기 버튼 */}
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Heart size={16} className="text-gray-400" />
                  </button>
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

                  {/* 할인율 */}
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
              </article>
            ))}
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
