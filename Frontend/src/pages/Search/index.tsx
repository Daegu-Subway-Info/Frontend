import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import LineBadge from '../../components/LineBadge'
import { SearchIcon } from '../../components/icons'
import ScreenHeader from '../../components/ScreenHeader'
import { searchStations } from '../../api/subwayApi'
import { getStation } from '../../data/subway'
import { useRecentSearches } from '../../hooks/useRecentSearches'
import { useRouteDraft } from '../../hooks/useRouteDraft'
import type { Station } from '../../types/subway'
import styles from './Search.module.css'

export default function Search() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const slot = searchParams.get('slot') // 'from' | 'to' | null

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Station[]>([])
  const { recentIds, addRecent } = useRecentSearches()
  const { setFrom, setTo } = useRouteDraft()

  useEffect(() => {
    let cancelled = false
    searchStations(query).then((stations) => {
      if (!cancelled) setResults(stations)
    })
    return () => {
      cancelled = true
    }
  }, [query])

  const handleSelect = (station: Station) => {
    addRecent(station.id)
    if (slot === 'from') {
      setFrom(station.id)
      navigate('/')
    } else if (slot === 'to') {
      setTo(station.id)
      navigate('/')
    } else {
      navigate(`/stations/${encodeURIComponent(station.id)}`)
    }
  }

  const title = slot === 'from' ? '출발역 검색' : slot === 'to' ? '도착역 검색' : '역 검색'
  const recentStations = recentIds.map((id) => getStation(id)).filter((s): s is Station => Boolean(s))

  return (
    <div className={styles.page}>
      <ScreenHeader title={title} />

      <div className={styles.searchBar}>
        <SearchIcon width={18} height={18} />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="역명 검색 (초성 검색 가능)"
        />
        {query && (
          <button type="button" className={styles.clearButton} onClick={() => setQuery('')}>
            취소
          </button>
        )}
      </div>

      {!query && recentStations.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>최근 검색</p>
          <div className={styles.chipRow}>
            {recentStations.map((s) => (
              <button key={s.id} type="button" className={styles.chip} onClick={() => handleSelect(s)}>
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <p className={styles.sectionTitle}>{query ? '검색 결과' : '전체 역'}</p>
        {results.length === 0 ? (
          <p className={styles.empty}>검색 결과가 없습니다.</p>
        ) : (
          <div className={styles.resultList}>
            {results.map((s) => (
              <button key={s.id} type="button" className={styles.resultItem} onClick={() => handleSelect(s)}>
                <span className={styles.resultName}>{s.name}</span>
                <span className={styles.resultBadges}>
                  {s.lines.map((line) => (
                    <LineBadge key={line} line={line} />
                  ))}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
