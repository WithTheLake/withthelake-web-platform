import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isAuthChecked: boolean
  checkAuth: () => Promise<void>
  setUser: (user: User | null) => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  isAuthChecked: false,

  checkAuth: async () => {
    // 이미 체크했으면 스킵 (성능 최적화)
    if (get().isAuthChecked) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    set({ user, isLoggedIn: !!user, isAuthChecked: true })
  },

  setUser: (user) => {
    set({ user, isLoggedIn: !!user, isAuthChecked: true })
  },

  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null, isLoggedIn: false })
  },
}))
