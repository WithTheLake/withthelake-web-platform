'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ExternalLink, LogOut, LayoutDashboard, Crown, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AdminHeaderProps {
  userName: string
  isSuperAdmin?: boolean
}

export function AdminHeader({ userName, isSuperAdmin = false }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* 로고 */}
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">
            WithTheLake Admin
          </span>
        </Link>

        {/* 우측 메뉴 */}
        <div className="flex items-center gap-2">
          {/* 사이트 보기 */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ExternalLink size={16} />
            사이트 보기
          </Link>

          {/* 구분선 */}
          <div className="w-px h-6 bg-gray-200 mx-2" />

          {/* 사용자 정보 */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700 font-medium">
              {userName}
            </span>
            {isSuperAdmin ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                <Crown size={12} />
                대표
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                <Shield size={12} />
                관리자
              </span>
            )}
          </div>

          {/* 구분선 */}
          <div className="w-px h-6 bg-gray-200 mx-2" />

          {/* 로그아웃 */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
      </div>
    </header>
  )
}
