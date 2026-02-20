# WithTheLake 기능 명세서

> 프로젝트의 모든 페이지, 컴포넌트, 시스템 기능을 상세히 정리한 문서입니다.

---

## 목차

1. [권한 체계](#1-권한-체계)
2. [마케팅 페이지](#2-마케팅-페이지-marketing)
3. [서비스 페이지](#3-서비스-페이지-service)
4. [인증 페이지](#4-인증-페이지)
5. [관리자 페이지](#5-관리자-페이지-admin)
6. [공통 컴포넌트](#6-공통-컴포넌트)
7. [모달 시스템](#7-모달-시스템)
8. [UX 시스템](#8-ux-시스템)
9. [백그라운드 작업](#9-백그라운드-작업)
10. [Server Actions](#10-server-actions)
11. [데이터 정책](#11-데이터-정책)

---

## 1. 권한 체계

| 역할 | 설명 | 권한 |
|------|------|------|
| **비로그인** | 로그인하지 않은 방문자 | 읽기 전용, 일부 기능 제한 |
| **로그인 사용자** | 카카오 OAuth 인증 완료 | 감정 기록, 커뮤니티 글/댓글 작성 |
| **관리자** | `user_profiles.is_admin = true` | 콘텐츠 관리, 회원 관리 |
| **대표** | `SUPER_ADMIN_USER_ID` 환경변수 | 관리자 임명/해제, 전체 권한 |

---

## 2. 마케팅 페이지 (Marketing)

### 2.1 메인 페이지 (`/`)

**접근 권한**: 모두

**주요 기능**:
- 히어로 섹션 (배경 동영상)
- 고정 배경 효과 (SVG 노이즈 텍스처)
  - 상단 50% 밝은 회색, 하단 50% 진한 회색 그라데이션
  - `feTurbulence` 필터로 자연스러운 질감
- 맨발걷기 소개
- 액티브 시니어 섹션 (투명 배경, parallax 효과)
- 5가지 프로젝트 (3x2 그리드)
- 3가지 방법 (4컬럼: 숫자3 이미지 + 3개 카드)
- 앱 다운로드 (둥근 검정 박스, 좌측 텍스트 + 우측 스크린샷)
- CTA (힐링로드ON 시작하기)

**반응형**:
- 모바일: 1열 스택
- 데스크톱: 그리드 레이아웃

**조건부 UI**: 없음

---

### 2.2 기업 소개 (`/about`)

**접근 권한**: 모두

**주요 기능**:
- **섹션 앵커 네비게이션** (IntersectionObserver 기반 스크롤 스파이)
  - Sticky 네비게이션: `hidden lg:block` (PC에서만 표시)
  - 활성 섹션 자동 감지 (`rootMargin: '-20% 0px -70% 0px'`)
  - 활성 버튼: `bg-green-600 text-white`
  - 비활성 버튼: `text-gray-500 hover:bg-gray-100`
- **6개 네비게이션 섹션** (히어로 제외):
  1. 브랜드 - LAKE 아크로님 4글자 카드 (Life, Active, Knowledge, Experience)
  2. 핵심 가치 - 3개 카드 (Data, Nature, Local), `md:grid-cols-3`
  3. 4대 단절 - 4개 카드, `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` (모바일 반응형)
  4. 사업 영역 - 4개 카드 (4 Pillars), `md:grid-cols-2`
  5. 연혁 - 타임라인 (8개 마일스톤, 2024.02 ~ 2025.12)
     - 모바일 날짜/제목: `text-lg md:text-2xl`, 설명: `text-sm md:text-lg`
     - 컨테이너: `max-w-xl md:max-w-2xl`, 간격: `gap-5 md:gap-10`
  6. 회사 정보 - 보라색 배경 (`bg-[#410099]/75 text-white`), SNS 링크, 회사 위치
- **히어로 섹션**: 보라색 그라데이션 (`from-[#410099]/50 via-[#410099]/30 to-transparent`)
  - 제목: `text-4xl md:text-6xl lg:text-7xl`
  - 태그라인: `text-[#410099]`
- **모바일 반응형 최적화**
  - 4대 단절: 모바일 1열 → 태블릿 2열 → PC 4열
  - 사업 영역: 모바일 1열 → PC 2열
  - 네비게이션: PC에서만 표시 (`hidden lg:block`)
- **스크롤 마진**: 모든 섹션 `scroll-mt-20`
- 회사 정보: 대표 박충신, 강원특별자치도 속초시 관광로 115

**조건부 UI**: 없음

---

### 2.3 맨발걷기 정보 (`/info`)

**접근 권한**: 모두

**주요 기능**:
- **섹션 앵커 네비게이션** (5개 섹션)
  - 맨발걷기란, 효과, 올바른 방법, 주의사항, 연구자료
  - 기업소개 페이지와 동일한 스타일
- **밝은 히어로 섹션** (`bg-gradient-to-b from-green-100/70 to-white`)
  - Earthing/Grounding 뱃지, 중앙 정렬 타이틀
  - 패딩: `py-24 md:py-32`, 제목: `text-4xl md:text-5xl lg:text-6xl`
- **맨발걷기란 섹션**
  - 중앙 정렬 텍스트
  - National Geographic 기사 링크 (`mt-10`)
- **과학적 효과** (6개 카드, `py-20 md:py-28`)
  - 스트레스 감소, 수면 개선, 혈액순환, 발 건강, 자세 교정, 면역력
  - 카드 패딩: `p-8`, hover 효과: `hover:shadow-xl hover:-translate-y-1`
- **타임라인 스타일 방법 섹션** (4단계, `py-20 md:py-28`)
  - 좌측 연결선 + 번호 원형 아이콘
  - 각 단계별 이모지 아이콘
  - 1. 장소 선택 → 2. 점진적 적응 → 3. 자세와 호흡 → 4. 마무리 관리
- **3열 연구자료 카드 그리드** (6개 논문/기사, `py-20 md:py-28`)
  - 카테고리별 색상 뱃지
    - 발 건강·근력: 파랑
    - 뇌 기능·인지: 보라
    - 통증 관리: 에메랄드
    - 웰니스·수면: 인디고
    - 면역·생리: 핑크
    - 염증·자가면역: 오렌지
  - 카드 높이 일관성 (`min-h-[3.5rem]` 제목)
- **CTA 섹션** (`bg-gradient-to-r from-green-500 to-emerald-600`)
  - 설명: `text-xl md:text-2xl`
  - 버튼: `px-10 py-5 md:px-12 md:py-6 text-xl md:text-2xl`
- **전체 섹션 모바일 패딩**: `px-6 lg:px-8` (텍스트 좌우 여백 확보)

**조건부 UI**: 없음

---

### 2.4 NEWS (`/news`)

**접근 권한**: 모두

**주요 기능**:
- 뉴스 목록 (DB 기반, `news_articles` 테이블)
- **카테고리 필터** (전체, 언론보도, 해외자료, 블로그, 보도자료)
- **썸네일 정책**:
  - 해외자료: 썸네일 표시
  - 언론보도: 썸네일 제거 (저작권 이슈)
  - 블로그/보도자료: 썸네일 표시
- 페이지네이션 (16개/페이지)
- 외부 링크 (`target="_blank"`)
- **하단 여백**: `pb-16` 추가

**조건부 UI**: 없음

**관리자 기능**:
- 뉴스 추가/수정/삭제: `/admin/news`

---

### 2.5 스토어 (`/store`)

**접근 권한**: 모두

**주요 기능**:
- 상품 목록 (DB 기반, `store_products` 테이블)
- **동적 카테고리 필터** (`store_categories` 테이블)
  - 전체, 케어, 어싱, 체험
- 상품 카드 (이미지, 이름, 가격, 원가, 할인율, 평점, 리뷰 수, 뱃지)
- **네이버 스마트스토어 연동**
  - 기본 URL: `https://smartstore.naver.com/withlab201`
  - 클릭 시 새 탭으로 열림
- 페이지네이션 (9개/페이지)
- **히어로 섹션**: 위드웰미 마켓 로고 이미지 (`max-w-xl`, `aspect-[3/1]`)
- **하단 여백**: `pb-16` 추가

**조건부 UI**: 없음

**관리자 기능**:
- 상품 추가/수정/삭제: `/admin/store`
- 카테고리 관리: `/admin/store/categories`

---

### 2.6 커뮤니티 게시판 (`/community/*`)

**접근 권한**:
- **읽기**: 모두
- **쓰기/댓글**: 로그인 필요
- **수정/삭제**: 본인 또는 관리자

**게시판 종류**:
| 게시판 | 경로 | 테마 | 특징 |
|--------|------|------|------|
| 공지사항 | `/community/notice` | 에메랄드/틸 | 댓글 없음, 관리자만 작성 |
| 자유게시판 | `/community/free` | 파랑/인디고 | 주제 필터 (잡담, 질문, 정보, 후기) |
| 이벤트 | `/community/event` | 앰버 | 갤러리형 레이아웃 |
| 힐링 후기 | `/community/review` | 보라 | 0.5 단위 평점, 상품 연동 |

**주요 기능**:
1. **Path-based 라우팅** (SEO 최적화)
   - `/community` → 공지사항 직접 렌더링 (redirect 없음, 깜빡임 방지)
   - 각 게시판별 독립적인 메타데이터 (title, description, openGraph)

2. **게시글 CRUD**
   - 생성: `createPost()` (로그인 필요, `is_blocked` 체크)
   - 조회: `getPost()` (조회수 자동 증가)
   - 수정: `updatePost()` (본인만)
   - 삭제: `deletePost()` (본인 또는 관리자, soft delete)

3. **댓글 기능** (공지사항 제외)
   - 작성: `createComment()` (로그인 필요, `is_blocked` 체크)
   - 삭제: `deleteComment()` (본인 또는 관리자)

4. **이미지 업로드**
   - 최대 10장 (확대: 5장 → 10장)
   - 자동 압축 (`browser-image-compression`)
     - 최대 1MB, 1920px
     - 업로드 전 클라이언트 사이드 압축
   - Supabase Storage (`community-images` 버킷)
   - 파일명: `{user_id}/{timestamp}-{random}.{ext}`
   - 첫 번째 이미지가 썸네일

5. **서버사이드 검색**
   - 검색 타입: 전체(all), 제목(title), 내용(content), 작성자(author)
   - URL 쿼리 파라미터로 상태 유지 (`?search=키워드&searchType=all`)
   - Supabase `ilike` 연산자 (대소문자 구분 없음)

6. **페이지네이션**
   - 10개/페이지
   - 10페이지/그룹

7. **닉네임 마스킹** (개인정보 보호)
   - 2글자: 첫 글자 + `*` (예: "홍*")
   - 3글자 이상: 첫 글자 + `*` 반복 + 마지막 글자 (예: "홍**동")

8. **자유게시판 전용 기능**
   - 주제 필터 (잡담, 질문, 정보, 후기)
   - 주제별 색상 뱃지
   - 3열 테이블 레이아웃 (주제 포함)

9. **후기 게시판 전용 기능**
   - **0.5 단위 평점 시스템**
     - DB: `DECIMAL(2,1)` 타입
     - 별 아이콘 좌/우 클릭 영역 분리
     - 좌클릭: -0.5, 우클릭: 정수
   - **상품 연동**
     - `store_products` JOIN 최적화
     - 상품 이미지 표시 (32x32 카드, 40x40 모달)
     - 상품 미선택 시 활동 후기로 작성 가능
     - 리뷰 작성/수정/삭제 시 상품 평균 평점 자동 업데이트
   - **정렬 옵션**
     - 최신순 (기본)
     - 평점 높은순 (`rating_high`)
     - 평점 낮은순 (`rating_low`)
   - **갤러리형 레이아웃**
     - 3열 카드 그리드
     - 썸네일 이미지 + 평점 + 상품 정보

10. **이미지 라이트박스**
    - 클릭 시 full-screen 오버레이
    - ESC 키로 닫기
    - 배경 클릭으로 닫기

11. **날짜 표시**
    - 스마트 포맷: 오늘이면 시간만 (`"14:30"`), 아니면 날짜 (`"2026.01.12"`)
    - `.` 구분자 사용 (시니어 친화)

**조건부 UI**:

| 요소 | 비로그인 | 로그인 사용자 | 관리자 |
|------|----------|---------------|--------|
| 글쓰기 버튼 | 클릭 시 로그인 모달 | 표시 | 표시 |
| 댓글 작성 | 로그인 유도 UI | 가능 (`rows={3}`, `text-base`) | 가능 (`rows={3}`, `text-base`) |
| 수정/삭제 버튼 | 숨김 | 본인 글만 표시 | 모든 글 표시 |
| 고정 아이콘 (공지) | 표시 (읽기 전용) | 표시 (읽기 전용) | 토글 버튼 |
| 댓글 삭제 | 숨김 | 본인 댓글만 | 모든 댓글 (Trash2 16px, `p-2 -m-2` 터치 영역 확대) |

**관리자 전용 기능**:
- 고정글 설정/해제 (`togglePinPost()`)
- 타인 글/댓글 삭제 (soft delete)
- 게시글 숨김 (`togglePostActive()`)
- 관리 페이지: `/admin/community`

**데이터 보관 정책**:
- Soft delete 30일 후 hard delete (Vercel Cron, 매일 03:00 KST)

---

### 2.7 이용약관 (`/terms`)

**접근 권한**: 모두

**주요 기능**:
- 카카오 OAuth 기반 이용약관 15개 조항
- 시행일: 2026년 1월 28일
- 개인정보처리방침 링크 (`/privacy`)

**조건부 UI**: 없음

---

### 2.8 개인정보처리방침 (`/privacy`)

**접근 권한**: 모두

**주요 기능**:
- **수집 항목**
  - 카카오: 고유ID, 닉네임, 이메일, 프로필 이미지
  - 서비스: 감정 기록, 걷기 기록, 게시글/댓글
- **위탁 처리 현황 테이블**
  - Supabase (DB/인증/저장)
  - Kakao (소셜 로그인)
  - Vercel (호스팅)
- **개인정보 보호책임자**
  - 정미경 (대표이사)
  - `ceo@withthelake.com`
- **10개 조항**

**조건부 UI**: 없음

---

## 3. 서비스 페이지 (Service)

### 3.1 힐링로드ON (`/healing`)

**접근 권한**: 모두

**주요 기능**:
1. **Supabase Storage 오디오 스트리밍**
   - 동적 폴더 구조: `audio/walk_guide/`, `audio/affirmation/`, `audio/trail_guide/`
   - URL 생성: `NEXT_PUBLIC_SUPABASE_STORAGE_URL/{folder}/{filename}`
   - MP3 형식 권장 (WAV는 duration 메타데이터 오류)

2. **오디오 플레이어** (페이지 내 직접 관리)
   - `<audio>` 엘리먼트 직접 제어
   - 진행 바 클릭으로 시간 이동
   - 재생/일시정지/정지 버튼
   - 현재 시간 / 전체 시간 표시
   - 로딩 상태 표시 (Loader2 회전 아이콘 + Framer Motion fade-in)
   - **오디오 선택 시 자동 재생** (`shouldAutoPlay` ref + `canplay` 이벤트 핸들러)

3. **Leaflet + OpenStreetMap 기반 지도 길 안내**
   - `hooks/useLeafletMap.ts` (Leaflet 동적 로딩 훅)
   - `lib/constants/mapCoordinates.ts` (17개 시도 + 229개 시군구 좌표)
   - `components/modals/TrailMapSelectModal.tsx` (Leaflet 마커 기반)
   - 오디오가 등록된 지역만 파란색 마커 표시
   - 3단계 선택: 전국 뷰(줌 7) → 시도 확대(줌 9) → 시군구 → 길
   - 핀치줌, 스크롤줌, 드래그 이동 지원
   - PC용 줌 컨트롤 버튼 (0.5 단위, `hidden lg:flex`)
   - 뷰 전환 시 줌/이동 제한 (`maxBounds`, 동적 `minZoom`)
   - CartoDB Positron 라벨 없는 타일 사용

4. **3가지 모달**:
   - 걷기 안내 모달 (12개 코스)
   - 긍정확언 모달 (9개 메시지)
   - 길 안내 모달 (텍스트/지도 선택)

5. **GPS 위치 추적** (2단계 폴백)
   - 1차: 고정밀 GPS (`enableHighAccuracy: true`, timeout: 8초)
   - 2차: 네트워크 기반 (`enableHighAccuracy: false`, timeout: 10초)
   - 실패 시 GPS 권한 안내 모달 표시

6. **감정 기록 버튼**

7. **PC/모바일 분리 레이아웃** (`lg` 브레이크포인트, 1024px)
   - 모바일: `lg:hidden`, 전체 너비, `px-5` 패딩
   - PC: `hidden lg:block`, 히어로 배너 (480px), 플로팅 미디어 플레이어, 3컬럼 카드

**조건부 UI**:

| 요소 | 비로그인 | 로그인 사용자 |
|------|----------|---------------|
| 오디오 재생 | 가능 | 가능 |
| 걷기 안내/긍정확언/길 안내 모달 | 가능 | 가능 |
| GPS 추적 | 가능 | 가능 |
| 감정 기록 버튼 | 클릭 시 로그인 모달 | 5단계 멀티스텝 폼 |

**감정 기록 플로우**:
1. 비로그인: "감정 기록" 클릭 → 로그인 모달 (`returnAction="emotion"`)
2. 로그인 성공 → URL `action=emotion` 파라미터 감지 → 감정 기록 모달 자동 오픈
3. 로그인 + 오늘 미기록: 5단계 감정 기록 모달
4. 로그인 + 오늘 이미 기록: "이미 기록됨" 모달 + 마이페이지 바로가기

**UX 개선사항**:
- 모든 클릭 가능 요소에 `cursor-pointer` 적용 (모바일 7개 + PC 5개)
- 미사용 GPS watchPosition 코드 삭제 (실시간 추적 기능 미사용)

---

### 3.2 마이페이지 (`/mypage`)

**접근 권한**: 로그인 필요 (비로그인 시 로그인 UI 표시)

**주요 기능**:
1. **감정 통계**
   - 자주 느끼는 감정 (Top 3)
   - 이번 주 기록 수 (월~일 기준, 변경: 최근 7일 → 이번 주)

2. **최근 감정 기록 목록** (최대 5개)

3. **주간 감정 보고서 버튼**
   - `hasGeminiKey` 체크: 서버에서 `!!process.env.GEMINI_API_KEY` → 클라이언트에 boolean 전달
   - GEMINI_API_KEY 미설정 시 Toast 경고 표시 후 모달 열지 않음

4. **로그아웃 버튼** (`window.confirm()` 확인 후 실행)

5. **PC/모바일 분리 레이아웃** (`lg` 브레이크포인트)
   - 모바일: `lg:hidden pb-20`, 전체 너비, 헤더 `bg-[#5eb3e4]` (스카이블루)
   - PC: `hidden lg:block`
     - 좌측 사이드바 (프로필, 통계, 네비게이션, 로그아웃)
     - 우측 메인 콘텐츠 (자주 느끼는 감정, 7일 그래프, 주간 보고서 CTA, 최근 기록 2컬럼)
     - 추가 통계: 연속 기록 일수 (`streakDays`), 지난주 대비 변화 (`weekDiff`)

6. **Footer 정렬 최적화**
   - `min-h-[calc(100vh-5rem)]` (헤더 높이 5rem 제외)
   - Footer 경계선이 화면 하단과 정확히 일치

7. **상단 카드 그리드 비율** (PC)
   - `grid-cols-9`: 자주 느끼는 감정 (`col-span-3`), 이번 주 (`col-span-4`), 주간 보고서 (`col-span-2`)

**조건부 UI**:

| 요소 | 비로그인 | 로그인 사용자 | 관리자 |
|------|----------|---------------|--------|
| 전체 페이지 | 로그인 UI | 표시 | 표시 |
| 주간 보고서 버튼 | - | "주간 감정 보고서" (GEMINI_API_KEY 필요) | "주간 감정 보고서" + "이번 주 보고서 (테스트)" |

**관리자 전용 기능**:
- "이번 주 보고서 (테스트)" 버튼 (주황색/앰버 테마)
- 저장되지 않는 테스트 보고서 생성
- 테스트 배너 표시 ("이 보고서는 저장되지 않습니다")

---

### 3.3 설정 페이지 (`/mypage/settings`)

**접근 권한**: 로그인 필요 (비로그인 시 `/login`으로 리다이렉트)

**주요 기능**:
- **프로필 설정**:
  - 이메일 (읽기 전용, 카카오 계정 연동)
  - 닉네임 수정 (20자 이내)
  - **성별 선택**: 토글 버튼 2개 (남성/여성), 재클릭 시 해제, 선택 안 해도 됨
  - **연령대 선택**: 토글 버튼 6개 (20대~70대 이상), 3열 그리드, 재클릭 시 해제
  - 저장 버튼 → `upsertProfile()` 호출 (닉네임, 성별, 연령대 함께 저장)
- **계정 정보**: 로그인 방식 (카카오), 가입일 (`created_at` 표시)
- PC/모바일 분리 레이아웃
- **디자인 테마**: 스카이블루 (`#5eb3e4`) 그라데이션 (마이페이지와 통일)
  - 헤더: `bg-[#5eb3e4]`
  - 버튼: `bg-[#5eb3e4] hover:bg-[#4ba0d0]`
- **배경색**: `bg-gray-100` (밝은 회색)
- **Toast 알림** (`showToast()`)
- **상수**: `GENDER_OPTIONS`, `AGE_GROUP_OPTIONS` (`types/user.ts`)

**조건부 UI**: 없음 (로그인 사용자만 접근)

---

### 3.4 기록 페이지 (`/mypage/records`)

**접근 권한**: 로그인 필요 (비로그인 시 `/login`으로 리다이렉트)

**주요 기능**:
- 감정 기록 목록 (최신순)
- EAMRA 정보 표시
  - E: 감정 (Emotion)
  - A: 도움된 행동 (Action)
  - M: 긍정적 변화 (Memory)
  - R: 경험 장소 (Reflection)
  - A: 한 줄 메모 (Appreciation)
- 페이지네이션 (10개/페이지)
- **PC 레이아웃**: 1열 레이아웃 (변경: 2열 → 1열)
- **디자인 테마**: 스카이블루 (`#5eb3e4`) 그라데이션 (마이페이지와 통일)
  - 헤더: `bg-[#5eb3e4]`
  - 버튼: `bg-[#5eb3e4] hover:bg-[#4ba0d0]`
- **배경색**: `bg-gray-100` (밝은 회색)

**조건부 UI**: 없음

---

## 4. 인증 페이지

### 4.1 로그인 (`/login`)

**접근 권한**: 모두

**주요 기능**:
- 카카오 OAuth 로그인 버튼
  - 색상: `bg-[#FEE500] text-[#191919] hover:bg-[#FDD800]` (상수: `BUTTON_STYLES.kakaoLogin`)
- 이용약관/개인정보처리방침 안내
- 회원가입 페이지 링크 (`/join`)

**조건부 UI**: 없음 (선택적: 로그인 상태면 `/mypage`로 리다이렉트)

---

### 4.2 회원가입 (`/join`)

**접근 권한**: 모두

**주요 기능**:
- 카카오 간편 가입 버튼
- 이용약관/개인정보처리방침 동의 안내
- 로그인 페이지 링크 (`/login`)

**조건부 UI**: 없음

---

### 4.3 OAuth 콜백 (`/auth/callback`)

**접근 권한**: 시스템 전용

**주요 기능**:
1. 카카오 OAuth 콜백 처리
2. 세션 생성 (Supabase Auth)
3. 사용자 프로필 저장 (`user_profiles` 테이블)
4. 카카오 닉네임 자동 설정
5. 아바타 URL 저장
6. 리다이렉트
   - `next` 파라미터가 있으면 해당 페이지로
   - 없으면 `/healing`으로

**조건부 UI**: 없음

---

## 5. 관리자 페이지 (Admin)

### 5.1 접근 권한 (공통)

**접근 제어**:
1. 비로그인 → `/login`으로 리다이렉트
2. `is_admin = false` → `/`으로 리다이렉트
3. `is_admin = true` → 접근 가능

**레이아웃**:
- 좌측 사이드바 (`AdminSidebar.tsx`)
  - 메뉴: 대시보드, 오디오 관리, 뉴스 관리, 커뮤니티, 스토어, 회원 관리
  - 현재 경로 하이라이트 (blue 테마)
  - Sub-path 지원 (`pathname.startsWith()`)
- 상단 헤더 (`AdminHeader.tsx`)
  - 관리자명, 사이트 보기, 로그아웃
  - 높이: `h-[72px]`, 타이틀 좌측 패딩: `pl-2`

**모바일 반응형** (6개 관리 페이지):
- 모든 테이블에 `overflow-x-auto` + `min-w-[700~800px]` 적용
- 오디오(800px), 뉴스(700px), 회원(800px), 스토어(750px), 커뮤니티 게시글(750px), 댓글(700px)

**알림 시스템**:
- 모든 관리자 페이지에서 `showToast()` 사용 (Toast 알림)
- 파괴적 작업 확인은 `window.confirm()` 유지 (삭제, 토글 등)
- 8개 관리 페이지에 적용: store, audio, audio/storage, store/categories, community, community/comments, news, members

---

### 5.2 대시보드 (`/admin`)

**주요 기능**:
1. **통계 카드 6개** (3x2 그리드)
   - 뉴스, 제품, 오디오, 게시글, 댓글, 회원 수
   - 카드별 색상: blue, green, cyan, purple, amber, indigo

2. **오늘/이번 주 활동 요약**
   - 새 게시글 (오늘/이번 주)
   - 댓글 (오늘/이번 주)
   - 신규 가입 (오늘/이번 주)

3. **빠른 작업 버튼 4개**
   - 뉴스 추가 (`/admin/news/add`)
   - 제품 추가 (`/admin/store/add`)
   - 오디오 관리 (`/admin/audio`)
   - 회원 관리 (`/admin/members`)

4. **최근 데이터 3열**
   - 최근 게시글 5개
   - 최근 뉴스 5개
   - 최근 가입 회원 5명 (닉네임, 이메일, 가입일)

**Server Actions**:
- `getAdminStats()` - 통계 조회 (`Promise.all`로 12개 쿼리 병렬 실행)
- `getRecentPosts()` - 최근 게시글
- `getRecentNews()` - 최근 뉴스
- `getRecentMembers()` - 최근 가입 회원

**조건부 UI**: 없음 (관리자만 접근)

---

### 5.3 뉴스 관리 (`/admin/news`)

**주요 기능**:
- 뉴스 목록 (제목, 출처, 카테고리, 링크, 게시일, 상태)
- 검색 (제목/출처)
- 카테고리 필터 (전체, 언론보도, 해외자료, 블로그, 보도자료)
- 활성/비활성 토글 (`toggleNewsActive()`)
- 추가 (`/admin/news/add`)
- 수정 (`/admin/news/[id]`)
- 삭제 (soft delete)

**공통 폼 컴포넌트**: `NewsForm.tsx`
- 제목, 출처, 카테고리, 링크, 썸네일 URL, 게시일
- 유효성 검증

**Server Actions**:
- `getAdminNewsArticles()`
- `createNewsArticle()`
- `updateNewsArticle()`
- `deleteNewsArticle()`
- `toggleNewsActive()`

**조건부 UI**: 없음

---

### 5.4 스토어 관리 (`/admin/store`)

**주요 기능**:
1. **제품 목록**
   - 이름, 가격, 카테고리, 평점, 리뷰 수, 상태
   - 검색 (제품명)
   - 동적 카테고리 필터 (`store_categories` 테이블)
   - 활성/비활성 토글 (`toggleProductActive()`)
   - 추가/수정/삭제 (soft delete)

2. **카테고리 관리** (`/admin/store/categories`)
   - 카테고리 CRUD (`store_categories` 테이블)
   - `name`, `description`, `order_index`, `is_active`
   - 연결된 상품 있으면 삭제 차단
   - **완전 동적**: DB만으로 카테고리 추가/삭제 가능

**공통 폼 컴포넌트**: `StoreForm.tsx`
- 상품명, 가격, 원가, 카테고리, 뱃지, 이미지 URL, 네이버 스토어 링크

**Server Actions**:
- `getAdminStoreProducts()`
- `createStoreProduct()`
- `updateStoreProduct()`
- `deleteStoreProduct()`
- `toggleProductActive()`
- `getStoreCategories()` - 동적 카테고리 조회
- `getAdminStoreCategories()` - 관리자용 전체 카테고리
- `createStoreCategory()`
- `updateStoreCategory()`
- `deleteStoreCategory()`

**조건부 UI**: 없음

---

### 5.5 오디오 관리 (`/admin/audio`)

**주요 기능**:
1. **오디오 목록**
   - 순서, 제목 (이모지+파일명), 카테고리 뱃지, 재생시간, 지역 (trail_guide만), 상태, 관리
   - 검색 (제목/설명/길 이름)
   - 동적 카테고리 필터 (`audio_categories` 테이블)
   - 활성/비활성 토글 (`toggleAudioActive()`)
   - 비활성 트랙 `opacity-50` 시각적 구분
   - 15개/페이지 페이지네이션

2. **조건부 필드**
   - trail_guide 선택 시:
     - 도/시군구 드롭다운 (17개 시도, 249개 시군구 - `PROVINCE_CITY_MAP`)
     - province 변경 시 city 초기화
     - 길 이름, 거리, 소요시간, 난이도

3. **파일 선택 드롭다운**
   - 카테고리 선택 시 Storage 파일 목록 자동 로드 (`listAudioFiles()`)
   - 이미 DB에 등록된 파일은 비활성화 표시 (`checkFilesInDb()`)
   - 사용 가능 파일 카운터 (예: "2/5")
   - 선택한 파일 미리듣기 (`<audio controls>`)

4. **추가/수정**
   - `/admin/audio/add`, `/admin/audio/[id]`
   - 공통 폼: `AudioForm.tsx`

**공통 폼 컴포넌트**: `AudioForm.tsx`
- 카테고리, 제목, 설명, 파일명, 이모지, 재생시간, 정렬순서, 세분류
- trail_guide 전용: province, city, trail_name, distance, walking_time, difficulty

**Server Actions**:
- `getAdminAudioTracks()` - 관리자용 전체 오디오 (비활성 포함)
- `createAudioTrack()`
- `updateAudioTrack()`
- `deleteAudioTrack()` - soft delete
- `toggleAudioActive()`
- `getAudioCategories()` - 동적 카테고리 조회
- `getAdminAudioCategories()` - 관리자용 전체 카테고리
- `createAudioCategory()`
- `updateAudioCategory()`
- `deleteAudioCategory()`

**제약사항**:
- 오디오 카테고리: 부분적 동적
  - 기본 필터/라벨은 동적
  - `trail_guide`처럼 특수 UI가 있는 카테고리는 코드 수정 필요

**조건부 UI**: 없음

---

### 5.6 Storage 파일 관리 (`/admin/audio/storage`)

**주요 기능**:
1. **동적 폴더 목록 조회**
   - Supabase Storage에서 실시간 폴더 조회 (`listAudioFolders()`)
   - 폴더별 버튼 렌더링

2. **폴더별 파일 탐색**
   - 파일 목록 테이블: 파일명, 크기, MIME 타입, 업로드일, 관리
   - 오디오 미리보기 (인라인 `<audio>` 플레이어)

3. **Storage-only 업로드**
   - DB 등록 없이 Supabase Storage에 파일만 업로드
   - `uploadAudioFileOnly()` Server Action
   - 오디오 형식 검증 (mp3, wav, ogg, m4a, aac, flac, webm)
   - 최대 50MB
   - 파일명 자동 정규화 (특수문자 → `_`)

4. **파일 삭제**
   - `deleteAudioFile()` Server Action
   - DB 연동 파일은 삭제 차단 (경고 표시)

5. **동적 폴더 관리**
   - 폴더 생성 (`createAudioFolder()`)
     - 폴더명 규칙: 소문자 영문, 숫자, 언더스코어 (`/^[a-z0-9_]+$/`)
     - `.emptyFolderPlaceholder` 패턴
   - 폴더 삭제 (`deleteAudioFolder()`)
     - DB 연동 파일 있으면 차단
   - 인라인 폴더 생성 UI (Enter: 생성, Escape: 취소)

**Server Actions**:
- `listAudioFiles()` - 폴더 내 파일 목록
- `deleteAudioFile()` - 파일 삭제 (DB 연동 확인)
- `uploadAudioFileOnly()` - Storage 전용 업로드
- `listAudioFolders()` - 폴더 목록 조회
- `createAudioFolder()` - 폴더 생성
- `deleteAudioFolder()` - 폴더 삭제

**조건부 UI**: 없음

---

### 5.7 커뮤니티 관리 (`/admin/community`)

**주요 기능**:
1. **게시글 관리** (`/admin/community`)
   - 검색 (제목/내용/작성자)
   - 게시판 필터 (전체, 공지사항, 자유게시판, 이벤트, 힐링 후기)
   - 상태 필터 (전체, 활성, 비활성)
   - 고정/활성 토글 (`togglePinPost()`, `togglePostActive()`)
   - 게시판 뱃지 색상 (에메랄드, 파랑, 앰버, 보라) - 실제 페이지 테마 매칭

2. **댓글 관리** (`/admin/community/comments`)
   - 검색 (내용/작성자)
   - 활성 토글 (`toggleCommentActive()`)

**Server Actions**:
- `getAdminPosts()` - 관리자용 게시글 목록
- `getAdminComments()` - 관리자용 댓글 목록
- `togglePostActive()`
- `toggleCommentActive()`
- `togglePinPost()` - 고정글 설정

**조건부 UI**: 없음

---

### 5.8 회원 관리 (`/admin/members`)

**주요 기능**:
1. **회원 목록 테이블** (7컬럼)
   - 닉네임 (좌측 정렬, `w-44`)
   - 이메일 (좌측 정렬, `max-w-[220px] truncate`)
   - 성별
   - 연령대
   - 가입일
   - 상태 (3단계 역할 뱃지)
   - 관리

2. **검색 및 필터**
   - 닉네임 또는 이메일 검색 (`.or()` 메서드)
   - 필터 (전체, 관리자, 일반 회원) - 인디고 테마
   - 20명/페이지 페이지네이션

3. **역할 관리**
   - **3단계 역할 뱃지**:
     - 대표 (골드, Crown 아이콘)
     - 관리자 (인디고, Shield 아이콘)
     - 일반 (회색)
   - **관리자 임명/해제** (대표만 가능)
     - confirm 다이얼로그
     - 자기 자신 해제 방지
   - **대표 보호**:
     - 환경변수 `SUPER_ADMIN_USER_ID`로 지정
     - 차단/강퇴 불가

4. **회원 상세 모달** (테이블 행 클릭)
   - 프로필 정보 (이메일, 가입일, 성별, 연령대)
   - 활동 통계 (게시글 수, 댓글 수)
   - 차단/강퇴 관리 버튼

5. **2단계 제재 시스템**
   - **차단** (`toggleMemberBlock()`)
     - `user_profiles.is_blocked = true`
     - 글쓰기/댓글 제한 (로그인 가능)
     - `createPost()`, `createComment()`에서 서버사이드 체크
   - **강퇴** (`banMember()`)
     - Supabase Auth ban (`ban_duration: '876600h'`)
     - 로그인 차단
     - Admin Client (`createAdminClient()`) 사용 (service_role 키)
   - **강퇴 해제** (`unbanMember()`)
     - Auth unban (`ban_duration: 'none'`)

6. **제재 제한**
   - 관리자/대표: 차단/강퇴 불가
   - 먼저 관리자 권한 해제 필요

**Server Actions**:
- `getAdminMembers()` - 회원 목록
- `getMemberDetail()` - 회원 상세 정보
- `toggleMemberAdmin()` - 관리자 권한 토글
- `toggleMemberBlock()` - 차단 토글
- `banMember()` - 강퇴 (Auth ban)
- `unbanMember()` - 강퇴 해제 (Auth unban)
- `checkIsSuperAdmin()` - 대표 여부 확인
- `getSuperAdminUserId()` - 대표 ID 조회

**조건부 UI**:

| 요소 | 일반 관리자 | 대표 |
|------|-------------|------|
| 관리자 임명/해제 | 숨김 | 표시 |
| 차단 버튼 | 표시 (단, 관리자/대표는 차단 불가) | 표시 |
| 강퇴 버튼 | 표시 (단, 관리자/대표는 강퇴 불가) | 표시 |

---

## 6. 공통 컴포넌트

### 6.1 Header (`components/layout/Header.tsx`)

**주요 기능**:
1. **로고** (좌측)
2. **네비게이션 메뉴** (데스크톱)
   - 힐링로드ON, 기업 소개, 맨발걷기 정보, NEWS, 스토어, 커뮤니티 (드롭다운), 로그인/마이페이지
3. **커뮤니티 드롭다운**
   - 데스크톱: 마우스 호버 시 드롭다운
   - 모바일: 아코디언 스타일 펼침/접기
   - Framer Motion 애니메이션
4. **현재 페이지 표시**
   - `usePathname()` 훅으로 현재 경로 감지
   - `isActive(href)` 함수로 활성 메뉴 판단
   - 커뮤니티 하위 페이지도 커뮤니티 메뉴 활성화
5. **활성 메뉴 스타일**
   - 데스크톱: 회색 밑줄 (`h-px bg-gray-700`)
   - 모바일: 회색 점 (`●`)
   - Hover: 파란색 텍스트 (`hover:text-blue-500`)
6. **햄버거 메뉴** (모바일)

**조건부 UI**:

| 메뉴 | 비로그인 | 로그인 사용자 |
|------|----------|---------------|
| 로그인/마이페이지 | "로그인" 버튼 (`/login`) | "마이페이지" 버튼 (`/mypage`) |

**전역 상태**: `useAuthStore` (로그인 상태 관리)

---

### 6.2 Footer (`components/layout/Footer.tsx`)

**주요 기능**:
1. **회사 정보**
   - 주소: 강원특별자치도 속초시 관광로 115
   - 문의 이메일: `ceo@withthelake.com`
2. **SNS 링크**
   - Facebook: 위드더레이크 페이지
   - Instagram: `https://www.instagram.com/withwellme/`
   - YouTube: `https://www.youtube.com/channel/UC8vmE6swgfF-PvsVIQUmsOQ/about`
   - 네이버 블로그: `https://blog.naver.com/with_thelake` (`NaverBlogIcon` - N 형태 SVG)
   - 네이버 카페: `https://cafe.naver.com/healingroadon` (`NaverCafeIcon` - 커피컵 형태 SVG)
3. **저작권 표기**: `© 2024`
4. **내부 패딩**: `py-16 md:py-14`

**조건부 UI**: 없음

---

## 7. 모달 시스템

**공통 접근성 속성** (7개 모달):
- `role="dialog"` - 모달 역할 명시
- `aria-modal="true"` - 모달 동작 명시 (뒤쪽 콘텐츠 비활성)
- `aria-label="모달명"` - 스크린리더에서 모달 이름 안내
- Framer Motion `motion.div` 패널 컨테이너에 적용
- 적용 모달: EmotionRecordModal, LoginModal, WalkGuideModal, AffirmationModal, AudioDescriptionModal, TrailMapSelectModal, TrailTextSelectModal

### 7.1 로그인 모달 (`components/modals/LoginModal.tsx`)

**주요 기능**:
- 카카오 OAuth 로그인 버튼
- 로그인 후 기존 페이지 유지 (`redirectTo` 파라미터)
- `returnAction` prop 지원 (로그인 후 수행할 액션 지정, 예: `"emotion"`)
  - 로그인 성공 시 리다이렉트 URL에 `action` 파라미터 포함
  - 힐링로드ON에서 `action=emotion` 감지 → 감정 기록 모달 자동 오픈
- Framer Motion 애니메이션 (backdrop + content)

**애니메이션 상수**: `MODAL_ANIMATION` (backdrop + spring만 적용, content는 `scale: 0.9`)

---

### 7.2 감정 기록 모달 (`components/modals/EmotionRecordModal.tsx`)

**주요 기능**:
- **EAMRA 프레임워크 기반 5단계 멀티스텝 폼**

**Step 1: 감정 선택**
- 6가지 감정: 기쁨, 슬픔, 화남, 불안, 평온, 피곤
- 5단계 강도 선택 (1~5)
- 색상 그라데이션으로 시각화
- 상수: `EMOTION_STEP_COLORS`

**Step 2: 도움된 행동**
- 7가지: 맨발걷기, 명상, 운동, 대화, 휴식, 취미, 기타
- 복수 선택 가능
- 상수: `PRE_EMOTIONS.helpfulActions`

**Step 3: 긍정적 변화**
- 6가지: 스트레스 감소, 기분 전환, 활력 증가, 집중력 향상, 긴장 완화, 숙면
- 복수 선택 가능
- 상수: `PRE_EMOTIONS.positiveChanges`

**Step 4: 경험 장소**
- 7가지: 공원, 산, 해변, 도심, 실내, 기타
- 단일 선택
- 상수: `PRE_EMOTIONS.experienceLocations`

**Step 5: 한 줄 메모**
- 자유 텍스트 입력 (선택)
- 오늘의 감사한 점 기록

**애니메이션**:
- Framer Motion 스텝 전환 (슬라이드 효과)
- 진행바 표시 (1/5, 2/5, ...)
- "이전" 버튼으로 되돌아가기 가능
- 상수: `MODAL_ANIMATION`, `EMOTION_STEP_COLORS`, `GRADIENT_CLASSES`

**중복 체크**:
- 하루에 한 번만 기록 가능
- 이미 기록된 경우 "이미 기록됨" 모달 표시

**Server Action**: `saveEmotionRecord()`

---

### 7.3 주간 감정 보고서 모달 (`components/report/WeeklyEmotionReport.tsx`)

**주요 기능**:
1. **AI 인사이트 생성**
   - OpenAI API (gpt-4o-mini)
   - 프롬프트: 지난주 감정 데이터 요약 + 맞춤형 조언
   - "다시 생성" 버튼 제거 (API 비용 절감)

2. **주간 통계**
   - 기록 일수 (7일 중 N일)
   - 가장 많이 느낀 감정 (Top 1)

3. **차트**
   - 일별 감정 변화 (라인 차트, Chart.js)
   - 감정 분포 (도넛 차트)

4. **ViewMode**
   - `lastWeek`: 지난주 보고서 (저장됨)
   - `thisWeek`: 이번 주 보고서 (테스트, 저장 안 됨)
   - 이번 주 보고서: 주황색/앰버 테마, "이 보고서는 저장되지 않습니다" 배너

**Server Actions**:
- `generateWeeklyReport()` - AI 인사이트 생성
- `getWeekEmotionRecords()` - 지난주 월~일 데이터
- `getCurrentWeekEmotionRecords()` - 이번 주 월~일 데이터

**조건부 UI**:
- 관리자만 "이번 주 보고서 (테스트)" 버튼 표시

---

### 7.4 걷기 안내 모달 (`components/modals/WalkGuideModal.tsx`)

**주요 기능**:
- 12개 걷기 코스 표시
- 각 코스: 제목, 설명, 시간
- Framer Motion staggered animation (0.05s delay)

**애니메이션 상수**: `MODAL_ANIMATION`

---

### 7.5 긍정확언 모달 (`components/modals/AffirmationModal.tsx`)

**주요 기능**:
- 9개 긍정확언 메시지 표시
- Framer Motion staggered animation

**애니메이션 상수**: `MODAL_ANIMATION`

---

### 7.6 길 안내 모달 (`components/modals/TrailSelectModal.tsx`)

**주요 기능**:
- "텍스트로 고르기" / "지도로 고르기" 선택
- 각각 별도 모달 열기

**하위 모달**:
- `TrailTextSelectModal.tsx`
- `TrailMapSelectModal.tsx`

**애니메이션 상수**: `MODAL_ANIMATION`

---

### 7.7 텍스트 길 선택 모달 (`components/modals/TrailTextSelectModal.tsx`)

**주요 기능**:
- 3단계 드롭다운 선택
  1. 도 선택 (17개 시도)
  2. 시군구 선택 (도에 따라 동적 변경)
  3. 길 선택 (시군구에 따라 동적 변경)
- 선택 완료 시 오디오 자동 재생

**Server Action**: `getTrailsByRegion()`

**애니메이션 상수**: `MODAL_ANIMATION`

---

### 7.8 지도 길 선택 모달 (`components/modals/TrailMapSelectModal.tsx`)

**기술 스택**: Leaflet + OpenStreetMap (CartoDB Positron 타일)

**주요 기능**:
1. **GPS 위치 권한 요청**
2. **2단계 폴백**
   - 1차: 고정밀 GPS (8초 timeout)
   - 2차: 네트워크 기반 (10초 timeout)
3. **권한 거부 시 GPS 권한 안내 모달 표시**
4. **3단계 Leaflet 지도 선택**
   1. 전국 뷰 (줌 7) → 시도별 `L.divIcon` 마커 (이름 + 코스 개수)
   2. 시도 마커 클릭 → `map.flyTo()` 시도 확대 (줌 9) → 시군구별 마커
   3. 시군구 마커 클릭 → 하단 패널 슬라이드업 → 길 목록 표시
5. **오디오가 등록된 지역만 파란색 마커 표시** (없으면 회색)
6. **줌/팬 지원**: 핀치줌, 스크롤줌, 드래그 이동
7. **PC용 줌 컨트롤 버튼** (0.5 단위, `hidden lg:flex`)
8. **뷰 전환 시 줌/이동 제한** (`maxBounds`, 동적 `minZoom`, 인터랙션 잠금)
9. **뒤로가기**: `map.flyTo(KOREA_CENTER, MAP_ZOOM.KOREA)` + 마커 교체

**마커 관리**:
- `L.layerGroup`으로 그룹화, `clearLayers()`로 일괄 제거
- 시도 마커: dot 14px, font 13px, 48px 터치 영역
- 시군구 마커: dot 12px, font 12px
- hover 시 점 확대 (`scale(1.4)`)

**연동 훅**: `hooks/useLeafletMap.ts`
- `dynamic import('leaflet')`으로 클라이언트 전용 로드 (SSR 회피)
- 모달 오픈 시 지도 생성, 닫힐 때 지도 제거
- `zoomSnap: 0.1`, `minZoom: 6.5`

**좌표 상수**: `lib/constants/mapCoordinates.ts`
- `KOREA_CENTER` (`{ lat: 36.0, lng: 127.5 }`)
- `PROVINCE_CENTERS` - 17개 시도 중심 좌표
- `CITY_COORDINATES_MAP` - 229개 시군구 좌표

**GPS 권한 안내 모달**:
- 브라우저/OS 감지 (iOS Safari, Android Chrome, Desktop)
- 플랫폼별 맞춤 설정 가이드
  - iOS: 설정 앱 > Safari > 위치
  - Android: 설정 > 앱 > Chrome > 권한
  - Desktop: 주소창 자물쇠 아이콘
- "다시 시도" / "닫기" 버튼
- "텍스트로 고르기" 대안 제공

**Server Action**: `getTrailsByRegion()`

**애니메이션 상수**: `MODAL_ANIMATION`

---

### 7.9 오디오 상세보기 모달 (`components/modals/AudioDescriptionModal.tsx`)

**주요 기능**:
- 오디오 제목, 설명, 재생시간 표시
- "재생" 버튼 (모달 닫고 오디오 재생)

**애니메이션 상수**: `MODAL_ANIMATION` (backdrop + spring만, content는 `scale: 0.9`)

---

### 7.10 이미 기록됨 모달 (`components/modals/AlreadyRecordedModal.tsx`)

**주요 기능**:
- 오늘 이미 감정 기록했음을 알림
- "마이페이지로 이동" 버튼

**애니메이션 상수**: `MODAL_ANIMATION`

---

## 8. UX 시스템

### 8.1 Toast 알림 시스템

**구현 파일**:
- `components/ui/Toast.tsx`
- `hooks/useToast.ts`

**주요 기능**:
- Zustand 전역 상태 관리
- `showToast(message, type)` 함수
- 3가지 타입: success (초록), error (빨강), warning (노랑)
- 자동 사라짐 (3초)
- Framer Motion slide-in 애니메이션 (우측 상단)
- 여러 개 동시 표시 가능 (스택)

**사용 예시**:
```typescript
import { useToast } from '@/hooks/useToast';

const { showToast } = useToast();

showToast('감정이 기록되었습니다!', 'success');
showToast('로그인이 필요합니다.', 'error');
showToast('이미 기록된 날짜입니다.', 'warning');
```

**적용 파일**:
- `EmotionRecordSheet.tsx` - 감정 기록 저장 성공/실패
- `SettingsClient.tsx` - 프로필 저장 성공/실패
- 관리자 페이지 8개: `store/page.tsx`, `audio/page.tsx`, `audio/storage/page.tsx`, `store/categories/page.tsx`, `community/page.tsx`, `community/comments/page.tsx`, `news/page.tsx`, `members/page.tsx`

---

### 8.2 스켈레톤 로딩

**구현 파일**: `components/ui/Skeleton.tsx`

**주요 기능**:
- Perceived Performance (체감 성능) 향상
- 데이터 로딩 전 구조 미리 보여줌
- `animate-pulse` 애니메이션

**페이지별 전용 스켈레톤**:
- `ReviewCardSkeleton` / `ReviewListSkeleton` - 후기 게시판
- `BoardRowSkeleton` / `BoardListSkeleton` - 공지사항/자유게시판 (테이블형)
- `GalleryCardSkeleton` / `GalleryListSkeleton` - 이벤트 (갤러리형)
- `PostDetailSkeleton` / `CommentSkeleton` - 게시글 상세
- `NewsCardSkeleton` / `ProductCardSkeleton` - 뉴스/스토어

**Suspense 연동**:
```typescript
<Suspense fallback={<ReviewListSkeleton />}>
  <ReviewList />
</Suspense>
```

**적용 페이지**:
- `/community/review` - ReviewListSkeleton
- `/community/notice` - BoardListSkeleton
- `/community/free` - BoardListSkeleton
- `/community` (공지사항 직접 렌더링) - BoardListSkeleton
- `/community/event` - GalleryListSkeleton
- `/community/notice/[id]`, `/community/free/[id]`, `/community/event/[id]`, `/community/review/[id]` - PostDetailSkeleton
- `/news` - NewsListSkeleton (Suspense 스트리밍 패턴: 히어로 즉시 렌더링 + 목록 스트리밍)
- `/store` - ProductListSkeleton (Suspense 스트리밍 패턴: 히어로 즉시 렌더링 + 목록 스트리밍)

---

### 8.3 Lazy Loading

**구현 파일**: `components/ui/LazyImage.tsx`

**주요 기능**:
- Intersection Observer API 활용
- 뷰포트에 들어올 때만 이미지 로드
- 스켈레톤 → 페이드인 애니메이션
- 에러 시 fallback 이미지

**컴포넌트**:
- `LazyImage` - 기본 lazy loading
- `ThumbnailImage` - 목록 썸네일용
- `AvatarImage` - 프로필 이미지용

**사용 예시**:
```typescript
<ThumbnailImage
  src={post.images[0]}
  alt={post.title}
  className="w-full h-48 object-cover"
/>
```

**적용 파일**:
- `ReviewList.tsx`

---

### 8.4 이미지 자동 압축

**구현 파일**: `lib/utils/imageCompression.ts`

**주요 기능**:
- `browser-image-compression` 라이브러리 사용
- 최대 1MB, 1920px로 자동 리사이징
- 업로드 전 클라이언트 사이드 압축
- 백그라운드 압축 (`useWebWorker: true`)
- 압축률 콘솔 로그 출력

**압축 옵션**:
```typescript
{
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
}
```

**함수**:
- `compressImage(file)` - 단일 이미지 압축
- `compressImages(files)` - 여러 이미지 병렬 압축
- `formatFileSize(bytes)` - 파일 크기 포맷팅

**적용 파일**:
- `WriteForm.tsx` - 갤러리 이미지 업로드
- `WriteForm.tsx` - 인라인 이미지 삽입

**압축 결과**:
- 5MB JPEG → 800KB (84% 감소)
- 10MB PNG → 1.2MB (88% 감소)

---

### 8.5 이미지 라이트박스

**구현 위치**: `components/community/PostDetail.tsx` (인라인)

**주요 기능**:
- 클릭 시 full-screen 오버레이
- ESC 키로 닫기
- 배경 클릭으로 닫기
- 원본 크기로 표시

**구현 코드**:
```typescript
const [lightboxOpen, setLightboxOpen] = useState(false);
const [lightboxImage, setLightboxImage] = useState('');

// ESC 키 이벤트
useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setLightboxOpen(false);
  };
  window.addEventListener('keydown', handleEsc);
  return () => window.removeEventListener('keydown', handleEsc);
}, []);
```

---

## 9. 백그라운드 작업

### 9.1 Vercel Cron (30일 데이터 정리)

**목적**:
- GDPR 준수 (삭제 요청 후 30일 내 완전 삭제)
- DB 용량 관리 (soft-deleted 데이터 자동 정리)

**구현 파일**:
- `vercel.json` - Cron 스케줄 설정
- `app/api/cron/cleanup/route.ts` - API Route
- `actions/cleanupActions.ts` - Server Actions

**Cron 스케줄**:
```json
{
  "crons": [{
    "path": "/api/cron/cleanup",
    "schedule": "0 18 * * *"  // 매일 18:00 UTC (03:00 KST)
  }]
}
```

**API Route 인증**:
- `CRON_SECRET` 환경변수로 인증 체크
- 로컬 개발 환경에서는 인증 스킵
- 최대 실행 시간 60초

**Server Actions**:
1. `cleanupOldDeletedData()`
   - 30일 지난 soft-deleted 데이터 찾기
   - 댓글 먼저 삭제 (FK 제약)
   - 게시글 삭제
   - 삭제 결과 반환

2. `getPendingDeletionStats()`
   - 삭제 대기 중인 데이터 현황 조회 (관리자용)

**대상 데이터**:
- `community_posts` (is_active = false)
- `community_comments` (is_active = false)

**플로우**:
```
매일 03:00 KST
  ↓
Vercel Cron 실행
  ↓
/api/cron/cleanup 호출
  ↓
30일 지난 데이터 찾기
  ↓
댓글 삭제 → 게시글 삭제
  ↓
결과 로그 반환
```

---

## 10. Server Actions

### 10.1 Server Actions 목록

**구현 위치**: `actions/` 디렉토리 (11개 파일)

| 파일 | 주요 함수 | 설명 |
|------|----------|------|
| `adminActions.ts` | `getAdminStats()`, `getRecentPosts()`, `getRecentNews()`, `getRecentMembers()`, `toggleMemberAdmin()`, `toggleMemberBlock()`, `banMember()`, `unbanMember()`, `getMemberDetail()` | 관리자 대시보드, 회원 관리, 차단/강퇴 |
| `audioActions.ts` | `getAudioTracks()`, `getAdminAudioTracks()`, `createAudioTrack()`, `updateAudioTrack()`, `deleteAudioTrack()`, `toggleAudioActive()`, `listAudioFiles()`, `deleteAudioFile()`, `uploadAudioFileOnly()`, `listAudioFolders()`, `createAudioFolder()`, `deleteAudioFolder()` | 오디오 조회 + 관리자 CRUD + Storage 관리 |
| `cleanupActions.ts` | `cleanupOldDeletedData()`, `getPendingDeletionStats()` | 30일 데이터 정리 (Vercel Cron) |
| `communityActions.ts` | `getPosts()`, `getPost()`, `createPost()`, `updatePost()`, `deletePost()`, `createComment()`, `deleteComment()`, `togglePostActive()`, `toggleCommentActive()`, `togglePinPost()`, `getAdminPosts()`, `getAdminComments()` | 게시판 CRUD + 관리자 Actions |
| `emotionActions.ts` | `saveEmotionRecord()`, `getEmotionRecords()`, `getWeekEmotionRecords()`, `getCurrentWeekEmotionRecords()`, `checkTodayRecord()` | 감정 기록 CRUD |
| `imageActions.ts` | `uploadCommunityImage()`, `deleteCommunityImage()` | 커뮤니티 이미지 업로드/삭제 |
| `newsActions.ts` | `getNewsArticles()`, `getNewsArticle()`, `getAdminNewsArticles()`, `createNewsArticle()`, `updateNewsArticle()`, `deleteNewsArticle()`, `toggleNewsActive()` | 뉴스 CRUD + 관리자 Actions |
| `profileActions.ts` | `checkIsAdmin()`, `checkIsSuperAdmin()`, `getSuperAdminUserId()` | 사용자 프로필 관리, 권한 체크 |
| `reportActions.ts` | `generateWeeklyReport()` | 주간 보고서 (AI 인사이트, OpenAI) |
| `storeActions.ts` | `getStoreProducts()`, `getStoreProduct()`, `getProductsForSelect()`, `updateProductRating()`, `getStoreCategories()`, `getAdminStoreProducts()`, `getAdminStoreCategories()`, `createStoreProduct()`, `updateStoreProduct()`, `deleteStoreProduct()`, `toggleProductActive()`, `createStoreCategory()`, `updateStoreCategory()`, `deleteStoreCategory()` | 스토어 CRUD + 관리자 Actions + 동적 카테고리 |
| `trailActions.ts` | `getTrailsByRegion()` | 길 안내 데이터 조회 |

### 10.2 공통 패턴

**인증 체크**:
```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) return { error: 'login_required' };
```

**관리자 체크**:
```typescript
const isAdmin = await checkIsAdmin();
if (!isAdmin) return { error: 'unauthorized' };
```

**유효성 검증**:
```typescript
if (!VALID_VALUES.includes(value)) {
  return { error: 'invalid_value' };
}
```

**캐시 재검증**:
```typescript
import { revalidatePath } from 'next/cache';

// 데이터 변경 후
revalidatePath('/mypage');
```

---

## 11. 데이터 정책

### 11.1 30일 보관 정책

**정책**:
1. 삭제 요청 시 `is_active = false`로 soft delete
2. 30일 후 Vercel Cron으로 hard delete
3. 사용자 실수 복구 가능 기간 확보

**대상 데이터**:
- 커뮤니티 게시글 (`community_posts`)
- 커뮤니티 댓글 (`community_comments`)

**복구**:
- 30일 이내 관리자 요청 시 복구 가능 (`is_active = true`)

**자동화**:
- Vercel Cron (매일 03:00 KST)
- `/api/cron/cleanup` 호출
- `cleanupOldDeletedData()` 실행

---

*마지막 업데이트: 2026-02-13*
*상태: Phase 1-9 완료, 모든 기능 반영*
*문서 버전: 2.1*
