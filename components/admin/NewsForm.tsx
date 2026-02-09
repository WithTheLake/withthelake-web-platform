'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { createNewsArticle, updateNewsArticle, type NewsArticle } from '@/actions/newsActions'

interface NewsFormProps {
  news?: NewsArticle
  mode: 'add' | 'edit'
}

type NewsCategory = '언론보도' | '해외자료' | '블로그' | '보도자료'
const CATEGORIES: NewsCategory[] = ['언론보도', '해외자료', '블로그', '보도자료']

export function NewsForm({ news, mode }: NewsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(news?.title || '')
  const [source, setSource] = useState(news?.source || '')
  const [category, setCategory] = useState<NewsCategory>(news?.category || '언론보도')
  const [link, setLink] = useState(news?.link || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(news?.thumbnail_url || '')
  const [publishedAt, setPublishedAt] = useState(
    news?.published_at ? news.published_at.split('T')[0] : new Date().toISOString().split('T')[0]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('source', source)
    formData.append('category', category)
    formData.append('link', link)
    formData.append('thumbnail_url', thumbnailUrl)
    formData.append('published_at', publishedAt)

    try {
      let result
      if (mode === 'add') {
        result = await createNewsArticle(formData)
      } else {
        result = await updateNewsArticle(news!.id, formData)
      }

      if (result.success) {
        router.push('/admin/news')
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

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/news"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'add' ? '뉴스 추가' : '뉴스 수정'}
          </h1>
          <p className="text-gray-500 mt-1">
            {mode === 'add' ? '새로운 뉴스를 등록합니다.' : '뉴스 정보를 수정합니다.'}
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

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="뉴스 제목을 입력하세요"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 출처 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              출처 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="예: 조선일보, Nature, 위드더레이크 블로그"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    category === cat
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 링크 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              원문 링크 <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com/news/article"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 썸네일 URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              썸네일 이미지 URL
            </label>
            <div className="flex gap-4">
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://example.com/image.jpg (해외자료만 권장)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {thumbnailUrl && (
                <div className="w-20 h-14 bg-gray-100 rounded overflow-hidden flex items-center justify-center relative">
                  <Image
                    src={thumbnailUrl}
                    alt="미리보기"
                    fill
                    className="object-cover"
                    sizes="80px"
                    onError={() => {
                      setThumbnailUrl('')
                    }}
                  />
                </div>
              )}
              {!thumbnailUrl && (
                <div className="w-20 h-14 bg-gray-100 rounded flex items-center justify-center">
                  <ImageIcon size={20} className="text-gray-400" />
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              * 국내 언론보도는 저작권 이슈로 썸네일 미사용 권장
            </p>
          </div>

          {/* 게시일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              게시일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/news"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
