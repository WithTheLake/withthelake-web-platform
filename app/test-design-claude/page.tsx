'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

// 애니메이션 variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

export default function TestDesignClaudePage() {
  return (
    <div className="min-h-screen bg-white -mt-18 md:-mt-24 font-pretendard">
      {/* Hero Section - 유튜브 비디오 배경 */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* 유튜브 비디오 배경 */}
        <div className="absolute inset-0 pointer-events-none">
          <iframe
            className="absolute w-full h-full scale-110"
            src="https://www.youtube.com/embed/GI4SKsaESc0?autoplay=1&mute=1&loop=1&playlist=GI4SKsaESc0&controls=0&showinfo=0&modestbranding=1&playsinline=1"
            title="Barefoot walking background video"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{
              border: 'none',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* 오버레이 - Stone 톤으로 변경 */}
        <div className="absolute inset-0 bg-stone-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />

        {/* 텍스트 콘텐츠 */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* 태그라인 배지 */}
              <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-emerald-50 font-medium text-sm mb-6">
                Nature & Wellness Platform
              </span>

              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                맨발걷기,
              </h1>
              <p className="text-2xl lg:text-3xl text-white mb-3">
                액티브 시니어의 <span className="text-emerald-300 font-semibold">웰니스 라이프</span>의 첫걸음입니다.
              </p>
              <p className="text-lg text-stone-200 mb-10 max-w-xl leading-relaxed">
                (주)위드더레이크는 맨발걷기를 기반으로
                액티브 시니어의 건강한 웰니스 라이프를 꿈꿉니다.
              </p>

              {/* CTA 버튼 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/healing"
                  className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-900/30 flex items-center justify-center gap-2 group"
                >
                  시작하기
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  더 알아보기
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 스크롤 유도 인디케이터 */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* 액티브 시니어 섹션 */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* 텍스트 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-8 lg:mb-10">
                액티브 시니어
              </h2>
              <div className="text-stone-600 text-base lg:text-lg leading-relaxed space-y-1">
                <p>액티브 시니어는 단순히 은퇴 연령에 이른 세대가 아닌,</p>
                <p>건강하고 활기찬 삶을 추구하는 새로운 세대입니다.</p>
                <p>그들은 자신들의 삶을 주도적으로 설계하고,</p>
                <p>다양한 경험을 쌓으며, 사회에 기여하는 긍정적이고</p>
                <p>생산적인 삶을 살고 있습니다.</p>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-8 lg:mt-10 text-base lg:text-lg font-semibold text-emerald-700 hover:text-emerald-800 transition-colors border-b-2 border-emerald-700 pb-1"
              >
                더 자세히 알아보기
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            {/* 이미지 - 플로팅 카드 추가 */}
            <motion.div
              className="relative flex justify-center lg:justify-end mt-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                {/* 배경 장식 */}
                <div className="absolute -inset-4 bg-emerald-100 rounded-[2rem] rotate-3 -z-10" />

                <Image
                  src="/images/active-senior.png"
                  alt="액티브 시니어"
                  width={500}
                  height={600}
                  className="h-auto w-[320px] lg:w-[450px] rounded-2xl shadow-xl"
                  priority
                />

                {/* 플로팅 카드 */}
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-stone-100 max-w-[200px]"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 text-lg">💚</span>
                    </div>
                    <span className="font-bold text-stone-800 text-sm">건강 수명 연장</span>
                  </div>
                  <p className="text-xs text-stone-500">규칙적인 맨발걷기로 혈액순환 개선</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5가지 프로젝트 섹션 */}
      <section className="py-20 lg:py-28 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* 좌측 텍스트 */}
            <motion.div
              className="lg:col-span-4 flex flex-col justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <span className="text-emerald-600 font-bold tracking-wide uppercase text-sm mb-3">
                Our Projects
              </span>
              <h3 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-6 leading-tight">
                액티브 시니어를 위한<br/>
                <span className="text-emerald-700 relative inline-block">
                  5가지 약속
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-emerald-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h3>
              <p className="text-stone-600 text-base leading-relaxed mb-8">
                단순히 걷는 것을 넘어, 삶의 활력을 되찾고
                더 건강한 내일을 맞이할 수 있도록
                위드더레이크가 체계적인 솔루션을 제공합니다.
              </p>
              <Link
                href="/about"
                className="self-start text-emerald-700 font-bold border-b-2 border-emerald-700 pb-1 hover:text-emerald-900 hover:border-emerald-900 transition-colors"
              >
                프로젝트 전체보기
              </Link>
            </motion.div>

            {/* 우측 카드 그리드 */}
            <motion.div
              className="lg:col-span-8 grid md:grid-cols-2 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                { icon: "👤", title: "맞춤형 건강관리", desc: "개인의 건강상태를 분석하여 가장 적합한 솔루션을 제공합니다." },
                { icon: "🌐", title: "온라인 헬스케어", desc: "언제 어디서나 건강을 관리할 수 있는 디지털 솔루션을 제공합니다." },
                { icon: "🏠", title: "홈케어 기반 헬스케어", desc: "가정에서도 손쉽게 실천할 수 있는 건강 관리 프로그램을 제공합니다." },
                { icon: "👥", title: "커뮤니티 기반 헬스케어", desc: "함께 걷고 소통하며 건강을 증진시키는 커뮤니티 활동을 지원합니다." },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors duration-300">
                    <span className="text-2xl group-hover:grayscale group-hover:brightness-200 transition-all">{item.icon}</span>
                  </div>
                  <h4 className="text-lg font-bold text-stone-800 mb-2">{item.title}</h4>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3가지 방법 섹션 */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-16">
          {/* 제목 */}
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <p className="text-2xl lg:text-4xl text-stone-900 mb-2">
              우리는 <span className="text-emerald-600 font-bold">3가지 방법</span>으로 맨발걷기 기반의
            </p>
            <p className="text-2xl lg:text-4xl text-stone-900">
              액티브 시니어 웰니스 라이프를 그립니다.
            </p>
          </motion.div>

          {/* 3개 카드 */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                title: "액티브 시니어 웰니스 플랫폼",
                items: ["맨발걷기 트래킹 및 커뮤니티 플랫폼", "맨발걷기 AI 맞춤형 코스 추천", "웰니스 제품 쇼핑몰 운영", "GPS 기반 코스 기록"],
                image: "/images/withwellme.png",
                imageAlt: "WITH well ME"
              },
              {
                title: "맨발걷기 키트 개발 및 판매",
                items: ["맨발걷기 초심자를 위한 스타터키트", "맨발걷기 후용 위한 애프터 키트", "맨발을 위한 뷰티 제품 개발", "고급차 및 장식물 위한 제품 개발"],
                image: "/images/walkkit.png",
                imageAlt: "워킹 키트"
              },
              {
                title: "맨발걷기 오프라인 프로그램",
                items: ["맨발걷기 강사 자격증 취득", "지역기반 맨발걷기 모임 개설", "맨발걷기 코스 개척", "오프라인 커뮤니티 개설 및 운영"],
                image: "/images/barefoot.png",
                imageAlt: "맨발"
              }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-stone-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <h4 className="text-xl font-bold text-stone-900 mb-4 group-hover:text-emerald-700 transition-colors">
                  {card.title}
                </h4>
                <ul className="text-stone-600 text-sm space-y-2 mb-6">
                  {card.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-center">
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    width={200}
                    height={150}
                    className="object-contain h-[120px] w-auto"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 앱 다운로드 섹션 */}
      <section className="py-16 bg-stone-100">
        <div className="mx-4 lg:mx-10 py-16 lg:py-20 px-6 lg:px-20 bg-stone-900 rounded-3xl relative overflow-hidden">
          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/20 blur-3xl rounded-full translate-x-1/2" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 텍스트 & 다운로드 버튼 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <span className="inline-block px-4 py-1.5 bg-emerald-600 text-white rounded-full text-sm font-medium mb-6">
                맨발루 앱 다운로드
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                맨발걷기 커뮤니티<br />
                <span className="text-emerald-400">맨발루</span>를 만나보세요
              </h2>
              <p className="text-base text-stone-300 mb-10 leading-relaxed">
                가까운 황토길 찾기부터 걷기 기록, 커뮤니티까지.<br/>
                지금 바로 스마트폰에서 만나보세요.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://apps.apple.com/kr/app/맨발루/id6651824430"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl px-4 py-2 hover:bg-stone-100 transition-colors"
                >
                  <Image
                    src="/images/downonappstore.png"
                    alt="Download on the App Store"
                    width={140}
                    height={42}
                    className="h-10 w-auto"
                  />
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=com.apppp.menbaloo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-transparent border border-stone-600 rounded-xl px-4 py-2 hover:bg-stone-800 transition-colors"
                >
                  <Image
                    src="/images/getitongoogleplay.png"
                    alt="Get it on Google Play"
                    width={140}
                    height={42}
                    className="h-10 w-auto"
                  />
                </a>
              </div>
            </motion.div>

            {/* 앱 스크린샷 */}
            <motion.div
              className="relative flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                {/* Glow 효과 */}
                <div className="absolute inset-0 bg-emerald-500/30 blur-3xl -z-10 transform scale-110" />

                <Image
                  src="/images/menbaloo.png"
                  alt="맨발루 앱"
                  width={350}
                  height={350}
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
