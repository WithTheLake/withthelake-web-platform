// 커뮤니티 관련 상수

// 게시판 타입
export const BOARD_TYPES = ['notice', 'free', 'event', 'review'] as const

// 게시판 정보 (확장)
export const BOARD_INFO = {
  notice: {
    label: '공지사항',
    description: '힐링로드 ON의 새로운 소식과 공지사항',
    path: '/community/notice',
    themeColor: 'emerald',
    hasComments: false,
    hasGalleryImages: false,
    hasInlineImages: true,
  },
  free: {
    label: '자유게시판',
    description: '자유롭게 이야기를 나눠보세요',
    path: '/community/free',
    themeColor: 'blue',
    hasComments: true,
    hasGalleryImages: false,
    hasInlineImages: true,
  },
  event: {
    label: '이벤트',
    description: '다양한 이벤트와 캠페인에 참여하세요',
    path: '/community/event',
    themeColor: 'purple',
    hasComments: true,
    hasGalleryImages: true,
    hasInlineImages: false,
  },
  review: {
    label: '힐링 후기',
    description: '힐링로드 ON 이용 후기를 공유해주세요',
    path: '/community/review',
    themeColor: 'orange',
    hasComments: true,
    hasGalleryImages: true,
    hasInlineImages: false,
  },
} as const

// 자유게시판 주제 (DB 값과 일치해야 함)
export const FREE_BOARD_TOPICS = ['chat', 'question', 'info', 'review'] as const

// 주제별 스타일 및 라벨
export const TOPIC_STYLES = {
  chat: { className: 'bg-gray-100 text-gray-600', label: '잡담' },
  question: { className: 'bg-blue-100 text-blue-600', label: '질문' },
  info: { className: 'bg-emerald-100 text-emerald-600', label: '정보' },
  review: { className: 'bg-purple-100 text-purple-600', label: '후기' },
} as const

// 검색 타입
export const SEARCH_TYPES = ['all', 'title', 'author'] as const

export const SEARCH_TYPE_LABELS = {
  all: '전체',
  title: '제목만',
  author: '작성자',
} as const

// 페이지네이션 설정
export const PAGINATION = {
  postsPerPage: 10,
  pagesPerGroup: 10,
} as const

// 타입 정의
export type BoardType = typeof BOARD_TYPES[number]
export type FreeBoardTopic = typeof FREE_BOARD_TOPICS[number]
export type SearchType = typeof SEARCH_TYPES[number]

// 헬퍼 함수
export const getBoardInfo = (type: string) => {
  return BOARD_INFO[type as BoardType] || null
}

export const getBoardLabel = (type: string): string => {
  return BOARD_INFO[type as BoardType]?.label || type
}

export const getBoardDescription = (type: string): string => {
  return BOARD_INFO[type as BoardType]?.description || ''
}

export const getTopicStyle = (topic: string): string => {
  return TOPIC_STYLES[topic as FreeBoardTopic]?.className || 'bg-gray-100 text-gray-600'
}

export const getTopicLabel = (topic: string): string => {
  return TOPIC_STYLES[topic as FreeBoardTopic]?.label || topic
}

export const getSearchTypeLabel = (type: string): string => {
  return SEARCH_TYPE_LABELS[type as SearchType] || type
}
