'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveEmotionRecord } from '@/actions/emotionActions'
import LoginModal from './LoginModal'
import {
  PRE_EMOTIONS,
  HELPFUL_ACTIONS,
  POSITIVE_CHANGES,
  EXPERIENCE_LOCATIONS,
} from '@/types/emotion'
import type { User } from '@/types/user'

interface EmotionRecordModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  preEmotion: string
  emotionReason: string
  helpfulActions: string[]
  positiveChanges: string[]
  selfMessage: string
  location: string
  customLocation: string
}

const TOTAL_STEPS = 5

export default function EmotionRecordModal({ isOpen, onClose }: EmotionRecordModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    preEmotion: '',
    emotionReason: '',
    helpfulActions: [],
    positiveChanges: [],
    selfMessage: '',
    location: '',
    customLocation: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
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

  // 모달 열림/닫힘 시 처리
  useEffect(() => {
    if (isOpen) {
      // 모달 열릴 때 배경 스크롤 방지
      document.body.style.overflow = 'hidden'
    } else {
      // 모달 닫힐 때 스크롤 복원 및 폼 초기화
      document.body.style.overflow = ''
      setCurrentStep(1)
      setFormData({
        preEmotion: '',
        emotionReason: '',
        helpfulActions: [],
        positiveChanges: [],
        selfMessage: '',
        location: '',
        customLocation: '',
      })
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleArrayItem = (field: 'helpfulActions' | 'positiveChanges', item: string) => {
    setFormData(prev => {
      const current = prev[field]
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter(i => i !== item) }
      } else {
        return { ...prev, [field]: [...current, item] }
      }
    })
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.preEmotion !== ''
      case 2:
        return formData.emotionReason.trim() !== ''
      case 3:
        return formData.helpfulActions.length > 0
      case 4:
        return formData.positiveChanges.length > 0
      case 5:
        return formData.selfMessage.trim() !== ''
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    // 로그인 확인
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }

    setIsSubmitting(true)

    try {
      // 체험 장소 처리
      const experienceLocation = formData.location
        ? (formData.location === '기타' ? formData.customLocation : formData.location)
        : undefined

      // EAMRA 프레임워크에 맞게 데이터 전송
      const result = await saveEmotionRecord({
        emotionType: formData.preEmotion,
        emotionReason: formData.emotionReason,
        helpfulActions: formData.helpfulActions,
        positiveChanges: formData.positiveChanges,
        selfMessage: formData.selfMessage,
        experienceLocation,
      })

      if (result.success) {
        alert('감정이 기록되었습니다!')
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-2">
                E. 감정 | Emotion
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                걷기 전 가장 크게 느꼈던 감정 1가지를 선택하세요
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {PRE_EMOTIONS.map((emotion) => (
                <button
                  key={emotion.type}
                  onClick={() => setFormData(prev => ({ ...prev, preEmotion: emotion.type }))}
                  className={`flex flex-col items-center p-4 rounded-2xl transition-all ${
                    formData.preEmotion === emotion.type
                      ? 'bg-purple-100 border-2 border-purple-500 shadow-md'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <span className="text-3xl mb-2">{emotion.emoji}</span>
                  <span className="text-sm font-medium">{emotion.label}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
                M. 의미 | Meaning
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                왜 그런 감정을 느꼈는지 적어주세요
              </h3>
            </div>
            <textarea
              value={formData.emotionReason}
              onChange={(e) => setFormData(prev => ({ ...prev, emotionReason: e.target.value }))}
              placeholder="오늘 있었던 일, 마음에 남는 생각 등을 자유롭게 적어주세요..."
              className="w-full h-40 p-4 border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base leading-relaxed"
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-2">
                A. 행동 | Action
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                오늘 나의 긍정적 감정에 도움이 된 행동을 모두 선택하세요
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {HELPFUL_ACTIONS.map((action) => (
                <button
                  key={action.type}
                  onClick={() => toggleArrayItem('helpfulActions', action.type)}
                  className={`p-4 rounded-2xl transition-all text-center ${
                    formData.helpfulActions.includes(action.type)
                      ? 'bg-green-100 border-2 border-green-500 shadow-md'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <span className="text-sm font-medium">{action.label}</span>
                  {formData.helpfulActions.includes(action.type) && (
                    <Check size={16} className="inline-block ml-1 text-green-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-2">
                R. 성찰 | Reflect
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                행동 후, 어떤 긍정적인 변화가 느껴지는지 모두 체크해주세요
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {POSITIVE_CHANGES.map((change) => (
                <button
                  key={change.type}
                  onClick={() => toggleArrayItem('positiveChanges', change.type)}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${
                    formData.positiveChanges.includes(change.type)
                      ? 'bg-amber-100 border-2 border-amber-500 shadow-md'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl">{change.emoji}</span>
                  <span className="text-sm font-medium">{change.label}</span>
                  {formData.positiveChanges.includes(change.type) && (
                    <Check size={16} className="ml-auto text-amber-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium mb-2">
                A. 고정 | Anchor
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                오늘 하루, 나를 위한 한마디를 적어주세요
              </h3>
            </div>
            <textarea
              value={formData.selfMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, selfMessage: e.target.value }))}
              placeholder="오늘의 나에게 전하고 싶은 말을 적어주세요..."
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base leading-relaxed"
            />

            {/* 체험 장소 (선택) */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                힐링로드ON 체험 장소 (선택)
              </h4>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_LOCATIONS.map((location) => (
                  <button
                    key={location}
                    onClick={() => setFormData(prev => ({ ...prev, location }))}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      formData.location === location
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
              {formData.location === '기타' && (
                <input
                  type="text"
                  value={formData.customLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, customLocation: e.target.value }))}
                  placeholder="장소를 입력해주세요"
                  className="mt-3 w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - 살짝 투명하게 뒤 페이지가 보이도록 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={onClose}
            />

            {/* Center Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:max-h-[90vh] bg-white rounded-3xl z-50 flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-purple-600 to-blue-600">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌿</span>
                  <div>
                    <h2 className="text-lg font-bold text-white">힐링로드ON</h2>
                    <p className="text-xs text-purple-100">감정기록노트</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="px-6 py-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    {currentStep} / {TOTAL_STEPS}
                  </span>
                  <span className="text-sm font-medium text-purple-600">
                    {Math.round((currentStep / TOTAL_STEPS) * 100)}% 완료
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>

                {/* 로그인 안내 */}
                {!isCheckingAuth && !user && currentStep === TOTAL_STEPS && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-800">
                      감정 기록을 저장하려면 로그인이 필요합니다.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t bg-white">
                <div className="flex gap-3">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrev}
                      className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft size={20} />
                      이전
                    </button>
                  )}

                  {currentStep < TOTAL_STEPS ? (
                    <button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      다음
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!isStepValid() || isSubmitting}
                      className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          저장 중...
                        </>
                      ) : (
                        <>
                          <Check size={20} />
                          기록 완료
                        </>
                      )}
                    </button>
                  )}
                </div>
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
