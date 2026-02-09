import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { getSiteUrl, getImageUrl } from "@/lib/utils/url";

export const metadata: Metadata = {
  title: "WithTheLake - 맨발걷기 커뮤니티",
  description: "액티브 시니어의 웰니스 라이프를 그립니다",
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: getSiteUrl(),
    siteName: 'WithTheLake',
    title: 'WithTheLake - 맨발걷기 커뮤니티',
    description: '액티브 시니어의 웰니스 라이프를 그립니다',
    images: [
      {
        url: getImageUrl('/images/active-senior.png'),
        width: 1200,
        height: 630,
        alt: 'WithTheLake - 액티브 시니어의 웰니스 라이프',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WithTheLake - 맨발걷기 커뮤니티',
    description: '액티브 시니어의 웰니스 라이프를 그립니다',
    images: [getImageUrl('/images/active-senior.png')],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = getSiteUrl();
  const logoUrl = getImageUrl('/images/withthelake_logo.png');

  // JSON-LD: Organization 스키마
  // 검색 엔진이 회사 정보를 구조화된 데이터로 이해할 수 있도록 제공
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '위드더레이크',
    alternateName: 'WithTheLake',
    url: siteUrl,
    logo: logoUrl,
    description: '데이터로 몸을 읽고, 인문학으로 마음을 위로하는 웰니스 생태계',
    address: {
      '@type': 'PostalAddress',
      addressLocality: '춘천시',
      addressRegion: '강원특별자치도',
      postalCode: '24232',
      streetAddress: '후석로 462번길 7 춘천 ICT혁신센터 206호',
      addressCountry: 'KR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'ceo@withthelake.com',
      contactType: '고객 지원',
      availableLanguage: ['Korean'],
    },
    sameAs: [
      'https://www.instagram.com/withwellme/',
      'https://www.youtube.com/channel/UC8vmE6swgfF-PvsVIQUmsOQ',
      'https://blog.naver.com/with_thelake',
      'https://cafe.naver.com/healingroadon',
    ],
  };

  // JSON-LD: WebSite 스키마
  // 사이트 검색 기능을 검색 엔진에 알려서 검색 결과에 검색창 표시 가능
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteUrl,
    name: 'WithTheLake',
    description: '맨발걷기 커뮤니티 및 힐링로드ON 서비스',
    publisher: {
      '@type': 'Organization',
      name: '위드더레이크',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/community?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="ko">
      <head>
        {/* Pretendard 폰트 CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        {/* YouTube 도메인 preconnect - 홈페이지 비디오 로딩 최적화 */}
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
      </head>
      <body className="antialiased bg-white">
        {/* JSON-LD 구조화 데이터 */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
