'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, MapPin, Clock, Ruler, Mountain } from 'lucide-react'
import KoreaMap from '@/components/maps/KoreaMap'
import GangwonMapWithAudio from '@/components/maps/GangwonMapWithAudio'
import GyeonggiMap from '@/components/maps/GyeonggiMap'
import ChungbukMap from '@/components/maps/ChungbukMap'
import ChungnamMap from '@/components/maps/ChungnamMap'
import JeonbukMap from '@/components/maps/JeonbukMap'
import JeonnamMap from '@/components/maps/JeonnamMap'
import GyeongbukMap from '@/components/maps/GyeongbukMap'
import GyeongnamMap from '@/components/maps/GyeongnamMap'
import JejuMap from '@/components/maps/JejuMap'
import SeoulMap from '@/components/maps/SeoulMap'
import IncheonMap from '@/components/maps/IncheonMap'
import DaejeonMap from '@/components/maps/DaejeonMap'
import DaeguMap from '@/components/maps/DaeguMap'
import GwangjuMap from '@/components/maps/GwangjuMap'
import UlsanMap from '@/components/maps/UlsanMap'
import BusanMap from '@/components/maps/BusanMap'
import SejongMap from '@/components/maps/SejongMap'
import { PROVINCE_NAMES, CITY_NAMES, DIFFICULTY_LABELS, type AudioItem } from '@/types/audio'
import {
  getAvailableProvinces,
  getAvailableCities,
  getTrailGuidesByCity,
} from '@/actions/trailActions'

interface TrailMapSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onTrailSelect: (trail: AudioItem) => void
}

type ViewMode = 'korea' | 'province' | 'trails'

export default function TrailMapSelectModal({
  isOpen,
  onClose,
  onTrailSelect,
}: TrailMapSelectModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('korea')
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [availableProvinces, setAvailableProvinces] = useState<string[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [trails, setTrails] = useState<AudioItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 오디오가 있는 도 목록 로드
  useEffect(() => {
    if (isOpen && viewMode === 'korea') {
      loadAvailableProvinces()
    }
  }, [isOpen, viewMode])

  // 선택된 도의 시군구 목록 로드
  useEffect(() => {
    if (selectedProvince && viewMode === 'province') {
      loadAvailableCities(selectedProvince)
    }
  }, [selectedProvince, viewMode])

  // 길 목록 로드
  useEffect(() => {
    if (selectedProvince && selectedCity && viewMode === 'trails') {
      loadTrails(selectedProvince, selectedCity)
    }
  }, [selectedProvince, selectedCity, viewMode])

  const loadAvailableProvinces = async () => {
    setIsLoading(true)
    const provinces = await getAvailableProvinces()
    setAvailableProvinces(provinces)
    setIsLoading(false)
  }

  const loadAvailableCities = async (province: string) => {
    setIsLoading(true)
    const cities = await getAvailableCities(province)
    setAvailableCities(cities)
    setIsLoading(false)
  }

  const loadTrails = async (province: string, city: string) => {
    setIsLoading(true)
    const trailData = await getTrailGuidesByCity(province, city)
    setTrails(trailData)
    setIsLoading(false)
  }

  const handleProvinceSelect = (provinceId: string) => {
    if (availableProvinces.includes(provinceId)) {
      setSelectedProvince(provinceId)
      setViewMode('province')
    }
  }

  const handleCitySelect = (cityId: string) => {
    if (availableCities.includes(cityId)) {
      setSelectedCity(cityId)
      setViewMode('trails')
    }
  }

  const handleBack = () => {
    if (viewMode === 'trails') {
      setViewMode('province')
      setSelectedCity(null)
      setTrails([])
    } else if (viewMode === 'province') {
      setViewMode('korea')
      setSelectedProvince(null)
      setAvailableCities([])
    }
  }

  const handleTrailClick = (trail: AudioItem) => {
    onTrailSelect(trail)
    handleClose()
  }

  const handleClose = () => {
    setViewMode('korea')
    setSelectedProvince(null)
    setSelectedCity(null)
    setAvailableCities([])
    setTrails([])
    onClose()
  }

  const getTitle = () => {
    if (viewMode === 'korea') return '지도에서 선택'
    if (viewMode === 'province') return PROVINCE_NAMES[selectedProvince || ''] || '시군구 선택'
    if (viewMode === 'trails') return CITY_NAMES[selectedCity || ''] || '길 선택'
    return '지도'
  }

  // 도별 지도 컴포넌트 렌더링
  const renderProvinceMap = () => {
    const mapProps = {
      selectedCity,
      availableCities,
      onCitySelect: handleCitySelect,
    }

    switch (selectedProvince) {
      case 'gangwon':
        return <GangwonMapWithAudio {...mapProps} />
      case 'gyeonggi':
        return <GyeonggiMap {...mapProps} />
      case 'chungbuk':
        return <ChungbukMap {...mapProps} />
      case 'chungnam':
        return <ChungnamMap {...mapProps} />
      case 'jeonbuk':
        return <JeonbukMap {...mapProps} />
      case 'jeonnam':
        return <JeonnamMap {...mapProps} />
      case 'gyeongbuk':
        return <GyeongbukMap {...mapProps} />
      case 'gyeongnam':
        return <GyeongnamMap {...mapProps} />
      case 'jeju':
        return <JejuMap {...mapProps} />
      case 'seoul':
        return <SeoulMap {...mapProps} />
      case 'incheon':
        return <IncheonMap {...mapProps} />
      case 'daejeon':
        return <DaejeonMap {...mapProps} />
      case 'daegu':
        return <DaeguMap {...mapProps} />
      case 'gwangju':
        return <GwangjuMap {...mapProps} />
      case 'ulsan':
        return <UlsanMap {...mapProps} />
      case 'busan':
        return <BusanMap {...mapProps} />
      case 'sejong':
        return <SejongMap {...mapProps} />
      default:
        // 지도가 없는 경우 텍스트 목록으로 표시
        return (
          <div className="space-y-2">
            {availableCities.map((city, index) => (
              <motion.button
                key={city}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleCitySelect(city)}
                className="w-full p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-blue-600" />
                  <span className="font-medium text-blue-800">
                    {CITY_NAMES[city] || city}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )
    }
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
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-cyan-500">
              <div className="flex items-center gap-3">
                {viewMode !== 'korea' && (
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
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {/* Korea Map View */}
                  {viewMode === 'korea' && (
                    <motion.div
                      key="korea"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-4"
                    >
                      <p className="text-center text-gray-600 text-sm mb-4">
                        지도에서 지역을 선택해주세요
                      </p>
                      <KoreaMap
                        selectedProvince={selectedProvince}
                        availableProvinces={availableProvinces}
                        onProvinceSelect={handleProvinceSelect}
                      />
                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                          * 색이 진한 지역만 선택 가능합니다 (오디오 등록 지역)
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Province Map View (시군구 선택) */}
                  {viewMode === 'province' && (
                    <motion.div
                      key="province"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-4"
                    >
                      <p className="text-center text-gray-600 text-sm mb-4">
                        시군구를 선택해주세요
                      </p>
                      {renderProvinceMap()}
                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                          * 색이 진한 지역만 선택 가능합니다
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Trails View */}
                  {viewMode === 'trails' && (
                    <motion.div
                      key="trails"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-4"
                    >
                      {trails.length > 0 ? (
                        <div className="space-y-3">
                          {trails.map((trail, index) => {
                            const difficulty = trail.difficulty
                              ? DIFFICULTY_LABELS[trail.difficulty]
                              : null
                            return (
                              <motion.button
                                key={trail.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleTrailClick(trail)}
                                className="w-full text-left p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-colors"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-bold text-blue-800">
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
                        <div className="text-center py-8">
                          <Mountain size={48} className="mx-auto text-gray-300 mb-3" />
                          <p className="text-gray-500">등록된 코스가 없습니다</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Footer hint */}
            <div className="p-3 border-t bg-gray-50 text-center">
              <p className="text-xs text-gray-500">
                {viewMode === 'korea' && (
                  <>
                    <MapPin size={12} className="inline mr-1" />
                    도/광역시를 선택해주세요
                  </>
                )}
                {viewMode === 'province' && (
                  <>
                    <MapPin size={12} className="inline mr-1" />
                    시군구를 선택하면 해당 지역의 코스를 볼 수 있어요
                  </>
                )}
                {viewMode === 'trails' && (
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
