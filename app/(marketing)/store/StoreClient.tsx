'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Star } from 'lucide-react'
import type { StoreProduct } from '@/actions/storeActions'
import { STORE_CATEGORIES, NAVER_STORE_URL, getBadgeStyle } from '@/lib/constants'

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR')
}

interface StoreClientProps {
  products: StoreProduct[]
}

export default function StoreClient({ products }: StoreClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('전체')

  // 카테고리별 필터링
  const filteredProducts = selectedCategory === '전체'
    ? products
    : products.filter(product => product.category === selectedCategory)

  return (
    <>
      {/* 카테고리 필터 */}
      <section className="py-6 bg-white sticky top-16 md:top-20 z-30 border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {STORE_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 상품 그리드 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">해당 카테고리의 상품이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => {
                // 네이버스토어 상품 링크 생성
                const productUrl = product.naver_product_url || NAVER_STORE_URL

                return (
                  <Link
                    key={product.id}
                    href={productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1"
                  >
                    <article>
                      {/* 상품 이미지 */}
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingBag size={48} className="text-gray-300" />
                          </div>
                        )}

                        {/* 뱃지 */}
                        {product.badge && (
                          <span
                            className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold ${getBadgeStyle(product.badge)}`}
                          >
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* 상품 정보 */}
                      <div className="p-4">
                        <span className="text-xs text-gray-500 mb-1 block">
                          {product.category}
                        </span>
                        <h3 className="font-medium text-gray-900 text-sm md:text-base mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {product.name}
                        </h3>

                        {/* 평점 */}
                        <div className="flex items-center gap-1 mb-2">
                          <Star size={14} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {product.rating}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({product.review_count})
                          </span>
                        </div>

                        {/* 가격 */}
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-lg text-gray-900">
                            {formatPrice(product.price)}원
                          </span>
                          {product.original_price && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(product.original_price)}원
                            </span>
                          )}
                        </div>

                        {/* 할인율 (고정 높이로 간격 일정하게) */}
                        <div className="h-5">
                          {product.original_price && (
                            <span className="text-sm text-red-500 font-medium">
                              {Math.round(
                                ((product.original_price - product.price) /
                                  product.original_price) *
                                  100
                              )}
                              % 할인
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
