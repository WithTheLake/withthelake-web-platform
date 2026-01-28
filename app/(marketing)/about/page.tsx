import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin,
  Building2,
  Users,
  Target,
  Heart,
  Database,
  Leaf,
  MapPinned,
  Stethoscope,
  Smartphone,
  GraduationCap,
  ShoppingBag,
  Award,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react'

export const metadata = {
  title: '기업 소개 - WithTheLake',
  description: '위드더레이크는 데이터로 몸을 읽고, 인문학으로 마음을 위로하며, 사람으로 세상을 따뜻하게 만드는 디지털 헬스케어 융복합 기업입니다.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 - 이미지 전체 표시 */}
      <section className="relative w-full bg-gray-100">
        <div className="relative w-full max-w-6xl mx-auto">
          <Image
            src="/images/withthelake_about.png"
            alt="위드더레이크 기업 소개"
            width={1200}
            height={800}
            sizes="100vw"
            className="w-full h-auto"
            priority
          />
        </div>
      </section>

      {/* 슬로건 */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg md:text-xl lg:text-2xl font-medium leading-relaxed">
            "우리는 <strong>데이터</strong>로 몸을 읽고, <strong>인문학</strong>으로 마음을 위로하며,
            <br className="hidden md:block" />
            <strong>사람</strong>으로 세상을 따뜻하게 만듭니다."
          </p>
        </div>
      </section>

      {/* 미션 */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target size={32} className="text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Mission: 웰니스 생태계의 완성</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              주식회사 위드더레이크는 파편화된 건강관리와 관광 산업을 하나로 묶는
              <strong className="text-green-700"> '디지털 헬스케어 융복합 모델'</strong>을 지향합니다.
              <br /><br />
              병원에서만 이루어지는 건강관리가 아닌, <strong>'병원 밖 일상'</strong>에서의 예방과 치유를
              과학적 데이터와 로컬 콘텐츠로 해결하는 것이 우리의 소명입니다.
            </p>
          </div>
        </div>
      </section>

      {/* 핵심 가치 - Data, Nature, Local */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Core: Data, Nature, and Local</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            세 가지 핵심 가치로 웰니스 생태계를 구축합니다
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Database size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Data (기술)</h3>
              <p className="text-gray-600">
                주관적인 느낌이 아닌, <strong>객관적인 지표(AI 진단)</strong>로 건강을 확인합니다.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Nature (치유)</h3>
              <p className="text-gray-600">
                자연이라는 <strong>가장 강력한 치유 공간</strong>에서 회복을 경험합니다.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPinned size={32} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Local (지역)</h3>
              <p className="text-gray-600">
                치유의 경험을 <strong>지역 관광 산업과 연결</strong>하여 지역 사회에 활력을 불어넣습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4대 단절 해결 */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">우리가 해결하는 '4대 단절'</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            위드더레이크가 수행하는 모든 업무는 이 네 가지 문제를 해결합니다
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Stethoscope size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">건강의 단절 (Health Gap)</h3>
                  <p className="text-gray-600 text-sm mb-2">병원 밖 일상 관리 수단의 부재</p>
                  <p className="text-red-600 font-medium text-sm">→ 바이오 R&D로 해결</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPinned size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">관광의 단절 (Tourism Gap)</h3>
                  <p className="text-gray-600 text-sm mb-2">하드웨어 중심 관광의 콘텐츠 부족</p>
                  <p className="text-blue-600 font-medium text-sm">→ 힐링로드ON으로 해결</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">신뢰의 단절 (Wellness Gap)</h3>
                  <p className="text-gray-600 text-sm mb-2">비과학적 활동으로 인한 부상 위험</p>
                  <p className="text-purple-600 font-medium text-sm">→ EMARA 기법으로 해결</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">일자리의 단절 (Job Gap)</h3>
                  <p className="text-gray-600 text-sm mb-2">경력단절여성 및 시니어 일자리 부족</p>
                  <p className="text-green-600 font-medium text-sm">→ 교육 및 인력양성으로 해결</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4대 사업 영역 (The 4 Pillars) */}
      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">사업 영역 (The 4 Pillars)</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            네 가지 핵심 사업으로 웰니스 생태계를 완성합니다
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Bio-Tech */}
            <div className="bg-gray-800 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <Stethoscope size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">[Bio-Tech] 데이터 기반 예방 헬스케어</h3>
              </div>
              <ul className="space-y-4 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 leading-none mt-[2px]">•</span>
                  <span>소변 기반 7종 동시 진단 키트 및 AI RGB 판독 알고리즘</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 leading-none mt-[2px]">•</span>
                  <span>반사율 광학 설계로 <strong className="text-white">95% 이상 정확도</strong> 확보</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 leading-none mt-[2px]">•</span>
                  <span>2025 프리팁스(Pre-TIPS) 선정 및 중기부 R&D 디딤돌 과제 수행</span>
                </li>
              </ul>
            </div>

            {/* Content */}
            <div className="bg-gray-800 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Smartphone size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">[Content] 힐링로드ON</h3>
              </div>
              <ul className="space-y-4 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 leading-none mt-[2px]">•</span>
                  <span><strong className="text-white">응용언어학 기반</strong>의 워킹 스토리텔링 치유 플랫폼</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 leading-none mt-[2px]">•</span>
                  <span>맨발걷기 오디오 가이드, 인문학 스토리텔링, 긍정확언 사운드</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 leading-none mt-[2px]">•</span>
                  <span>앱 설치 없는 <strong className="text-white">No-App QR 시스템</strong></span>
                </li>
              </ul>
            </div>

            {/* People */}
            <div className="bg-gray-800 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">[People] 전문 인력 양성</h3>
              </div>
              <ul className="space-y-4 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 leading-none mt-[2px]">•</span>
                  <span>독자적 언어심리 기법(EMARA)을 숙지한 <strong className="text-white">전문가 양성</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 leading-none mt-[2px]">•</span>
                  <span>늘봄학교(방과후 학교), 생활체육 지자체 프로그램 강사 파견</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 leading-none mt-[2px]">•</span>
                  <span>경력단절여성과 시니어에게 <strong className="text-white">'루틴 코치'</strong> 직업 부여</span>
                </li>
              </ul>
            </div>

            {/* Product */}
            <div className="bg-gray-800 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <ShoppingBag size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">[Product] 위드웰미 (With Well-Me)</h3>
              </div>
              <ul className="space-y-4 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 leading-none mt-[2px]">•</span>
                  <span><strong className="text-white">'건강한 나를 찾는 여정'</strong>을 돕는 모든 도구</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 leading-none mt-[2px]">•</span>
                  <span>신체 케어: 파워 쿨링 미스트, 풋워시 등 풋케어 라인</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 leading-none mt-[2px]">•</span>
                  <span>정신 케어: 감정기록 노트, 긍정확언 카드 등 온/오프라인 굿즈</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 팀 & 파트너십 */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">전문 역량과 파트너십</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👩‍💼</span>
              </div>
              <h3 className="font-bold text-lg mb-2">CEO 정미경</h3>
              <p className="text-gray-600 text-sm">
                응용언어학 박사<br />
                데이터사이언스 석사 과정<br />
                콘텐츠의 과학적 증명 주도
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍💻</span>
              </div>
              <h3 className="font-bold text-lg mb-2">CTO 이중진</h3>
              <p className="text-gray-600 text-sm">
                바이오 진단 하드웨어<br />
                광학 시스템 전문가<br />
                기술적 진입장벽 구축
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="font-bold text-lg mb-2">R&D 파트너</h3>
              <p className="text-gray-600 text-sm">
                강원대학교<br />
                데이터사이언스 교수연구팀<br />
                AI 큐레이션 알고리즘 고도화
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="font-bold text-lg mb-2">공학 박사팀</h3>
              <p className="text-gray-600 text-sm">
                강원대 공학 박사팀<br />
                산학협력 기반<br />
                사업 계획 및 운영 전반 협업
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 회사 연혁 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">주요 인증 및 연혁</h2>
          <p className="text-center text-gray-600 mb-12">위드더레이크의 성장 여정</p>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {/* 2025 */}
              <div className="flex gap-6">
                <div className="w-24 flex-shrink-0 text-right">
                  <span className="text-green-600 font-bold text-lg">2025.12</span>
                </div>
                <div className="flex-1 pb-6 border-l-2 border-green-200 pl-6 relative">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 bg-green-500 rounded-full" />
                  <h3 className="font-bold text-lg mb-1">중기부 프리팁스(Pre-TIPS) 선정</h3>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-24 flex-shrink-0 text-right">
                  <span className="text-green-600 font-bold text-lg">2025.11</span>
                </div>
                <div className="flex-1 pb-6 border-l-2 border-green-200 pl-6 relative">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 bg-green-500 rounded-full" />
                  <h3 className="font-bold text-lg mb-1">강원특별자치도 예비사회적기업(혼합형) 지정</h3>
                  <p className="text-gray-600 text-sm">강원관광재단 표창장 수상</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-24 flex-shrink-0 text-right">
                  <span className="text-green-600 font-bold text-lg">2025.07</span>
                </div>
                <div className="flex-1 pb-6 border-l-2 border-green-200 pl-6 relative">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 bg-green-500 rounded-full" />
                  <h3 className="font-bold text-lg mb-1">중기부 창업성장기술개발(디딤돌) 과제 선정</h3>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-24 flex-shrink-0 text-right">
                  <span className="text-green-600 font-bold text-lg">2025.05</span>
                </div>
                <div className="flex-1 pb-6 border-l-2 border-green-200 pl-6 relative">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 bg-green-500 rounded-full" />
                  <h3 className="font-bold text-lg mb-1">강원창조경제혁신센터 강원관광컬처지원사업 선정</h3>
                  <p className="text-gray-600 text-sm">힐링로드ON 프로젝트</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-24 flex-shrink-0 text-right">
                  <span className="text-green-600 font-bold text-lg">2025.03</span>
                </div>
                <div className="flex-1 pb-6 border-l-2 border-green-200 pl-6 relative">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 bg-green-500 rounded-full" />
                  <h3 className="font-bold text-lg mb-1">경북관광기업지원센터 협력기업 선정</h3>
                </div>
              </div>
              {/* 2024 */}
              <div className="flex gap-6">
                <div className="w-24 flex-shrink-0 text-right">
                  <span className="text-green-600 font-bold text-lg">2024.12</span>
                </div>
                <div className="flex-1 pb-6 border-l-2 border-green-200 pl-6 relative">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 bg-green-500 rounded-full" />
                  <h3 className="font-bold text-lg mb-1">특허 출원</h3>
                  <p className="text-gray-600 text-sm">음성기반 운동기록 시스템 등</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-24 flex-shrink-0 text-right">
                  <span className="text-green-600 font-bold text-lg">2024.07</span>
                </div>
                <div className="flex-1 pb-6 border-l-2 border-green-200 pl-6 relative">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 bg-green-500 rounded-full" />
                  <h3 className="font-bold text-lg mb-1">벤처기업 인증 (혁신성장유형)</h3>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-24 flex-shrink-0 text-right">
                  <span className="text-green-600 font-bold text-lg">2024.02</span>
                </div>
                <div className="flex-1 border-l-2 border-transparent pl-6 relative">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 bg-green-600 rounded-full ring-4 ring-green-100" />
                  <h3 className="font-bold text-lg mb-1">주식회사 위드더레이크 법인 설립</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 회사 정보 */}
      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">회사 정보</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Building2 size={24} className="text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-1">회사명</h3>
                  <p className="text-gray-300">주식회사 위드더레이크</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Users size={24} className="text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-1">대표</h3>
                  <p className="text-gray-300">정미경</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin size={24} className="text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-1">주소</h3>
                  <p className="text-gray-300">
                    강원특별자치도 춘천시 후석로 462번길 7
                    <br />
                    춘천 ICT혁신센터 206호
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Award size={24} className="text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-1">사업자등록번호</h3>
                  <p className="text-gray-300">469-81-03428</p>
                </div>
              </div>

              {/* SNS 링크 */}
              <div className="pt-6 border-t border-gray-700">
                <h3 className="font-bold mb-4">공식 채널</h3>
                <div className="space-y-3">
                  {/* 페이스북, 인스타그램, 유튜브 */}
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://www.facebook.com/people/%EC%9C%84%EB%93%9C%EB%8D%94%EB%A0%88%EC%9D%B4%ED%81%AC/61565595385880/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                    >
                      <Facebook size={16} />
                      Facebook
                    </a>
                    <a
                      href="https://www.instagram.com/withwellme/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-colors text-sm"
                    >
                      <Instagram size={16} />
                      Instagram
                    </a>
                    <a
                      href="https://www.youtube.com/channel/UC8vmE6swgfF-PvsVIQUmsOQ/about"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
                    >
                      <Youtube size={16} />
                      YouTube
                    </a>
                  </div>
                  {/* 네이버 블로그, 네이버 카페, 네이버 스토어 */}
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://blog.naver.com/with_thelake"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-sm"
                    >
                      <ExternalLink size={16} />
                      네이버 블로그
                    </a>
                    <a
                      href="https://cafe.naver.com/healingroadon"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-sm"
                    >
                      <Users size={16} />
                      네이버 카페
                    </a>
                    <a
                      href="https://smartstore.naver.com/withlab201"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
                    >
                      <ShoppingBag size={16} />
                      네이버 스토어
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 지도 영역 */}
            <div className="bg-gray-800 rounded-2xl h-80 md:h-auto flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">지도 영역</p>
                <a
                  href="https://map.naver.com/p/search/%EC%B6%98%EC%B2%9C%20ICT%ED%98%81%EC%8B%A0%EC%84%BC%ED%84%B0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  네이버 지도에서 보기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-green-500 to-teal-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            함께 건강한 미래를 만들어가요
          </h2>
          <p className="text-xl text-green-100 mb-8">
            위드더레이크와 함께 자연 속에서 치유의 여정을 시작하세요
          </p>
          <Link
            href="/healing"
            className="inline-block px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            힐링로드 ON 시작하기
          </Link>
        </div>
      </section>
    </div>
  )
}
