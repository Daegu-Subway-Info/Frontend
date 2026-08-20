import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import CircularProgress from '@mui/material/CircularProgress'
import LineBadge from '../../components/LineBadge'
import ScreenHeader from '../../components/ScreenHeader'
import { useLineDetailQuery, useLinesQuery, useStationsQuery } from '../../api/queries'
import { ApiError } from '../../api/http'
import { groupByName } from '../../utils/groupStations'

type TabValue = 'all' | number

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
  const [tab, setTab] = useState<TabValue>('all')

  const { data: lines = [], isLoading, error } = useLinesQuery()
  const { data: allStations = [] } = useStationsQuery()
  const transferGroups = groupByName(allStations)

  const visibleLines = tab === 'all' ? lines : lines.filter((l) => l.id === tab)

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="대구 지하철 노선도" onBack={() => navigate('/')} />

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 44 }}
      >
        <Tab label="전체" value="all" sx={{ minHeight: 44 }} />
        {lines.map((l) => (
          <Tab key={l.id} label={l.lineName} value={l.id} sx={{ minHeight: 44 }} />
        ))}
      </Tabs>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {error && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", p: 2 }}>
          {error instanceof ApiError ? error.message : '노선 정보를 불러오지 못했습니다.'}
        </Typography>
      )}

      <Box sx={{ flex: 1, display: 'flex', gap: 3, p: 2, overflowX: 'auto' }}>
        {visibleLines.map((line) => (
          <LineColumn
            key={line.id}
            lineId={line.id}
            lineName={line.lineName}
            lineColor={line.lineColor}
            transferGroups={transferGroups}
            lineColorOf={(id) => lines.find((l) => l.id === id)?.lineColor ?? '#6B7280'}
            onSelect={(id) => navigate(`/stations/${id}`)}
          />
        ))}
      </Box>
    </Box>
  )
}

function LineColumn({
  lineId,
  lineName,
  lineColor,
  transferGroups,
  lineColorOf,
  onSelect,
}: {
  lineId: number
  lineName: string
  lineColor: string
  transferGroups: ReturnType<typeof groupByName>
  lineColorOf: (lineId: number) => string
  onSelect: (stationId: number) => void
}) {
  const { data: detail } = useLineDetailQuery(lineId)
  const stations = detail?.stations ?? []

  return (
    <Box sx={{ minWidth: 160, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h2" sx={{ color: lineColor, mb: 1.5 }}>
        {lineName}
      </Typography>
      {stations.map((station, i) => {
        const group = transferGroups.get(station.stationName) ?? []
        const otherLines = group.filter((g) => g.id !== station.id)
        const isTransfer = otherLines.length > 0
        return (
          <Box
            key={station.id}
            component="button"
            onClick={() => onSelect(station.id)}
            sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, border: 'none', background: 'none', p: 0, cursor: 'pointer', textAlign: 'left' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 16 }}>
              <Box
                sx={{
                  width: isTransfer ? 14 : 10,
                  height: isTransfer ? 14 : 10,
                  borderRadius: '50%',
                  border: isTransfer ? '3px solid' : '2.5px solid',
                  borderColor: lineColor,
                  bgcolor: 'background.paper',
                  flexShrink: 0,
                }}
              />
              {i < stations.length - 1 && <Box sx={{ width: 3, height: 22, bgcolor: lineColor }} />}
            </Box>
            <Box sx={{ py: 0.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              <Typography variant="body2" sx={{ fontWeight: isTransfer ? 700 : 400 }}>
                {station.stationName}
              </Typography>
              {isTransfer && (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {otherLines.map((o) => (
                    <LineBadge key={o.id} name={o.lineName} color={lineColorOf(o.lineId)} />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
