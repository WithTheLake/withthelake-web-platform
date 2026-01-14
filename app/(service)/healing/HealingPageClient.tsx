'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Play, Pause, Square } from 'lucide-react'
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

  const handleAudioSelect = (item: AudioItem) => {
    setCurrentAudio(item)
  }

  const openLocation = () => {
    if (userLocation) {
      window.open(
        `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}&hl=ko&z=15`,
        '_blank'
      )
    } else {
      showToast('위치 정보를 가져오는 중입니다. 잠시 후 다시 시도해주세요.', 'warning')
    }
  }

  // 감정 기록 버튼 클릭 - 로그인 체크 + 오늘 기록 여부 체크 후 모달 열기
  const handleEmotionButtonClick = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // 비로그인 시 로그인 모달 먼저 표시
      setIsLoginModalOpen(true)
      return
    }

    // 오늘 기록 여부 체크
    const result = await checkTodayEmotionRecord()
    if (result.hasRecordedToday) {
      // 이미 오늘 기록했으면 안내 모달 표시
      setIsAlreadyRecordedOpen(true)
      return
    }

    // 로그인 + 오늘 기록 안했으면 감정 기록 모달 열기
    setIsEmotionSheetOpen(true)
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
              onClick={handleEmotionButtonClick}
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

      {/* Walk Guide Modal */}
      <WalkGuideModal
        isOpen={isWalkGuideOpen}
        onClose={() => setIsWalkGuideOpen(false)}
        walkGuides={walkGuides}
        onSelectAudio={handleAudioSelect}
      />

      {/* Affirmation Modal */}
      <AffirmationModal
        isOpen={isAffirmationOpen}
        onClose={() => setIsAffirmationOpen(false)}
        affirmations={affirmations}
        onSelectAudio={handleAudioSelect}
      />

      {/* Audio Description Modal */}
      <AudioDescriptionModal
        isOpen={isDescriptionOpen}
        onClose={() => setIsDescriptionOpen(false)}
        audio={currentAudio}
      />

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

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Already Recorded Modal */}
      <AlreadyRecordedModal
        isOpen={isAlreadyRecordedOpen}
        onClose={() => setIsAlreadyRecordedOpen(false)}
      />
    </div>
  )
}
