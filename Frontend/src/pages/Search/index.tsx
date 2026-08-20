import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import LineBadge from '../../components/LineBadge'
import { SearchIcon } from '../../components/icons'
import ScreenHeader from '../../components/ScreenHeader'
import { getStations, searchStations } from '../../api/backend'
import { ApiError } from '../../api/http'
import type { StationResponse } from '../../api/types'
import { useLines } from '../../hooks/useLines'
import { useRecentSearches } from '../../hooks/useRecentSearches'
import { useRouteDraft } from '../../hooks/useRouteDraft'
import styles from './Search.module.css'

export default function Search() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const slot = searchParams.get('slot') // 'from' | 'to' | null

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<StationResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const { recent, addRecent } = useRecentSearches()
  const { setFrom, setTo } = useRouteDraft()
  const { lineColor } = useLines()

  useEffect(() => {
    let cancelled = false
    const trimmed = query.trim()
    const request = trimmed ? searchStations(trimmed).then((r) => r.stations) : getStations()

    request
      .then((stations) => {
        if (!cancelled) {
          setResults(stations)
          setError(null)
        }
      })
      .catch((err) => {
        if (cancelled) return
        setResults([])
        setError(err instanceof ApiError ? err.message : '검색 중 오류가 발생했습니다.')
      })

    return () => {
      cancelled = true
    }
  }, [query])

  const handleSelect = (station: StationResponse) => {
    addRecent(station)
    if (slot === 'from') {
      setFrom(station)
      navigate('/')
    } else if (slot === 'to') {
      setTo(station)
      navigate('/')
    } else {
      navigate(`/stations/${station.id}`)
    }
  }

  const title = slot === 'from' ? '출발역 검색' : slot === 'to' ? '도착역 검색' : '역 검색'

  return (
    <div className={styles.page}>
      <ScreenHeader title={title} />

      <div className={styles.searchBar}>
        <SearchIcon width={18} height={18} />
        <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="역명 검색" />
        {query && (
          <button type="button" className={styles.clearButton} onClick={() => setQuery('')}>
            취소
          </button>
        )}
      </div>

      {!query && recent.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>최근 검색</p>
          <div className={styles.chipRow}>
            {recent.map((s) => (
              <button key={s.id} type="button" className={styles.chip} onClick={() => handleSelect(s)}>
                {s.stationName}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <p className={styles.sectionTitle}>{query ? '검색 결과' : '전체 역'}</p>
        {error && <p className={styles.empty}>{error}</p>}
        {!error && results.length === 0 && <p className={styles.empty}>검색 결과가 없습니다.</p>}
        {!error && results.length > 0 && (
          <div className={styles.resultList}>
            {results.map((s) => (
              <button key={s.id} type="button" className={styles.resultItem} onClick={() => handleSelect(s)}>
                <span className={styles.resultName}>{s.stationName}</span>
                <LineBadge name={s.lineName} color={lineColor(s.lineId)} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
