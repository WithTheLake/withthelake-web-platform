'use client'

import { motion } from 'framer-motion'

interface DaeguMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 대구광역시 8개 구/군 SVG 경로 데이터
const DAEGU_GUS = [
  { id: 'jung_dg', name: '중구', path: 'M 155 145 L 190 140 L 210 170 L 195 200 L 160 195 Z', labelX: 180, labelY: 172 },
  { id: 'dong_dg', name: '동구', path: 'M 200 110 L 270 95 L 305 150 L 280 210 L 210 195 Z', labelX: 250, labelY: 155 },
  { id: 'seo_dg', name: '서구', path: 'M 95 140 L 150 130 L 175 175 L 150 220 L 100 210 Z', labelX: 135, labelY: 177 },
  { id: 'nam_dg', name: '남구', path: 'M 140 200 L 195 190 L 225 245 L 200 295 L 145 285 Z', labelX: 180, labelY: 245 },
  { id: 'buk_dg', name: '북구', path: 'M 130 70 L 200 55 L 235 105 L 210 155 L 140 145 Z', labelX: 180, labelY: 107 },
  { id: 'suseong', name: '수성구', path: 'M 210 175 L 280 160 L 315 220 L 285 280 L 215 265 Z', labelX: 260, labelY: 222 },
  { id: 'dalseo', name: '달서구', path: 'M 55 180 L 120 165 L 155 225 L 125 285 L 60 270 Z', labelX: 105, labelY: 227 },
  { id: 'dalseong', name: '달성군', path: 'M 30 100 L 115 80 L 160 150 L 130 230 L 50 260 L 20 180 Z', labelX: 85, labelY: 172 },
]

export default function DaeguMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: DaeguMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-[4/3] max-w-[320px] mx-auto">
      <svg
        viewBox="0 0 350 330"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="350" height="330" fill="#f0f9ff" rx="12" />

        {DAEGU_GUS.map((gu) => {
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
                fontSize="10"
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

        <text x="175" y="315" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          대구광역시
        </text>
      </svg>
    </div>
  )
}
