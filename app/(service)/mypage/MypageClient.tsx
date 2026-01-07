'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Calendar, Heart, LogOut, ChevronRight, Clock, Sparkles, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import LoginModal from '@/components/modals/LoginModal'
import WeeklyEmotionReport from '@/components/report/WeeklyEmotionReport'
import { EMOTION_LABELS, ACTION_LABELS, CHANGE_LABELS } from '@/types/emotion'
import { formatRelativeTime } from '@/lib/utils/format'

interface EmotionRecord {
  id: string
  emotion_type: string
  emotion_reason: string | null
  helpful_actions: string[] | null
  positive_changes: string[] | null
  self_message: string | null
  experience_location: string | null
  note: string | null // 하위 호환성
  created_at: string
}

interface UserProfile {
  nickname: string | null
  age_group: string | null
  total_walks: number
  total_duration: number
}

interface MypageClientProps {
  isAuthenticated: boolean
  user: { id: string; email?: string | null } | null
  emotionRecords: EmotionRecord[]
  userProfile: UserProfile | null
}

export default function MypageClient({
  isAuthenticated,
  user,
  emotionRecords,
  userProfile,
}: MypageClientProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      // 로그아웃 후 메인 페이지로 이동
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      alert('로그아웃에 실패했습니다.')
      setIsLoggingOut(false)
    }
  }

  const formatTimeOfDay = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 감정 통계 계산
  const emotionStats = emotionRecords.reduce((acc, record) => {
    const type = record.emotion_type
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topEmotions = Object.entries(emotionStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  // 비로그인 상태
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* 헤더 */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-8">
          <h1 className="text-2xl font-bold">마이페이지</h1>
          <p className="text-purple-100 mt-1">로그인하고 나의 기록을 확인하세요</p>
        </section>

        {/* 로그인 유도 */}
        <section className="px-5 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 text-center shadow-sm"
          >
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={40} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">로그인이 필요해요</h2>
            <p className="text-gray-600 mb-6">
              감정 기록과 걷기 히스토리를
              <br />
              확인하려면 로그인해주세요.
            </p>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full py-4 bg-[#FEE500] text-[#191919] rounded-xl font-semibold text-base hover:bg-[#FDD800] transition-colors"
            >
              카카오로 로그인하기
            </button>
          </motion.div>
        </section>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </div>
    )
  }

  // 로그인 상태
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {userProfile?.nickname || '힐링로드 ON 사용자'}
            </h1>
            <p className="text-purple-100 mt-1 text-sm">
              {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/mypage/settings"
              className="p-2 bg-black bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
              title="설정"
            >
              <Settings size={18} />
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 bg-black bg-opacity-20 rounded-full text-sm hover:bg-opacity-30 transition-colors flex items-center gap-1"
            >
              <LogOut size={16} />
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </button>
          </div>
        </div>
      </section>

      {/* 통계 카드 */}
      <section className="px-5 py-5">
        <div className="grid grid-cols-2 gap-3">
          {/* 총 기록 수 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart size={16} className="text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">감정 기록</span>
            </div>
            <p className="text-2xl font-bold">{emotionRecords.length}회</p>
          </motion.div>

          {/* 이번 주 기록 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar size={16} className="text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">이번 주</span>
            </div>
            <p className="text-2xl font-bold">
              {emotionRecords.filter((r) => {
                const recordDate = new Date(r.created_at)
                const now = new Date()
                // 이번 주 월요일 00:00:00 계산
                const dayOfWeek = now.getDay() // 0=일, 1=월, ..., 6=토
                const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // 일요일이면 6일 전, 아니면 (요일-1)일 전
                const monday = new Date(now)
                monday.setDate(now.getDate() - diffToMonday)
                monday.setHours(0, 0, 0, 0)
                return recordDate >= monday
              }).length}
              회
            </p>
          </motion.div>
        </div>
      </section>

      {/* 자주 느끼는 감정 */}
      {topEmotions.length > 0 && (
        <section className="px-5 py-3">
          <h2 className="text-lg font-bold mb-3">자주 느끼는 감정</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <div className="flex justify-around">
              {topEmotions.map(([type, count], index) => {
                const emotion = EMOTION_LABELS[type] || { emoji: '😊', label: type }
                return (
                  <div key={type} className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="text-4xl mb-1"
                    >
                      {emotion.emoji}
                    </motion.div>
                    <p className="text-sm font-medium">{emotion.label}</p>
                    <p className="text-xs text-gray-500">{count}회</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </section>
      )}

      {/* 최근 감정 기록 */}
      <section className="px-5 py-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">최근 감정 기록</h2>
          {emotionRecords.length > 0 && (
            <Link
              href="/mypage/records"
              className="text-sm text-purple-600 font-medium flex items-center gap-1 hover:underline"
            >
              전체보기
              <ChevronRight size={16} />
            </Link>
          )}
        </div>

        {emotionRecords.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8 text-center shadow-sm"
          >
            <div className="text-4xl mb-3">📝</div>
            <p className="text-gray-500">아직 기록된 감정이 없어요</p>
            <p className="text-sm text-gray-400 mt-1">
              힐링로드 ON에서 오늘의 감정을 기록해보세요
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {emotionRecords.slice(0, 5).map((record, index) => {
                const emotion = EMOTION_LABELS[record.emotion_type] || {
                  emoji: '😊',
                  label: record.emotion_type,
                }
                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{emotion.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{emotion.label}</span>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock size={12} />
                            {formatRelativeTime(record.created_at)} {formatTimeOfDay(record.created_at)}
                          </div>
                        </div>
                        {/* 도움이 된 행동 (객관식) */}
                        {record.helpful_actions && record.helpful_actions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {record.helpful_actions.slice(0, 3).map((action) => (
                              <span
                                key={action}
                                className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full"
                              >
                                {ACTION_LABELS[action] || action}
                              </span>
                            ))}
                            {record.helpful_actions.length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{record.helpful_actions.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        {/* 긍정적 변화 (객관식) */}
                        {record.positive_changes && record.positive_changes.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {record.positive_changes.slice(0, 3).map((change) => {
                              const changeData = CHANGE_LABELS[change] || { emoji: '✨', label: change }
                              return (
                                <span
                                  key={change}
                                  className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                                >
                                  {changeData.emoji} {changeData.label}
                                </span>
                              )
                            })}
                            {record.positive_changes.length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{record.positive_changes.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* 주간 보고서 버튼 */}
      <section className="px-5 py-3">
        <button
          onClick={() => setIsReportOpen(true)}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-amber-600 hover:to-orange-600 transition-colors"
        >
          <Sparkles size={20} />
          주간 감정 보고서 보기
        </button>
      </section>

      {/* 힐링로드 ON 바로가기 */}
      <section className="px-5 py-3">
        <a
          href="/healing"
          className="block w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-center hover:from-purple-700 hover:to-blue-700 transition-colors"
        >
          힐링로드 ON 시작하기
        </a>
      </section>

      {/* 주간 감정 보고서 모달 */}
      <WeeklyEmotionReport
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  )
}
