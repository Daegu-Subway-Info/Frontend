import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import LineBadge from '../../components/LineBadge'
import { useLinesQuery } from '../../api/queries'
import { useRecentRoutesStore } from '../../store/recentRoutesStore'
import { useRouteDraftStore } from '../../store/routeDraftStore'

export default function Home() {
  const navigate = useNavigate()
  const { from, to, swap } = useRouteDraftStore()
  const { recent, addRecent } = useRecentRoutesStore()
  const { data: lines = [] } = useLinesQuery()
  const lineColor = (lineId: number) => lines.find((l) => l.id === lineId)?.lineColor ?? '#6B7280'

  const canSearch = Boolean(from && to && from.id !== to.id)

  const handleSubmit = () => {
    if (!from || !to) return
    addRecent(from, to)
    navigate('/route-result', { state: { from, to } })
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h2">대구 지하철</Typography>
      </Box>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Box
                component="button"
                onClick={() => navigate('/search?slot=from')}
                sx={{ display: 'block', width: '100%', textAlign: 'left', border: 'none', background: 'none', p: 1, cursor: 'pointer' }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  출발역
                </Typography>
                <Typography variant="h2" color={from ? 'text.primary' : 'text.disabled'}>
                  {from?.stationName ?? '출발역을 선택하세요'}
                </Typography>
              </Box>
              <Divider />
              <Box
                component="button"
                onClick={() => navigate('/search?slot=to')}
                sx={{ display: 'block', width: '100%', textAlign: 'left', border: 'none', background: 'none', p: 1, cursor: 'pointer' }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  도착역
                </Typography>
                <Typography variant="h2" color={to ? 'text.primary' : 'text.disabled'}>
                  {to?.stationName ?? '도착역을 선택하세요'}
                </Typography>
              </Box>
            </Box>
            <IconButton aria-label="출발/도착 바꾸기" onClick={swap} sx={{ border: 1, borderColor: 'divider' }}>
              <SwapVertIcon />
            </IconButton>
          </Box>

          <Button fullWidth variant="contained" size="large" disabled={!canSearch} onClick={handleSubmit} sx={{ mt: 2 }}>
            길찾기
          </Button>
        </Paper>

        <Box>
          <Typography variant="h2" sx={{ mb: 1 }}>
            최근 경로
          </Typography>
          {recent.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              최근 검색한 경로가 없습니다.
            </Typography>
          ) : (
            <List disablePadding>
              {recent.map((r) => (
                <ListItemButton
                  key={`${r.from.id}-${r.to.id}-${r.at}`}
                  divider
                  onClick={() => navigate('/route-result', { state: { from: r.from, to: r.to } })}
                  sx={{ px: 0, display: 'flex', justifyContent: 'space-between' }}
                >
                  <ListItemText primary={`${r.from.stationName} → ${r.to.stationName}`} />
                  <LineBadge name={r.to.lineName} color={lineColor(r.to.lineId)} />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Box>
  )
}
