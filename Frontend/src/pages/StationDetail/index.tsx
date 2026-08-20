import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LineBadge from '../../components/LineBadge'
import ScreenHeader from '../../components/ScreenHeader'
import { getLineDetail, getStationDetail, getStations } from '../../api/backend'
import { ApiError } from '../../api/http'
import type { StationResponse } from '../../api/types'
import { useLines } from '../../hooks/useLines'
import { useRouteDraft } from '../../hooks/useRouteDraft'
import { groupByName } from '../../utils/groupStations'
import styles from './StationDetail.module.css'

export default function StationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setFrom, setTo } = useRouteDraft()
  const { lineColor } = useLines()

  const [station, setStation] = useState<StationResponse | null | undefined>(undefined)
  const [neighbors, setNeighbors] = useState<[StationResponse?, StationResponse?]>([])
  const [otherLines, setOtherLines] = useState<StationResponse[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const stationId = Number(id)
    setStation(undefined)
    setError(null)

    getStationDetail(stationId)
      .then(async (s) => {
        setStation(s)

        const [lineDetail, allStations] = await Promise.all([getLineDetail(s.lineId), getStations()])
        const ordered = lineDetail.stations
        const idx = ordered.findIndex((x) => x.id === s.id)
        setNeighbors([ordered[idx - 1], ordered[idx + 1]])

        const group = groupByName(allStations).get(s.stationName) ?? []
        setOtherLines(group.filter((g) => g.id !== s.id))
      })
      .catch((err) => {
        setStation(null)
        setError(err instanceof ApiError ? err.message : '역 정보를 불러오지 못했습니다.')
      })
  }, [id])

  if (station === undefined) {
    return (
      <div className={styles.page}>
        <ScreenHeader title="역 정보" />
        <div className={styles.state}>불러오는 중...</div>
      </div>
    )
  }

  if (!station) {
    return (
      <div className={styles.page}>
        <ScreenHeader title="역 정보" />
        <div className={styles.state}>{error ?? '역 정보를 찾을 수 없습니다.'}</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <ScreenHeader title="역 정보" />

      <div className={styles.hero}>
        <h2 className={styles.name}>{station.stationName}</h2>
        <div className={styles.badgeRow}>
          <LineBadge name={station.lineName} color={lineColor(station.lineId)} />
          {otherLines.map((o) => (
            <LineBadge key={o.id} name={o.lineName} color={lineColor(o.lineId)} />
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionButton}
          onClick={() => {
            setFrom(station)
            navigate('/')
          }}
        >
          출발역으로 설정
        </button>
        <button
          type="button"
          className={styles.actionButton}
          onClick={() => {
            setTo(station)
            navigate('/')
          }}
        >
          도착역으로 설정
        </button>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>인접역 ({station.lineName})</p>
        <div className={styles.neighborLine}>
          <div className={styles.neighborStations}>
            {neighbors.every((n) => !n) && <span className={styles.arrow}>인접역 없음</span>}
            {neighbors[0] && (
              <button
                type="button"
                className={styles.neighborButton}
                onClick={() => navigate(`/stations/${neighbors[0]!.id}`)}
              >
                ← {neighbors[0].stationName}
              </button>
            )}
            {neighbors[1] && (
              <button
                type="button"
                className={styles.neighborButton}
                onClick={() => navigate(`/stations/${neighbors[1]!.id}`)}
              >
                {neighbors[1].stationName} →
              </button>
            )}
          </div>
        </div>
      </div>

      {otherLines.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>환승</p>
          <div className={styles.neighborStations}>
            {otherLines.map((o) => (
              <button
                key={o.id}
                type="button"
                className={styles.neighborButton}
                onClick={() => navigate(`/stations/${o.id}`)}
              >
                {o.lineName} 승강장
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
