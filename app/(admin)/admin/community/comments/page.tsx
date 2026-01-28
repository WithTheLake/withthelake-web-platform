'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Eye, EyeOff, Trash2, ExternalLink } from 'lucide-react'
import { getAdminComments, deleteComment, toggleCommentActive, type AdminComment, type BoardType } from '@/actions/communityActions'
import { formatDateTime } from '@/lib/utils/format'
import { getBoardLabel } from '@/lib/constants/community'

const ITEMS_PER_PAGE = 20

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<AdminComment[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const fetchComments = async () => {
    setIsLoading(true)
    const result = await getAdminComments({
      search: search || undefined,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    })
    setComments(result.data)
    setTotalCount(result.count)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchComments()
  }, [currentPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchComments()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('이 댓글을 삭제하시겠습니까?')) return

    const result = await deleteComment(id)
    if (result.success) {
      fetchComments()
    } else {
      alert(result.error || '삭제에 실패했습니다.')
    }
  }

  const handleToggleActive = async (id: string, content: string, currentActive: boolean) => {
    const preview = content.length > 20 ? content.slice(0, 20) + '...' : content
    const message = currentActive
      ? `"${preview}" 댓글을 숨기시겠습니까?\n웹사이트에서 보이지 않게 됩니다.`
      : `"${preview}" 댓글을 다시 공개하시겠습니까?\n웹사이트에 다시 보이게 됩니다.`
    if (!confirm(message)) return

    const result = await toggleCommentActive(id, !currentActive)
    if (result.success) {
      fetchComments()
    } else {
      alert(result.error || '상태 변경에 실패했습니다.')
    }
  }

  const getBoardBadgeColor = (board?: BoardType) => {
    switch (board) {
      case 'notice': return 'bg-emerald-100 text-emerald-800'
      case 'free': return 'bg-blue-100 text-blue-800'
      case 'event': return 'bg-amber-100 text-amber-800'
      case 'review': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/community"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">댓글 관리</h1>
          <p className="text-gray-500 mt-1">총 {totalCount}개의 댓글</p>
        </div>
      </div>

      {/* 검색 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="댓글 내용 또는 작성자 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            검색
          </button>
        </form>
      </div>

      {/* 댓글 목록 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="pl-6 pr-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                게시판
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                원글
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                댓글 내용
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                작성자
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                작성일
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                상태
              </th>
              <th className="pl-4 pr-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  로딩 중...
                </td>
              </tr>
            ) : comments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  댓글이 없습니다.
                </td>
              </tr>
            ) : (
              comments.map((comment) => (
                <tr key={comment.id} className={`hover:bg-gray-50 ${!comment.is_active ? 'opacity-50' : ''}`}>
                  <td className="pl-6 pr-4 py-4 text-center">
                    {comment.post_board_type && (
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${getBoardBadgeColor(comment.post_board_type)}`}>
                        {getBoardLabel(comment.post_board_type)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600 line-clamp-1">
                      {comment.post_title || '(삭제된 글)'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900 line-clamp-2">
                      {comment.content}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {comment.author_nickname || '익명'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {formatDateTime(comment.created_at)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(comment.id, comment.content, comment.is_active)}
                      className={`inline-flex items-center gap-1 p-1 rounded transition-colors ${
                        comment.is_active
                          ? 'text-green-600 hover:text-green-800 hover:bg-green-50'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      }`}
                      title={comment.is_active ? '클릭하여 숨기기' : '클릭하여 공개하기'}
                    >
                      {comment.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="pl-4 pr-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {comment.post_board_type && (
                        <Link
                          href={`/community/${comment.post_board_type}/${comment.post_id}`}
                          target="_blank"
                          className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                          title="원글 보기"
                        >
                          <ExternalLink size={18} />
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
                        title="삭제"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === page
                      ? 'bg-orange-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            {totalPages > 10 && <span className="text-gray-400">...</span>}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
