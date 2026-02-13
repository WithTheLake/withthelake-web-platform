'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Search, Edit2, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { getAdminNewsArticles, deleteNewsArticle, toggleNewsActive, type NewsArticle } from '@/actions/newsActions'
import { formatDate } from '@/lib/utils/format'

const ITEMS_PER_PAGE = 10
const CATEGORIES = ['전체', '언론보도', '해외자료', '블로그', '보도자료']

export default function AdminNewsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [news, setNews] = useState<NewsArticle[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState(searchParams.get('category') || '전체')
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1)

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const fetchNews = async () => {
    setIsLoading(true)
    const result = await getAdminNewsArticles({
      category: category !== '전체' ? category : undefined,
      search: search || undefined,
      limit: ITEMS_PER_PAGE,
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
    })
    setNews(result.data)
    setTotalCount(result.count)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchNews()
  }, [category, currentPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchNews()
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 뉴스를 삭제하시겠습니까?`)) return

    const result = await deleteNewsArticle(id)
    if (result.success) {
      fetchNews()
    } else {
      alert(result.message || '삭제에 실패했습니다.')
    }
  }

  const handleToggleActive = async (id: string, title: string, currentActive: boolean) => {
    const message = currentActive
      ? `"${title}" 뉴스를 숨기시겠습니까?\n웹사이트에서 보이지 않게 됩니다.`
      : `"${title}" 뉴스를 다시 공개하시겠습니까?\n웹사이트에 다시 보이게 됩니다.`
    if (!confirm(message)) return

    const result = await toggleNewsActive(id, !currentActive)
    if (result.success) {
      fetchNews()
    } else {
      alert(result.message || '상태 변경에 실패했습니다.')
    }
  }

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case '언론보도': return 'bg-blue-100 text-blue-800'
      case '해외자료': return 'bg-green-100 text-green-800'
      case '블로그': return 'bg-purple-100 text-purple-800'
      case '보도자료': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div className="flex items-center justify-between pl-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">뉴스 관리</h1>
          <p className="text-gray-500 mt-1">총 {totalCount}개의 뉴스</p>
        </div>
        <Link
          href="/admin/news/add"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          뉴스 추가
        </Link>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 카테고리 필터 */}
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat)
                  setCurrentPage(1)
                }}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 검색 */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="제목 또는 출처 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              검색
            </button>
          </form>
        </div>
      </div>

      {/* 뉴스 목록 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                카테고리
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                출처
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                게시일
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                상태
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  로딩 중...
                </td>
              </tr>
            ) : news.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  뉴스가 없습니다.
                </td>
              </tr>
            ) : (
              news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 flex-shrink-0 rounded overflow-hidden bg-gray-100 relative">
                        {item.thumbnail_url ? (
                          <Image
                            src={item.thumbnail_url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadgeColor(item.category)}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 text-center">
                    {item.source}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 text-center">
                    {formatDate(item.published_at)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(item.id, item.title, item.is_active)}
                      className={`inline-flex items-center gap-1 p-1 rounded transition-colors ${
                        item.is_active
                          ? 'text-green-600 hover:text-green-800 hover:bg-green-50'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      }`}
                      title={item.is_active ? '클릭하여 숨기기' : '클릭하여 공개하기'}
                    >
                      {item.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                        title="원문 보기"
                      >
                        <ExternalLink size={18} />
                      </a>
                      <Link
                        href={`/admin/news/${item.id}`}
                        className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                        title="수정"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
                        title="삭제"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
