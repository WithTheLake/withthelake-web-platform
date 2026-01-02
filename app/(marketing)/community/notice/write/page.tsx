import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import WriteForm from '../../_components/WriteForm'

interface PageProps {
  searchParams: Promise<{ id?: string }>
}

export const metadata = {
  title: '글쓰기 | 공지사항 | WithTheLake',
  description: '공지사항에 글을 작성합니다.',
}

export default async function NoticeWritePage({ searchParams }: PageProps) {
  const params = await searchParams
  const postId = params.id

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/healing')
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
        boardType="notice"
        existingPost={existingPost}
        isEdit={!!postId}
      />
    </Suspense>
  )
}
