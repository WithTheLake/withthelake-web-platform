import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/utils/url';

/**
 * Next.js Metadata API를 사용한 sitemap.xml 자동 생성
 *
 * 이 파일은 빌드 시 /sitemap.xml 경로에 XML 파일을 생성합니다.
 * 검색 엔진이 사이트의 구조를 이해하고 효율적으로 크롤링할 수 있도록 돕습니다.
 *
 * 포함 페이지:
 * - 마케팅 페이지 (메인, 소개, 정보, 뉴스, 스토어)
 * - 커뮤니티 게시판 (공지, 자유, 이벤트, 후기)
 * - 서비스 페이지 (힐링로드ON, 마이페이지)
 * - 법적 페이지 (이용약관, 개인정보처리방침)
 *
 * 제외 페이지:
 * - 관리자 페이지 (/admin/*) - 검색 엔진 노출 불필요
 * - 동적 게시글 - sitemap이 너무 커지는 것을 방지
 * - 인증 페이지 (로그인, 회원가입, OAuth 콜백) - 검색 결과 불필요
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();

  return [
    // ========================================
    // 1. 메인 페이지 (최우선 순위)
    // ========================================
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // ========================================
    // 2. 마케팅 페이지 (높은 우선순위)
    // ========================================
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/info`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // ========================================
    // 3. 커뮤니티 게시판 (매일 업데이트)
    // ========================================
    {
      url: `${baseUrl}/community`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/community/notice`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community/free`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community/event`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/community/review`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },

    // ========================================
    // 4. 서비스 페이지
    // ========================================
    {
      url: `${baseUrl}/healing`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mypage`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5, // 로그인 필요하므로 낮은 우선순위
    },

    // ========================================
    // 5. 법적 페이지 (낮은 우선순위)
    // ========================================
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
