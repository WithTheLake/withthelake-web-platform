import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export const metadata = {
  title: '관리자 | WithTheLake',
  description: 'WithTheLake 관리자 페이지',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 비로그인 시 로그인 페이지로 리다이렉트
  if (!user) {
    redirect('/login')
  }

  // 관리자 권한 확인
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin, nickname')
    .eq('user_id', user.id)
    .single()

  // 관리자가 아니면 메인 페이지로 리다이렉트
  if (!profile?.is_admin) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader userName={profile.nickname || '관리자'} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 ml-64 mt-16">
          {children}
        </main>
      </div>
    </div>
  )
}
