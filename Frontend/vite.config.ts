import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 백엔드를 로컬(8080)에서 ./gradlew bootRun 으로 띄운 상태를 가정한 개발용 프록시.
      // CORS 설정 없이 바로 붙여보려고 둔 것 — 배포 시에는 실제 API 베이스 URL로 교체 필요.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
