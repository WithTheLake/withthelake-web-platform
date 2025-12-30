import { getAudioTracks } from '@/actions/audioActions'
import HealingPageClient from './HealingPageClient'

export default async function HealingRoadPage() {
  // 서버에서 오디오 트랙 데이터 가져오기
  const [walkGuidesResult, affirmationsResult] = await Promise.all([
    getAudioTracks('walk_guide'),
    getAudioTracks('affirmation')
  ])

  const walkGuides = walkGuidesResult.success ? walkGuidesResult.data || [] : []
  const affirmations = affirmationsResult.success ? affirmationsResult.data || [] : []

  return (
    <HealingPageClient
      walkGuides={walkGuides}
      affirmations={affirmations}
    />
  )
}
