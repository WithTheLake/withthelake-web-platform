// 길 안내 데이터 구조

export interface Trail {
  id: string
  name: string
  description: string
  distance: string // 예: "3.2km"
  duration: string // 예: "약 1시간"
  difficulty: 'easy' | 'moderate' | 'hard'
  audioId?: string // 연결된 오디오 ID
  coordinates?: {
    start: { lat: number; lng: number }
    end: { lat: number; lng: number }
  }
}

export interface City {
  id: string
  name: string
  trails: Trail[]
}

export interface Province {
  id: string
  name: string
  cities: City[]
}

// 강원도 데이터
export const GANGWON_DATA: Province = {
  id: 'gangwon',
  name: '강원도',
  cities: [
    {
      id: 'chuncheon',
      name: '춘천시',
      trails: [
        {
          id: 'chuncheon-1',
          name: '소양강 맨발 산책로',
          description: '소양강을 따라 걷는 평화로운 맨발 코스',
          distance: '2.5km',
          duration: '약 40분',
          difficulty: 'easy',
        },
        {
          id: 'chuncheon-2',
          name: '공지천 힐링로드',
          description: '공지천 유원지를 지나는 자연 친화 코스',
          distance: '3.0km',
          duration: '약 50분',
          difficulty: 'easy',
        },
      ],
    },
    {
      id: 'wonju',
      name: '원주시',
      trails: [
        {
          id: 'wonju-1',
          name: '치악산 맨발 숲길',
          description: '치악산 자락의 부드러운 숲길 코스',
          distance: '2.0km',
          duration: '약 35분',
          difficulty: 'moderate',
        },
      ],
    },
    {
      id: 'gangneung',
      name: '강릉시',
      trails: [
        {
          id: 'gangneung-1',
          name: '경포해변 맨발 워킹',
          description: '경포해변의 모래사장을 걷는 해변 코스',
          distance: '2.8km',
          duration: '약 45분',
          difficulty: 'easy',
        },
        {
          id: 'gangneung-2',
          name: '솔향기길 맨발 코스',
          description: '소나무 숲 사이로 걷는 향기로운 코스',
          distance: '3.5km',
          duration: '약 1시간',
          difficulty: 'moderate',
        },
      ],
    },
    {
      id: 'sokcho',
      name: '속초시',
      trails: [
        {
          id: 'sokcho-1',
          name: '속초해변 맨발길',
          description: '속초 해변을 따라 걷는 시원한 코스',
          distance: '2.2km',
          duration: '약 35분',
          difficulty: 'easy',
        },
      ],
    },
    {
      id: 'donghae',
      name: '동해시',
      trails: [
        {
          id: 'donghae-1',
          name: '추암해변 맨발 산책로',
          description: '촛대바위를 감상하며 걷는 해변 코스',
          distance: '1.8km',
          duration: '약 30분',
          difficulty: 'easy',
        },
      ],
    },
    {
      id: 'samcheok',
      name: '삼척시',
      trails: [
        {
          id: 'samcheok-1',
          name: '이사부길 맨발 코스',
          description: '해안 절경을 감상하는 힐링 코스',
          distance: '3.2km',
          duration: '약 55분',
          difficulty: 'moderate',
        },
      ],
    },
    {
      id: 'taebaek',
      name: '태백시',
      trails: [
        {
          id: 'taebaek-1',
          name: '황지연못 맨발길',
          description: '낙동강 발원지를 둘러보는 고원 코스',
          distance: '1.5km',
          duration: '약 25분',
          difficulty: 'easy',
        },
      ],
    },
    {
      id: 'hongcheon',
      name: '홍천군',
      trails: [
        {
          id: 'hongcheon-1',
          name: '수타사 맨발 숲길',
          description: '수타사 계곡을 따라 걷는 청정 코스',
          distance: '2.7km',
          duration: '약 45분',
          difficulty: 'moderate',
        },
      ],
    },
    {
      id: 'hoengseong',
      name: '횡성군',
      trails: [
        {
          id: 'hoengseong-1',
          name: '청태산 맨발 치유길',
          description: '청태산 자연휴양림의 힐링 코스',
          distance: '2.3km',
          duration: '약 40분',
          difficulty: 'easy',
        },
      ],
    },
    {
      id: 'yeongwol',
      name: '영월군',
      trails: [
        {
          id: 'yeongwol-1',
          name: '동강 맨발 트레킹',
          description: '동강변을 따라 걷는 자연 코스',
          distance: '3.0km',
          duration: '약 50분',
          difficulty: 'moderate',
        },
      ],
    },
    {
      id: 'pyeongchang',
      name: '평창군',
      trails: [
        {
          id: 'pyeongchang-1',
          name: '오대산 맨발 명상길',
          description: '오대산의 고요한 숲속 명상 코스',
          distance: '2.5km',
          duration: '약 40분',
          difficulty: 'moderate',
        },
      ],
    },
    {
      id: 'jeongseon',
      name: '정선군',
      trails: [
        {
          id: 'jeongseon-1',
          name: '아우라지 맨발길',
          description: '아우라지 강변을 걷는 평화로운 코스',
          distance: '2.0km',
          duration: '약 35분',
          difficulty: 'easy',
        },
      ],
    },
    {
      id: 'cheorwon',
      name: '철원군',
      trails: [
        {
          id: 'cheorwon-1',
          name: '한탄강 맨발 지질길',
          description: '한탄강 주상절리를 감상하는 코스',
          distance: '2.8km',
          duration: '약 45분',
          difficulty: 'moderate',
        },
      ],
    },
    {
      id: 'hwacheon',
      name: '화천군',
      trails: [
        {
          id: 'hwacheon-1',
          name: '파로호 맨발 둘레길',
          description: '파로호 호수변을 걷는 힐링 코스',
          distance: '3.2km',
          duration: '약 55분',
          difficulty: 'easy',
        },
      ],
    },
    {
      id: 'yanggu',
      name: '양구군',
      trails: [
        {
          id: 'yanggu-1',
          name: '두타연 맨발 계곡길',
          description: '두타연 계곡을 따라 걷는 청정 코스',
          distance: '2.4km',
          duration: '약 40분',
          difficulty: 'moderate',
        },
      ],
    },
    {
      id: 'inje',
      name: '인제군',
      trails: [
        {
          id: 'inje-1',
          name: '내린천 맨발 물길',
          description: '내린천 계곡의 시원한 물가 코스',
          distance: '2.6km',
          duration: '약 45분',
          difficulty: 'easy',
        },
      ],
    },
    {
      id: 'goseong',
      name: '고성군',
      trails: [
        {
          id: 'goseong-1',
          name: '화진포 맨발 해변길',
          description: '화진포 해변을 따라 걷는 동해안 코스',
          distance: '2.0km',
          duration: '약 35분',
          difficulty: 'easy',
        },
      ],
    },
    {
      id: 'yangyang',
      name: '양양군',
      trails: [
        {
          id: 'yangyang-1',
          name: '낙산해변 맨발 워킹',
          description: '낙산사 인근 해변의 맨발 코스',
          distance: '2.3km',
          duration: '약 40분',
          difficulty: 'easy',
        },
      ],
    },
  ],
}

// 전체 도 데이터 (나중에 확장)
export const PROVINCES: Province[] = [GANGWON_DATA]

// 난이도 표시
export const DIFFICULTY_LABELS = {
  easy: { label: '쉬움', color: 'text-green-600', bg: 'bg-green-100' },
  moderate: { label: '보통', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  hard: { label: '어려움', color: 'text-red-600', bg: 'bg-red-100' },
}
