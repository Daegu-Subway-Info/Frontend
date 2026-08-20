import { Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import styles from './App.module.css'
import Home from './pages/Home'
import LineMap from './pages/LineMap'
import RouteResult from './pages/RouteResult'
import Search from './pages/Search'
import StationDetail from './pages/StationDetail'
import Timetable from './pages/Timetable'

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/route-result" element={<RouteResult />} />
          <Route path="/lines" element={<LineMap />} />
          <Route path="/stations/:id" element={<StationDetail />} />
          <Route path="/timetable" element={<Timetable />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}

export default App
