import { useCallback, useState } from 'react'
import type { StationResponse } from '../api/types'
import { readJSON, writeJSON } from '../utils/storage'

const KEY = 'daegu-subway:recent-searches'
const MAX = 6

export function useRecentSearches() {
  const [recent, setRecent] = useState<StationResponse[]>(() => readJSON(KEY, []))

  const addRecent = useCallback((station: StationResponse) => {
    setRecent((prev) => {
      const next = [station, ...prev.filter((s) => s.id !== station.id)].slice(0, MAX)
      writeJSON(KEY, next)
      return next
    })
  }, [])

  return { recent, addRecent }
}
