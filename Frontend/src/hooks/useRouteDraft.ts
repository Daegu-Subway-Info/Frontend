import { useCallback, useState } from 'react'
import { readJSON, writeJSON } from '../utils/storage'

const KEY = 'daegu-subway:route-draft'

interface Draft {
  fromId?: string
  toId?: string
}

/** 홈 화면의 출발/도착 선택을 역 검색 화면과 공유하기 위한 draft 상태. */
export function useRouteDraft() {
  const [draft, setDraft] = useState<Draft>(() => readJSON(KEY, {}))

  const update = useCallback((next: Draft) => {
    setDraft(next)
    writeJSON(KEY, next)
  }, [])

  const setFrom = useCallback((fromId: string) => update({ ...readJSON(KEY, {}), fromId }), [update])
  const setTo = useCallback((toId: string) => update({ ...readJSON(KEY, {}), toId }), [update])
  const swap = useCallback(
    () => update({ fromId: draft.toId, toId: draft.fromId }),
    [draft, update],
  )
  const clear = useCallback(() => update({}), [update])

  return { draft, setFrom, setTo, swap, clear }
}
