'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Mail, Save, Loader2, Settings, Shield } from 'lucide-react'
import { upsertProfile } from '@/actions/profileActions'
import { useToast } from '@/components/ui/Toast'

interface UserProfile {
  nickname: string | null
  age_group: string | null
  total_walks: number
  total_duration: number
}

interface SettingsClientProps {
  user: { id: string; email?: string | null } | null
  userProfile: UserProfile | null
}

export default function SettingsClient({
  user,
  userProfile,
}: SettingsClientProps) {
  const { showToast } = useToast()
  const [nickname, setNickname] = useState(userProfile?.nickname || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    const trimmedNickname = nickname.trim()

    if (!trimmedNickname) {
      showToast('닉네임을 입력해주세요.', 'warning')
      return
    }

    if (trimmedNickname.length > 20) {
      showToast('닉네임은 20자 이내로 입력해주세요.', 'warning')
      return
    }

    setIsSaving(true)

    try {
      const result = await upsertProfile({ nickname: trimmedNickname })

      if (result.success) {
        showToast('닉네임이 저장되었습니다.', 'success')
      } else {
        showToast(result.error || '저장에 실패했습니다.', 'error')
      }
    } catch (error) {
      console.error('Save error:', error)
      showToast('저장 중 오류가 발생했습니다.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      {/* ==================== 모바일 레이아웃 (lg 미만) ==================== */}
      <div className="lg:hidden pb-20">
        {/* 헤더 */}
        <section className="bg-gradient-to-br from-green-700 via-green-800 to-emerald-900 text-white px-5 py-6">
          <div className="flex items-center gap-3">
            <Link
              href="/mypage"
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-2">
              <Settings size={24} />
              <h1 className="text-xl font-bold">설정</h1>
            </div>
          </div>
        </section>

        {/* 프로필 설정 */}
        <section className="px-5 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <User size={20} className="text-green-600" />
              프로필 설정
            </h2>

            {/* 이메일 (읽기 전용) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-1" />
                이메일
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                카카오 계정과 연동된 이메일입니다.
              </p>
            </div>

            {/* 닉네임 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                닉네임
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                maxLength={20}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">
                20자 이내로 입력해주세요. ({nickname.length}/20)
              </p>
            </div>

            {/* 저장 버튼 */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-green-700 hover:to-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save size={20} />
                  저장하기
                </>
              )}
            </button>
          </motion.div>
        </section>

        {/* 계정 정보 */}
        <section className="px-5 py-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Shield size={20} className="text-green-600" />
              계정 정보
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">로그인 방식</span>
                <span className="font-medium text-gray-900">카카오 로그인</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">가입일</span>
                <span className="font-medium text-gray-900">-</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 마이페이지로 돌아가기 */}
        <section className="px-5 mt-4">
          <Link
            href="/mypage"
            className="block w-full py-4 bg-white text-green-700 border border-green-200 rounded-2xl font-bold text-center shadow-md hover:bg-green-50 transition-colors"
          >
            마이페이지로 돌아가기
          </Link>
        </section>
      </div>

      {/* ==================== PC 레이아웃 (lg 이상) ==================== */}
      <div className="hidden lg:block min-h-screen bg-gray-100">
        <div className="max-w-3xl mx-auto py-10 px-6">
          {/* 페이지 헤더 */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/mypage"
              className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">설정</h1>
              <p className="text-gray-500 text-sm mt-1">프로필 및 계정 정보를 관리합니다</p>
            </div>
          </div>

          {/* 프로필 설정 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm mb-6"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <User size={20} className="text-green-600" />
              </div>
              프로필 설정
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {/* 이메일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">
                  카카오 계정과 연동된 이메일
                </p>
              </div>

              {/* 닉네임 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  maxLength={20}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  20자 이내 ({nickname.length}/20)
                </p>
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:from-green-700 hover:to-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    저장하기
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* 계정 정보 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-green-600" />
              </div>
              계정 정보
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">로그인 방식</p>
                <p className="font-semibold text-gray-900">카카오 로그인</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">가입일</p>
                <p className="font-semibold text-gray-900">-</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
