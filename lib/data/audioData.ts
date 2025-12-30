import type { AudioItem } from '@/types/audio'

// 걷기 안내 데이터 (Fallback용)
export const walkGuides: AudioItem[] = [
  {
    id: 'walk-1',
    title: '걷기 시작하기',
    description: '걷기의 의미와 효과, 호흡과 스트레칭, 걷기 명상 안내',
    filename: '1.걷기안내.wav',
    emoji: '🚶‍♀️',
    category: 'walk_guide'
  },
  {
    id: 'walk-2',
    title: '맨발걷기 안내',
    description: '맨발걷기의 효과와 안전한 맨발걷기 가이드',
    filename: '2.맨발걷기안내.wav',
    emoji: '🚶‍♂️',
    category: 'walk_guide'
  },
  {
    id: 'walk-3',
    title: '느티나무 삼십리길 안내',
    description: '강원도 철원군 화강 느티나무 삼십리길 소개',
    filename: '3.길안내_1_화강 느티나무 삼십리길.wav',
    emoji: '🌳',
    category: 'walk_guide'
  },
  {
    id: 'walk-4',
    title: '군탄공원 안내',
    description: '강원도 철원군 군탄공원 및 맨발걷기길 소개',
    filename: '3.길안내_2_군탄공원맨발걷기길.wav',
    emoji: '🌲',
    category: 'walk_guide'
  },
  {
    id: 'walk-5',
    title: '걷기 마무리하기',
    description: '힐링로드 ON을 이용해 주셔서 감사합니다',
    filename: '(기록_설문안내).wav',
    emoji: '😄',
    category: 'walk_guide'
  },
]

// 긍정확언 데이터 (Fallback용)
export const affirmations: AudioItem[] = [
  {
    id: 'affirm-1',
    title: '자기수용1',
    description: '나는 있는 그대로의 나를 사랑하고 존중합니다.',
    filename: '1.나는있는그대로의 나를 사랑하고 존중합니다.wav',
    emoji: '🌳',
    category: 'affirmation'
  },
  {
    id: 'affirm-2',
    title: '자기수용2',
    description: '나의 모든 경험은 나를 성장시키는 소중한 자산입니다.',
    filename: '2. 나의 모든경험은 나르 성장시키는 소중한 자산입니다.wav',
    emoji: '🌳',
    category: 'affirmation'
  },
  {
    id: 'affirm-3',
    title: '성장1',
    description: '나는 매일 새로운 가능성을 향해 나아갑니다.',
    filename: '1.나는 매일 새로운 가능성을 향해 나아갑니다..wav',
    emoji: '🌱',
    category: 'affirmation'
  },
  {
    id: 'affirm-4',
    title: '성장2',
    description: '나는 모든 경험에서 배우고 성장합니다.',
    filename: '2.나는 모든 경험에서 배우고 성장합니다..wav',
    emoji: '🌱',
    category: 'affirmation'
  },
  {
    id: 'affirm-5',
    title: '자신감1',
    description: '나는 나의 진정한 목소리를 당당하게 표현합니다.',
    filename: '1.나는 나의 진정한 목소리를 당당하게 표현합니다.wav',
    emoji: '🏖',
    category: 'affirmation'
  },
  {
    id: 'affirm-6',
    title: '자신감2',
    description: '나는 나의 강점과 재능을 온전히 발휘합니다.',
    filename: '2. 나는 나의 강점과 재능을 온전히 발휘합니다.wav',
    emoji: '🏖',
    category: 'affirmation'
  },
  {
    id: 'affirm-7',
    title: '평화1',
    description: '나는 나의 마음에 평화와 고요함을 초대합니다.',
    filename: '1. 나는 나의 마음에 평화와 고요함을 초대합니다.wav',
    emoji: '🌫',
    category: 'affirmation'
  },
  {
    id: 'affirm-8',
    title: '평화2',
    description: '나는 지금 이순간에 온전히 머무르며, 나 자신을 치유합니다.',
    filename: '2. 나는 지금 이 순간에 온전히 머무르며, 나 자신을 치유합니다.wav',
    emoji: '🌫',
    category: 'affirmation'
  },
  {
    id: 'affirm-9',
    title: '감사',
    description: '나는 나의 삶에 주어진 모든 것에 감사합니다.',
    filename: '1.나는 나의 삶에 주어진 모든 것에 감사합니다.wav',
    emoji: '⛅',
    category: 'affirmation'
  },
]

// 모든 오디오 아이템 (필요시 사용)
export const allAudioItems: AudioItem[] = [...walkGuides, ...affirmations]
