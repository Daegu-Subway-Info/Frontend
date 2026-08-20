import { Route, Routes } from 'react-router-dom'
import Box from '@mui/material/Box'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import LineMap from './pages/LineMap'
import RouteResult from './pages/RouteResult'
import Search from './pages/Search'
import StationDetail from './pages/StationDetail'
import Timetable from './pages/Timetable'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100svh' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/route-result" element={<RouteResult />} />
          <Route path="/lines" element={<LineMap />} />
          <Route path="/stations/:id" element={<StationDetail />} />
          <Route path="/timetable" element={<Timetable />} />
        </Routes>
      </Box>
      <BottomNav />
    </Box>
  )
}

export default App
