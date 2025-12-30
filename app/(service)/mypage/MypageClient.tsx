'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Calendar, Heart, LogOut, ChevronRight, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import LoginModal from '@/components/modals/LoginModal'

interface EmotionRecord {
  id: string
  emotion_type: string
  intensity: number
  note: string | null
  created_at: string
}

interface MypageClientProps {
  isAuthenticated: boolean
  user: { id: string; email?: string | null } | null
  emotionRecords: EmotionRecord[]
}

const EMOTION_LABELS: Record<string, { emoji: string; label: string }> = {
  happy: { emoji: '😊', label: '행복' },
  calm: { emoji: '😌', label: '평온' },
  grateful: { emoji: '🙏', label: '감사' },
  energetic: { emoji: '💪', label: '활기' },
  tired: { emoji: '😴', label: '피곤' },
  sad: { emoji: '😢', label: '슬픔' },
  anxious: { emoji: '😰', label: '불안' },
  angry: { emoji: '😠', label: '화남' },
}

export default function MypageClient({
  isAuthenticated,
  user,
  emotionRecords,
}: MypageClientProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.reload()
    } catch (error) {
      console.error('Logout error:', error)
      alert('로그아웃에 실패했습니다.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return '오늘'
    } else if (diffDays === 1) {
      return '어제'
    } else if (diffDays < 7) {
      return `${diffDays}일 전`
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  const formatTime = (dateString: string) => {
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
          <div>
            <h1 className="text-2xl font-bold">마이페이지</h1>
            <p className="text-purple-100 mt-1">
              {user?.email || '힐링로드 ON 사용자'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 bg-black bg-opacity-20 rounded-full text-sm hover:bg-opacity-30 transition-colors flex items-center gap-1"
          >
            <LogOut size={16} />
            {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
          </button>
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
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return recordDate >= weekAgo
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
          {emotionRecords.length > 5 && (
            <button className="text-sm text-purple-600 font-medium flex items-center gap-1">
              전체보기
              <ChevronRight size={16} />
            </button>
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
                            {formatDate(record.created_at)} {formatTime(record.created_at)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-4 h-1.5 rounded-full ${
                                level <= record.intensity
                                  ? 'bg-purple-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">
                            강도 {record.intensity}
                          </span>
                        </div>
                        {record.note && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {record.note}
                          </p>
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

      {/* 힐링로드 ON 바로가기 */}
      <section className="px-5 py-5">
        <a
          href="/healing"
          className="block w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-center hover:from-purple-700 hover:to-blue-700 transition-colors"
        >
          힐링로드 ON 시작하기
        </a>
      </section>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  )
}
