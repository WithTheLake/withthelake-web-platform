'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { AudioItem } from '@/types/audio'

/**
 * 활성화된 오디오 트랙 목록 조회
 * @param category 'walk_guide' | 'affirmation' | null (전체)
 */
export async function getAudioTracks(category?: string) {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('audio_tracks')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Get audio tracks error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch audio tracks'
    }
  }
}

/**
 * 특정 오디오 트랙 상세 조회
 */
export async function getAudioTrack(id: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('audio_tracks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Get audio track error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch audio track'
    }
  }
}

// ============================================
// 관리자 전용 Server Actions
// ============================================

/**
 * 관리자용 - 모든 오디오 트랙 조회 (비활성 포함)
 */
export async function getAdminAudioTracks(options?: {
  category?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<{ data: AudioItem[]; count: number }> {
  const supabase = await createClient()

  let query = supabase
    .from('audio_tracks')
    .select('*', { count: 'exact' })
    .order('category', { ascending: true })
    .order('order_index', { ascending: true })

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.search) {
    query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%,trail_name.ilike.%${options.search}%`)
  }

  if (options?.limit) {
    const start = options.offset || 0
    query = query.range(start, start + options.limit - 1)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('관리자 오디오 조회 오류:', error)
    return { data: [], count: 0 }
  }

  return { data: (data || []) as AudioItem[], count: count || 0 }
}

/**
 * 오디오 파일 업로드 (관리자 전용)
 * audio/{category}/{timestamp-random}.ext 경로로 업로드
 */
export async function uploadAudioFile(
  file: File,
  category: string
): Promise<{ success: boolean; message?: string; filename?: string }> {
  const supabase = await createClient()

  // 관리자 권한 체크
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: '로그인이 필요합니다.' }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { success: false, message: '관리자 권한이 필요합니다.' }

  // 파일 타입 검증
  const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/m4a', 'audio/x-m4a']
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|aac|m4a)$/i)) {
    return { success: false, message: '지원하지 않는 파일 형식입니다. (MP3, WAV, OGG, AAC, M4A)' }
  }

  // 파일 크기 검증 (50MB)
  if (file.size > 50 * 1024 * 1024) {
    return { success: false, message: '파일 크기는 50MB 이하만 가능합니다.' }
  }

  // 고유 파일명 생성
  const ext = file.name.split('.').pop()?.toLowerCase() || 'mp3'
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const storagePath = `${category}/${timestamp}-${random}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('audio')
    .upload(storagePath, file, {
      contentType: file.type || 'audio/mpeg',
      upsert: false,
    })

  if (uploadError) {
    console.error('오디오 파일 업로드 오류:', uploadError)
    return { success: false, message: '파일 업로드에 실패했습니다.' }
  }

  // storagePath에서 파일명만 추출 (category/ 제외)
  const filename = `${timestamp}-${random}.${ext}`
  return { success: true, filename }
}

/**
 * 오디오 파일 삭제 (관리자 전용)
 */
export async function deleteAudioFile(
  category: string,
  filename: string
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

  const storagePath = `${category}/${filename}`
  const { error } = await supabase.storage
    .from('audio')
    .remove([storagePath])

  if (error) {
    console.error('오디오 파일 삭제 오류:', error)
    return { success: false, message: '파일 삭제에 실패했습니다.' }
  }

  return { success: true }
}

/**
 * 오디오 트랙 생성 (관리자 전용)
 * FormData에 'audioFile' 필드가 있으면 Storage에 업로드 후 filename 자동 설정
 */
export async function createAudioTrack(formData: FormData): Promise<{ success: boolean; message?: string; id?: string }> {
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
  const description = (formData.get('description') as string) || null
  const category = formData.get('category') as string
  const subcategory = (formData.get('subcategory') as string) || null
  let filename = (formData.get('filename') as string) || ''
  const emoji = (formData.get('emoji') as string) || null
  const duration = formData.get('duration') ? Number(formData.get('duration')) : null
  const order_index = formData.get('order_index') ? Number(formData.get('order_index')) : 0

  // 파일 업로드 처리
  const audioFile = formData.get('audioFile') as File | null
  if (audioFile && audioFile.size > 0) {
    const uploadResult = await uploadAudioFile(audioFile, category)
    if (!uploadResult.success) {
      return { success: false, message: uploadResult.message }
    }
    filename = uploadResult.filename!
  }

  // trail_guide 전용 필드
  const province = (formData.get('province') as string) || null
  const city = (formData.get('city') as string) || null
  const trail_name = (formData.get('trail_name') as string) || null
  const distance = (formData.get('distance') as string) || null
  const walking_time = (formData.get('walking_time') as string) || null
  const difficulty = (formData.get('difficulty') as string) || null

  // 유효성 검사
  if (!title || !category || !filename) {
    return { success: false, message: '제목, 카테고리, 파일은 필수입니다.' }
  }

  const { data, error } = await supabase
    .from('audio_tracks')
    .insert({
      title,
      description,
      category,
      subcategory,
      filename,
      emoji,
      duration,
      order_index,
      province,
      city,
      trail_name,
      distance,
      walking_time,
      difficulty,
    })
    .select('id')
    .single()

  if (error) {
    console.error('오디오 트랙 생성 오류:', error)
    return { success: false, message: '오디오 트랙 생성에 실패했습니다.' }
  }

  revalidatePath('/admin/audio')
  revalidatePath('/healing')
  return { success: true, id: data.id }
}

/**
 * 오디오 트랙 수정 (관리자 전용)
 * FormData에 'audioFile' 필드가 있으면 기존 파일 삭제 후 새 파일 업로드
 */
export async function updateAudioTrack(id: string, formData: FormData): Promise<{ success: boolean; message?: string }> {
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
  const description = (formData.get('description') as string) || null
  const category = formData.get('category') as string
  const subcategory = (formData.get('subcategory') as string) || null
  let filename = (formData.get('filename') as string) || ''
  const emoji = (formData.get('emoji') as string) || null
  const duration = formData.get('duration') ? Number(formData.get('duration')) : null
  const order_index = formData.get('order_index') ? Number(formData.get('order_index')) : 0

  // 파일 교체 처리
  const audioFile = formData.get('audioFile') as File | null
  if (audioFile && audioFile.size > 0) {
    // 기존 파일 정보 조회
    const oldCategory = (formData.get('oldCategory') as string) || category
    const oldFilename = (formData.get('oldFilename') as string) || ''

    // 기존 파일 삭제 (있으면)
    if (oldFilename) {
      await deleteAudioFile(oldCategory, oldFilename)
    }

    // 새 파일 업로드
    const uploadResult = await uploadAudioFile(audioFile, category)
    if (!uploadResult.success) {
      return { success: false, message: uploadResult.message }
    }
    filename = uploadResult.filename!
  }

  // trail_guide 전용 필드
  const province = (formData.get('province') as string) || null
  const city = (formData.get('city') as string) || null
  const trail_name = (formData.get('trail_name') as string) || null
  const distance = (formData.get('distance') as string) || null
  const walking_time = (formData.get('walking_time') as string) || null
  const difficulty = (formData.get('difficulty') as string) || null

  const { error } = await supabase
    .from('audio_tracks')
    .update({
      title,
      description,
      category,
      subcategory,
      filename,
      emoji,
      duration,
      order_index,
      province,
      city,
      trail_name,
      distance,
      walking_time,
      difficulty,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('오디오 트랙 수정 오류:', error)
    return { success: false, message: '오디오 트랙 수정에 실패했습니다.' }
  }

  revalidatePath('/admin/audio')
  revalidatePath('/healing')
  return { success: true }
}

/**
 * 오디오 트랙 삭제 (관리자 전용, soft delete)
 */
export async function deleteAudioTrack(id: string): Promise<{ success: boolean; message?: string }> {
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
    .from('audio_tracks')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    console.error('오디오 트랙 삭제 오류:', error)
    return { success: false, message: '오디오 트랙 삭제에 실패했습니다.' }
  }

  revalidatePath('/admin/audio')
  revalidatePath('/healing')
  return { success: true }
}

/**
 * 오디오 트랙 활성화/비활성화 토글 (관리자 전용)
 */
export async function toggleAudioActive(id: string, isActive: boolean): Promise<{ success: boolean; message?: string }> {
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
    .from('audio_tracks')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) {
    console.error('오디오 상태 변경 오류:', error)
    return { success: false, message: '상태 변경에 실패했습니다.' }
  }

  revalidatePath('/admin/audio')
  revalidatePath('/healing')
  return { success: true }
}

// ============================================
// 오디오 카테고리 관리 Server Actions
// ============================================

export interface AudioCategoryItem {
  id: string
  slug: string
  label: string
  color: string
  order_index: number
  is_active: boolean
  created_at: string
}

/**
 * 오디오 카테고리 목록 조회
 * 활성화된 카테고리를 order_index 순으로 반환
 */
export async function getAudioCategories(): Promise<AudioCategoryItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('audio_categories')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('오디오 카테고리 조회 오류:', error)
    return []
  }

  return data || []
}

/**
 * 관리자용 - 모든 오디오 카테고리 조회 (비활성 포함)
 */
export async function getAdminAudioCategories(): Promise<AudioCategoryItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('audio_categories')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('관리자 오디오 카테고리 조회 오류:', error)
    return []
  }

  return data || []
}

/**
 * 오디오 카테고리 생성 (관리자 전용)
 */
export async function createAudioCategory(data: {
  slug: string
  label: string
  color?: string
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

  // slug 유효성 검사
  if (!/^[a-z0-9_]+$/.test(data.slug)) {
    return { success: false, message: 'slug는 영문 소문자, 숫자, 언더스코어(_)만 사용할 수 있습니다.' }
  }

  const { error } = await supabase
    .from('audio_categories')
    .insert({
      slug: data.slug,
      label: data.label,
      color: data.color || 'gray',
      order_index: data.order_index || 0,
    })

  if (error) {
    if (error.code === '23505') {
      return { success: false, message: '이미 존재하는 slug입니다.' }
    }
    console.error('오디오 카테고리 생성 오류:', error)
    return { success: false, message: '카테고리 생성에 실패했습니다.' }
  }

  revalidatePath('/admin/audio')
  return { success: true }
}

/**
 * 오디오 카테고리 수정 (관리자 전용)
 */
export async function updateAudioCategory(
  id: string,
  data: { label?: string; color?: string; order_index?: number; is_active?: boolean }
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
    .from('audio_categories')
    .update(data)
    .eq('id', id)

  if (error) {
    console.error('오디오 카테고리 수정 오류:', error)
    return { success: false, message: '카테고리 수정에 실패했습니다.' }
  }

  revalidatePath('/admin/audio')
  return { success: true }
}

/**
 * 오디오 카테고리 삭제 (관리자 전용)
 * 해당 카테고리를 사용하는 트랙이 있으면 삭제 불가
 */
export async function deleteAudioCategory(id: string): Promise<{ success: boolean; message?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: '로그인이 필요합니다.' }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { success: false, message: '관리자 권한이 필요합니다.' }

  // 해당 카테고리의 slug 조회
  const { data: cat } = await supabase
    .from('audio_categories')
    .select('slug')
    .eq('id', id)
    .single()

  if (!cat) return { success: false, message: '카테고리를 찾을 수 없습니다.' }

  // 해당 카테고리를 사용하는 트랙이 있는지 확인
  const { count } = await supabase
    .from('audio_tracks')
    .select('id', { count: 'exact', head: true })
    .eq('category', cat.slug)

  if (count && count > 0) {
    return { success: false, message: `해당 카테고리를 사용하는 오디오 트랙이 ${count}개 있습니다. 먼저 트랙의 카테고리를 변경해주세요.` }
  }

  const { error } = await supabase
    .from('audio_categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('오디오 카테고리 삭제 오류:', error)
    return { success: false, message: '카테고리 삭제에 실패했습니다.' }
  }

  revalidatePath('/admin/audio')
  return { success: true }
}

// ============================================
// Storage 파일 관리 Server Actions
// ============================================

export interface StorageFileItem {
  name: string
  id: string
  created_at: string
  updated_at: string
  metadata: {
    size: number
    mimetype: string
  } | null
}

/**
 * Storage 오디오 파일 목록 조회 (관리자 전용)
 * 카테고리(폴더)별로 파일 목록 반환
 */
export async function listAudioFiles(
  category: string
): Promise<{ success: boolean; files: StorageFileItem[]; message?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, files: [], message: '로그인이 필요합니다.' }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { success: false, files: [], message: '관리자 권한이 필요합니다.' }

  const { data, error } = await supabase.storage
    .from('audio')
    .list(category, {
      sortBy: { column: 'created_at', order: 'desc' },
    })

  if (error) {
    console.error('Storage 파일 목록 조회 오류:', error)
    return { success: false, files: [], message: '파일 목록 조회에 실패했습니다.' }
  }

  // .emptyFolderPlaceholder 같은 시스템 파일 제외
  const files = (data || []).filter(f => !f.name.startsWith('.')) as unknown as StorageFileItem[]
  return { success: true, files }
}

/**
 * Storage 파일이 DB(audio_tracks)에 등록되어 있는지 확인
 * filename 기준으로 매칭
 */
export async function checkFilesInDb(
  filenames: string[]
): Promise<{ success: boolean; linkedFiles: Record<string, string>; message?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, linkedFiles: {}, message: '로그인이 필요합니다.' }

  const { data, error } = await supabase
    .from('audio_tracks')
    .select('id, filename')
    .in('filename', filenames)

  if (error) {
    console.error('DB 파일 매칭 조회 오류:', error)
    return { success: false, linkedFiles: {}, message: '조회에 실패했습니다.' }
  }

  // filename → track id 매핑
  const linkedFiles: Record<string, string> = {}
  for (const row of data || []) {
    linkedFiles[row.filename] = row.id
  }

  return { success: true, linkedFiles }
}

/**
 * Storage 파일만 단독 업로드 (관리자 전용)
 * DB 레코드 생성 없이 Storage에만 업로드
 */
export async function uploadAudioFileOnly(
  file: File,
  category: string
): Promise<{ success: boolean; message?: string; filename?: string }> {
  return uploadAudioFile(file, category)
}

// ============================================
// Storage 폴더 관리 Server Actions
// ============================================

/**
 * Storage audio 버킷의 폴더(카테고리) 목록 조회 (관리자 전용)
 * 루트 레벨에서 list('')를 호출하여 실제 존재하는 폴더 반환
 */
export async function listAudioFolders(): Promise<{
  success: boolean
  folders: string[]
  message?: string
}> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, folders: [], message: '로그인이 필요합니다.' }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  if (!profile?.is_admin) return { success: false, folders: [], message: '관리자 권한이 필요합니다.' }

  const { data, error } = await supabase.storage
    .from('audio')
    .list('', { sortBy: { column: 'name', order: 'asc' } })

  if (error) {
    console.error('Storage 폴더 목록 조회 오류:', error)
    return { success: false, folders: [], message: '폴더 목록 조회에 실패했습니다.' }
  }

  // id가 null인 항목이 폴더 (Supabase Storage 특성)
  const folders = (data || [])
    .filter(item => item.id === null && !item.name.startsWith('.'))
    .map(item => item.name)

  return { success: true, folders }
}

/**
 * Storage 폴더(카테고리) 생성 (관리자 전용)
 * .emptyFolderPlaceholder 파일을 업로드하여 폴더 생성
 */
export async function createAudioFolder(
  folderName: string
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

  // 폴더명 유효성 검사 (영문 소문자, 숫자, 언더스코어만 허용)
  if (!/^[a-z0-9_]+$/.test(folderName)) {
    return { success: false, message: '폴더명은 영문 소문자, 숫자, 언더스코어(_)만 사용할 수 있습니다.' }
  }

  // 이미 존재하는지 확인
  const { data: existing } = await supabase.storage
    .from('audio')
    .list(folderName, { limit: 1 })

  // list가 에러 없이 결과를 반환하면 폴더가 이미 존재할 수 있음
  // 하지만 빈 배열이면 폴더가 없는 것
  // Supabase는 존재하지 않는 폴더를 list해도 빈 배열을 반환하므로
  // 기존 폴더 목록에서 확인
  const foldersResult = await listAudioFolders()
  if (foldersResult.folders.includes(folderName)) {
    return { success: false, message: '이미 존재하는 폴더입니다.' }
  }

  // 빈 placeholder 파일을 업로드하여 폴더 생성
  const placeholder = new Blob([''], { type: 'text/plain' })
  const { error } = await supabase.storage
    .from('audio')
    .upload(`${folderName}/.emptyFolderPlaceholder`, placeholder, {
      upsert: true,
    })

  if (error) {
    console.error('Storage 폴더 생성 오류:', error)
    return { success: false, message: '폴더 생성에 실패했습니다.' }
  }

  return { success: true }
}

/**
 * Storage 폴더(카테고리) 삭제 (관리자 전용)
 * 폴더 내 모든 파일을 삭제하여 폴더 제거
 */
export async function deleteAudioFolder(
  folderName: string
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

  // 폴더 내 모든 파일 목록 조회
  const { data: files, error: listError } = await supabase.storage
    .from('audio')
    .list(folderName)

  if (listError) {
    console.error('Storage 폴더 파일 목록 조회 오류:', listError)
    return { success: false, message: '폴더 파일 목록 조회에 실패했습니다.' }
  }

  if (!files || files.length === 0) {
    return { success: false, message: '이미 비어있거나 존재하지 않는 폴더입니다.' }
  }

  // DB에 연결된 파일이 있는지 확인
  const filenames = files.filter(f => !f.name.startsWith('.')).map(f => f.name)
  if (filenames.length > 0) {
    const { data: linkedTracks } = await supabase
      .from('audio_tracks')
      .select('id')
      .in('filename', filenames)
      .limit(1)

    if (linkedTracks && linkedTracks.length > 0) {
      return {
        success: false,
        message: 'DB에 연결된 오디오 트랙이 있는 폴더는 삭제할 수 없습니다. 먼저 해당 트랙을 삭제해주세요.',
      }
    }
  }

  // 모든 파일 삭제
  const paths = files.map(f => `${folderName}/${f.name}`)
  const { error: removeError } = await supabase.storage
    .from('audio')
    .remove(paths)

  if (removeError) {
    console.error('Storage 폴더 삭제 오류:', removeError)
    return { success: false, message: '폴더 삭제에 실패했습니다.' }
  }

  return { success: true }
}
