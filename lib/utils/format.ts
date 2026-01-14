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

/**
 * 날짜를 YYYY.MM.DD 형식으로 변환
 * @param dateString - ISO 날짜 문자열
 * @returns "YYYY.MM.DD" 형식
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

/**
 * 날짜+시간을 YYYY.MM.DD HH:mm 형식으로 변환
 * @param dateString - ISO 날짜 문자열
 * @returns "YYYY.MM.DD HH:mm" 형식
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}.${month}.${day} ${hours}:${minutes}`
}

/**
 * 스마트 날짜 포맷 (오늘이면 시간만, 아니면 YYYY.MM.DD)
 * @param dateString - ISO 날짜 문자열
 * @returns 오늘: "HH:mm", 아니면: "YYYY.MM.DD"
 */
export function formatSmartDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (isToday) {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  return formatDate(dateString)
}

/**
 * 한국어 상대 시간 포맷 (댓글용)
 * - 1분 미만: "1분 전"
 * - 1시간 미만: "X분 전"
 * - 24시간 미만: "X시간 전"
 * - 24시간 이상: "YYYY.MM.DD HH:mm"
 * @param dateString - ISO 날짜 문자열
 * @returns 상대 시간 문자열
 */
export function formatRelativeTimeKorean(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffMinutes < 1) return '1분 전'
  if (diffMinutes < 60) return `${diffMinutes}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  return formatDateTime(dateString)
}
