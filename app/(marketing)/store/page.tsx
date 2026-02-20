import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import StoreClient from './StoreClient'
import { getStoreProducts, getStoreCategories } from '@/actions/storeActions'
import { getSiteUrl, getImageUrl } from '@/lib/utils/url'
import { ProductListSkeleton } from '@/components/ui/Skeleton'

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

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 히어로 섹션 - 즉시 렌더링 */}
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

      {/* 데이터 로딩 영역 - 스트리밍 */}
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><ProductListSkeleton /></div>}>
        <StoreContent />
      </Suspense>
    </div>
  )
}

async function StoreContent() {
  const [{ data: products }, storeCategories] = await Promise.all([
    getStoreProducts(),
    getStoreCategories(),
  ])

  return <StoreClient products={products} categories={storeCategories} />
}
