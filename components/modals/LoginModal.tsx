'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleKakaoLogin = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error('Kakao login error:', error)
        alert('로그인에 실패했습니다. 다시 시도해주세요.')
        setIsLoading(false)
      }
      // 성공 시 리다이렉트되므로 별도 처리 불필요
    } catch (error) {
      console.error('Login error:', error)
      alert('로그인 중 오류가 발생했습니다.')
      setIsLoading(false)
    }
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
            className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
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
                  className="w-full py-4 bg-[#FEE500] text-[#191919] rounded-xl font-semibold text-base hover:bg-[#FDD800] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
