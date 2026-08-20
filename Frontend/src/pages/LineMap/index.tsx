import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenHeader from '../../components/ScreenHeader'
import { LINES } from '../../data/stations'
import { STATIONS_BY_LINE } from '../../data/subway'
import type { LineId } from '../../types/subway'
import styles from './LineMap.module.css'

type Tab = 'all' | LineId

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: '1', label: '1호선' },
  { id: '2', label: '2호선' },
  { id: '3', label: '3호선' },
]

/**
 * 실제 지리 좌표 기반 SVG 노선도가 아니라, 역 순서를 세로 목록으로 보여주는
 * 스키매틱(schematic) 노선도다. 틀 단계에서는 탐색 기능(역 탭 → 상세 이동)이
 * 중요해서 이 형태로 먼저 두고, 좌표 데이터가 확보되면 실제 지도로 교체한다.
 */
export default function LineMap() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('all')
  const lines: LineId[] = tab === 'all' ? ['1', '2', '3'] : [tab]

  return (
    <div className={styles.page}>
      <ScreenHeader title="대구 지하철 노선도" onBack={() => navigate('/')} />

      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.tab} ${tab === t.id ? styles.active : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        {lines.map((lineId) => {
          const line = LINES[lineId]
          const stations = STATIONS_BY_LINE[lineId]
          return (
            <div className={styles.lineColumn} key={lineId}>
              <div className={styles.lineHeader}>
                <span className={styles.lineName} style={{ color: line.color }}>
                  {line.name}
                </span>
              </div>
              {stations.map((station, i) => (
                <button
                  key={station.id}
                  type="button"
                  className={styles.stationButton}
                  onClick={() => navigate(`/stations/${encodeURIComponent(station.id)}`)}
                >
                  <div className={styles.markerCol}>
                    <div
                      className={`${styles.dot} ${station.isTransfer ? styles.transfer : ''}`}
                      style={{ borderColor: line.color }}
                    />
                    {i < stations.length - 1 && (
                      <div className={styles.track} style={{ backgroundColor: line.color }} />
                    )}
                  </div>
                  <span className={`${styles.stationLabel} ${station.isTransfer ? styles.transfer : ''}`}>
                    {station.name}
                  </span>
                </button>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
