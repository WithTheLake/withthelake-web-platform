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
        {/* 모바일: 전체 너비, PC: 중앙 정렬 (적당히 넓게) */}
        <div className="max-w-lg md:max-w-xl mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}
