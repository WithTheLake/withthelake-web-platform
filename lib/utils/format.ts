/**
 * 초 단위 시간을 "분:초" 형식으로 변환
 * @param seconds - 초 단위 시간
 * @returns "M:SS" 형식의 문자열 (예: "2:05", "10:30")
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00'
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${min}:${sec < 10 ? '0' + sec : sec}`
}

/**
 * 날짜를 한국어 형식으로 변환
 * @param dateString - ISO 날짜 문자열
 * @returns "YYYY년 M월 D일" 형식
 */
export function formatDateKorean(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

/**
 * 날짜를 상대적 시간으로 변환 (예: "3일 전")
 * @param dateString - ISO 날짜 문자열
 * @returns 상대적 시간 문자열
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '오늘'
  if (diffDays === 1) return '어제'
  if (diffDays < 7) return `${diffDays}일 전`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`
  return `${Math.floor(diffDays / 365)}년 전`
}
