/**
 * URL 유틸리티 함수
 *
 * 배포 환경에 따라 자동으로 사이트 URL을 반환합니다.
 * SEO 메타데이터, Open Graph, JSON-LD 등에서 사용됩니다.
 */

/**
 * 현재 배포 환경의 사이트 URL을 반환합니다.
 *
 * 우선순위:
 * 1. NEXT_PUBLIC_SITE_URL - 환경 변수에 명시적으로 설정된 URL (프로덕션/개발)
 * 2. VERCEL_URL - Vercel이 자동으로 제공하는 배포 URL (미리보기 배포)
 * 3. localhost:3000 - 로컬 개발 환경
 *
 * @returns {string} 사이트의 전체 URL (프로토콜 포함)
 *
 * @example
 * // 프로덕션 환경
 * getSiteUrl() // → "https://withthelake.vercel.app"
 *
 * // Vercel 미리보기 배포
 * getSiteUrl() // → "https://withthelake-git-feature-xxx.vercel.app"
 *
 * // 로컬 개발
 * getSiteUrl() // → "http://localhost:3000"
 */
export function getSiteUrl(): string {
  // 1순위: 환경 변수에 명시적으로 설정된 URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // 2순위: Vercel이 자동으로 제공하는 배포 URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3순위: 로컬 개발 환경
  return 'http://localhost:3000';
}

/**
 * 이미지의 절대 URL을 생성합니다.
 *
 * Open Graph, JSON-LD 등에서 이미지를 절대 URL로 제공해야 할 때 사용합니다.
 *
 * @param path - 이미지 경로 (예: '/images/logo.png' 또는 'images/logo.png')
 * @returns {string} 전체 URL (예: 'https://withthelake.vercel.app/images/logo.png')
 *
 * @example
 * getImageUrl('/images/logo.png')
 * // → "https://withthelake.vercel.app/images/logo.png"
 *
 * getImageUrl('images/logo.png')
 * // → "https://withthelake.vercel.app/images/logo.png"
 */
export function getImageUrl(path: string): string {
  const siteUrl = getSiteUrl();
  // path가 '/'로 시작하지 않으면 추가
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

/**
 * 페이지의 절대 URL을 생성합니다.
 *
 * Open Graph, Canonical URL 등에서 사용합니다.
 *
 * @param path - 페이지 경로 (예: '/about' 또는 'about')
 * @returns {string} 전체 URL (예: 'https://withthelake.vercel.app/about')
 *
 * @example
 * getPageUrl('/about')
 * // → "https://withthelake.vercel.app/about"
 *
 * getPageUrl('community/notice')
 * // → "https://withthelake.vercel.app/community/notice"
 */
export function getPageUrl(path: string): string {
  const siteUrl = getSiteUrl();
  // path가 '/'로 시작하지 않으면 추가
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}
