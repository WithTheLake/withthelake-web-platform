'use client'

import { motion } from 'framer-motion'

interface KoreaMapProps {
  selectedProvince: string | null
  availableProvinces: string[] // 오디오가 등록된 도 목록
  onProvinceSelect: (provinceId: string) => void
}

// 대한민국 시도 SVG 경로 데이터
const KOREA_PROVINCES = [
  {
    id: 'seoul',
    name: '서울',
    path: 'M 115 95 L 125 90 L 135 95 L 130 105 L 120 105 Z',
    labelX: 125,
    labelY: 100,
  },
  {
    id: 'gyeonggi',
    name: '경기',
    path: 'M 95 70 L 115 65 L 140 70 L 155 85 L 150 110 L 135 120 L 110 120 L 95 105 L 90 85 Z',
    labelX: 120,
    labelY: 95,
  },
  {
    id: 'incheon',
    name: '인천',
    path: 'M 80 85 L 95 80 L 100 95 L 90 105 L 75 100 Z',
    labelX: 87,
    labelY: 93,
  },
  {
    id: 'gangwon',
    name: '강원',
    path: 'M 155 55 L 200 45 L 230 60 L 235 100 L 220 140 L 180 150 L 150 130 L 145 95 L 150 70 Z',
    labelX: 185,
    labelY: 95,
  },
  {
    id: 'chungbuk',
    name: '충북',
    path: 'M 130 120 L 155 115 L 175 125 L 180 150 L 165 170 L 140 175 L 125 160 L 120 135 Z',
    labelX: 150,
    labelY: 145,
  },
  {
    id: 'chungnam',
    name: '충남',
    path: 'M 70 120 L 95 115 L 120 125 L 125 160 L 115 185 L 85 190 L 60 175 L 55 145 Z',
    labelX: 90,
    labelY: 155,
  },
  {
    id: 'sejong',
    name: '세종',
    path: 'M 105 135 L 115 130 L 125 140 L 120 150 L 108 150 Z',
    labelX: 115,
    labelY: 142,
  },
  {
    id: 'daejeon',
    name: '대전',
    path: 'M 115 165 L 130 160 L 140 170 L 135 182 L 120 185 Z',
    labelX: 127,
    labelY: 173,
  },
  {
    id: 'jeonbuk',
    name: '전북',
    path: 'M 60 185 L 90 180 L 120 190 L 130 215 L 115 240 L 80 245 L 55 225 L 50 200 Z',
    labelX: 90,
    labelY: 215,
  },
  {
    id: 'jeonnam',
    name: '전남',
    path: 'M 45 235 L 80 230 L 110 245 L 120 280 L 100 315 L 60 320 L 30 295 L 25 260 Z',
    labelX: 75,
    labelY: 280,
  },
  {
    id: 'gwangju',
    name: '광주',
    path: 'M 75 260 L 90 255 L 100 265 L 95 278 L 80 280 Z',
    labelX: 87,
    labelY: 268,
  },
  {
    id: 'gyeongbuk',
    name: '경북',
    path: 'M 165 140 L 200 135 L 235 150 L 245 190 L 230 230 L 190 240 L 155 225 L 145 185 L 150 155 Z',
    labelX: 195,
    labelY: 185,
  },
  {
    id: 'daegu',
    name: '대구',
    path: 'M 185 215 L 205 210 L 215 225 L 205 240 L 185 240 Z',
    labelX: 200,
    labelY: 227,
  },
  {
    id: 'gyeongnam',
    name: '경남',
    path: 'M 130 240 L 165 235 L 195 250 L 210 285 L 190 315 L 145 320 L 115 295 L 110 260 Z',
    labelX: 160,
    labelY: 280,
  },
  {
    id: 'ulsan',
    name: '울산',
    path: 'M 220 235 L 240 230 L 250 250 L 240 265 L 220 260 Z',
    labelX: 235,
    labelY: 248,
  },
  {
    id: 'busan',
    name: '부산',
    path: 'M 200 295 L 220 285 L 235 300 L 225 320 L 200 320 Z',
    labelX: 217,
    labelY: 305,
  },
  {
    id: 'jeju',
    name: '제주',
    path: 'M 60 370 L 110 365 L 125 385 L 115 405 L 65 410 L 50 390 Z',
    labelX: 87,
    labelY: 388,
  },
]

export default function KoreaMap({
  selectedProvince,
  availableProvinces,
  onProvinceSelect,
}: KoreaMapProps) {
  const isAvailable = (provinceId: string) => availableProvinces.includes(provinceId)

  return (
    <div className="w-full aspect-[3/4] max-w-[340px] mx-auto">
      <svg
        viewBox="0 0 280 430"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
      >
        {/* 그라데이션 정의 */}
        <defs>
          {/* 선택된 영역 그라데이션 */}
          <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          {/* 사용 가능한 영역 그라데이션 */}
          <linearGradient id="availableGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bfdbfe" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
          {/* 비활성 영역 그라데이션 */}
          <linearGradient id="disabledGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3f4f6" />
            <stop offset="100%" stopColor="#e5e7eb" />
          </linearGradient>
          {/* 호버 효과 그라데이션 */}
          <linearGradient id="hoverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          {/* 내부 광택 효과 */}
          <radialGradient id="glossEffect">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 배경 */}
        <rect x="0" y="0" width="280" height="430" fill="#e0f2fe" rx="16" />

        {/* 바다 텍스처 효과 */}
        <rect x="0" y="0" width="280" height="430" fill="url(#glossEffect)" rx="16" opacity="0.3" />

        {/* 동해 표시 */}
        <text x="255" y="120" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">
          동
        </text>
        <text x="255" y="135" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">
          해
        </text>

        {/* 서해 표시 */}
        <text x="25" y="150" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">
          서
        </text>
        <text x="25" y="165" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">
          해
        </text>

        {/* 남해 표시 */}
        <text x="140" y="345" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">
          남해
        </text>

        {/* 시도 영역 */}
        {KOREA_PROVINCES.map((province) => {
          const available = isAvailable(province.id)
          const isSelected = selectedProvince === province.id

          return (
            <g key={province.id}>
              {/* 지역 그림자 (입체감) */}
              <motion.path
                d={province.path}
                fill="#000000"
                opacity="0.1"
                transform="translate(1, 2)"
                className="pointer-events-none"
              />

              {/* 메인 지역 영역 */}
              <motion.path
                d={province.path}
                fill={
                  isSelected
                    ? 'url(#selectedGradient)'
                    : available
                      ? 'url(#availableGradient)'
                      : 'url(#disabledGradient)'
                }
                stroke={
                  isSelected
                    ? '#1d4ed8'
                    : available
                      ? '#60a5fa'
                      : '#d1d5db'
                }
                strokeWidth={isSelected ? 2.5 : 1.5}
                className={available ? 'cursor-pointer' : 'cursor-not-allowed'}
                onClick={() => available && onProvinceSelect(province.id)}
                whileHover={
                  available
                    ? {
                        scale: 1.05,
                        transition: { duration: 0.2, type: 'spring', stiffness: 300 },
                      }
                    : {}
                }
                whileTap={available ? { scale: 0.95 } : {}}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: Math.random() * 0.1 }}
                style={{
                  filter: isSelected
                    ? 'drop-shadow(0 2px 6px rgba(37, 99, 235, 0.4))'
                    : available
                      ? 'drop-shadow(0 1px 3px rgba(96, 165, 250, 0.3))'
                      : 'none',
                }}
              />

              {/* 광택 효과 (선택된 영역에만) */}
              {isSelected && (
                <motion.path
                  d={province.path}
                  fill="url(#glossEffect)"
                  className="pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {/* 지역명 텍스트 */}
              <motion.text
                x={province.labelX}
                y={province.labelY}
                fontSize={isSelected ? "9" : "8"}
                fill={
                  isSelected
                    ? '#ffffff'
                    : available
                      ? '#1e3a8a'
                      : '#9ca3af'
                }
                fontWeight={isSelected ? 'bold' : available ? '600' : '400'}
                textAnchor="middle"
                className="pointer-events-none select-none"
                style={{
                  textShadow: isSelected
                    ? '0 1px 3px rgba(0,0,0,0.5)'
                    : available
                      ? '0 1px 2px rgba(255,255,255,0.8)'
                      : 'none',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {province.name}
              </motion.text>
            </g>
          )
        })}

        {/* 제목 */}
        <text x="140" y="420" fontSize="12" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          대한민국
        </text>
      </svg>
    </div>
  )
}
