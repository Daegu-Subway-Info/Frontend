import { NavLink } from 'react-router-dom'
import styles from './BottomNav.module.css'
import { ClockIcon, HomeIcon, MapIcon, SearchIcon } from './icons'

const TABS = [
  { to: '/', label: '홈', icon: HomeIcon, end: true },
  { to: '/lines', label: '노선도', icon: MapIcon, end: false },
  { to: '/search', label: '검색', icon: SearchIcon, end: false },
  { to: '/timetable', label: '시간표', icon: ClockIcon, end: false },
]

export default function BottomNav() {
  return (
    <nav className={styles.nav}>
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
        >
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
