'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { createStoreProduct, updateStoreProduct, type StoreProduct } from '@/actions/storeActions'

interface StoreFormProps {
  product?: StoreProduct
  mode: 'add' | 'edit'
}

const CATEGORIES = ['케어', '어싱', '체험']
const BADGES = ['베스트', '인기', '추천', '신상품', '할인']

export function StoreForm({ product, mode }: StoreFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(product?.name || '')
  const [price, setPrice] = useState(product?.price?.toString() || '')
  const [originalPrice, setOriginalPrice] = useState(product?.original_price?.toString() || '')
  const [category, setCategory] = useState(product?.category || '케어')
  const [badge, setBadge] = useState(product?.badge || '')
  const [imageUrl, setImageUrl] = useState(product?.image_url || '')
  const [naverUrl, setNaverUrl] = useState(product?.naver_product_url || '')
  const [description, setDescription] = useState(product?.description || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('price', price)
    if (originalPrice) formData.append('original_price', originalPrice)
    formData.append('category', category)
    if (badge) formData.append('badge', badge)
    if (imageUrl) formData.append('image_url', imageUrl)
    if (naverUrl) formData.append('naver_product_url', naverUrl)
    if (description) formData.append('description', description)

    try {
      let result
      if (mode === 'add') {
        result = await createStoreProduct(formData)
      } else {
        result = await updateStoreProduct(product!.id, formData)
      }

      if (result.success) {
        router.push('/admin/store')
        router.refresh()
      } else {
        setError(result.message || '저장에 실패했습니다.')
      }
    } catch (err) {
      setError('오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPriceInput = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '')
    return numbers
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/store"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'add' ? '제품 추가' : '제품 수정'}
          </h1>
          <p className="text-gray-500 mt-1">
            {mode === 'add' ? '새로운 제품을 등록합니다.' : '제품 정보를 수정합니다.'}
          </p>
        </div>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 기본 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <h2 className="font-semibold text-gray-900">기본 정보</h2>

              {/* 상품명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상품명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="상품명을 입력하세요"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상품 설명
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="상품 설명을 입력하세요"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                />
              </div>

              {/* 가격 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    판매가 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(formatPriceInput(e.target.value))}
                      placeholder="0"
                      required
                      className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      원
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    원가 (할인 표시용)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(formatPriceInput(e.target.value))}
                      placeholder="0"
                      className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      원
                    </span>
                  </div>
                </div>
              </div>

              {/* 네이버 스토어 URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  네이버 스토어 URL
                </label>
                <input
                  type="url"
                  value={naverUrl}
                  onChange={(e) => setNaverUrl(e.target.value)}
                  placeholder="https://smartstore.naver.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* 오른쪽: 분류 및 이미지 */}
          <div className="space-y-6">
            {/* 카테고리 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">카테고리</h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                      category === cat
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 뱃지 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">뱃지</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setBadge('')}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    !badge
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  없음
                </button>
                {BADGES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBadge(b)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                      badge === b
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* 이미지 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">상품 이미지</h2>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="이미지 URL을 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              {imageUrl ? (
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                  <Image
                    src={imageUrl}
                    alt="상품 미리보기"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    onError={() => {
                      setImageUrl('')
                    }}
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-300" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/store"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save size={18} />
                {mode === 'add' ? '등록' : '저장'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
