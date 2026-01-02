'use client'

import { motion } from 'framer-motion'

interface IncheonMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 인천광역시 구/군 SVG 경로 데이터
const INCHEON_GUS = [
  { id: 'jung_ic', name: '중구', path: 'M 100 180 L 145 170 L 170 210 L 150 250 L 105 240 Z', labelX: 135, labelY: 212 },
  { id: 'dong_ic', name: '동구', path: 'M 200 165 L 240 155 L 265 190 L 245 225 L 205 215 Z', labelX: 230, labelY: 192 },
  { id: 'michuhol', name: '미추홀구', path: 'M 175 220 L 225 210 L 255 260 L 230 305 L 180 295 Z', labelX: 212, labelY: 260 },
  { id: 'yeonsu', name: '연수구', path: 'M 220 280 L 275 270 L 305 325 L 280 375 L 225 365 Z', labelX: 260, labelY: 325 },
  { id: 'namdong', name: '남동구', path: 'M 260 225 L 320 215 L 355 275 L 325 330 L 265 320 Z', labelX: 305, labelY: 275 },
  { id: 'bupyeong', name: '부평구', path: 'M 265 145 L 325 135 L 355 185 L 330 235 L 270 225 Z', labelX: 307, labelY: 187 },
  { id: 'gyeyang', name: '계양구', path: 'M 280 80 L 340 70 L 370 120 L 345 165 L 285 155 Z', labelX: 322, labelY: 120 },
  { id: 'seo_ic', name: '서구', path: 'M 170 100 L 240 90 L 275 145 L 250 200 L 180 190 Z', labelX: 220, labelY: 147 },
  { id: 'ganghwa', name: '강화군', path: 'M 60 40 L 140 25 L 180 80 L 155 140 L 75 130 Z', labelX: 115, labelY: 85 },
  { id: 'ongjin', name: '옹진군', path: 'M 30 200 L 85 185 L 115 240 L 85 300 L 30 285 Z', labelX: 70, labelY: 245 },
]

export default function IncheonMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: IncheonMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-[4/5] max-w-[320px] mx-auto">
      <svg
        viewBox="0 0 400 420"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="400" height="420" fill="#f0f9ff" rx="12" />

        {/* 서해 표시 */}
        <text x="30" y="150" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">서</text>
        <text x="30" y="165" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">해</text>

        {INCHEON_GUS.map((gu) => {
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
                fontSize="9"
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

        <text x="200" y="405" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          인천광역시
        </text>
      </svg>
    </div>
  )
}
