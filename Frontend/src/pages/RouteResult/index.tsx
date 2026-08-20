import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import LineBadge from '../../components/LineBadge'
import ScreenHeader from '../../components/ScreenHeader'
import { findRoute } from '../../api/subwayApi'
import { getStation } from '../../data/subway'
import { LINES } from '../../data/stations'
import type { Route } from '../../types/subway'
import styles from './RouteResult.module.css'

export default function RouteResult() {
  const [searchParams] = useSearchParams()
  const fromId = searchParams.get('fromId') ?? ''
  const toId = searchParams.get('toId') ?? ''

  const [route, setRoute] = useState<Route | null | undefined>(undefined) // undefined = 로딩중
  const from = getStation(fromId)
  const to = getStation(toId)

  useEffect(() => {
    if (!fromId || !toId) {
      setRoute(null)
      return
    }
    setRoute(undefined)
    findRoute(fromId, toId).then(setRoute)
  }, [fromId, toId])

  const title = from && to ? `${from.name} → ${to.name}` : '경로 탐색'

  return (
    <div className={styles.page}>
      <ScreenHeader title={title} />

      {route === undefined && <div className={styles.state}>경로를 찾는 중...</div>}
      {route === null && <div className={styles.state}>경로를 찾을 수 없습니다.</div>}

      {route && (
        <>
          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{route.totalMinutes}분</span>
              <span className={styles.summaryLabel}>소요시간</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{route.totalStops}정거장</span>
              <span className={styles.summaryLabel}>환승 {route.transferCount}회</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{route.fare.toLocaleString()}원</span>
              <span className={styles.summaryLabel}>예상 요금</span>
            </div>
          </div>

          <div className={styles.timeline}>
            {route.legs.map((leg, legIndex) => (
              <div key={`${leg.line}-${legIndex}`}>
                <p className={styles.legLabel}>
                  {legIndex > 0 && '환승 · '}
                  {LINES[leg.line].name} · {leg.direction}
                </p>
                {leg.stations.map((station, i) => {
                  const isFirstOverall = legIndex === 0 && i === 0
                  const isLastOverall =
                    legIndex === route.legs.length - 1 && i === leg.stations.length - 1
                  const isLastInLeg = i === leg.stations.length - 1
                  return (
                    <div className={styles.stationRow} key={station.id + i}>
                      <div className={styles.markerCol}>
                        <div
                          className={`${styles.dot} ${isFirstOverall ? styles.start : ''} ${
                            isLastOverall ? styles.end : ''
                          }`}
                          style={!isFirstOverall && !isLastOverall ? { borderColor: LINES[leg.line].color } : undefined}
                        />
                        {!isLastInLeg && (
                          <div className={styles.track} style={{ backgroundColor: LINES[leg.line].color }} />
                        )}
                      </div>
                      <div className={styles.stationInfo}>
                        <div className={styles.stationMain}>
                          <span className={styles.stationName}>{station.name}</span>
                          {isFirstOverall && <span className={styles.stationMeta}>출발</span>}
                          {isLastOverall && <span className={styles.stationMeta}>도착</span>}
                          {!isFirstOverall && !isLastOverall && isLastInLeg && (
                            <span className={styles.stationMeta}>환승</span>
                          )}
                        </div>
                        {(isFirstOverall || isLastOverall) && <LineBadge line={leg.line} />}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
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
