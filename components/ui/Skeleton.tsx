'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

/**
 * 기본 스켈레톤 컴포넌트
 * 로딩 중 콘텐츠의 플레이스홀더로 사용
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200',
        className
      )}
    />
  )
}

/**
 * 후기 게시판 카드 스켈레톤
 */
export function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* 이미지 영역 */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />

      {/* 콘텐츠 영역 */}
      <div className="p-4 space-y-3">
        {/* 별점 */}
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-4 h-4 rounded-full" />
          ))}
        </div>

        {/* 본문 미리보기 */}
        <Skeleton className="h-4 w-full" />

        {/* 닉네임 */}
        <Skeleton className="h-3 w-20" />

        {/* 날짜 */}
        <Skeleton className="h-3 w-24" />

        {/* 상품 정보 */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="h-3 flex-1" />
        </div>
      </div>
    </div>
  )
}

/**
 * 후기 게시판 목록 스켈레톤
 */
export function ReviewListSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * 게시판 테이블 행 스켈레톤 (공지사항/자유게시판용)
 */
export function BoardRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100">
      {/* 번호/상태 */}
      <Skeleton className="w-16 h-5" />

      {/* 제목 */}
      <div className="flex-1 space-y-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>

      {/* 작성자 */}
      <Skeleton className="w-20 h-4 hidden md:block" />

      {/* 날짜 */}
      <Skeleton className="w-20 h-4 hidden md:block" />

      {/* 조회수 */}
      <Skeleton className="w-12 h-4 hidden md:block" />
    </div>
  )
}

/**
 * 게시판 테이블 스켈레톤 (공지사항/자유게시판용)
 */
export function BoardListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-4 py-3 px-4 bg-gray-50 border-b">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="flex-1 h-4" />
        <Skeleton className="w-20 h-4 hidden md:block" />
        <Skeleton className="w-20 h-4 hidden md:block" />
        <Skeleton className="w-12 h-4 hidden md:block" />
      </div>

      {/* 행들 */}
      <div className="px-4">
        {Array.from({ length: count }).map((_, i) => (
          <BoardRowSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

/**
 * 갤러리 카드 스켈레톤 (이벤트 게시판용)
 */
export function GalleryCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* 이미지 영역 */}
      <Skeleton className="aspect-[16/9] w-full rounded-none" />

      {/* 콘텐츠 영역 */}
      <div className="p-4 space-y-2">
        {/* 제목 */}
        <Skeleton className="h-5 w-3/4" />

        {/* 날짜 */}
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

/**
 * 갤러리 목록 스켈레톤 (이벤트 게시판용)
 */
export function GalleryListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <GalleryCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * 게시글 상세 스켈레톤
 */
export function PostDetailSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      {/* 제목 */}
      <Skeleton className="h-8 w-3/4" />

      {/* 메타 정보 */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-200" />

      {/* 본문 */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* 이미지 */}
      <Skeleton className="h-64 w-full rounded-lg" />

      {/* 본문 계속 */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

/**
 * 댓글 스켈레톤
 */
export function CommentSkeleton() {
  return (
    <div className="py-4 border-b border-gray-100 space-y-2">
      {/* 작성자 & 날짜 */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>

      {/* 내용 */}
      <div className="space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

/**
 * 댓글 목록 스켈레톤
 */
export function CommentListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * 뉴스 카드 스켈레톤
 */
export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* 이미지 영역 */}
      <Skeleton className="aspect-[16/9] w-full rounded-none" />

      {/* 콘텐츠 영역 */}
      <div className="p-4 space-y-2">
        {/* 카테고리 */}
        <Skeleton className="h-5 w-16 rounded-full" />

        {/* 제목 */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />

        {/* 출처 & 날짜 */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  )
}

/**
 * 뉴스 목록 스켈레톤
 */
export function NewsListSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * 스토어 상품 카드 스켈레톤
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* 이미지 영역 */}
      <Skeleton className="aspect-square w-full rounded-none" />

      {/* 콘텐츠 영역 */}
      <div className="p-4 space-y-2">
        {/* 카테고리 */}
        <Skeleton className="h-4 w-12" />

        {/* 상품명 */}
        <Skeleton className="h-5 w-3/4" />

        {/* 가격 */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* 평점 */}
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  )
}

/**
 * 스토어 상품 목록 스켈레톤
 */
export function ProductListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
