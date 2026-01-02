/**
 * Framer Motion 애니메이션 상수
 * 프로젝트 전반에서 일관된 애니메이션을 위해 사용
 */

// 모달 애니메이션
export const MODAL_ANIMATION = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  content: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  spring: {
    type: 'spring' as const,
    damping: 25,
    stiffness: 300,
  },
}

// 바텀시트 애니메이션
export const BOTTOM_SHEET_ANIMATION = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  spring: {
    type: 'spring' as const,
    damping: 25,
    stiffness: 300,
  },
}

// 리스트 아이템 애니메이션
export const LIST_ITEM_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  staggerDelay: 0.05, // 각 아이템 사이의 지연 시간
}

// 슬라이드 애니메이션 (좌우)
export const SLIDE_ANIMATION = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  duration: 0.2,
}

// 페이드 애니메이션
export const FADE_ANIMATION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  duration: 0.2,
}

// 스케일 애니메이션 (버튼 등)
export const SCALE_ANIMATION = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
}

// 진행 바 애니메이션
export const PROGRESS_BAR_ANIMATION = {
  initial: { width: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
}
