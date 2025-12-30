import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* 메인 푸터 */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-12 md:py-10">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10">
          {/* 좌측: 로고 및 회사 정보 */}
          <div className="lg:max-w-md">
            {/* 로고 */}
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/withthelake_logo.png"
                alt="WithTheLake"
                width={120}
                height={40}
                className="h-10 w-auto brightness-0 invert opacity-80"
              />
            </Link>

            {/* 회사 정보 */}
            <div className="space-y-1 text-sm">
              <p>주식회사 위드더레이크 | 대표 정미경</p>
              <p>강원특별자치도 춘천시 후석로 462번길 7 춘천 ICT혁신센터 206호</p>
              <p>사업자등록번호 469-81-03428</p>
            </div>

            {/* 소셜 미디어 */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://blog.naver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                aria-label="Blog"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* 우측: 네비게이션 링크 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-16">
            {/* 서비스 */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">서비스</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/healing" className="text-sm hover:text-white transition-colors">
                    힐링로드 ON
                  </Link>
                </li>
                <li>
                  <Link href="/store" className="text-sm hover:text-white transition-colors">
                    스토어
                  </Link>
                </li>
                <li>
                  <Link href="/mypage" className="text-sm hover:text-white transition-colors">
                    마이페이지
                  </Link>
                </li>
              </ul>
            </div>

            {/* 정보 */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">정보</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm hover:text-white transition-colors">
                    기업 소개
                  </Link>
                </li>
                <li>
                  <Link href="/info" className="text-sm hover:text-white transition-colors">
                    맨발걷기 정보
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="text-sm hover:text-white transition-colors">
                    NEWS
                  </Link>
                </li>
                <li>
                  <Link href="/notice" className="text-sm hover:text-white transition-colors">
                    공지사항
                  </Link>
                </li>
              </ul>
            </div>

            {/* 이용약관 */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">고객지원</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm hover:text-white transition-colors">
                    이용약관
                  </Link>
                </li>
                <li>
                  <a href="mailto:contact@withthelake.com" className="text-sm hover:text-white transition-colors">
                    문의하기
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 저작권 */}
      <div className="border-t border-gray-800">
        <div className="w-full px-4 sm:px-8 lg:px-12 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
            <p>© 2024 WithTheLake Corp. All rights reserved.</p>
            <p className="text-gray-500">www.withthelake.com</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
