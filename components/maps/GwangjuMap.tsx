'use client'

import { motion } from 'framer-motion'

interface GwangjuMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 광주광역시 5개 구 SVG 경로 데이터
const GWANGJU_GUS = [
  { id: 'dong_gj', name: '동구', path: 'M 185 100 L 250 85 L 285 140 L 255 200 L 195 185 Z', labelX: 232, labelY: 145 },
  { id: 'seo_gj', name: '서구', path: 'M 70 130 L 135 115 L 170 175 L 140 240 L 80 225 Z', labelX: 120, labelY: 180 },
  { id: 'nam_gj', name: '남구', path: 'M 130 195 L 200 180 L 235 245 L 205 310 L 140 295 Z', labelX: 180, labelY: 250 },
  { id: 'buk_gj', name: '북구', path: 'M 100 50 L 185 35 L 225 100 L 195 170 L 110 155 Z', labelX: 160, labelY: 105 },
  { id: 'gwangsan', name: '광산구', path: 'M 30 90 L 110 70 L 150 150 L 115 230 L 40 210 Z', labelX: 87, labelY: 155 },
]

export default function GwangjuMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: GwangjuMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-[4/3] max-w-[300px] mx-auto">
      <svg
        viewBox="0 0 320 350"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="320" height="350" fill="#f0f9ff" rx="12" />

        {GWANGJU_GUS.map((gu) => {
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

        <text x="160" y="335" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          광주광역시
        </text>
      </svg>
    </div>
  )
}
