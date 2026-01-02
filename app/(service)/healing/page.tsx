import { getAudioTracks } from '@/actions/audioActions'
import HealingPageClient from './HealingPageClient'
import type { AudioItem } from '@/types/audio'

export default async function HealingRoadPage() {
  // 서버 사이드에서 데이터 페칭 (병렬 처리)
  const [walkGuidesRes, affirmationsRes, trailGuidesRes] = await Promise.all([
    getAudioTracks('walk_guide'),
    getAudioTracks('affirmation'),
    getAudioTracks('trail_guide')
  ])

  // 데이터 추출 (실패 시 빈 배열)
  const walkGuides = walkGuidesRes.success ? (walkGuidesRes.data as AudioItem[]) : []
  const affirmations = affirmationsRes.success ? (affirmationsRes.data as AudioItem[]) : []
  const trailGuides = trailGuidesRes.success ? (trailGuidesRes.data as AudioItem[]) : []

  return (
    <HealingPageClient 
      walkGuides={walkGuides} 
      affirmations={affirmations} 
      trailGuides={trailGuides}
    />
  )
}