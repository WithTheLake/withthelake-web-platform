'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, ChevronRight, Settings, BarChart3, Calendar, Flame } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import LoginModal from '@/components/modals/LoginModal'
import WeeklyEmotionReport from '@/components/report/WeeklyEmotionReport'
import { EMOTION_LABELS, ACTION_LABELS, CHANGE_LABELS } from '@/types/emotion'
import { formatRelativeTime } from '@/lib/utils/format'
import { useToast } from '@/components/ui/Toast'

interface EmotionRecord {
  id: string
  emotion_type: string
  intensity?: number
  emotion_reason?: string | null
  helpful_actions?: string[] | null
  positive_changes?: string[] | null
  self_message?: string | null
  experience_location?: string | null
  note?: string | null
  created_at: string
}

interface UserProfile {
  nickname: string | null
  gender: string | null
  age_group: string | null
}

interface MypageClientProps {
  isAuthenticated: boolean
  user: { id: string; email?: string | null } | null
  emotionRecords: EmotionRecord[]
  userProfile: UserProfile | null
  isAdmin?: boolean
  hasGeminiKey?: boolean
}

export default function MypageClient({
  isAuthenticated,
  user,
  emotionRecords,
  userProfile,
  isAdmin = false,
  hasGeminiKey = false,
}: MypageClientProps) {
  const { showToast } = useToast()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)

  const handleLogout = async () => {
    if (!confirm('로그아웃 하시겠습니까?')) return

    setIsLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      showToast('로그아웃에 실패했습니다.', 'error')
      setIsLoggingOut(false)
    }
  }

  const handleOpenReport = () => {
    if (!hasGeminiKey) {
      showToast('현재 AI 서비스를 이용할 수 없습니다.', 'warning')
      return
    }
    setIsReportOpen(true)
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

  // 이번 주 기록 수
  const thisWeekCount = emotionRecords.filter((r) => {
    const recordDate = new Date(r.created_at)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const monday = new Date(now)
    monday.setDate(now.getDate() - diffToMonday)
    monday.setHours(0, 0, 0, 0)
    return recordDate >= monday
  }).length

  // 지난주 기록 수 계산 (PC 레이아웃용)
  const lastWeekCount = emotionRecords.filter((r) => {
    const recordDate = new Date(r.created_at)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const thisMonday = new Date(now)
    thisMonday.setDate(now.getDate() - diffToMonday)
    thisMonday.setHours(0, 0, 0, 0)
    const lastMonday = new Date(thisMonday)
    lastMonday.setDate(thisMonday.getDate() - 7)
    const lastSunday = new Date(thisMonday)
    lastSunday.setDate(thisMonday.getDate() - 1)
    lastSunday.setHours(23, 59, 59, 999)
    return recordDate >= lastMonday && recordDate <= lastSunday
  }).length

  // 연속 기록 일수 계산 (PC 레이아웃용)
  const calculateStreak = () => {
    if (emotionRecords.length === 0) return 0
    const sortedRecords = [...emotionRecords].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const record of sortedRecords) {
      const recordDate = new Date(record.created_at)
      recordDate.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((currentDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 0 || diffDays === 1) {
        if (diffDays === 1) streak++
        currentDate = recordDate
      } else {
        break
      }
    }
    // 오늘 기록이 있으면 +1
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const hasToday = sortedRecords.some((r) => {
      const d = new Date(r.created_at)
      d.setHours(0, 0, 0, 0)
      return d.getTime() === today.getTime()
    })
    return hasToday ? streak + 1 : streak
  }
  const streakDays = calculateStreak()

  // 이번 주 감정 데이터 (PC 레이아웃 미니 그래프용) - 월~일 기준
  const getThisWeekEmotions = () => {
    const days = []
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const monday = new Date(now)
    monday.setDate(now.getDate() - diffToMonday)
    monday.setHours(0, 0, 0, 0)

    const dayLabels = ['월', '화', '수', '목', '금', '토', '일']
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      date.setHours(0, 0, 0, 0)
      const dayRecords = emotionRecords.filter((r) => {
        const rd = new Date(r.created_at)
        rd.setHours(0, 0, 0, 0)
        return rd.getTime() === date.getTime()
      })
      days.push({
        day: dayLabels[i],
        count: dayRecords.length,
        mainEmotion: dayRecords[0]?.emotion_type || null,
      })
    }
    return days
  }
  const thisWeekDays = getThisWeekEmotions()
  const weekDiff = thisWeekCount - lastWeekCount

  // 비로그인 상태
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center p-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 text-center shadow-xl max-w-sm w-full"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={48} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">로그인이 필요해요</h2>
          <p className="text-gray-600 mb-8">
            감정 기록과 걷기 히스토리를 확인하려면 로그인해주세요.
          </p>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="w-full py-4 bg-[#FEE500] text-[#191919] rounded-xl font-semibold text-lg hover:bg-[#FDD800] transition-colors"
          >
            카카오로 로그인하기
          </button>
          <Link href="/healing" className="block mt-4 text-gray-500 text-sm hover:text-gray-700">
            힐링로드 ON 둘러보기 →
          </Link>
        </motion.div>
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </div>
    )
  }

  // 로그인 상태 - 반응형 레이아웃
  return (
    <div>
      {/* ==================== 모바일 레이아웃 (lg 미만) ==================== */}
      <div className="lg:hidden pb-20 min-h-screen bg-gray-100">
        {/* 헤더 - 프로필 정보 */}
        <section className="bg-[#5eb3e4] text-white px-5 py-8 pb-12">
          <div className="flex items-center gap-4 pl-2">
            <div className="flex-1">
              <h1 className="text-xl font-bold">{userProfile?.nickname || '힐링로드 사용자'}</h1>
              <p className="text-white/70 text-sm mt-1">{user?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/mypage/settings" className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30">
                <Settings size={18} />
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 cursor-pointer"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* 통계 카드 */}
        <section className="px-5 -mt-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-gray-800">{emotionRecords.length}</p>
              <p className="text-gray-500 text-sm mt-1">총 기록</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-gray-800">{thisWeekCount}</p>
              <p className="text-gray-500 text-sm mt-1">이번 주</p>
            </div>
          </div>
        </section>

        {/* 자주 느끼는 감정 */}
        {topEmotions.length > 0 && (
          <section className="px-5 mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">자주 느끼는 감정</h2>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex justify-around">
                {topEmotions.map(([type, count], index) => {
                  const emotion = EMOTION_LABELS[type] || { emoji: '😊', label: type }
                  const sizes = ['text-5xl', 'text-4xl', 'text-3xl']
                  return (
                    <motion.div
                      key={type}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className={`${sizes[index]} mb-2`}>{emotion.emoji}</div>
                      <p className="font-medium text-gray-900">{emotion.label}</p>
                      <p className="text-sm text-gray-500">{count}회</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* 주간 보고서 CTA */}
        <section className="px-5 mt-6">
          <button
            onClick={handleOpenReport}
            className="w-full p-5 bg-gradient-to-r from-[#6ec4f0] to-[#4a9fd4] rounded-2xl text-white flex items-center justify-between shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BarChart3 size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">주간 감정 보고서</p>
                <p className="text-white/70 text-sm">AI가 분석한 나의 감정 변화</p>
              </div>
            </div>
            <ChevronRight size={24} />
          </button>
        </section>

        {/* 최근 기록 */}
        <section className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">최근 감정 기록</h2>
            <Link href="/mypage/records" className="text-[#5eb3e4] text-sm font-medium">
              전체보기 →
            </Link>
          </div>

          {emotionRecords.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-gray-500">아직 기록된 감정이 없어요</p>
              <Link
                href="/healing"
                className="inline-block mt-4 px-6 py-3 bg-[#5eb3e4] text-white rounded-xl font-medium"
              >
                기록 시작하기
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {emotionRecords.slice(0, 5).map((record, index) => {
                  const emotion = EMOTION_LABELS[record.emotion_type] || { emoji: '😊', label: record.emotion_type }
                  return (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{emotion.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900">{emotion.label}</span>
                            <span className="text-xs text-gray-400">
                              {formatRelativeTime(record.created_at)}
                            </span>
                          </div>
                          {record.helpful_actions && record.helpful_actions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {record.helpful_actions.slice(0, 3).map((action) => (
                                <span key={action} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
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
                          {record.positive_changes && record.positive_changes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {record.positive_changes.slice(0, 3).map((change) => {
                                const changeData = CHANGE_LABELS[change] || { emoji: '✨', label: change }
                                return (
                                  <span key={change} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
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

      </div>

      {/* ==================== PC 레이아웃 (lg 이상) ==================== */}
      <div className="hidden lg:block bg-gray-100 min-h-[calc(100vh-5rem)]">
        {/* 2단 레이아웃: 좌측 사이드바 + 우측 메인 */}
        <div className="flex min-h-[calc(100vh-5rem)]">
          {/* 좌측 사이드바 */}
          <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
            {/* 프로필 영역 */}
            <div className="px-6 pt-8 pb-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{userProfile?.nickname || '힐링로드 사용자'}</h2>
              <p className="text-sm text-gray-500 mt-1 truncate">{user?.email}</p>
              {streakDays > 0 && (
                <div className="flex items-center justify-center gap-1 mt-3 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mx-auto w-fit">
                  <Flame size={14} />
                  {streakDays}일 연속 기록 중!
                </div>
              )}
            </div>

            {/* 통계 */}
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">나의 기록</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">총 기록</span>
                  <span className="text-2xl font-bold text-green-600">{emotionRecords.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">이번 주</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-amber-600">{thisWeekCount}</span>
                    {weekDiff !== 0 && (
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                        weekDiff > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {weekDiff > 0 ? `+${weekDiff}` : weekDiff}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">연속 기록</span>
                  <span className="text-2xl font-bold text-purple-600">{streakDays}일</span>
                </div>
              </div>
            </div>

            {/* 메뉴 */}
            <nav className="p-4 flex-1">
              <Link href="/mypage/records" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors">
                <Calendar size={20} />
                <span className="font-medium">전체 기록</span>
              </Link>
              <button
                onClick={handleOpenReport}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors"
              >
                <BarChart3 size={20} />
                <span className="font-medium">주간 보고서</span>
              </button>
              <Link href="/mypage/settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors">
                <Settings size={20} />
                <span className="font-medium">설정</span>
              </Link>
            </nav>

            {/* 로그아웃 */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={18} />
                <span>로그아웃</span>
              </button>
            </div>
          </aside>

          {/* 우측 메인 콘텐츠 */}
          <main className="flex-1 p-8 overflow-auto">
            {/* 상단 카드 그리드 */}
            <div className="grid grid-cols-9 gap-6 mb-8">
              {/* 자주 느끼는 감정 */}
              <div className="col-span-3 bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">자주 느끼는 감정</h3>
                {topEmotions.length > 0 ? (
                  <div className="flex justify-around items-center">
                    {topEmotions.map(([type, count], index) => {
                      const emotion = EMOTION_LABELS[type] || { emoji: '😊', label: type }
                      const sizes = ['text-5xl', 'text-4xl', 'text-3xl']
                      return (
                        <motion.div
                          key={type}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center"
                        >
                          <div className={`${sizes[index]} mb-2`}>{emotion.emoji}</div>
                          <p className="font-medium text-gray-900 text-sm">{emotion.label}</p>
                          <p className="text-xs text-green-600">{count}회</p>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400">기록이 없습니다</div>
                )}
              </div>

              {/* 이번 주 그래프 (월~일) */}
              <div className="col-span-4 bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">이번 주</h3>
                <div className="flex justify-between items-end h-24">
                  {thisWeekDays.map((day, idx) => {
                    const maxCount = Math.max(...thisWeekDays.map(d => d.count), 1)
                    const heightPercent = (day.count / maxCount) * 100
                    const emotion = day.mainEmotion ? EMOTION_LABELS[day.mainEmotion] : null
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                        <div className="w-6 bg-gray-100 rounded-full relative" style={{ height: '48px' }}>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ delay: idx * 0.05, duration: 0.3 }}
                            className={`absolute bottom-0 left-0 right-0 rounded-full ${
                              day.count > 0 ? 'bg-gradient-to-t from-green-500 to-emerald-400' : 'bg-gray-200'
                            }`}
                          />
                        </div>
                        <span className="text-base">{emotion?.emoji || '·'}</span>
                        <span className="text-xs text-gray-400">{day.day}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 주간 보고서 CTA */}
              <button
                onClick={handleOpenReport}
                className="col-span-2 bg-gradient-to-br from-[#6ec4f0] to-[#4a9fd4] rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 size={24} />
                </div>
                <p className="font-bold text-lg">주간 감정 보고서</p>
                <p className="text-white/70 text-sm mt-1">AI가 분석한 나의 감정 변화</p>
                <div className="flex items-center gap-1 mt-4 text-sm">
                  <span>확인하기</span>
                  <ChevronRight size={16} />
                </div>
              </button>
            </div>

            {/* 최근 기록 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">최근 감정 기록</h3>
                <Link href="/mypage/records" className="text-green-600 text-sm font-medium hover:text-green-700">
                  전체보기 →
                </Link>
              </div>

              {emotionRecords.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📝</div>
                  <p className="text-gray-500">아직 기록된 감정이 없어요</p>
                  <Link
                    href="/healing"
                    className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    기록 시작하기
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {emotionRecords.slice(0, 6).map((record, index) => {
                    const emotion = EMOTION_LABELS[record.emotion_type] || { emoji: '😊', label: record.emotion_type }
                    return (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="text-3xl">{emotion.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">{emotion.label}</span>
                            <span className="text-xs text-gray-400">{formatRelativeTime(record.created_at)}</span>
                          </div>
                          {record.helpful_actions && record.helpful_actions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {record.helpful_actions.slice(0, 2).map((action) => (
                                <span key={action} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                  {ACTION_LABELS[action] || action}
                                </span>
                              ))}
                            </div>
                          )}
                          {record.positive_changes && record.positive_changes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {record.positive_changes.slice(0, 2).map((change) => {
                                const changeData = CHANGE_LABELS[change] || { emoji: '✨', label: change }
                                return (
                                  <span key={change} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                    {changeData.emoji} {changeData.label}
                                  </span>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

          </main>
        </div>
      </div>

      {/* 공통 모달 */}
      <WeeklyEmotionReport
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        isAdmin={isAdmin}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  )
}
