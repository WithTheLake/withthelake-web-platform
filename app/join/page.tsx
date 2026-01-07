'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, MessageCircle, ArrowLeft, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function JoinPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // 이미 로그인되어 있으면 마이페이지로 이동
        router.replace('/mypage')
      } else {
        setIsCheckingAuth(false)
      }
    }
    checkAuth()
  }, [router])

  const handleKakaoJoin = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/mypage`,
        },
      })

      if (error) {
        console.error('Kakao join error:', error)
        alert('회원가입에 실패했습니다. 다시 시도해주세요.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Join error:', error)
      alert('회원가입 중 오류가 발생했습니다.')
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

      {/* 회원가입 카드 */}
      <div className="flex-1 flex items-center justify-center px-5 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-xl"
        >
          {/* 로고/아이콘 */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus size={40} className="text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              회원가입
            </h1>
            <p className="text-gray-500 text-sm">
              힐링로드 ON과 함께 건강한 일상을 시작하세요
            </p>
          </div>

          {/* 카카오 회원가입 버튼 */}
          <button
            onClick={handleKakaoJoin}
            disabled={isLoading}
            className="w-full py-4 bg-[#FEE500] text-[#191919] rounded-xl font-semibold text-base hover:bg-[#FDD800] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                가입 중...
              </>
            ) : (
              <>
                <MessageCircle size={20} />
                카카오로 간편 가입하기
              </>
            )}
          </button>

          {/* 향후 추가될 회원가입 방법들을 위한 공간 */}
          {/*
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">또는</span>
            </div>
          </div>

          <button className="w-full py-4 bg-[#03C75A] text-white rounded-xl font-semibold">
            네이버로 가입하기
          </button>

          <button className="w-full py-4 border border-gray-300 rounded-xl font-semibold mt-3">
            Google로 가입하기
          </button>

          <button className="w-full py-4 border border-gray-300 rounded-xl font-semibold mt-3">
            이메일로 가입하기
          </button>
          */}

          {/* 안내 문구 */}
          <p className="text-center text-gray-400 text-xs mt-6">
            가입 시 <Link href="/terms" className="text-emerald-600 hover:underline">이용약관</Link> 및{' '}
            <Link href="/privacy" className="text-emerald-600 hover:underline">개인정보처리방침</Link>에<br />
            동의하는 것으로 간주됩니다.
          </p>

          {/* 로그인 링크 */}
          <div className="text-center mt-6">
            <span className="text-gray-500 text-sm">이미 회원이신가요? </span>
            <Link
              href="/login"
              className="text-emerald-600 text-sm font-semibold hover:underline"
            >
              로그인
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
