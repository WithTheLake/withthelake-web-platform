'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 뉴스 타입 정의
export interface NewsArticle {
  id: string
  title: string
  source: string
  category: '언론보도' | '해외자료' | '블로그' | '보도자료'
  link: string
  thumbnail_url: string | null
  published_at: string
  is_active: boolean
  order_index: number
  created_at: string
  updated_at: string
}

// 뉴스 목록 조회
export async function getNewsArticles(options?: {
  category?: string
  limit?: number
  offset?: number
}): Promise<{ data: NewsArticle[]; count: number }> {
  const supabase = await createClient()

  let query = supabase
    .from('news_articles')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .order('published_at', { ascending: false })
    .order('order_index', { ascending: true })

  if (options?.category && options.category !== '전체') {
    query = query.eq('category', options.category)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('뉴스 조회 오류:', error)
    return { data: [], count: 0 }
  }

  return { data: data || [], count: count || 0 }
}

// 단일 뉴스 조회
export async function getNewsArticle(id: string): Promise<NewsArticle | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('뉴스 상세 조회 오류:', error)
    return null
  }

  return data
}

// 뉴스 생성 (관리자 전용)
export async function createNewsArticle(formData: FormData): Promise<{ success: boolean; message?: string; id?: string }> {
  const supabase = await createClient()

  // 관리자 권한 체크
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: '로그인이 필요합니다.' }
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) {
    return { success: false, message: '관리자 권한이 필요합니다.' }
  }

  // 데이터 추출
  const title = formData.get('title') as string
  const source = formData.get('source') as string
  const category = formData.get('category') as string
  const link = formData.get('link') as string
  const thumbnail_url = formData.get('thumbnail_url') as string || null
  const published_at = formData.get('published_at') as string

  // 유효성 검사
  if (!title || !source || !category || !link || !published_at) {
    return { success: false, message: '필수 항목을 모두 입력해주세요.' }
  }

  const { data, error } = await supabase
    .from('news_articles')
    .insert({
      title,
      source,
      category,
      link,
      thumbnail_url,
      published_at,
    })
    .select('id')
    .single()

  if (error) {
    console.error('뉴스 생성 오류:', error)
    return { success: false, message: '뉴스 생성에 실패했습니다.' }
  }

  revalidatePath('/news')
  return { success: true, id: data.id }
}

// 뉴스 수정 (관리자 전용)
export async function updateNewsArticle(id: string, formData: FormData): Promise<{ success: boolean; message?: string }> {
  const supabase = await createClient()

  // 관리자 권한 체크
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: '로그인이 필요합니다.' }
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) {
    return { success: false, message: '관리자 권한이 필요합니다.' }
  }

  // 데이터 추출
  const title = formData.get('title') as string
  const source = formData.get('source') as string
  const category = formData.get('category') as string
  const link = formData.get('link') as string
  const thumbnail_url = formData.get('thumbnail_url') as string || null
  const published_at = formData.get('published_at') as string

  const { error } = await supabase
    .from('news_articles')
    .update({
      title,
      source,
      category,
      link,
      thumbnail_url,
      published_at,
    })
    .eq('id', id)

  if (error) {
    console.error('뉴스 수정 오류:', error)
    return { success: false, message: '뉴스 수정에 실패했습니다.' }
  }

  revalidatePath('/news')
  return { success: true }
}

// 뉴스 삭제 (관리자 전용, soft delete)
export async function deleteNewsArticle(id: string): Promise<{ success: boolean; message?: string }> {
  const supabase = await createClient()

  // 관리자 권한 체크
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: '로그인이 필요합니다.' }
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) {
    return { success: false, message: '관리자 권한이 필요합니다.' }
  }

  const { error } = await supabase
    .from('news_articles')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    console.error('뉴스 삭제 오류:', error)
    return { success: false, message: '뉴스 삭제에 실패했습니다.' }
  }

  revalidatePath('/news')
  return { success: true }
}

// 카테고리 목록 조회
export async function getNewsCategories(): Promise<string[]> {
  return ['전체', '언론보도', '해외자료', '블로그', '보도자료']
}
