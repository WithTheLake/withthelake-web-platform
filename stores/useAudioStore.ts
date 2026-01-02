import { create } from 'zustand'
import type { AudioItem, PlaybackState } from '@/types/audio'

interface AudioState {
  // 현재 재생 중인 오디오
  currentAudio: AudioItem | null

  // 재생 상태
  playbackState: PlaybackState

  // 로딩 상태
  isLoading: boolean

  // 현재 재생 시간 (초)
  currentTime: number

  // 전체 재생 시간 (초)
  duration: number

  // Actions
  setCurrentAudio: (audio: AudioItem | null) => void
  setLoading: (loading: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setPlaybackState: (state: PlaybackState) => void
}

export const useAudioStore = create<AudioState>((set) => ({
  // Initial state
  currentAudio: null,
  playbackState: 'stopped',
  isLoading: false,
  currentTime: 0,
  duration: 0,

  // Actions
  setCurrentAudio: (audio) => {
    set({
      currentAudio: audio,
      currentTime: 0,
      duration: 0,
      playbackState: 'stopped',
      isLoading: audio ? true : false
    })
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  setPlaybackState: (state) => set({ playbackState: state }),
}))
