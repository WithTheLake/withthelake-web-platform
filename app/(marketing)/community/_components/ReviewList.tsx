'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Search, ChevronLeft, ChevronRight, ChevronDown, Star, Image as ImageIcon, ShoppingBag, Footprints } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import LoginModal from '@/components/modals/LoginModal'
import ReviewDetailModal from './ReviewDetailModal'
import { formatDate } from '@/lib/utils/format'
import {
  type BoardType,
  type SearchType,
  type SortBy,
  getBoardLabel,
  PAGINATION,
  SORT_LABELS,
} from '@/lib/constants/community'
import type { CommunityPost, ProductInfo } from '@/types/community'

// ReviewList에서 사용하는 타입 (CommunityPost와 동일)
type ReviewPost = CommunityPost

interface ReviewListProps {
  posts: ReviewPost[]
  currentPage: number
  totalPages: number
  totalCount?: number
  isAdmin?: boolean
}

// 리뷰 타입 필터 옵션
type ReviewTypeFilter = 'all' | 'activity' | 'product'

const REVIEW_TYPE_LABELS: Record<ReviewTypeFilter, string> = {
  all: '전체',
  activity: '활동 후기',
  product: '제품 후기',
}

// 후기 게시판 전용 검색 타입 라벨 (제목 → 내용)
const REVIEW_SEARCH_TYPE_LABELS: Record<SearchType, string> = {
  all: '전체',
  title: '내용', // 후기 게시판에서는 제목이 없으므로 '내용'으로 표시
  author: '작성자',
}

const { pagesPerGroup: PAGES_PER_GROUP } = PAGINATION

// 활동 후기용 임시 데이터 (아직 활동 DB 없음)
const ACTIVITY_ITEMS = ['춘천 맨발걷기', '강릉 바닷가 힐링', '속초 설악 트레킹', '양양 숲길 산책', '원주 치악산']

const getRandomActivityItem = (id: string): string => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return ACTIVITY_ITEMS[hash % ACTIVITY_ITEMS.length]
}

const getRandomRating = (id: string): number => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return (hash % 2) + 4 // 4 또는 5
}


// 별점 렌더링 컴포넌트 (0.5 단위 지원)
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = rating >= star
        const isHalf = !isFull && rating >= star - 0.5

        return (
          <div key={star} className="relative" style={{ width: size, height: size }}>
            {/* 빈 별 (배경) */}
            <Star size={size} className="absolute fill-gray-200 text-gray-200" />
            {/* 채워진 별 (반별 지원) */}
            {(isFull || isHalf) && (
              <div
                className="absolute overflow-hidden"
                style={{ width: isFull ? '100%' : '50%' }}
              >
                <Star size={size} className="fill-amber-400 text-amber-400" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function ReviewList({
  posts,
  currentPage,
  totalPages,
  totalCount = 0,
  isAdmin = false,
}: ReviewListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL에서 검색 파라미터 가져오기
  const urlSearch = searchParams.get('search') || ''
  const urlSearchType = (searchParams.get('searchType') as SearchType) || 'all'
  const urlReviewType = (searchParams.get('reviewType') as ReviewTypeFilter) || 'all'
  const urlSortBy = (searchParams.get('sortBy') as SortBy) || 'newest'

  const [searchQuery, setSearchQuery] = useState(urlSearch)
  const [searchType, setSearchType] = useState<SearchType>(urlSearchType)
  const [reviewTypeFilter, setReviewTypeFilter] = useState<ReviewTypeFilter>(urlReviewType)
  const [sortBy, setSortBy] = useState<SortBy>(urlSortBy)
  const [showSearchTypeDropdown, setShowSearchTypeDropdown] = useState(false)
  const [showReviewTypeDropdown, setShowReviewTypeDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // 모달 상태
  const [selectedPost, setSelectedPost] = useState<ReviewPost | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // posts에서 상품 정보 맵 생성 (ReviewDetailModal용)
  const productsMap = useMemo(() => {
    const map = new Map<string, ProductInfo>()
    posts.forEach((post) => {
      if (post.product_id && post.product) {
        map.set(post.product_id, post.product)
      }
    })
    return map
  }, [posts])

  // URL 파라미터 변경 시 상태 동기화
  useEffect(() => {
    setSearchQuery(urlSearch)
    setSearchType(urlSearchType)
    setReviewTypeFilter(urlReviewType)
    setSortBy(urlSortBy)
  }, [urlSearch, urlSearchType, urlReviewType, urlSortBy])

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
      setCurrentUserId(user?.id || null)
    }
    checkAuth()
  }, [])

  // 카드 클릭 핸들러 (모달 열기)
  const handleCardClick = useCallback((post: ReviewPost) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }, [])

  // 모달 닫기
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedPost(null)
  }, [])

  // 모달 내 리뷰 네비게이션
  const handleNavigate = useCallback((postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (post) {
      setSelectedPost(post)
    }
  }, [posts])

  // 삭제 후 새로고침
  const handleDelete = useCallback(() => {
    router.refresh()
  }, [router])

  const handleWriteClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault()
      setShowLoginModal(true)
    }
  }

  const basePath = '/community/review'

  // URL 파라미터 빌드 함수
  const buildUrl = (params: { page?: number; search?: string; searchType?: SearchType; reviewType?: ReviewTypeFilter; sortBy?: SortBy }) => {
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
    if (params.reviewType && params.reviewType !== 'all') {
      queryParams.set('reviewType', params.reviewType)
    }
    if (params.sortBy && params.sortBy !== 'newest') {
      queryParams.set('sortBy', params.sortBy)
    }

    const queryString = queryParams.toString()
    return queryString ? `${basePath}?${queryString}` : basePath
  }

  // 페이지네이션 계산
  const currentGroup = Math.ceil(currentPage / PAGES_PER_GROUP)
  const groupStartPage = (currentGroup - 1) * PAGES_PER_GROUP + 1
  const groupEndPage = Math.min(currentGroup * PAGES_PER_GROUP, totalPages)

  const pageNumbers = useMemo(() => {
    const pages: number[] = []
    for (let i = groupStartPage; i <= groupEndPage; i++) {
      pages.push(i)
    }
    return pages
  }, [groupStartPage, groupEndPage])

  const handlePageChange = (page: number) => {
    router.push(buildUrl({ page, search: urlSearch, searchType: urlSearchType, reviewType: urlReviewType, sortBy: urlSortBy }))
  }

  const handlePrevGroup = () => {
    const prevGroupLastPage = groupStartPage - 1
    if (prevGroupLastPage >= 1) {
      handlePageChange(prevGroupLastPage)
    }
  }

  const handleNextGroup = () => {
    const nextGroupFirstPage = groupEndPage + 1
    if (nextGroupFirstPage <= totalPages) {
      handlePageChange(nextGroupFirstPage)
    }
  }

  // 검색 실행
  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim()
    router.push(buildUrl({ page: 1, search: trimmedQuery, searchType, reviewType: reviewTypeFilter, sortBy }))
  }

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

  // 리뷰 타입 필터 선택
  const handleReviewTypeSelect = (type: ReviewTypeFilter) => {
    setReviewTypeFilter(type)
    setShowReviewTypeDropdown(false)
    // 필터 변경 시 바로 적용
    router.push(buildUrl({ page: 1, search: urlSearch, searchType: urlSearchType, reviewType: type, sortBy: urlSortBy }))
  }

  // 정렬 옵션 선택
  const handleSortSelect = (sort: SortBy) => {
    setSortBy(sort)
    setShowSortDropdown(false)
    // 정렬 변경 시 바로 적용
    router.push(buildUrl({ page: 1, search: urlSearch, searchType: urlSearchType, reviewType: urlReviewType, sortBy: sort }))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-10 md:py-14">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              힐링 후기
            </h1>
            <p className="text-white/80 text-sm md:text-base">
              힐링로드 ON 이용 후기를 공유해주세요
            </p>
            <p className="text-white/60 text-xs mt-1">
              {totalCount.toLocaleString()}개의 리뷰
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
                className={`flex-1 px-4 py-4 font-semibold transition-colors text-center text-sm md:text-base ${
                  tab === 'review'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {getBoardLabel(tab)}
              </Link>
            ))}
          </div>
        </div>

        {/* 필터 영역 */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* 리뷰 타입 필터 */}
          <div className="relative">
            <button
              onClick={() => setShowReviewTypeDropdown(!showReviewTypeDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {reviewTypeFilter === 'activity' && <Footprints size={16} className="text-purple-500" />}
              {reviewTypeFilter === 'product' && <ShoppingBag size={16} className="text-pink-500" />}
              {REVIEW_TYPE_LABELS[reviewTypeFilter]}
              <ChevronDown size={16} className={`transition-transform ${showReviewTypeDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showReviewTypeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowReviewTypeDropdown(false)}
                />
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px]">
                  {(['all', 'activity', 'product'] as ReviewTypeFilter[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleReviewTypeSelect(type)}
                      className={`flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        reviewTypeFilter === type ? 'text-purple-600 font-semibold bg-purple-50' : 'text-gray-700'
                      }`}
                    >
                      {type === 'activity' && <Footprints size={16} className="text-purple-500" />}
                      {type === 'product' && <ShoppingBag size={16} className="text-pink-500" />}
                      {type === 'all' && <span className="w-4" />}
                      {REVIEW_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 정렬 옵션 */}
          <div className="relative ml-auto">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {SORT_LABELS[sortBy]}
              <ChevronDown size={16} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSortDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSortDropdown(false)}
                />
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px]">
                  {(['newest', 'rating_high', 'rating_low'] as SortBy[]).map((sort) => (
                    <button
                      key={sort}
                      onClick={() => handleSortSelect(sort)}
                      className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        sortBy === sort ? 'text-purple-600 font-semibold bg-purple-50' : 'text-gray-700'
                      }`}
                    >
                      {SORT_LABELS[sort]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 로그인 모달 */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />

        {/* 리뷰 카드 그리드 */}
        {posts.length === 0 && !urlSearch ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-12 text-center"
          >
            <div className="text-6xl mb-4">💜</div>
            <p className="text-gray-500 text-lg">아직 리뷰가 없습니다.</p>
            <p className="text-gray-400 text-sm mt-2">
              첫 번째 리뷰를 작성해보세요!
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
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {posts.map((post, index) => {
              // 리뷰 타입 결정: product_id가 있으면 제품 후기, 없으면 활동 후기
              const isProductReview = !!post.product_id
              const reviewType: 'product' | 'activity' = isProductReview ? 'product' : 'activity'

              // 개별 리뷰 평점 (작성자가 매긴 평점)
              const reviewRating = post.rating ?? getRandomRating(post.id)

              // 상품 정보 (제품 후기인 경우 JOIN된 데이터에서 직접 가져옴)
              const productInfo = post.product

              // 관련 항목명과 평균 평점
              const relatedItemName = productInfo?.name ?? getRandomActivityItem(post.id)
              const avgRating = productInfo?.rating ?? getRandomRating(post.id)

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <button
                    onClick={() => handleCardClick(post)}
                    className="block w-full text-left group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 hover:shadow-md transition-all duration-200"
                  >
                    {/* 썸네일 이미지 */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {post.thumbnail_url ? (
                        <Image
                          src={post.thumbnail_url}
                          alt="후기 이미지"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : post.images && post.images.length > 0 ? (
                        <Image
                          src={post.images[0]}
                          alt="후기 이미지"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                          <span className="text-4xl">💜</span>
                        </div>
                      )}

                      {/* 이미지 여러장 아이콘 */}
                      {post.images && post.images.length > 1 && (
                        <div className="absolute top-2 right-2 p-1.5 bg-black/50 rounded">
                          <ImageIcon size={14} className="text-white" />
                        </div>
                      )}

                      {/* 리뷰 타입 배지 (이미지 위에 반투명 텍스트) */}
                      {reviewType === 'product' && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                          제품 후기
                        </div>
                      )}
                    </div>

                    {/* 카드 정보 */}
                    <div className="p-3 space-y-1.5">
                      {/* 별점 (작성자가 매긴 개별 평점) */}
                      <StarRating rating={reviewRating} />

                      {/* 본문 첫 줄 (제목 대신) */}
                      <p className="font-medium text-gray-900 text-sm line-clamp-1 group-hover:text-purple-600 transition-colors">
                        {post.content.replace(/<[^>]*>/g, '').trim()}
                      </p>

                      {/* 날짜 */}
                      <p className="text-xs text-gray-400">
                        {formatDate(post.created_at)}
                      </p>

                      {/* 관련 상품/활동 */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {reviewType === 'activity' ? (
                            <Footprints size={14} className="text-purple-500" />
                          ) : productInfo?.image_url ? (
                            <Image
                              src={productInfo.image_url}
                              alt={productInfo.name}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <ShoppingBag size={14} className="text-pink-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 truncate font-medium">
                            {relatedItemName}
                          </p>
                          {/* 상품 평균 평점 (store_products.rating) */}
                          <div className="flex items-center gap-0.5">
                            <Star size={10} className="fill-amber-400 text-amber-400" />
                            <span className="text-xs text-gray-400">{avgRating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* 글쓰기 버튼 */}
        <div className="flex justify-end mt-6">
          <Link
            href="/community/review/write"
            onClick={handleWriteClick}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 text-sm"
          >
            <Plus size={18} />
            후기 작성
          </Link>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 0 && (
          <div className="flex items-center justify-center gap-1 mt-4">
            <button
              onClick={handlePrevGroup}
              disabled={groupStartPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`min-w-[36px] h-9 px-2.5 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={handleNextGroup}
              disabled={groupEndPage >= totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* 검색 영역 */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {/* 검색 타입 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setShowSearchTypeDropdown(!showSearchTypeDropdown)}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors min-w-[90px]"
            >
              {REVIEW_SEARCH_TYPE_LABELS[searchType]}
              <ChevronDown size={16} className={`transition-transform ${showSearchTypeDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSearchTypeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSearchTypeDropdown(false)}
                />
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[90px]">
                  {(['all', 'title', 'author'] as SearchType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleSearchTypeSelect(type)}
                      className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        searchType === type ? 'text-purple-600 font-semibold bg-purple-50' : 'text-gray-700'
                      }`}
                    >
                      {REVIEW_SEARCH_TYPE_LABELS[type]}
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
              className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* 검색 버튼 */}
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-colors text-sm"
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
              className="ml-2 text-purple-600 hover:underline"
            >
              검색 초기화
            </button>
          </div>
        )}
      </div>

      {/* 리뷰 상세 모달 */}
      <ReviewDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        post={selectedPost}
        posts={posts}
        currentUserId={currentUserId}
        onNavigate={handleNavigate}
        onDelete={handleDelete}
        productsMap={productsMap}
      />
    </div>
  )
}
