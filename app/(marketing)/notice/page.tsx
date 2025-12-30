import Link from 'next/link'
import { Bell, Pin, ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata = {
  title: '공지사항 - WithTheLake',
  description: '위드더레이크의 새로운 소식과 공지사항을 확인하세요.',
}

// 샘플 공지사항 데이터
const notices = [
  {
    id: 1,
    title: '힐링로드 ON 서비스 정식 오픈 안내',
    date: '2024-12-30',
    isPinned: true,
    category: '서비스',
    views: 1542,
  },
  {
    id: 2,
    title: '2025년 새해 맞이 이벤트 안내',
    date: '2024-12-28',
    isPinned: true,
    category: '이벤트',
    views: 892,
  },
  {
    id: 3,
    title: '강원도 철원 맨발걷기길 겨울철 운영 안내',
    date: '2024-12-20',
    isPinned: false,
    category: '운영',
    views: 654,
  },
  {
    id: 4,
    title: '앱 업데이트 안내 (v1.2.0)',
    date: '2024-12-15',
    isPinned: false,
    category: '업데이트',
    views: 423,
  },
  {
    id: 5,
    title: '개인정보처리방침 개정 안내',
    date: '2024-12-01',
    isPinned: false,
    category: '정책',
    views: 312,
  },
  {
    id: 6,
    title: '고객센터 운영 시간 변경 안내',
    date: '2024-11-25',
    isPinned: false,
    category: '운영',
    views: 287,
  },
  {
    id: 7,
    title: '철원군과 맨발걷기 활성화 MOU 체결',
    date: '2024-11-20',
    isPinned: false,
    category: '소식',
    views: 521,
  },
  {
    id: 8,
    title: '11월 정기 서버 점검 안내',
    date: '2024-11-15',
    isPinned: false,
    category: '운영',
    views: 198,
  },
]

export default function NoticePage() {
  const pinnedNotices = notices.filter((n) => n.isPinned)
  const regularNotices = notices.filter((n) => !n.isPinned)

  return (
    <div className="min-h-screen bg-white">
      {/* 페이지 타이틀 */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">공지사항</h1>
          <p className="mt-2 text-gray-600">
            위드더레이크의 새로운 소식과 중요한 안내사항입니다.
          </p>
        </div>
      </section>

      {/* 게시판 테이블 */}
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 게시판 정보 */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              총 <span className="font-semibold text-gray-900">{notices.length}</span>건
            </p>
          </div>

          {/* 테이블 헤더 */}
          <div className="hidden md:grid grid-cols-12 gap-4 py-3 px-4 bg-gray-100 border-t-2 border-gray-800 text-sm font-medium text-gray-700">
            <div className="col-span-1 text-center">번호</div>
            <div className="col-span-7">제목</div>
            <div className="col-span-2 text-center">작성일</div>
            <div className="col-span-2 text-center">조회수</div>
          </div>

          {/* 공지 리스트 */}
          <div className="border-t-2 border-gray-800 md:border-t-0">
            {/* 고정 공지 */}
            {pinnedNotices.map((notice) => (
              <div
                key={notice.id}
                className="grid grid-cols-12 gap-4 py-4 px-4 border-b border-gray-200 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                {/* 번호 - PC */}
                <div className="hidden md:flex col-span-1 items-center justify-center">
                  <Pin size={16} className="text-blue-600" />
                </div>

                {/* 제목 */}
                <div className="col-span-12 md:col-span-7">
                  <div className="flex items-center gap-2">
                    <Pin size={14} className="text-blue-600 md:hidden flex-shrink-0" />
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white mr-2">
                      공지
                    </span>
                    <span className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                      {notice.title}
                    </span>
                  </div>
                  {/* 모바일 정보 */}
                  <div className="flex items-center gap-3 mt-1 md:hidden text-xs text-gray-500">
                    <span>{notice.date}</span>
                    <span>조회 {notice.views.toLocaleString()}</span>
                  </div>
                </div>

                {/* 작성일 - PC */}
                <div className="hidden md:flex col-span-2 items-center justify-center text-sm text-gray-600">
                  {notice.date}
                </div>

                {/* 조회수 - PC */}
                <div className="hidden md:flex col-span-2 items-center justify-center text-sm text-gray-600">
                  {notice.views.toLocaleString()}
                </div>
              </div>
            ))}

            {/* 일반 공지 */}
            {regularNotices.map((notice, index) => (
              <div
                key={notice.id}
                className="grid grid-cols-12 gap-4 py-4 px-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {/* 번호 - PC */}
                <div className="hidden md:flex col-span-1 items-center justify-center text-sm text-gray-600">
                  {regularNotices.length - index}
                </div>

                {/* 제목 */}
                <div className="col-span-12 md:col-span-7">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                      {notice.title}
                    </span>
                  </div>
                  {/* 모바일 정보 */}
                  <div className="flex items-center gap-3 mt-1 md:hidden text-xs text-gray-500">
                    <span>{notice.date}</span>
                    <span>조회 {notice.views.toLocaleString()}</span>
                  </div>
                </div>

                {/* 작성일 - PC */}
                <div className="hidden md:flex col-span-2 items-center justify-center text-sm text-gray-600">
                  {notice.date}
                </div>

                {/* 조회수 - PC */}
                <div className="hidden md:flex col-span-2 items-center justify-center text-sm text-gray-600">
                  {notice.views.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex items-center gap-1">
              <button
                className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                <ChevronLeft size={18} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center bg-gray-800 text-white rounded font-medium text-sm">
                1
              </button>
              <button className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-sm text-gray-700">
                2
              </button>
              <button className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-sm text-gray-700">
                3
              </button>
              <button className="p-2 border border-gray-300 rounded hover:bg-gray-100">
                <ChevronRight size={18} />
              </button>
            </nav>
          </div>

          {/* 검색 */}
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2 w-full max-w-md">
              <select className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white">
                <option>제목</option>
                <option>내용</option>
                <option>제목+내용</option>
              </select>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-5 py-2 bg-gray-800 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors">
                검색
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
