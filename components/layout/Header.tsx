'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, LogIn, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/useAuthStore'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCommunityOpen, setIsCommunityOpen] = useState(false)
  const [isMobileCommunityOpen, setIsMobileCommunityOpen] = useState(false)

  // 현재 페이지 경로
  const pathname = usePathname()

  // 전역 인증 상태 사용 (페이지 이동 시에도 유지됨)
  const { isLoggedIn, isAuthChecked, checkAuth, setUser } = useAuthStore()

  // 현재 경로가 해당 메뉴와 일치하는지 확인
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    // 커뮤니티 하위 페이지들도 커뮤니티 메뉴 활성화
    if (href === '/community') return pathname.startsWith('/community')
    return pathname === href || pathname.startsWith(href + '/')
  }

  // 로그인 상태 확인 (전역 스토어 사용)
  useEffect(() => {
    checkAuth()

    // 인증 상태 변경 리스너
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [checkAuth, setUser])

  const communityItems = [
    { label: '공지사항', href: '/community/notice' },
    { label: '이벤트', href: '/community/event' },
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
  ]

  // 로그인/마이페이지 항목 (조건부)
  const authNavItem = isLoggedIn
    ? { label: '마이페이지', href: '/mypage', icon: User }
    : { label: '로그인', href: '/login', icon: LogIn }

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
                    className="flex items-center gap-1 font-semibold transition-colors text-sm whitespace-nowrap text-gray-700 hover:text-blue-500"
                  >
                    {item.label}
                    <ChevronDown size={16} className={`transition-transform ${isCommunityOpen ? 'rotate-180' : ''}`} />
                    {/* 활성화 표시 밑줄 */}
                    {isActive(item.href) && (
                      <span className="absolute -bottom-1 left-0 right-0 h-px bg-gray-700" />
                    )}
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
                            className={`block px-4 py-3 text-sm transition-colors text-gray-700 hover:bg-blue-50 hover:text-blue-500 ${
                              isActive(subItem.href) ? 'bg-gray-100 font-semibold' : ''
                            }`}
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
                      ? `px-5 py-2.5 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full font-bold hover:from-green-600 hover:to-blue-600 transition-all text-sm ${
                          isActive(item.href) ? 'ring-2 ring-blue-200 ring-offset-2' : ''
                        }`
                      : 'relative font-semibold transition-colors text-sm whitespace-nowrap text-gray-700 hover:text-blue-500'
                  }
                >
                  {item.label}
                  {/* 활성화 표시 밑줄 (힐링로드ON 제외) */}
                  {!item.isHighlight && isActive(item.href) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-gray-700" />
                  )}
                </Link>
              )
            ))}

            {/* 로그인/마이페이지 버튼 */}
            {isAuthChecked && (
              <Link
                href={authNavItem.href}
                className="relative flex items-center gap-1.5 font-semibold transition-colors text-sm whitespace-nowrap text-gray-700 hover:text-blue-500"
              >
                <authNavItem.icon size={16} />
                {authNavItem.label}
                {/* 활성화 표시 밑줄 */}
                {isActive(authNavItem.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-gray-700" />
                )}
              </Link>
            )}
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
                    className="w-full flex items-center justify-between py-2 font-semibold text-gray-700 hover:text-blue-500"
                  >
                    <span className="flex items-center gap-2">
                      {item.label}
                      {isActive(item.href) && (
                        <span className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                      )}
                    </span>
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
                            className={`block py-2 text-sm text-gray-600 hover:text-blue-500 ${
                              isActive(subItem.href) ? 'font-semibold' : ''
                            }`}
                            onClick={() => {
                              setIsMenuOpen(false)
                              setIsMobileCommunityOpen(false)
                            }}
                          >
                            <span className="flex items-center gap-2">
                              {subItem.label}
                              {isActive(subItem.href) && (
                                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                              )}
                            </span>
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
                      ? `block py-3 px-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-bold text-center hover:from-green-600 hover:to-blue-600 transition-all ${
                          isActive(item.href) ? 'ring-2 ring-blue-200' : ''
                        }`
                      : 'block py-2 font-semibold text-gray-700 hover:text-blue-500'
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    {item.label}
                    {!item.isHighlight && isActive(item.href) && (
                      <span className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                    )}
                  </span>
                </Link>
              )
            ))}

            {/* 모바일 로그인/마이페이지 버튼 */}
            {isAuthChecked && (
              <Link
                href={authNavItem.href}
                className="flex items-center gap-2 py-2 font-semibold border-t pt-4 mt-2 text-gray-700 hover:text-blue-500"
                onClick={() => setIsMenuOpen(false)}
              >
                <authNavItem.icon size={18} />
                {authNavItem.label}
                {isActive(authNavItem.href) && (
                  <span className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                )}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
