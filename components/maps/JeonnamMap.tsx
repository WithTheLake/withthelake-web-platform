'use client'

import { motion } from 'framer-motion'

interface JeonnamMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 전라남도 시군구 SVG 경로 데이터
const JEONNAM_CITIES = [
  { id: 'mokpo', name: '목포시', path: 'M 65 175 L 95 165 L 115 195 L 95 225 L 60 220 Z', labelX: 85, labelY: 197 },
  { id: 'yeosu', name: '여수시', path: 'M 280 295 L 330 280 L 360 315 L 340 355 L 285 350 Z', labelX: 318, labelY: 320 },
  { id: 'suncheon', name: '순천시', path: 'M 235 240 L 290 230 L 320 275 L 295 320 L 240 310 Z', labelX: 275, labelY: 277 },
  { id: 'naju', name: '나주시', path: 'M 115 155 L 165 145 L 190 190 L 165 235 L 115 225 Z', labelX: 150, labelY: 192 },
  { id: 'gwangyang', name: '광양시', path: 'M 295 205 L 345 195 L 370 240 L 345 280 L 295 270 Z', labelX: 330, labelY: 240 },
  { id: 'damyang', name: '담양군', path: 'M 155 75 L 205 65 L 230 105 L 205 145 L 155 135 Z', labelX: 190, labelY: 107 },
  { id: 'gokseong', name: '곡성군', path: 'M 210 110 L 260 100 L 285 145 L 260 185 L 210 175 Z', labelX: 245, labelY: 145 },
  { id: 'gurye', name: '구례군', path: 'M 265 145 L 315 135 L 340 180 L 315 220 L 265 210 Z', labelX: 300, labelY: 180 },
  { id: 'goheung', name: '고흥군', path: 'M 195 310 L 255 295 L 290 350 L 260 400 L 200 390 Z', labelX: 242, labelY: 350 },
  { id: 'boseong', name: '보성군', path: 'M 175 245 L 230 235 L 260 285 L 235 330 L 180 320 Z', labelX: 215, labelY: 285 },
  { id: 'hwasun', name: '화순군', path: 'M 150 165 L 200 155 L 225 200 L 200 245 L 150 235 Z', labelX: 185, labelY: 202 },
  { id: 'jangheung', name: '장흥군', path: 'M 130 260 L 180 250 L 210 300 L 185 345 L 135 335 Z', labelX: 167, labelY: 300 },
  { id: 'gangjin', name: '강진군', path: 'M 95 280 L 140 270 L 165 315 L 140 355 L 95 345 Z', labelX: 127, labelY: 315 },
  { id: 'haenam', name: '해남군', path: 'M 45 295 L 100 285 L 130 340 L 100 395 L 45 385 Z', labelX: 85, labelY: 342 },
  { id: 'yeongam', name: '영암군', path: 'M 75 220 L 125 210 L 150 255 L 125 295 L 75 285 Z', labelX: 110, labelY: 255 },
  { id: 'muan', name: '무안군', path: 'M 50 145 L 100 135 L 125 180 L 100 220 L 50 210 Z', labelX: 85, labelY: 180 },
  { id: 'hampyeong', name: '함평군', path: 'M 85 110 L 135 100 L 160 140 L 135 180 L 85 170 Z', labelX: 120, labelY: 142 },
  { id: 'yeonggwang', name: '영광군', path: 'M 55 60 L 105 50 L 130 95 L 105 135 L 55 125 Z', labelX: 90, labelY: 95 },
  { id: 'jangseong', name: '장성군', path: 'M 115 60 L 160 50 L 185 90 L 160 130 L 115 120 Z', labelX: 147, labelY: 92 },
  { id: 'wando', name: '완도군', path: 'M 100 365 L 155 350 L 185 400 L 155 445 L 100 435 Z', labelX: 140, labelY: 400 },
  { id: 'jindo', name: '진도군', path: 'M 25 340 L 75 330 L 100 375 L 75 415 L 25 405 Z', labelX: 60, labelY: 375 },
  { id: 'sinan', name: '신안군', path: 'M 15 100 L 55 90 L 75 130 L 55 170 L 15 160 Z', labelX: 42, labelY: 132 },
]

export default function JeonnamMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: JeonnamMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-[4/5] max-w-[320px] mx-auto">
      <svg
        viewBox="0 0 400 470"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="400" height="470" fill="#f0f9ff" rx="12" />

        {/* 서해 표시 */}
        <text x="20" y="200" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">서</text>
        <text x="20" y="215" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">해</text>

        {/* 남해 표시 */}
        <text x="200" y="455" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">남해</text>

        {/* 광주 표시 */}
        <text x="165" y="145" fontSize="8" fill="#9ca3af" textAnchor="middle">(광주)</text>

        {JEONNAM_CITIES.map((city) => {
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
                fontSize="8"
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

        <text x="200" y="30" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          전라남도
        </text>
      </svg>
    </div>
  )
}
