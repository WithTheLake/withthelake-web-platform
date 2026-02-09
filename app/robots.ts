import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/utils/url';

/**
 * Next.js Metadata API를 사용한 robots.txt 생성
 *
 * 이 파일은 빌드 시 /robots.txt 경로에 텍스트 파일을 생성합니다.
 * 검색 엔진 크롤러에게 사이트의 크롤링 규칙을 알려줍니다.
 *
 * 크롤링 규칙:
 * - 허용: 모든 공개 페이지 (/)
 * - 차단: 관리자 페이지, API, 마이페이지, 인증 페이지
 *
 * 주의사항:
 * - robots.txt는 보안 수단이 아닙니다 (단순 권고사항)
 * - 민감한 페이지는 별도 인증 로직으로 보호해야 합니다
 * - Google Search Console에서 robots.txt 테스트 가능
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*', // 모든 크롤러에 적용
        allow: '/', // 루트 경로 허용 (기본적으로 모든 페이지 크롤링 가능)
        disallow: [
          '/admin',           // 관리자 페이지
          '/admin/*',         // 관리자 하위 페이지 (뉴스 관리, 스토어 관리 등)
          '/api',             // API 엔드포인트
          '/api/*',           // API 하위 경로
          '/mypage',          // 마이페이지 (개인정보 포함)
          '/mypage/*',        // 마이페이지 하위 경로 (설정, 기록)
          '/_next',           // Next.js 내부 파일
          '/_next/*',         // Next.js 번들 파일 (JS, CSS)
          '/auth/callback',   // OAuth 콜백 (보안)
          '/login',           // 로그인 페이지 (검색 결과 불필요)
          '/join',            // 회원가입 페이지 (검색 결과 불필요)
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`, // sitemap 위치 명시
  };
}
