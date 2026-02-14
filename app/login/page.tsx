'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, MessageCircle, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { BUTTON_STYLES } from '@/lib/constants'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // 이미 로그인되어 있으면 next 파라미터 또는 힐링로드ON으로 이동
        const next = searchParams.get('next') || '/healing'
        router.replace(next)
      } else {
        setIsCheckingAuth(false)
      }
    }
    checkAuth()
  }, [router, searchParams])

  const handleKakaoLogin = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      // next 파라미터가 있으면 사용, 없으면 힐링로드ON으로
      const next = searchParams.get('next') || '/healing'

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })

      if (error) {
        console.error('Kakao login error:', error)
        showToast('로그인에 실패했습니다. 다시 시도해주세요.', 'error')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      showToast('로그인 중 오류가 발생했습니다.', 'error')
      setIsLoading(false)
    }
  }

  // 인증 확인 중일 때 로딩 표시
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={32} className="animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      {/* 뒤로가기 */}
      <div className="p-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
      </div>

      {/* 로그인 카드 */}
      <div className="flex-1 flex items-center justify-center px-5 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-xl"
        >
          {/* 로고/아이콘 */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🚶‍♀️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              힐링로드 ON
            </h1>
            <p className="text-gray-500 text-sm">
              맨발 걷기와 함께하는 건강한 일상
            </p>
          </div>

          {/* 카카오 로그인 버튼 */}
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

          {/* 안내 문구 */}
          <p className="text-center text-gray-400 text-xs mt-6">
            로그인하면 감정 기록, 걷기 히스토리 등<br />
            모든 기능을 이용할 수 있어요.
          </p>

          {/* 회원가입 링크 */}
          <div className="text-center mt-6">
            <span className="text-gray-500 text-sm">아직 회원이 아니신가요? </span>
            <Link
              href="/join"
              className="text-emerald-600 text-sm font-semibold hover:underline"
            >
              회원가입
            </Link>
          </div>

          {/* 메인으로 돌아가기 */}
          <div className="text-center mt-4">
            <Link
              href="/"
              className="text-gray-400 text-sm hover:text-emerald-600 transition-colors"
            >
              둘러보기
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={32} className="animate-spin text-emerald-600" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
