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
