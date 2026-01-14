'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, X, ImagePlus, Trash2, Star, Loader2, Image as ImageIcon } from 'lucide-react'
import { createPost, updatePost } from '@/actions/communityActions'
import { uploadCommunityImage, deleteCommunityImage } from '@/actions/imageActions'
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // 최대 5장 제한
    if (images.length + files.length > 5) {
      setError('이미지는 최대 5장까지 업로드 가능합니다.')
      return
    }

    setIsUploading(true)
    setError('')

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadCommunityImage(formData)

      if (result.success && result.url && result.path) {
        setImages((prev) => [...prev, { url: result.url!, path: result.path! }])
      } else {
        setError(result.message || '이미지 업로드에 실패했습니다.')
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
      const formData = new FormData()
      formData.append('file', file)

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
                <span className="text-gray-400 font-normal ml-2">(최대 5장, 첫 번째 이미지가 썸네일)</span>
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
