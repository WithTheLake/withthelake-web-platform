'use client'

import { useState, useEffect, useRef } from 'react'
import Image, { type ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

/**
 * 간단한 그레이 플레이스홀더 (1x1 투명 GIF base64)
 */
const PLACEHOLDER_BLUR =
  'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='

/**
 * 로딩 중 스켈레톤 스타일
 */
const SKELETON_CLASS = 'animate-pulse bg-gray-200'

interface LazyImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  /** 로딩 중 표시할 스켈레톤 사용 여부 (기본: true) */
  showSkeleton?: boolean
  /** 스켈레톤 배경색 클래스 */
  skeletonClass?: string
  /** 페이드인 애니메이션 사용 여부 (기본: true) */
  fadeIn?: boolean
  /** 페이드인 지속 시간 (ms, 기본: 300) */
  fadeInDuration?: number
  /** 에러 발생 시 대체 컴포넌트 */
  fallback?: React.ReactNode
}

/**
 * Lazy Loading이 강화된 이미지 컴포넌트
 *
 * 특징:
 * - 로딩 중 스켈레톤 표시
 * - 로딩 완료 시 페이드인 애니메이션
 * - 에러 발생 시 fallback 표시
 * - Intersection Observer 기반 lazy loading
 *
 * @example
 * ```tsx
 * <LazyImage
 *   src="/images/photo.jpg"
 *   alt="사진"
 *   width={400}
 *   height={300}
 *   className="rounded-lg"
 * />
 * ```
 */
export function LazyImage({
  src,
  alt,
  className,
  showSkeleton = true,
  skeletonClass,
  fadeIn = true,
  fadeInDuration = 300,
  fallback,
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer로 뷰포트 진입 감지
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '100px', // 100px 전에 미리 로드
        threshold: 0,
      }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // 에러 발생 시 fallback 표시
  if (hasError) {
    return (
      <div
        ref={containerRef}
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          className
        )}
        style={props.fill ? undefined : { width: props.width, height: props.height }}
      >
        {fallback || (
          <span className="text-sm">이미지를 불러올 수 없습니다</span>
        )}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', props.fill ? 'w-full h-full' : '')}
      style={props.fill ? undefined : { width: props.width, height: props.height }}
    >
      {/* 스켈레톤 (로딩 중) */}
      {showSkeleton && isLoading && (
        <div
          className={cn(
            'absolute inset-0',
            skeletonClass || SKELETON_CLASS
          )}
        />
      )}

      {/* 이미지 (뷰포트 진입 시에만 렌더링) */}
      {isInView && (
        <Image
          src={src}
          alt={alt}
          className={cn(
            className,
            fadeIn && 'transition-opacity',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          style={{
            transitionDuration: fadeIn ? `${fadeInDuration}ms` : undefined,
          }}
          onLoad={handleLoad}
          onError={handleError}
          placeholder="blur"
          blurDataURL={PLACEHOLDER_BLUR}
          {...props}
        />
      )}

      {/* 뷰포트 밖일 때 플레이스홀더 */}
      {!isInView && showSkeleton && (
        <div
          className={cn(
            'absolute inset-0',
            skeletonClass || SKELETON_CLASS
          )}
        />
      )}
    </div>
  )
}

/**
 * 썸네일 이미지 컴포넌트 (목록에서 사용)
 *
 * LazyImage를 기반으로 하며, 목록 뷰에 최적화
 */
export function ThumbnailImage({
  src,
  alt,
  className,
  ...props
}: Omit<LazyImageProps, 'fadeInDuration' | 'showSkeleton'>) {
  return (
    <LazyImage
      src={src}
      alt={alt}
      className={cn('object-cover', className)}
      fadeInDuration={200}
      {...props}
    />
  )
}

/**
 * 아바타 이미지 컴포넌트
 */
export function AvatarImage({
  src,
  alt,
  size = 40,
  className,
}: {
  src: string
  alt: string
  size?: number
  className?: string
}) {
  return (
    <LazyImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn('rounded-full object-cover', className)}
      fadeInDuration={150}
    />
  )
}
