'use client'

import { motion } from 'framer-motion'

interface JejuMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 제주특별자치도 시 SVG 경로 데이터
const JEJU_CITIES = [
  { id: 'jeju_city', name: '제주시', path: 'M 50 60 L 200 45 L 300 60 L 280 130 L 200 145 L 70 130 Z', labelX: 175, labelY: 95 },
  { id: 'seogwipo', name: '서귀포시', path: 'M 70 135 L 200 150 L 280 135 L 290 190 L 200 220 L 60 195 Z', labelX: 175, labelY: 175 },
]

export default function JejuMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: JejuMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-[3/2] max-w-[320px] mx-auto">
      <svg
        viewBox="0 0 350 270"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="350" height="270" fill="#f0f9ff" rx="12" />

        {/* 바다 표시 */}
        <text x="175" y="30" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">태평양</text>

        {/* 한라산 표시 */}
        <text x="175" y="140" fontSize="8" fill="#059669" fontWeight="bold" textAnchor="middle">🏔️ 한라산</text>

        {JEJU_CITIES.map((city) => {
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
                fontSize="12"
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

        <text x="175" y="255" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          제주특별자치도
        </text>
      </svg>
    </div>
  )
}
