'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { type BoardType } from '@/actions/communityActions'
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
  is_active: boolean
  created_at: string
  updated_at: string
}

interface BoardListProps {
  boardType: BoardType
  posts: CommunityPost[]
  currentPage: number
  totalPages: number
}

const BOARD_LABELS: Record<BoardType, string> = {
  notice: '공지사항',
  free: '자유게시판',
  review: '힐링 후기',
}

const BOARD_DESCRIPTIONS: Record<BoardType, string> = {
  notice: '힐링로드 ON의 새로운 소식과 공지사항',
  free: '자유롭게 이야기를 나눠보세요',
  review: '힐링로드 ON 이용 후기를 공유해주세요',
}

export default function BoardList({
  boardType,
  posts,
  currentPage,
  totalPages,
}: BoardListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const basePath = `/community/${boardType}`

  const handlePageChange = (page: number) => {
    router.push(`${basePath}?page=${page}`)
  }

  const filteredPosts = searchQuery
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {BOARD_LABELS[boardType]}
            </h1>
            <p className="text-emerald-100 text-base md:text-lg">
              {BOARD_DESCRIPTIONS[boardType]}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="flex border-b">
            {(['notice', 'free', 'review'] as BoardType[]).map((tab) => (
              <Link
                key={tab}
                href={`/community/${tab}`}
                className={`flex-1 px-6 py-4 font-semibold transition-colors text-center ${
                  boardType === tab
                    ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                {BOARD_LABELS[tab]}
              </Link>
            ))}
          </div>

          {/* 검색 및 글쓰기 */}
          <div className="p-4 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <Link
              href={`/community/${boardType}/write`}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} />
              글쓰기
            </Link>
          </div>
        </div>

        {/* 게시글 목록 */}
        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-12 text-center"
          >
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">아직 게시글이 없습니다.</p>
            <p className="text-gray-400 text-sm mt-2">
              첫 번째 글을 작성해보세요!
            </p>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/community/${boardType}/${post.id}`}
                    className="block px-6 py-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* 고정 아이콘 */}
                      {post.is_pinned && (
                        <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                          공지
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        {/* 제목 */}
                        <h3 className="font-semibold text-gray-900 mb-2 truncate">
                          {post.title}
                        </h3>

                        {/* 메타 정보 */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{post.author_nickname || '익명'}</span>
                          <span>{formatRelativeTime(post.created_at)}</span>
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            {post.view_count}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  page === currentPage
                    ? 'bg-emerald-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
