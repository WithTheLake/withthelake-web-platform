import imageCompression from 'browser-image-compression'

/**
 * 이미지 압축 옵션
 */
export interface CompressionOptions {
  /** 최대 파일 크기 (MB) - 기본값: 1 */
  maxSizeMB?: number
  /** 최대 가로/세로 크기 (px) - 기본값: 1920 */
  maxWidthOrHeight?: number
  /** 출력 파일 타입 - 기본값: 원본 유지 */
  fileType?: 'image/webp' | 'image/jpeg' | 'image/png'
  /** 이미지 품질 (0-1) - 기본값: 0.8 */
  quality?: number
  /** Web Worker 사용 여부 - 기본값: true */
  useWebWorker?: boolean
}

/**
 * 기본 압축 옵션
 */
const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  quality: 0.8,
  useWebWorker: true,
}

/**
 * 썸네일용 압축 옵션 (목록 표시용)
 */
export const THUMBNAIL_OPTIONS: CompressionOptions = {
  maxSizeMB: 0.3,
  maxWidthOrHeight: 600,
  quality: 0.7,
  useWebWorker: true,
}

/**
 * 이미지 파일을 압축합니다.
 *
 * @param file - 압축할 이미지 파일
 * @param options - 압축 옵션
 * @returns 압축된 이미지 파일
 *
 * @example
 * ```ts
 * const compressedFile = await compressImage(file)
 * const formData = new FormData()
 * formData.append('file', compressedFile)
 * ```
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }
  const isDev = process.env.NODE_ENV === 'development'

  // 이미 충분히 작은 파일은 압축하지 않음
  const maxBytes = (mergedOptions.maxSizeMB || 1) * 1024 * 1024
  if (file.size <= maxBytes) {
    if (isDev) {
      console.log(`[이미지 압축] 스킵 - 파일이 이미 ${(file.size / 1024).toFixed(0)}KB로 충분히 작음`)
    }
    return file
  }

  try {
    if (isDev) {
      console.log(`[이미지 압축] 시작 - 원본: ${(file.size / 1024).toFixed(0)}KB`)
    }

    const compressedFile = await imageCompression(file, {
      maxSizeMB: mergedOptions.maxSizeMB,
      maxWidthOrHeight: mergedOptions.maxWidthOrHeight,
      fileType: mergedOptions.fileType,
      initialQuality: mergedOptions.quality,
      useWebWorker: mergedOptions.useWebWorker,
    })

    if (isDev) {
      console.log(`[이미지 압축] 완료 - 압축: ${(compressedFile.size / 1024).toFixed(0)}KB (${((1 - compressedFile.size / file.size) * 100).toFixed(0)}% 감소)`)
    }

    return compressedFile
  } catch (error) {
    console.error('[이미지 압축] 실패:', error)
    // 압축 실패 시 원본 반환
    return file
  }
}

/**
 * 여러 이미지 파일을 병렬로 압축합니다.
 *
 * @param files - 압축할 이미지 파일 배열
 * @param options - 압축 옵션
 * @param onProgress - 진행 상황 콜백 (완료된 개수)
 * @returns 압축된 이미지 파일 배열
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (completed: number, total: number) => void
): Promise<File[]> {
  let completed = 0
  const total = files.length

  const compressedFiles = await Promise.all(
    files.map(async (file) => {
      const result = await compressImage(file, options)
      completed++
      onProgress?.(completed, total)
      return result
    })
  )

  return compressedFiles
}

/**
 * 이미지 파일의 크기가 제한을 초과하는지 확인합니다.
 *
 * @param file - 확인할 파일
 * @param maxSizeMB - 최대 크기 (MB)
 * @returns 제한 초과 여부
 */
export function isImageTooLarge(file: File, maxSizeMB: number = 5): boolean {
  return file.size > maxSizeMB * 1024 * 1024
}

/**
 * 이미지 파일 타입이 지원되는지 확인합니다.
 *
 * @param file - 확인할 파일
 * @returns 지원 여부
 */
export function isSupportedImageType(file: File): boolean {
  const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  return supportedTypes.includes(file.type)
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환합니다.
 *
 * @param bytes - 바이트 크기
 * @returns 포맷된 문자열 (예: "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
