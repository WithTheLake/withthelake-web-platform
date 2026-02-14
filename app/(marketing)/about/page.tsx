'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  MapPin,
  Building2,
  Users,
  TrendingUp,
  TreePine,
  MapPinned,
  Activity,
  Smartphone,
  ShoppingBag,
  GraduationCap,
  MessageCircle,
  Award,
  Briefcase,
  Facebook,
  Instagram,
  Youtube,
  ExternalLink,
} from 'lucide-react'

// 스크롤 애니메이션 설정
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }
}

// 섹션 네비게이션 데이터
const sectionNav = [
  { id: 'brand', label: '브랜드' },
  { id: 'values', label: '핵심 가치' },
  { id: 'problems', label: '4대 단절' },
  { id: 'business', label: '사업 영역' },
  { id: 'history', label: '연혁' },
  { id: 'company', label: '회사 정보' },
]

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState('brand')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    sectionNav.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 1. 히어로 섹션 - 보라색 그라데이션 (#410099: 50%→30%→0%) */}
      <section id="hero" className="relative py-16 md:py-32 overflow-hidden scroll-mt-20">
        {/* 보라색 그라데이션 배경 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#410099]/50 via-[#410099]/30 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <p className="text-[#410099] text-base md:text-lg font-medium tracking-widest uppercase mb-4">
              About WithTheLake
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black leading-tight mb-8">
              웰니스 라이프 솔루션<br />
              시니어 헬스케어 기업
            </h1>
            <p className="text-[#410099] text-xl md:text-3xl max-w-3xl mx-auto leading-relaxed">
              "우리는 데이터로 몸을 읽고, 인문학으로 마음을 위로하며,<br className="hidden md:block" />
              사람으로 세상을 따뜻하게 만듭니다."
            </p>
          </motion.div>
        </div>
      </section>

      {/* 섹션 앵커 네비게이션 */}
      <nav className="hidden lg:block sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 h-14">
            {sectionNav.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-5 py-2 text-lg font-medium rounded-full transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-[#410099] text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 2. 브랜드 섹션 - LAKE 의미 */}
      <section id="brand" className="py-12 md:py-24 bg-white scroll-mt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <p className="text-[#410099] text-base md:text-lg font-medium tracking-widest uppercase mb-4">
              Brand Story
            </p>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900">
              LAKE, 우리의 약속
            </h2>
          </motion.div>

          <motion.div {...fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* L - Lively */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <span className="text-7xl md:text-8xl font-bold text-[#410099] mb-4 block">L</span>
              <h3 className="text-2xl font-bold text-[#410099] mb-2">활력(Lively)</h3>
              <p className="text-gray-600 text-lg">
                활력 넘치는 삶을 위한<br />건강관리 솔루션
              </p>
            </div>

            {/* A - Authentic */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <span className="text-7xl md:text-8xl font-bold text-[#410099] mb-4 block">A</span>
              <h3 className="text-2xl font-bold text-[#410099] mb-2">진정성(Authentic)</h3>
              <p className="text-gray-600 text-lg">
                과학적 근거 기반의<br />전문적 서비스
              </p>
            </div>

            {/* K - Kind */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <span className="text-7xl md:text-8xl font-bold text-[#410099] mb-4 block">K</span>
              <h3 className="text-2xl font-bold text-[#410099] mb-2">친절(Kind)</h3>
              <p className="text-gray-600 text-lg">
                따뜻하고 배려하는<br />서비스로 고객 만족
              </p>
            </div>

            {/* E - Empowered */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <span className="text-7xl md:text-8xl font-bold text-[#410099] mb-4 block">E</span>
              <h3 className="text-2xl font-bold text-[#410099] mb-2">자립(Empowered)</h3>
              <p className="text-gray-600 text-lg">
                자기주도적 건강<br />관리 프로그램
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. 핵심 가치 섹션 - Data, Nature, Local (#5eb3e4: 10%) */}
      <section id="values" className="py-12 md:py-24 bg-[#5eb3e4]/10 scroll-mt-36">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-4">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900">
              핵심 가치: Data, Nature, Local
            </h2>
          </motion.div>
          <motion.p {...fadeInUp} className="text-center text-gray-600 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            세 가지 핵심 가치로 웰니스 생태계를 구축합니다.
          </motion.p>

          <motion.div {...fadeInUp} className="grid md:grid-cols-3 gap-6">
            {/* Data */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={48} className="text-[#410099]" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-bold mb-3 text-gray-900">Data(기술)</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                주관적인 느낌이 아닌,<br />
                <strong className="text-[#410099]">객관적인 지표(AI 진단)</strong>로<br />
                건강을 확인합니다.
              </p>
            </div>

            {/* Nature */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TreePine size={48} className="text-[#410099]" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-bold mb-3 text-gray-900">Nature(자연)</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                자연이라는<br />
                <strong className="text-[#410099]">가장 강력한 치유 공간</strong>에서<br />
                회복을 경험합니다.
              </p>
            </div>

            {/* Local */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPinned size={48} className="text-[#410099]" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-bold mb-3 text-gray-900">Local(지역)</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                치유의 경험을 <strong className="text-[#410099]">지역 관광<br />
                산업</strong>과 연결하여 지역 사회에<br />
                활력을 불어넣습니다.
              </p>
            </div>
          </motion.div>

          <motion.p {...fadeInUp} className="text-center text-gray-500 mt-10 text-base md:text-lg max-w-2xl mx-auto">
            데이터는 길을 밝히고, 자연은 치유하며, 지역은 우리를 연결합니다.<br />
            이 세 가지 요소가 어우러져 진정한 웰니스를 만듭니다.
          </motion.p>
        </div>
      </section>

      {/* 4. 4대 단절 섹션 (#5eb3e4: 30%) */}
      <section id="problems" className="py-12 md:py-24 bg-[#5eb3e4]/30 scroll-mt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-4">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900">
              우리가 해결하는 '4대 단절'
            </h2>
          </motion.div>
          <motion.p {...fadeInUp} className="text-center text-gray-600 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            위드더레이크가 수행하는 모든 업무는 이 네 가지 문제를 해결합니다.
          </motion.p>

          <motion.div {...fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* 건강의 단절 */}
            <div className="bg-white rounded-2xl px-6 py-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-4">
                <Activity size={32} className="text-[#410099]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#410099]">건강의 단절(Health Gap)</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                병원 밖 일상 관리 수단의 부재<br />
                <span className="text-[#410099]">→ 바이오 R&D로 해결</span>
              </p>
            </div>

            {/* 관광의 단절 */}
            <div className="bg-white rounded-2xl px-6 py-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-4">
                <MapPinned size={32} className="text-[#410099]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#410099]">관광의 단절(Tourism Gap)</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                하드웨어 중심 관광의 콘텐츠 부족<br />
                <span className="text-[#410099]">→ 힐링로드ON으로 해결</span>
              </p>
            </div>

            {/* 신뢰의 단절 */}
            <div className="bg-white rounded-2xl px-6 py-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-4">
                <MessageCircle size={32} className="text-[#410099]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#410099]">신뢰의 단절(Wellness Gap)</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                비과학적 활동으로 인한 부상 위험<br />
                <span className="text-[#410099]">→ EMARA 기법으로 해결</span>
              </p>
            </div>

            {/* 일자리의 단절 */}
            <div className="bg-white rounded-2xl px-6 py-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-4">
                <Briefcase size={32} className="text-[#410099]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#410099]">일자리의 단절(Job Gap)</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                경력단절여성 및 시니어 일자리 부족<br />
                <span className="text-[#410099]">→ 교육 및 인력양성으로 해결</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. 사업 영역 섹션 (The 4 Pillars) */}
      <section id="business" className="py-12 md:py-24 bg-white scroll-mt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-4">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900">
              사업 영역(The 4 Pillars)
            </h2>
          </motion.div>
          <motion.p {...fadeInUp} className="text-center text-gray-600 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            네 가지 핵심 사업으로 웰니스 생태계를 완성합니다.
          </motion.p>

          <motion.div {...fadeInUp} className="grid md:grid-cols-2 gap-6">
            {/* Bio-Tech */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Activity size={24} className="text-[#410099]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#410099]">[Bio-Tech] 데이터 기반 예방 헬스케어</h3>
              </div>
              <ul className="space-y-2 text-gray-600 text-sm md:text-lg">
                <li className="flex items-start gap-2">
                  <span className="text-[#410099] mt-1">•</span>
                  <span>소변 기반 7종 동시 진단 키트 및 AI RGB 판독 알고리즘</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#410099] mt-1">•</span>
                  <span>반사율 광학 설계로 <strong>95% 이상 정확도</strong> 확보</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#410099] mt-1">•</span>
                  <span>2025 프리팁스(Pre-TIPS) 선정 및 중기부 R&D 디딤돌 과제 수행</span>
                </li>
              </ul>
            </div>

            {/* Content - 힐링로드ON */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Smartphone size={24} className="text-[#410099]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#410099]">[Content] 힐링로드ON</h3>
              </div>
              <ul className="space-y-2 text-gray-600 text-sm md:text-lg">
                <li className="flex items-start gap-2">
                  <span className="text-[#410099] mt-1">•</span>
                  <span><strong>응용언어학 기반</strong>의 워킹 스토리텔링 치유 플랫폼</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#410099] mt-1">•</span>
                  <span>맨발 걷기 오디오 가이드, 인문학 스토리텔링, 긍정확언 사운드</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#410099] mt-1">•</span>
                  <span>앱 설치 없는 <strong>No-App QR 시스템</strong></span>
                </li>
              </ul>
            </div>

            {/* Product - 위드웰미 */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <ShoppingBag size={24} className="text-[#410099]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#410099]">[Product] 위드웰미 (With Well-Me)</h3>
              </div>
              <ul className="space-y-2 text-gray-600 text-sm md:text-lg">
                <li className="flex items-start gap-2">
                  <span className="text-[#410099] mt-1">•</span>
                  <span><strong>'건강한 나를 찾는 여정'</strong>을 돕는 모든 도구</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#410099] mt-1">•</span>
                  <span>신체 케어: 파워 쿨링 미스트, 풋워시 등 풋케어 라인</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#410099] mt-1">•</span>
                  <span>정신 케어: 감정기록 노트, 긍정확언 카드 등 온/오프라인 굿즈</span>
                </li>
              </ul>
            </div>

            {/* People - 전문 인력 양성 */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <GraduationCap size={24} className="text-[#410099]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#410099]">[People] 전문 인력 양성</h3>
              </div>
              <ul className="space-y-2 text-gray-600 text-sm md:text-lg">
                <li className="flex items-start gap-2">
                  <span className="text-[#410099] mt-1">•</span>
                  <span>독자적 언어심리 기법(EMARA)을 숙지한 <strong>전문가 양성</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#410099] mt-1">•</span>
                  <span>늘봄학교(방과후 학교), 생활체육 지자체 프로그램 강사 파견</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#410099] mt-1">•</span>
                  <span>경력단절여성과 시니어에게 <strong>'루틴 코치'</strong> 직업 부여</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. 연혁 섹션 - 라벤더 배경 (#C4CCDF/80) / 포인트: 하늘색(#5eb3e4) */}
      <section id="history" className="py-12 md:py-24 bg-[#C4CCDF]/90 scroll-mt-36">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-4">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900">주요 인증 및 연혁</h2>
          </motion.div>
          <motion.p {...fadeInUp} className="text-center text-gray-600 text-lg md:text-xl mb-12">
            위드더레이크의 성장 여정
          </motion.p>

          <motion.div {...fadeInUp}>
            {/* 타임라인 - 선이 원 중심에서 시작 */}
            <div className="max-w-xl md:max-w-2xl mx-auto">
              <div className="space-y-0">
                {/* 2025.12 - 첫 항목 (강조 원) */}
                <div className="flex gap-5 md:gap-10">
                  <div className="w-20 flex-shrink-0 text-left">
                    <span className="text-[#410099] font-bold text-lg md:text-2xl">2025.12</span>
                  </div>
                  <div className="flex-1 pb-8 pl-8 relative before:absolute before:left-0 before:top-3 before:bottom-2 before:w-0.5 before:bg-[#5eb3e4]/50">
                    <div className="absolute left-[-7.5px] top-1.5 w-4 h-4 bg-[#5eb3e4] rounded-full ring-4 ring-[#5eb3e4]/30" />
                    <h3 className="font-bold text-lg md:text-2xl mb-1 text-gray-900">중기부 프리팁스(Pre-TIPS) 선정</h3>
                  </div>
                </div>

                {/* 2025.11 */}
                <div className="flex gap-5 md:gap-10">
                  <div className="w-20 flex-shrink-0 text-left">
                    <span className="text-[#410099] font-bold text-lg md:text-2xl">2025.11</span>
                  </div>
                  <div className="flex-1 pb-8 pl-8 relative before:absolute before:left-0 before:top-3 before:bottom-2 before:w-0.5 before:bg-[#5eb3e4]/50">
                    <div className="absolute left-[-7.5px] top-1.5 w-4 h-4 bg-[#5eb3e4] rounded-full" />
                    <h3 className="font-bold text-lg md:text-2xl mb-1 text-gray-900">강원특별자치도 예비사회적기업(혼합형) 지정</h3>
                    <p className="text-gray-600 text-sm md:text-lg">강원관광재단 표창장 수상</p>
                  </div>
                </div>

                {/* 2025.07 */}
                <div className="flex gap-5 md:gap-10">
                  <div className="w-20 flex-shrink-0 text-left">
                    <span className="text-[#410099] font-bold text-lg md:text-2xl">2025.07</span>
                  </div>
                  <div className="flex-1 pb-8 pl-8 relative before:absolute before:left-0 before:top-3 before:bottom-2 before:w-0.5 before:bg-[#5eb3e4]/50">
                    <div className="absolute left-[-7.5px] top-1.5 w-4 h-4 bg-[#5eb3e4] rounded-full" />
                    <h3 className="font-bold text-lg md:text-2xl mb-1 text-gray-900">중기부 창업성장기술개발(디딤돌) 과제 선정</h3>
                  </div>
                </div>

                {/* 2025.05 */}
                <div className="flex gap-5 md:gap-10">
                  <div className="w-20 flex-shrink-0 text-left">
                    <span className="text-[#410099] font-bold text-lg md:text-2xl">2025.05</span>
                  </div>
                  <div className="flex-1 pb-8 pl-8 relative before:absolute before:left-0 before:top-3 before:bottom-2 before:w-0.5 before:bg-[#5eb3e4]/50">
                    <div className="absolute left-[-7.5px] top-1.5 w-4 h-4 bg-[#5eb3e4] rounded-full" />
                    <h3 className="font-bold text-lg md:text-2xl mb-1 text-gray-900">강원창조경제혁신센터 강원관광컬처지원사업 선정</h3>
                    <p className="text-gray-600 text-sm md:text-lg">힐링로드ON 프로젝트</p>
                  </div>
                </div>

                {/* 2025.03 */}
                <div className="flex gap-5 md:gap-10">
                  <div className="w-20 flex-shrink-0 text-left">
                    <span className="text-[#410099] font-bold text-lg md:text-2xl">2025.03</span>
                  </div>
                  <div className="flex-1 pb-8 pl-8 relative before:absolute before:left-0 before:top-3 before:bottom-2 before:w-0.5 before:bg-[#5eb3e4]/50">
                    <div className="absolute left-[-7.5px] top-1.5 w-4 h-4 bg-[#5eb3e4] rounded-full" />
                    <h3 className="font-bold text-lg md:text-2xl mb-1 text-gray-900">경북관광기업지원센터 협력기업 선정</h3>
                  </div>
                </div>

                {/* 2024.12 */}
                <div className="flex gap-5 md:gap-10">
                  <div className="w-20 flex-shrink-0 text-left">
                    <span className="text-[#410099] font-bold text-lg md:text-2xl">2024.12</span>
                  </div>
                  <div className="flex-1 pb-8 pl-8 relative before:absolute before:left-0 before:top-3 before:bottom-2 before:w-0.5 before:bg-[#5eb3e4]/50">
                    <div className="absolute left-[-7.5px] top-1.5 w-4 h-4 bg-[#5eb3e4] rounded-full" />
                    <h3 className="font-bold text-lg md:text-2xl mb-1 text-gray-900">특허 출원</h3>
                    <p className="text-gray-600 text-sm md:text-lg">음성기반 운동기록 시스템 등</p>
                  </div>
                </div>

                {/* 2024.07 */}
                <div className="flex gap-5 md:gap-10">
                  <div className="w-20 flex-shrink-0 text-left">
                    <span className="text-[#410099] font-bold text-lg md:text-2xl">2024.07</span>
                  </div>
                  <div className="flex-1 pb-8 pl-8 relative before:absolute before:left-0 before:top-3 before:bottom-2 before:w-0.5 before:bg-[#5eb3e4]/50">
                    <div className="absolute left-[-7.5px] top-1.5 w-4 h-4 bg-[#5eb3e4] rounded-full" />
                    <h3 className="font-bold text-lg md:text-2xl mb-1 text-gray-900">벤처기업 인증(혁신성장유형)</h3>
                  </div>
                </div>

                {/* 2024.02 - 마지막 항목 (선 없음) */}
                <div className="flex gap-5 md:gap-10">
                  <div className="w-20 flex-shrink-0 text-left">
                    <span className="text-[#410099] font-bold text-lg md:text-2xl">2024.02</span>
                  </div>
                  <div className="flex-1 pl-8 relative">
                    <div className="absolute left-[-7.5px] top-1.5 w-4 h-4 bg-[#5eb3e4] rounded-full" />
                    <h3 className="font-bold text-lg md:text-2xl mb-1 text-gray-900">주식회사 위드더레이크 법인 설립</h3>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. 회사 정보 섹션 - 보라색 배경 (#5D4F95) */}
      <section id="company" className="py-12 md:py-24 bg-[#410099]/75 text-white scroll-mt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold">회사 정보</h2>
          </motion.div>

          <motion.div {...fadeInUp} className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* 왼쪽: 회사 정보 + SNS */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Building2 size={20} className="text-[#5eb3e4] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg md:text-xl mb-1">회사명</h3>
                  <p className="text-purple-200 text-base md:text-lg">주식회사 위드더레이크</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users size={20} className="text-[#5eb3e4] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg md:text-xl mb-1">대표</h3>
                  <p className="text-purple-200 text-base md:text-lg">정미경</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-[#5eb3e4] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg md:text-xl mb-1">주소</h3>
                  <p className="text-purple-200 text-base md:text-lg">
                    강원특별자치도 춘천시 후석로 462번길 7<br />
                    춘천 ICT혁신센터 206호
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Award size={20} className="text-[#5eb3e4] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg md:text-xl mb-1">사업자등록번호</h3>
                  <p className="text-purple-200 text-base md:text-lg">469-81-03428</p>
                </div>
              </div>

              {/* 공식 채널 */}
              <div className="pt-6 border-t border-[#5eb3e4]/30">
                <h3 className="font-bold text-lg md:text-xl mb-4">공식 채널</h3>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://www.facebook.com/people/%EC%9C%84%EB%93%9C%EB%8D%94%EB%A0%88%EC%9D%B4%ED%81%AC/61565595385880/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-base md:text-lg"
                    >
                      <Facebook size={16} />
                      Facebook
                    </a>
                    <a
                      href="https://www.instagram.com/withwellme/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-colors text-base md:text-lg"
                    >
                      <Instagram size={16} />
                      Instagram
                    </a>
                    <a
                      href="https://www.youtube.com/channel/UC8vmE6swgfF-PvsVIQUmsOQ/about"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-base md:text-lg"
                    >
                      <Youtube size={16} />
                      YouTube
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://blog.naver.com/with_thelake"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-base md:text-lg"
                    >
                      <ExternalLink size={16} />
                      네이버 블로그
                    </a>
                    <a
                      href="https://cafe.naver.com/healingroadon"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-base md:text-lg"
                    >
                      <Users size={16} />
                      네이버 카페
                    </a>
                    <a
                      href="https://smartstore.naver.com/withlab201"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-base md:text-lg"
                    >
                      <ShoppingBag size={16} />
                      네이버 스토어
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 지도 영역 */}
            <div className="bg-[#5eb3e4]/20 rounded-2xl h-80 md:h-auto flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-[#5eb3e4] mx-auto mb-4" />
                <a
                  href="https://map.naver.com/p/search/%EC%B6%98%EC%B2%9C%20ICT%ED%98%81%EC%8B%A0%EC%84%BC%ED%84%B0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-[#03C75A] text-white rounded-lg text-lg hover:bg-[#02b351] transition-colors"
                >
                  네이버 지도에서 보기
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}