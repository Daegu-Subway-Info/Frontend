import Chip from '@mui/material/Chip'

export default function LineBadge({ name, color }: { name: string; color: string }) {
  return (
    <Chip
      label={name}
      size="small"
      sx={{
        backgroundColor: color,
        color: '#fff',
        height: 22,
        fontSize: 12,
      }}
    />
  )
}
