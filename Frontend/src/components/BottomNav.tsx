import { useLocation, useNavigate } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import HomeIcon from '@mui/icons-material/Home'
import MapIcon from '@mui/icons-material/Map'
import SearchIcon from '@mui/icons-material/Search'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

const TABS = [
  { to: '/', label: '홈', icon: <HomeIcon /> },
  { to: '/lines', label: '노선도', icon: <MapIcon /> },
  { to: '/search', label: '검색', icon: <SearchIcon /> },
  { to: '/timetable', label: '시간표', icon: <AccessTimeIcon /> },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const current = TABS.find((t) => (t.to === '/' ? pathname === '/' : pathname.startsWith(t.to)))?.to ?? '/'

  return (
    <Paper elevation={3} sx={{ position: 'sticky', bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation value={current} onChange={(_, value) => navigate(value)} showLabels>
        {TABS.map((t) => (
          <BottomNavigationAction key={t.to} label={t.label} value={t.to} icon={t.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  )
}
