import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import WriteForm from '../../_components/WriteForm'

interface PageProps {
  searchParams: Promise<{ id?: string }>
}

export const metadata = {
  title: '글쓰기 | 이벤트 | WithTheLake',
  description: '이벤트 게시글을 작성합니다.',
}

export default async function EventWritePage({ searchParams }: PageProps) {
  const params = await searchParams
  const postId = params.id

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/healing')
  }

  // 관리자 권한 확인 - 이벤트는 관리자만 작성 가능
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/community/event')
  }

  let existingPost = null
  if (postId) {
    const { data } = await supabase
      .from('community_posts')
      .select('*')
      .eq('id', postId)
      .eq('user_id', user.id)
      .single()

    if (data) {
      existingPost = data
    }
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <WriteForm
        boardType="event"
        existingPost={existingPost}
        isEdit={!!postId}
      />
    </Suspense>
  )
}
