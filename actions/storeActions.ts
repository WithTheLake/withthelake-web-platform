'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 상품 타입 정의
export interface StoreProduct {
  id: string
  name: string
  price: number
  original_price: number | null
  category: string
  badge: string | null
  rating: number
  review_count: number
  image_url: string | null
  naver_product_url: string | null
  description: string | null
  is_active: boolean
  order_index: number
  created_at: string
  updated_at: string
}

// 상품 목록 조회
export async function getStoreProducts(options?: {
  category?: string
  limit?: number
  offset?: number
}): Promise<{ data: StoreProduct[]; count: number }> {
  const supabase = await createClient()

  let query = supabase
    .from('store_products')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
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
    console.error('상품 조회 오류:', error)
    return { data: [], count: 0 }
  }

  return { data: data || [], count: count || 0 }
}

// 단일 상품 조회
export async function getStoreProduct(id: string): Promise<StoreProduct | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('store_products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('상품 상세 조회 오류:', error)
    return null
  }

  return data
}

// 상품 생성 (관리자 전용)
export async function createStoreProduct(formData: FormData): Promise<{ success: boolean; message?: string; id?: string }> {
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
  const name = formData.get('name') as string
  const price = parseInt(formData.get('price') as string, 10)
  const original_price = formData.get('original_price') ? parseInt(formData.get('original_price') as string, 10) : null
  const category = formData.get('category') as string
  const badge = formData.get('badge') as string || null
  const image_url = formData.get('image_url') as string || null
  const naver_product_url = formData.get('naver_product_url') as string || null
  const description = formData.get('description') as string || null

  // 유효성 검사
  if (!name || !price || !category) {
    return { success: false, message: '필수 항목을 모두 입력해주세요.' }
  }

  const { data, error } = await supabase
    .from('store_products')
    .insert({
      name,
      price,
      original_price,
      category,
      badge,
      image_url,
      naver_product_url,
      description,
    })
    .select('id')
    .single()

  if (error) {
    console.error('상품 생성 오류:', error)
    return { success: false, message: '상품 생성에 실패했습니다.' }
  }

  revalidatePath('/store')
  return { success: true, id: data.id }
}

// 상품 수정 (관리자 전용)
export async function updateStoreProduct(id: string, formData: FormData): Promise<{ success: boolean; message?: string }> {
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
  const name = formData.get('name') as string
  const price = parseInt(formData.get('price') as string, 10)
  const original_price = formData.get('original_price') ? parseInt(formData.get('original_price') as string, 10) : null
  const category = formData.get('category') as string
  const badge = formData.get('badge') as string || null
  const image_url = formData.get('image_url') as string || null
  const naver_product_url = formData.get('naver_product_url') as string || null
  const description = formData.get('description') as string || null

  const { error } = await supabase
    .from('store_products')
    .update({
      name,
      price,
      original_price,
      category,
      badge,
      image_url,
      naver_product_url,
      description,
    })
    .eq('id', id)

  if (error) {
    console.error('상품 수정 오류:', error)
    return { success: false, message: '상품 수정에 실패했습니다.' }
  }

  revalidatePath('/store')
  return { success: true }
}

// 상품 삭제 (관리자 전용, soft delete)
export async function deleteStoreProduct(id: string): Promise<{ success: boolean; message?: string }> {
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
    .from('store_products')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    console.error('상품 삭제 오류:', error)
    return { success: false, message: '상품 삭제에 실패했습니다.' }
  }

  revalidatePath('/store')
  return { success: true }
}

// 카테고리 목록 조회
export async function getStoreCategories(): Promise<string[]> {
  return ['전체', '케어', '어싱', '체험']
}

// 상품 평점 및 리뷰 수 업데이트 (리뷰 작성/수정/삭제 시 호출)
export async function updateProductRating(productId: string): Promise<{ success: boolean; message?: string }> {
  const supabase = await createClient()

  // 해당 상품의 활성화된 리뷰에서 평균 평점과 리뷰 수 계산
  const { data: reviews, error: reviewError } = await supabase
    .from('community_posts')
    .select('rating')
    .eq('product_id', productId)
    .eq('board_type', 'review')
    .eq('is_active', true)
    .not('rating', 'is', null)

  if (reviewError) {
    console.error('리뷰 조회 오류:', reviewError)
    return { success: false, message: '리뷰 조회에 실패했습니다.' }
  }

  // 평균 평점 계산
  const reviewCount = reviews?.length || 0
  let avgRating = 0

  if (reviewCount > 0) {
    const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0)
    avgRating = Math.round((totalRating / reviewCount) * 10) / 10 // 소수점 1자리
  }

  // store_products 테이블 업데이트
  const { error: updateError } = await supabase
    .from('store_products')
    .update({
      rating: avgRating,
      review_count: reviewCount,
    })
    .eq('id', productId)

  if (updateError) {
    console.error('상품 평점 업데이트 오류:', updateError)
    return { success: false, message: '상품 평점 업데이트에 실패했습니다.' }
  }

  revalidatePath('/store')
  revalidatePath('/community/review')

  return { success: true }
}

// 간단한 상품 목록 조회 (드롭다운용 - id, name, image만)
export async function getProductsForSelect(): Promise<{ id: string; name: string; image_url: string | null }[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('store_products')
    .select('id, name, image_url')
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('상품 목록 조회 오류:', error)
    return []
  }

  return data || []
}
