'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, TrendingUp, Calendar, History, ChevronLeft, Trash2, FlaskConical } from 'lucide-react'
import { getWeeklyEmotionRecords, getCurrentWeekEmotionRecords } from '@/actions/emotionActions'
import { generateEmotionInsight, saveEmotionReport, getEmotionReports, deleteEmotionReport, type EmotionReport } from '@/actions/reportActions'
import { analyzeEmotionData, ACTION_LABELS, CHANGE_LABELS } from '@/lib/utils/emotionAnalysis'
import { useToast } from '@/components/ui/Toast'

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

interface WeeklyEmotionReportProps {
  isOpen: boolean
  onClose: () => void
}

type ViewMode = 'menu' | 'current' | 'thisWeek' | 'history' | 'detail'

export default function WeeklyEmotionReport({ isOpen, onClose }: WeeklyEmotionReportProps) {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false)
  const [records, setRecords] = useState<EmotionRecord[]>([])
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeEmotionData> | null>(null)
  const [insight, setInsight] = useState<string>('')
  const [weekStart, setWeekStart] = useState<Date | null>(null)
  const [weekEnd, setWeekEnd] = useState<Date | null>(null)

  // 보고서 목록/상세 관련 상태
  const [viewMode, setViewMode] = useState<ViewMode>('menu')
  const [savedReports, setSavedReports] = useState<EmotionReport[]>([])
  const [selectedReport, setSelectedReport] = useState<EmotionReport | null>(null)
  const [isLoadingReports, setIsLoadingReports] = useState(false)

  // 모달 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setViewMode('menu')
      // 메뉴 화면에서 시작하므로 자동으로 보고서를 생성하지 않음
      setRecords([])
      setAnalysis(null)
      setInsight('')
      setWeekStart(null)
      setWeekEnd(null)
    }
  }, [isOpen])

  const loadReport = async () => {
    setIsLoading(true)
    try {
      const result = await getWeeklyEmotionRecords()
      if (result.success && result.data) {
        setRecords(result.data)
        setWeekStart(result.weekStart)
        setWeekEnd(result.weekEnd)
        const analysisResult = analyzeEmotionData(result.data)
        setAnalysis(analysisResult)

        // AI 인사이트 생성 및 자동 저장 (기록이 있을 때만)
        if (result.data.length > 0 && result.weekStart && result.weekEnd) {
          setIsGeneratingInsight(true)
          const insightResult = await generateEmotionInsight(result.data)
          if (insightResult.success) {
            setInsight(insightResult.insight)

            // 자동 저장 시도
            const saveResult = await saveEmotionReport(
              result.weekStart,
              result.weekEnd,
              result.data,
              insightResult.insight
            )
            if (saveResult.success) {
              console.log('Report saved successfully')
            } else {
              console.log('Report save failed:', saveResult.error)
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load report:', error)
    } finally {
      setIsLoading(false)
      setIsGeneratingInsight(false)
    }
  }

  // 이번 주 보고서 로드 (테스트용)
  const loadCurrentWeekReport = async () => {
    setIsLoading(true)
    try {
      const result = await getCurrentWeekEmotionRecords()
      if (result.success && result.data) {
        setRecords(result.data)
        setWeekStart(result.weekStart)
        setWeekEnd(result.weekEnd)
        const analysisResult = analyzeEmotionData(result.data)
        setAnalysis(analysisResult)

        // AI 인사이트 생성 (기록이 있을 때만, 저장은 하지 않음 - 테스트용)
        if (result.data.length > 0) {
          setIsGeneratingInsight(true)
          const insightResult = await generateEmotionInsight(result.data)
          if (insightResult.success) {
            setInsight(insightResult.insight)
          }
        }
      }
    } catch (error) {
      console.error('Failed to load current week report:', error)
    } finally {
      setIsLoading(false)
      setIsGeneratingInsight(false)
    }
  }

  // 저장된 보고서 목록 조회
  const loadSavedReports = async () => {
    setIsLoadingReports(true)
    try {
      const result = await getEmotionReports()
      if (result.success) {
        setSavedReports(result.data)
      }
    } catch (error) {
      console.error('Failed to load saved reports:', error)
    } finally {
      setIsLoadingReports(false)
    }
  }

  // 보고서 삭제
  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('이 보고서를 삭제하시겠습니까?')) return

    try {
      const result = await deleteEmotionReport(reportId)
      if (result.success) {
        setSavedReports(prev => prev.filter(r => r.id !== reportId))
        if (selectedReport?.id === reportId) {
          setSelectedReport(null)
          setViewMode('history')
        }
        showToast('보고서가 삭제되었습니다.', 'success')
      } else {
        showToast(result.error || '보고서 삭제에 실패했습니다.', 'error')
      }
    } catch (error) {
      console.error('Failed to delete report:', error)
      showToast('보고서 삭제에 실패했습니다.', 'error')
    }
  }

  // 이전 보고서 보기
  const handleViewHistory = () => {
    setViewMode('history')
    loadSavedReports()
  }

  // 지난 주 보고서 생성하기
  const handleGenerateReport = () => {
    setViewMode('current')
    loadReport()
  }

  // 이번 주 보고서 생성하기 (테스트용)
  const handleGenerateThisWeekReport = () => {
    setViewMode('thisWeek')
    loadCurrentWeekReport()
  }

  // 보고서 상세 보기
  const handleViewDetail = (report: EmotionReport) => {
    setSelectedReport(report)
    setViewMode('detail')
  }

  // 날짜 포맷팅
  const formatDateRange = (start: string | Date, end: string | Date) => {
    const startDate = typeof start === 'string' ? new Date(start) : start
    const endDate = typeof end === 'string' ? new Date(end) : end
    return `${startDate.getMonth() + 1}/${startDate.getDate()} - ${endDate.getMonth() + 1}/${endDate.getDate()}`
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

  // 메뉴 렌더링
  const renderMenuView = () => (
    <div className="space-y-4">
      <p className="text-gray-600 text-center mb-6">
        주간 감정 보고서를 확인하세요
      </p>

      {/* 지난 주 보고서 생성 버튼 */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={handleGenerateReport}
        className="w-full p-5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl flex items-center gap-4 hover:from-purple-600 hover:to-blue-600 transition-colors"
      >
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <Sparkles size={24} />
        </div>
        <div className="text-left">
          <h3 className="font-bold text-lg">지난 주 보고서 생성</h3>
          <p className="text-purple-100 text-sm">AI가 지난 주 감정을 분석해요</p>
        </div>
      </motion.button>

      {/* 저장된 보고서 보기 버튼 */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        onClick={handleViewHistory}
        className="w-full p-5 bg-gray-100 text-gray-800 rounded-2xl flex items-center gap-4 hover:bg-gray-200 transition-colors"
      >
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <History size={24} className="text-gray-600" />
        </div>
        <div className="text-left">
          <h3 className="font-bold text-lg">저장된 보고서 보기</h3>
          <p className="text-gray-500 text-sm">이전에 저장한 보고서를 확인해요</p>
        </div>
      </motion.button>

      {/* 이번 주 보고서 생성 버튼 (테스트용) */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={handleGenerateThisWeekReport}
        className="w-full p-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl flex items-center gap-4 hover:from-amber-600 hover:to-orange-600 transition-colors"
      >
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <FlaskConical size={24} />
        </div>
        <div className="text-left">
          <h3 className="font-bold text-lg">이번 주 보고서 (테스트)</h3>
          <p className="text-amber-100 text-sm">이번 주 감정을 미리 확인해요</p>
        </div>
      </motion.button>
    </div>
  )

  // 보고서 목록 렌더링
  const renderHistoryView = () => (
    <div className="space-y-4">
      <button
        onClick={() => setViewMode('menu')}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
      >
        <ChevronLeft size={20} />
        <span>메뉴로 돌아가기</span>
      </button>

      {isLoadingReports ? (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-3 border-purple-200 border-t-purple-600 rounded-full"
          />
          <p className="mt-4 text-gray-500">보고서 목록을 불러오는 중...</p>
        </div>
      ) : savedReports.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-bold mb-2">저장된 보고서가 없어요</h3>
          <p className="text-gray-500">
            주간 보고서를 생성하고 저장해보세요!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedReports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => handleViewDetail(report)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={16} className="text-purple-600" />
                    <span className="font-semibold">
                      {formatDateRange(report.week_start, report.week_end)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {report.total_records}회 기록 · 긍정 {report.positive_ratio}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteReport(report.id)
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )

  // 보고서 상세 렌더링
  const renderDetailView = () => {
    if (!selectedReport) return null

    return (
      <div className="space-y-5">
        <button
          onClick={() => setViewMode('history')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
        >
          <ChevronLeft size={20} />
          <span>목록으로 돌아가기</span>
        </button>

        {/* 기간 표시 */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>{formatDateRange(selectedReport.week_start, selectedReport.week_end)}</span>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-purple-600">{selectedReport.total_records}</p>
            <p className="text-xs text-gray-600">총 기록</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{selectedReport.positive_ratio}%</p>
            <p className="text-xs text-gray-600">긍정 비율</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {selectedReport.emotion_summary?.[0]?.emoji || '😊'}
            </p>
            <p className="text-xs text-gray-600">가장 많은</p>
          </div>
        </div>

        {/* 감정 분포 */}
        {selectedReport.emotion_summary && selectedReport.emotion_summary.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold mb-3">감정 분포</h3>
            <div className="space-y-2">
              {selectedReport.emotion_summary.slice(0, 5).map((emotion, index) => (
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
                          width: `${(emotion.count / selectedReport.total_records) * 100}%`,
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

        {/* 도움이 된 행동 */}
        {selectedReport.top_helpful_actions && selectedReport.top_helpful_actions.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold mb-3">도움이 된 행동</h3>
            <div className="flex flex-wrap gap-2">
              {selectedReport.top_helpful_actions.map((action, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {ACTION_LABELS[action] || action}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 긍정적 변화 */}
        {selectedReport.top_positive_changes && selectedReport.top_positive_changes.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold mb-3">긍정적 변화</h3>
            <div className="flex flex-wrap gap-2">
              {selectedReport.top_positive_changes.map((change, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {CHANGE_LABELS[change]?.label || change}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI 인사이트 */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-purple-600" />
            <h3 className="font-semibold">AI 인사이트</h3>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {selectedReport.ai_insight}
          </p>
        </div>
      </div>
    )
  }

  // 현재 주 보고서 렌더링
  const renderCurrentView = () => (
    <>
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => setViewMode('menu')}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
      >
        <ChevronLeft size={20} />
        <span>메뉴로 돌아가기</span>
      </button>

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
            지난 주에 기록된 감정이 없습니다.
            <br />
            힐링로드 ON에서 감정을 기록해보세요!
          </p>
        </div>
      ) : (
        <>
          {/* 기간 표시 */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} />
            <span>
              {weekStart && weekEnd
                ? `${formatDateRange(weekStart, weekEnd)} (지난 주)`
                : '지난 주'}
            </span>
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
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-purple-600" />
              <h3 className="font-semibold">AI 인사이트</h3>
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
    </>
  )

  // 이번 주 보고서 렌더링 (테스트용)
  const renderThisWeekView = () => (
    <>
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => setViewMode('menu')}
        className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-4"
      >
        <ChevronLeft size={20} />
        <span>메뉴로 돌아가기</span>
      </button>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-3 border-amber-200 border-t-amber-600 rounded-full"
          />
          <p className="mt-4 text-gray-500">이번 주 보고서를 불러오는 중...</p>
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
          {/* 테스트 안내 배너 */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 text-amber-700">
              <FlaskConical size={16} />
              <span className="text-sm font-medium">테스트용 보고서 (저장되지 않음)</span>
            </div>
          </div>

          {/* 기간 표시 */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} />
            <span>
              {weekStart && weekEnd
                ? `${formatDateRange(weekStart, weekEnd)} (이번 주)`
                : '이번 주'}
            </span>
          </div>

          {/* 요약 카드 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{analysis?.totalRecords || 0}</p>
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
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* AI 인사이트 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-amber-600" />
              <h3 className="font-semibold">AI 인사이트</h3>
            </div>
            {isGeneratingInsight ? (
              <div className="flex items-center gap-2 text-gray-500">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-amber-200 border-t-amber-600 rounded-full"
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
            className="block w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold text-center hover:from-amber-700 hover:to-orange-700 transition-colors"
          >
            힐링로드 ON으로 가기
          </a>
        </>
      )}
    </>
  )

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
              <h2 className="text-lg font-bold">
                {viewMode === 'menu' && '주간 감정 보고서'}
                {viewMode === 'current' && '지난 주 보고서'}
                {viewMode === 'thisWeek' && '이번 주 보고서 (테스트)'}
                {viewMode === 'history' && '저장된 보고서'}
                {viewMode === 'detail' && '보고서 상세'}
              </h2>
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
            {viewMode === 'menu' && renderMenuView()}
            {viewMode === 'current' && renderCurrentView()}
            {viewMode === 'thisWeek' && renderThisWeekView()}
            {viewMode === 'history' && renderHistoryView()}
            {viewMode === 'detail' && renderDetailView()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
