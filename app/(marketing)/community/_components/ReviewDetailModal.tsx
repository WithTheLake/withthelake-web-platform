'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Star, Eye, Edit, Trash2, Loader2 } from 'lucide-react'
import { deletePost } from '@/actions/communityActions'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils/format'

interface ReviewPost {
  id: string
  user_id: string | null
  board_type: string
  title: string
  content: string
  thumbnail_url: string | null
  images: string[] | null
  author_nickname: string | null
  view_count: number
  comment_count?: number
  is_pinned: boolean
  is_active?: boolean
  created_at: string
  updated_at?: string
  // 추후 구현될 필드 (현재는 임시 데이터)
  rating?: number
  review_type?: 'activity' | 'product'
  related_item?: string
}

interface ReviewDetailModalProps {
  isOpen: boolean
  onClose: () => void
  post: ReviewPost | null
  posts: ReviewPost[]  // 전체 게시글 목록 (이전/다음 네비게이션용)
  currentUserId?: string | null
  onNavigate: (postId: string) => void
  onDelete?: () => void  // 삭제 후 콜백
}

// 별점 렌더링 컴포넌트
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
        />
      ))}
    </div>
  )
}

// 임시 더미 데이터 생성 함수 (실제 DB 연동 전까지 사용)
const getRandomRating = (id: string): number => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return (hash % 2) + 4 // 4 또는 5
}

const getRandomReviewType = (id: string): 'activity' | 'product' => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return hash % 3 === 0 ? 'product' : 'activity'
}

const getRandomRelatedItem = (id: string, type: 'activity' | 'product'): string => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  if (type === 'activity') {
    const activities = ['춘천 맨발걷기', '강릉 해변길', '속초 힐링로드', '평창 자연숲길']
    return activities[hash % activities.length]
  } else {
    const products = ['르무통 업 발 편한 메리노울 운동화', '힐링로드 발 마사지기', '맨발걷기 양말']
    return products[hash % products.length]
  }
}

export default function ReviewDetailModal({
  isOpen,
  onClose,
  post,
  posts,
  currentUserId,
  onNavigate,
  onDelete,
}: ReviewDetailModalProps) {
  const { showToast } = useToast()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  // 현재 게시글의 인덱스 찾기
  const currentIndex = post ? posts.findIndex(p => p.id === post.id) : -1
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null

  // 임시 데이터
  const rating = post?.rating ?? (post ? getRandomRating(post.id) : 5)
  const reviewType = post?.review_type ?? (post ? getRandomReviewType(post.id) : 'activity')
  const relatedItem = post?.related_item ?? (post ? getRandomRelatedItem(post.id, reviewType) : '')

  // 작성자 여부
  const isOwner = currentUserId && post?.user_id === currentUserId

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && prevPost) {
        onNavigate(prevPost.id)
      } else if (e.key === 'ArrowRight' && nextPost) {
        onNavigate(nextPost.id)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, prevPost, nextPost, onNavigate])

  // 이미지 인덱스 초기화
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [post?.id])

  // 삭제 핸들러
  const handleDelete = useCallback(async () => {
    if (!post) return
    if (!confirm('정말 삭제하시겠습니까?')) return

    setIsDeleting(true)
    try {
      const result = await deletePost(post.id)
      if (result.success) {
        showToast('후기가 삭제되었습니다.', 'success')
        onClose()
        onDelete?.()
      } else {
        showToast(result.message || '삭제에 실패했습니다.', 'error')
      }
    } catch {
      showToast('오류가 발생했습니다.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }, [post, onClose, onDelete, showToast])

  // 이미지 네비게이션
  const images = post?.images || (post?.thumbnail_url ? [post.thumbnail_url] : [])
  const hasMultipleImages = images.length > 1

  const goToPrevImage = () => {
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goToNextImage = () => {
    setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))
  }

  if (!post) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* 배경 오버레이 */}
          <div className="absolute inset-0 bg-black/70" />

          {/* 이전 리뷰 버튼 - 모달 애니메이션 후 나타남 */}
          {prevPost && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.25, duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation()
                onNavigate(prevPost.id)
              }}
              className="absolute left-4 md:left-[calc(50%-400px)] top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-1.5 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={40} />
              <span className="text-sm font-medium">이전 리뷰</span>
            </motion.button>
          )}

          {/* 다음 리뷰 버튼 - 모달 애니메이션 후 나타남 */}
          {nextPost && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.25, duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation()
                onNavigate(nextPost.id)
              }}
              className="absolute right-4 md:right-[calc(50%-400px)] top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-1.5 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={40} />
              <span className="text-sm font-medium">다음 리뷰</span>
            </motion.button>
          )}

          {/* 모달 콘텐츠 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full mx-4 max-h-[90vh] overflow-hidden"
          >
            {/* 헤더 */}
            <div className="relative flex items-center justify-center px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-900">리뷰 상세 보기</h2>
              <button
                onClick={onClose}
                className="absolute right-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* 스크롤 영역 */}
            <div className="overflow-y-auto max-h-[calc(90vh-52px)]">
              {/* 관련 상품/활동 정보 */}
              <div className="px-6 py-3 bg-gray-50/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    {reviewType === 'activity' ? (
                      <span className="text-lg">🚶</span>
                    ) : (
                      <span className="text-lg">👟</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {relatedItem}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <StarRating rating={rating} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 이미지 */}
              {images.length > 0 && (
                <div className="relative px-6 py-3">
                  <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    <Image
                      src={images[currentImageIndex]}
                      alt="리뷰 이미지"
                      fill
                      className="object-contain"
                    />

                    {/* 이미지 네비게이션 */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={goToPrevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                        >
                          <ChevronLeft size={20} className="text-white" />
                        </button>
                        <button
                          onClick={goToNextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                        >
                          <ChevronRight size={20} className="text-white" />
                        </button>

                        {/* 이미지 인디케이터 */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex
                                  ? 'bg-white'
                                  : 'bg-white/50 hover:bg-white/70'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* 작성자 정보 & 별점 */}
              <div className="px-6 py-3">
                {/* 1줄: 닉네임 + 날짜 */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {post.author_nickname || '익명'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(post.created_at)}
                  </span>
                </div>
                {/* 2줄: 별점 + 조회수 */}
                <div className="flex items-center justify-between">
                  <StarRating rating={rating} />
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Eye size={12} />
                    {post.view_count}
                  </div>
                </div>
              </div>

              {/* 본문 */}
              <div className="px-6 pb-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* 작성자 액션 버튼 */}
              {isOwner && (
                <div className="px-6 py-3 bg-gray-50/70 flex items-center gap-2">
                  <Link
                    href={`/community/review/write?id=${post.id}`}
                    className="flex-1 py-2 text-center text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit size={14} />
                    수정
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 py-2 text-center text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    삭제
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
