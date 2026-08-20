import { useNavigate, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import LineBadge from '../../components/LineBadge'
import ScreenHeader from '../../components/ScreenHeader'
import { useLineDetailQuery, useLinesQuery, useStationDetailQuery, useStationsQuery } from '../../api/queries'
import { ApiError } from '../../api/http'
import { useRouteDraftStore } from '../../store/routeDraftStore'
import { groupByName } from '../../utils/groupStations'

export default function StationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setFrom, setTo } = useRouteDraftStore()
  const stationId = id ? Number(id) : undefined

  const { data: lines = [] } = useLinesQuery()
  const lineColor = (lineId: number) => lines.find((l) => l.id === lineId)?.lineColor ?? '#6B7280'

  const { data: station, isLoading, error } = useStationDetailQuery(stationId)
  const { data: lineDetail } = useLineDetailQuery(station?.lineId)
  const { data: allStations = [] } = useStationsQuery()

  if (isLoading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader title="역 정보" />
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={24} />
        </Box>
      </Box>
    )
  }

  if (error || !station) {
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader title="역 정보" />
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            {error instanceof ApiError ? error.message : '역 정보를 찾을 수 없습니다.'}
          </Typography>
        </Box>
      </Box>
    )
  }

  const ordered = lineDetail?.stations ?? []
  const idx = ordered.findIndex((x) => x.id === station.id)
  const prev = idx > 0 ? ordered[idx - 1] : undefined
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : undefined
  const otherLines = (groupByName(allStations).get(station.stationName) ?? []).filter((g) => g.id !== station.id)

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="역 정보" />

      <Box sx={{ px: 2, py: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h1">{station.stationName}</Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <LineBadge name={station.lineName} color={lineColor(station.lineId)} />
          {otherLines.map((o) => (
            <LineBadge key={o.id} name={o.lineName} color={lineColor(o.lineId)} />
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            setFrom(station)
            navigate('/')
          }}
        >
          출발역으로 설정
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            setTo(station)
            navigate('/')
          }}
        >
          도착역으로 설정
        </Button>
      </Box>

      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          인접역 ({station.lineName})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {!prev && !next && (
            <Typography variant="body2" color="text.disabled">
              인접역 없음
            </Typography>
          )}
          {prev && (
            <Chip label={`← ${prev.stationName}`} onClick={() => navigate(`/stations/${prev.id}`)} />
          )}
          {next && (
            <Chip label={`${next.stationName} →`} onClick={() => navigate(`/stations/${next.id}`)} />
          )}
        </Box>
      </Box>

      {otherLines.length > 0 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            환승
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {otherLines.map((o) => (
              <Chip key={o.id} label={`${o.lineName} 승강장`} onClick={() => navigate(`/stations/${o.id}`)} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}
