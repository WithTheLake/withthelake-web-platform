'use client'

import { motion } from 'framer-motion'

interface UlsanMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 울산광역시 5개 구/군 SVG 경로 데이터
const ULSAN_GUS = [
  { id: 'jung_us', name: '중구', path: 'M 140 165 L 195 155 L 225 205 L 200 255 L 145 245 Z', labelX: 180, labelY: 207 },
  { id: 'nam_us', name: '남구', path: 'M 155 250 L 215 240 L 250 300 L 220 355 L 160 345 Z', labelX: 200, labelY: 300 },
  { id: 'dong_us', name: '동구', path: 'M 225 200 L 285 185 L 320 245 L 290 305 L 235 295 Z', labelX: 270, labelY: 247 },
  { id: 'buk_us', name: '북구', path: 'M 175 95 L 245 80 L 285 140 L 255 200 L 185 185 Z', labelX: 227, labelY: 142 },
  { id: 'ulju', name: '울주군', path: 'M 50 60 L 170 40 L 220 120 L 190 220 L 100 250 L 40 170 Z', labelX: 125, labelY: 150 },
]

export default function UlsanMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: UlsanMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-[4/5] max-w-[300px] mx-auto">
      <svg
        viewBox="0 0 350 400"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="350" height="400" fill="#f0f9ff" rx="12" />

        {/* 동해 표시 */}
        <text x="310" y="200" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">동</text>
        <text x="310" y="215" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">해</text>

        {ULSAN_GUS.map((gu) => {
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

        <text x="175" y="385" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          울산광역시
        </text>
      </svg>
    </div>
  )
}
