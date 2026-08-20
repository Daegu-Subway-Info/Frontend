import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StationResponse } from '../api/types'

const MAX = 6

interface RecentSearchesState {
  recent: StationResponse[]
  addRecent: (station: StationResponse) => void
}

export const useRecentSearchesStore = create<RecentSearchesState>()(
  persist(
    (set, get) => ({
      recent: [],
      addRecent: (station) => {
        const next = [station, ...get().recent.filter((s) => s.id !== station.id)].slice(0, MAX)
        set({ recent: next })
      },
    }),
    { name: 'daegu-subway:recent-searches' },
  ),
)
