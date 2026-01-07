'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { AudioItem } from '@/types/audio'

interface AudioDescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  audio: AudioItem | null
}

export default function AudioDescriptionModal({
  isOpen,
  onClose,
  audio,
}: AudioDescriptionModalProps) {
  // 모달 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && audio && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-5"
          onClick={onClose}
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
              onClick={onClose}
              className="absolute top-3 right-3 text-black text-xl hover:bg-gray-100 rounded-full p-1 transition-colors"
              aria-label="닫기"
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{audio.emoji || '🎵'}</span>
                <h3 className="text-xl font-bold">{audio.title}</h3>
              </div>
              <p className="text-gray-800 leading-relaxed">{audio.description}</p>

              {/* 추가 정보 (길 안내인 경우) */}
              {audio.category === 'trail_guide' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {audio.province && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">지역:</span> {audio.province} {audio.city}
                    </p>
                  )}
                  {audio.trail_name && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">코스:</span> {audio.trail_name}
                    </p>
                  )}
                  {audio.distance && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">거리:</span> {audio.distance}
                    </p>
                  )}
                  {audio.walking_time && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">소요시간:</span> {audio.walking_time}
                    </p>
                  )}
                  {audio.difficulty && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">난이도:</span> {audio.difficulty}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
