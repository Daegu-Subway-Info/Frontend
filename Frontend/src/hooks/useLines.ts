import { useEffect, useState } from 'react'
import { getLines } from '../api/backend'
import type { LineResponse } from '../api/types'

// 세션 내 재요청을 피하기 위한 모듈 레벨 캐시. GET /api/lines는 자주 안 바뀐다.
let cache: Promise<LineResponse[]> | null = null

function loadLines(): Promise<LineResponse[]> {
  if (!cache) cache = getLines().catch((err) => { cache = null; throw err })
  return cache
}

/** lineId → 노선 정보(이름/색상) 조회용. LineBadge 등에서 색을 칠할 때 쓴다. */
export function useLines() {
  const [lines, setLines] = useState<LineResponse[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    loadLines()
      .then((data) => !cancelled && setLines(data))
      .catch((err) => !cancelled && setError(err))
    return () => {
      cancelled = true
    }
  }, [])

  const lineColor = (lineId: number): string => lines.find((l) => l.id === lineId)?.lineColor ?? '#6B7280'

  return { lines, error, lineColor }
}
