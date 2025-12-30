'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveEmotionRecord } from '@/actions/emotionActions'
import LoginModal from './LoginModal'

interface EmotionRecordSheetProps {
  isOpen: boolean
  onClose: () => void
}

const EMOTIONS = [
  { type: 'happy', emoji: '😊', label: '행복해요' },
  { type: 'calm', emoji: '😌', label: '평온해요' },
  { type: 'grateful', emoji: '🙏', label: '감사해요' },
  { type: 'energetic', emoji: '💪', label: '활기차요' },
  { type: 'tired', emoji: '😴', label: '피곤해요' },
  { type: 'sad', emoji: '😢', label: '슬퍼요' },
  { type: 'anxious', emoji: '😰', label: '불안해요' },
  { type: 'angry', emoji: '😠', label: '화나요' },
]

export default function EmotionRecordSheet({ isOpen, onClose }: EmotionRecordSheetProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(3)
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsCheckingAuth(false)
    }

    if (isOpen) {
      checkAuth()
    }
  }, [isOpen])

  // 인증 상태 변경 리스너
  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'SIGNED_IN') {
        setIsLoginModalOpen(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async () => {
    if (!selectedEmotion) {
      alert('감정을 선택해주세요.')
      return
    }

    // 로그인 확인
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }

    setIsSubmitting(true)

    try {
      const result = await saveEmotionRecord({
        emotionType: selectedEmotion,
        intensity,
        note: note.trim() || undefined,
      })

      if (result.success) {
        alert('감정이 기록되었습니다!')
        // 폼 초기화
        setSelectedEmotion(null)
        setIntensity(3)
        setNote('')
        onClose()
      } else if (result.error === 'LOGIN_REQUIRED') {
        setIsLoginModalOpen(true)
      } else {
        alert('기록 저장에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedEmotion(null)
    setIntensity(3)
    setNote('')
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-40 z-50"
              onClick={onClose}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-hidden"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-4 border-b">
                <h2 className="text-xl font-bold">오늘의 감정 기록</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 py-6 overflow-y-auto max-h-[calc(85vh-140px)]">
                {/* 감정 선택 */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold mb-3">지금 어떤 감정이 드시나요?</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {EMOTIONS.map((emotion) => (
                      <button
                        key={emotion.type}
                        onClick={() => setSelectedEmotion(emotion.type)}
                        className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                          selectedEmotion === emotion.type
                            ? 'bg-purple-100 border-2 border-purple-500'
                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-2xl mb-1">{emotion.emoji}</span>
                        <span className="text-xs font-medium">{emotion.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 감정 강도 */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold mb-3">
                    감정의 강도는 어느 정도인가요? <span className="text-purple-600">{intensity}</span>
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">약함</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={intensity}
                      onChange={(e) => setIntensity(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <span className="text-sm text-gray-500">강함</span>
                  </div>
                  <div className="flex justify-between mt-2 px-6">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setIntensity(num)}
                        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                          intensity === num
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 메모 */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold mb-3">추가로 기록하고 싶은 것이 있나요?</h3>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="오늘의 걷기는 어땠나요? 자유롭게 적어주세요."
                    className="w-full h-24 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                  />
                </div>

                {/* 로그인 안내 */}
                {!isCheckingAuth && !user && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-800">
                      감정 기록을 저장하려면 로그인이 필요합니다.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t bg-white">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedEmotion || isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    '감정 기록하기'
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
