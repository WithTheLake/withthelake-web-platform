import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white -mt-18 md:-mt-24">
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

        {/* 오버레이 */}
        <div className="absolute inset-0 bg-black/19" />

        {/* 텍스트 콘텐츠 */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-6xl lg:text-7xl font-bold text-white mb-3">
              맨발걷기,
            </h1>
            <p className="text-3xl text-white mb-4">
              액티브 시니어의 웰니스 라이프의 첫걸음입니다.
            </p>
            <p className="text-xl text-white">
              (주)위드더레이크는 맨발걷기를 기반으로
            </p>
            <p className="text-xl text-white">
              액티브 시니어의 건강한 웰니스 라이프를 꿈꿉니다.
            </p>
          </div>
        </div>
      </section>

      {/* 액티브 시니어 섹션 */}
      <section className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center">
            {/* 텍스트 */}
            <div>
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8 lg:mb-10">
                액티브 시니어
              </h2>
              <div className="text-gray-600 text-base lg:text-lg">
                <p>액티브 시니어는 단순히 은퇴 연령에 이른 세대가 아닌,</p>
                <p>건강하고 활기찬 삶을 추구하는 새로운 세대입니다.</p>
                <p>그들은 자신들의 삶을 주도적으로 설계하고,</p>
                <p>다양한 경험을 쌓으며, 사회에 기여하는 긍정적이고</p>
                <p>생산적인 삶을 살고 있습니다.</p>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-8 lg:mt-10 text-base lg:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                더 자세히 알아보기 →
              </Link>
            </div>

            {/* 이미지 */}
            <div className="flex justify-center lg:justify-end mt-10">
              <Image
                src="/images/active-senior.png"
                alt="액티브 시니어"
                width={500}
                height={600}
                className="h-auto w-[320px] lg:w-[500px]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5가지 프로젝트 섹션 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-16">
          {/* 3열 x 2행 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-30 gap-y-16">
            {/* 1행 1열: 제목 */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl lg:text-4xl font-normal text-gray-900 mb-2">
                액티브 시니어를 위한
              </h2>
              <h3 className="text-3xl lg:text-4xl font-normal">
                <span className="text-blue-600 font-bold">5가지</span> 프로젝트
              </h3>
            </div>

            {/* 1행 2열: 맞춤형 건강관리 */}
            <div className="text-left">
              <div className="mb-4">
                <svg className="w-15 h-15 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                맞춤형 건강관리
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                개인의 건강상태를 분석하여<br />
                <span className="text-gray-900">가장 적합한 솔루션을 제공합니다.</span>
              </p>
            </div>

            {/* 1행 3열: 온라인 헬스케어 */}
            <div className="text-left">
              <div className="mb-4">
                <svg className="w-15 h-15 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                온라인 헬스케어
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                언제 어디서나 건강을 관리할 수 있는<br />
                <span className="text-gray-900">디지털 솔루션을 제공합니다.</span>
              </p>
            </div>

            {/* 2행 1열: 홈케어 기반 헬스케어 */}
            <div className="text-left">
              <div className="mb-4">
                <svg className="w-15 h-15 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                홈케어 기반 헬스케어
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                가정에서도 손쉽게 실천할 수 있는 건강<br />
                <span className="text-gray-900">관리 프로그램을 제공합니다.</span>
              </p>
            </div>

            {/* 2행 2열: 커뮤니티 기반 헬스케어 */}
            <div className="text-left">
              <div className="mb-4">
                <svg className="w-15 h-15 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                커뮤니티 기반 헬스케어
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                함께 걷고 소통하며 건강을 증진시키는<br />
                <span className="text-gray-900">커뮤니티 활동을 지원합니다.</span>
              </p>
            </div>

            {/* 2행 3열: 맨발걷기 프로그램 */}
            <div className="text-left">
              <div className="mb-4">
                <svg className="w-15 h-15 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                맨발걷기 프로그램
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                자연과 함께 건강을 회복하는<br />
                <span className="text-gray-900">맨발 걷기 특화 프로그램을 제공합니다.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3가지 방법 섹션 */}
      <section className="py-16 lg:py-20 bg-white mt-4">
        <div className="container mx-auto px-32">
          {/* 제목 영역 - 기존 사이트처럼 상단에 배치 */}
          <div className="mb-16 lg:mb-28">
            <p className="text-2xl lg:text-4xl text-gray-900 mb-3">우리는 <span className="text-blue-600 font-bold">3가지 방법</span>으로 맨발걷기 기반의</p>
            <p className="text-2xl lg:text-4xl text-gray-900">액티브 시니어 웰니스 라이프를 그립니다.</p>
          </div>

          {/* 4개 컬럼: 숫자3 + 3개 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
            {/* 컬럼 1 - 숫자 3 이미지 */}
            <div className="hidden lg:flex items-end">
              <Image
                src="/images/threeway.png"
                alt="3"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>

            {/* 컬럼 2 - 플랫폼  */}
            <div className="text-center flex flex-col mb-5">
              <h4 className="text-2xl font-bold text-gray-900 mb-5">
                액티브 시니어 웰니스 플랫폼
              </h4>
              <div className="text-gray-600  mb-12">
                <p>맨발걷기 트래킹 및 커뮤니티 플랫폼</p>
                <p>맨발걷기 AI 맞춤형 코스 추천</p>
                <p>웰니스 제품 쇼핑몰운영</p>
                <p>GPS 기반 코스 기록</p>
              </div>
              {/* withwellme 로고 */}
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/withwellme.png"
                  alt="WITH well ME"
                  width={220}
                  height={70}
                  className="object-contain"
                />
              </div>
            </div>

            {/* 컬럼 3 - 키트 */}
            <div className="text-center flex flex-col mb-5">
              <h4 className="text-2xl font-bold text-gray-900 mb-5">
                맨발걷기 키트 개발 및 판매
              </h4>
              <div className="text-gray-600 mb-6">
                <p>맨발걷기 초심자를 위한 스타터키트</p>
                <p>맨발걷기 후용 위한 애프터 키트</p>
                <p>맨발을 위한 뷰티 제품 개발</p>
                <p>고급차 및 장식물 위한 제품 개발</p>
              </div>
              {/* walkkit 이미지 */}
              <div className="flex justify-center mt-auto">
                <Image
                  src="/images/walkkit.png"
                  alt="워킹 키트"
                  width={320}
                  height={220}
                  className="object-contain"
                />
              </div>
            </div>

            {/* 컬럼 4 - 오프라인 프로그램 */}
            <div className="text-center flex flex-col mb-5">
              <h4 className="text-2xl font-bold text-gray-900 mb-5">
                맨발걷기 오프라인 프로그램
              </h4>
              <div className="text-gray-600 mb-6">
                <p>맨발걷기 강사 자격증 취득</p>
                <p>지역기반 맨발걷기 모임 개설</p>
                <p>맨발걷기 코스 개척</p>
                <p>오프라인 커뮤니티 개설 및 운영</p>
              </div>
              {/* barefoot 이미지 */}
              <div className="flex justify-center mt-auto">
                <Image
                  src="/images/barefoot.png"
                  alt="맨발"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 앱 다운로드 섹션 */}
      <section className="py-10 bg-gray-100 text-white">
        <div className="mx-10 py-25 px-30 bg-black rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 텍스트 & 다운로드 버튼 */}
            <div>
              <div className="inline-block px-4 py-1 bg-blue-600 text-white rounded-full mb-4">
                맨발루 앱 다운로드
              </div>
              <h2 className="text-6xl font-bold mb-4 leading-tight">
                맨발걷기 커뮤니티<br />
                맨발루를 만나보세요
              </h2>
              <p className="text-base text-gray-200 mb-10">
                아래 버튼을 클릭하시면 해당 사이트로 이동합니다.
              </p>

              <div className="flex gap-4">
                <a
                  href="https://apps.apple.com/kr/app/맨발루/id6651824430"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/downonappstore.png"
                    alt="Download on the App Store"
                    width={170}
                    height={50}
                    className="hover:opacity-80 transition-opacity"
                  />
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=com.apppp.menbaloo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/getitongoogleplay.png"
                    alt="Get it on Google Play"
                    width={170}
                    height={50}
                    className="hover:opacity-80 transition-opacity"
                  />
                </a>
              </div>
            </div>

            {/* 앱 스크린샷 */}
            <div className="relative flex justify-end">
              <Image
                src="/images/menbaloo.png"
                alt="맨발루 앱"
                width={450}
                height={450}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
