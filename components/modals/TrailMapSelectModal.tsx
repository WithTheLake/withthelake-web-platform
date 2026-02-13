'use client'

import 'leaflet/dist/leaflet.css'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, MapPin, Clock, Ruler, Mountain, Navigation, Loader2, Settings, AlertCircle, Plus, Minus } from 'lucide-react'
import {
  getCurrentPosition,
  findNearestCity,
  isInKorea,
  type GeoLocation,
} from '@/lib/utils/geoLocation'
import { PROVINCE_NAMES, CITY_NAMES, DIFFICULTY_LABELS, type AudioItem } from '@/types/audio'
import {
  getAvailableProvinces,
  getAvailableCities,
  getTrailGuidesByCity,
} from '@/actions/trailActions'
import { MODAL_ANIMATION } from '@/lib/constants'
import { useLeafletMap } from '@/hooks/useLeafletMap'
import { PROVINCE_CENTERS, KOREA_CENTER, CITY_COORDINATES_MAP } from '@/lib/constants/mapCoordinates'
import type L from 'leaflet'

interface TrailMapSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onTrailSelect: (trail: AudioItem) => void
}

type ViewMode = 'korea' | 'province' | 'trails'

// 시도 축약명 (지도 마커 표시용, 2글자 통일)
const PROVINCE_SHORT: Record<string, string> = {
  seoul: '서울', incheon: '인천', gyeonggi: '경기',
  gangwon: '강원', chungbuk: '충북', chungnam: '충남',
  daejeon: '대전', sejong: '세종', jeonbuk: '전북',
  jeonnam: '전남', gwangju: '광주', gyeongbuk: '경북',
  gyeongnam: '경남', daegu: '대구', ulsan: '울산',
  busan: '부산', jeju: '제주',
}

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

  // Leaflet 지도 훅
  const { mapContainerRef, map, leaflet, isLoaded: mapLoaded } = useLeafletMap({ isOpen })

  // 마커 레이어 그룹 관리
  const markerLayerRef = useRef<L.LayerGroup | null>(null)

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

  // 지도가 재생성될 때 마커 레이어 초기화
  useEffect(() => {
    if (!mapLoaded) {
      markerLayerRef.current = null
    }
  }, [mapLoaded])

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

  // 지도에 시도 마커 표시
  useEffect(() => {
    if (!map || !leaflet || !mapLoaded) return
    if (viewMode !== 'korea') return

    // 기존 마커 제거
    if (markerLayerRef.current) {
      markerLayerRef.current.clearLayers()
    } else {
      markerLayerRef.current = leaflet.layerGroup().addTo(map)
    }

    // 전국 뷰로 이동 - 애니메이션 중 조작 잠금
    map.invalidateSize()
    map.dragging.disable()
    map.touchZoom.disable()
    map.scrollWheelZoom.disable()
    map.doubleClickZoom.disable()

    // 제한 해제 후 이동
    map.setMaxBounds([[90, -180], [-90, 180]])
    map.setMinZoom(6.5)
    map.setView([KOREA_CENTER.lat, KOREA_CENTER.lng], 6.5, { animate: true, duration: 0.8 })

    // 이동 완료 후 제한 설정 + 조작 잠금 해제
    map.once('moveend', () => {
      map.invalidateSize()
      map.setMaxBounds(map.getBounds())
      map.dragging.enable()
      map.touchZoom.enable()
      map.scrollWheelZoom.enable()
      map.doubleClickZoom.enable()
    })

    // 시도 마커 생성
    Object.entries(PROVINCE_CENTERS).forEach(([provinceId, coords]) => {
      const isAvailable = availableProvinces.includes(provinceId)
      const shortName = PROVINCE_SHORT[provinceId] || provinceId

      const markerHtml = `
        <div class="leaflet-custom-marker province-marker ${isAvailable ? 'available' : 'disabled'}">
          <span class="marker-dot"></span>
          <span class="marker-label">${shortName}</span>
        </div>
      `

      const icon = leaflet.divIcon({
        html: markerHtml,
        className: 'leaflet-custom-marker-wrapper',
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      })

      const marker = leaflet.marker([coords.lat, coords.lng], { icon })

      if (isAvailable) {
        marker.on('click', () => handleProvinceSelect(provinceId))
      }

      markerLayerRef.current?.addLayer(marker)
    })
  }, [map, leaflet, mapLoaded, viewMode, availableProvinces])

  // 지도에 시군구 마커 표시
  useEffect(() => {
    if (!map || !leaflet || !mapLoaded) return
    if (viewMode !== 'province' || !selectedProvince) return

    // 기존 마커 제거
    if (markerLayerRef.current) {
      markerLayerRef.current.clearLayers()
    } else {
      markerLayerRef.current = leaflet.layerGroup().addTo(map)
    }

    // 컨테이너 크기 재계산 (trails에서 돌아올 때 hidden 해제 후 필요)
    map.invalidateSize()

    // 시군구 좌표 가져오기
    const cityCoords = CITY_COORDINATES_MAP[selectedProvince] || {}
    const coordsList = Object.values(cityCoords)

    // 시도 뷰로 이동 - 애니메이션 중 조작 잠금
    map.dragging.disable()
    map.touchZoom.disable()
    map.scrollWheelZoom.disable()
    map.doubleClickZoom.disable()

    // 제한 해제 후 이동
    map.setMaxBounds([[90, -180], [-90, 180]])

    if (coordsList.length > 1) {
      const bounds = leaflet.latLngBounds(
        coordsList.map(c => [c.lat, c.lng] as [number, number])
      )
      map.fitBounds(bounds, { padding: [40, 40] })
    } else {
      const provinceCenter = PROVINCE_CENTERS[selectedProvince]
      if (provinceCenter) {
        map.flyTo([provinceCenter.lat, provinceCenter.lng], 11, { duration: 0.8 })
      }
    }

    // 이동 완료 후 제한 설정 + 조작 잠금 해제
    map.once('moveend', () => {
      map.invalidateSize()
      const currentZoom = map.getZoom()
      map.setMinZoom(currentZoom)
      map.setMaxBounds(map.getBounds())
      map.dragging.enable()
      map.touchZoom.enable()
      map.scrollWheelZoom.enable()
      map.doubleClickZoom.enable()
    })

    Object.entries(cityCoords).forEach(([cityId, coords]) => {
      const isAvailable = availableCities.includes(cityId)
      const cityName = CITY_NAMES[cityId] || cityId

      const markerHtml = `
        <div class="leaflet-custom-marker city-marker ${isAvailable ? 'available' : 'disabled'}">
          <span class="marker-dot"></span>
          <span class="marker-label">${cityName}</span>
        </div>
      `

      const icon = leaflet.divIcon({
        html: markerHtml,
        className: 'leaflet-custom-marker-wrapper',
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      })

      const marker = leaflet.marker([coords.lat, coords.lng], { icon })

      if (isAvailable) {
        marker.on('click', () => handleCitySelect(cityId))
      }

      markerLayerRef.current?.addLayer(marker)
    })
  }, [map, leaflet, mapLoaded, viewMode, selectedProvince, availableCities])

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

  const handleProvinceSelect = useCallback((provinceId: string) => {
    setSelectedProvince(provinceId)
    setViewMode('province')
  }, [])

  const handleCitySelect = useCallback((cityId: string) => {
    setSelectedCity(cityId)
    setViewMode('trails')
  }, [])

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

      if (!isInKorea(userLocation)) {
        setLocationError('현재 위치가 한국 외부입니다.')
        setIsLocating(false)
        return
      }

      const nearestRegion = findNearestCity(userLocation)

      if (!nearestRegion) {
        setLocationError('가까운 지역을 찾을 수 없습니다.')
        setIsLocating(false)
        return
      }

      // 지도에서 현재 위치로 이동
      if (map) {
        map.flyTo([userLocation.latitude, userLocation.longitude], 9, { duration: 1 })
      }

      if (!availableProvinces.includes(nearestRegion.province)) {
        setLocationError(`${nearestRegion.provinceName} 지역에는 아직 등록된 코스가 없습니다.`)
        setIsLocating(false)
        return
      }

      const cities = await getAvailableCities(nearestRegion.province)

      if (!cities.includes(nearestRegion.city)) {
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

      setSelectedProvince(nearestRegion.province)
      setSelectedCity(nearestRegion.city)
      setAvailableCities(cities)
      setViewMode('trails')

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
            className="fixed inset-2 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md md:max-h-[95vh] bg-white rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
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
            <div className="flex-1 overflow-y-auto flex flex-col">
              {/* Map View - 항상 DOM에 유지 (trails 뷰에서는 CSS로 숨김) */}
              <div className={`flex flex-col flex-1 ${viewMode === 'trails' ? 'hidden' : ''}`}>
                      {/* 내 위치로 찾기 버튼 */}
                      {viewMode === 'korea' && (
                        <div className="p-4 pb-2">
                          <button
                            onClick={handleFindMyLocation}
                            disabled={isLocating}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
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
                              className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl"
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
                                          <span><strong>&quot;허용&quot;</strong>으로 변경해주세요</span>
                                        </li>
                                      </ol>
                                    )
                                  }

                                  if (isAndroid && (isChrome || isSamsung)) {
                                    return (
                                      <ol className="text-sm text-gray-600 space-y-1.5 ml-1">
                                        <li className="flex items-start gap-2">
                                          <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                                          <span>주소창 왼쪽 <strong>자물쇠</strong> 아이콘을 눌러주세요</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                                          <span><strong>권한</strong> 또는 <strong>사이트 설정</strong>을 눌러주세요</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
                                          <span><strong>위치</strong>를 <strong>&quot;허용&quot;</strong>으로 바꿔주세요</span>
                                        </li>
                                      </ol>
                                    )
                                  }

                                  return (
                                    <ol className="text-sm text-gray-600 space-y-1.5 ml-1">
                                      <li className="flex items-start gap-2">
                                        <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                                        <span>주소창 왼쪽 <strong>자물쇠</strong> 아이콘 클릭</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                                        <span><strong>사이트 설정</strong> 클릭</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
                                        <span><strong>위치</strong>를 <strong>&quot;허용&quot;</strong>으로 변경</span>
                                      </li>
                                    </ol>
                                  )
                                })()}
                              </div>

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

                          {/* 일반 위치 오류 메시지 */}
                          {locationError && !showPermissionGuide && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center"
                            >
                              {locationError}
                            </motion.div>
                          )}

                          {/* 수동 선택 안내 */}
                          <div className={`text-center mt-3 ${showPermissionGuide ? 'p-3 bg-blue-50 rounded-xl border border-blue-200' : ''}`}>
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
                        </div>
                      )}

                      {/* Leaflet 지도 컨테이너 */}
                      <div className="flex-1 min-h-[450px] relative">
                        <div
                          ref={mapContainerRef}
                          className="absolute inset-0"
                          style={{ zIndex: 0 }}
                        />
                        {/* PC용 줌 컨트롤 버튼 */}
                        <div className="absolute bottom-4 right-4 z-10 hidden lg:flex flex-col gap-1">
                          <button
                            onClick={() => map?.zoomIn(0.5)}
                            className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-200"
                            aria-label="지도 확대"
                          >
                            <Plus size={20} className="text-gray-700" />
                          </button>
                          <button
                            onClick={() => map?.zoomOut(0.5)}
                            className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors border border-gray-200"
                            aria-label="지도 축소"
                          >
                            <Minus size={20} className="text-gray-700" />
                          </button>
                        </div>
                        {!mapLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="text-center">
                              <Loader2 size={32} className="animate-spin text-blue-500 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">지도 로딩 중...</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 안내 텍스트 */}
                      <div className="p-2 text-center bg-gray-50 border-t">
                        <p className="text-xs text-gray-500">
                          {viewMode === 'korea' ? (
                            <>* 파란색 마커만 선택 가능합니다 (오디오 등록 지역)</>
                          ) : (
                            <>* 시군구를 선택하면 해당 지역의 코스를 볼 수 있어요</>
                          )}
                        </p>
                      </div>
              </div>

              {/* Trails View */}
              {viewMode === 'trails' && (
                <div className="p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : trails.length > 0 ? (
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
                </div>
              )}
            </div>

            {/* Footer hint */}
            {viewMode === 'trails' && (
              <div className="p-3 border-t bg-gray-50 text-center">
                <p className="text-xs text-gray-500">
                  코스를 선택하면 관련 오디오를 들을 수 있어요
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
