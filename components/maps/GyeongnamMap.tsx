'use client'

import { motion } from 'framer-motion'

interface GyeongnamMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 경상남도 시군구 SVG 경로 데이터
const GYEONGNAM_CITIES = [
  { id: 'changwon', name: '창원시', path: 'M 230 200 L 295 190 L 325 245 L 295 295 L 235 285 Z', labelX: 275, labelY: 245 },
  { id: 'jinju', name: '진주시', path: 'M 100 215 L 160 205 L 190 255 L 165 305 L 105 295 Z', labelX: 145, labelY: 257 },
  { id: 'tongyeong', name: '통영시', path: 'M 195 320 L 245 310 L 270 355 L 245 395 L 195 385 Z', labelX: 230, labelY: 355 },
  { id: 'sacheon', name: '사천시', path: 'M 90 275 L 140 265 L 165 310 L 140 350 L 90 340 Z', labelX: 125, labelY: 310 },
  { id: 'gimhae', name: '김해시', path: 'M 290 160 L 345 150 L 375 195 L 350 240 L 295 230 Z', labelX: 330, labelY: 197 },
  { id: 'miryang', name: '밀양시', path: 'M 270 100 L 325 90 L 355 135 L 330 180 L 275 170 Z', labelX: 310, labelY: 137 },
  { id: 'geoje', name: '거제시', path: 'M 265 330 L 320 315 L 355 365 L 325 415 L 270 405 Z', labelX: 307, labelY: 367 },
  { id: 'yangsan', name: '양산시', path: 'M 335 125 L 385 115 L 410 160 L 385 205 L 335 195 Z', labelX: 370, labelY: 162 },
  { id: 'uiryeong', name: '의령군', path: 'M 145 150 L 195 140 L 220 185 L 195 225 L 145 215 Z', labelX: 180, labelY: 185 },
  { id: 'haman', name: '함안군', path: 'M 180 195 L 230 185 L 255 230 L 230 270 L 180 260 Z', labelX: 215, labelY: 230 },
  { id: 'changnyeong', name: '창녕군', path: 'M 200 105 L 255 95 L 285 140 L 260 185 L 205 175 Z', labelX: 240, labelY: 142 },
  { id: 'goseong_gn', name: '고성군', path: 'M 145 295 L 200 285 L 230 335 L 200 380 L 145 370 Z', labelX: 185, labelY: 335 },
  { id: 'namhae', name: '남해군', path: 'M 75 340 L 130 330 L 160 380 L 130 425 L 75 415 Z', labelX: 115, labelY: 380 },
  { id: 'hadong', name: '하동군', path: 'M 45 250 L 100 240 L 130 290 L 105 340 L 50 330 Z', labelX: 87, labelY: 292 },
  { id: 'sancheong', name: '산청군', path: 'M 70 165 L 125 155 L 155 205 L 130 250 L 75 240 Z', labelX: 110, labelY: 205 },
  { id: 'hamyang', name: '함양군', path: 'M 45 105 L 100 95 L 130 145 L 105 190 L 50 180 Z', labelX: 87, labelY: 145 },
  { id: 'geochang', name: '거창군', path: 'M 95 60 L 155 50 L 185 100 L 160 145 L 100 135 Z', labelX: 137, labelY: 100 },
  { id: 'hapcheon', name: '합천군', path: 'M 150 95 L 210 85 L 240 135 L 215 180 L 155 170 Z', labelX: 192, labelY: 135 },
]

export default function GyeongnamMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: GyeongnamMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-[4/5] max-w-[340px] mx-auto">
      <svg
        viewBox="0 0 430 450"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="430" height="450" fill="#f0f9ff" rx="12" />

        {/* 남해 표시 */}
        <text x="200" y="440" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">남해</text>

        {/* 부산/울산 표시 */}
        <text x="375" y="235" fontSize="8" fill="#9ca3af" textAnchor="middle">(부산)</text>
        <text x="400" y="120" fontSize="8" fill="#9ca3af" textAnchor="middle">(울산)</text>

        {GYEONGNAM_CITIES.map((city) => {
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

        <text x="215" y="30" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          경상남도
        </text>
      </svg>
    </div>
  )
}
