import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import CircularProgress from '@mui/material/CircularProgress'
import LineBadge from '../../components/LineBadge'
import ScreenHeader from '../../components/ScreenHeader'
import { useLinesQuery, useStationSearchQuery, useStationsQuery } from '../../api/queries'
import { ApiError } from '../../api/http'
import type { StationResponse } from '../../api/types'
import { useRecentSearchesStore } from '../../store/recentSearchesStore'
import { useRouteDraftStore } from '../../store/routeDraftStore'

export default function Search() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const slot = searchParams.get('slot') // 'from' | 'to' | null

  const [query, setQuery] = useState('')
  const { recent, addRecent } = useRecentSearchesStore()
  const { setFrom, setTo } = useRouteDraftStore()
  const { data: lines = [] } = useLinesQuery()
  const lineColor = (lineId: number) => lines.find((l) => l.id === lineId)?.lineColor ?? '#6B7280'

  const trimmed = query.trim()
  const allStationsQuery = useStationsQuery()
  const searchQuery = useStationSearchQuery(trimmed)

  const { data, isLoading, error } = trimmed
    ? { data: searchQuery.data?.stations, isLoading: searchQuery.isLoading, error: searchQuery.error }
    : { data: allStationsQuery.data, isLoading: allStationsQuery.isLoading, error: allStationsQuery.error }

  const handleSelect = (station: StationResponse) => {
    addRecent(station)
    if (slot === 'from') {
      setFrom(station)
      navigate('/')
    } else if (slot === 'to') {
      setTo(station)
      navigate('/')
    } else {
      navigate(`/stations/${station.id}`)
    }
  }

  const title = slot === 'from' ? '출발역 검색' : slot === 'to' ? '도착역 검색' : '역 검색'

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title={title} />

      <Box sx={{ px: 2, pt: 2 }}>
        <TextField
          fullWidth
          autoFocus
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="역명 검색"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 999 } }}
        />
      </Box>

      {!query && recent.length > 0 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            최근 검색
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {recent.map((s) => (
              <Chip key={s.id} label={s.stationName} onClick={() => handleSelect(s)} variant="outlined" />
            ))}
          </Box>
        </Box>
      )}

      <Box sx={{ p: 2, pt: query || recent.length === 0 ? 2 : 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {query ? '검색 결과' : '전체 역'}
        </Typography>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {error && (
          <Typography variant="body2" color="text.secondary">
            {error instanceof ApiError ? error.message : '검색 중 오류가 발생했습니다.'}
          </Typography>
        )}

        {!isLoading && !error && (data?.length ?? 0) === 0 && (
          <Typography variant="body2" color="text.secondary">
            검색 결과가 없습니다.
          </Typography>
        )}

        {!isLoading && !error && data && data.length > 0 && (
          <List disablePadding>
            {data.map((s) => (
              <ListItemButton
                key={s.id}
                divider
                onClick={() => handleSelect(s)}
                sx={{ px: 0, display: 'flex', justifyContent: 'space-between' }}
              >
                <ListItemText primary={s.stationName} />
                <LineBadge name={s.lineName} color={lineColor(s.lineId)} />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </Box>
  )
}
