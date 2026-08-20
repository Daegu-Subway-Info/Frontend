import { useCallback, useState } from 'react'
import type { RecentRoute } from '../types/subway'
import { readJSON, writeJSON } from '../utils/storage'

const KEY = 'daegu-subway:recent-routes'
const MAX = 5

export function useRecentRoutes() {
  const [recent, setRecent] = useState<RecentRoute[]>(() => readJSON(KEY, []))

  const addRecent = useCallback((fromId: string, toId: string) => {
    setRecent((prev) => {
      const next = [
        { fromId, toId, at: Date.now() },
        ...prev.filter((r) => !(r.fromId === fromId && r.toId === toId)),
      ].slice(0, MAX)
      writeJSON(KEY, next)
      return next
    })
  }, [])

  return { recent, addRecent }
}
