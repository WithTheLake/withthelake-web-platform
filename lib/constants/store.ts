// 스토어 관련 상수

// 카테고리
export const STORE_CATEGORIES = ['전체', '케어', '어싱', '체험'] as const

// 뱃지 스타일
export const STORE_BADGES = {
  베스트: { label: '베스트', className: 'bg-red-500 text-white' },
  인기: { label: '인기', className: 'bg-orange-500 text-white' },
  추천: { label: '추천', className: 'bg-blue-500 text-white' },
  신상품: { label: '신상품', className: 'bg-green-500 text-white' },
} as const

// 네이버 스토어 기본 URL
export const NAVER_STORE_URL = 'https://smartstore.naver.com/withlab201'

// 타입 정의
export type StoreCategory = typeof STORE_CATEGORIES[number]
export type StoreBadge = keyof typeof STORE_BADGES

// 헬퍼 함수
export const getBadgeStyle = (badge: string | null): string => {
  if (!badge) return ''
  return STORE_BADGES[badge as StoreBadge]?.className || 'bg-gray-500 text-white'
}
