import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WithTheLake - 맨발걷기 커뮤니티",
  description: "액티브 시니어의 웰니스 라이프를 그립니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard 폰트 CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="antialiased bg-white">
        {children}
      </body>
    </html>
  );
}
