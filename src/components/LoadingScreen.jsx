import { useEffect, useRef, useState } from 'react'
import { asset } from '../lib/asset.js'

const HERO_VIDEOS = [
  '/works/vid/vid-001.mp4',
  '/works/hero/hero-01.mp4',
  '/works/hero/hero-02.mp4',
  '/works/hero/hero-03.mp4',
  '/works/hero/hero-04.mp4',
  '/works/hero/hero-05.mp4'
].map((p) => asset(p))

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function LoadingScreen({ onLoaded }) {
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const doneRef = useRef(false)
  const lastUpdate = useRef(0)
  const onLoadedRef = useRef(onLoaded)
  onLoadedRef.current = onLoaded

  useEffect(() => {
    const videos = HERO_VIDEOS.map((src) => {
      const v = document.createElement('video')
      v.preload = 'auto'
      v.muted = true
      v.playsInline = true
      v.src = src
      v.style.cssText =
        'position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0;pointer-events:none;'
      document.body.appendChild(v)
      v.load()
      return v
    })

    let raf = 0

    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      cancelAnimationFrame(raf)
      setProgress(100)
      setTimeout(() => {
        setLeaving(true)
        setTimeout(() => onLoadedRef.current?.(), 700)
        videos.forEach((v) => {
          v.pause()
          v.removeAttribute('src')
          v.load()
          v.remove()
        })
      }, 420)
    }

    const update = () => {
      if (doneRef.current) return
      let sum = 0
      for (const v of videos) {
        let p = 0
        const d = v.duration
        if (Number.isFinite(d) && d > 0 && v.buffered.length) {
          p = Math.min(1, v.buffered.end(v.buffered.length - 1) / d)
        }
        if (v.readyState >= 4) p = 1
        sum += p
      }
      const pct = 12 + 88 * (sum / videos.length)
      const now = performance.now()
      if (now - lastUpdate.current > 100) {
        lastUpdate.current = now
        setProgress(Math.min(99.5, pct))
      }
      if (sum / videos.length >= 1) {
        finish()
        return
      }
      raf = requestAnimationFrame(update)
    }

    raf = requestAnimationFrame(update)
    const timeout = setTimeout(finish, 30000)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timeout)
      videos.forEach((v) => v.remove())
    }
  }, [])

  const offset = CIRCUMFERENCE * (1 - Math.min(100, progress) / 100)

  return (
    <div className={`loader${leaving ? ' is-leaving' : ''}`} aria-hidden="true">
      <div className="loader__grid" />
      <div className="loader__glow" />
      <div className="loader__core">
        <svg className="loader__ring" viewBox="0 0 120 120">
          <circle className="loader__ring-track" cx="60" cy="60" r={RADIUS} />
          <circle
            className="loader__ring-bar"
            cx="60"
            cy="60"
            r={RADIUS}
            transform="rotate(-90 60 60)"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="loader__logo">✦</div>
      </div>
      <div className="loader__pct mono">{Math.floor(progress)}%</div>
      <div className="loader__label">LOADING</div>
    </div>
  )
}
