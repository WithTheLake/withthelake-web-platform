import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import StoreClient from './StoreClient'
import { getStoreProducts } from '@/actions/storeActions'

export const metadata: Metadata = {
  title: '스토어 - WithTheLake',
  description: '맨발걷기를 위한 프리미엄 제품을 만나보세요.',
}

export default async function StorePage() {
  // DB에서 상품 데이터 조회
  const { data: products } = await getStoreProducts()

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

      {/* 클라이언트 컴포넌트: 카테고리 필터 + 상품 그리드 */}
      <StoreClient products={products} />

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
