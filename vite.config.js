import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/lady-tea/', // 🔥 新增這一行，告訴網頁你的 GitHub 專案名稱
  plugins: [react()],
})
