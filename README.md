# WithTheLake Web Platform

**위드더레이크** 디지털 헬스케어 융복합 웹 플랫폼

데이터로 몸을 읽고, 인문학으로 마음을 위로하는 웰니스 생태계를 구축합니다.

## 프로젝트 소개

WithTheLake Web Platform은 **기업 홈페이지**와 **힐링로드ON 서비스**를 통합한 웹 애플리케이션입니다.

- **기업 홈페이지** (marketing) - 회사 소개, 맨발걷기 정보, NEWS, 스토어, 커뮤니티
- **힐링로드ON** (service) - 맨발걷기 오디오 가이드, 감정 기록, 주간 보고서
- **관리자 페이지** (admin) - 콘텐츠 관리, 회원 관리, 통계 대시보드

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 (CSS-first) |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (Kakao OAuth) |
| State Management | Zustand |
| Animation | Framer Motion |
| Icons | Lucide React |
| Deployment | Vercel |

## 주요 기능

### 기업 홈페이지
- 반응형 메인 페이지 (고정 배경 + 노이즈 텍스처)
- 기업 소개 (섹션 앵커 네비게이션, IntersectionObserver 스크롤 스파이)
- 맨발걷기 정보 (과학적 연구자료 기반)
- NEWS (DB 기반, 카테고리 필터)
- 스토어 (네이버 스마트스토어 연동)
- 커뮤니티 게시판 (공지사항, 자유게시판, 이벤트, 힐링 후기)

### 힐링로드ON
- Supabase Storage 기반 오디오 스트리밍 가이드
- 전국 17개 시도 SVG 지도 기반 길 안내
- 감정 기록 시스템 (5단계 멀티스텝 폼)
- GPS 위치 추적 (2단계 폴백)
- 긍정확언 모달

### 마이페이지
- 감정 기록 통계 및 목록
- 주간 감정 보고서 (AI 인사이트)
- PC/모바일 분리 레이아웃

### 관리자 페이지
- 대시보드 (통계, 최근 활동)
- 뉴스 / 스토어 / 오디오 / 커뮤니티 / 회원 관리
- Storage 파일/폴더 관리
- 역할 기반 권한 (대표 / 관리자 / 일반)

### SEO & Performance
- sitemap.xml 자동 생성 (17개 페이지)
- robots.txt 최적화 (크롤링 규칙)
- JSON-LD 구조화 데이터 (Organization, WebSite)
- Open Graph 이미지 (페이지별 맞춤 설정)
- Twitter 카드 지원
- 환경별 URL 자동 적용 (localhost/Vercel/커스텀 도메인)

## 프로젝트 구조

```
app/
├── (marketing)/    # 기업 홈페이지 (PC+모바일 반응형)
├── (service)/      # 힐링로드ON (모바일 우선, PC 분리 레이아웃)
├── (admin)/        # 관리자 페이지
├── login/          # 로그인
├── join/           # 회원가입
└── auth/           # OAuth 콜백

components/         # 공용 컴포넌트
actions/            # Server Actions
lib/                # 유틸리티, Supabase 클라이언트, 상수
stores/             # Zustand 전역 상태
types/              # TypeScript 타입 정의
```

## 시작하기

### 사전 요구사항

- Node.js 18+
- npm
- Supabase 프로젝트

### 환경 변수

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_STORAGE_URL=your_storage_url
SUPER_ADMIN_USER_ID=your_super_admin_user_id
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

http://localhost:3000 에서 확인할 수 있습니다.

### 데이터베이스 설정

`supabase-schema.sql` 파일을 Supabase SQL Editor에서 실행하여 테이블과 초기 데이터를 생성합니다.

## 배포

Vercel에 배포되어 있으며, `main` 브랜치 push 시 자동 배포됩니다.

- **프로덕션**: https://withthelake.vercel.app
- **브랜치 전략**: `develop` (개발) -> `main` (배포)

## 인증

카카오 OAuth를 통한 소셜 로그인을 지원합니다.

- Supabase Auth + Kakao OAuth Provider
- Lazy Auth 패턴 (로그인 없이 서비스 진입, 데이터 저장 시점에 인증 요구)

## 프로젝트 문서

| 문서 | 설명 |
|------|------|
| `CLAUDE.md` | 프로젝트 규칙, 컨벤션, 개발 현황 |
| `DEVLOG.md` | 개발 과정 기록, 문제 해결 사례 |
| `FEATURES.md` | 페이지별 기능 명세서 |
| `ADMIN_PLAN.md` | 관리자 페이지 계획 |

## 라이선스

Private - All rights reserved.

---

(주)위드더레이크 | 강원특별자치도 춘천시 후석로 462번길 7 춘천 ICT혁신센터 206호
