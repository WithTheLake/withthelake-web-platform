import Link from 'next/link'
import { Newspaper, ShoppingBag, FileText, MessageCircle, Users, ChevronRight } from 'lucide-react'
import { StatCard } from '@/components/admin/StatCard'
import { getAdminStats, getRecentPosts, getRecentNews } from '@/actions/adminActions'
import { formatDate } from '@/lib/utils/format'
import { getBoardLabel } from '@/lib/constants/community'

export default async function AdminDashboardPage() {
  const [statsResult, postsResult, newsResult] = await Promise.all([
    getAdminStats(),
    getRecentPosts(5),
    getRecentNews(5),
  ])

  const stats = statsResult.data || {
    newsCount: 0,
    productCount: 0,
    postCount: 0,
    commentCount: 0,
    userCount: 0,
  }

  const recentPosts = postsResult.data || []
  const recentNews = newsResult.data || []

  return (
    <div className="space-y-8">
      {/* 페이지 제목 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-500 mt-1">WithTheLake 관리자 페이지에 오신 것을 환영합니다.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
          href="#"
          color="pink"
        />
      </div>

      {/* 최근 데이터 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <span className="text-xs text-gray-400 ml-4">
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
                    <span className="text-xs text-gray-400 ml-4">
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
      </div>
    </div>
  )
}
