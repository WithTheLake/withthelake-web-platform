'use client'

import { motion } from 'framer-motion'

interface DaejeonMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 대전광역시 5개 구 SVG 경로 데이터
const DAEJEON_GUS = [
  { id: 'dong_dj', name: '동구', path: 'M 200 50 L 280 40 L 320 100 L 290 170 L 210 155 Z', labelX: 255, labelY: 105 },
  { id: 'jung_dj', name: '중구', path: 'M 140 100 L 205 90 L 235 150 L 210 210 L 150 195 Z', labelX: 185, labelY: 152 },
  { id: 'seo_dj', name: '서구', path: 'M 60 130 L 135 115 L 170 185 L 140 255 L 70 240 Z', labelX: 115, labelY: 187 },
  { id: 'yuseong', name: '유성구', path: 'M 50 60 L 140 45 L 175 110 L 145 180 L 60 165 Z', labelX: 110, labelY: 115 },
  { id: 'daedeok', name: '대덕구', path: 'M 150 45 L 230 30 L 265 85 L 240 145 L 160 130 Z', labelX: 205, labelY: 90 },
]

export default function DaejeonMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: DaejeonMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-[4/3] max-w-[320px] mx-auto">
      <svg
        viewBox="0 0 350 300"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="350" height="300" fill="#f0f9ff" rx="12" />

        {DAEJEON_GUS.map((gu) => {
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
                fontSize="11"
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

        <text x="175" y="285" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          대전광역시
        </text>
      </svg>
    </div>
  )
}
