import { useEffect, useRef, useState } from 'react'
import './IntroLoader.css'

const EN_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const CN_POOL = '马中帅内容运营视觉创作设计AI影像光影情绪叙事空间构造连接灵感'

function randomChar(pool) {
  return pool[Math.floor(Math.random() * pool.length)]
}

function ScrambleLine({ text, startDelay, speed = 34, pool }) {
  const [display, setDisplay] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let raf = 0
    const t0 = Date.now() + startDelay
    const tick = () => {
      const elapsed = Date.now() - t0
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick)
        return
      }
      const reveal = Math.floor(elapsed / speed)
      if (reveal >= text.length) {
        setDisplay(text)
        setDone(true)
        return
      }
      setDisplay(
        text
          .split('')
          .map((ch, k) => (k < reveal ? ch : randomChar(pool)))
          .join('')
      )
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, startDelay, speed, pool])

  return (
    <span className={`scramble-line${done ? ' is-done' : ''}`}>
      {display}
      <span className="scramble-cursor" aria-hidden="true" />
    </span>
  )
}

export default function IntroLoader() {
  const [phase, setPhase] = useState('loading')
  const [percent, setPercent] = useState(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const t0 = performance.now()
    let raf = 0
    const tick = () => {
      const p = Math.min(100, ((performance.now() - t0) / 3200) * 100)
      setPercent(Math.round(p))
      if (p < 100) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const minTime = 3600
    let finished = false
    const finish = () => {
      if (finished || !mountedRef.current) return
      finished = true
      setPhase('exit')
      setTimeout(() => {
        document.body.style.overflow = ''
        setPhase('gone')
      }, 850)
    }

    const minTimer = setTimeout(finish, minTime)
    const loadFallback = setTimeout(finish, 7000)
    const onLoad = () => finish()
    if (document.readyState === 'complete') {
      // 等最小时间即可
    } else {
      window.addEventListener('load', onLoad)
    }

    return () => {
      mountedRef.current = false
      cancelAnimationFrame(raf)
      clearTimeout(minTimer)
      clearTimeout(loadFallback)
      window.removeEventListener('load', onLoad)
      document.body.style.overflow = ''
    }
  }, [])

  if (phase === 'gone') return null

  return (
    <div className={`intro-loader${phase === 'exit' ? ' is-exit' : ''}`} aria-hidden={phase === 'exit'}>
      <div className="intro-loader__grid" aria-hidden="true" />
      <span className="frame-corner frame-corner--tl" />
      <span className="frame-corner frame-corner--tr" />
      <span className="frame-corner frame-corner--bl" />
      <span className="frame-corner frame-corner--br" />

      <div className="intro-loader__stage">
        <svg viewBox="0 0 800 560" className="geo" aria-hidden="true">
          {/* 贯穿的垂直线 */}
          <line className="geo-line geo-v geo-v--1" x1="120" y1="0" x2="120" y2="560" pathLength="1000" />
          <line className="geo-line geo-v geo-v--2" x1="680" y1="0" x2="680" y2="560" pathLength="1000" />

          {/* 两端渐隐的水平线 */}
          <line className="geo-line geo-h geo-h--1" x1="80" y1="84" x2="720" y2="84" pathLength="1000" />
          <line className="geo-line geo-h geo-h--2" x1="80" y1="180" x2="720" y2="180" pathLength="1000" />
          <line className="geo-line geo-h geo-h--3" x1="80" y1="380" x2="720" y2="380" pathLength="1000" />
          <line className="geo-line geo-h geo-h--4" x1="80" y1="476" x2="720" y2="476" pathLength="1000" />

          {/* 虚线辅助圆 */}
          <circle className="geo-circle geo-circle--outer" cx="400" cy="280" r="212" />
          <circle className="geo-circle geo-circle--inner" cx="400" cy="280" r="126" />

          {/* 放射虚线 */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              className="geo-radial"
              x1="400"
              y1="280"
              x2={400 + 240 * Math.cos((deg * Math.PI) / 180)}
              y2={280 + 240 * Math.sin((deg * Math.PI) / 180)}
            />
          ))}

          {/* M 字三线勾勒 */}
          <path className="m-path m-echo m-echo--l" d="M250 420 L250 170 L400 330 L550 170 L550 420" pathLength="1000" />
          <path className="m-path m-echo m-echo--r" d="M250 420 L250 170 L400 330 L550 170 L550 420" pathLength="1000" />
          <path className="m-path m-main" d="M250 420 L250 170 L400 330 L550 170 L550 420" pathLength="1000" />

          {/* M 关键点刻度 */}
          {[
            [250, 170],
            [400, 330],
            [550, 170],
            [550, 420]
          ].map(([x, y], i) => (
            <g key={i} className="geo-tick">
              <line x1={x - 10} y1={y} x2={x + 10} y2={y} />
              <line x1={x} y1={y - 10} x2={x} y2={y + 10} />
            </g>
          ))}
        </svg>
      </div>

      <div className="intro-loader__meta">
        <span className="intro-loader__label mono">LOADING</span>
        <div className="intro-loader__text">
          <ScrambleLine text="MOSATO SAKAI" startDelay={1500} speed={38} pool={EN_POOL} />
          <ScrambleLine text="马中帅 · 内容运营 × AI 视觉创作" startDelay={2200} speed={26} pool={CN_POOL} />
        </div>
        <span className="intro-loader__percent mono">{String(percent).padStart(3, '0')}</span>
      </div>
    </div>
  )
}
