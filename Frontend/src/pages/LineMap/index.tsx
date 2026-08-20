import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LineBadge from '../../components/LineBadge'
import ScreenHeader from '../../components/ScreenHeader'
import { getLineDetail, getLines, getStations } from '../../api/backend'
import { ApiError } from '../../api/http'
import type { LineDetailResponse, LineResponse, StationResponse } from '../../api/types'
import { groupByName } from '../../utils/groupStations'
import styles from './LineMap.module.css'

type Tab = 'all' | number

/**
 * 실제 지리 좌표 기반 SVG 노선도가 아니라, GET /api/lines/{id}가 주는
 * sequenceNo 순서를 세로 목록으로 보여주는 스키매틱(schematic) 노선도다.
 * 위경도(latitude/longitude)가 채워지면 실제 지도로 교체한다.
 *
 * 환승역은 노선마다 별도 row라 줄 사이를 잇는 좌표 연결선을 그리지 않는다 —
 * 대신 GET /api/stations 전체 목록을 역명으로 묶어(client-side) 갈아탈 수 있는
 * 다른 노선 배지를 이름 옆에 붙인다.
 */
export default function LineMap() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('all')

  const [lines, setLines] = useState<LineResponse[]>([])
  const [details, setDetails] = useState<Record<number, LineDetailResponse>>({})
  const [transferGroups, setTransferGroups] = useState<Map<string, StationResponse[]>>(new Map())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getLines()
      .then(async (ls) => {
        setLines(ls)
        const detailList = await Promise.all(ls.map((l) => getLineDetail(l.id)))
        setDetails(Object.fromEntries(detailList.map((d) => [d.id, d])))
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : '노선 정보를 불러오지 못했습니다.'))

    getStations()
      .then((stations) => setTransferGroups(groupByName(stations)))
      .catch(() => {
        /* 환승 배지는 부가 정보라 실패해도 노선도 자체는 보여준다 */
      })
  }, [])

  const visibleLines = tab === 'all' ? lines : lines.filter((l) => l.id === tab)

  return (
    <div className={styles.page}>
      <ScreenHeader title="대구 지하철 노선도" onBack={() => navigate('/')} />

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'all' ? styles.active : ''}`}
          onClick={() => setTab('all')}
        >
          전체
        </button>
        {lines.map((l) => (
          <button
            key={l.id}
            type="button"
            className={`${styles.tab} ${tab === l.id ? styles.active : ''}`}
            onClick={() => setTab(l.id)}
          >
            {l.lineName}
          </button>
        ))}
      </div>

      {error && <div className={styles.state}>{error}</div>}

      <div className={styles.body}>
        {visibleLines.map((line) => {
          const stations = details[line.id]?.stations ?? []
          return (
            <div className={styles.lineColumn} key={line.id}>
              <div className={styles.lineHeader}>
                <span className={styles.lineName} style={{ color: line.lineColor }}>
                  {line.lineName}
                </span>
              </div>
              {stations.map((station, i) => {
                const group = transferGroups.get(station.stationName) ?? []
                const otherLines = group.filter((g) => g.id !== station.id)
                const isTransfer = otherLines.length > 0
                return (
                  <button
                    key={station.id}
                    type="button"
                    className={styles.stationButton}
                    onClick={() => navigate(`/stations/${station.id}`)}
                  >
                    <div className={styles.markerCol}>
                      <div
                        className={`${styles.dot} ${isTransfer ? styles.transfer : ''}`}
                        style={{ borderColor: line.lineColor }}
                      />
                      {i < stations.length - 1 && (
                        <div className={styles.track} style={{ backgroundColor: line.lineColor }} />
                      )}
                    </div>
                    <span className={styles.stationTextCol}>
                      <span className={`${styles.stationLabel} ${isTransfer ? styles.transfer : ''}`}>
                        {station.stationName}
                      </span>
                      {isTransfer && (
                        <span className={styles.transferBadges}>
                          {otherLines.map((o) => (
                            <LineBadge
                              key={o.id}
                              name={o.lineName}
                              color={lines.find((l) => l.id === o.lineId)?.lineColor ?? '#6B7280'}
                            />
                          ))}
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
