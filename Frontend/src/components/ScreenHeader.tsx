import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

interface Props {
  title: string
  right?: ReactNode
  /** 뒤로가기 대신 특정 경로로 보내고 싶을 때 */
  onBack?: () => void
}

export default function ScreenHeader({ title, right, onBack }: Props) {
  const navigate = useNavigate()
  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar>
        <IconButton edge="start" aria-label="뒤로가기" onClick={() => (onBack ? onBack() : navigate(-1))}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h2" sx={{ flex: 1 }}>
          {title}
        </Typography>
        {right}
      </Toolbar>
    </AppBar>
  )
}
