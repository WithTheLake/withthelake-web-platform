import Image from 'next/image'
import Link from 'next/link'
import { Heart, Brain, Zap, Leaf, CheckCircle, ArrowRight } from 'lucide-react'

export const metadata = {
  title: '맨발걷기 정보 - WithTheLake',
  description: '맨발걷기의 효과와 올바른 방법을 알아보세요. 자연과 함께하는 건강한 걷기의 시작.',
}

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🦶</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            맨발걷기의 모든 것
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            땅과 연결되어 자연의 에너지를 느끼는
            <br />
            가장 원초적이고 효과적인 건강법
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* 맨발걷기란? */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">맨발걷기란?</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              맨발걷기(Earthing/Grounding)는 맨발로 땅을 밟으며 걷는 활동입니다.
              인체가 지구의 자연 전하와 직접 연결됨으로써 다양한 건강 효과를 얻을 수 있습니다.
              현대인은 신발과 건물로 인해 땅과의 접촉이 차단되어 있는데,
              맨발걷기는 이러한 단절을 해소하고 자연과의 연결을 회복하는 방법입니다.
            </p>
          </div>
        </div>
      </section>

      {/* 맨발걷기 효과 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">맨발걷기의 효과</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Heart size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">혈액순환 개선</h3>
              <p className="text-gray-600">
                발바닥의 혈관과 신경을 자극하여 혈액순환을 촉진하고 혈압을 안정시킵니다.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Brain size={28} className="text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">스트레스 감소</h3>
              <p className="text-gray-600">
                코르티솔 수치를 낮추고 세로토닌 분비를 촉진하여 심리적 안정감을 제공합니다.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                <Zap size={28} className="text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">항산화 효과</h3>
              <p className="text-gray-600">
                지구의 자유 전자가 체내 활성산소를 중화시켜 염증을 줄이고 노화를 방지합니다.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Leaf size={28} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">면역력 강화</h3>
              <p className="text-gray-600">
                자연과의 접촉이 면역 체계를 활성화하고 자연 치유력을 높여줍니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 올바른 맨발걷기 방법 */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">올바른 맨발걷기 방법</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">장소 선택</h3>
                  <p className="text-gray-600">
                    흙, 잔디, 모래 등 자연 바닥이 좋습니다. 유리 조각이나 날카로운 물체가 없는
                    안전한 장소를 선택하세요. 공원, 해변, 산책로 등이 적합합니다.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">준비운동</h3>
                  <p className="text-gray-600">
                    맨발걷기 전 발목과 발가락을 충분히 스트레칭하세요.
                    발바닥을 마사지하여 혈액순환을 미리 활성화시키면 좋습니다.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">천천히 시작</h3>
                  <p className="text-gray-600">
                    처음에는 10-15분 정도로 짧게 시작하여 점차 시간을 늘려가세요.
                    발바닥이 적응하는 데 시간이 필요합니다.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">자세와 호흡</h3>
                  <p className="text-gray-600">
                    허리를 곧게 펴고, 발 전체로 땅을 딛듯이 걸으세요.
                    깊은 호흡을 하며 자연의 소리와 향기를 느껴보세요.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">마무리</h3>
                  <p className="text-gray-600">
                    걷기가 끝나면 발을 깨끗이 씻고 보습제를 발라주세요.
                    발바닥에 상처가 있는지 확인하고 관리해 주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 주의사항 */}
      <section className="py-16 md:py-24 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">주의사항</h2>
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold mb-1">당뇨병 환자</h3>
                  <p className="text-gray-600 text-sm">
                    발에 감각이 둔한 경우 상처를 인지하지 못할 수 있으니 주의가 필요합니다.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold mb-1">극단적 날씨</h3>
                  <p className="text-gray-600 text-sm">
                    너무 뜨겁거나 차가운 바닥은 피하세요. 화상이나 동상의 위험이 있습니다.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold mb-1">상처가 있을 때</h3>
                  <p className="text-gray-600 text-sm">
                    발에 상처가 있으면 감염 위험이 있으니 완치 후 맨발걷기를 하세요.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold mb-1">장소 안전 확인</h3>
                  <p className="text-gray-600 text-sm">
                    유리, 금속 조각 등 위험물이 없는지 항상 확인 후 걸으세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 맨발걷기를 시작해보세요
          </h2>
          <p className="text-xl text-green-100 mb-8">
            힐링로드 ON과 함께 전문 가이드 음성을 들으며
            <br />
            안전하고 효과적인 맨발걷기를 경험하세요
          </p>
          <Link
            href="/healing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            힐링로드 ON 시작하기
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
