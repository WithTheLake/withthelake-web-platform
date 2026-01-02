'use client'

import { motion } from 'framer-motion'

interface ChungnamMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 충청남도 시군구 SVG 경로 데이터
const CHUNGNAM_CITIES = [
  { id: 'cheonan', name: '천안시', path: 'M 230 80 L 280 70 L 305 110 L 280 150 L 230 140 Z', labelX: 265, labelY: 112 },
  { id: 'gongju', name: '공주시', path: 'M 200 150 L 255 140 L 280 185 L 255 230 L 200 220 Z', labelX: 238, labelY: 187 },
  { id: 'boryeong', name: '보령시', path: 'M 55 200 L 105 190 L 130 235 L 105 280 L 55 270 Z', labelX: 90, labelY: 237 },
  { id: 'asan', name: '아산시', path: 'M 185 60 L 235 50 L 260 95 L 235 140 L 185 130 Z', labelX: 220, labelY: 97 },
  { id: 'seosan', name: '서산시', path: 'M 55 80 L 115 70 L 145 120 L 120 170 L 60 160 Z', labelX: 98, labelY: 122 },
  { id: 'nonsan', name: '논산시', path: 'M 195 250 L 250 240 L 275 285 L 250 330 L 195 320 Z', labelX: 233, labelY: 287 },
  { id: 'gyeryong', name: '계룡시', path: 'M 235 210 L 260 205 L 273 230 L 260 255 L 235 250 Z', labelX: 252, labelY: 232 },
  { id: 'dangjin', name: '당진시', path: 'M 115 45 L 175 35 L 200 80 L 175 125 L 115 115 Z', labelX: 155, labelY: 82 },
  { id: 'geumsan', name: '금산군', path: 'M 260 290 L 310 280 L 335 325 L 310 370 L 260 360 Z', labelX: 295, labelY: 327 },
  { id: 'buyeo', name: '부여군', path: 'M 130 235 L 185 225 L 210 270 L 185 315 L 130 305 Z', labelX: 168, labelY: 272 },
  { id: 'seocheon', name: '서천군', path: 'M 70 290 L 120 280 L 145 325 L 120 370 L 70 360 Z', labelX: 105, labelY: 327 },
  { id: 'cheongyang', name: '청양군', path: 'M 130 175 L 180 165 L 205 210 L 180 255 L 130 245 Z', labelX: 165, labelY: 212 },
  { id: 'hongseong', name: '홍성군', path: 'M 70 145 L 125 135 L 150 180 L 125 225 L 70 215 Z', labelX: 108, labelY: 182 },
  { id: 'yesan', name: '예산군', path: 'M 135 100 L 190 90 L 215 135 L 190 180 L 135 170 Z', labelX: 173, labelY: 137 },
  { id: 'taean', name: '태안군', path: 'M 25 110 L 70 100 L 90 145 L 65 190 L 25 180 Z', labelX: 55, labelY: 147 },
]

export default function ChungnamMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: ChungnamMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-[4/5] max-w-[320px] mx-auto">
      <svg
        viewBox="0 0 360 400"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="360" height="400" fill="#f0f9ff" rx="12" />

        {/* 서해 표시 */}
        <text x="25" y="250" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">서</text>
        <text x="25" y="265" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">해</text>

        {CHUNGNAM_CITIES.map((city) => {
          const available = isAvailable(city.id)
          const isSelected = selectedCity === city.id

          return (
            <g key={city.id}>
              <motion.path
                d={city.path}
                fill={isSelected ? '#3b82f6' : available ? '#93c5fd' : '#e5e7eb'}
                stroke={isSelected ? '#1d4ed8' : available ? '#60a5fa' : '#d1d5db'}
                strokeWidth={isSelected ? 2 : 1}
                className={available ? 'cursor-pointer' : 'cursor-not-allowed'}
                onClick={() => available && onCitySelect(city.id)}
                whileHover={available ? { fill: isSelected ? '#3b82f6' : '#60a5fa', scale: 1.02 } : {}}
                whileTap={available ? { scale: 0.98 } : {}}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <text
                x={city.labelX}
                y={city.labelY}
                fontSize="9"
                fill={isSelected ? '#fff' : available ? '#1e40af' : '#9ca3af'}
                fontWeight={isSelected ? 'bold' : 'normal'}
                textAnchor="middle"
                className="pointer-events-none select-none"
              >
                {city.name}
              </text>
            </g>
          )
        })}

        <text x="180" y="390" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          충청남도
        </text>
      </svg>
    </div>
  )
}
