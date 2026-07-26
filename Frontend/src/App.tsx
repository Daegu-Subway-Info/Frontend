import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import RoutePage from './pages/Route'
import Search from './pages/Search'
import Timetable from './pages/Timetable'
import './App.css'

function App() {
  return (
    <div className="app">
      <nav className="app-nav">
        <NavLink to="/">홈</NavLink>
        <NavLink to="/route">노선</NavLink>
        <NavLink to="/search">검색</NavLink>
        <NavLink to="/timetable">시간표</NavLink>
      </nav>

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/route" element={<RoutePage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/timetable" element={<Timetable />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
