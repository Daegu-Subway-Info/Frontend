import { useNavigate, useParams } from 'react-router-dom'
import LineBadge from '../../components/LineBadge'
import ScreenHeader from '../../components/ScreenHeader'
import { getStation, neighborsOnLine } from '../../data/subway'
import { useRouteDraft } from '../../hooks/useRouteDraft'
import styles from './StationDetail.module.css'

export default function StationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setFrom, setTo } = useRouteDraft()
  const station = id ? getStation(id) : undefined

  if (!station) {
    return (
      <div className={styles.page}>
        <ScreenHeader title="역 정보" />
        <div className={styles.state}>역 정보를 찾을 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <ScreenHeader title="역 정보" />

      <div className={styles.hero}>
        <h2 className={styles.name}>{station.name}</h2>
        {station.alias && <p className={styles.alias}>{station.alias}</p>}
        <div className={styles.badgeRow}>
          {station.lines.map((line) => (
            <LineBadge key={line} line={line} />
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionButton}
          onClick={() => {
            setFrom(station.id)
            navigate('/')
          }}
        >
          출발역으로 설정
        </button>
        <button
          type="button"
          className={styles.actionButton}
          onClick={() => {
            setTo(station.id)
            navigate('/')
          }}
        >
          도착역으로 설정
        </button>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>인접역</p>
        {station.lines.map((line) => {
          const neighbors = neighborsOnLine(line, station)
          return (
            <div className={styles.neighborLine} key={line}>
              <LineBadge line={line} />
              <div className={styles.neighborStations}>
                {neighbors.length === 0 && <span className={styles.arrow}>인접역 없음</span>}
                {neighbors.map((n, i) => (
                  <span key={n.id} className={styles.neighborStations}>
                    {i > 0 && <span className={styles.arrow}>·</span>}
                    <button
                      type="button"
                      className={styles.neighborButton}
                      onClick={() => navigate(`/stations/${encodeURIComponent(n.id)}`)}
                    >
                      {n.name}
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
