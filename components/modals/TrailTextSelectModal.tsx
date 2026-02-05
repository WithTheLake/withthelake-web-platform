'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Clock, Ruler, MapPin, Mountain } from 'lucide-react'
import { PROVINCE_NAMES, CITY_NAMES, DIFFICULTY_LABELS, type AudioItem } from '@/types/audio'
import { MODAL_ANIMATION } from '@/lib/constants'

interface TrailTextSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onTrailSelect: (trail: AudioItem) => void
  trails: AudioItem[]
}

type ViewMode = 'province' | 'city' | 'trail'

export default function TrailTextSelectModal({
  isOpen,
  onClose,
  onTrailSelect,
  trails,
}: TrailTextSelectModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('province')
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

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

  // 도 목록 계산 (중복 제거)
  const availableProvinces = useMemo(() => {
    const provinces = trails
      .map((t) => t.province)
      .filter((p): p is string => !!p)
    return Array.from(new Set(provinces))
  }, [trails])

  // 시군구 목록 계산 (선택된 도에 해당하는 것만)
  const availableCities = useMemo(() => {
    if (!selectedProvince) return []
    const cities = trails
      .filter((t) => t.province === selectedProvince)
      .map((t) => t.city)
      .filter((c): c is string => !!c)
    return Array.from(new Set(cities))
  }, [trails, selectedProvince])

  // 선택된 길 목록
  const currentTrails = useMemo(() => {
    if (!selectedProvince || !selectedCity) return []
    return trails.filter(
      (t) => t.province === selectedProvince && t.city === selectedCity
    )
  }, [trails, selectedProvince, selectedCity])

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province)
    setViewMode('city')
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setViewMode('trail')
  }

  const handleTrailSelect = (trail: AudioItem) => {
    onTrailSelect(trail)
    handleClose()
  }

  const handleBack = () => {
    if (viewMode === 'trail') {
      setViewMode('city')
      setSelectedCity(null)
    } else if (viewMode === 'city') {
      setViewMode('province')
      setSelectedProvince(null)
    }
  }

  const handleClose = () => {
    setViewMode('province')
    setSelectedProvince(null)
    setSelectedCity(null)
    onClose()
  }

  const getTitle = () => {
    if (viewMode === 'province') return '지역 선택'
    if (viewMode === 'city') return PROVINCE_NAMES[selectedProvince || ''] || '시군구 선택'
    if (viewMode === 'trail') return CITY_NAMES[selectedCity || ''] || '길 선택'
    return '길 안내'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            {...MODAL_ANIMATION.backdrop}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            {...MODAL_ANIMATION.content}
            transition={MODAL_ANIMATION.spring}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md md:max-h-[85vh] bg-white rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-500 to-emerald-500">
              <div className="flex items-center gap-3">
                {viewMode !== 'province' && (
                  <button
                    onClick={handleBack}
                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ChevronLeft size={22} className="text-white" />
                  </button>
                )}
                <h2 className="text-lg font-bold text-white">{getTitle()}</h2>
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
                {/* Province List */}
                {viewMode === 'province' && (
                  <motion.div
                    key="province"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4"
                  >
                    {availableProvinces.length > 0 ? (
                      <div className="space-y-2">
                        {availableProvinces.map((province, index) => (
                          <motion.button
                            key={province}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleProvinceSelect(province)}
                            className="w-full p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between hover:bg-green-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <MapPin size={20} className="text-green-600" />
                              <span className="font-medium text-green-800">
                                {PROVINCE_NAMES[province] || province}
                              </span>
                            </div>
                            <ChevronRight size={20} className="text-green-400" />
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Mountain size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">등록된 길 안내가 없습니다</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* City List */}
                {viewMode === 'city' && (
                  <motion.div
                    key="city"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4"
                  >
                    {availableCities.length > 0 ? (
                      <div className="space-y-2">
                        {availableCities.map((city, index) => (
                          <motion.button
                            key={city}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleCitySelect(city)}
                            className="w-full p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between hover:bg-green-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <MapPin size={20} className="text-green-600" />
                              <span className="font-medium text-green-800">
                                {CITY_NAMES[city] || city}
                              </span>
                            </div>
                            <ChevronRight size={20} className="text-green-400" />
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Mountain size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">등록된 시군구가 없습니다</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Trail List */}
                {viewMode === 'trail' && (
                  <motion.div
                    key="trail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4"
                  >
                    {currentTrails.length > 0 ? (
                      <div className="space-y-3">
                        {currentTrails.map((trail, index) => {
                          const difficulty = trail.difficulty
                            ? DIFFICULTY_LABELS[trail.difficulty]
                            : null
                          return (
                            <motion.button
                              key={trail.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              onClick={() => handleTrailSelect(trail)}
                              className="w-full text-left p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-green-800">
                                  {trail.emoji} {trail.trail_name || trail.title}
                                </h3>
                                {difficulty && (
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficulty.bg} ${difficulty.color}`}
                                  >
                                    {difficulty.label}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{trail.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                {trail.distance && (
                                  <span className="flex items-center gap-1">
                                    <Ruler size={14} />
                                    {trail.distance}
                                  </span>
                                )}
                                {trail.walking_time && (
                                  <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {trail.walking_time}
                                  </span>
                                )}
                              </div>
                            </motion.button>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Mountain size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">등록된 코스가 없습니다</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-3 border-t bg-gray-50 text-center">
              <p className="text-xs text-gray-500">
                {viewMode === 'province' && '도를 선택해주세요'}
                {viewMode === 'city' && '시군구를 선택해주세요'}
                {viewMode === 'trail' && '걷고 싶은 길을 선택해주세요'}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
