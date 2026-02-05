'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar } from 'lucide-react'
import { MODAL_ANIMATION } from '@/lib/constants'

interface AlreadyRecordedModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AlreadyRecordedModal({ isOpen, onClose }: AlreadyRecordedModalProps) {
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
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-sm bg-white rounded-3xl z-50 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-gray-900">알림</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                오늘은 이미 기록했어요
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                감정 기록은 하루에 한 번만 가능합니다.<br />
                내일 다시 기록해주세요!
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-gray-50">
              <button
                onClick={onClose}
                className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                확인
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
