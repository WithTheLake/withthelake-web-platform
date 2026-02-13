'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { MODAL_ANIMATION, BUTTON_STYLES } from '@/lib/constants'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  focusOnComment?: boolean // 로그인 후 댓글 입력창에 포커스할지 여부
  returnAction?: string // 로그인 후 수행할 액션 (예: 'emotion')
}

export default function LoginModal({ isOpen, onClose, focusOnComment = false, returnAction }: LoginModalProps) {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

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

  const handleKakaoLogin = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      // 현재 페이지 경로를 next 파라미터로 전달 (댓글 포커스, 로그인 후 액션 플래그 포함)
      let currentPath = window.location.pathname + window.location.search
      if (focusOnComment) {
        currentPath += (currentPath.includes('?') ? '&' : '?') + 'focusComment=1'
      }
      if (returnAction) {
        currentPath += (currentPath.includes('?') ? '&' : '?') + `action=${returnAction}`
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(currentPath)}`,
        },
      })

      if (error) {
        console.error('Kakao login error:', error)
        showToast('로그인에 실패했습니다. 다시 시도해주세요.', 'error')
        setIsLoading(false)
      }
      // 성공 시 리다이렉트되므로 별도 처리 불필요
    } catch (error) {
      console.error('Login error:', error)
      showToast('로그인 중 오류가 발생했습니다.', 'error')
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            {...MODAL_ANIMATION.backdrop}
            className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={MODAL_ANIMATION.spring}
            className="fixed inset-0 flex items-center justify-center z-[60] p-5"
          >
            <div
              className="bg-white rounded-3xl w-full max-w-sm p-6 relative shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              {/* Content */}
              <div className="text-center pt-4">
                <div className="text-5xl mb-4">🚶‍♀️</div>
                <h2 className="text-xl font-bold mb-2">로그인이 필요해요</h2>
                <p className="text-gray-600 text-sm mb-6">
                  감정 기록을 저장하고 나의 걷기 히스토리를
                  <br />
                  확인하려면 로그인해주세요.
                </p>

                {/* Kakao Login Button */}
                <button
                  onClick={handleKakaoLogin}
                  disabled={isLoading}
                  className={`w-full py-4 ${BUTTON_STYLES.kakaoLogin} rounded-xl font-semibold text-base transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      로그인 중...
                    </>
                  ) : (
                    <>
                      <MessageCircle size={20} />
                      카카오로 시작하기
                    </>
                  )}
                </button>

                {/* Skip Button */}
                <button
                  onClick={onClose}
                  className="mt-4 text-gray-500 text-sm hover:text-gray-700 transition-colors"
                >
                  나중에 할게요
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
