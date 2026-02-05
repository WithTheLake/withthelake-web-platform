'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Brain, Zap, Leaf, CheckCircle, ArrowRight, ExternalLink, BookOpen, AlertTriangle } from 'lucide-react'

// 스크롤 애니메이션 설정
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }
}

// 섹션 네비게이션 데이터
const sectionNav = [
  { id: 'definition', label: '맨발걷기란' },
  { id: 'benefits', label: '효과' },
  { id: 'method', label: '올바른 방법' },
  { id: 'caution', label: '주의사항' },
  { id: 'research', label: '연구자료' },
]

// 연구 자료 데이터
const researchArticles = [
  {
    id: 1,
    title: 'Why walking barefoot can actually help your feet',
    source: 'National Geographic',
    category: '발 건강·근력',
    description: '맨발걷기가 발 근력 개선, 균형감 향상, 걷기 패턴 개선에 도움이 된다는 연구 결과 소개',
    link: 'https://www.nationalgeographic.com/science/article/why-walking-barefoot-can-actually-help-your-feet',
  },
  {
    id: 2,
    title: 'Barefoot walking improves cognitive ability in adolescents',
    source: 'PubMed (임상연구)',
    category: '뇌 기능·인지',
    description: '12주간 맨발걷기 운동 후 인지 속도 및 집중력 향상, 뇌 스트레스 감소 관찰',
    link: 'https://pubmed.ncbi.nlm.nih.gov/38926837/',
  },
  {
    id: 3,
    title: 'Barefoot walking is beneficial for plantar heel pain',
    source: 'PubMed (RCT 연구)',
    category: '통증 관리',
    description: '발바닥 통증 환자에서 맨발걷기 그룹이 통증 완화, 기능 개선, 삶의 질 향상을 보임',
    link: 'https://pubmed.ncbi.nlm.nih.gov/38118297/',
  },
  {
    id: 4,
    title: 'Effects of Barefoot Walking on Menopausal Symptoms',
    source: 'PubMed (임상연구)',
    category: '웰니스·수면',
    description: '중년 여성에서 폐경기 증상 완화, 스트레스 감소, 수면 질 향상 효과 관찰',
    link: 'https://pubmed.ncbi.nlm.nih.gov/41302225/',
  },
  {
    id: 5,
    title: 'Effects of Barefoot Walking on CRP, IFNγ, and Serotonin',
    source: 'MDPI (학술지)',
    category: '면역·생리',
    description: '숲속 맨발걷기 후 염증 지표, 면역 관련 물질, 세로토닌 수치 변화 관찰',
    link: 'https://www.mdpi.com/2227-9032/12/23/2372',
  },
  {
    id: 6,
    title: 'Grounding and inflammation research',
    source: 'PMC (NIH)',
    category: '염증·자가면역',
    description: '접지(Grounding)가 염증, 면역 반응, 상처 치유에 미치는 영향에 대한 통합 리뷰',
    link: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4378297/',
  },
]

const categoryColors: Record<string, string> = {
  '발 건강·근력': 'bg-green-100 text-green-700',
  '뇌 기능·인지': 'bg-purple-100 text-purple-700',
  '통증 관리': 'bg-red-100 text-red-700',
  '웰니스·수면': 'bg-blue-100 text-blue-700',
  '면역·생리': 'bg-amber-100 text-amber-700',
  '염증·자가면역': 'bg-orange-100 text-orange-700',
}

export default function InfoPage() {
  const [activeSection, setActiveSection] = useState('definition')

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
      {/* 히어로 섹션 - 밝은 배경 */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-green-100/70 to-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-dots.png')] opacity-5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
            <Leaf size={16} />
            Earthing / Grounding
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            맨발걷기의 모든 것
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            땅과 연결되어 자연의 에너지를 느끼는<br className="hidden md:block" />
            가장 원초적이고 효과적인 건강법
          </p>
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
                className={`px-5 py-2 text-base font-medium rounded-full transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 맨발걷기란? */}
      <section id="definition" className="py-16 md:py-24 scroll-mt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center">
            <p className="text-green-600 text-sm font-medium tracking-widest uppercase mb-4">What is Barefoot Walking?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">맨발걷기란?</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                <strong className="text-gray-900">맨발걷기(Earthing/Grounding)</strong>는 신발 없이 자연 표면을 걷는 활동으로,
                발바닥의 감각 수용체를 직접 자극하여 <strong className="text-gray-900">근력·균형·보행 메커니즘</strong>을
                개선할 수 있다는 연구가 있습니다.
              </p>
              <p>
                인체가 지구의 자연 전하와 직접 연결됨으로써 다양한 건강 효과를 얻을 수 있으며,
                현대인이 신발과 건물로 인해 잃어버린 땅과의 연결을 회복하는 방법입니다.
              </p>
            </div>
            <a
              href="https://www.nationalgeographic.com/science/article/why-walking-barefoot-can-actually-help-your-feet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-10 text-green-600 font-medium hover:underline"
            >
              <BookOpen size={18} />
              National Geographic 기사 보기
              <ExternalLink size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* 과학적 효과 */}
      <motion.section {...fadeInUp} id="benefits" className="py-16 md:py-24 bg-gray-50 scroll-mt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-green-600 text-sm font-medium tracking-widest uppercase mb-4">Scientific Benefits</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">과학적으로 보고된 효과</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              다양한 연구에서 맨발걷기의 긍정적 효과가 보고되고 있습니다.<br />
              아래 내용은 연구 결과를 요약한 것이며, 개인에 따라 효과가 다를 수 있습니다.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5">
                <Leaf size={28} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">발·다리 근력 강화</h3>
              <p className="text-gray-600 text-base mb-4 flex-1">
                구속 없는 움직임과 센서 자극이 발 근육 및 균형성 개선에 도움을 줍니다.
              </p>
              <a
                href="https://www.nationalgeographic.com/science/article/why-walking-barefoot-can-actually-help-your-feet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:underline flex items-center gap-1 mt-auto"
              >
                National Geographic <ExternalLink size={12} />
              </a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-5">
                <Brain size={28} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">인지 기능 향상</h3>
              <p className="text-gray-600 text-base mb-4 flex-1">
                12주간 맨발걷기 후 인지 속도 및 집중력 향상, 뇌 스트레스 감소가 관찰되었습니다.
              </p>
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/38926837/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:underline flex items-center gap-1 mt-auto"
              >
                PubMed 연구 <ExternalLink size={12} />
              </a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <Heart size={28} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">스트레스·수면 개선</h3>
              <p className="text-gray-600 text-base mb-4 flex-1">
                스트레스 감소, 수면 질 향상, 삶의 질 개선 효과가 연구에서 보고되었습니다.
              </p>
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/41302225/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-auto"
              >
                PubMed 연구 <ExternalLink size={12} />
              </a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
                <Zap size={28} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">염증·면역 반응</h3>
              <p className="text-gray-600 text-base mb-4 flex-1">
                맨발걷기 후 염증 지표 변화, 면역 관련 물질 반응이 관찰되었습니다.
              </p>
              <a
                href="https://www.mdpi.com/2227-9032/12/23/2372"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber-600 hover:underline flex items-center gap-1 mt-auto"
              >
                MDPI 학술지 <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 올바른 맨발걷기 방법 */}
      <motion.section {...fadeInUp} id="method" className="py-16 md:py-24 scroll-mt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-green-600 text-sm font-medium tracking-widest uppercase mb-4">How to Practice</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">올바른 맨발걷기 방법</h2>
          </div>

          {/* 타임라인 스타일 */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* 연결선 */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-200 hidden md:block" />

              <div className="space-y-8">
                {[
                  {
                    step: 1,
                    title: '장소 선택',
                    desc: '흙, 잔디, 모래 등 자연 바닥이 좋습니다. 유리 조각이나 날카로운 물체가 없는 안전한 장소를 선택하세요.',
                    icon: '🌿'
                  },
                  {
                    step: 2,
                    title: '점진적 적응',
                    desc: '처음에는 5~10분 정도로 짧게 시작하여 점차 시간을 늘려가세요. 전문가들은 점진적 적응을 권장합니다.',
                    icon: '⏱️'
                  },
                  {
                    step: 3,
                    title: '자세와 호흡',
                    desc: '허리를 곧게 펴고, 발 전체로 땅을 딛듯이 걸으세요. 깊은 호흡을 하며 자연의 소리와 향기를 느껴보세요.',
                    icon: '🧘'
                  },
                  {
                    step: 4,
                    title: '마무리 관리',
                    desc: '걷기가 끝나면 발을 깨끗이 씻고 보습제를 발라주세요. 발바닥에 상처가 있는지 확인하고 관리해 주세요.',
                    icon: '✨'
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-6 items-start relative">
                    {/* 스텝 번호 */}
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg z-10 shadow-lg">
                      {item.step}
                    </div>
                    {/* 내용 */}
                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{item.icon}</span>
                        <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 주의사항 */}
      <motion.section {...fadeInUp} id="caution" className="py-16 md:py-24 bg-amber-50 scroll-mt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
              <AlertTriangle size={16} />
              Safety First
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">주의사항</h2>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5">
            {[
              { title: '당뇨병 환자', desc: '발에 감각이 둔한 경우 상처를 인지하지 못할 수 있으니 의사와 상담 후 진행하세요.' },
              { title: '극단적 날씨', desc: '너무 뜨겁거나 차가운 바닥은 피하세요. 화상이나 동상의 위험이 있습니다.' },
              { title: '상처·감염 위험', desc: '발에 상처가 있으면 감염 위험이 있으니 완치 후 맨발걷기를 하세요.' },
              { title: '의료 대체 불가', desc: '맨발걷기는 질병 치료를 대체할 수 없습니다. 건강 문제가 있으면 전문의와 상담하세요.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <CheckCircle size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-2 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            ※ 이 페이지의 정보는 의학적 조언이 아닙니다. 개인의 건강 상태에 따라 전문가와 상담하시기 바랍니다.
          </p>
        </div>
      </motion.section>

      {/* 관련 연구 자료 */}
      <motion.section {...fadeInUp} id="research" className="py-16 md:py-24 scroll-mt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-green-600 text-sm font-medium tracking-widest uppercase mb-4">Research & Articles</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">관련 연구 자료</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              맨발걷기와 어싱(Earthing)에 대한 과학적 연구와 신뢰할 수 있는 매체의 기사입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {researchArticles.map((article) => (
              <a
                key={article.id}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || 'bg-gray-100 text-gray-700'}`}>
                    {article.category}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-2 min-h-[3rem]">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
                  {article.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-gray-400">{article.source}</span>
                  <ExternalLink size={14} className="text-gray-300 group-hover:text-green-500" />
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-green-600 font-semibold text-lg hover:underline"
            >
              맨발걷기 관련 뉴스 더보기
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section {...fadeInUp} className="py-16 md:py-24 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            지금 맨발걷기를 시작해보세요
          </h2>
          <p className="text-xl text-green-100 mb-8">
            힐링로드 ON과 함께 전문 가이드 음성을 들으며
            <br />
            안전하고 효과적인 맨발걷기를 경험하세요
          </p>
          <Link
            href="/healing"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-green-600 rounded-full font-bold text-xl hover:bg-gray-100 transition-colors"
          >
            힐링로드 ON 시작하기
            <ArrowRight size={24} />
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
