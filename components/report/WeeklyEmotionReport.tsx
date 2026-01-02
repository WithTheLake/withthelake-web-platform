'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, TrendingUp, Calendar, RefreshCw } from 'lucide-react'
import { getWeeklyEmotionRecords } from '@/actions/emotionActions'
import { generateEmotionInsight } from '@/actions/reportActions'
import { analyzeEmotionData } from '@/lib/utils/emotionAnalysis'

interface EmotionRecord {
  id: string
  emotion_type: string
  intensity: number
  note: string | null
  created_at: string
}

interface WeeklyEmotionReportProps {
  isOpen: boolean
  onClose: () => void
}

export default function WeeklyEmotionReport({ isOpen, onClose }: WeeklyEmotionReportProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false)
  const [records, setRecords] = useState<EmotionRecord[]>([])
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeEmotionData> | null>(null)
  const [insight, setInsight] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      loadReport()
    }
  }, [isOpen])

  const loadReport = async () => {
    setIsLoading(true)
    try {
      const result = await getWeeklyEmotionRecords()
      if (result.success && result.data) {
        setRecords(result.data)
        const analysisResult = analyzeEmotionData(result.data)
        setAnalysis(analysisResult)

        // AI 인사이트 생성
        setIsGeneratingInsight(true)
        const insightResult = await generateEmotionInsight(result.data)
        if (insightResult.success) {
          setInsight(insightResult.insight)
        }
      }
    } catch (error) {
      console.error('Failed to load report:', error)
    } finally {
      setIsLoading(false)
      setIsGeneratingInsight(false)
    }
  }

  const regenerateInsight = async () => {
    setIsGeneratingInsight(true)
    try {
      const insightResult = await generateEmotionInsight(records)
      if (insightResult.success) {
        setInsight(insightResult.insight)
      }
    } catch (error) {
      console.error('Failed to regenerate insight:', error)
    } finally {
      setIsGeneratingInsight(false)
    }
  }

  // 요일별 기록 수 계산 (최근 7일)
  const getDailyData = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토']
    const data: { day: string; count: number; date: string }[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = date.toLocaleDateString('ko-KR')
      const dayOfWeek = days[date.getDay()]

      const count = records.filter((r) => {
        const recordDate = new Date(r.created_at).toLocaleDateString('ko-KR')
        return recordDate === dateKey
      }).length

      data.push({ day: dayOfWeek, count, date: dateKey })
    }

    return data
  }

  const maxCount = Math.max(...getDailyData().map((d) => d.count), 1)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={20} />
              <h2 className="text-lg font-bold">주간 감정 보고서</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* 콘텐츠 */}
          <div className="overflow-y-auto max-h-[calc(90vh-60px)] p-5 space-y-5">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 border-3 border-purple-200 border-t-purple-600 rounded-full"
                />
                <p className="mt-4 text-gray-500">보고서를 불러오는 중...</p>
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-lg font-bold mb-2">아직 기록이 없어요</h3>
                <p className="text-gray-500">
                  이번 주에 기록된 감정이 없습니다.
                  <br />
                  힐링로드 ON에서 감정을 기록해보세요!
                </p>
              </div>
            ) : (
              <>
                {/* 기간 표시 */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  <span>최근 7일간의 기록</span>
                </div>

                {/* 요약 카드 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-purple-600">{analysis?.totalRecords || 0}</p>
                    <p className="text-xs text-gray-600">총 기록</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">{analysis?.positiveRatio || 0}%</p>
                    <p className="text-xs text-gray-600">긍정 비율</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {analysis?.mostFrequent?.emoji || '😊'}
                    </p>
                    <p className="text-xs text-gray-600">가장 많은</p>
                  </div>
                </div>

                {/* 일별 차트 */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={18} className="text-gray-600" />
                    <h3 className="font-semibold">일별 기록 현황</h3>
                  </div>
                  <div className="flex items-end justify-between h-24 gap-1">
                    {getDailyData().map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(data.count / maxCount) * 100}%` }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          className={`w-full rounded-t-md ${
                            data.count > 0 ? 'bg-purple-500' : 'bg-gray-200'
                          }`}
                          style={{ minHeight: data.count > 0 ? '8px' : '4px' }}
                        />
                        <span className="text-xs text-gray-500 mt-1">{data.day}</span>
                        {data.count > 0 && (
                          <span className="text-xs text-purple-600 font-medium">{data.count}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 감정 분포 */}
                {analysis && analysis.summary.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold mb-3">감정 분포</h3>
                    <div className="space-y-2">
                      {analysis.summary.slice(0, 5).map((emotion, index) => (
                        <motion.div
                          key={emotion.type}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3"
                        >
                          <span className="text-xl">{emotion.emoji}</span>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{emotion.label}</span>
                              <span className="text-gray-500">{emotion.count}회</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${(emotion.count / analysis.totalRecords) * 100}%`,
                                }}
                                transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI 인사이트 */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-purple-600" />
                      <h3 className="font-semibold">AI 인사이트</h3>
                    </div>
                    <button
                      onClick={regenerateInsight}
                      disabled={isGeneratingInsight}
                      className="p-1.5 hover:bg-purple-100 rounded-full transition-colors disabled:opacity-50"
                      title="다시 생성"
                    >
                      <RefreshCw
                        size={16}
                        className={`text-purple-600 ${isGeneratingInsight ? 'animate-spin' : ''}`}
                      />
                    </button>
                  </div>
                  {isGeneratingInsight ? (
                    <div className="flex items-center gap-2 text-gray-500">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-purple-200 border-t-purple-600 rounded-full"
                      />
                      <span className="text-sm">인사이트 생성 중...</span>
                    </div>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                    >
                      {insight}
                    </motion.p>
                  )}
                </div>

                {/* 힐링로드 ON 바로가기 */}
                <a
                  href="/healing"
                  className="block w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-center hover:from-purple-700 hover:to-blue-700 transition-colors"
                >
                  힐링로드 ON으로 가기
                </a>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
