import { useNavigate } from 'react-router-dom'
import LineBadge from '../../components/LineBadge'
import { SwapIcon } from '../../components/icons'
import { getStation } from '../../data/subway'
import { useRecentRoutes } from '../../hooks/useRecentRoutes'
import { useRouteDraft } from '../../hooks/useRouteDraft'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()
  const { draft, swap } = useRouteDraft()
  const { recent, addRecent } = useRecentRoutes()

  const fromStation = draft.fromId ? getStation(draft.fromId) : undefined
  const toStation = draft.toId ? getStation(draft.toId) : undefined
  const canSearch = Boolean(fromStation && toStation && fromStation.id !== toStation.id)

  const handleSubmit = () => {
    if (!fromStation || !toStation) return
    addRecent(fromStation.id, toStation.id)
    navigate(`/route-result?fromId=${encodeURIComponent(fromStation.id)}&toId=${encodeURIComponent(toStation.id)}`)
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <span className={styles.brand}>대구 지하철</span>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.slotRow}>
            <div className={styles.slots}>
              <button type="button" className={styles.slot} onClick={() => navigate('/search?slot=from')}>
                <span className={styles.slotLabel}>출발역</span>
                <span className={`${styles.slotValue} ${fromStation ? '' : styles.placeholder}`}>
                  {fromStation?.name ?? '출발역을 선택하세요'}
                </span>
              </button>
              <div className={styles.divider} />
              <button type="button" className={styles.slot} onClick={() => navigate('/search?slot=to')}>
                <span className={styles.slotLabel}>도착역</span>
                <span className={`${styles.slotValue} ${toStation ? '' : styles.placeholder}`}>
                  {toStation?.name ?? '도착역을 선택하세요'}
                </span>
              </button>
            </div>
            <button type="button" className={styles.swapButton} aria-label="출발/도착 바꾸기" onClick={swap}>
              <SwapIcon width={18} height={18} />
            </button>
          </div>

          <button type="button" className={styles.submit} disabled={!canSearch} onClick={handleSubmit}>
            길찾기
          </button>
        </div>

        <div>
          <h2 className={styles.sectionTitle}>최근 경로</h2>
          {recent.length === 0 ? (
            <p className={styles.empty}>최근 검색한 경로가 없습니다.</p>
          ) : (
            <div className={styles.recentList}>
              {recent.map((r) => {
                const from = getStation(r.fromId)
                const to = getStation(r.toId)
                if (!from || !to) return null
                return (
                  <button
                    key={`${r.fromId}-${r.toId}-${r.at}`}
                    type="button"
                    className={styles.recentItem}
                    onClick={() =>
                      navigate(
                        `/route-result?fromId=${encodeURIComponent(from.id)}&toId=${encodeURIComponent(to.id)}`,
                      )
                    }
                  >
                    <span>
                      {from.name} → {to.name}
                    </span>
                    <LineBadge line={to.lines[0]} />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
