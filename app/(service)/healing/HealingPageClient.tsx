'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Play, Pause, Square } from 'lucide-react'
import { useAudioStore } from '@/stores/useAudioStore'
import type { AudioItem } from '@/types/audio'
import EmotionRecordModal from '@/components/modals/EmotionRecordModal'
import TrailTextSelectModal from '@/components/modals/TrailTextSelectModal'
import TrailMapSelectModal from '@/components/modals/TrailMapSelectModal'
import { formatTime } from '@/lib/utils/format'

interface HealingPageClientProps {
  walkGuides: AudioItem[]
  affirmations: AudioItem[]
  trailGuides: AudioItem[]
}

export default function HealingPageClient({ walkGuides, affirmations, trailGuides }: HealingPageClientProps) {
  const [isWalkGuideOpen, setIsWalkGuideOpen] = useState(false)
  const [isAffirmationOpen, setIsAffirmationOpen] = useState(false)
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const [isEmotionSheetOpen, setIsEmotionSheetOpen] = useState(false)
  const [isTrailTextSelectOpen, setIsTrailTextSelectOpen] = useState(false)
  const [isTrailMapSelectOpen, setIsTrailMapSelectOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

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

  // 로컬 오디오 제어 함수들
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
      // 페이지 이탈 시 오디오 정지
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
      // WAV 파일은 duration이 Infinity로 올 수 있음 - 유효한 값만 설정
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      // timeupdate에서도 duration 체크 (WAV 파일 대응)
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
      // canplay에서도 duration 체크
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
      }
    }

    const handleWaiting = () => {
      setLoading(true)
    }

    const handleError = (e: Event) => {
      const audioElement = e.target as HTMLAudioElement
      const error = audioElement.error
      setLoading(false)
      setPlaybackState('stopped')

      let errorMessage = '오디오를 재생할 수 없습니다.'
      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = '오디오 로딩이 취소되었습니다.'
            break
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.'
            break
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = '오디오 파일을 재생할 수 없습니다.'
            break
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = '지원하지 않는 오디오 형식입니다.'
            break
        }
      }
      console.error('Audio error:', error?.message || 'Unknown error')
      alert(errorMessage)
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
  }, [setDuration, setCurrentTime, setLoading, setPlaybackState])

  // 오디오 변경 시 Supabase Storage에서 로드
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentAudio) return

    setLoading(true)

    // 카테고리에 따라 폴더 경로 결정
    let folder = 'affirmation'
    if (currentAudio.category === 'walk_guide') folder = 'walk_guide'
    else if (currentAudio.category === 'trail_guide') folder = 'trail_guide'

    // Supabase Storage Public URL (환경 변수 사용)
    const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL
    const audioUrl = `${storageUrl}/audio/${folder}/${encodeURIComponent(currentAudio.filename)}`

    audio.src = audioUrl
    audio.load()
  }, [currentAudio, setLoading])

  // GPS 위치 추적
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.warn('위치 정보를 가져오지 못했습니다:', error.message)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      )

      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  const selectAudioItem = (item: AudioItem) => {
    setCurrentAudio(item)
    setIsWalkGuideOpen(false)
    setIsAffirmationOpen(false)
  }

  const openLocation = () => {
    if (userLocation) {
      window.open(
        `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}&hl=ko&z=15`,
        '_blank'
      )
    } else {
      alert('위치 정보를 가져오는 중입니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 숨김 오디오 요소 */}
      <audio ref={audioRef} preload="metadata" />

      {/* 페이지 타이틀 및 배너 */}
      <section className="pt-3 px-5 pb-2">
        <div className="text-center mb-2">
          <Image
            src="/images/healingroadon_logo.jpg"
            alt="HEALING ROAD ON"
            width={200}
            height={60}
            className="h-12 w-auto mx-auto"
          />
        </div>
        <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden">
          <Image
            src="/images/healingroadon_banner.jpg"
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
        {currentAudio ? (
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

            {/* 로딩 상태 */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-3 text-sm text-purple-600 font-medium"
              >
                로딩 중...
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 mb-5 text-center">
            <div className="text-4xl mb-2">🎵</div>
            <p className="text-gray-500 text-sm">오디오를 선택해주세요</p>
          </div>
        )}

        {/* Audio Selection Section */}
        <div className="mb-5">
          <div className="flex items-center mb-3">
            <span className="text-lg font-bold mr-2">오디오 듣기</span>
            <span className="text-xs text-gray-600">
              올바른 걷기의 마음가짐과 긍정적 메세지를 확인하세요.
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsWalkGuideOpen(true)}
              className="flex-1 h-12 border border-gray-300 rounded-xl flex items-center justify-between px-3 hover:bg-gray-50"
            >
              <div className="w-7 h-7 flex items-center justify-center">
                <span className="text-xl">🚶</span>
              </div>
              <span className="text-sm font-medium">걷기 안내</span>
              <span className="text-xl">▼</span>
            </button>
            <button
              onClick={() => setIsAffirmationOpen(true)}
              className="flex-1 h-12 border border-gray-300 rounded-xl flex items-center justify-between px-3 hover:bg-gray-50"
            >
              <div className="w-7 h-7 flex items-center justify-center">
                <span className="text-xl">💭</span>
              </div>
              <span className="text-sm font-medium">긍정확언</span>
              <span className="text-xl">▼</span>
            </button>
          </div>
          {/* 길 안내 및 지도 버튼 */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setIsTrailTextSelectOpen(true)}
              className="flex-1 h-12 border border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50"
            >
              <div className="w-7 h-7 flex items-center justify-center mr-2">
                <span className="text-xl">🗺️</span>
              </div>
              <span className="text-sm font-medium">길 안내</span>
            </button>
            <button
              onClick={() => setIsTrailMapSelectOpen(true)}
              className="flex-1 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <MapPin size={18} className="mr-2" />
              <span className="text-sm font-medium">지도</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-5" />

        {/* Recording Section */}
        <div className="mb-5">
          <div className="flex items-center mb-3">
            <span className="text-lg font-bold mr-2">기록하기</span>
            <span className="text-xs text-gray-600">
              나의 오늘 느끼는 감정을 적고, 질문에 답변해주세요.
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEmotionSheetOpen(true)}
              className="flex-1 h-12 border border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50"
            >
              <div className="w-7 h-7 flex items-center justify-center mr-2">
                <span className="text-xl">😊</span>
              </div>
              <span className="text-sm font-medium">오늘 감정</span>
            </button>
            <a
              href="https://forms.gle/At8WaVZLsXLCoxCLA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-12 border border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-50"
            >
              <div className="w-7 h-7 flex items-center justify-center mr-2">
                <span className="text-xl">📝</span>
              </div>
              <span className="text-sm font-medium">설문조사</span>
            </a>
          </div>
        </div>

        {/* Store Section */}
        <div className="mb-5">
          <div className="mb-2">
            <span className="text-lg font-bold">힐링로드ON 제품 구입</span>
          </div>
          <div className="relative w-full rounded-xl overflow-hidden">
            <Image
              src="/images/healingroadon_store.jpg"
              alt="힐링로드ON 제품"
              width={800}
              height={450}
              className="w-full h-auto"
            />
            <a
              href="https://smartstore.naver.com/withlab201"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 left-3 px-3 py-2 bg-green-500 text-white rounded-full text-xs font-bold hover:bg-green-600"
            >
              스마트스토어 바로가기
            </a>
          </div>
        </div>
      </section>

      {/* Walk Guide Modal - Redesigned */}
      <AnimatePresence>
        {isWalkGuideOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={() => setIsWalkGuideOpen(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md md:max-h-[85vh] bg-white rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-500 to-teal-500">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚶</span>
                  <h2 className="text-lg font-bold text-white">걷기 안내</h2>
                </div>
                <button
                  onClick={() => setIsWalkGuideOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={22} className="text-white" />
                </button>
              </div>

              {/* Description */}
              <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100">
                <p className="text-sm text-emerald-800">
                  올바른 맨발걷기 방법과 마음가짐을 안내합니다
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {walkGuides.length > 0 ? (
                  <div className="grid gap-3">
                    {walkGuides.map((item, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => selectAudioItem(item)}
                        className="w-full text-left p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl hover:from-emerald-100 hover:to-teal-100 hover:border-emerald-300 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl group-hover:scale-110 transition-transform">
                            {item.emoji || '🚶'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-emerald-800 mb-1 truncate">
                              {item.title}
                            </h3>
                            <p className="text-sm text-emerald-600 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                          <Play size={20} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">🎵</div>
                    <p className="text-gray-500">오디오를 불러오는 중...</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t bg-gray-50 text-center">
                <p className="text-xs text-gray-500">
                  오디오를 선택하면 자동으로 재생됩니다
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Affirmation Modal - Redesigned */}
      <AnimatePresence>
        {isAffirmationOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={() => setIsAffirmationOpen(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md md:max-h-[85vh] bg-white rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💭</span>
                  <h2 className="text-lg font-bold text-white">긍정확언</h2>
                </div>
                <button
                  onClick={() => setIsAffirmationOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={22} className="text-white" />
                </button>
              </div>

              {/* Description */}
              <div className="px-4 py-3 bg-purple-50 border-b border-purple-100">
                <p className="text-sm text-purple-800">
                  긍정적인 메시지로 마음을 채워보세요
                </p>
              </div>

              {/* Subcategory Filter - if needed */}
              {affirmations.some(a => a.subcategory) && (
                <div className="px-4 py-2 border-b bg-white">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {Array.from(new Set(affirmations.map(a => a.subcategory).filter(Boolean))).map((sub) => (
                      <span
                        key={sub}
                        className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full whitespace-nowrap"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {affirmations.length > 0 ? (
                  <div className="grid gap-3">
                    {affirmations.map((item, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => selectAudioItem(item)}
                        className="w-full text-left p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl group-hover:scale-110 transition-transform">
                            {item.emoji || '💭'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-purple-800 truncate">
                                {item.title}
                              </h3>
                              {item.subcategory && (
                                <span className="px-2 py-0.5 text-[10px] bg-purple-200 text-purple-700 rounded-full">
                                  {item.subcategory}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-purple-600 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                          <Play size={20} className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">✨</div>
                    <p className="text-gray-500">오디오를 불러오는 중...</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t bg-gray-50 text-center">
                <p className="text-xs text-gray-500">
                  오디오를 선택하면 자동으로 재생됩니다
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Description Modal */}
      <AnimatePresence>
        {isDescriptionOpen && currentAudio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-5"
            onClick={() => setIsDescriptionOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl w-full max-w-sm p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsDescriptionOpen(false)}
                className="absolute top-3 right-3 text-black text-xl hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <X size={24} />
              </button>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-8"
              >
                <h3 className="text-xl font-bold mb-3">{currentAudio.title}</h3>
                <p className="text-gray-800 leading-relaxed">{currentAudio.description}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emotion Record Modal */}
      <EmotionRecordModal
        isOpen={isEmotionSheetOpen}
        onClose={() => setIsEmotionSheetOpen(false)}
      />

      {/* Trail Text Select Modal */}
      <TrailTextSelectModal
        isOpen={isTrailTextSelectOpen}
        onClose={() => setIsTrailTextSelectOpen(false)}
        trails={trailGuides}
        onTrailSelect={(trail) => {
          setCurrentAudio(trail)
        }}
      />

      {/* Trail Map Select Modal */}
      <TrailMapSelectModal
        isOpen={isTrailMapSelectOpen}
        onClose={() => setIsTrailMapSelectOpen(false)}
        onTrailSelect={(trail) => {
          setCurrentAudio(trail)
        }}
      />
    </div>
  )
}
