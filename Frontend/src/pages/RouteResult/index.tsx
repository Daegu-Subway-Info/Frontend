import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import LineBadge from '../../components/LineBadge'
import ScreenHeader from '../../components/ScreenHeader'
import { useLinesQuery, useRouteQuery } from '../../api/queries'
import { ApiError } from '../../api/http'
import type { StationResponse } from '../../api/types'

interface LocationState {
  from?: StationResponse
  to?: StationResponse
}

export default function RouteResult() {
  const location = useLocation()
  const { from, to } = (location.state as LocationState) ?? {}
  const { data: lines = [] } = useLinesQuery()
  const lineColor = (lineId: number) => lines.find((l) => l.id === lineId)?.lineColor ?? '#6B7280'

  const { data: route, isLoading, error } = useRouteQuery(from?.id, to?.id)

  const title = from && to ? `${from.stationName} → ${to.stationName}` : '경로 탐색'

  if (!from || !to) {
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader title={title} />
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            홈 화면에서 출발역/도착역을 먼저 선택해주세요.
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={title} />

      {isLoading && (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            {error instanceof ApiError ? error.message : '경로를 찾을 수 없습니다.'}
          </Typography>
        </Box>
      )}

      {route && (
        <>
          <Box sx={{ display: 'flex', gap: 3, p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box>
              <Typography variant="h2">{Math.round(route.totalDurationSeconds / 60)}분</Typography>
              <Typography variant="caption" color="text.secondary">
                소요시간
              </Typography>
            </Box>
            <Box>
              <Typography variant="h2">{route.totalDistanceKm.toFixed(1)}km</Typography>
              <Typography variant="caption" color="text.secondary">
                환승 {route.transferCount}회
              </Typography>
            </Box>
            <Box>
              <Typography variant="h2">{route.fare.toLocaleString()}원</Typography>
              <Typography variant="caption" color="text.secondary">
                예상 요금
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1, p: 2 }}>
            {route.path.map((station, i) => {
              const isFirst = i === 0
              const isLast = i === route.path.length - 1
              const prevLineId = i > 0 ? route.path[i - 1].lineId : station.lineId
              const isTransferPoint = !isFirst && prevLineId !== station.lineId
              const color = lineColor(station.lineId)
              return (
                <Box key={`${station.id}-${i}`} sx={{ display: 'flex', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 16 }}>
                    <Box
                      sx={{
                        width: isFirst || isLast ? 12 : 10,
                        height: isFirst || isLast ? 12 : 10,
                        borderRadius: '50%',
                        border: '3px solid',
                        borderColor: isFirst ? 'primary.main' : isLast ? 'error.main' : color,
                        bgcolor: isLast ? 'error.main' : 'background.paper',
                        flexShrink: 0,
                      }}
                    />
                    {!isLast && <Box sx={{ width: 3, flex: 1, minHeight: 28, my: 0.25, bgcolor: color }} />}
                  </Box>
                  <Box sx={{ pb: 2, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{station.stationName}</Typography>
                      {isFirst && (
                        <Typography variant="caption" color="text.secondary">
                          출발
                        </Typography>
                      )}
                      {isLast && (
                        <Typography variant="caption" color="text.secondary">
                          도착
                        </Typography>
                      )}
                      {isTransferPoint && (
                        <Typography variant="caption" color="text.secondary">
                          환승
                        </Typography>
                      )}
                    </Box>
                    {(isFirst || isLast || isTransferPoint) && (
                      <LineBadge name={station.lineName} color={color} />
                    )}
                  </Box>
                </Box>
              )
            })}
          </Box>

          <Divider />
          <Box sx={{ p: 2 }}>
            <Button fullWidth variant="contained" size="large" disabled>
              알림 시작 (준비 중)
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}
