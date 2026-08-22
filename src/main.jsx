import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '@fontsource/dm-sans/300.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import '@fontsource/dm-sans/700.css'
import '@fontsource/archivo-black/400.css'
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/500.css'
import '@fontsource/outfit/600.css'
import '@fontsource/jetbrains-mono/300.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import './styles.css'

// 整页按屏幕比例自动缩放（不改组件尺寸）：以 1440x900 为基准，contain 适配任意显示器
// 手机/平板（width=1440 视口元标签已生效）由浏览器自行缩放，这里跳过避免叠加
function applyPageFit() {
  const el = document.documentElement
  const innerW = window.innerWidth
  const innerH = window.innerHeight
  if (innerW > window.screen.width + 5) return
  const scale = Math.max(0.5, Math.min(1, Math.min(innerW / 1440, innerH / 900)))
  el.style.setProperty('--fit', String(scale))
  el.style.zoom = String(scale)
}
applyPageFit()
window.addEventListener('resize', applyPageFit)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)


