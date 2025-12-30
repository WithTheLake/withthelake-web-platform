'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Square, X, Loader2 } from 'lucide-react'
import { useAudioStore } from '@/stores/useAudioStore'

export default function GlobalAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)

  const {
    currentAudio,
    playbackState,
    isLoading,
    currentTime,
    duration,
    setAudioElement,
    setLoading,
    play,
    pause,
    stop,
    setCurrentTime,
    setDuration,
    setCurrentAudio,
  } = useAudioStore()

  // 오디오 엘리먼트를 스토어에 등록
  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current)
    }
    return () => setAudioElement(null)
  }, [setAudioElement])

  // 오디오 이벤트 리스너
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      stop()
    }

    const handleCanPlay = () => {
      setLoading(false)
    }

    const handleWaiting = () => {
      setLoading(true)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('waiting', handleWaiting)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('waiting', handleWaiting)
    }
  }, [setCurrentTime, setDuration, setLoading, stop])

  // 오디오 파일 변경 시 로드
  useEffect(() => {
    const audio = audioRef.current
    if (audio && currentAudio) {
      audio.load()
    }
  }, [currentAudio])

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const min = Math.floor(seconds / 60)
    const sec = Math.floor(seconds % 60)
    return `${min}:${sec < 10 ? '0' + sec : sec}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const newTime = (clickX / width) * duration
    audio.currentTime = newTime
  }

  const handleClose = () => {
    stop()
    setCurrentAudio(null as any)
  }

  // 현재 오디오가 없으면 렌더링하지 않음
  if (!currentAudio) return null

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata">
        <source src={`/audio/${currentAudio.filename}`} type="audio/wav" />
      </audio>

      {/* Fixed bottom player */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-100 to-blue-200 border-t-2 border-blue-300 shadow-2xl z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* 오디오 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{currentAudio.emoji}</span>
                  <h3 className="font-bold text-sm sm:text-base truncate">
                    {currentAudio.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-600 truncate hidden sm:block">
                  {currentAudio.description}
                </p>
              </div>

              {/* 재생 컨트롤 */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* 재생/일시정지 버튼 */}
                <button
                  onClick={playbackState === 'playing' ? pause : play}
                  disabled={isLoading}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={playbackState === 'playing' ? '일시정지' : '재생'}
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin text-white" />
                  ) : playbackState === 'playing' ? (
                    <Pause size={20} fill="white" color="white" />
                  ) : (
                    <Play size={20} fill="white" color="white" />
                  )}
                </button>

                {/* 정지 버튼 */}
                <button
                  onClick={stop}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors shadow-lg"
                  aria-label="정지"
                >
                  <Square size={18} fill="white" color="white" />
                </button>

                {/* 닫기 버튼 */}
                <button
                  onClick={handleClose}
                  className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors shadow-lg"
                  aria-label="닫기"
                >
                  <X size={20} color="white" />
                </button>
              </div>
            </div>

            {/* 프로그레스 바 */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs w-10 text-center">{formatTime(currentTime)}</span>
              <div
                className="flex-1 h-2 bg-gray-300 rounded-full cursor-pointer relative"
                onClick={handleProgressClick}
              >
                <div
                  className="absolute top-0 left-0 h-2 bg-purple-600 rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <span className="text-xs w-10 text-center">{formatTime(duration)}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
