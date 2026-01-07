'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play } from 'lucide-react'
import type { AudioItem } from '@/types/audio'

interface WalkGuideModalProps {
  isOpen: boolean
  onClose: () => void
  walkGuides: AudioItem[]
  onSelectAudio: (item: AudioItem) => void
}

export default function WalkGuideModal({
  isOpen,
  onClose,
  walkGuides,
  onSelectAudio,
}: WalkGuideModalProps) {
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

  const handleSelect = (item: AudioItem) => {
    onSelectAudio(item)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
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
                onClick={onClose}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                aria-label="닫기"
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
                      onClick={() => handleSelect(item)}
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
  )
}
