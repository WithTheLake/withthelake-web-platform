'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 활성화된 오디오 트랙 목록 조회
 * @param category 'walk_guide' | 'affirmation' | null (전체)
 */
export async function getAudioTracks(category?: string) {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('audio_tracks')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Get audio tracks error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch audio tracks'
    }
  }
}

/**
 * 특정 오디오 트랙 상세 조회
 */
export async function getAudioTrack(id: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('audio_tracks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Get audio track error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch audio track'
    }
  }
}
