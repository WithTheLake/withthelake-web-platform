'use client'

import { motion } from 'framer-motion'

interface JeonbukMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 전북특별자치도 시군구 SVG 경로 데이터
const JEONBUK_CITIES = [
  { id: 'jeonju', name: '전주시', path: 'M 170 140 L 220 130 L 245 175 L 220 220 L 170 210 Z', labelX: 205, labelY: 177 },
  { id: 'gunsan', name: '군산시', path: 'M 40 95 L 100 85 L 130 135 L 105 185 L 45 175 Z', labelX: 83, labelY: 137 },
  { id: 'iksan', name: '익산시', path: 'M 105 115 L 165 105 L 190 150 L 165 195 L 105 185 Z', labelX: 145, labelY: 152 },
  { id: 'jeongeup', name: '정읍시', path: 'M 85 210 L 145 200 L 175 255 L 150 310 L 90 300 Z', labelX: 128, labelY: 257 },
  { id: 'namwon', name: '남원시', path: 'M 220 280 L 285 265 L 315 320 L 285 375 L 220 365 Z', labelX: 265, labelY: 322 },
  { id: 'gimje', name: '김제시', path: 'M 70 165 L 125 155 L 150 200 L 125 245 L 70 235 Z', labelX: 108, labelY: 202 },
  { id: 'wanju', name: '완주군', path: 'M 190 90 L 255 80 L 285 130 L 260 180 L 195 170 Z', labelX: 235, labelY: 132 },
  { id: 'jinan', name: '진안군', path: 'M 265 155 L 325 145 L 355 200 L 325 255 L 265 245 Z', labelX: 307, labelY: 202 },
  { id: 'muju', name: '무주군', path: 'M 295 85 L 355 75 L 380 125 L 355 175 L 295 165 Z', labelX: 335, labelY: 127 },
  { id: 'jangsu', name: '장수군', path: 'M 280 230 L 335 220 L 360 270 L 335 320 L 280 310 Z', labelX: 318, labelY: 272 },
  { id: 'imsil', name: '임실군', path: 'M 215 210 L 275 200 L 305 255 L 275 310 L 215 300 Z', labelX: 257, labelY: 257 },
  { id: 'sunchang', name: '순창군', path: 'M 165 265 L 220 255 L 250 310 L 225 365 L 170 355 Z', labelX: 205, labelY: 312 },
  { id: 'gochang', name: '고창군', path: 'M 45 255 L 110 245 L 145 305 L 115 365 L 50 355 Z', labelX: 93, labelY: 307 },
  { id: 'buan', name: '부안군', path: 'M 30 175 L 85 165 L 115 225 L 85 285 L 30 275 Z', labelX: 70, labelY: 227 },
]

export default function JeonbukMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: JeonbukMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-[4/5] max-w-[320px] mx-auto">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="400" height="400" fill="#f0f9ff" rx="12" />

        {/* 서해 표시 */}
        <text x="20" y="200" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">서</text>
        <text x="20" y="215" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">해</text>

        {JEONBUK_CITIES.map((city) => {
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

        <text x="200" y="390" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          전북특별자치도
        </text>
      </svg>
    </div>
  )
}
