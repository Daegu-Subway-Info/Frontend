import { LINES } from '../data/stations'
import type { LineId } from '../types/subway'
import styles from './LineBadge.module.css'

export default function LineBadge({ line }: { line: LineId }) {
  const info = LINES[line]
  return (
    <span className={styles.badge} style={{ backgroundColor: info.color }}>
      {info.name}
    </span>
  )
}
