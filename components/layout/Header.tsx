'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCommunityOpen, setIsCommunityOpen] = useState(false)
  const [isMobileCommunityOpen, setIsMobileCommunityOpen] = useState(false)

  const communityItems = [
    { label: '공지사항', href: '/community/notice' },
    { label: '자유게시판', href: '/community/free' },
    { label: '힐링 후기', href: '/community/review' },
  ]

  const navItems = [
    { label: '힐링로드ON', href: '/healing', isHighlight: true },
    { label: '기업 소개', href: '/about' },
    { label: '커뮤니티', href: '/community', hasDropdown: true },
    { label: '맨발걷기 정보', href: '/info' },
    { label: 'NEWS', href: '/news' },
    { label: '스토어', href: '/store' },
    { label: '마이페이지', href: '/mypage' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="w-full px-4 sm:px-10 lg:px-14">
        <div className="flex justify-between items-center h-14 md:h-20">
          {/* 로고 */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/withthelake_logo.png"
              alt="WithTheLake"
              width={140}
              height={45}
              className="h-9 md:h-12 w-auto"
              priority
            />
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              item.hasDropdown ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setIsCommunityOpen(true)}
                  onMouseLeave={() => setIsCommunityOpen(false)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-semibold transition-colors text-sm whitespace-nowrap"
                  >
                    {item.label}
                    <ChevronDown size={16} className={`transition-transform ${isCommunityOpen ? 'rotate-180' : ''}`} />
                  </Link>

                  {/* 드롭다운 메뉴 */}
                  <AnimatePresence>
                    {isCommunityOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
                      >
                        {communityItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
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
              )
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
              item.hasDropdown ? (
                <div key={item.href}>
                  <button
                    onClick={() => setIsMobileCommunityOpen(!isMobileCommunityOpen)}
                    className="w-full flex items-center justify-between py-2 text-gray-700 hover:text-blue-600 font-semibold"
                  >
                    {item.label}
                    <ChevronDown size={16} className={`transition-transform ${isMobileCommunityOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isMobileCommunityOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 mt-2 space-y-2 overflow-hidden"
                      >
                        {communityItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block py-2 text-sm text-gray-600 hover:text-blue-600"
                            onClick={() => {
                              setIsMenuOpen(false)
                              setIsMobileCommunityOpen(false)
                            }}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
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
              )
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
