'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play } from 'lucide-react'
import { MODAL_ANIMATION } from '@/lib/constants'
import type { AudioItem } from '@/types/audio'

interface AffirmationModalProps {
  isOpen: boolean
  onClose: () => void
  affirmations: AudioItem[]
  onSelectAudio: (item: AudioItem) => void
}

export default function AffirmationModal({
  isOpen,
  onClose,
  affirmations,
  onSelectAudio,
}: AffirmationModalProps) {
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

  // 서브카테고리 목록 추출
  const subcategories = Array.from(
    new Set(affirmations.map(a => a.subcategory).filter(Boolean))
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            {...MODAL_ANIMATION.backdrop}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            {...MODAL_ANIMATION.content}
            transition={MODAL_ANIMATION.spring}
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
                onClick={onClose}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                aria-label="닫기"
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
            {subcategories.length > 0 && (
              <div className="px-4 py-2 border-b bg-white">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {subcategories.map((sub) => (
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
                      onClick={() => handleSelect(item)}
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
  )
}
