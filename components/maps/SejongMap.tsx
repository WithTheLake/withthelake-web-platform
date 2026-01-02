'use client'

import { motion } from 'framer-motion'

interface SejongMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 세종특별자치시는 단일 행정구역이지만 읍면동 단위로 구분
const SEJONG_AREAS = [
  { id: 'sejong_city', name: '세종시', path: 'M 80 60 L 200 45 L 260 120 L 230 220 L 120 240 L 50 160 Z', labelX: 155, labelY: 145 },
]

export default function SejongMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: SejongMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-[4/3] max-w-[280px] mx-auto">
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="300" height="300" fill="#f0f9ff" rx="12" />

        {/* 정부세종청사 표시 */}
        <text x="155" y="165" fontSize="8" fill="#059669" fontWeight="bold" textAnchor="middle">🏛️ 정부세종청사</text>

        {SEJONG_AREAS.map((area) => {
          const available = isAvailable(area.id)
          const isSelected = selectedCity === area.id

          return (
            <g key={area.id}>
              <motion.path
                d={area.path}
                fill={isSelected ? '#3b82f6' : available ? '#93c5fd' : '#e5e7eb'}
                stroke={isSelected ? '#1d4ed8' : available ? '#60a5fa' : '#d1d5db'}
                strokeWidth={isSelected ? 2 : 1}
                className={available ? 'cursor-pointer' : 'cursor-not-allowed'}
                onClick={() => available && onCitySelect(area.id)}
                whileHover={available ? { fill: isSelected ? '#3b82f6' : '#60a5fa', scale: 1.02 } : {}}
                whileTap={available ? { scale: 0.98 } : {}}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <text
                x={area.labelX}
                y={area.labelY}
                fontSize="14"
                fill={isSelected ? '#fff' : available ? '#1e40af' : '#9ca3af'}
                fontWeight={isSelected ? 'bold' : 'normal'}
                textAnchor="middle"
                className="pointer-events-none select-none"
              >
                {area.name}
              </text>
            </g>
          )
        })}

        <text x="150" y="285" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          세종특별자치시
        </text>
      </svg>
    </div>
  )
}
