import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ScreenHeader.module.css'
import { ChevronLeftIcon } from './icons'

interface Props {
  title: string
  right?: ReactNode
  /** 뒤로가기 대신 특정 경로로 보내고 싶을 때 */
  onBack?: () => void
}

export default function ScreenHeader({ title, right, onBack }: Props) {
  const navigate = useNavigate()
  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.back}
        aria-label="뒤로가기"
        onClick={() => (onBack ? onBack() : navigate(-1))}
      >
        <ChevronLeftIcon />
      </button>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.right}>{right}</div>
    </header>
  )
}
