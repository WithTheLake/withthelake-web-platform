'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  Send,
} from 'lucide-react'
import { createComment, deletePost, deleteComment, type BoardType } from '@/actions/communityActions'
import { formatRelativeTime } from '@/lib/utils/format'

interface CommunityPost {
  id: string
  user_id: string | null
  board_type: BoardType
  title: string
  content: string
  author_nickname: string | null
  view_count: number
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

interface PostDetailProps {
  post: CommunityPost
  comments: Comment[]
}

const BOARD_LABELS: Record<BoardType, string> = {
  notice: '공지사항',
  free: '자유게시판',
  review: '힐링 후기',
}

export default function PostDetail({
  post,
  comments: initialComments,
}: PostDetailProps) {
  const router = useRouter()
  const [comments, setComments] = useState(initialComments)
  const [commentContent, setCommentContent] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [error, setError] = useState('')

  const boardPath = `/community/${post.board_type}`

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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <section className="bg-white border-b px-5 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded">
                {BOARD_LABELS[post.board_type]}
              </span>
              {post.is_pinned && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">
                  공지
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-5 py-8">
        {/* 게시글 본문 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm mb-6"
        >
          {/* 메타 정보 */}
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-semibold">
                {post.author_nickname || '익명'}
              </span>
              <span>{formatRelativeTime(post.created_at)}</span>
              <div className="flex items-center gap-1">
                <Eye size={14} />
                {post.view_count}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={14} />
                {comments.length}
              </div>
            </div>

            {/* 수정/삭제 버튼 */}
            <div className="flex items-center gap-2">
              <Link
                href={`${boardPath}/write?id=${post.id}`}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit size={18} />
              </Link>
              <button
                onClick={handleDeletePost}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* 본문 내용 */}
          <div className="px-6 py-8">
            <div className="prose max-w-none whitespace-pre-wrap text-gray-800">
              {post.content}
            </div>
          </div>
        </motion.div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MessageCircle size={20} />
            댓글 {comments.length}개
          </h2>

          {/* 댓글 작성 폼 */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            {error && (
              <p className="text-sm text-red-600 mb-2">{error}</p>
            )}
            <div className="flex gap-2">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="댓글을 입력하세요 (최대 1,000자)"
                maxLength={1000}
                rows={3}
                disabled={isSubmittingComment}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
              <button
                type="submit"
                disabled={isSubmittingComment || !commentContent.trim()}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={18} />
                {isSubmittingComment ? '작성 중...' : '등록'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {commentContent.length} / 1,000
            </p>
          </form>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            <AnimatePresence>
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
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
                    className="border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm">
                          {comment.author_nickname || '익명'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(comment.created_at)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-gray-800 text-sm whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 목록으로 버튼 */}
        <div className="mt-6 text-center">
          <Link
            href={boardPath}
            className="inline-block px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            목록으로
          </Link>
        </div>
      </div>
    </div>
  )
}
