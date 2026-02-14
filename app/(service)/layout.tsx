import type { Metadata } from 'next'
import { Header, Footer } from '@/components/layout'
import { getSiteUrl, getImageUrl } from '@/lib/utils/url'

export const metadata: Metadata = {
  title: '힐링로드ON - 맨발걷기 워킹 테라피',
  description: '몸과 마음을 위한 워킹 테라피, 걷고 듣고 기록하는 웰니스 루틴',
  openGraph: {
    title: '힐링로드ON - 맨발걷기 워킹 테라피',
    description: '몸과 마음을 위한 워킹 테라피, 걷고 듣고 기록하는 웰니스 루틴',
    url: `${getSiteUrl()}/healing`,
    images: [
      {
        url: getImageUrl('/images/healingroadon_banner_2x.jpg'),
        width: 1200,
        height: 630,
        alt: '힐링로드ON - 맨발걷기 워킹 테라피',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '힐링로드ON - 맨발걷기 워킹 테라피',
    description: '몸과 마음을 위한 워킹 테라피, 걷고 듣고 기록하는 웰니스 루틴',
    images: [getImageUrl('/images/healingroadon_banner_2x.jpg')],
  },
}

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20 font-pretendard">
        {/* 반응형: 각 페이지에서 자체 관리 (max-width 제거) */}
        {children}
      </main>
      <Footer />
    </>
  )
}
