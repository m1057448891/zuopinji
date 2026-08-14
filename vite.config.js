import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages 部署在子路径 /zuopinji/，EdgeOne Pages 在根路径 /
  // 由各自的构建环境通过 VITE_BASE 指定
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  build: {
    chunkSizeWarningLimit: 1600
  }
})
