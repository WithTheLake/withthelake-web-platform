'use client'

import { motion } from 'framer-motion'

interface BusanMapProps {
  selectedCity: string | null
  availableCities: string[]
  onCitySelect: (cityId: string) => void
}

// 부산광역시 16개 구/군 SVG 경로 데이터
const BUSAN_GUS = [
  { id: 'jung_bs', name: '중구', path: 'M 195 205 L 225 200 L 240 225 L 225 250 L 200 245 Z', labelX: 217, labelY: 227 },
  { id: 'seo_bs', name: '서구', path: 'M 160 200 L 195 195 L 215 230 L 195 265 L 165 260 Z', labelX: 187, labelY: 232 },
  { id: 'dong_bs', name: '동구', path: 'M 225 185 L 260 180 L 280 210 L 265 240 L 230 235 Z', labelX: 252, labelY: 212 },
  { id: 'yeongdo', name: '영도구', path: 'M 210 260 L 255 250 L 285 300 L 255 345 L 215 335 Z', labelX: 247, labelY: 300 },
  { id: 'busanjin', name: '부산진구', path: 'M 170 155 L 220 145 L 250 190 L 225 235 L 175 225 Z', labelX: 207, labelY: 192 },
  { id: 'dongnae', name: '동래구', path: 'M 200 105 L 250 95 L 280 140 L 255 185 L 205 175 Z', labelX: 237, labelY: 142 },
  { id: 'nam_bs', name: '남구', path: 'M 245 220 L 295 210 L 325 265 L 295 315 L 250 305 Z', labelX: 282, labelY: 265 },
  { id: 'buk_bs', name: '북구', path: 'M 115 65 L 175 55 L 210 105 L 185 155 L 125 145 Z', labelX: 160, labelY: 107 },
  { id: 'haeundae', name: '해운대구', path: 'M 280 130 L 345 115 L 380 175 L 350 235 L 290 220 Z', labelX: 327, labelY: 177 },
  { id: 'saha', name: '사하구', path: 'M 90 195 L 145 185 L 175 240 L 145 295 L 95 285 Z', labelX: 132, labelY: 242 },
  { id: 'geumjeong', name: '금정구', path: 'M 175 50 L 240 40 L 275 95 L 250 150 L 185 140 Z', labelX: 222, labelY: 97 },
  { id: 'gangseo', name: '강서구', path: 'M 35 100 L 110 85 L 150 150 L 120 220 L 50 205 Z', labelX: 90, labelY: 155 },
  { id: 'yeonje', name: '연제구', path: 'M 225 150 L 270 140 L 295 180 L 275 220 L 230 210 Z', labelX: 257, labelY: 182 },
  { id: 'suyeong', name: '수영구', path: 'M 295 195 L 340 185 L 365 230 L 340 275 L 300 265 Z', labelX: 327, labelY: 232 },
  { id: 'sasang', name: '사상구', path: 'M 115 140 L 170 130 L 200 180 L 175 230 L 120 220 Z', labelX: 155, labelY: 182 },
  { id: 'gijang', name: '기장군', path: 'M 290 35 L 365 20 L 400 85 L 375 160 L 300 145 Z', labelX: 342, labelY: 92 },
]

export default function BusanMap({
  selectedCity,
  availableCities,
  onCitySelect,
}: BusanMapProps) {
  const isAvailable = (cityId: string) => availableCities.includes(cityId)

  return (
    <div className="w-full aspect-[5/4] max-w-[340px] mx-auto">
      <svg
        viewBox="0 0 420 380"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <rect x="0" y="0" width="420" height="380" fill="#f0f9ff" rx="12" />

        {/* 바다 표시 */}
        <text x="380" y="280" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">동</text>
        <text x="380" y="295" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">해</text>
        <text x="150" y="340" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">남해</text>

        {BUSAN_GUS.map((gu) => {
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
                fontSize="8"
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

        <text x="210" y="370" fontSize="14" fill="#1e40af" fontWeight="bold" textAnchor="middle">
          부산광역시
        </text>
      </svg>
    </div>
  )
}
