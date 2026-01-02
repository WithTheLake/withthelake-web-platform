'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, X } from 'lucide-react'
import { createPost, updatePost, type BoardType } from '@/actions/communityActions'

interface WriteFormProps {
  boardType: BoardType
  existingPost?: {
    id: string
    title: string
    content: string
    board_type: BoardType
  } | null
  isEdit: boolean
}

const BOARD_LABELS: Record<BoardType, string> = {
  notice: '공지사항',
  free: '자유게시판',
  review: '힐링 후기',
}

export default function WriteForm({
  boardType,
  existingPost,
  isEdit,
}: WriteFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const [title, setTitle] = useState(existingPost?.title || '')
  const [content, setContent] = useState(existingPost?.content || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const actualBoardType = existingPost?.board_type || boardType

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('제목을 입력해주세요.')
      return
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('board_type', actualBoardType)
      formData.append('title', title.trim())
      formData.append('content', content.trim())

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
            {BOARD_LABELS[actualBoardType]}
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
          {/* 제목 */}
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

          {/* 내용 */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요 (최대 10,000자)"
              maxLength={10000}
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{content.length} / 10,000</p>
          </div>

          {/* 버튼 */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
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
