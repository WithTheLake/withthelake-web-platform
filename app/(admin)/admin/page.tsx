import Link from 'next/link'
import {
  Newspaper, ShoppingBag, FileText, MessageCircle, Users,
  Music, ChevronRight, Plus, TrendingUp, Calendar, UserPlus,
} from 'lucide-react'
import { StatCard } from '@/components/admin/StatCard'
import { getAdminStats, getRecentPosts, getRecentNews, getRecentMembers } from '@/actions/adminActions'
import { formatDate } from '@/lib/utils/format'
import { getBoardLabel } from '@/lib/constants/community'

export default async function AdminDashboardPage() {
  const [statsResult, postsResult, newsResult, membersResult] = await Promise.all([
    getAdminStats(),
    getRecentPosts(5),
    getRecentNews(5),
    getRecentMembers(5),
  ])

  const stats = statsResult.data || {
    newsCount: 0,
    productCount: 0,
    postCount: 0,
    commentCount: 0,
    userCount: 0,
    audioCount: 0,
    todayPosts: 0,
    todayComments: 0,
    todayUsers: 0,
    weekPosts: 0,
    weekComments: 0,
    weekUsers: 0,
  }

  const recentPosts = postsResult.data || []
  const recentNews = newsResult.data || []
  const recentMembers = membersResult.data || []

  return (
    <div className="space-y-8">
      {/* 페이지 제목 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-500 mt-1">WithTheLake 관리자 페이지에 오신 것을 환영합니다.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="뉴스"
          value={stats.newsCount}
          icon={Newspaper}
          href="/admin/news"
          color="blue"
        />
        <StatCard
          title="제품"
          value={stats.productCount}
          icon={ShoppingBag}
          href="/admin/store"
          color="green"
        />
        <StatCard
          title="오디오"
          value={stats.audioCount}
          icon={Music}
          href="/admin/audio"
          color="cyan"
        />
        <StatCard
          title="게시글"
          value={stats.postCount}
          icon={FileText}
          href="/admin/community"
          color="purple"
        />
        <StatCard
          title="댓글"
          value={stats.commentCount}
          icon={MessageCircle}
          href="/admin/community/comments"
          color="orange"
        />
        <StatCard
          title="회원"
          value={stats.userCount}
          icon={Users}
          href="/admin/members"
          color="pink"
        />
      </div>

      {/* 오늘/이번 주 활동 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 오늘 활동 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Calendar size={20} className="text-amber-600" />
            </div>
            <h2 className="font-semibold text-gray-900">오늘 활동</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.todayPosts}</p>
              <p className="text-xs text-gray-500 mt-1">새 게시글</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.todayComments}</p>
              <p className="text-xs text-gray-500 mt-1">새 댓글</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.todayUsers}</p>
              <p className="text-xs text-gray-500 mt-1">신규 가입</p>
            </div>
          </div>
        </div>

        {/* 이번 주 활동 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
            <h2 className="font-semibold text-gray-900">이번 주 활동</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.weekPosts}</p>
              <p className="text-xs text-gray-500 mt-1">게시글</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.weekComments}</p>
              <p className="text-xs text-gray-500 mt-1">댓글</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.weekUsers}</p>
              <p className="text-xs text-gray-500 mt-1">신규 가입</p>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 작업 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">빠른 작업</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/news/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            뉴스 추가
          </Link>
          <Link
            href="/admin/store/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            제품 추가
          </Link>
          <Link
            href="/admin/audio"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 transition-colors text-sm font-medium"
          >
            <Music size={16} />
            오디오 관리
          </Link>
          <Link
            href="/admin/members"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium"
          >
            <Users size={16} />
            회원 관리
          </Link>
        </div>
      </div>

      {/* 최근 데이터 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 최근 게시글 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">최근 게시글</h2>
            <Link
              href="/admin/community"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              전체 보기
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentPosts.length > 0 ? (
              recentPosts.map((post: any) => (
                <div key={post.id} className="px-6 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {post.author_nickname || '익명'} · {getBoardLabel(post.board_type)}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 ml-4 shrink-0">
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500 text-sm">
                게시글이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 최근 뉴스 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">최근 뉴스</h2>
            <Link
              href="/admin/news"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              전체 보기
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentNews.length > 0 ? (
              recentNews.map((news: any) => (
                <div key={news.id} className="px-6 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {news.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {news.source} · {news.category}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 ml-4 shrink-0">
                      {formatDate(news.published_at)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500 text-sm">
                뉴스가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 최근 가입 회원 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">최근 가입 회원</h2>
            <Link
              href="/admin/members"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              전체 보기
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentMembers.length > 0 ? (
              recentMembers.map((member: any) => (
                <div key={member.user_id} className="px-6 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserPlus size={14} className="text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.nickname || '닉네임 없음'}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {member.is_admin && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-medium">
                              관리자
                            </span>
                          )}
                          {member.is_blocked && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-medium">
                              차단됨
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 ml-4 shrink-0">
                      {formatDate(member.created_at)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500 text-sm">
                가입한 회원이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
