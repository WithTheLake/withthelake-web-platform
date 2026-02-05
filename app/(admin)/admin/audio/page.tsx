'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Music, Play, Pause, Square, HardDrive } from 'lucide-react'
import { getAdminAudioTracks, deleteAudioTrack, toggleAudioActive, getAdminAudioCategories, type AudioCategoryItem } from '@/actions/audioActions'
import type { AudioItem } from '@/types/audio'
import { PROVINCE_NAMES, CITY_NAMES, DIFFICULTY_LABELS } from '@/types/audio'

const ITEMS_PER_PAGE = 15

// 카테고리 색상 매핑 (DB color 필드 → Tailwind 클래스)
const COLOR_MAP: Record<string, string> = {
  green: 'bg-green-100 text-green-800',
  purple: 'bg-purple-100 text-purple-800',
  blue: 'bg-blue-100 text-blue-800',
  red: 'bg-red-100 text-red-800',
  orange: 'bg-orange-100 text-orange-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  pink: 'bg-pink-100 text-pink-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  teal: 'bg-teal-100 text-teal-800',
  gray: 'bg-gray-100 text-gray-800',
}

const formatDuration = (seconds?: number | null) => {
  if (!seconds) return '-'
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
}

const SUPABASE_STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/audio`
  : ''

export default function AdminAudioPage() {
  const [tracks, setTracks] = useState<AudioItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState('전체')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // 동적 카테고리
  const [categories, setCategories] = useState<AudioCategoryItem[]>([])

  useEffect(() => {
    getAdminAudioCategories().then(setCategories)
  }, [])

  // 카테고리 slug → label 매핑
  const getCategoryLabel = (slug: string) => {
    const cat = categories.find(c => c.slug === slug)
    return cat?.label || slug
  }

  // 카테고리 slug → badge 색상 매핑
  const getCategoryBadgeColor = (slug: string) => {
    const cat = categories.find(c => c.slug === slug)
    return COLOR_MAP[cat?.color || 'gray'] || COLOR_MAP.gray
  }

  // 미리듣기 상태
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  // 미리듣기 재생/정지
  const handlePlayPreview = (track: AudioItem) => {
    if (playingTrackId === track.id) {
      // 현재 재생 중인 트랙 정지
      audioRef.current?.pause()
      setPlayingTrackId(null)
      return
    }

    // 기존 재생 정지
    if (audioRef.current) {
      audioRef.current.pause()
    }

    const url = `${SUPABASE_STORAGE_URL}/${track.category}/${track.filename}`
    const audio = new Audio(url)
    audioRef.current = audio
    audio.play()
    setPlayingTrackId(track.id)

    audio.addEventListener('ended', () => {
      setPlayingTrackId(null)
    })
    audio.addEventListener('error', () => {
      setPlayingTrackId(null)
    })
  }

  const handleStopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlayingTrackId(null)
  }

  // 페이지 이동 시 재생 중지
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const fetchTracks = async () => {
    setIsLoading(true)
    const result = await getAdminAudioTracks({
      category: category !== '전체' ? category : undefined,
      search: search || undefined,
      limit: ITEMS_PER_PAGE,
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
    })
    setTracks(result.data)
    setTotalCount(result.count)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchTracks()
  }, [category, currentPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchTracks()
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 오디오를 삭제하시겠습니까?`)) return

    const result = await deleteAudioTrack(id)
    if (result.success) {
      fetchTracks()
    } else {
      alert(result.message || '삭제에 실패했습니다.')
    }
  }

  const handleToggleActive = async (track: AudioItem) => {
    const newActive = !track.is_active
    const message = track.is_active
      ? `"${track.title}" 오디오를 숨기시겠습니까?\n힐링로드ON에서 보이지 않게 됩니다.`
      : `"${track.title}" 오디오를 다시 공개하시겠습니까?\n힐링로드ON에 다시 보이게 됩니다.`
    if (!confirm(message)) return

    const result = await toggleAudioActive(track.id, newActive)
    if (result.success) {
      fetchTracks()
    } else {
      alert(result.message || '상태 변경에 실패했습니다.')
    }
  }

  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div className="flex items-center justify-between pl-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">오디오 관리</h1>
          <p className="text-gray-500 mt-1">총 {totalCount}개의 오디오 트랙</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/audio/storage"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <HardDrive size={18} />
            Storage
          </Link>
          <Link
            href="/admin/audio/add"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            오디오 추가
          </Link>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setCategory('전체')
                setCurrentPage(1)
              }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                category === '전체'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  setCategory(cat.slug)
                  setCurrentPage(1)
                }}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  category === cat.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
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
                placeholder="제목 또는 설명 검색..."
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

      {/* 오디오 목록 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[70px]" />
            <col className="w-[44%]" />
            <col className="w-[100px]" />
            <col className="w-[100px]" />
            <col className="w-[120px]" />
            <col className="w-[70px]" />
            <col className="w-[100px]" />
          </colgroup>
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="pl-4 pr-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                순서
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                재생시간
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                지역
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  로딩 중...
                </td>
              </tr>
            ) : tracks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Music size={32} className="text-gray-300" />
                    <span>오디오 트랙이 없습니다.</span>
                  </div>
                </td>
              </tr>
            ) : (
              tracks.map((track) => (
                <tr key={track.id} className={`hover:bg-gray-50 ${!track.is_active ? 'opacity-50' : ''}`}>
                  <td className="pl-4 pr-2 py-4 text-sm text-gray-500 text-center">
                    {track.order_index}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* 미리듣기 버튼 */}
                      <button
                        onClick={() => handlePlayPreview(track)}
                        className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                          playingTrackId === track.id
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title={playingTrackId === track.id ? '정지' : '미리듣기'}
                      >
                        {playingTrackId === track.id ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                      </button>
                      {track.emoji && <span className="flex-shrink-0 text-lg">{track.emoji}</span>}
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{track.title}</div>
                        {track.description && (
                          <div className="text-xs text-gray-500 truncate">{track.description}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-0.5 truncate">{track.filename}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadgeColor(track.category)}`}>
                      {getCategoryLabel(track.category)}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-600 text-center">
                    {formatDuration(track.duration)}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-600 text-center">
                    {track.category === 'trail_guide' ? (
                      <div className="text-xs">
                        {track.province && PROVINCE_NAMES[track.province] ? (
                          <div>{PROVINCE_NAMES[track.province]}</div>
                        ) : null}
                        {track.city && CITY_NAMES[track.city] ? (
                          <div className="text-gray-400">{CITY_NAMES[track.city]}</div>
                        ) : null}
                        {track.difficulty && DIFFICULTY_LABELS[track.difficulty] ? (
                          <span className={`inline-flex px-1.5 py-0.5 text-xs rounded ${DIFFICULTY_LABELS[track.difficulty].bg} ${DIFFICULTY_LABELS[track.difficulty].color}`}>
                            {DIFFICULTY_LABELS[track.difficulty].label}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(track)}
                      className={`inline-flex items-center gap-1 p-1 rounded transition-colors ${
                        track.is_active
                          ? 'text-green-600 hover:text-green-800 hover:bg-green-50'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      }`}
                      title={track.is_active ? '클릭하여 숨기기' : '클릭하여 공개하기'}
                    >
                      {track.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/audio/${track.id}`}
                        className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                        title="수정"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(track.id, track.title)}
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
