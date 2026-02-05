'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Newspaper,
  ShoppingBag,
  Tag,
  MessageSquare,
  MessageCircle,
  Music,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    title: '대시보드',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: '오디오 관리',
    href: '/admin/audio',
    icon: Music,
  },
  {
    title: '뉴스 관리',
    href: '/admin/news',
    icon: Newspaper,
  },
  {
    title: '커뮤니티',
    icon: MessageSquare,
    children: [
      { title: '게시글 관리', href: '/admin/community' },
      { title: '댓글 관리', href: '/admin/community/comments' },
    ],
  },
  {
    title: '스토어',
    icon: ShoppingBag,
    children: [
      { title: '제품 관리', href: '/admin/store' },
      { title: '카테고리 관리', href: '/admin/store/categories' },
    ],
  },
  {
    title: '회원 관리',
    href: '/admin/members',
    icon: Users,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                // 하위 메뉴가 있는 경우
                <div>
                  <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600">
                    <item.icon size={20} />
                    {item.title}
                  </div>
                  <ul className="ml-6 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={cn(
                            'block px-3 py-2 text-sm rounded-lg transition-colors',
                            pathname === child.href
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          )}
                        >
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                // 단일 메뉴
                <Link
                  href={item.href!}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
                    (item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href!))
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <item.icon size={20} />
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
