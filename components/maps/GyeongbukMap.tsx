'use client'

import { motion } from 'framer-motion'

interface GyeongbukMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 경상북도 시군구 SVG 경로 데이터
const GYEONGBUK_CITIES = [
  { id: 'pohang', name: '포항시', path: 'M 340 180 L 385 170 L 400 210 L 380 250 L 340 240 Z', labelX: 367, labelY: 212 },
  { id: 'gyeongju', name: '경주시', path: 'M 320 245 L 370 235 L 395 280 L 370 325 L 320 315 Z', labelX: 355, labelY: 282 },
  { id: 'gimcheon', name: '김천시', path: 'M 55 235 L 110 225 L 140 275 L 115 320 L 60 310 Z', labelX: 97, labelY: 275 },
  { id: 'andong', name: '안동시', path: 'M 150 130 L 210 120 L 245 170 L 220 220 L 155 210 Z', labelX: 195, labelY: 172 },
  { id: 'gumi', name: '구미시', path: 'M 75 280 L 130 270 L 160 320 L 135 365 L 80 355 Z', labelX: 117, labelY: 320 },
  { id: 'yeongju', name: '영주시', path: 'M 115 65 L 170 55 L 200 100 L 175 145 L 120 135 Z', labelX: 155, labelY: 102 },
  { id: 'yeongcheon', name: '영천시', path: 'M 260 235 L 315 225 L 345 275 L 320 320 L 265 310 Z', labelX: 300, labelY: 275 },
  { id: 'sangju', name: '상주시', path: 'M 65 150 L 125 140 L 155 190 L 130 240 L 70 230 Z', labelX: 110, labelY: 192 },
  { id: 'mungyeong', name: '문경시', path: 'M 80 85 L 130 75 L 155 120 L 130 160 L 80 150 Z', labelX: 115, labelY: 120 },
  { id: 'gyeongsan', name: '경산시', path: 'M 230 305 L 280 295 L 305 340 L 280 380 L 230 370 Z', labelX: 265, labelY: 340 },
  { id: 'uiseong', name: '의성군', path: 'M 170 185 L 225 175 L 255 225 L 230 270 L 175 260 Z', labelX: 210, labelY: 225 },
  { id: 'cheongsong', name: '청송군', path: 'M 230 130 L 285 120 L 315 165 L 290 210 L 235 200 Z', labelX: 270, labelY: 167 },
  { id: 'yeongyang', name: '영양군', path: 'M 265 70 L 315 60 L 340 100 L 315 140 L 265 130 Z', labelX: 300, labelY: 102 },
  { id: 'yeongdeok', name: '영덕군', path: 'M 315 100 L 365 90 L 390 135 L 365 180 L 315 170 Z', labelX: 350, labelY: 137 },
  { id: 'cheongdo', name: '청도군', path: 'M 270 330 L 320 320 L 345 365 L 320 405 L 270 395 Z', labelX: 305, labelY: 365 },
  { id: 'goryeong', name: '고령군', path: 'M 120 340 L 170 330 L 195 375 L 170 415 L 120 405 Z', labelX: 155, labelY: 375 },
  { id: 'seongju', name: '성주군', path: 'M 100 290 L 150 280 L 175 325 L 150 365 L 100 355 Z', labelX: 135, labelY: 325 },
  { id: 'chilgok', name: '칠곡군', path: 'M 145 300 L 195 290 L 220 335 L 195 375 L 145 365 Z', labelX: 180, labelY: 335 },
  { id: 'yecheon', name: '예천군', path: 'M 110 100 L 160 90 L 185 135 L 160 175 L 110 165 Z', labelX: 145, labelY: 135 },
  { id: 'bonghwa', name: '봉화군', path: 'M 175 50 L 235 40 L 265 85 L 240 130 L 180 120 Z', labelX: 217, labelY: 87 },
  { id: 'uljin', name: '울진군', path: 'M 315 40 L 375 30 L 400 80 L 375 130 L 320 120 Z', labelX: 355, labelY: 82 },
  { id: 'ulleung', name: '울릉군', path: 'M 450 60 L 485 55 L 495 80 L 480 100 L 450 95 Z', labelX: 472, labelY: 80 },
  { id: 'gunwi', name: '군위군', path: 'M 195 230 L 245 220 L 270 265 L 245 305 L 195 295 Z', labelX: 230, labelY: 265 },
]

export default function GyeongbukMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: GyeongbukMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-[5/4] max-w-[360px] mx-auto">
      <svg
        viewBox="0 0 510 430"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="510" height="430" fill="#f0f9ff" rx="12" />

        {/* 동해 표시 */}
        <text x="430" y="150" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">동</text>
        <text x="430" y="165" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">해</text>

        {/* 대구 표시 */}
        <text x="195" y="365" fontSize="8" fill="#9ca3af" textAnchor="middle">(대구)</text>

        {GYEONGBUK_CITIES.map((city) => {
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

        <text x="255" y="420" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          경상북도
        </text>
      </svg>
    </div>
  )
}
