'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUp,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  List,
  LogIn,
  Pin,
  PinOff,
} from 'lucide-react'
import { createComment, deletePost, deleteComment, togglePinPost, type BoardType, type FreeBoardTopic } from '@/actions/communityActions'
import LoginModal from '@/components/modals/LoginModal'

interface CommunityPost {
  id: string
  user_id: string | null
  board_type: BoardType
  topic: FreeBoardTopic | null
  title: string
  content: string
  thumbnail_url: string | null
  images: string[] | null
  author_nickname: string | null
  view_count: number
  comment_count: number
  is_pinned: boolean
  created_at: string
  updated_at: string
}

interface Comment {
  id: string
  post_id: string
  user_id: string | null
  content: string
  author_nickname: string | null
  created_at: string
}

interface AdjacentPost {
  id: string
  title: string
}

interface PostDetailProps {
  post: CommunityPost
  comments: Comment[]
  prevPost?: AdjacentPost | null
  nextPost?: AdjacentPost | null
  currentUserId?: string | null
  isAdmin?: boolean
}

const BOARD_LABELS: Record<BoardType, string> = {
  notice: '공지사항',
  event: '이벤트',
  free: '자유게시판',
  review: '힐링 후기',
}

const TOPIC_LABELS: Record<FreeBoardTopic, string> = {
  chat: '잡담',
  question: '질문',
  info: '정보',
  review: '후기',
}

const TOPIC_COLORS: Record<FreeBoardTopic, string> = {
  chat: 'text-gray-600 bg-gray-100',
  question: 'text-blue-600 bg-blue-100',
  info: 'text-emerald-600 bg-emerald-100',
  review: 'text-purple-600 bg-purple-100',
}

// 날짜 포맷 (YYYY-MM-DD)
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 날짜+시간 포맷 (YYYY-MM-DD HH:mm)
function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 한국어 상대 시간 포맷 (댓글용)
// - 1분 미만: "1 분 전"
// - 1시간 미만: "X 분 전"
// - 24시간 미만: "X 시간 전" (내림)
// - 24시간 이상: "YYYY-MM-DD HH:mm"
function formatRelativeTimeKorean(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffMinutes < 1) {
    return '1 분 전'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} 분 전`
  } else if (diffHours < 24) {
    return `${diffHours} 시간 전`
  } else {
    // 24시간 이상이면 전체 날짜+시간 표시
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }
}

export default function PostDetail({
  post,
  comments: initialComments,
  prevPost,
  nextPost,
  currentUserId,
  isAdmin = false,
}: PostDetailProps) {
  const router = useRouter()
  const [comments, setComments] = useState(initialComments)
  const [commentContent, setCommentContent] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [error, setError] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isPinned, setIsPinned] = useState(post.is_pinned)
  const [isTogglingPin, setIsTogglingPin] = useState(false)

  // 이미지 갤러리 상태
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 비회원 여부
  const isGuest = !currentUserId

  const boardPath = `/community/${post.board_type}`
  const hasImages = post.images && post.images.length > 0
  const isEventBoard = post.board_type === 'event'
  const isNoticeBoard = post.board_type === 'notice'
  const isFreeBoard = post.board_type === 'free'
  const isInlineImageBoard = isNoticeBoard || isFreeBoard

  // 현재 사용자가 게시글 작성자인지 확인
  const isPostOwner = currentUserId && post.user_id === currentUserId

  // 삭제 가능 여부: 본인 글이거나 관리자
  const canDelete = isPostOwner || isAdmin

  // 마크다운 이미지를 렌더링하는 함수 (공지사항/자유게시판용)
  const renderContentWithImages = (content: string) => {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
    const parts: (string | { type: 'image'; alt: string; url: string; index: number })[] = []
    let lastIndex = 0
    let match
    let imageIndex = 0

    while ((match = imageRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index))
      }
      parts.push({ type: 'image', alt: match[1], url: match[2], index: imageIndex++ })
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex))
    }

    return parts.map((part, idx) => {
      if (typeof part === 'string') {
        return <span key={idx} className="whitespace-pre-wrap">{part}</span>
      } else {
        const allImagesIndex = post.images?.indexOf(part.url) ?? part.index
        return (
          <div key={idx} className="my-4">
            <Image
              src={part.url}
              alt={part.alt || `이미지 ${part.index + 1}`}
              width={800}
              height={600}
              className="w-full h-auto rounded-lg cursor-pointer"
              onClick={() => openLightbox(allImagesIndex >= 0 ? allImagesIndex : part.index)}
            />
          </div>
        )
      }
    })
  }

  // 이미지 다운로드 핸들러
  const handleDownloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `image_${index + 1}.${blob.type.split('/')[1] || 'jpg'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      alert('다운로드에 실패했습니다.')
    }
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const goToPrevImage = () => {
    if (post.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? post.images!.length - 1 : prev - 1
      )
    }
  }

  const goToNextImage = () => {
    if (post.images) {
      setCurrentImageIndex((prev) =>
        prev === post.images!.length - 1 ? 0 : prev + 1
      )
    }
  }

  const handleDeletePost = async () => {
    if (!confirm('정말 이 글을 삭제하시겠습니까?')) return

    const result = await deletePost(post.id)
    if (result.success) {
      alert('글이 삭제되었습니다.')
      router.push(boardPath)
    } else {
      alert(result.message || '삭제에 실패했습니다.')
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!commentContent.trim()) {
      setError('댓글 내용을 입력해주세요.')
      return
    }

    setIsSubmittingComment(true)

    const result = await createComment(post.id, commentContent)

    if (!result.success) {
      setError(result.message || '댓글 작성에 실패했습니다.')
      setIsSubmittingComment(false)
      return
    }

    if (result.data) {
      setComments([...comments, result.data])
      setCommentContent('')
    }

    setIsSubmittingComment(false)
    router.refresh()
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return

    const result = await deleteComment(commentId)
    if (result.success) {
      setComments(comments.filter((c) => c.id !== commentId))
      router.refresh()
    } else {
      alert(result.message || '삭제에 실패했습니다.')
    }
  }

  // 게시글 고정/해제 (관리자 전용)
  const handleTogglePin = async () => {
    if (!isAdmin || isTogglingPin) return

    setIsTogglingPin(true)
    const result = await togglePinPost(post.id)

    if (result.success) {
      setIsPinned(result.isPinned ?? !isPinned)
      router.refresh()
    } else {
      alert(result.message || '고정 상태 변경에 실패했습니다.')
    }
    setIsTogglingPin(false)
  }

  return (
    <>
      {/* 이미지 라이트박스 */}
      <AnimatePresence>
        {lightboxOpen && hasImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X size={28} />
            </button>

            {/* 이전 버튼 */}
            {post.images!.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevImage()
                }}
                className="absolute left-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {/* 이미지 */}
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-[90vw] max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={post.images![currentImageIndex]}
                alt={`이미지 ${currentImageIndex + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-[85vh] object-contain"
              />
            </motion.div>

            {/* 다음 버튼 */}
            {post.images!.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNextImage()
                }}
                className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight size={32} />
              </button>
            )}

            {/* 페이지 인디케이터 */}
            {post.images!.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {post.images!.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 헤더 - 뒤로가기 + 게시판명 */}
      <section className="bg-white border-b px-4 pb-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href={boardPath}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors -ml-1.5"
          >
            <ArrowLeft size={22} />
          </Link>
          <span className="text-lg font-bold text-gray-800">
            {BOARD_LABELS[post.board_type]}
          </span>
          <div className="w-9" /> {/* 균형을 위한 빈 공간 */}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 게시글 본문 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm mb-3"
        >
          {/* 메타 정보 - 공지사항 스타일 */}
          {isNoticeBoard && (
            <div className="px-5 py-5">
              {/* 제목 행 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isPinned && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded">
                      중요공지
                    </span>
                  )}
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    {post.title}
                  </h1>
                </div>
                {/* 관리자/작성자 버튼 */}
                <div className="flex items-center gap-1">
                  {/* 고정/해제 버튼 - 관리자만 표시 */}
                  {isAdmin && (
                    <button
                      onClick={handleTogglePin}
                      disabled={isTogglingPin}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isPinned
                          ? 'text-amber-600 hover:bg-amber-50'
                          : 'text-gray-500 hover:bg-gray-100'
                      } disabled:opacity-50`}
                      title={isPinned ? '고정 해제' : '고정'}
                    >
                      {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                    </button>
                  )}
                  {/* 수정 버튼 - 작성자만 표시 */}
                  {isPostOwner && (
                    <Link
                      href={`${boardPath}/write?id=${post.id}`}
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </Link>
                  )}
                  {/* 삭제 버튼 - 작성자 또는 관리자 표시 */}
                  {canDelete && (
                    <button
                      onClick={handleDeletePost}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              {/* 메타 정보 테이블 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 text-sm border-t py-3 bg-gray-50 -mx-5 px-5">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">작성자</span>
                  <span className="font-medium text-gray-800">{post.author_nickname || '관리자'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">작성일</span>
                  <span className="font-medium text-gray-800">{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">조회수</span>
                  <span className="font-medium text-gray-800">{post.view_count.toLocaleString()}</span>
                </div>
                </div>
            </div>
          )}

          {/* 메타 정보 - 자유게시판 스타일 (공지사항 디자인 적용) */}
          {isFreeBoard && (
            <div className="px-5 py-5">
              {/* 첫번째 줄: 주제 뱃지 + 제목 + 작성일시 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1">
                  {post.topic && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded shrink-0 ${TOPIC_COLORS[post.topic]}`}>
                      {TOPIC_LABELS[post.topic]}
                    </span>
                  )}
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    {post.title}
                  </h1>
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap ml-3">
                  {formatDateTime(post.created_at)}
                </span>
              </div>
              {/* 두번째 줄: 닉네임 (좌측) + 조회수/댓글수 (우측) - 회색 배경 */}
              <div className="flex items-center justify-between text-sm text-gray-600 border-t py-3 bg-gray-50 -mx-5 px-5">
                <span className="font-medium">{post.author_nickname || '익명'}</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{post.view_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    <span>{comments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 메타 정보 - 이벤트/후기 게시판 (기존 스타일) */}
          {!isNoticeBoard && !isFreeBoard && (
            <div className="px-5 py-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                {isPinned && (
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">
                    공지
                  </span>
                )}
              </div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                {post.title}
              </h1>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span className="font-semibold">
                    {post.author_nickname || '익명'}
                  </span>
                  <span>{formatRelativeTimeKorean(post.created_at)}</span>
                  <div className="flex items-center gap-1">
                    <Eye size={12} />
                    {post.view_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={12} />
                    {comments.length}
                  </div>
                </div>
                {/* 관리자/작성자 버튼 */}
                <div className="flex items-center gap-0.5">
                  {/* 고정/해제 버튼 - 관리자만 표시 */}
                  {isAdmin && (
                    <button
                      onClick={handleTogglePin}
                      disabled={isTogglingPin}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isPinned
                          ? 'text-amber-600 hover:bg-amber-50'
                          : 'text-gray-500 hover:bg-gray-100'
                      } disabled:opacity-50`}
                      title={isPinned ? '고정 해제' : '고정'}
                    >
                      {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                    </button>
                  )}
                  {/* 수정 버튼 - 작성자만 표시 */}
                  {isPostOwner && (
                    <Link
                      href={`${boardPath}/write?id=${post.id}`}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit size={14} />
                    </Link>
                  )}
                  {/* 삭제 버튼 - 작성자 또는 관리자 표시 */}
                  {canDelete && (
                    <button
                      onClick={handleDeletePost}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 이벤트 게시판: 본문에 이미지 임베드 */}
          {isEventBoard ? (
            <div className="px-5 py-6">
              {/* 본문 내용 */}
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800 mb-6">
                {post.content}
              </div>

              {/* 본문 내 이미지 (썸네일 제외) */}
              {hasImages && post.images!.filter(img => img !== post.thumbnail_url).length > 0 && (
                <div className="space-y-3">
                  {post.images!
                    .filter(img => img !== post.thumbnail_url)
                    .map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative w-full cursor-pointer"
                        onClick={() => openLightbox(post.images!.indexOf(imageUrl))}
                      >
                        <Image
                          src={imageUrl}
                          alt={`이미지 ${index + 1}`}
                          width={800}
                          height={600}
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : isInlineImageBoard ? (
            /* 공지사항/자유게시판: 본문에 마크다운 이미지 인라인 렌더링 */
            <div className="px-5 py-6">
              <div className="prose prose-sm max-w-none text-gray-800">
                {renderContentWithImages(post.content)}
              </div>
            </div>
          ) : (
            <>
              {/* 후기 게시판: 이미지 갤러리 스타일 */}
              {hasImages && (
                <div className="px-5 py-3">
                  <div className={`grid gap-1.5 ${
                    post.images!.length === 1
                      ? 'grid-cols-1'
                      : post.images!.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-2 md:grid-cols-3'
                  }`}>
                    {post.images!.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openLightbox(index)}
                      >
                        <Image
                          src={imageUrl}
                          alt={`이미지 ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 text-center">
                    이미지를 클릭하면 크게 볼 수 있습니다
                  </p>
                </div>
              )}

              {/* 본문 내용 */}
              <div className="px-5 py-6">
                <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800">
                  {post.content}
                </div>
              </div>
            </>
          )}

          {/* 첨부 파일 섹션 (후기 게시판 제외) */}
          {hasImages && post.board_type !== 'review' && (
            <div className="px-5 py-3 border-t bg-gray-50">
              <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 text-xs">
                <span className="text-gray-600 font-medium mr-1.5">첨부파일</span>
                {post.images!.map((imageUrl, index) => {
                  const fileName = imageUrl.split('/').pop() || `image_${index + 1}.jpg`
                  return (
                    <button
                      key={index}
                      onClick={() => handleDownloadImage(imageUrl, index)}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                    >
                      <Paperclip size={12} />
                      <span className="underline">{fileName}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* 버튼 섹션 - 첨부파일과 댓글 사이 */}
        <div className="flex items-center justify-between mb-6">
          {/* 좌측: 고정/수정/삭제 버튼 */}
          <div className="flex items-center gap-2">
            {/* 고정/해제 버튼 - 관리자만 표시 */}
            {isAdmin && (
              <button
                onClick={handleTogglePin}
                disabled={isTogglingPin}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm bg-white rounded-lg shadow-sm transition-colors ${
                  isPinned
                    ? 'text-amber-600 hover:bg-amber-50'
                    : 'text-gray-600 hover:bg-gray-50'
                } disabled:opacity-50`}
              >
                {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                <span>{isPinned ? '고정 해제' : '고정'}</span>
              </button>
            )}
            {/* 수정 버튼 - 작성자만 표시 */}
            {isPostOwner && (
              <Link
                href={`${boardPath}/write?id=${post.id}`}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Edit size={14} />
                <span>수정</span>
              </Link>
            )}
            {/* 삭제 버튼 - 작성자 또는 관리자 표시 */}
            {canDelete && (
              <button
                onClick={handleDeletePost}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
                <span>삭제</span>
              </button>
            )}
          </div>
          {/* 우측: 목록으로/TOP 버튼 (항상 표시) */}
          <div className="flex items-center gap-2">
            <Link
              href={boardPath}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <List size={14} />
              <span>목록</span>
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowUp size={14} />
              <span>TOP</span>
            </button>
          </div>
        </div>

        {/* 댓글 섹션 (공지사항 제외) */}
        {!isNoticeBoard && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-base font-bold mb-3 flex items-center gap-1.5">
              <MessageCircle size={16} />
              댓글 {comments.length}개
            </h2>

            {/* 댓글 작성 폼 */}
            {isGuest ? (
              /* 비회원일 때 로그인 유도 UI */
              <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    댓글을 작성하려면 로그인이 필요합니다.
                  </p>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center gap-1.5"
                  >
                    <LogIn size={14} />
                    로그인
                  </button>
                </div>
              </div>
            ) : (
              /* 회원일 때 댓글 작성 폼 */
              <form onSubmit={handleSubmitComment} className="mb-5">
                {error && (
                  <p className="text-xs text-red-600 mb-1.5">{error}</p>
                )}
                <div className="flex gap-2">
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="댓글을 입력하세요 (최대 1,000자)"
                    maxLength={1000}
                    rows={2}
                    disabled={isSubmittingComment}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentContent.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Send size={14} />
                    {isSubmittingComment ? '작성 중...' : '등록'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 text-right">
                  {commentContent.length} / 1,000
                </p>
              </form>
            )}

            {/* 로그인 모달 */}
            <LoginModal
              isOpen={showLoginModal}
              onClose={() => setShowLoginModal(false)}
            />

            {/* 댓글 목록 */}
            <div className="space-y-3">
              <AnimatePresence>
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm py-6">
                    아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
                  </p>
                ) : (
                  comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 pb-3 last:border-0"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs">
                            {comment.author_nickname || '익명'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatRelativeTimeKorean(comment.created_at)}
                          </span>
                        </div>
                        {/* 댓글 삭제 버튼 - 작성자 또는 관리자 표시 */}
                        {(currentUserId && comment.user_id === currentUserId) || isAdmin ? (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        ) : null}
                      </div>
                      <p className="text-gray-800 text-xs whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* 이전글/다음글 네비게이션 */}
        <div className="bg-white mt-20 rounded-xl shadow-sm overflow-hidden">
          {/* 이전글 */}
          <div className="flex items-center border-b">
            <div className="w-20 md:w-24 px-3 py-3 bg-gray-50 text-xs font-medium text-gray-600 flex items-center gap-1.5">
              <ChevronLeft size={14} />
              이전글
            </div>
            {prevPost ? (
              <Link
                href={`${boardPath}/${prevPost.id}`}
                className="flex-1 px-3 py-3 text-xs text-gray-800 hover:text-emerald-600 hover:bg-gray-50 transition-colors truncate"
              >
                {prevPost.title}
              </Link>
            ) : (
              <span className="flex-1 px-3 py-3 text-xs text-gray-400">
                이전글이 없습니다.
              </span>
            )}
          </div>
          {/* 다음글 */}
          <div className="flex items-center">
            <div className="w-20 md:w-24 px-3 py-3 bg-gray-50 text-xs font-medium text-gray-600 flex items-center gap-1.5">
              <ChevronRight size={14} />
              다음글
            </div>
            {nextPost ? (
              <Link
                href={`${boardPath}/${nextPost.id}`}
                className="flex-1 px-3 py-3 text-xs text-gray-800 hover:text-emerald-600 hover:bg-gray-50 transition-colors truncate"
              >
                {nextPost.title}
              </Link>
            ) : (
              <span className="flex-1 px-3 py-3 text-xs text-gray-400">
                다음글이 없습니다.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
