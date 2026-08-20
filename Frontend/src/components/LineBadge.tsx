import styles from './LineBadge.module.css'

export default function LineBadge({ name, color }: { name: string; color: string }) {
  return (
    <span className={styles.badge} style={{ backgroundColor: color }}>
      {name}
    </span>
  )
}
