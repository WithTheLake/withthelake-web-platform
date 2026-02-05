import type { Metadata } from 'next'
import { Header, Footer } from '@/components/layout'

export const metadata: Metadata = {
  title: '힐링로드ON - 맨발걷기 워킹 테라피',
  description: '몸과 마음을 위한 워킹 테라피, 걷고 듣고 기록하는 웰니스 루틴',
}

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="pt-14 md:pt-20 font-pretendard">
        {/* 반응형: 각 페이지에서 자체 관리 (max-width 제거) */}
        {children}
      </main>
      <Footer />
    </>
  )
}
