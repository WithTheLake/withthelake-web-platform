'use server'

import { createClient } from '@/lib/supabase/server'

// 커뮤니티 이미지 업로드
export async function uploadCommunityImage(formData: FormData) {
  try {
    const supabase = await createClient()

    // 인증 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'LOGIN_REQUIRED',
        message: '로그인이 필요합니다.'
      }
    }

    const file = formData.get('file') as File
    if (!file) {
      return {
        success: false,
        error: 'NO_FILE',
        message: '파일이 없습니다.'
      }
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'INVALID_FILE_TYPE',
        message: 'JPG, PNG, GIF, WEBP 형식의 이미지만 업로드 가능합니다.'
      }
    }

    // 파일 크기 검증 (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'FILE_TOO_LARGE',
        message: '파일 크기는 5MB 이하여야 합니다.'
      }
    }

    // 고유 파일명 생성
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${user.id}/${timestamp}-${randomString}.${extension}`

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('community-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return {
        success: false,
        error: 'UPLOAD_FAILED',
        message: '이미지 업로드에 실패했습니다.'
      }
    }

    // 공개 URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from('community-images')
      .getPublicUrl(data.path)

    return {
      success: true,
      url: publicUrl,
      path: data.path
    }
  } catch (error) {
    console.error('Image upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

// 이미지 삭제
export async function deleteCommunityImage(path: string) {
  try {
    const supabase = await createClient()

    // 인증 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'LOGIN_REQUIRED',
        message: '로그인이 필요합니다.'
      }
    }

    // 본인 이미지인지 확인 (path가 user.id로 시작하는지)
    if (!path.startsWith(`${user.id}/`)) {
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: '삭제 권한이 없습니다.'
      }
    }

    const { error } = await supabase.storage
      .from('community-images')
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return {
        success: false,
        error: 'DELETE_FAILED',
        message: '이미지 삭제에 실패했습니다.'
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Image delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}
