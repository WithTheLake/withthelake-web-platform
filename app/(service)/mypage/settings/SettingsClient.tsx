'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Mail, Save, Loader2 } from 'lucide-react'
import { upsertProfile } from '@/actions/profileActions'

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
  const [nickname, setNickname] = useState(userProfile?.nickname || '')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSave = async () => {
    const trimmedNickname = nickname.trim()

    if (!trimmedNickname) {
      setSaveMessage({ type: 'error', text: '닉네임을 입력해주세요.' })
      return
    }

    if (trimmedNickname.length > 20) {
      setSaveMessage({ type: 'error', text: '닉네임은 20자 이내로 입력해주세요.' })
      return
    }

    setIsSaving(true)
    setSaveMessage(null)

    try {
      const result = await upsertProfile({ nickname: trimmedNickname })

      if (result.success) {
        setSaveMessage({ type: 'success', text: '닉네임이 저장되었습니다.' })
      } else {
        setSaveMessage({ type: 'error', text: result.error || '저장에 실패했습니다.' })
      }
    } catch (error) {
      console.error('Save error:', error)
      setSaveMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-6">
        <div className="flex items-center gap-3">
          <Link
            href="/mypage"
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold">설정</h1>
        </div>
      </section>

      {/* 프로필 설정 */}
      <section className="px-5 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <User size={20} className="text-purple-600" />
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
              onChange={(e) => {
                setNickname(e.target.value)
                setSaveMessage(null)
              }}
              placeholder="닉네임을 입력하세요"
              maxLength={20}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">
              20자 이내로 입력해주세요. ({nickname.length}/20)
            </p>
          </div>

          {/* 저장 메시지 */}
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 p-3 rounded-lg text-sm ${
                saveMessage.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {saveMessage.text}
            </motion.div>
          )}

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold mb-4">계정 정보</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">로그인 방식</span>
              <span className="font-medium">카카오 로그인</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">가입일</span>
              <span className="font-medium">-</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
