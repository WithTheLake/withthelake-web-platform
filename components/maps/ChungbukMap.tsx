'use client'

import { motion } from 'framer-motion'

interface ChungbukMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 충청북도 시군구 SVG 경로 데이터
const CHUNGBUK_CITIES = [
  { id: 'cheongju', name: '청주시', path: 'M 100 150 L 160 140 L 180 180 L 160 220 L 100 210 Z', labelX: 138, labelY: 182 },
  { id: 'chungju', name: '충주시', path: 'M 170 80 L 230 70 L 260 120 L 235 170 L 175 160 Z', labelX: 212, labelY: 122 },
  { id: 'jecheon', name: '제천시', path: 'M 245 60 L 300 50 L 325 100 L 300 150 L 250 140 Z', labelX: 283, labelY: 102 },
  { id: 'boeun', name: '보은군', path: 'M 85 220 L 130 210 L 150 250 L 130 290 L 85 280 Z', labelX: 115, labelY: 252 },
  { id: 'okcheon', name: '옥천군', path: 'M 60 280 L 100 270 L 120 310 L 100 350 L 60 340 Z', labelX: 88, labelY: 312 },
  { id: 'yeongdong', name: '영동군', path: 'M 90 340 L 140 330 L 165 375 L 140 410 L 90 400 Z', labelX: 125, labelY: 372 },
  { id: 'jeungpyeong', name: '증평군', path: 'M 100 115 L 130 108 L 145 135 L 130 160 L 100 155 Z', labelX: 120, labelY: 137 },
  { id: 'jincheon', name: '진천군', path: 'M 55 95 L 100 85 L 120 120 L 100 155 L 55 145 Z', labelX: 85, labelY: 122 },
  { id: 'goesan', name: '괴산군', path: 'M 145 155 L 195 145 L 220 190 L 195 235 L 145 225 Z', labelX: 180, labelY: 192 },
  { id: 'eumseong', name: '음성군', path: 'M 100 55 L 155 45 L 180 85 L 155 125 L 100 115 Z', labelX: 137, labelY: 87 },
  { id: 'danyang', name: '단양군', path: 'M 280 130 L 330 120 L 350 165 L 325 210 L 280 200 Z', labelX: 312, labelY: 167 },
]

export default function ChungbukMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: ChungbukMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-[4/5] max-w-[320px] mx-auto">
      <svg
        viewBox="0 0 380 440"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="380" height="440" fill="#f0f9ff" rx="12" />

        {CHUNGBUK_CITIES.map((city) => {
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

        <text x="190" y="430" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          충청북도
        </text>
      </svg>
    </div>
  )
}
