// 뉴스 관련 상수

// 카테고리
export const NEWS_CATEGORIES = ['전체', '언론보도', '해외자료', '블로그', '보도자료'] as const

// 카테고리별 버튼 스타일
export const NEWS_CATEGORY_STYLES = {
  전체: {
    active: 'bg-gray-900 text-white',
    inactive: 'bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300',
  },
  언론보도: {
    active: 'bg-blue-600 text-white',
    inactive: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300',
  },
  해외자료: {
    active: 'bg-purple-600 text-white',
    inactive: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-300',
  },
  블로그: {
    active: 'bg-green-600 text-white',
    inactive: 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300',
  },
  보도자료: {
    active: 'bg-orange-600 text-white',
    inactive: 'bg-orange-100 text-orange-800 hover:bg-orange-200 border border-orange-300',
  },
} as const

// 카테고리 뱃지 색상 (뉴스 카드용)
export const NEWS_BADGE_STYLES = {
  언론보도: 'bg-blue-100 text-blue-700',
  해외자료: 'bg-purple-100 text-purple-700',
  블로그: 'bg-green-100 text-green-700',
  보도자료: 'bg-orange-100 text-orange-700',
} as const

// 카테고리별 섹션 테마 색상
export const NEWS_SECTION_STYLES = {
  언론보도: { bg: 'bg-blue-50/50', title: 'text-blue-900', border: 'border-blue-200' },
  해외자료: { bg: 'bg-purple-50/50', title: 'text-purple-900', border: 'border-purple-200' },
  블로그: { bg: 'bg-green-50/50', title: 'text-green-900', border: 'border-green-200' },
  보도자료: { bg: 'bg-orange-50/50', title: 'text-orange-900', border: 'border-orange-200' },
} as const

// 타입 정의
export type NewsCategory = typeof NEWS_CATEGORIES[number]
export type NewsCategoryWithoutAll = Exclude<NewsCategory, '전체'>

// 헬퍼 함수
export const getNewsCategoryButtonStyle = (category: string, isActive: boolean): string => {
  const styles = NEWS_CATEGORY_STYLES[category as NewsCategory]
  if (!styles) return ''
  return isActive ? styles.active : styles.inactive
}

export const getNewsBadgeStyle = (category: string): string => {
  return NEWS_BADGE_STYLES[category as NewsCategoryWithoutAll] || 'bg-gray-100 text-gray-700'
}

export const getNewsSectionStyle = (category: string) => {
  return NEWS_SECTION_STYLES[category as NewsCategoryWithoutAll] || { bg: 'bg-gray-50', title: 'text-gray-900', border: 'border-gray-200' }
}
