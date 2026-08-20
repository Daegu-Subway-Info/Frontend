import { createTheme } from '@mui/material/styles'

/**
 * 기획 문서 "4. 디자인 시스템" 토큰을 MUI 테마로 옮긴 것.
 * Warning 색상 hex는 기획서에 없어 MUI 기본 amber(#ED6C02)를 임시로 사용 — 확정되면 교체.
 */
export const theme = createTheme({
  palette: {
    primary: { main: '#2563EB' },
    secondary: { main: '#10B981' },
    error: { main: '#EF4444' },
    warning: { main: '#ED6C02' },
    grey: { 500: '#6B7280' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    text: { primary: '#111827', secondary: '#6B7280' },
  },
  typography: {
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    h1: { fontSize: 24, fontWeight: 700, lineHeight: 1.4 },
    h2: { fontSize: 20, fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: 16, fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
    caption: { fontSize: 12, fontWeight: 400, lineHeight: 1.4 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 12, fontWeight: 600 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
})
