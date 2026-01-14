'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight, Leaf, Activity, Users, Home, Heart, Download, Menu, ChevronDown, Check } from 'lucide-react'

// --- Mock Components for Test Design ---

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Area */}
        <div className="flex items-center gap-2">
           {/* 로고 대신 텍스트로 컨셉 표현 (실제 로고 이미지는 그대로 사용 가능) */}
           <span className="text-2xl font-bold text-emerald-900 tracking-tight">WithTheLake</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {['힐링로드ON', '기업 소개', '커뮤니티', '뉴스', '스토어'].map((item) => (
            <a key={item} href="#" className="text-stone-600 hover:text-emerald-700 font-medium transition-colors text-sm">
              {item}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button className="px-5 py-2.5 bg-emerald-700 text-white rounded-full font-semibold text-sm hover:bg-emerald-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
            앱 다운로드 <Download size={16} />
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden p-2 text-stone-600">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  )
}

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Video Mockup */}
      <div className="absolute inset-0 z-0">
         <iframe
            className="absolute w-full h-full scale-110 object-cover"
            src="https://www.youtube.com/embed/GI4SKsaESc0?autoplay=1&mute=1&loop=1&playlist=GI4SKsaESc0&controls=0&showinfo=0&modestbranding=1&playsinline=1"
            title="Nature Background"
            allow="autoplay; encrypted-media"
            style={{ pointerEvents: 'none' }}
          />
        <div className="absolute inset-0 bg-stone-900/30" /> {/* Warm overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-4 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-emerald-50 font-medium text-sm mb-6">
            Nature & Wellness Platform
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            자연과 함께 걷는<br />
            <span className="text-emerald-300">치유의 시간</span>
          </h1>
          <p className="text-xl md:text-2xl text-stone-100 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            맨발걷기를 통해 액티브 시니어의<br className="md:hidden"/> 건강한 내일을 만들어갑니다.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-900/20 flex items-center justify-center gap-2 group">
              시작하기
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center">
              더 알아보기
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown size={24} />
      </motion.div>
    </section>
  )
}

const FeatureCard = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors duration-300">
        <Icon size={28} className="text-emerald-600 group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-bold text-stone-800 mb-3">{title}</h3>
      <p className="text-stone-500 leading-relaxed text-sm">
        {desc}
      </p>
    </motion.div>
  )
}

const ProjectsSection = () => {
  const features = [
    {
      icon: Activity,
      title: "맞춤형 건강관리",
      desc: "개인의 건강 데이터를 정밀 분석하여 현재 상태에 가장 적합한 걷기 코스와 강도를 추천해 드립니다."
    },
    {
      icon: Home,
      title: "홈케어 헬스케어",
      desc: "집에서도 손쉽게 실천할 수 있는 스트레칭과 맨발 걷기 준비 운동 프로그램을 제공합니다."
    },
    {
      icon: Users,
      title: "커뮤니티 활동",
      desc: "비슷한 관심사를 가진 이웃들과 함께 걷고 소통하며 정서적 유대감과 건강을 함께 챙기세요."
    },
    {
      icon: Leaf,
      title: "맨발걷기 프로그램",
      desc: "전국 방방곡곡 숨겨진 황토길과 숲길을 발굴하고, 올바른 보행법을 교육합니다."
    }
  ]

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Text Content */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-emerald-600 font-bold tracking-wide uppercase text-sm mb-3">Our Projects</h2>
              <h3 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-6 leading-tight">
                액티브 시니어를 위한<br/>
                <span className="text-emerald-700 relative inline-block">
                  5가지 약속
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-emerald-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h3>
              <p className="text-stone-600 text-lg mb-8 leading-relaxed">
                단순히 걷는 것을 넘어, 삶의 활력을 되찾고<br/>
                더 건강한 내일을 맞이할 수 있도록<br/>
                위드더레이크가 체계적인 솔루션을 제공합니다.
              </p>
              <button className="self-start text-emerald-700 font-bold border-b-2 border-emerald-700 pb-1 hover:text-emerald-900 hover:border-emerald-900 transition-colors">
                프로젝트 전체보기
              </button>
            </motion.div>
          </div>

          {/* Feature Grid */}
          <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const LifestyleSection = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Area - Conceptual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-emerald-100 rounded-[2rem] rotate-3" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-stone-200 aspect-[4/3]">
              <Image 
                src="/images/active-senior.png" 
                alt="Active Senior" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="font-bold text-2xl">새로운 전성기</p>
                  <p className="text-stone-200">나이는 숫자에 불과합니다.</p>
                </div>
              </div>
            </div>
            
            {/* Float Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-stone-100 max-w-xs"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                  <Heart size={20} fill="currentColor" />
                </div>
                <span className="font-bold text-stone-800">건강 수명 연장</span>
              </div>
              <p className="text-xs text-stone-500">규칙적인 맨발걷기는 혈액순환 개선과 스트레스 감소에 탁월한 효과가 있습니다.</p>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <div>
            <h2 className="text-4xl font-bold text-stone-900 mb-8 leading-tight">
              액티브 시니어,<br/>
              <span className="text-stone-500">주체적인 삶을 디자인하다</span>
            </h2>
            <div className="space-y-6">
              {[
                "은퇴 후에도 멈추지 않는 열정적인 삶",
                "자신을 위한 투자와 건강한 라이프스타일",
                "사회와 소통하며 긍정적인 영향력을 전파"
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Check size={20} />
                  </div>
                  <span className="text-lg text-stone-700 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
            <p className="mt-10 text-stone-500 leading-relaxed">
              위드더레이크는 시니어 세대가 단순히 노년을 보내는 것이 아니라, 
              제2의 인생을 활기차게 설계할 수 있도록 돕는 든든한 파트너입니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const AppDownloadSection = () => {
  return (
    <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/20 blur-3xl rounded-full translate-x-1/2" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <span className="text-emerald-400 font-bold tracking-wider text-sm mb-2 block">DOWNLOAD APP</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              맨발걷기의 모든 것,<br />
              <span className="text-emerald-400">맨발루</span>와 함께하세요
            </h2>
            <p className="text-stone-300 mb-10 text-lg">
              가까운 황토길 찾기부터 걷기 기록, 커뮤니티까지.<br/>
              지금 바로 스마트폰에서 만나보세요.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-stone-900 px-6 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-stone-100 transition-colors">
                 <Image src="/images/downonappstore.png" alt="App Store" width={120} height={36} className="w-auto h-8" />
              </button>
              <button className="bg-transparent border border-stone-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-stone-800 transition-colors">
                 <Image src="/images/getitongoogleplay.png" alt="Google Play" width={120} height={36} className="w-auto h-8" />
              </button>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center relative">
             <div className="relative w-72 h-[500px]">
                {/* Mock Phone Frame */}
                <div className="absolute inset-0 bg-stone-800 rounded-[3rem] border-8 border-stone-700 shadow-2xl z-20 overflow-hidden">
                    <Image src="/images/menbaloo.png" alt="App Screen" fill className="object-cover" />
                </div>
                {/* Glow behind phone */}
                <div className="absolute inset-0 bg-emerald-500/50 blur-3xl -z-10 transform scale-110" />
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const Footer = () => {
    return (
        <footer className="bg-white border-t border-stone-100 py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-stone-400 text-sm">
                    © 2026 WithTheLake. All rights reserved.
                </div>
                <div className="flex gap-6">
                    <a href="#" className="text-stone-500 hover:text-emerald-600 text-sm">이용약관</a>
                    <a href="#" className="text-stone-500 hover:text-emerald-600 text-sm">개인정보처리방침</a>
                </div>
            </div>
        </footer>
    )
}

export default function TestDesignPage() {
  return (
    <main className="font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <HeroSection />
      <ProjectsSection />
      <LifestyleSection />
      <AppDownloadSection />
      <Footer />
    </main>
  )
}
