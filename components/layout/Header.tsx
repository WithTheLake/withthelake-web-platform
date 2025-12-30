'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: '힐링로드ON', href: '/healing', isHighlight: true },
    { label: '기업 소개', href: '/about' },
    { label: '공지사항', href: '/notice' },
    { label: '맨발걷기 정보', href: '/info' },
    { label: 'NEWS', href: '/news' },
    { label: '스토어', href: '/store' },
    { label: '마이페이지', href: '/mypage' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="w-full px-6 sm:px-10 lg:px-14">
        <div className="flex justify-between items-center h-18 md:h-22">
          {/* 로고 */}
          <Link href="/" className="flex items-center flex-shrink-0 ml-2">
            <Image
              src="/images/withthelake_logo.png"
              alt="WithTheLake"
              width={160}
              height={52}
              className="h-12 md:h-14 w-auto"
              priority
            />
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  item.isHighlight
                    ? 'px-5 py-2.5 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full font-bold hover:from-green-600 hover:to-blue-600 transition-all text-sm'
                    : 'text-gray-700 hover:text-blue-600 font-semibold transition-colors text-sm whitespace-nowrap'
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700"
            aria-label="메뉴"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  item.isHighlight
                    ? 'block py-3 px-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-bold text-center hover:from-green-600 hover:to-blue-600 transition-all'
                    : 'block py-2 text-gray-700 hover:text-blue-600 font-semibold'
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
