'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ExternalLink, LogOut, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AdminHeaderProps {
  userName: string
}

export function AdminHeader({ userName }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* 로고 */}
        <Link href="/admin" className="flex items-center gap-2">
          <Home size={24} className="text-blue-600" />
          <span className="text-lg font-bold text-gray-900">
            WithTheLake Admin
          </span>
        </Link>

        {/* 우측 메뉴 */}
        <div className="flex items-center gap-4">
          {/* 사이트 보기 */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ExternalLink size={16} />
            사이트 보기
          </Link>

          {/* 사용자 정보 */}
          <span className="text-sm text-gray-600">
            {userName}님
          </span>

          {/* 로그아웃 */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
      </div>
    </header>
  )
}
