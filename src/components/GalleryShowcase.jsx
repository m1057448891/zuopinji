import { useEffect, useRef } from 'react'
import { asset } from '../lib/asset.js'

const IMAGES = [
  { img: '/works/img/img-015.webp' },
  { img: '/works/img/img-023.webp' },
  { img: '/works/img/img-013.webp' },
  { img: '/works/img/img-018.webp' },
  { img: '/works/img/img-021.webp' },
  { img: '/works/img/img-011.webp' }
]

const SPEED = 0.8

export default function GalleryShowcase() {
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const velocityRef = useRef(0)
  const dragRef = useRef({ active: false, startX: 0, startOffset: 0, lastX: 0, lastT: 0 })

  // 本页在视口内时隐藏全站导航，避免双导航冲突
  useEffect(() => {
    const sec = document.getElementById('gallery-showcase')
    if (!sec) return
    const io = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle('hide-site-nav', entry.isIntersecting && entry.intersectionRatio > 0.35)
      },
      { threshold: [0.2, 0.35, 0.6] }
    )
    io.observe(sec)
    return () => {
      io.disconnect()
      document.body.classList.remove('hide-site-nav')
    }
  }, [])

  // 图带动画引擎：requestAnimationFrame + 拖拽惯性 + 无缝循环
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf = 0
    const loop = () => {
      const d = dragRef.current
      if (!d.active) {
        if (Math.abs(velocityRef.current) > 0.1) {
          offsetRef.current += velocityRef.current
          velocityRef.current *= 0.95
        } else {
          velocityRef.current = 0
          offsetRef.current -= SPEED
        }
      }
      const half = track.scrollWidth / 2
      if (offsetRef.current <= -half) offsetRef.current += half
      if (offsetRef.current > 0) offsetRef.current -= half
      track.style.transform = `translate3d(${offsetRef.current}px,0,0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onPointerDown = (e) => {
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startOffset: offsetRef.current,
      lastX: e.clientX,
      lastT: performance.now()
    }
    velocityRef.current = 0
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d.active) return
    const now = performance.now()
    const dx = e.clientX - d.lastX
    const dt = Math.max(1, now - d.lastT)
    velocityRef.current = (dx / dt) * 16
    d.lastX = e.clientX
    d.lastT = now
    offsetRef.current = d.startOffset + (e.clientX - d.startX)
  }

  const endDrag = () => {
    dragRef.current.active = false
  }

  return (
    <section className="gallery-showcase ba" id="gallery-showcase">
      {/* Hero */}
        <div className="ba-hero">
          <h1>
            MOSATO SAKAI
            <br />
            VISUAL CREATOR
          </h1>
          <p>内容运营 × AI 视觉创作 · 把想象力变成可交付的作品</p>
        </div>

      {/* 无限图带 */}
      <div className="ba-marquee">
        <svg className="ba-mask ba-mask--top" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0H1440V50C1440 50 1200 100 720 100C240 100 0 50 0 50V0Z" fill="#fff" />
        </svg>

        <div
          className="ba-track"
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {[...IMAGES, ...IMAGES].map((img, i) => (
            <div className="ba-slide" key={i}>
              <img src={asset(img.img)} loading="lazy" draggable={false} alt="" />
            </div>
          ))}
        </div>

        <svg className="ba-mask ba-mask--bottom" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 100H1440V50C1440 50 1200 0 720 0C240 0 0 50 0 50V100Z" fill="#fff" />
        </svg>
      </div>

      {/* 底部 */}
      <footer className="ba-bottom">
        <p>从内容策略到 AI 视觉生产，我用生成式 AI 完成文案、图片与动态影像，覆盖从创意到交付的全流程。</p>
        <div className="ba-links-row">
          <a href="#contact">联系我</a>
          <a href="#image-works">查看作品</a>
        </div>
      </footer>
    </section>
  )
}
