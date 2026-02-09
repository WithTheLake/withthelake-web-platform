import type { Metadata } from 'next'
import Image from 'next/image'
import StoreClient from './StoreClient'
import { getStoreProducts, getStoreCategories } from '@/actions/storeActions'
import { getSiteUrl, getImageUrl } from '@/lib/utils/url'

export const metadata: Metadata = {
  title: '스토어 - WithTheLake',
  description: '맨발걷기를 위한 프리미엄 제품을 만나보세요.',
  openGraph: {
    title: '스토어 - WithTheLake',
    description: '맨발걷기를 위한 프리미엄 제품을 만나보세요.',
    url: `${getSiteUrl()}/store`,
    images: [
      {
        url: getImageUrl('/images/withwellme-market_logo.jpg'),
        width: 1200,
        height: 630,
        alt: 'WithWellMe 마켓 - 맨발걷기 프리미엄 제품',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '스토어 - WithTheLake',
    description: '맨발걷기를 위한 프리미엄 제품을 만나보세요.',
    images: [getImageUrl('/images/withwellme-market_logo.jpg')],
  },
}

export default async function StorePage() {
  // DB에서 상품 데이터 및 카테고리 조회
  const [{ data: products }, storeCategories] = await Promise.all([
    getStoreProducts(),
    getStoreCategories(),
  ])

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 히어로 섹션 - 이미지 배너 (중앙 정렬) */}
      <section className="bg-white py-4 md:py-6">
        <div className="max-w-xl mx-auto px-4">
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
      <StoreClient products={products} categories={storeCategories} />
    </div>
  )
}
