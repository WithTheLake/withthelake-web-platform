'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { getAudioTrack } from '@/actions/audioActions'
import { AudioForm } from '@/components/admin/AudioForm'
import type { AudioItem } from '@/types/audio'

export default function AdminAudioEditPage() {
  const params = useParams()
  const id = params.id as string

  const [audio, setAudio] = useState<AudioItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAudio = async () => {
      const result = await getAudioTrack(id)
      if (result.success && result.data) {
        setAudio(result.data as AudioItem)
      } else {
        setError('오디오 트랙을 찾을 수 없습니다.')
      }
      setIsLoading(false)
    }
    fetchAudio()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    )
  }

  if (error || !audio) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">{error || '오디오 트랙을 찾을 수 없습니다.'}</p>
      </div>
    )
  }

  return <AudioForm audio={audio} mode="edit" />
}
