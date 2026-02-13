'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Upload, X, Music, FileAudio } from 'lucide-react'
import Link from 'next/link'
import {
  createAudioTrack,
  updateAudioTrack,
  getAdminAudioCategories,
  listAudioFiles,
  checkFilesInDb,
  type AudioCategoryItem,
} from '@/actions/audioActions'
import type { AudioItem } from '@/types/audio'
import { PROVINCE_NAMES, CITY_NAMES, PROVINCE_CITY_MAP } from '@/types/audio'

interface AudioFormProps {
  audio?: AudioItem
  mode: 'add' | 'edit'
}

const DIFFICULTIES: { value: string; label: string }[] = [
  { value: 'easy', label: '쉬움' },
  { value: 'moderate', label: '보통' },
  { value: 'hard', label: '어려움' },
]

// province 리스트 (드롭다운용)
const PROVINCES = Object.entries(PROVINCE_NAMES).map(([value, label]) => ({ value, label }))

export function AudioForm({ audio, mode }: AudioFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioPreviewRef = useRef<HTMLAudioElement>(null)

  // 동적 카테고리
  const [categoryList, setCategoryList] = useState<AudioCategoryItem[]>([])

  useEffect(() => {
    getAdminAudioCategories().then((cats) => {
      setCategoryList(cats)
      // 추가 모드에서 카테고리가 비어있으면 첫 번째 카테고리 선택
      if (!category && cats.length > 0) {
        setCategory(cats[0].slug)
      }
    })
  }, [])

  const [title, setTitle] = useState(audio?.title || '')
  const [description, setDescription] = useState(audio?.description || '')
  const [category, setCategory] = useState(audio?.category || '')
  const [subcategory, setSubcategory] = useState(audio?.subcategory || '')
  const [filename, setFilename] = useState(audio?.filename || '')
  const [emoji, setEmoji] = useState(audio?.emoji || '')
  const [duration, setDuration] = useState(audio?.duration?.toString() || '')
  const [orderIndex, setOrderIndex] = useState(audio?.order_index?.toString() || '0')

  // 파일 업로드 관련 상태
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null)

  // Storage 파일 목록 관리 (드롭다운용)
  const [storageFiles, setStorageFiles] = useState<string[]>([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [usedFiles, setUsedFiles] = useState<Set<string>>(new Set())
  const [fileLoadError, setFileLoadError] = useState<string | null>(null)

  // trail_guide 전용 필드
  const [province, setProvince] = useState(audio?.province || '')
  const [city, setCity] = useState(audio?.city || '')
  const [trailName, setTrailName] = useState(audio?.trail_name || '')
  const [distance, setDistance] = useState(audio?.distance || '')
  const [walkingTime, setWalkingTime] = useState(audio?.walking_time || '')
  const [difficulty, setDifficulty] = useState(audio?.difficulty || '')

  const isTrailGuide = category === 'trail_guide'

  // province 변경 시 city 초기화
  const handleProvinceChange = (newProvince: string) => {
    setProvince(newProvince)
    setCity('')
  }

  // 현재 선택된 province의 city 목록
  const availableCities = province ? (PROVINCE_CITY_MAP[province] || []) : []

  // 카테고리 변경 시 Storage 파일 목록 로드 + 중복 체크
  useEffect(() => {
    if (!category) {
      setStorageFiles([])
      setUsedFiles(new Set())
      setFileLoadError(null)
      return
    }

    const loadStorageFiles = async () => {
      setLoadingFiles(true)
      setFileLoadError(null)
      try {
        // 1. Storage 파일 목록 조회
        const fileResult = await listAudioFiles(category)
        if (!fileResult.success || !fileResult.files) {
          setStorageFiles([])
          setUsedFiles(new Set())
          return
        }

        const filenames = fileResult.files.map((f) => f.name)
        setStorageFiles(filenames)

        // 2. DB에 이미 등록된 파일 확인
        const dbResult = await checkFilesInDb(filenames)
        if (dbResult.success && dbResult.linkedFiles) {
          const usedSet = new Set<string>()
          Object.keys(dbResult.linkedFiles).forEach((fname) => {
            // 수정 모드에서 현재 편집 중인 파일은 제외
            if (mode === 'edit' && audio?.filename === fname) {
              return
            }
            usedSet.add(fname)
          })
          setUsedFiles(usedSet)
        }
      } catch (err) {
        console.error('Storage 파일 로드 실패:', err)
        setFileLoadError('파일 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.')
        setStorageFiles([])
        setUsedFiles(new Set())
      } finally {
        setLoadingFiles(false)
      }
    }

    loadStorageFiles()
  }, [category, mode, audio?.filename])

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 타입 검증
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|aac|m4a)$/i)) {
      setError('오디오 파일만 업로드할 수 있습니다. (MP3, WAV, OGG, AAC, M4A)')
      return
    }

    // 크기 검증 (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('파일 크기는 50MB 이하만 가능합니다.')
      return
    }

    setSelectedFile(file)
    setError(null)

    // 미리듣기 URL 생성
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
    const url = URL.createObjectURL(file)
    setAudioPreviewUrl(url)

    // 오디오 메타데이터에서 duration 자동 추출
    const tempAudio = new Audio(url)
    tempAudio.addEventListener('loadedmetadata', () => {
      if (tempAudio.duration && isFinite(tempAudio.duration)) {
        setDuration(Math.round(tempAudio.duration).toString())
      }
    })
  }

  // 파일 선택 취소
  const handleFileRemove = () => {
    setSelectedFile(null)
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl)
      setAudioPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 기존 파일의 Storage URL
  const existingAudioUrl = audio?.filename
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/audio/${audio.category}/${audio.filename}`
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // trail_guide 필수 필드 검증
    if (isTrailGuide) {
      if (!province) {
        setError('도/시를 선택해주세요.')
        setIsSubmitting(false)
        return
      }
      if (!city) {
        setError('시/군/구를 선택해주세요.')
        setIsSubmitting(false)
        return
      }
      if (!trailName.trim()) {
        setError('길 이름을 입력해주세요.')
        setIsSubmitting(false)
        return
      }
      if (!difficulty) {
        setError('난이도를 선택해주세요.')
        setIsSubmitting(false)
        return
      }
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('subcategory', subcategory)
    formData.append('filename', filename)
    formData.append('emoji', emoji)
    if (duration) formData.append('duration', duration)
    formData.append('order_index', orderIndex)

    // 파일 업로드
    if (selectedFile) {
      formData.append('audioFile', selectedFile)
    }

    // 수정 모드에서 파일 교체 시 기존 파일 정보 전달
    if (mode === 'edit' && audio) {
      formData.append('oldCategory', audio.category)
      formData.append('oldFilename', audio.filename)
    }

    if (isTrailGuide) {
      formData.append('province', province)
      formData.append('city', city)
      formData.append('trail_name', trailName)
      formData.append('distance', distance)
      formData.append('walking_time', walkingTime)
      formData.append('difficulty', difficulty)
    }

    try {
      let result
      if (mode === 'add') {
        result = await createAudioTrack(formData)
      } else {
        result = await updateAudioTrack(audio!.id, formData)
      }

      if (result.success) {
        router.push('/admin/audio')
        router.refresh()
      } else {
        setError(result.message || '저장에 실패했습니다.')
      }
    } catch {
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
          href="/admin/audio"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'add' ? '오디오 추가' : '오디오 수정'}
          </h1>
          <p className="text-gray-500 mt-1">
            {mode === 'add' ? '새로운 오디오 트랙을 등록합니다.' : '오디오 트랙 정보를 수정합니다.'}
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

        {/* 기본 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">기본 정보</h2>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categoryList.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setCategory(cat.slug)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    category === cat.slug
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
              {categoryList.length === 0 && (
                <span className="text-sm text-gray-400 py-2">카테고리를 불러오는 중...</span>
              )}
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="오디오 트랙 제목"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="오디오 트랙에 대한 설명"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* 오디오 파일 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              오디오 파일 {mode === 'add' && !filename && <span className="text-red-500">*</span>}
            </label>

            {/* 기존 파일 정보 (수정 모드) */}
            {mode === 'edit' && filename && !selectedFile && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileAudio size={18} className="text-blue-500" />
                    <span className="text-sm text-gray-700">{filename}</span>
                  </div>
                  {existingAudioUrl && (
                    <audio controls className="h-8" src={existingAudioUrl}>
                      <track kind="captions" />
                    </audio>
                  )}
                </div>
              </div>
            )}

            {/* 새 파일 선택됨 */}
            {selectedFile && (
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music size={18} className="text-blue-600" />
                    <div>
                      <span className="text-sm font-medium text-blue-700">{selectedFile.name}</span>
                      <span className="text-xs text-blue-500 ml-2">
                        ({(selectedFile.size / 1024 / 1024).toFixed(1)}MB)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleFileRemove}
                    className="p-1 text-blue-400 hover:text-red-500 transition-colors"
                    title="파일 제거"
                  >
                    <X size={18} />
                  </button>
                </div>
                {audioPreviewUrl && (
                  <audio ref={audioPreviewRef} controls className="w-full mt-2 h-8" src={audioPreviewUrl}>
                    <track kind="captions" />
                  </audio>
                )}
              </div>
            )}

            {/* 파일 선택 버튼 */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Upload size={16} />
                {selectedFile || (mode === 'edit' && filename) ? '파일 변경' : '파일 선택'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.ogg,.aac,.m4a"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="text-xs text-gray-500">
                MP3, WAV, OGG, AAC, M4A (최대 50MB)
              </span>
            </div>

            {/* Storage 파일 선택 드롭다운 */}
            {!selectedFile && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage에서 파일 선택
                </label>
                {loadingFiles ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                    <Loader2 size={16} className="animate-spin" />
                    파일 목록 불러오는 중...
                  </div>
                ) : fileLoadError ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{fileLoadError}</p>
                  </div>
                ) : storageFiles.length === 0 ? (
                  <div className="text-sm text-gray-400 py-2">
                    audio/{category}/ 폴더에 파일이 없습니다.
                    <br />
                    <span className="text-xs">
                      먼저 Storage 관리 페이지에서 파일을 업로드하세요.
                    </span>
                  </div>
                ) : (
                  <>
                    <select
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">파일을 선택하세요</option>
                      {storageFiles.map((fname) => {
                        const isUsed = usedFiles.has(fname)
                        return (
                          <option key={fname} value={fname} disabled={isUsed}>
                            {fname} {isUsed ? '(이미 사용 중)' : ''}
                          </option>
                        )
                      })}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      audio/{category}/ 폴더 내 사용 가능한 파일 ({storageFiles.length - usedFiles.size}/{storageFiles.length})
                    </p>

                    {/* 선택한 파일 미리듣기 */}
                    {filename && (
                      <audio controls className="w-full mt-2 h-8">
                        <source
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/audio/${category}/${filename}`}
                          type="audio/mpeg"
                        />
                        <track kind="captions" />
                      </audio>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 이모지 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이모지
              </label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="🎵"
                maxLength={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 재생 시간 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                재생 시간 (초)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="120"
                min={0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 정렬 순서 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                정렬 순서
              </label>
              <input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
                placeholder="0"
                min={0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 세분류 (walk_guide, affirmation용) */}
          {!isTrailGuide && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                세분류
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="예: 자기수용, 성장, 자신감"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* 길 안내 전용 필드 */}
        {isTrailGuide && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">길 안내 정보</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 도/광역시 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  도/광역시
                </label>
                <select
                  value={province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">선택하세요</option>
                  {PROVINCES.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* 시/군/구 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시/군/구
                </label>
                {availableCities.length > 0 ? (
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">선택하세요</option>
                    {availableCities.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="시/군/구 영문 코드 (예: chuncheon)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
            </div>

            {/* 길 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                길 이름
              </label>
              <input
                type="text"
                value={trailName}
                onChange={(e) => setTrailName(e.target.value)}
                placeholder="예: 소양강 맨발 산책로"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 거리 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  거리
                </label>
                <input
                  type="text"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="예: 2.5km"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 소요시간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  소요시간
                </label>
                <input
                  type="text"
                  value={walkingTime}
                  onChange={(e) => setWalkingTime(e.target.value)}
                  placeholder="예: 약 40분"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 난이도 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  난이도
                </label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDifficulty(difficulty === d.value ? '' : d.value)}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                        difficulty === d.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/audio"
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
