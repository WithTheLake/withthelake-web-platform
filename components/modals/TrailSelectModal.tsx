'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, MapPin, Clock, Ruler, Mountain } from 'lucide-react'
import GangwonMap from '@/components/maps/GangwonMap'
import { GANGWON_DATA, DIFFICULTY_LABELS, type Trail, type City } from '@/lib/data/trails'

interface TrailSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onTrailSelect: (trail: Trail) => void
}

type ViewMode = 'map' | 'trails'

export default function TrailSelectModal({
  isOpen,
  onClose,
  onTrailSelect,
}: TrailSelectModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

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

  const handleCitySelect = (cityId: string) => {
    const city = GANGWON_DATA.cities.find((c) => c.id === cityId)
    if (city) {
      setSelectedCity(city)
      setViewMode('trails')
    }
  }

  const handleBack = () => {
    setViewMode('map')
    setSelectedCity(null)
  }

  const handleTrailClick = (trail: Trail) => {
    onTrailSelect(trail)
    handleClose()
  }

  const handleClose = () => {
    setViewMode('map')
    setSelectedCity(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md md:max-h-[85vh] bg-white rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-500 to-emerald-500">
              <div className="flex items-center gap-3">
                {viewMode === 'trails' && (
                  <button
                    onClick={handleBack}
                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ChevronLeft size={22} className="text-white" />
                  </button>
                )}
                <h2 className="text-lg font-bold text-white">
                  {viewMode === 'map' ? '지역 선택' : selectedCity?.name}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={22} className="text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {viewMode === 'map' ? (
                  <motion.div
                    key="map"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4"
                  >
                    <p className="text-center text-gray-600 text-sm mb-4">
                      지도에서 지역을 선택해주세요
                    </p>
                    <GangwonMap
                      selectedCity={selectedCity?.id || null}
                      onCitySelect={handleCitySelect}
                    />
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">
                        * 현재 강원특별자치도 지역만 지원됩니다
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="trails"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4"
                  >
                    <p className="text-gray-600 text-sm mb-4">
                      {selectedCity?.name}의 맨발 걷기 코스를 선택해주세요
                    </p>

                    {selectedCity && selectedCity.trails.length > 0 ? (
                      <div className="space-y-3">
                        {selectedCity.trails.map((trail, index) => {
                          const difficulty = DIFFICULTY_LABELS[trail.difficulty]
                          return (
                            <motion.button
                              key={trail.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              onClick={() => handleTrailClick(trail)}
                              className="w-full text-left p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-green-800">{trail.name}</h3>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficulty.bg} ${difficulty.color}`}
                                >
                                  {difficulty.label}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{trail.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Ruler size={14} />
                                  {trail.distance}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {trail.duration}
                                </span>
                              </div>
                            </motion.button>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Mountain size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">등록된 코스가 없습니다</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer hint */}
            <div className="p-3 border-t bg-gray-50 text-center">
              <p className="text-xs text-gray-500">
                {viewMode === 'map' ? (
                  <>
                    <MapPin size={12} className="inline mr-1" />
                    지역을 터치하면 해당 지역의 코스를 볼 수 있어요
                  </>
                ) : (
                  <>코스를 선택하면 관련 오디오를 들을 수 있어요</>
                )}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
