'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Search, ChevronLeft, ChevronRight, ChevronDown, MessageCircle, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import LoginModal from '@/components/modals/LoginModal'
import type { FreeBoardListProps } from '@/types/community'
import {
  type BoardType,
  type FreeBoardTopic,
  type SearchType,
  getBoardLabel,
  getSearchTypeLabel,
  getTopicLabel,
  getTopicStyle,
  FREE_BOARD_TOPICS,
  PAGINATION,
} from '@/lib/constants/community'
import { formatSmartDate } from '@/lib/utils/format'

// 페이지네이션 상수
const { postsPerPage: POSTS_PER_PAGE, pagesPerGroup: PAGES_PER_GROUP } = PAGINATION

export default function FreeBoardList({
  posts,
  currentPage,
  totalPages,
  totalCount = 0,
}: FreeBoardListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL에서 검색 파라미터 가져오기
  const urlSearch = searchParams.get('search') || ''
  const urlSearchType = (searchParams.get('searchType') as SearchType) || 'all'
  const urlTopic = searchParams.get('topic') as FreeBoardTopic | null

  const [searchQuery, setSearchQuery] = useState(urlSearch)
  const [searchType, setSearchType] = useState<SearchType>(urlSearchType)
  const [showSearchTypeDropdown, setShowSearchTypeDropdown] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<FreeBoardTopic | 'all'>(urlTopic || 'all')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // URL 파라미터 변경 시 상태 동기화
  useEffect(() => {
    setSearchQuery(urlSearch)
    setSearchType(urlSearchType)
    setSelectedTopic(urlTopic || 'all')
  }, [urlSearch, urlSearchType, urlTopic])

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

  const basePath = '/community/free'

  // URL 파라미터 빌드 함수
  const buildUrl = (params: { page?: number; search?: string; searchType?: SearchType; topic?: FreeBoardTopic | 'all' }) => {
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
    if (params.topic && params.topic !== 'all') {
      queryParams.set('topic', params.topic)
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
    router.push(buildUrl({ page, search: urlSearch, searchType: urlSearchType, topic: urlTopic || 'all' }))
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
    router.push(buildUrl({ page: 1, search: trimmedQuery, searchType, topic: selectedTopic }))
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

  // 주제 필터 변경
  const handleTopicChange = (topic: FreeBoardTopic | 'all') => {
    setSelectedTopic(topic)
    router.push(buildUrl({ page: 1, search: urlSearch, searchType: urlSearchType, topic }))
  }

  // 고정글과 일반글 분리
  const pinnedPosts = posts.filter((post) => post.is_pinned)
  const normalPosts = posts.filter((post) => !post.is_pinned)

  // 글 번호 계산 (전체 글 수 - (현재 페이지 - 1) * 페이지당 글 수 - 인덱스)
  const getPostNumber = (index: number): number => {
    const normalPostsBeforeThisPage = (currentPage - 1) * POSTS_PER_PAGE
    return totalCount - normalPostsBeforeThisPage - index
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-10 md:py-14">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              자유게시판
            </h1>
            <p className="text-white/80 text-base md:text-lg">
              자유롭게 이야기를 나눠보세요
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
                  tab === 'free'
                    ? 'text-blue-600 border-b-2 border-current bg-gray-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {getBoardLabel(tab)}
              </Link>
            ))}
          </div>

          {/* 주제 필터 */}
          <div className="px-4 py-3 border-b bg-gray-50 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 mr-2">주제:</span>
            <button
              onClick={() => handleTopicChange('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTopic === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              전체
            </button>
            {FREE_BOARD_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTopicChange(topic)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTopic === topic
                    ? 'bg-blue-600 text-white'
                    : `${getTopicStyle(topic)} hover:opacity-80 border border-transparent`
                }`}
              >
                {getTopicLabel(topic)}
              </button>
            ))}
          </div>

        </div>

        {/* 로그인 모달 */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />

        {/* 게시글 테이블 */}
        {posts.length === 0 && !urlSearch ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-10 text-center"
          >
            <div className="text-5xl mb-3">📝</div>
            <p className="text-gray-500 text-base">아직 게시글이 없습니다.</p>
            <p className="text-gray-400 text-xs mt-1.5">
              첫 번째 글을 작성해보세요!
            </p>
          </motion.div>
        ) : posts.length === 0 && urlSearch ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-10 text-center"
          >
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-gray-500 text-base">&apos;{urlSearch}&apos; 검색 결과가 없습니다.</p>
            <p className="text-gray-400 text-xs mt-1.5">
              다른 검색어로 시도해보세요.
            </p>
            <button
              onClick={() => router.push(basePath)}
              className="mt-4 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              검색 초기화
            </button>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* 테이블 헤더 */}
            <div className="hidden md:grid md:grid-cols-[70px_1fr_130px_110px_75px] px-4 bg-gray-50 border-b text-[15px] font-semibold text-gray-600">
              <div className="py-3 text-center">주제</div>
              <div className="px-4 py-3 text-center">제목</div>
              <div className="px-3 py-3 text-center">작성자</div>
              <div className="py-3 text-center">날짜</div>
              <div className="py-3 text-center">조회</div>
            </div>

            {/* 고정 게시글 */}
            {pinnedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  href={`/community/free/${post.id}`}
                  className="block hover:bg-blue-50 transition-colors border-b border-gray-100"
                >
                  {/* 데스크톱 */}
                  <div className="hidden md:grid md:grid-cols-[70px_1fr_130px_110px_75px] px-4 text-[15px]">
                    <div className="py-3.5 text-center">
                      <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 text-[13px] font-bold rounded">
                        공지
                      </span>
                    </div>
                    <div className="px-4 py-3.5 flex items-center gap-2">
                      <span className="font-medium text-gray-900 truncate">
                        {post.title}
                      </span>
                      {post.comment_count > 0 && (
                        <span className="flex items-center gap-0.5 text-blue-600 text-[13px] font-medium">
                          <MessageCircle size={12} />
                          {post.comment_count}
                        </span>
                      )}
                      {post.images && post.images.length > 0 && (
                        <ImageIcon size={14} className="text-gray-400" />
                      )}
                    </div>
                    <div className="px-3 py-3.5 text-gray-600 truncate">
                      {post.author_nickname || '관리자'}
                    </div>
                    <div className="py-3.5 text-center text-gray-500 whitespace-nowrap">
                      {formatSmartDate(post.created_at)}
                    </div>
                    <div className="py-3.5 text-center text-gray-500">
                      {post.view_count}
                    </div>
                  </div>

                  {/* 모바일 */}
                  <div className="md:hidden px-4 py-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[13px] font-bold rounded">
                        공지
                      </span>
                      <span className="font-medium text-gray-900 text-[15px] truncate flex-1">
                        {post.title}
                      </span>
                      {post.comment_count > 0 && (
                        <span className="flex items-center gap-0.5 text-blue-600 text-[13px]">
                          <MessageCircle size={12} />
                          {post.comment_count}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
                      <span>{post.author_nickname || '관리자'}</span>
                      <span className="text-gray-300">|</span>
                      <span className="whitespace-nowrap">{formatSmartDate(post.created_at)}</span>
                      <span className="text-gray-300">|</span>
                      <span>조회 {post.view_count}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* 일반 게시글 */}
            {normalPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (pinnedPosts.length + index) * 0.03 }}
              >
                <Link
                  href={`/community/free/${post.id}`}
                  className="block hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {/* 데스크톱 */}
                  <div className="hidden md:grid md:grid-cols-[70px_1fr_130px_110px_75px] px-4 text-[15px]">
                    <div className="py-3.5 text-center">
                      {post.topic && (
                        <span className={`inline-block px-2 py-0.5 text-[13px] font-medium rounded ${getTopicStyle(post.topic)}`}>
                          {getTopicLabel(post.topic)}
                        </span>
                      )}
                    </div>
                    <div className="px-4 py-3.5 flex items-center gap-2">
                      <span className="font-medium text-gray-900 truncate">
                        {post.title}
                      </span>
                      {post.comment_count > 0 && (
                        <span className="flex items-center gap-0.5 text-blue-600 text-[13px] font-medium">
                          <MessageCircle size={12} />
                          {post.comment_count}
                        </span>
                      )}
                      {post.images && post.images.length > 0 && (
                        <ImageIcon size={14} className="text-gray-400" />
                      )}
                    </div>
                    <div className="px-3 py-3.5 text-gray-600 truncate">
                      {post.author_nickname || '익명'}
                    </div>
                    <div className="py-3.5 text-center text-gray-500 whitespace-nowrap">
                      {formatSmartDate(post.created_at)}
                    </div>
                    <div className="py-3.5 text-center text-gray-500">
                      {post.view_count}
                    </div>
                  </div>

                  {/* 모바일 */}
                  <div className="md:hidden px-4 py-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      {post.topic && (
                        <span className={`px-1.5 py-0.5 text-[13px] font-medium rounded ${getTopicStyle(post.topic)}`}>
                          {getTopicLabel(post.topic)}
                        </span>
                      )}
                      <span className="font-medium text-gray-900 text-[15px] truncate flex-1">
                        {post.title}
                      </span>
                      {post.comment_count > 0 && (
                        <span className="flex items-center gap-0.5 text-blue-600 text-[13px]">
                          <MessageCircle size={12} />
                          {post.comment_count}
                        </span>
                      )}
                      {post.images && post.images.length > 0 && (
                        <ImageIcon size={12} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
                      <span>{post.author_nickname || '익명'}</span>
                      <span className="text-gray-300">|</span>
                      <span className="whitespace-nowrap">{formatSmartDate(post.created_at)}</span>
                      <span className="text-gray-300">|</span>
                      <span>조회 {post.view_count}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* 글쓰기 버튼 (오른쪽 정렬, 리스트와 가깝게) */}
        <div className="flex justify-end mt-2">
          <Link
            href="/community/free/write"
            onClick={handleWriteClick}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 whitespace-nowrap text-sm"
          >
            <Plus size={18} />
            글쓰기
          </Link>
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
                    ? 'text-blue-600 font-bold'
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
                        searchType === type ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-700'
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
              className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* 검색 버튼 */}
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            검색
          </button>
        </div>

      </div>
    </div>
  )
}
