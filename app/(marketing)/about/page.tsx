import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Building2, Users, Target, Heart } from 'lucide-react'

export const metadata = {
  title: '기업 소개 - WithTheLake',
  description: '위드더레이크는 바이오 기술과 로컬 관광을 결합한 웰니스 치유 기업입니다.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white -mt-18 md:-mt-24">
      {/* 히어로 섹션 - 이미지 배경 */}
      <section className="relative h-[60vh] md:h-[70vh] min-h-[450px]">
        <Image
          src="/images/withthelake_about.png"
          alt="위드더레이크 기업 소개"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              WithTheLake
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              바이오 기술과 로컬 관광을 결합한 웰니스 치유 기업
            </p>
          </div>
        </div>
      </section>

      {/* 비전 & 미션 */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* 비전 */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 md:p-10">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
                <Target size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">비전</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                자연과 기술의 조화를 통해 모든 세대가 건강하고 행복한 삶을 누릴 수 있는
                웰니스 생태계를 구축합니다.
              </p>
            </div>

            {/* 미션 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-10">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <Heart size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">미션</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                맨발걷기와 자연 치유 프로그램을 통해 시니어 세대의 신체적, 정신적 건강을
                증진하고 지역 사회와 함께 성장합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 가치 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">핵심 가치</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="text-xl font-bold mb-3">자연 친화</h3>
              <p className="text-gray-600">
                자연의 치유력을 존중하고 환경과 조화를 이루는 프로그램을 개발합니다.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3">함께 성장</h3>
              <p className="text-gray-600">
                지역 사회, 파트너, 고객과 함께 지속 가능한 가치를 만들어갑니다.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-3">혁신 추구</h3>
              <p className="text-gray-600">
                바이오 기술과 디지털 혁신을 통해 더 나은 웰니스 경험을 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 회사 연혁 */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">회사 연혁</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-24 flex-shrink-0 text-right">
                  <span className="text-green-600 font-bold text-lg">2024</span>
                </div>
                <div className="flex-1 pb-8 border-l-2 border-green-200 pl-6 relative">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 bg-green-500 rounded-full" />
                  <h3 className="font-bold text-lg mb-2">힐링로드 ON 서비스 런칭</h3>
                  <p className="text-gray-600">워킹 테라피 앱 서비스 출시, 강원도 철원 맨발걷기길 개장</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-24 flex-shrink-0 text-right">
                  <span className="text-green-600 font-bold text-lg">2023</span>
                </div>
                <div className="flex-1 pb-8 border-l-2 border-green-200 pl-6 relative">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 bg-green-500 rounded-full" />
                  <h3 className="font-bold text-lg mb-2">맨발걷기 연구 및 프로그램 개발</h3>
                  <p className="text-gray-600">시니어 맨발걷기 효과 연구, 긍정확언 오디오 콘텐츠 제작</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-24 flex-shrink-0 text-right">
                  <span className="text-green-600 font-bold text-lg">2022</span>
                </div>
                <div className="flex-1 pb-8 border-l-2 border-green-200 pl-6 relative">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 bg-green-500 rounded-full" />
                  <h3 className="font-bold text-lg mb-2">회사 설립</h3>
                  <p className="text-gray-600">주식회사 위드더레이크 설립, 춘천 ICT혁신센터 입주</p>
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
                <Phone size={24} className="text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-1">사업자등록번호</h3>
                  <p className="text-gray-300">469-81-03428</p>
                </div>
              </div>
            </div>

            {/* 지도 영역 (플레이스홀더) */}
            <div className="bg-gray-800 rounded-2xl h-64 md:h-auto flex items-center justify-center">
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
      <section className="py-16 md:py-24 bg-gradient-to-r from-green-500 to-blue-500 text-white">
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
