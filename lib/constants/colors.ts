/**
 * UI 색상 상수
 * 컴포넌트에서 직접 사용하는 색상 값들
 */

// 카카오 브랜드 색상
export const KAKAO_COLORS = {
  yellow: '#FEE500',
  yellowHover: '#FDD800',
  black: '#191919',
  brown: '#3C1E1E',
}

// 그라데이션 클래스 (Tailwind)
export const GRADIENT_CLASSES = {
  purpleBlue: 'bg-gradient-to-r from-purple-600 to-blue-600',
  purpleBlueHover: 'hover:from-purple-700 hover:to-blue-700',
  amberOrange: 'bg-gradient-to-r from-amber-500 to-orange-500',
  amberOrangeHover: 'hover:from-amber-600 hover:to-orange-600',
  emeraldTeal: 'bg-gradient-to-r from-emerald-600 to-teal-600',
  violetPurple: 'bg-gradient-to-r from-violet-600 to-purple-600',
}

// 감정 카테고리 색상 (Tailwind 클래스)
export const EMOTION_STEP_COLORS = {
  emotion: {
    badge: 'bg-purple-100 text-purple-700',
    selected: 'bg-purple-100 border-purple-500',
    focus: 'focus:ring-purple-500',
  },
  meaning: {
    badge: 'bg-blue-100 text-blue-700',
    focus: 'focus:ring-purple-500',
  },
  action: {
    badge: 'bg-green-100 text-green-700',
    selected: 'bg-green-100 border-green-500',
    check: 'text-green-600',
  },
  reflect: {
    badge: 'bg-amber-100 text-amber-700',
    selected: 'bg-amber-100 border-amber-500',
    check: 'text-amber-600',
  },
  anchor: {
    badge: 'bg-rose-100 text-rose-700',
    focus: 'focus:ring-purple-500',
  },
}

// 버튼 기본 스타일
export const BUTTON_STYLES = {
  kakaoLogin: 'bg-[#FEE500] text-[#191919] hover:bg-[#FDD800]',
  primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700',
  secondary: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50',
  disabled: 'opacity-50 cursor-not-allowed',
}
