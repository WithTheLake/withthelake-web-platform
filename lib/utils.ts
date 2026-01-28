import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS 클래스를 병합하는 유틸리티 함수
 * clsx로 조건부 클래스를 처리하고, tailwind-merge로 충돌을 해결
 *
 * @example
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4'
 * cn('text-red-500', isActive && 'text-blue-500') // 조건부 적용
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
