import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
  firstName: string
  lastName:  string
  email:     string
  address:   string
  telephone: string
}

interface AuthState {
  user: User | null
  setUser: (u: User) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (u) => set({ user: u }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'auth',             
      storage: createJSONStorage(() => localStorage),

    }
  )
)
