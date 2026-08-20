import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StationResponse } from '../api/types'

interface RouteDraftState {
  from?: StationResponse
  to?: StationResponse
  setFrom: (station: StationResponse) => void
  setTo: (station: StationResponse) => void
  swap: () => void
}

/** 홈 화면의 출발/도착 선택을 역 검색 화면과 공유하기 위한 전역 상태. */
export const useRouteDraftStore = create<RouteDraftState>()(
  persist(
    (set, get) => ({
      from: undefined,
      to: undefined,
      setFrom: (station) => set({ from: station }),
      setTo: (station) => set({ to: station }),
      swap: () => set({ from: get().to, to: get().from }),
    }),
    { name: 'daegu-subway:route-draft' },
  ),
)
