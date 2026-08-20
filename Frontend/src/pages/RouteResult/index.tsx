import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import LineBadge from '../../components/LineBadge'
import ScreenHeader from '../../components/ScreenHeader'
import { findRoute } from '../../api/backend'
import { ApiError } from '../../api/http'
import type { RouteResponse, StationResponse } from '../../api/types'
import { useLines } from '../../hooks/useLines'
import styles from './RouteResult.module.css'

interface LocationState {
  from?: StationResponse
  to?: StationResponse
}

export default function RouteResult() {
  const location = useLocation()
  const { from, to } = (location.state as LocationState) ?? {}
  const { lineColor } = useLines()

  const [route, setRoute] = useState<RouteResponse | null | undefined>(undefined) // undefined = 로딩중
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!from || !to) return
    setRoute(undefined)
    setError(null)
    findRoute(from.id, to.id)
      .then(setRoute)
      .catch((err) => {
        setRoute(null)
        setError(err instanceof ApiError ? err.message : '경로를 찾을 수 없습니다.')
      })
  }, [from, to])

  const title = from && to ? `${from.stationName} → ${to.stationName}` : '경로 탐색'

  if (!from || !to) {
    return (
      <div className={styles.page}>
        <ScreenHeader title={title} />
        <div className={styles.state}>홈 화면에서 출발역/도착역을 먼저 선택해주세요.</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <ScreenHeader title={title} />

      {route === undefined && <div className={styles.state}>경로를 찾는 중...</div>}
      {route === null && <div className={styles.state}>{error}</div>}

      {route && (
        <>
          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{Math.round(route.totalDurationSeconds / 60)}분</span>
              <span className={styles.summaryLabel}>소요시간</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{route.totalDistanceKm.toFixed(1)}km</span>
              <span className={styles.summaryLabel}>환승 {route.transferCount}회</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{route.fare.toLocaleString()}원</span>
              <span className={styles.summaryLabel}>예상 요금</span>
            </div>
          </div>

          <div className={styles.timeline}>
            {route.path.map((station, i) => {
              const isFirst = i === 0
              const isLast = i === route.path.length - 1
              const prevLineId = i > 0 ? route.path[i - 1].lineId : station.lineId
              const isTransferPoint = !isFirst && prevLineId !== station.lineId
              const color = lineColor(station.lineId)
              return (
                <div className={styles.stationRow} key={`${station.id}-${i}`}>
                  <div className={styles.markerCol}>
                    <div
                      className={`${styles.dot} ${isFirst ? styles.start : ''} ${isLast ? styles.end : ''}`}
                      style={!isFirst && !isLast ? { borderColor: color } : undefined}
                    />
                    {!isLast && <div className={styles.track} style={{ backgroundColor: color }} />}
                  </div>
                  <div className={styles.stationInfo}>
                    <div className={styles.stationMain}>
                      <span className={styles.stationName}>{station.stationName}</span>
                      {isFirst && <span className={styles.stationMeta}>출발</span>}
                      {isLast && <span className={styles.stationMeta}>도착</span>}
                      {isTransferPoint && <span className={styles.stationMeta}>환승</span>}
                    </div>
                    {(isFirst || isLast || isTransferPoint) && (
                      <LineBadge name={station.lineName} color={color} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.startAlarm} disabled>
              알림 시작 (준비 중)
            </button>
          </div>
        </>
      )}
    </div>
  )
}
