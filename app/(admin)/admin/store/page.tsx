'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit2, Trash2, ExternalLink, Eye, EyeOff, Star } from 'lucide-react'
import { getAdminStoreProducts, deleteStoreProduct, toggleProductActive, getStoreCategories, type StoreProduct } from '@/actions/storeActions'
import { formatDate } from '@/lib/utils/format'
import { getBadgeStyle } from '@/lib/constants/store'

const ITEMS_PER_PAGE = 10

export default function AdminStorePage() {
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState('전체')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // 동적 카테고리
  const [categories, setCategories] = useState<string[]>(['전체'])

  useEffect(() => {
    getStoreCategories().then(setCategories)
  }, [])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const fetchProducts = async () => {
    setIsLoading(true)
    const result = await getAdminStoreProducts({
      category: category !== '전체' ? category : undefined,
      search: search || undefined,
      limit: ITEMS_PER_PAGE,
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
    })
    setProducts(result.data)
    setTotalCount(result.count)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [category, currentPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 상품을 삭제하시겠습니까?`)) return

    const result = await deleteStoreProduct(id)
    if (result.success) {
      fetchProducts()
    } else {
      alert(result.message || '삭제에 실패했습니다.')
    }
  }

  const handleToggleActive = async (id: string, name: string, currentActive: boolean) => {
    const message = currentActive
      ? `"${name}" 제품을 숨기시겠습니까?\n웹사이트에서 보이지 않게 됩니다.`
      : `"${name}" 제품을 다시 공개하시겠습니까?\n웹사이트에 다시 보이게 됩니다.`
    if (!confirm(message)) return

    const result = await toggleProductActive(id, !currentActive)
    if (result.success) {
      fetchProducts()
    } else {
      alert(result.message || '상태 변경에 실패했습니다.')
    }
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div className="flex items-center justify-between pl-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">제품 관리</h1>
          <p className="text-gray-500 mt-1">총 {totalCount}개의 제품</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/store/categories"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            카테고리 관리
          </Link>
          <Link
            href="/admin/store/add"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            제품 추가
          </Link>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat)
                  setCurrentPage(1)
                }}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  category === cat
                    ? 'bg-green-600 text-white'
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
                placeholder="상품명 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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

      {/* 상품 목록 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                상품
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                카테고리
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                가격
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                평점
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
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  등록된 상품이 없습니다.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt=""
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {product.name}
                          </span>
                          {product.badge && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${getBadgeStyle(product.badge)}`}>
                              {product.badge}
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="block text-xs text-gray-400 line-through">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-700">{product.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({product.review_count})</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(product.id, product.name, product.is_active)}
                      className={`inline-flex items-center gap-1 p-1 rounded transition-colors ${
                        product.is_active
                          ? 'text-green-600 hover:text-green-800 hover:bg-green-50'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      }`}
                      title={product.is_active ? '클릭하여 숨기기' : '클릭하여 공개하기'}
                    >
                      {product.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {product.naver_product_url && (
                        <a
                          href={product.naver_product_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-500 hover:text-green-600 transition-colors"
                          title="네이버 스토어"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                      <Link
                        href={`/admin/store/${product.id}`}
                        className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                        title="수정"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
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
                    ? 'bg-green-600 text-white'
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
