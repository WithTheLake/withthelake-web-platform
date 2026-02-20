'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Eye, EyeOff, Pin, Trash2, ExternalLink } from 'lucide-react'
import { getAdminPosts, deletePost, togglePinPost, togglePostActive, type CommunityPost, type BoardType } from '@/actions/communityActions'
import { formatDate } from '@/lib/utils/format'
import { getBoardLabel } from '@/lib/constants/community'
import { useToast } from '@/components/ui/Toast'

const ITEMS_PER_PAGE = 20
const BOARD_TYPES: { value: BoardType | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'notice', label: '공지사항' },
  { value: 'free', label: '자유게시판' },
  { value: 'event', label: '이벤트' },
  { value: 'review', label: '힐링 후기' },
]

export default function AdminCommunityPage() {
  const { showToast } = useToast()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [boardType, setBoardType] = useState<BoardType | 'all'>('all')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const fetchPosts = async () => {
    setIsLoading(true)
    const result = await getAdminPosts({
      boardType: boardType !== 'all' ? boardType : undefined,
      search: search || undefined,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    })
    setPosts(result.data)
    setTotalCount(result.count)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [boardType, currentPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchPosts()
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 게시글을 삭제하시겠습니까?`)) return

    const result = await deletePost(id)
    if (result.success) {
      fetchPosts()
    } else {
      showToast(result.error || '삭제에 실패했습니다.', 'error')
    }
  }

  const handleTogglePin = async (id: string) => {
    const result = await togglePinPost(id)
    if (result.success) {
      fetchPosts()
    } else {
      showToast(result.error || '고정 상태 변경에 실패했습니다.', 'error')
    }
  }

  const handleToggleActive = async (id: string, title: string, currentActive: boolean) => {
    const message = currentActive
      ? `"${title}" 게시글을 숨기시겠습니까?\n웹사이트에서 보이지 않게 됩니다.`
      : `"${title}" 게시글을 다시 공개하시겠습니까?\n웹사이트에 다시 보이게 됩니다.`
    if (!confirm(message)) return

    const result = await togglePostActive(id, !currentActive)
    if (result.success) {
      fetchPosts()
    } else {
      showToast(result.error || '상태 변경에 실패했습니다.', 'error')
    }
  }

  const truncateTitle = (title: string, maxLen: number = 48) =>
    title.length > maxLen ? title.slice(0, maxLen) + '...' : title

  const getBoardBadgeColor = (board: BoardType) => {
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
      <div className="flex items-center justify-between pl-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">게시글 관리</h1>
          <p className="text-gray-500 mt-1">총 {totalCount}개의 게시글</p>
        </div>
        <Link
          href="/admin/community/comments"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          댓글 관리
        </Link>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 게시판 필터 */}
          <div className="flex flex-wrap gap-2">
            {BOARD_TYPES.map((board) => (
              <button
                key={board.value}
                onClick={() => {
                  setBoardType(board.value)
                  setCurrentPage(1)
                }}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  boardType === board.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {board.label}
              </button>
            ))}
          </div>

          {/* 검색 */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="제목 또는 작성자 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
      </div>

      {/* 게시글 목록 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[750px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="pl-6 pr-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                게시판
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                작성자
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                조회
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                댓글
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                작성일
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                상태
              </th>
              <th className="pl-4 pr-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  로딩 중...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  게시글이 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className={`hover:bg-gray-50 ${!post.is_active ? 'opacity-50' : ''}`}>
                  <td className="pl-6 pr-4 py-4 text-center">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${getBoardBadgeColor(post.board_type)}`}>
                      {getBoardLabel(post.board_type)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {post.is_pinned && (
                        <Pin size={14} className="text-orange-500 inline-block mr-1 align-text-bottom" />
                      )}
                      {truncateTitle(post.title)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 text-center">
                    {post.author_nickname || '익명'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 text-center">
                    {post.view_count}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 text-center">
                    {post.comment_count}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 text-center">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(post.id, post.title, post.is_active)}
                      className={`inline-flex items-center gap-1 p-1 rounded transition-colors ${
                        post.is_active
                          ? 'text-green-600 hover:text-green-800 hover:bg-green-50'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      }`}
                      title={post.is_active ? '클릭하여 숨기기' : '클릭하여 공개하기'}
                    >
                      {post.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="pl-4 pr-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/community/${post.board_type}/${post.id}`}
                        target="_blank"
                        className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                        title="보기"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <button
                        onClick={() => handleTogglePin(post.id)}
                        className={`p-1.5 transition-colors ${
                          post.is_pinned
                            ? 'text-orange-500 hover:text-orange-700'
                            : 'text-gray-500 hover:text-orange-500'
                        }`}
                        title={post.is_pinned ? '고정 해제' : '고정'}
                      >
                        <Pin size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
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
                      ? 'bg-purple-600 text-white'
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
