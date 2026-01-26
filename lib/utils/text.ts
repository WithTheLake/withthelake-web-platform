/**
 * 텍스트 처리 유틸리티 함수
 */

/**
 * HTML 태그를 제거하고 첫 줄만 추출
 * @param content - HTML 태그가 포함될 수 있는 텍스트
 * @param maxLength - 최대 길이 (기본 50자)
 * @returns 첫 줄 텍스트 (최대 길이 초과 시 말줄임)
 */
export function getFirstLine(content: string, maxLength: number = 50): string {
  // HTML 태그 제거
  const stripped = content.replace(/<[^>]*>/g, '').trim()
  // 첫 줄만 추출 (줄바꿈 기준)
  const firstLine = stripped.split('\n')[0].trim()
  // 최대 길이 제한
  if (firstLine.length > maxLength) {
    return firstLine.substring(0, maxLength) + '...'
  }
  return firstLine
}

/**
 * HTML 태그 제거
 * @param html - HTML 문자열
 * @returns 순수 텍스트
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

/**
 * 텍스트 말줄임 처리
 * @param text - 원본 텍스트
 * @param maxLength - 최대 길이
 * @returns 말줄임 처리된 텍스트
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * 닉네임 마스킹 처리
 * 개인정보 보호를 위해 닉네임의 일부를 *로 가림
 *
 * 규칙:
 * [한글]
 * - 1글자: 그대로 표시 (김 → 김)
 * - 2글자: 첫글자 + * (김영 → 김*)
 * - 3글자 이상: 첫글자 + ** + 마지막글자 (김영지 → 김*지, 홍길동이 → 홍**이)
 *
 * [영어/숫자/기타]
 * - 1-2글자: 그대로 표시 (Jo → Jo)
 * - 3-4글자: 앞 2글자 + ** (John → Jo**)
 * - 5글자 이상: 앞 3글자 + ** (Alexander → Ale******)
 *
 * @param nickname - 원본 닉네임
 * @returns 마스킹된 닉네임
 */
export function maskNickname(nickname: string | null | undefined): string {
  if (!nickname) return '익명'

  const trimmed = nickname.trim()
  const length = trimmed.length

  if (length === 0) return '익명'
  if (length === 1) return trimmed

  // 한글 여부 확인 (첫 글자가 한글인지)
  const isKorean = /^[\uAC00-\uD7AF]/.test(trimmed)

  if (isKorean) {
    // 한글: 첫글자 + ** + 마지막글자
    if (length === 2) return trimmed[0] + '*'
    const firstChar = trimmed[0]
    const lastChar = trimmed[length - 1]
    const maskedMiddle = '*'.repeat(length - 2)
    return firstChar + maskedMiddle + lastChar
  } else {
    // 영어/숫자/기타: 앞 2-3글자 + **
    if (length <= 2) return trimmed
    if (length <= 4) {
      // 3-4글자: 앞 2글자 보여줌 (John → Jo**)
      return trimmed.slice(0, 2) + '*'.repeat(length - 2)
    }
    // 5글자 이상: 앞 3글자 보여줌 (Alexander → Ale******)
    return trimmed.slice(0, 3) + '*'.repeat(length - 3)
  }
}
