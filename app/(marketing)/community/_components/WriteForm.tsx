'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, X, ImagePlus, Trash2, Star, Loader2, Image as ImageIcon, ChevronDown, Package } from 'lucide-react'
import { createPost, updatePost } from '@/actions/communityActions'
import { uploadCommunityImage, deleteCommunityImage } from '@/actions/imageActions'
import { getProductsForSelect } from '@/actions/storeActions'
import { compressImage, formatFileSize } from '@/lib/utils/imageCompression'
import {
  type BoardType,
  type FreeBoardTopic,
  getBoardLabel,
  getTopicLabel,
  FREE_BOARD_TOPICS,
} from '@/lib/constants/community'

interface UploadedImage {
  url: string
  path: string
}

interface ProductOption {
  id: string
  name: string
  image_url: string | null
}

interface WriteFormProps {
  boardType: BoardType
  existingPost?: {
    id: string
    title: string
    content: string
    board_type: BoardType
    topic?: FreeBoardTopic | null
    thumbnail_url?: string | null
    images?: string[] | null
    // 후기 게시판 전용 필드
    rating?: number | null
    product_id?: string | null
  } | null
  isEdit: boolean
}

// 갤러리 스타일 이미지 업로드가 필요한 게시판 (이벤트/후기)
const GALLERY_IMAGE_BOARDS: BoardType[] = ['event', 'review']

// 인라인 이미지 삽입이 가능한 게시판 (공지사항/자유게시판)
const INLINE_IMAGE_BOARDS: BoardType[] = ['notice', 'free']

// 제목이 없는 게시판 (후기)
const NO_TITLE_BOARDS: BoardType[] = ['review']

export default function WriteForm({
  boardType,
  existingPost,
  isEdit,
}: WriteFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inlineFileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [title, setTitle] = useState(existingPost?.title || '')
  const [content, setContent] = useState(existingPost?.content || '')
  const [topic, setTopic] = useState<FreeBoardTopic>(existingPost?.topic || 'chat')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 후기 게시판 전용 상태
  const [rating, setRating] = useState<number>(existingPost?.rating || 5)
  const [selectedProductId, setSelectedProductId] = useState<string>(existingPost?.product_id || '')
  const [products, setProducts] = useState<ProductOption[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [showProductDropdown, setShowProductDropdown] = useState(false)

  // 이미지 관련 상태
  const [images, setImages] = useState<UploadedImage[]>(() => {
    // 기존 게시글의 이미지 복원
    if (existingPost?.images) {
      return existingPost.images.map((url) => ({
        url,
        path: '' // 기존 이미지는 path 정보 없음
      }))
    }
    return []
  })
  const [thumbnailIndex, setThumbnailIndex] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isInlineUploading, setIsInlineUploading] = useState(false)

  const actualBoardType = existingPost?.board_type || boardType
  const showGalleryImageUpload = GALLERY_IMAGE_BOARDS.includes(actualBoardType)
  const showInlineImageUpload = INLINE_IMAGE_BOARDS.includes(actualBoardType)
  const showTitleField = !NO_TITLE_BOARDS.includes(actualBoardType)

  // localStorage 키 (게시판별로 분리)
  const STORAGE_KEY = `writeForm_${actualBoardType}${isEdit && existingPost ? `_edit_${existingPost.id}` : '_new'}`

  // 폼 내용 자동 저장 (localStorage)
  useEffect(() => {
    // 수정 모드가 아니고 새 글 작성일 때만 복원
    if (!isEdit) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.title) setTitle(parsed.title)
          if (parsed.content) setContent(parsed.content)
          if (parsed.topic) setTopic(parsed.topic)
        } catch {
          // 파싱 실패 시 무시
        }
      }
    }
  }, [STORAGE_KEY, isEdit])

  // 폼 내용 변경 시 자동 저장 (500ms 디바운스)
  useEffect(() => {
    // 수정 모드가 아닐 때만 저장
    if (isEdit) return

    const timeoutId = setTimeout(() => {
      const dataToSave = { title, content, topic }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [title, content, topic, STORAGE_KEY, isEdit])

  // 후기 게시판: 상품 목록 로드
  useEffect(() => {
    if (actualBoardType !== 'review') return

    const loadProducts = async () => {
      setIsLoadingProducts(true)
      try {
        const productList = await getProductsForSelect()
        setProducts(productList)
      } catch (error) {
        console.error('상품 목록 로드 실패:', error)
      } finally {
        setIsLoadingProducts(false)
      }
    }

    loadProducts()
  }, [actualBoardType])

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.product-dropdown')) {
        setShowProductDropdown(false)
      }
    }

    if (showProductDropdown) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showProductDropdown])

  // 선택된 상품 정보
  const selectedProduct = products.find(p => p.id === selectedProductId)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // 최대 10장 제한
    if (images.length + files.length > 10) {
      setError('이미지는 최대 10장까지 업로드 가능합니다.')
      return
    }

    setIsUploading(true)
    setError('')

    for (const file of Array.from(files)) {
      try {
        // 이미지 압축 (최대 1MB, 1920px)
        const originalSize = file.size
        const compressedFile = await compressImage(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          quality: 0.8,
        })

        // 압축 결과 로그 (개발용)
        if (compressedFile.size < originalSize) {
          console.log(`[이미지 압축] ${file.name}: ${formatFileSize(originalSize)} → ${formatFileSize(compressedFile.size)}`)
        }

        const formData = new FormData()
        formData.append('file', compressedFile)

        const result = await uploadCommunityImage(formData)

        if (result.success && result.url && result.path) {
          setImages((prev) => [...prev, { url: result.url!, path: result.path! }])
        } else {
          setError(result.message || '이미지 업로드에 실패했습니다.')
          break
        }
      } catch (err) {
        console.error('이미지 처리 실패:', err)
        setError('이미지 처리 중 오류가 발생했습니다.')
        break
      }
    }

    setIsUploading(false)

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = async (index: number) => {
    const image = images[index]

    // path가 있으면 Storage에서도 삭제
    if (image.path) {
      await deleteCommunityImage(image.path)
    }

    setImages((prev) => prev.filter((_, i) => i !== index))

    // 썸네일 인덱스 조정
    if (thumbnailIndex === index) {
      setThumbnailIndex(0)
    } else if (thumbnailIndex > index) {
      setThumbnailIndex((prev) => prev - 1)
    }
  }

  const handleSetThumbnail = (index: number) => {
    setThumbnailIndex(index)
  }

  // 인라인 이미지 업로드 (공지사항/자유게시판용)
  const handleInlineImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsInlineUploading(true)
    setError('')

    for (const file of Array.from(files)) {
      try {
        // 이미지 압축 (최대 1MB, 1920px)
        const originalSize = file.size
        const compressedFile = await compressImage(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          quality: 0.8,
        })

        // 압축 결과 로그 (개발용)
        if (compressedFile.size < originalSize) {
          console.log(`[이미지 압축] ${file.name}: ${formatFileSize(originalSize)} → ${formatFileSize(compressedFile.size)}`)
        }

        const formData = new FormData()
        formData.append('file', compressedFile)

        const result = await uploadCommunityImage(formData)

        if (result.success && result.url && result.path) {
          // 이미지 URL을 마크다운 형식으로 현재 커서 위치에 삽입
          const imageMarkdown = `\n![이미지](${result.url})\n`

          if (textareaRef.current) {
            const textarea = textareaRef.current
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const newContent = content.substring(0, start) + imageMarkdown + content.substring(end)
            setContent(newContent)

            // 커서 위치 조정
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length
              textarea.focus()
            }, 0)
          } else {
            setContent((prev) => prev + imageMarkdown)
          }

          // 이미지 배열에도 추가 (첨부파일 표시용)
          setImages((prev) => [...prev, { url: result.url!, path: result.path! }])
        } else {
          setError(result.message || '이미지 업로드에 실패했습니다.')
          break
        }
      } catch (err) {
        console.error('이미지 처리 실패:', err)
        setError('이미지 처리 중 오류가 발생했습니다.')
        break
      }
    }

    setIsInlineUploading(false)

    // input 초기화
    if (inlineFileInputRef.current) {
      inlineFileInputRef.current.value = ''
    }
  }, [content])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 제목 필드가 있는 게시판만 제목 검증
    if (showTitleField && !title.trim()) {
      setError('제목을 입력해주세요.')
      return
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요.')
      return
    }

    // 이벤트/후기 게시판은 이미지 필수
    if (showGalleryImageUpload && images.length === 0) {
      setError('이미지를 최소 1장 이상 업로드해주세요.')
      return
    }

    // 후기 게시판은 상품 선택 필수
    if (actualBoardType === 'review' && !selectedProductId) {
      setError('리뷰할 상품을 선택해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('board_type', actualBoardType)
      // 후기 게시판은 제목을 본문 첫 줄로 자동 생성
      if (showTitleField) {
        formData.append('title', title.trim())
      } else {
        // 본문에서 첫 줄 추출 (최대 50자)
        const firstLine = content.trim().split('\n')[0].substring(0, 50)
        formData.append('title', firstLine || '후기')
      }
      formData.append('content', content.trim())

      // 자유게시판은 주제 추가
      if (actualBoardType === 'free') {
        formData.append('topic', topic)
      }

      // 후기 게시판은 평점과 상품 ID 추가
      if (actualBoardType === 'review') {
        formData.append('rating', rating.toString())
        formData.append('product_id', selectedProductId)
      }

      // 이미지 정보 추가
      if (images.length > 0) {
        formData.append('thumbnail_url', images[thumbnailIndex].url)
        formData.append('images', JSON.stringify(images.map((img) => img.url)))
      }

      let result
      if (isEdit && existingPost) {
        result = await updatePost(existingPost.id, formData)
      } else {
        result = await createPost(formData)
      }

      if (!result.success) {
        setError(result.message || result.error || '오류가 발생했습니다.')
        setIsSubmitting(false)
        return
      }

      // 성공 시 localStorage 정리
      localStorage.removeItem(STORAGE_KEY)

      router.push(`/community/${actualBoardType}`)
      router.refresh()
    } catch (err) {
      console.error('Submit error:', err)
      setError('오류가 발생했습니다. 다시 시도해주세요.')
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (confirm('작성을 취소하시겠습니까? 작성한 내용은 저장되지 않습니다.')) {
      router.back()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">
            {isEdit ? '글 수정' : '글 쓰기'}
          </h1>
          <p className="text-emerald-100 mt-1">
            {getBoardLabel(actualBoardType)}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-5 py-8">
        {/* 에러 메시지 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
          >
            {error}
          </motion.div>
        )}

        {/* 폼 */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
          {/* 주제 (자유게시판만) */}
          {actualBoardType === 'free' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                주제
              </label>
              <div className="flex flex-wrap gap-2">
                {FREE_BOARD_TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      topic === t
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {getTopicLabel(t)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 후기 게시판: 상품 선택 */}
          {actualBoardType === 'review' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                리뷰할 상품 <span className="text-red-500">*</span>
              </label>
              <div className="relative product-dropdown">
                <button
                  type="button"
                  onClick={() => setShowProductDropdown(!showProductDropdown)}
                  disabled={isLoadingProducts || isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base text-left flex items-center justify-between bg-white disabled:bg-gray-50"
                >
                  {isLoadingProducts ? (
                    <span className="text-gray-400 flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      상품 목록 불러오는 중...
                    </span>
                  ) : selectedProduct ? (
                    <span className="flex items-center gap-3">
                      {selectedProduct.image_url ? (
                        <Image
                          src={selectedProduct.image_url}
                          alt={selectedProduct.name}
                          width={32}
                          height={32}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <Package size={16} className="text-gray-400" />
                        </div>
                      )}
                      <span className="text-gray-900">{selectedProduct.name}</span>
                    </span>
                  ) : (
                    <span className="text-gray-400">상품을 선택해주세요</span>
                  )}
                  <ChevronDown size={20} className={`text-gray-400 transition-transform ${showProductDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* 드롭다운 목록 */}
                <AnimatePresence>
                  {showProductDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                      {products.length === 0 ? (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          등록된 상품이 없습니다
                        </div>
                      ) : (
                        products.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                              setSelectedProductId(product.id)
                              setShowProductDropdown(false)
                            }}
                            className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-emerald-50 transition-colors ${
                              selectedProductId === product.id ? 'bg-emerald-50' : ''
                            }`}
                          >
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="rounded object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                <Package size={20} className="text-gray-400" />
                              </div>
                            )}
                            <span className="text-gray-900">{product.name}</span>
                            {selectedProductId === product.id && (
                              <span className="ml-auto text-emerald-600 text-sm font-medium">선택됨</span>
                            )}
                          </button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* 후기 게시판: 평점 선택 (0.5 단위) */}
          {actualBoardType === 'review' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                평점 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFull = rating >= star
                  const isHalf = !isFull && rating >= star - 0.5

                  return (
                    <div key={star} className="relative" style={{ width: 36, height: 36 }}>
                      {/* 왼쪽 반 클릭 = n-0.5점 */}
                      <button
                        type="button"
                        onClick={() => setRating(star - 0.5)}
                        disabled={isSubmitting}
                        className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer disabled:cursor-not-allowed"
                        aria-label={`${star - 0.5}점`}
                      />
                      {/* 오른쪽 반 클릭 = n점 */}
                      <button
                        type="button"
                        onClick={() => setRating(star)}
                        disabled={isSubmitting}
                        className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer disabled:cursor-not-allowed"
                        aria-label={`${star}점`}
                      />
                      {/* 별 아이콘 */}
                      <div className="relative w-9 h-9 hover:scale-110 transition-transform">
                        {/* 빈 별 (배경) */}
                        <Star size={36} className="absolute text-gray-300" />
                        {/* 채워진 별 (반별 지원) */}
                        {(isFull || isHalf) && (
                          <div
                            className="absolute overflow-hidden"
                            style={{ width: isFull ? '100%' : '50%' }}
                          >
                            <Star size={36} className="text-amber-400 fill-amber-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                <span className="ml-3 text-lg font-semibold text-gray-700">
                  {rating}점
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                별의 왼쪽/오른쪽을 클릭해서 0.5 단위로 선택할 수 있습니다
              </p>
            </div>
          )}

          {/* 제목 (후기 게시판 제외) */}
          {showTitleField && (
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요 (최대 200자)"
                maxLength={200}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">{title.length} / 200</p>
            </div>
          )}

          {/* 이미지 업로드 (이벤트/후기 게시판만) */}
          {showGalleryImageUpload && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이미지 <span className="text-red-500">*</span>
                <span className="text-gray-400 font-normal ml-2">(최대 10장, 첫 번째 이미지가 썸네일)</span>
              </label>

              {/* 이미지 미리보기 그리드 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-3">
                <AnimatePresence>
                  {images.map((image, index) => (
                    <motion.div
                      key={image.url}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                        index === thumbnailIndex
                          ? 'border-amber-500'
                          : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={`업로드 이미지 ${index + 1}`}
                        fill
                        className="object-cover"
                      />

                      {/* 썸네일 뱃지 */}
                      {index === thumbnailIndex && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-500 text-white text-xs font-bold rounded flex items-center gap-0.5">
                          <Star size={10} fill="white" />
                          대표
                        </div>
                      )}

                      {/* 액션 버튼들 */}
                      <div className="absolute bottom-1 right-1 flex gap-1">
                        {index !== thumbnailIndex && (
                          <button
                            type="button"
                            onClick={() => handleSetThumbnail(index)}
                            className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors"
                            title="대표 이미지로 설정"
                          >
                            <Star size={14} className="text-amber-500" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-1.5 bg-white/90 rounded-lg hover:bg-red-50 transition-colors"
                          title="이미지 삭제"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* 이미지 추가 버튼 */}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 transition-colors flex flex-col items-center justify-center text-gray-400 hover:text-emerald-600 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <>
                        <ImagePlus size={24} />
                        <span className="text-xs mt-1">추가</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />

              <p className="text-xs text-gray-500">
                JPG, PNG, GIF, WEBP 형식 / 파일당 최대 5MB
              </p>
            </div>
          )}

          {/* 내용 */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
              내용
            </label>

            {/* 공지사항/자유게시판: 이미지 삽입 툴바 */}
            {showInlineImageUpload && (
              <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 border border-gray-300 border-b-0 rounded-t-lg">
                <button
                  type="button"
                  onClick={() => inlineFileInputRef.current?.click()}
                  disabled={isInlineUploading || isSubmitting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                >
                  {isInlineUploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ImageIcon size={16} />
                  )}
                  이미지 삽입
                </button>
                <span className="text-xs text-gray-400">
                  클릭하여 현재 커서 위치에 이미지를 삽입합니다
                </span>
                <input
                  ref={inlineFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  multiple
                  onChange={handleInlineImageUpload}
                  className="hidden"
                />
              </div>
            )}

            <textarea
              ref={textareaRef}
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={showInlineImageUpload
                ? "내용을 입력하세요. 이미지 삽입 버튼을 눌러 글 사이에 이미지를 추가할 수 있습니다. (최대 10,000자)"
                : "내용을 입력하세요 (최대 10,000자)"}
              maxLength={10000}
              rows={15}
              className={`w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base resize-none ${
                showInlineImageUpload ? 'rounded-b-lg rounded-t-none' : 'rounded-lg'
              }`}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{content.length} / 10,000</p>

            {/* 인라인 이미지 미리보기 (공지사항/자유게시판) */}
            {showInlineImageUpload && images.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                <p className="text-xs text-gray-500 mb-2">삽입된 이미지 ({images.length}개)</p>
                <div className="flex flex-wrap gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative w-16 h-16 rounded overflow-hidden border">
                      <Image
                        src={image.url}
                        alt={`삽입 이미지 ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isUploading || isInlineUploading}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {isSubmitting ? '저장 중...' : isEdit ? '수정하기' : '작성하기'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <X size={20} />
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
