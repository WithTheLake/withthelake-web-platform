'use client'

import { motion } from 'framer-motion'

interface GangwonMapProps {
  selectedCity: string | null
  onCitySelect: (cityId: string) => void
}

// 강원도 시군구 SVG 경로 데이터 (간략화된 버전)
const GANGWON_CITIES = [
  {
    id: 'cheorwon',
    name: '철원군',
    // 북서쪽
    path: 'M 45 25 L 75 20 L 90 35 L 85 55 L 60 60 L 40 50 Z',
    labelX: 62,
    labelY: 42,
  },
  {
    id: 'hwacheon',
    name: '화천군',
    // 북쪽 중앙
    path: 'M 90 35 L 120 30 L 135 45 L 130 70 L 100 75 L 85 55 Z',
    labelX: 108,
    labelY: 55,
  },
  {
    id: 'yanggu',
    name: '양구군',
    // 북쪽 동쪽
    path: 'M 135 45 L 165 40 L 180 55 L 175 80 L 145 85 L 130 70 Z',
    labelX: 155,
    labelY: 65,
  },
  {
    id: 'inje',
    name: '인제군',
    // 북동쪽 큰 영역
    path: 'M 180 55 L 215 50 L 235 70 L 230 120 L 195 130 L 175 110 L 175 80 Z',
    labelX: 200,
    labelY: 90,
  },
  {
    id: 'goseong',
    name: '고성군',
    // 최북동쪽
    path: 'M 235 70 L 260 65 L 275 90 L 265 120 L 245 125 L 230 120 Z',
    labelX: 252,
    labelY: 95,
  },
  {
    id: 'chuncheon',
    name: '춘천시',
    // 중북서쪽
    path: 'M 60 60 L 85 55 L 100 75 L 130 70 L 145 85 L 140 110 L 110 120 L 80 110 L 55 90 Z',
    labelX: 100,
    labelY: 92,
  },
  {
    id: 'hongcheon',
    name: '홍천군',
    // 중앙 큰 영역
    path: 'M 140 110 L 175 110 L 195 130 L 190 165 L 155 175 L 120 165 L 100 140 L 110 120 Z',
    labelX: 148,
    labelY: 145,
  },
  {
    id: 'sokcho',
    name: '속초시',
    // 동해안 북쪽
    path: 'M 265 120 L 280 115 L 290 135 L 280 155 L 260 150 L 255 130 Z',
    labelX: 272,
    labelY: 137,
  },
  {
    id: 'yangyang',
    name: '양양군',
    // 동해안
    path: 'M 230 120 L 265 120 L 260 150 L 280 155 L 275 190 L 245 195 L 225 175 L 225 145 Z',
    labelX: 250,
    labelY: 160,
  },
  {
    id: 'hoengseong',
    name: '횡성군',
    // 중서쪽
    path: 'M 55 90 L 80 110 L 110 120 L 100 140 L 95 170 L 60 175 L 40 150 L 45 110 Z',
    labelX: 75,
    labelY: 140,
  },
  {
    id: 'wonju',
    name: '원주시',
    // 남서쪽
    path: 'M 40 150 L 60 175 L 95 170 L 100 200 L 85 230 L 50 235 L 30 210 L 25 175 Z',
    labelX: 62,
    labelY: 200,
  },
  {
    id: 'pyeongchang',
    name: '평창군',
    // 중앙 동쪽
    path: 'M 120 165 L 155 175 L 190 165 L 210 190 L 200 225 L 160 235 L 130 215 L 125 185 Z',
    labelX: 162,
    labelY: 200,
  },
  {
    id: 'gangneung',
    name: '강릉시',
    // 동해안 중앙
    path: 'M 225 175 L 245 195 L 275 190 L 290 220 L 280 265 L 240 270 L 215 250 L 210 215 L 210 190 Z',
    labelX: 248,
    labelY: 230,
  },
  {
    id: 'yeongwol',
    name: '영월군',
    // 남쪽 서쪽
    path: 'M 95 170 L 100 140 L 120 165 L 125 185 L 130 215 L 115 245 L 85 250 L 70 230 L 85 230 L 100 200 Z',
    labelX: 105,
    labelY: 215,
  },
  {
    id: 'jeongseon',
    name: '정선군',
    // 남쪽 중앙
    path: 'M 130 215 L 160 235 L 175 265 L 155 295 L 120 290 L 100 265 L 115 245 Z',
    labelX: 138,
    labelY: 265,
  },
  {
    id: 'donghae',
    name: '동해시',
    // 동해안 남쪽
    path: 'M 240 270 L 280 265 L 290 290 L 275 310 L 250 305 L 245 280 Z',
    labelX: 265,
    labelY: 288,
  },
  {
    id: 'taebaek',
    name: '태백시',
    // 남동쪽
    path: 'M 200 225 L 215 250 L 240 270 L 245 280 L 230 305 L 195 310 L 175 290 L 175 265 L 200 255 Z',
    labelX: 210,
    labelY: 280,
  },
  {
    id: 'samcheok',
    name: '삼척시',
    // 최남동쪽
    path: 'M 175 290 L 195 310 L 230 305 L 250 305 L 275 310 L 285 340 L 260 370 L 200 375 L 165 345 L 160 310 Z',
    labelX: 215,
    labelY: 340,
  },
]

export default function GangwonMap({ selectedCity, onCitySelect }: GangwonMapProps) {
  return (
    <div className="w-full aspect-square max-w-[320px] mx-auto">
      <svg
        viewBox="0 0 320 400"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        {/* 배경 */}
        <rect x="0" y="0" width="320" height="400" fill="#f0f9ff" rx="12" />

        {/* 동해 표시 */}
        <text x="295" y="200" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">
          동
        </text>
        <text x="295" y="215" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">
          해
        </text>

        {/* 시군구 영역 */}
        {GANGWON_CITIES.map((city) => (
          <g key={city.id}>
            <motion.path
              d={city.path}
              fill={selectedCity === city.id ? '#22c55e' : '#bbf7d0'}
              stroke={selectedCity === city.id ? '#15803d' : '#86efac'}
              strokeWidth={selectedCity === city.id ? 2.5 : 1.5}
              className="cursor-pointer"
              onClick={() => onCitySelect(city.id)}
              whileHover={{
                fill: selectedCity === city.id ? '#22c55e' : '#86efac',
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <text
              x={city.labelX}
              y={city.labelY}
              fontSize="9"
              fill={selectedCity === city.id ? '#fff' : '#166534'}
              fontWeight={selectedCity === city.id ? 'bold' : 'normal'}
              textAnchor="middle"
              className="pointer-events-none select-none"
              style={{ textShadow: selectedCity === city.id ? '0 1px 2px rgba(0,0,0,0.3)' : 'none' }}
            >
              {city.name}
            </text>
          </g>
        ))}

        {/* 제목 */}
        <text x="160" y="390" fontSize="14" fill="#166534" fontWeight="bold" textAnchor="middle">
          강원특별자치도
        </text>
      </svg>
    </div>
  )
}
