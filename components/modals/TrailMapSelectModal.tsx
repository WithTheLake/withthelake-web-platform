'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, MapPin, Clock, Ruler, Mountain, Navigation, Loader2, Settings, AlertCircle, Smartphone } from 'lucide-react'
import KoreaMap from '@/components/maps/KoreaMap'
import {
  getCurrentPosition,
  findNearestCity,
  isInKorea,
  type GeoLocation,
  type RegionInfo,
} from '@/lib/utils/geoLocation'
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
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [showPermissionGuide, setShowPermissionGuide] = useState(false)

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

  // 내 위치로 찾기 기능
  const handleFindMyLocation = async () => {
    setIsLocating(true)
    setLocationError(null)

    try {
      const position = await getCurrentPosition()
      const userLocation: GeoLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }

      // 디버깅: 위치 정보 출력
      console.log('📍 현재 위치:', userLocation)

      // 한국 영토 내인지 확인
      if (!isInKorea(userLocation)) {
        setLocationError('현재 위치가 한국 외부입니다.')
        setIsLocating(false)
        return
      }

      // 가장 가까운 지역 찾기
      const nearestRegion = findNearestCity(userLocation)

      // 디버깅: 찾은 지역 출력
      console.log('🗺️ 가장 가까운 지역:', nearestRegion)
      if (!nearestRegion) {
        setLocationError('가까운 지역을 찾을 수 없습니다.')
        setIsLocating(false)
        return
      }

      // 해당 도에 오디오가 있는지 확인
      if (!availableProvinces.includes(nearestRegion.province)) {
        setLocationError(`${nearestRegion.provinceName} 지역에는 아직 등록된 코스가 없습니다.`)
        setIsLocating(false)
        return
      }

      // 해당 도의 시군구 목록 로드 후 확인
      const cities = await getAvailableCities(nearestRegion.province)

      if (!cities.includes(nearestRegion.city)) {
        // 가장 가까운 시군구에 코스가 없으면, 해당 도의 다른 시군구 중 코스가 있는 곳으로 안내
        if (cities.length > 0) {
          setLocationError(`${nearestRegion.cityName}에는 등록된 코스가 없습니다. ${nearestRegion.provinceName}의 다른 지역을 선택해주세요.`)
          setSelectedProvince(nearestRegion.province)
          setAvailableCities(cities)
          setViewMode('province')
        } else {
          setLocationError(`${nearestRegion.provinceName} 지역에는 아직 등록된 코스가 없습니다.`)
        }
        setIsLocating(false)
        return
      }

      // 성공: 지역 자동 선택 및 길 목록 표시
      setSelectedProvince(nearestRegion.province)
      setSelectedCity(nearestRegion.city)
      setAvailableCities(cities)
      setViewMode('trails')

      // 길 목록 로드
      const trailData = await getTrailGuidesByCity(nearestRegion.province, nearestRegion.city)
      setTrails(trailData)

    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case 'GPS_NOT_SUPPORTED':
            setLocationError('이 기기에서는 위치 서비스를 지원하지 않습니다.')
            break
          case 'GPS_PERMISSION_DENIED':
            setLocationError('위치 권한이 필요합니다')
            setShowPermissionGuide(true)
            break
          case 'GPS_POSITION_UNAVAILABLE':
            setLocationError('위치 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요.')
            break
          case 'GPS_TIMEOUT':
            setLocationError('위치 정보 요청 시간이 초과되었습니다. 다시 시도해주세요.')
            break
          default:
            setLocationError('위치를 확인하는 중 오류가 발생했습니다.')
        }
      } else {
        setLocationError('위치를 확인하는 중 오류가 발생했습니다.')
      }
    } finally {
      setIsLocating(false)
    }
  }

  // 브라우저/OS 감지
  const getBrowserInfo = () => {
    const ua = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(ua)
    const isAndroid = /Android/.test(ua)
    const isSamsung = /SamsungBrowser/.test(ua)
    const isChrome = /Chrome/.test(ua) && !/Edge|Edg/.test(ua)
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua)

    return { isIOS, isAndroid, isSamsung, isChrome, isSafari }
  }

  const handleClose = () => {
    setViewMode('korea')
    setSelectedProvince(null)
    setSelectedCity(null)
    setAvailableCities([])
    setTrails([])
    setLocationError(null)
    setShowPermissionGuide(false)
    onClose()
  }

  // 위치 권한 안내 닫기
  const handleClosePermissionGuide = () => {
    setShowPermissionGuide(false)
    setLocationError(null)
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
                      {/* 내 위치로 찾기 버튼 */}
                      <button
                        onClick={handleFindMyLocation}
                        disabled={isLocating}
                        className="w-full mb-4 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                      >
                        {isLocating ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>위치 확인 중...</span>
                          </>
                        ) : (
                          <>
                            <Navigation size={20} />
                            <span>내 현재 위치로 찾기</span>
                          </>
                        )}
                      </button>

                      {/* 위치 권한 안내 (권한 거부 시) */}
                      {showPermissionGuide && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-amber-100 rounded-full flex-shrink-0">
                              <AlertCircle size={20} className="text-amber-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-amber-800 text-base mb-1">
                                위치 권한이 필요해요
                              </h4>
                              <p className="text-amber-700 text-sm">
                                내 위치를 찾으려면 위치 권한을 허용해주세요
                              </p>
                            </div>
                          </div>

                          {/* 브라우저별 안내 */}
                          <div className="bg-white rounded-lg p-3 mb-3 border border-amber-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Settings size={16} className="text-gray-600" />
                              <span className="font-medium text-gray-700 text-sm">설정 방법</span>
                            </div>
                            {(() => {
                              const { isIOS, isAndroid, isSamsung, isChrome, isSafari } = getBrowserInfo()

                              if (isIOS && isSafari) {
                                return (
                                  <ol className="text-sm text-gray-600 space-y-1.5 ml-1">
                                    <li className="flex items-start gap-2">
                                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                                      <span><strong>설정</strong> 앱을 열어주세요</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                                      <span><strong>Safari</strong> → <strong>위치</strong>를 찾아주세요</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
                                      <span><strong>"허용"</strong>으로 변경해주세요</span>
                                    </li>
                                  </ol>
                                )
                              }

                              if (isAndroid && (isChrome || isSamsung)) {
                                return (
                                  <ol className="text-sm text-gray-600 space-y-1.5 ml-1">
                                    <li className="flex items-start gap-2">
                                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                                      <span>주소창 왼쪽 <strong>🔒 자물쇠</strong> 아이콘을 눌러주세요</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                                      <span><strong>권한</strong> 또는 <strong>사이트 설정</strong>을 눌러주세요</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
                                      <span><strong>위치</strong>를 <strong>"허용"</strong>으로 바꿔주세요</span>
                                    </li>
                                  </ol>
                                )
                              }

                              // 기본 (데스크톱 Chrome 등)
                              return (
                                <ol className="text-sm text-gray-600 space-y-1.5 ml-1">
                                  <li className="flex items-start gap-2">
                                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                                    <span>주소창 왼쪽 <strong>🔒 자물쇠</strong> 아이콘 클릭</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                                    <span><strong>사이트 설정</strong> 클릭</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
                                    <span><strong>위치</strong>를 <strong>"허용"</strong>으로 변경</span>
                                  </li>
                                </ol>
                              )
                            })()}
                          </div>

                          {/* 버튼 영역 */}
                          <div className="flex gap-2">
                            <button
                              onClick={handleClosePermissionGuide}
                              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
                            >
                              닫기
                            </button>
                            <button
                              onClick={() => {
                                handleClosePermissionGuide()
                                handleFindMyLocation()
                              }}
                              className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                            >
                              <Navigation size={16} />
                              다시 시도
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* 일반 위치 오류 메시지 (권한 거부 외) */}
                      {locationError && !showPermissionGuide && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center"
                        >
                          {locationError}
                        </motion.div>
                      )}

                      {/* 수동 선택 안내 - 권한 거부 시 더 강조 */}
                      <div className={`text-center mb-4 ${showPermissionGuide ? 'p-3 bg-blue-50 rounded-xl border border-blue-200' : ''}`}>
                        <p className={`text-sm ${showPermissionGuide ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
                          {showPermissionGuide ? (
                            <>
                              <MapPin size={16} className="inline mr-1 -mt-0.5" />
                              또는 아래 지도에서 <strong>직접 지역을 선택</strong>하실 수 있어요
                            </>
                          ) : (
                            '또는 지도에서 지역을 선택해주세요'
                          )}
                        </p>
                      </div>
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
