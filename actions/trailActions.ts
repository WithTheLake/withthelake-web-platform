'use server'

import { createClient } from '@/lib/supabase/server'
import type { AudioItem } from '@/types/audio'

// 길 안내 오디오 전체 조회
export async function getTrailGuideAudios(): Promise<AudioItem[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('audio_tracks')
      .select('*')
      .eq('category', 'trail_guide')
      .eq('is_active', true)
      .order('province')
      .order('city')
      .order('order_index')

    if (error) {
      console.error('Get trail audios error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Get trail audios error:', error)
    return []
  }
}

// 특정 도의 길 안내 오디오 조회
export async function getTrailGuidesByProvince(province: string): Promise<AudioItem[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('audio_tracks')
      .select('*')
      .eq('category', 'trail_guide')
      .eq('province', province)
      .eq('is_active', true)
      .order('city')
      .order('order_index')

    if (error) {
      console.error('Get trail audios by province error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Get trail audios by province error:', error)
    return []
  }
}

// 특정 시군구의 길 안내 오디오 조회
export async function getTrailGuidesByCity(province: string, city: string): Promise<AudioItem[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('audio_tracks')
      .select('*')
      .eq('category', 'trail_guide')
      .eq('province', province)
      .eq('city', city)
      .eq('is_active', true)
      .order('order_index')

    if (error) {
      console.error('Get trail audios by city error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Get trail audios by city error:', error)
    return []
  }
}

// 오디오가 있는 도 목록 조회
export async function getAvailableProvinces(): Promise<string[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('audio_tracks')
      .select('province')
      .eq('category', 'trail_guide')
      .eq('is_active', true)
      .not('province', 'is', null)

    if (error) {
      console.error('Get available provinces error:', error)
      return []
    }

    // 중복 제거
    const provinces = [...new Set(data?.map((d) => d.province).filter(Boolean))] as string[]
    return provinces
  } catch (error) {
    console.error('Get available provinces error:', error)
    return []
  }
}

// 특정 도에서 오디오가 있는 시군구 목록 조회
export async function getAvailableCities(province: string): Promise<string[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('audio_tracks')
      .select('city')
      .eq('category', 'trail_guide')
      .eq('province', province)
      .eq('is_active', true)
      .not('city', 'is', null)

    if (error) {
      console.error('Get available cities error:', error)
      return []
    }

    // 중복 제거
    const cities = [...new Set(data?.map((d) => d.city).filter(Boolean))] as string[]
    return cities
  } catch (error) {
    console.error('Get available cities error:', error)
    return []
  }
}
