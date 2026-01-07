'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, ChevronLeft, ChevronRight, Calendar, ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import { EMOTION_LABELS, ACTION_LABELS, CHANGE_LABELS, LOCATION_LABELS } from '@/types/emotion'

/**
 * EAMRA 프레임워크 기반 감정 기록 타입
 */
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

interface RecordsClientProps {
  records: EmotionRecord[]
  totalCount: number
  totalPages: number
  currentPage: number
}

export default function RecordsClient({
  records,
  totalCount,
  totalPages,
  currentPage,
}: RecordsClientProps) {
  const router = useRouter()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handlePageChange = (page: number) => {
    router.push(`/mypage/records?page=${page}`)
  }

  // 날짜별로 그룹화
  const groupedRecords = records.reduce((acc, record) => {
    const dateKey = new Date(record.created_at).toDateString()
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(record)
    return acc
  }, {} as Record<string, EmotionRecord[]>)

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
          <div>
            <h1 className="text-xl font-bold">감정 기록</h1>
            <p className="text-purple-100 text-sm mt-0.5">
              총 {totalCount}개의 기록
            </p>
          </div>
        </div>
      </section>

      {/* 기록 목록 */}
      <section className="px-5 py-6">
        {records.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8 text-center shadow-sm"
          >
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">아직 기록된 감정이 없어요</p>
            <p className="text-sm text-gray-400 mt-2">
              힐링로드 ON에서 오늘의 감정을 기록해보세요
            </p>
            <Link
              href="/healing"
              className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold"
            >
              힐링로드 ON 시작하기
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedRecords).map(([dateKey, dayRecords], groupIndex) => (
              <motion.div
                key={dateKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.05 }}
              >
                {/* 날짜 헤더 */}
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={16} className="text-purple-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    {formatDate(dayRecords[0].created_at)}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({dayRecords.length}건)
                  </span>
                </div>

                {/* 해당 날짜 기록들 */}
                <div className="space-y-2">
                  {dayRecords.map((record) => {
                    const emotion = EMOTION_LABELS[record.emotion_type] || {
                      emoji: '😊',
                      label: record.emotion_type,
                    }
                    const isExpanded = expandedId === record.id

                    return (
                      <motion.div
                        key={record.id}
                        layout="position"
                        transition={{ layout: { duration: 0.2, ease: 'easeOut' } }}
                        className="bg-white rounded-xl shadow-sm overflow-hidden"
                      >
                        {/* 헤더 (항상 표시) */}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : record.id)}
                          className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="text-3xl">{emotion.emoji}</div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">
                                {emotion.label}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <Clock size={12} />
                                  {formatTime(record.created_at)}
                                </div>
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronDown size={18} className="text-gray-400" />
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* EAMRA 상세 내용 (확장 시 표시) */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              key="content"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
                                {/* E. Emotion - 걷기 전 감정 */}
                                <div className="pt-4">
                                  <p className="text-xs font-semibold text-purple-600 mb-1">
                                    E. 걷기 전 감정
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-2xl">{emotion.emoji}</span>
                                    <span className="text-sm font-medium text-gray-800">
                                      {emotion.label}
                                    </span>
                                  </div>
                                </div>

                                {/* M. Meaning - 감정의 이유 */}
                                <div>
                                  <p className="text-xs font-semibold text-purple-600 mb-1">
                                    M. 그렇게 느낀 이유
                                  </p>
                                  {record.emotion_reason ? (
                                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                                      {record.emotion_reason}
                                    </p>
                                  ) : (
                                    <p className="text-sm text-gray-400 italic">기록 없음</p>
                                  )}
                                </div>

                                {/* A. Action - 도움이 된 행동 */}
                                <div>
                                  <p className="text-xs font-semibold text-purple-600 mb-1">
                                    A. 도움이 된 행동
                                  </p>
                                  {record.helpful_actions && record.helpful_actions.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                      {record.helpful_actions.map((action) => (
                                        <span
                                          key={action}
                                          className="px-3 py-1.5 bg-green-50 text-green-700 text-xs rounded-full"
                                        >
                                          {ACTION_LABELS[action] || action}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-400 italic">기록 없음</p>
                                  )}
                                </div>

                                {/* R. Reflect - 긍정적 변화 */}
                                <div>
                                  <p className="text-xs font-semibold text-purple-600 mb-1">
                                    R. 긍정적 변화
                                  </p>
                                  {record.positive_changes && record.positive_changes.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                      {record.positive_changes.map((change) => {
                                        const changeData = CHANGE_LABELS[change] || { emoji: '✨', label: change }
                                        return (
                                          <span
                                            key={change}
                                            className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                                          >
                                            {changeData.emoji} {changeData.label}
                                          </span>
                                        )
                                      })}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-400 italic">기록 없음</p>
                                  )}
                                </div>

                                {/* A. Anchor - 나를 위한 한마디 */}
                                <div>
                                  <p className="text-xs font-semibold text-purple-600 mb-1">
                                    A. 나를 위한 한마디
                                  </p>
                                  {record.self_message ? (
                                    <p className="text-sm text-gray-700 bg-amber-50 rounded-lg p-3 italic">
                                      &quot;{record.self_message}&quot;
                                    </p>
                                  ) : (
                                    <p className="text-sm text-gray-400 italic">기록 없음</p>
                                  )}
                                </div>

                                {/* 체험 장소 (선택) */}
                                {record.experience_location && (
                                  <div>
                                    <p className="text-xs font-semibold text-purple-600 mb-1">
                                      <MapPin size={12} className="inline mr-1" />
                                      체험 장소
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      {LOCATION_LABELS[record.experience_location] || record.experience_location}
                                    </p>
                                  </div>
                                )}

                                {/* 기존 note 필드 (하위 호환성) */}
                                {record.note && !record.emotion_reason && !record.self_message && (
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 mb-1">
                                      메모 (이전 형식)
                                    </p>
                                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                                      {record.note}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <section className="px-5 py-4">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-3">
            {currentPage} / {totalPages} 페이지
          </p>
        </section>
      )}
    </div>
  )
}
