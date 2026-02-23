'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Search, Eye, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/client'
import LoginModal from '@/components/modals/LoginModal'
import type { PostListProps } from '@/types/community'
import {
  type BoardType,
  type SearchType,
  getBoardLabel,
  getBoardDescription,
  getSearchTypeLabel,
  PAGINATION,
} from '@/lib/constants/community'

// 페이지네이션 상수
const { pagesPerGroup: PAGES_PER_GROUP } = PAGINATION

// 게시판별 색상 테마 (갤러리 전용)
const BOARD_COLORS: Record<BoardType, { from: string; to: string; bg: string; ring: string; text: string }> = {
  notice: { from: 'from-emerald-600', to: 'to-teal-600', bg: 'bg-emerald-600', ring: 'ring-emerald-500', text: 'text-emerald-600' },
  event: { from: 'from-amber-500', to: 'to-orange-500', bg: 'bg-amber-500', ring: 'ring-amber-500', text: 'text-amber-500' },
  free: { from: 'from-emerald-600', to: 'to-teal-600', bg: 'bg-emerald-600', ring: 'ring-emerald-500', text: 'text-emerald-600' },
  review: { from: 'from-purple-600', to: 'to-pink-600', bg: 'bg-purple-600', ring: 'ring-purple-500', text: 'text-purple-600' },
}

export default function GalleryList({
  boardType,
  posts,
  currentPage,
  totalPages,
  totalCount = 0,
  isAdmin = false,
}: PostListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL에서 검색 파라미터 가져오기
  const urlSearch = searchParams.get('search') || ''
  const urlSearchType = (searchParams.get('searchType') as SearchType) || 'all'

  const [searchQuery, setSearchQuery] = useState(urlSearch)
  const [searchType, setSearchType] = useState<SearchType>(urlSearchType)
  const [showSearchTypeDropdown, setShowSearchTypeDropdown] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // URL 파라미터 변경 시 상태 동기화
  useEffect(() => {
    setSearchQuery(urlSearch)
    setSearchType(urlSearchType)
  }, [urlSearch, urlSearchType])

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    checkAuth()
  }, [])

  const handleWriteClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault()
      setShowLoginModal(true)
    }
  }

  const basePath = `/community/${boardType}`
  const colors = BOARD_COLORS[boardType]

  // URL 파라미터 빌드 함수
  const buildUrl = (params: { page?: number; search?: string; searchType?: SearchType }) => {
    const queryParams = new URLSearchParams()

    if (params.page && params.page > 1) {
      queryParams.set('page', String(params.page))
    }
    if (params.search) {
      queryParams.set('search', params.search)
    }
    if (params.searchType && params.searchType !== 'all') {
      queryParams.set('searchType', params.searchType)
    }

    const queryString = queryParams.toString()
    return queryString ? `${basePath}?${queryString}` : basePath
  }

  // 현재 페이지 그룹 계산 (1-10, 11-20, 21-30, ...)
  const currentGroup = Math.ceil(currentPage / PAGES_PER_GROUP)
  const groupStartPage = (currentGroup - 1) * PAGES_PER_GROUP + 1
  const groupEndPage = Math.min(currentGroup * PAGES_PER_GROUP, totalPages)

  // 페이지 번호 배열 생성
  const pageNumbers = useMemo(() => {
    const pages: number[] = []
    for (let i = groupStartPage; i <= groupEndPage; i++) {
      pages.push(i)
    }
    return pages
  }, [groupStartPage, groupEndPage])

  const handlePageChange = (page: number) => {
    router.push(buildUrl({ page, search: urlSearch, searchType: urlSearchType }))
  }

  // 이전 그룹으로 (10페이지 단위)
  const handlePrevGroup = () => {
    const prevGroupLastPage = groupStartPage - 1
    if (prevGroupLastPage >= 1) {
      handlePageChange(prevGroupLastPage)
    }
  }

  // 다음 그룹으로 (10페이지 단위)
  const handleNextGroup = () => {
    const nextGroupFirstPage = groupEndPage + 1
    if (nextGroupFirstPage <= totalPages) {
      handlePageChange(nextGroupFirstPage)
    }
  }

  // 검색 실행
  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim()
    router.push(buildUrl({ page: 1, search: trimmedQuery, searchType }))
  }

  // 엔터키로 검색
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 검색 타입 선택
  const handleSearchTypeSelect = (type: SearchType) => {
    setSearchType(type)
    setShowSearchTypeDropdown(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 히어로 섹션 */}
      <section className={`relative bg-gradient-to-r ${colors.from} ${colors.to} text-white px-5 py-10 md:py-14`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {getBoardLabel(boardType)}
            </h1>
            <p className="text-white/80 text-base md:text-lg">
              {getBoardDescription(boardType)}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="flex border-b">
            {(['notice', 'event', 'free', 'review'] as BoardType[]).map((tab) => (
              <Link
                key={tab}
                href={`/community/${tab}`}
                className={`flex-1 px-4 py-4 font-semibold transition-colors text-center text-base md:text-lg ${
                  boardType === tab
                    ? `text-${tab === 'event' ? 'amber' : tab === 'review' ? 'purple' : 'emerald'}-600 border-b-2 border-current bg-gray-50`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {getBoardLabel(tab)}
              </Link>
            ))}
          </div>

        </div>

        {/* 로그인 모달 */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />

        {/* 갤러리 그리드 */}
        {posts.length === 0 && !urlSearch ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-12 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-gray-500 text-lg">아직 게시글이 없습니다.</p>
            <p className="text-gray-400 text-sm mt-2">
              첫 번째 글을 작성해보세요!
            </p>
          </motion.div>
        ) : posts.length === 0 && urlSearch ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-12 text-center"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">&apos;{urlSearch}&apos; 검색 결과가 없습니다.</p>
            <p className="text-gray-400 text-sm mt-2">
              다른 검색어로 시도해보세요.
            </p>
          </motion.div>
        ) : boardType === 'event' ? (
          /* 이벤트 게시판: 깔끔한 스타일 (박스 없음, 작성자/날짜 없음) */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/community/${boardType}/${post.id}`}
                  className="block group"
                >
                  {/* 썸네일 이미지 */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden rounded-lg mb-3">
                    {post.thumbnail_url ? (
                      <Image
                        src={post.thumbnail_url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : post.images && post.images.length > 0 ? (
                      <Image
                        src={post.images[0]}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                        <span className="text-4xl">🎉</span>
                      </div>
                    )}

                    {/* 고정 배지 */}
                    {post.is_pinned && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-[13px] font-bold rounded">
                        공지
                      </div>
                    )}
                  </div>

                  {/* 제목만 표시 */}
                  <h3 className="font-medium text-gray-900 text-[15px] md:text-[17px] line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          /* 후기 게시판: 카드 스타일 (작성자/날짜/조회수 포함) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/community/${boardType}/${post.id}`}
                  className="block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* 썸네일 이미지 */}
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    {post.thumbnail_url ? (
                      <Image
                        src={post.thumbnail_url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : post.images && post.images.length > 0 ? (
                      <Image
                        src={post.images[0]}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                        <span className="text-4xl">💜</span>
                      </div>
                    )}

                    {/* 조회수 오버레이 */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-[13px] rounded flex items-center gap-1">
                      <Eye size={12} />
                      {post.view_count}
                    </div>

                    {/* 고정 배지 */}
                    {post.is_pinned && (
                      <div className={`absolute top-2 left-2 px-2 py-1 ${colors.bg} text-white text-[13px] font-bold rounded`}>
                        공지
                      </div>
                    )}
                  </div>

                  {/* 콘텐츠 */}
                  <div className="p-4">
                    {/* 제목 */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* 메타 정보 */}
                    <div className="flex items-center justify-between text-[13px] text-gray-500">
                      <span>{post.author_nickname || '익명'}</span>
                      <span>{formatRelativeTime(post.created_at)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* 글쓰기 버튼 (오른쪽 정렬, 리스트와 가깝게) */}
        <div className="flex justify-end mt-2">
          {boardType === 'event' ? (
            isAdmin && (
              <Link
                href={`/community/${boardType}/write`}
                className={`px-4 py-2 bg-gradient-to-r ${colors.from} ${colors.to} text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 whitespace-nowrap text-sm`}
              >
                <Plus size={18} />
                글쓰기
              </Link>
            )
          ) : (
            <Link
              href={`/community/${boardType}/write`}
              onClick={handleWriteClick}
              className={`px-4 py-2 bg-gradient-to-r ${colors.from} ${colors.to} text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 whitespace-nowrap text-sm`}
            >
              <Plus size={18} />
              글쓰기
            </Link>
          )}
        </div>

        {/* 페이지네이션 (중앙) */}
        {totalPages > 0 && (
          <div className="flex items-center justify-center gap-1 mt-2">
            {/* 이전 그룹 버튼 */}
            <button
              onClick={handlePrevGroup}
              disabled={groupStartPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="이전 10페이지"
            >
              <ChevronLeft size={18} />
            </button>

            {/* 페이지 번호들 */}
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`min-w-[40px] h-10 px-2.5 text-[17px] font-medium transition-colors ${
                  page === currentPage
                    ? `${colors.text} font-bold`
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}

            {/* 다음 그룹 버튼 */}
            <button
              onClick={handleNextGroup}
              disabled={groupEndPage >= totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="다음 10페이지"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* 검색 영역 (페이지네이션 아래) */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {/* 검색 타입 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setShowSearchTypeDropdown(!showSearchTypeDropdown)}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors min-w-[100px]"
            >
              {getSearchTypeLabel(searchType)}
              <ChevronDown size={16} className={`transition-transform ${showSearchTypeDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSearchTypeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSearchTypeDropdown(false)}
                />
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[100px]">
                  {(['all', 'title', 'author'] as SearchType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleSearchTypeSelect(type)}
                      className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        searchType === type ? `text-${boardType === 'event' ? 'amber' : 'purple'}-600 font-semibold bg-${boardType === 'event' ? 'amber' : 'purple'}-50` : 'text-gray-700'
                      }`}
                    >
                      {getSearchTypeLabel(type)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 검색 입력 */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${colors.ring} text-sm`}
            />
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* 검색 버튼 */}
          <button
            onClick={handleSearch}
            className={`px-5 py-2.5 ${colors.bg} text-white rounded-lg font-semibold hover:opacity-90 transition-colors text-sm`}
          >
            검색
          </button>
        </div>

        {/* 검색 결과 안내 */}
        {urlSearch && (
          <div className="mt-4 text-center text-sm text-gray-500">
            &apos;{urlSearch}&apos; 검색 결과 {totalCount}건
            <button
              onClick={() => router.push(basePath)}
              className={`ml-2 text-${boardType === 'event' ? 'amber' : 'purple'}-600 hover:underline`}
            >
              검색 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
