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
      const p = Math.min(100, ((performance.now() - t0) / 2400) * 100)
      setPercent(Math.round(p))
      if (p < 100) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

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

    // M 主笔画绘制完成即进入首页
    const mPath = document.querySelector('.m-main')
    const onMDone = () => finish()
    mPath?.addEventListener('animationend', onMDone)
    const fallback = setTimeout(finish, 3400)

    return () => {
      mountedRef.current = false
      cancelAnimationFrame(raf)
      mPath?.removeEventListener('animationend', onMDone)
      clearTimeout(fallback)
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
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="geo" aria-hidden="true">
          {/* 贯穿全屏的垂直线 */}
          <line className="geo-line geo-v geo-v--1" x1="150" y1="0" x2="150" y2="1000" pathLength="1000" />
          <line className="geo-line geo-v geo-v--2" x1="1450" y1="0" x2="1450" y2="1000" pathLength="1000" />

          {/* 两端渐隐的水平线 */}
          <line className="geo-line geo-h geo-h--1" x1="80" y1="130" x2="1520" y2="130" pathLength="1000" />
          <line className="geo-line geo-h geo-h--2" x1="80" y1="280" x2="1520" y2="280" pathLength="1000" />
          <line className="geo-line geo-h geo-h--3" x1="80" y1="430" x2="1520" y2="430" pathLength="1000" />
          <line className="geo-line geo-h geo-h--4" x1="80" y1="570" x2="1520" y2="570" pathLength="1000" />
          <line className="geo-line geo-h geo-h--5" x1="80" y1="720" x2="1520" y2="720" pathLength="1000" />
          <line className="geo-line geo-h geo-h--6" x1="80" y1="870" x2="1520" y2="870" pathLength="1000" />

          {/* 全屏对角线构造线（低透明度） */}
          <line className="geo-diag" x1="80" y1="920" x2="1520" y2="80" />
          <line className="geo-diag" x1="80" y1="80" x2="1520" y2="920" />

          {/* 虚线辅助圆 */}
          <circle className="geo-circle geo-circle--outer" cx="800" cy="500" r="430" />
          <circle className="geo-circle geo-circle--inner" cx="800" cy="500" r="250" />

          {/* 放射虚线 */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              className="geo-radial"
              x1="800"
              y1="500"
              x2={800 + 500 * Math.cos((deg * Math.PI) / 180)}
              y2={500 + 500 * Math.sin((deg * Math.PI) / 180)}
            />
          ))}

          {/* M 字三线勾勒（全屏主视觉） */}
          <path className="m-path m-echo m-echo--l" d="M560 800 L560 330 L800 560 L1040 330 L1040 800" pathLength="1000" />
          <path className="m-path m-echo m-echo--r" d="M560 800 L560 330 L800 560 L1040 330 L1040 800" pathLength="1000" />
          <path className="m-path m-main" d="M560 800 L560 330 L800 560 L1040 330 L1040 800" pathLength="1000" />

          {/* M 关键点刻度 */}
          {[
            [560, 330],
            [800, 560],
            [1040, 330],
            [1040, 800]
          ].map(([x, y], i) => (
            <g key={i} className="geo-tick">
              <line x1={x - 16} y1={y} x2={x + 16} y2={y} />
              <line x1={x} y1={y - 16} x2={x} y2={y + 16} />
            </g>
          ))}
        </svg>
      </div>

      <div className="intro-loader__meta">
        <span className="intro-loader__label mono">LOADING</span>
        <div className="intro-loader__text">
          <ScrambleLine text="MOSATO SAKAI" startDelay={950} speed={34} pool={EN_POOL} />
          <ScrambleLine text="马中帅 · 内容运营 × AI 视觉创作" startDelay={1400} speed={26} pool={CN_POOL} />
        </div>
        <span className="intro-loader__percent mono">{String(percent).padStart(3, '0')}</span>
      </div>
    </div>
  )
}
