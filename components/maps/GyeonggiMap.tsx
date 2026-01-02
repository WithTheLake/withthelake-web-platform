'use client'

import { motion } from 'framer-motion'

interface GyeonggiMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 경기도 시군구 SVG 경로 데이터
const GYEONGGI_CITIES = [
  { id: 'suwon', name: '수원시', path: 'M 145 200 L 165 195 L 175 210 L 165 225 L 145 225 Z', labelX: 158, labelY: 212 },
  { id: 'seongnam', name: '성남시', path: 'M 175 175 L 195 170 L 205 185 L 195 200 L 175 200 Z', labelX: 188, labelY: 187 },
  { id: 'goyang', name: '고양시', path: 'M 120 95 L 150 90 L 165 110 L 150 130 L 120 130 Z', labelX: 142, labelY: 112 },
  { id: 'yongin', name: '용인시', path: 'M 170 215 L 200 210 L 220 235 L 200 260 L 170 255 Z', labelX: 192, labelY: 237 },
  { id: 'bucheon', name: '부천시', path: 'M 95 135 L 115 130 L 125 145 L 115 160 L 95 160 Z', labelX: 108, labelY: 147 },
  { id: 'ansan', name: '안산시', path: 'M 95 200 L 120 195 L 135 215 L 120 235 L 95 235 Z', labelX: 113, labelY: 217 },
  { id: 'anyang', name: '안양시', path: 'M 130 170 L 150 165 L 160 180 L 150 195 L 130 195 Z', labelX: 143, labelY: 182 },
  { id: 'namyangju', name: '남양주시', path: 'M 200 110 L 235 100 L 255 125 L 235 150 L 200 145 Z', labelX: 225, labelY: 127 },
  { id: 'hwaseong', name: '화성시', path: 'M 100 245 L 145 235 L 170 270 L 145 305 L 100 295 Z', labelX: 133, labelY: 272 },
  { id: 'pyeongtaek', name: '평택시', path: 'M 95 305 L 135 295 L 155 325 L 135 355 L 95 345 Z', labelX: 123, labelY: 327 },
  { id: 'uijeongbu', name: '의정부시', path: 'M 165 75 L 185 70 L 195 85 L 185 100 L 165 100 Z', labelX: 178, labelY: 87 },
  { id: 'siheung', name: '시흥시', path: 'M 85 175 L 110 170 L 120 190 L 105 210 L 85 205 Z', labelX: 100, labelY: 192 },
  { id: 'paju', name: '파주시', path: 'M 85 55 L 125 45 L 145 70 L 125 95 L 85 90 Z', labelX: 113, labelY: 72 },
  { id: 'gimpo', name: '김포시', path: 'M 60 95 L 90 90 L 100 115 L 85 135 L 60 130 Z', labelX: 78, labelY: 115 },
  { id: 'gwangmyeong', name: '광명시', path: 'M 110 160 L 125 155 L 132 168 L 125 180 L 110 180 Z', labelX: 120, labelY: 169 },
  { id: 'gwangju_g', name: '광주시', path: 'M 210 175 L 240 170 L 255 195 L 240 220 L 210 215 Z', labelX: 230, labelY: 197 },
  { id: 'gunpo', name: '군포시', path: 'M 135 195 L 150 192 L 157 205 L 150 218 L 135 218 Z', labelX: 145, labelY: 207 },
  { id: 'hanam', name: '하남시', path: 'M 195 155 L 215 150 L 225 165 L 215 180 L 195 180 Z', labelX: 208, labelY: 167 },
  { id: 'osan', name: '오산시', path: 'M 155 255 L 175 250 L 185 265 L 175 280 L 155 280 Z', labelX: 168, labelY: 267 },
  { id: 'icheon', name: '이천시', path: 'M 230 230 L 265 220 L 285 250 L 265 280 L 230 275 Z', labelX: 255, labelY: 252 },
  { id: 'anseong', name: '안성시', path: 'M 185 290 L 225 280 L 245 310 L 225 340 L 185 335 Z', labelX: 213, labelY: 312 },
  { id: 'uiwang', name: '의왕시', path: 'M 145 195 L 160 192 L 167 205 L 160 218 L 145 218 Z', labelX: 155, labelY: 207 },
  { id: 'yangpyeong', name: '양평군', path: 'M 250 145 L 295 135 L 315 170 L 295 205 L 250 195 Z', labelX: 280, labelY: 172 },
  { id: 'yeoju', name: '여주시', path: 'M 270 215 L 310 205 L 330 240 L 310 275 L 270 265 Z', labelX: 298, labelY: 242 },
  { id: 'gapyeong', name: '가평군', path: 'M 230 65 L 275 55 L 300 90 L 280 125 L 235 115 Z', labelX: 262, labelY: 92 },
  { id: 'yeoncheon', name: '연천군', path: 'M 145 25 L 190 15 L 210 45 L 190 75 L 145 65 Z', labelX: 175, labelY: 47 },
  { id: 'pocheon', name: '포천시', path: 'M 195 50 L 240 40 L 265 75 L 245 110 L 200 100 Z', labelX: 228, labelY: 77 },
  { id: 'dongducheon', name: '동두천시', path: 'M 175 55 L 195 50 L 205 65 L 195 80 L 175 80 Z', labelX: 188, labelY: 67 },
  { id: 'gwacheon', name: '과천시', path: 'M 155 175 L 170 172 L 177 185 L 170 198 L 155 198 Z', labelX: 165, labelY: 187 },
]

export default function GyeonggiMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: GyeonggiMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-square max-w-[320px] mx-auto">
      <svg
        viewBox="0 0 350 380"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="350" height="380" fill="#f0f9ff" rx="12" />

        {/* 서울 표시 (경기도 중앙) */}
        <circle cx="160" cy="140" r="20" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
        <text x="160" y="144" fontSize="8" fill="#92400e" fontWeight="bold" textAnchor="middle">서울</text>

        {GYEONGGI_CITIES.map((city) => {
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
                fontSize="7"
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

        <text x="175" y="370" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          경기도
        </text>
      </svg>
    </div>
  )
}
