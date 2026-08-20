import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StationResponse } from '../api/types'

const MAX = 5

interface RecentRoute {
  from: StationResponse
  to: StationResponse
  at: number
}

interface RecentRoutesState {
  recent: RecentRoute[]
  addRecent: (from: StationResponse, to: StationResponse) => void
}

export const useRecentRoutesStore = create<RecentRoutesState>()(
  persist(
    (set, get) => ({
      recent: [],
      addRecent: (from, to) => {
        const next = [
          { from, to, at: Date.now() },
          ...get().recent.filter((r) => !(r.from.id === from.id && r.to.id === to.id)),
        ].slice(0, MAX)
        set({ recent: next })
      },
    }),
    { name: 'daegu-subway:recent-routes' },
  ),
)
