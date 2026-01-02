'use client'

import { motion } from 'framer-motion'

interface SeoulMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 서울특별시 25개 구 SVG 경로 데이터
const SEOUL_GUS = [
  { id: 'jongno', name: '종로구', path: 'M 135 70 L 185 60 L 215 90 L 195 120 L 145 115 Z', labelX: 172, labelY: 92 },
  { id: 'jung', name: '중구', path: 'M 175 115 L 210 105 L 230 130 L 215 155 L 180 150 Z', labelX: 200, labelY: 132 },
  { id: 'yongsan', name: '용산구', path: 'M 160 145 L 200 140 L 220 175 L 195 210 L 155 200 Z', labelX: 185, labelY: 177 },
  { id: 'seongdong', name: '성동구', path: 'M 220 120 L 265 110 L 290 145 L 270 180 L 225 170 Z', labelX: 252, labelY: 147 },
  { id: 'gwangjin', name: '광진구', path: 'M 275 130 L 320 120 L 345 155 L 325 190 L 280 180 Z', labelX: 307, labelY: 157 },
  { id: 'dongdaemun', name: '동대문구', path: 'M 235 85 L 280 75 L 305 110 L 285 145 L 240 135 Z', labelX: 267, labelY: 112 },
  { id: 'jungnang', name: '중랑구', path: 'M 295 70 L 340 60 L 365 95 L 345 130 L 300 120 Z', labelX: 327, labelY: 97 },
  { id: 'seongbuk', name: '성북구', path: 'M 195 45 L 250 35 L 280 70 L 255 105 L 205 95 Z', labelX: 235, labelY: 72 },
  { id: 'gangbuk', name: '강북구', path: 'M 145 30 L 200 20 L 225 50 L 205 85 L 155 75 Z', labelX: 182, labelY: 55 },
  { id: 'dobong', name: '도봉구', path: 'M 200 10 L 245 5 L 265 35 L 250 65 L 210 55 Z', labelX: 230, labelY: 37 },
  { id: 'nowon', name: '노원구', path: 'M 255 15 L 310 10 L 340 50 L 315 90 L 265 80 Z', labelX: 295, labelY: 52 },
  { id: 'eunpyeong', name: '은평구', path: 'M 85 55 L 135 45 L 160 80 L 140 115 L 90 105 Z', labelX: 120, labelY: 82 },
  { id: 'seodaemun', name: '서대문구', path: 'M 95 100 L 140 90 L 165 125 L 145 160 L 100 150 Z', labelX: 127, labelY: 127 },
  { id: 'mapo', name: '마포구', path: 'M 55 130 L 105 120 L 130 160 L 105 200 L 55 190 Z', labelX: 90, labelY: 162 },
  { id: 'yangcheon', name: '양천구', path: 'M 35 195 L 80 185 L 105 225 L 80 260 L 35 250 Z', labelX: 67, labelY: 225 },
  { id: 'gangseo', name: '강서구', path: 'M 15 145 L 65 135 L 90 180 L 65 225 L 20 215 Z', labelX: 50, labelY: 182 },
  { id: 'guro', name: '구로구', path: 'M 50 255 L 100 245 L 130 290 L 105 330 L 55 320 Z', labelX: 87, labelY: 290 },
  { id: 'geumcheon', name: '금천구', path: 'M 105 295 L 145 285 L 170 325 L 150 360 L 110 350 Z', labelX: 135, labelY: 325 },
  { id: 'yeongdeungpo', name: '영등포구', path: 'M 70 200 L 125 190 L 155 235 L 130 280 L 75 270 Z', labelX: 110, labelY: 237 },
  { id: 'dongjak', name: '동작구', path: 'M 125 215 L 175 205 L 205 250 L 180 295 L 130 285 Z', labelX: 162, labelY: 252 },
  { id: 'gwanak', name: '관악구', path: 'M 135 285 L 190 275 L 220 325 L 195 370 L 140 360 Z', labelX: 175, labelY: 325 },
  { id: 'seocho', name: '서초구', path: 'M 185 235 L 250 225 L 285 280 L 255 335 L 190 325 Z', labelX: 232, labelY: 282 },
  { id: 'gangnam', name: '강남구', path: 'M 255 215 L 315 205 L 350 260 L 320 315 L 260 305 Z', labelX: 300, labelY: 262 },
  { id: 'songpa', name: '송파구', path: 'M 320 185 L 380 175 L 410 230 L 385 280 L 330 270 Z', labelX: 362, labelY: 230 },
  { id: 'gangdong', name: '강동구', path: 'M 355 145 L 410 135 L 440 185 L 415 235 L 360 225 Z', labelX: 395, labelY: 187 },
]

export default function SeoulMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: SeoulMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-[5/4] max-w-[360px] mx-auto">
      <svg
        viewBox="0 0 460 400"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="460" height="400" fill="#f0f9ff" rx="12" />

        {/* 한강 표시 */}
        <text x="230" y="195" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">~ 한강 ~</text>

        {SEOUL_GUS.map((gu) => {
          const available = isAvailable(gu.id)
          const isSelected = selectedCity === gu.id

          return (
            <g key={gu.id}>
              <motion.path
                d={gu.path}
                fill={isSelected ? '#3b82f6' : available ? '#93c5fd' : '#e5e7eb'}
                stroke={isSelected ? '#1d4ed8' : available ? '#60a5fa' : '#d1d5db'}
                strokeWidth={isSelected ? 2 : 1}
                className={available ? 'cursor-pointer' : 'cursor-not-allowed'}
                onClick={() => available && onCitySelect(gu.id)}
                whileHover={available ? { fill: isSelected ? '#3b82f6' : '#60a5fa', scale: 1.02 } : {}}
                whileTap={available ? { scale: 0.98 } : {}}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <text
                x={gu.labelX}
                y={gu.labelY}
                fontSize="7"
                fill={isSelected ? '#fff' : available ? '#1e40af' : '#9ca3af'}
                fontWeight={isSelected ? 'bold' : 'normal'}
                textAnchor="middle"
                className="pointer-events-none select-none"
              >
                {gu.name}
              </text>
            </g>
          )
        })}

        <text x="230" y="390" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          서울특별시
        </text>
      </svg>
    </div>
  )
}
