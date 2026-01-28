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

// 제품 활성화/비활성화 토글 (관리자 전용)
export async function toggleProductActive(id: string, isActive: boolean): Promise<{ success: boolean; message?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: '로그인이 필요합니다.' }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { success: false, message: '관리자 권한이 필요합니다.' }

  const { error } = await supabase
    .from('store_products')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) {
    console.error('제품 상태 변경 오류:', error)
    return { success: false, message: '상태 변경에 실패했습니다.' }
  }

  revalidatePath('/store')
  return { success: true }
}

// ============================================
// 스토어 카테고리 관리 Server Actions
// ============================================

export interface StoreCategoryItem {
  id: string
  name: string
  description: string | null
  order_index: number
  is_active: boolean
  created_at: string
}

/**
 * 스토어 카테고리 목록 조회 (활성화된 것만)
 * 프론트엔드 필터용 - '전체'를 앞에 추가하여 반환
 */
export async function getStoreCategories(): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('store_categories')
    .select('name')
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('스토어 카테고리 조회 오류:', error)
    return ['전체']
  }

  return ['전체', ...(data || []).map(c => c.name)]
}

/**
 * 관리자용 - 모든 스토어 카테고리 조회 (비활성 포함)
 */
export async function getAdminStoreCategories(): Promise<StoreCategoryItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('store_categories')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('관리자 스토어 카테고리 조회 오류:', error)
    return []
  }

  return data || []
}

/**
 * 스토어 카테고리 생성 (관리자 전용)
 */
export async function createStoreCategory(data: {
  name: string
  description?: string
  order_index?: number
}): Promise<{ success: boolean; message?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: '로그인이 필요합니다.' }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { success: false, message: '관리자 권한이 필요합니다.' }

  if (!data.name.trim()) {
    return { success: false, message: '카테고리명을 입력해주세요.' }
  }

  const { error } = await supabase
    .from('store_categories')
    .insert({
      name: data.name.trim(),
      description: data.description || null,
      order_index: data.order_index || 0,
    })

  if (error) {
    if (error.code === '23505') {
      return { success: false, message: '이미 존재하는 카테고리명입니다.' }
    }
    console.error('스토어 카테고리 생성 오류:', error)
    return { success: false, message: '카테고리 생성에 실패했습니다.' }
  }

  revalidatePath('/admin/store')
  revalidatePath('/store')
  return { success: true }
}

/**
 * 스토어 카테고리 수정 (관리자 전용)
 */
export async function updateStoreCategory(
  id: string,
  data: { name?: string; description?: string; order_index?: number; is_active?: boolean }
): Promise<{ success: boolean; message?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: '로그인이 필요합니다.' }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { success: false, message: '관리자 권한이 필요합니다.' }

  const { error } = await supabase
    .from('store_categories')
    .update(data)
    .eq('id', id)

  if (error) {
    console.error('스토어 카테고리 수정 오류:', error)
    return { success: false, message: '카테고리 수정에 실패했습니다.' }
  }

  revalidatePath('/admin/store')
  revalidatePath('/store')
  return { success: true }
}

/**
 * 스토어 카테고리 삭제 (관리자 전용)
 * 해당 카테고리를 사용하는 상품이 있으면 삭제 불가
 */
export async function deleteStoreCategory(id: string): Promise<{ success: boolean; message?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: '로그인이 필요합니다.' }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { success: false, message: '관리자 권한이 필요합니다.' }

  // 해당 카테고리명 조회
  const { data: cat } = await supabase
    .from('store_categories')
    .select('name')
    .eq('id', id)
    .single()

  if (!cat) return { success: false, message: '카테고리를 찾을 수 없습니다.' }

  // 해당 카테고리를 사용하는 상품이 있는지 확인
  const { count } = await supabase
    .from('store_products')
    .select('id', { count: 'exact', head: true })
    .eq('category', cat.name)
    .eq('is_active', true)

  if (count && count > 0) {
    return { success: false, message: `해당 카테고리를 사용하는 상품이 ${count}개 있습니다. 먼저 상품의 카테고리를 변경해주세요.` }
  }

  const { error } = await supabase
    .from('store_categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('스토어 카테고리 삭제 오류:', error)
    return { success: false, message: '카테고리 삭제에 실패했습니다.' }
  }

  revalidatePath('/admin/store')
  revalidatePath('/store')
  return { success: true }
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

// 관리자용 - 모든 상품 조회 (비활성 포함)
export async function getAdminStoreProducts(options?: {
  category?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<{ data: StoreProduct[]; count: number }> {
  const supabase = await createClient()

  let query = supabase
    .from('store_products')
    .select('*', { count: 'exact' })
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false })

  if (options?.category && options.category !== '전체') {
    query = query.eq('category', options.category)
  }

  if (options?.search) {
    query = query.ilike('name', `%${options.search}%`)
  }

  if (options?.limit) {
    const start = options.offset || 0
    query = query.range(start, start + options.limit - 1)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('관리자 상품 조회 오류:', error)
    return { data: [], count: 0 }
  }

  return { data: data || [], count: count || 0 }
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
