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

  // 오디오 엘리먼트 참조 (클라이언트에서만 사용)
  audioElement: HTMLAudioElement | null

  // Actions
  setAudioElement: (element: HTMLAudioElement | null) => void
  setCurrentAudio: (audio: AudioItem) => void
  setLoading: (loading: boolean) => void
  play: () => void
  pause: () => void
  stop: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setPlaybackState: (state: PlaybackState) => void
}

export const useAudioStore = create<AudioState>((set, get) => ({
  // Initial state
  currentAudio: null,
  playbackState: 'stopped',
  isLoading: false,
  currentTime: 0,
  duration: 0,
  audioElement: null,

  // Actions
  setAudioElement: (element) => set({ audioElement: element }),

  setCurrentAudio: (audio) => {
    const { audioElement, playbackState } = get()

    // 이전 오디오가 재생 중이었다면 정지
    if (audioElement && playbackState === 'playing') {
      audioElement.pause()
    }

    set({
      currentAudio: audio,
      currentTime: 0,
      playbackState: 'stopped',
      isLoading: true
    })
  },

  setLoading: (loading) => set({ isLoading: loading }),

  play: () => {
    const { audioElement } = get()
    if (audioElement) {
      audioElement.play()
      set({ playbackState: 'playing' })
    }
  },

  pause: () => {
    const { audioElement } = get()
    if (audioElement) {
      audioElement.pause()
      set({ playbackState: 'paused' })
    }
  },

  stop: () => {
    const { audioElement } = get()
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
      set({ playbackState: 'stopped', currentTime: 0 })
    }
  },

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  setPlaybackState: (state) => set({ playbackState: state }),
}))
