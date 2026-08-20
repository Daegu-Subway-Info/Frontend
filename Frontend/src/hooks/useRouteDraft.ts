import { useCallback, useState } from 'react'
import type { StationResponse } from '../api/types'
import { readJSON, writeJSON } from '../utils/storage'

const KEY = 'daegu-subway:route-draft'

interface Draft {
  from?: StationResponse
  to?: StationResponse
}

/** 홈 화면의 출발/도착 선택을 역 검색 화면과 공유하기 위한 draft 상태. */
export function useRouteDraft() {
  const [draft, setDraft] = useState<Draft>(() => readJSON(KEY, {}))

  const update = useCallback((next: Draft) => {
    setDraft(next)
    writeJSON(KEY, next)
  }, [])

  const setFrom = useCallback(
    (station: StationResponse) => update({ ...readJSON(KEY, {}), from: station }),
    [update],
  )
  const setTo = useCallback(
    (station: StationResponse) => update({ ...readJSON(KEY, {}), to: station }),
    [update],
  )
  const swap = useCallback(() => update({ from: draft.to, to: draft.from }), [draft, update])

  return { draft, setFrom, setTo, swap }
}
