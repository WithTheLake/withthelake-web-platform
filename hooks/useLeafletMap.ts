'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import type L from 'leaflet'
import { KOREA_CENTER } from '@/lib/constants/mapCoordinates'

// 한국이 화면에 꽉 차게 보이는 줌 레벨 (최소 줌 = 이 이하로 축소 불가)
const KOREA_ZOOM = 6.5

interface UseLeafletMapOptions {
  isOpen: boolean
}

interface UseLeafletMapReturn {
  mapContainerRef: React.RefObject<HTMLDivElement | null>
  map: L.Map | null
  leaflet: typeof L | null
  isLoaded: boolean
  isError: boolean
}

/**
 * Leaflet 지도를 동적으로 로딩하고 초기화하는 훅
 *
 * - Next.js SSR 환경에서 dynamic import로 클라이언트에서만 로드
 * - 모달 오픈 시 지도 생성, 닫힐 때 지도 제거 (DOM 참조 문제 방지)
 * - CartoDB Positron (라벨 없는 버전) 타일 사용
 */
export function useLeafletMap({ isOpen }: UseLeafletMapOptions): UseLeafletMapReturn {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [leaflet, setLeaflet] = useState<typeof L | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)

  // Leaflet JS 동적 로딩 (최초 1회)
  const loadLeaflet = useCallback(async () => {
    if (leaflet) return leaflet

    try {
      const L = await import('leaflet')
      // divIcon만 사용하므로 기본 아이콘 경로 비활성화
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '',
        iconUrl: '',
        shadowUrl: '',
      })

      setLeaflet(L)
      return L
    } catch {
      setIsError(true)
      return null
    }
  }, [leaflet])

  // 모달 닫힐 때 지도 제거 (재오픈 시 새 DOM에 새 지도 생성)
  useEffect(() => {
    if (!isOpen && mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
      setIsLoaded(false)
    }
  }, [isOpen])

  // 모달 열릴 때 지도 생성
  useEffect(() => {
    if (!isOpen) return

    const initMap = async () => {
      // 이미 지도가 있으면 크기만 재계산
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current?.invalidateSize()
          mapRef.current?.setView([KOREA_CENTER.lat, KOREA_CENTER.lng], KOREA_ZOOM)
        }, 300)
        setIsLoaded(true)
        return
      }

      const L = await loadLeaflet()
      if (!L || !mapContainerRef.current) return

      // 지도 생성 (확대 + 확대 시 이동 허용, 기본 뷰 이하로 축소/이동 불가)
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        zoomSnap: 0.1,
        maxBoundsViscosity: 1.0,
        minZoom: KOREA_ZOOM,  // 기본 뷰(6.5)보다 더 축소 불가
        // 사용자 조작: 확대 + 확대 시 이동 허용
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: false,
        keyboard: false,
      })

      // CartoDB Positron (라벨 없는 버전) - 도시명/도로 표시 없이 깔끔
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      }).addTo(map)

      // 한국 중심 + 고정 줌으로 꽉 차게 표시
      map.setView([KOREA_CENTER.lat, KOREA_CENTER.lng], KOREA_ZOOM)

      mapRef.current = map
      setIsLoaded(true)

      // 모달 애니메이션 완료 후 크기 재계산 + 이동 범위 설정
      setTimeout(() => {
        map.invalidateSize()
        map.setView([KOREA_CENTER.lat, KOREA_CENTER.lng], KOREA_ZOOM)
        // 기본 뷰에서 보이는 범위를 이동 제한으로 설정
        // → 축소 시 이동 불가, 확대 시 이 범위 내에서만 이동 가능
        map.setMaxBounds(map.getBounds())
      }, 400)
    }

    // DOM 렌더링 후 초기화
    const timer = setTimeout(initMap, 100)
    return () => clearTimeout(timer)
  }, [isOpen, loadLeaflet])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return {
    mapContainerRef,
    map: mapRef.current,
    leaflet,
    isLoaded,
    isError,
  }
}
