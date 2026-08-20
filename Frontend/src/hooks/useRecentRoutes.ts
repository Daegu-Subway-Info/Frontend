import { useCallback, useState } from 'react'
import type { StationResponse } from '../api/types'
import { readJSON, writeJSON } from '../utils/storage'

const KEY = 'daegu-subway:recent-routes'
const MAX = 5

interface RecentRoute {
  from: StationResponse
  to: StationResponse
  at: number
}

export function useRecentRoutes() {
  const [recent, setRecent] = useState<RecentRoute[]>(() => readJSON(KEY, []))

  const addRecent = useCallback((from: StationResponse, to: StationResponse) => {
    setRecent((prev) => {
      const next = [
        { from, to, at: Date.now() },
        ...prev.filter((r) => !(r.from.id === from.id && r.to.id === to.id)),
      ].slice(0, MAX)
      writeJSON(KEY, next)
      return next
    })
  }, [])

  return { recent, addRecent }
}
