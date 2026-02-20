'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Pause, Square, MapPin, ShoppingBag, Loader2 } from 'lucide-react'
import { useAudioStore } from '@/stores/useAudioStore'
import { createClient } from '@/lib/supabase/client'
import type { AudioItem } from '@/types/audio'
import EmotionRecordModal from '@/components/modals/EmotionRecordModal'
import LoginModal from '@/components/modals/LoginModal'
import AlreadyRecordedModal from '@/components/modals/AlreadyRecordedModal'
import TrailTextSelectModal from '@/components/modals/TrailTextSelectModal'
import TrailMapSelectModal from '@/components/modals/TrailMapSelectModal'
import WalkGuideModal from '@/components/modals/WalkGuideModal'
import AffirmationModal from '@/components/modals/AffirmationModal'
import AudioDescriptionModal from '@/components/modals/AudioDescriptionModal'
import { formatTime } from '@/lib/utils/format'
import { checkTodayEmotionRecord } from '@/actions/emotionActions'
import { useToast } from '@/components/ui/Toast'

interface HealingPageClientProps {
  walkGuides: AudioItem[]
  affirmations: AudioItem[]
  trailGuides: AudioItem[]
}

export default function HealingPageClient({ walkGuides, affirmations, trailGuides }: HealingPageClientProps) {
  const { showToast } = useToast()
  const [isWalkGuideOpen, setIsWalkGuideOpen] = useState(false)
  const [isAffirmationOpen, setIsAffirmationOpen] = useState(false)
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const [isEmotionSheetOpen, setIsEmotionSheetOpen] = useState(false)
  const [isTrailTextSelectOpen, setIsTrailTextSelectOpen] = useState(false)
  const [isTrailMapSelectOpen, setIsTrailMapSelectOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isAlreadyRecordedOpen, setIsAlreadyRecordedOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const shouldAutoPlay = useRef(false)

  const {
    currentAudio,
    playbackState,
    currentTime,
    duration,
    isLoading,
    setCurrentAudio,
    setLoading,
    setCurrentTime,
    setDuration,
    setPlaybackState
  } = useAudioStore()

  // 오디오 제어 함수들
  const play = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setPlaybackState('playing')
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setPlaybackState('paused')
    }
  }

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setPlaybackState('stopped')
      setCurrentTime(0)
    }
  }

  // 페이지 이탈 시 오디오 정지
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setPlaybackState('stopped')
      setCurrentTime(0)
    }
  }, [setPlaybackState, setCurrentTime])

  // 오디오 이벤트 리스너
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleDurationChange = () => {
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
      }
    }

    const handleEnded = () => {
      audio.currentTime = 0
      setPlaybackState('stopped')
      setCurrentTime(0)
    }

    const handleCanPlay = () => {
      setLoading(false)
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
      }
      // 오디오 선택 시 자동 재생
      if (shouldAutoPlay.current) {
        shouldAutoPlay.current = false
        audio.play()
        setPlaybackState('playing')
      }
    }

    const handleWaiting = () => setLoading(true)

    const handleError = (e: Event) => {
      const audioElement = e.target as HTMLAudioElement
      const error = audioElement.error
      setLoading(false)
      setPlaybackState('stopped')

      let errorMessage = '오디오를 재생할 수 없습니다. 잠시 후 다시 시도해 주세요.'
      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = '오디오 로딩이 중단되었습니다. 다시 선택해 주세요.'
            break
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = '인터넷 연결이 불안정합니다. Wi-Fi 또는 데이터를 확인해 주세요.'
            break
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = '이 오디오를 재생할 수 없습니다. 다른 오디오를 선택해 주세요.'
            break
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = '이 오디오를 재생할 수 없습니다. 다른 오디오를 선택해 주세요.'
            break
        }
      }
      showToast(errorMessage, 'error')
    }

    audio.addEventListener('loadedmetadata', handleDurationChange)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadedmetadata', handleDurationChange)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('error', handleError)
    }
  }, [setDuration, setCurrentTime, setLoading, setPlaybackState, showToast])

  // 오디오 변경 시 로드
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentAudio) return

    setLoading(true)
    let folder = 'affirmation'
    if (currentAudio.category === 'walk_guide') folder = 'walk_guide'
    else if (currentAudio.category === 'trail_guide') folder = 'trail_guide'

    const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL
    const audioUrl = `${storageUrl}/audio/${folder}/${encodeURIComponent(currentAudio.filename)}`

    audio.src = audioUrl
    audio.load()
  }, [currentAudio, setLoading])

  const handleAudioSelect = (item: AudioItem) => {
    shouldAutoPlay.current = true
    setCurrentAudio(item)
  }

  const handleEmotionButtonClick = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setIsLoginModalOpen(true)
      return
    }

    const result = await checkTodayEmotionRecord()
    if (result.hasRecordedToday) {
      setIsAlreadyRecordedOpen(true)
      return
    }

    setIsEmotionSheetOpen(true)
  }

  // 로그인 후 리다이렉트 시 action 파라미터 감지 → 감정 기록 모달 자동 오픈
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('action') === 'emotion') {
      // URL에서 action 파라미터 제거 (깔끔한 URL 유지)
      const url = new URL(window.location.href)
      url.searchParams.delete('action')
      window.history.replaceState({}, '', url.toString())
      // 감정 기록 흐름 실행 (로그인 상태 + 오늘 기록 여부 체크)
      handleEmotionButtonClick()
    }
  }, [])

  // ==================== 공통 미디어 제어 박스 (모바일용) ====================
  const renderMediaControlBox = () => {
    if (!currentAudio) {
      return (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 mb-5 text-center">
          <div className="text-4xl mb-2">🎵</div>
          <p className="text-gray-500 text-sm">오디오를 선택해주세요</p>
        </div>
      )
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-2xl p-5 mb-5 shadow-lg"
      >
        {/* 오디오 정보 */}
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">{currentAudio.emoji || '🎵'}</span>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{currentAudio.title}</h3>
            <p className="text-sm text-gray-600 truncate">{currentAudio.description}</p>
          </div>
          <button
            onClick={() => setIsDescriptionOpen(true)}
            className="px-3 py-1.5 bg-white rounded-full text-xs font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            상세보기
          </button>
        </div>

        {/* 진행 바 */}
        <div className="mb-4">
          <div
            className="h-3 bg-gray-200 rounded-full overflow-hidden cursor-pointer relative"
            onClick={(e) => {
              if (!audioRef.current || !duration) return
              const rect = e.currentTarget.getBoundingClientRect()
              const clickX = e.clientX - rect.left
              const newTime = (clickX / rect.width) * duration
              audioRef.current.currentTime = newTime
              setCurrentTime(newTime)
            }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 pointer-events-none"
              initial={{ width: 0 }}
              animate={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 재생 컨트롤 */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={playbackState === 'playing' ? pause : play}
            disabled={isLoading}
            className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={playbackState === 'playing' ? '일시정지' : '재생'}
          >
            {playbackState === 'playing' ? (
              <Pause size={24} fill="white" color="white" />
            ) : (
              <Play size={24} fill="white" color="white" className="ml-0.5" />
            )}
          </button>
          <button
            onClick={stop}
            disabled={isLoading}
            className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="정지"
          >
            <Square size={20} fill="white" color="white" />
          </button>
        </div>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 mt-3 text-sm text-purple-600 font-medium"
          >
            <Loader2 size={16} className="animate-spin" />
            로딩 중...
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 숨김 오디오 요소 */}
      <audio ref={audioRef} preload="metadata" />

      {/* ==================== 모바일 레이아웃 (lg 미만) ==================== */}
      <div className="lg:hidden">
        {/* 페이지 타이틀 및 배너 */}
        <section className="pt-3 px-5 pb-2">
          <div className="text-center mb-2">
            <Image
              src="/images/healingroadon_logo.png"
              alt="HEALING ROAD ON"
              width={200}
              height={60}
              className="h-12 w-auto mx-auto"
            />
          </div>
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden">
            <Image
              src="/images/healingroadon_banner_2x.jpg"
              alt="힐링로드ON 메인 배너"
              width={800}
              height={450}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="px-5 pt-4">
          {/* 미디어 제어 박스 */}
          {renderMediaControlBox()}

          {/* 오디오 선택 섹션 */}
          <div className="mb-5">
            <div className="flex items-center mb-3">
              <span className="text-lg font-bold text-gray-900 mr-2">🎧 오디오 듣기</span>
              <span className="text-sm text-gray-500">걷기 안내와 긍정적 메세지</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsWalkGuideOpen(true)}
                className="flex-1 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all shadow-sm cursor-pointer"
              >
                <span className="text-xl">🚶</span>
                <span className="text-base font-medium text-gray-700">걷기 안내</span>
              </button>
              <button
                onClick={() => setIsAffirmationOpen(true)}
                className="flex-1 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all shadow-sm cursor-pointer"
              >
                <span className="text-xl">💭</span>
                <span className="text-base font-medium text-gray-700">긍정확언</span>
              </button>
            </div>
            {/* 길 안내 및 지도 버튼 */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setIsTrailTextSelectOpen(true)}
                className="flex-1 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all shadow-sm cursor-pointer"
              >
                <span className="text-xl">🗺️</span>
                <span className="text-base font-medium text-gray-700">길 안내</span>
              </button>
              <button
                onClick={() => setIsTrailMapSelectOpen(true)}
                className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md cursor-pointer"
              >
                <MapPin size={18} />
                <span className="text-base font-medium">지도로 선택</span>
              </button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-16 h-1 bg-emerald-200 rounded-full mx-auto mb-5" />

          {/* 기록하기 섹션 */}
          <div className="mb-5">
            <div className="flex items-center mb-3">
              <span className="text-lg font-bold text-gray-900 mr-2">📝 기록하기</span>
              <span className="text-sm text-gray-500">오늘의 감정을 기록해요</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEmotionButtonClick}
                className="flex-1 h-12 bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-xl flex items-center justify-center gap-2 hover:shadow-md transition-all cursor-pointer"
              >
                <span className="text-xl">😊</span>
                <span className="text-sm font-medium text-rose-700">오늘 감정</span>
              </button>
              <a
                href="https://forms.gle/At8WaVZLsXLCoxCLA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-12 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl flex items-center justify-center gap-2 hover:shadow-md transition-all cursor-pointer"
              >
                <span className="text-xl">📋</span>
                <span className="text-sm font-medium text-blue-700">설문조사</span>
              </a>
            </div>
          </div>

          {/* 스토어 섹션 */}
          <div className="mb-8">
            <div className="mb-3">
              <span className="text-lg font-bold text-gray-900">🛒 힐링로드ON 제품</span>
            </div>
            <a
              href="https://smartstore.naver.com/withlab201"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative w-full rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <Image
                src="/images/healingroadon_store.jpg"
                alt="힐링로드ON 제품"
                width={800}
                height={450}
                className="w-full h-auto"
              />
              <div className="absolute bottom-3 left-3 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold shadow-lg">
                <ShoppingBag size={16} />
                스마트스토어 바로가기
              </div>
            </a>
          </div>
        </section>
      </div>

      {/* ==================== PC 레이아웃 (lg 이상) ==================== */}
      <div className="hidden lg:block">
        {/* 히어로 섹션 */}
        <section className="relative">
          <div className="w-full h-[480px] overflow-hidden">
            <Image
              src="/images/healingroadon_banner_2x.jpg"
              alt="힐링로드ON 메인 배너"
              width={1920}
              height={720}
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/50" />
          </div>
          {/* 로고 오버레이 */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <Image
              src="/images/healingroadon_logo.png"
              alt="HEALING ROAD ON"
              width={280}
              height={80}
              className="h-20 w-auto drop-shadow-lg"
            />
          </div>
        </section>

        {/* 미디어 플레이어 바 (풀 너비) */}
        <section className="max-w-7xl mx-auto px-8 -mt-16 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-5">
            <div className="flex items-center gap-6">
              {/* 현재 재생 정보 */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                  currentAudio ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-gray-100'
                }`}>
                  {currentAudio ? (
                    playbackState === 'playing' ? (
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-white rounded-full"
                            animate={{ height: [8, 16, 8] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-2xl">{currentAudio.emoji || '🎵'}</span>
                    )
                  ) : (
                    <span className="text-2xl text-gray-400">🎵</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 truncate">
                    {currentAudio?.title || '오디오를 선택해주세요'}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {currentAudio?.description || '아래에서 원하는 카테고리를 선택하세요'}
                  </p>
                </div>
              </div>

              {/* 진행 바 */}
              <div className="flex-1 max-w-md">
                <div
                  className="h-2 bg-gray-100 rounded-full cursor-pointer overflow-hidden"
                  onClick={(e) => {
                    if (!audioRef.current || !duration) return
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const percent = x / rect.width
                    audioRef.current.currentTime = percent * duration
                  }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* 컨트롤 버튼 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={playbackState === 'playing' ? pause : play}
                  disabled={!currentAudio || isLoading}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentAudio
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : playbackState === 'playing' ? (
                    <Pause size={20} />
                  ) : (
                    <Play size={20} className="ml-0.5" />
                  )}
                </button>
                <button
                  onClick={stop}
                  disabled={!currentAudio}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentAudio
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-gray-50 text-gray-300'
                  }`}
                >
                  <Square size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 메인 콘텐츠 - 섹션별 구조화 */}
        <section className="max-w-5xl mx-auto px-8 py-12">

          {/* 🎧 오디오 듣기 섹션 */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">🎧</span>
              <h2 className="text-xl font-bold text-gray-900">오디오 듣기</h2>
              <span className="text-sm text-gray-500">걷기 안내와 긍정적 메시지</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* 걷기 안내 */}
              <button
                onClick={() => setIsWalkGuideOpen(true)}
                className="bg-white rounded-2xl p-6 text-left border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🚶</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">걷기 안내</h3>
                    <p className="text-base text-emerald-600">{walkGuides.length}개</p>
                  </div>
                </div>
                <p className="text-gray-500 text-base">걷기의 효과와 올바른 방법을 안내해드려요</p>
              </button>

              {/* 긍정확언 */}
              <button
                onClick={() => setIsAffirmationOpen(true)}
                className="bg-white rounded-2xl p-6 text-left border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">긍정확언</h3>
                    <p className="text-base text-amber-600">{affirmations.length}개</p>
                  </div>
                </div>
                <p className="text-gray-500 text-base">마음을 다독이는 따뜻한 메시지</p>
              </button>

              {/* 길 안내 */}
              <div className="bg-white rounded-2xl p-6 text-left border border-gray-200">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🗺️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">길 안내</h3>
                    <p className="text-base text-blue-600">{trailGuides.length}개</p>
                  </div>
                </div>
                <p className="text-gray-500 text-base mb-4">전국의 힐링 산책로를 찾아보세요</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsTrailTextSelectOpen(true)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-base font-medium transition-colors cursor-pointer"
                  >
                    📋 목록
                  </button>
                  <button
                    onClick={() => setIsTrailMapSelectOpen(true)}
                    className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-base font-medium transition-colors cursor-pointer"
                  >
                    🗺️ 지도
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-20 h-1 bg-emerald-200 rounded-full mx-auto mb-10" />

          {/* 📝 기록하기 섹션 */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">📝</span>
              <h2 className="text-xl font-bold text-gray-900">기록하기</h2>
              <span className="text-sm text-gray-500">오늘의 감정을 기록해요</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 오늘 감정 */}
              <button
                onClick={handleEmotionButtonClick}
                className="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-2xl p-6 text-left hover:shadow-lg transition-all flex items-center gap-5 cursor-pointer"
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-3xl">😊</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">오늘 감정 기록</h3>
                  <p className="text-rose-600 text-sm">걷기 후 느낀 감정을 기록해요</p>
                </div>
              </button>

              {/* 설문조사 */}
              <a
                href="https://forms.gle/At8WaVZLsXLCoxCLA"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 text-left hover:shadow-lg transition-all flex items-center gap-5"
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-3xl">📋</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">설문조사</h3>
                  <p className="text-blue-600 text-sm">서비스 개선에 참여해주세요</p>
                </div>
              </a>
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-20 h-1 bg-emerald-200 rounded-full mx-auto mb-10" />

          {/* 🛒 스토어 섹션 */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">🛒</span>
              <h2 className="text-xl font-bold text-gray-900">힐링로드ON 제품</h2>
            </div>

            <a
              href="https://smartstore.naver.com/withlab201"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <Image
                src="/images/healingroadon_store.jpg"
                alt="힐링로드ON 제품"
                width={1200}
                height={400}
                className="w-full h-auto"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-full text-sm font-bold shadow-lg">
                <ShoppingBag size={18} />
                스마트스토어 바로가기
              </div>
            </a>
          </div>
        </section>
      </div>

      {/* 모달들 */}
      <WalkGuideModal
        isOpen={isWalkGuideOpen}
        onClose={() => setIsWalkGuideOpen(false)}
        walkGuides={walkGuides}
        onSelectAudio={handleAudioSelect}
      />
      <AffirmationModal
        isOpen={isAffirmationOpen}
        onClose={() => setIsAffirmationOpen(false)}
        affirmations={affirmations}
        onSelectAudio={handleAudioSelect}
      />
      <AudioDescriptionModal
        isOpen={isDescriptionOpen}
        onClose={() => setIsDescriptionOpen(false)}
        audio={currentAudio}
      />
      <EmotionRecordModal
        isOpen={isEmotionSheetOpen}
        onClose={() => setIsEmotionSheetOpen(false)}
      />
      <TrailTextSelectModal
        isOpen={isTrailTextSelectOpen}
        onClose={() => setIsTrailTextSelectOpen(false)}
        trails={trailGuides}
        onTrailSelect={(trail) => setCurrentAudio(trail)}
      />
      <TrailMapSelectModal
        isOpen={isTrailMapSelectOpen}
        onClose={() => setIsTrailMapSelectOpen(false)}
        onTrailSelect={(trail) => setCurrentAudio(trail)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        returnAction="emotion"
      />
      <AlreadyRecordedModal
        isOpen={isAlreadyRecordedOpen}
        onClose={() => setIsAlreadyRecordedOpen(false)}
      />
    </div>
  )
}
