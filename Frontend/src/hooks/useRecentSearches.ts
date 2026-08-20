import { useCallback, useState } from 'react'
import { readJSON, writeJSON } from '../utils/storage'

const KEY = 'daegu-subway:recent-searches'
const MAX = 6

export function useRecentSearches() {
  const [recentIds, setRecentIds] = useState<string[]>(() => readJSON(KEY, []))

  const addRecent = useCallback((stationId: string) => {
    setRecentIds((prev) => {
      const next = [stationId, ...prev.filter((id) => id !== stationId)].slice(0, MAX)
      writeJSON(KEY, next)
      return next
    })
  }, [])

  return { recentIds, addRecent }
}
