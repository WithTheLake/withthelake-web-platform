import type { Metadata } from 'next'
import { Header, Footer } from '@/components/layout'

export const metadata: Metadata = {
  title: 'WithTheLake - 맨발걷기 커뮤니티',
  description: '액티브 시니어의 웰니스 라이프를 그립니다',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="pt-18 md:pt-24">{children}</main>
      <Footer />
    </>
  )
}
