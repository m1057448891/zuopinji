import { useEffect, useRef, useState } from 'react'

const IMAGES = [
  {
    src: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260725_120544_94be5de4-0f4f-494c-bb78-c532290040a6.png&w=1920&q=85',
    fallback: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260725_120544_94be5de4-0f4f-494c-bb78-c532290040a6.png'
  },
  {
    src: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260725_120601_5c6e4705-b992-4227-9dff-9b000351c283.png&w=1920&q=85',
    fallback: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260725_120601_5c6e4705-b992-4227-9dff-9b000351c283.png'
  },
  {
    src: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260725_120619_7bc65416-a3d7-4e8c-9929-743f233378fe.png&w=1920&q=85',
    fallback: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260725_120619_7bc65416-a3d7-4e8c-9929-743f233378fe.png'
  },
  {
    src: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260725_120627_b40a97b0-c5fa-408c-a77e-dc8fa44f8584.png&w=1920&q=85',
    fallback: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260725_120627_b40a97b0-c5fa-408c-a77e-dc8fa44f8584.png'
  },
  {
    src: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260725_120635_515cde41-2dc6-48ce-a236-088a5bc74ca8.png&w=1920&q=85',
    fallback: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260725_120635_515cde41-2dc6-48ce-a236-088a5bc74ca8.png'
  },
  {
    src: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260725_120645_5a1170c6-145b-477b-abd2-f8620acccd8d.png&w=1920&q=85',
    fallback: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260725_120645_5a1170c6-145b-477b-abd2-f8620acccd8d.png'
  }
]

const LINKS = ['Work', 'Index', 'Events', 'Projects']
const SPEED = 0.8

export default function GalleryShowcase() {
  const [open, setOpen] = useState(false)
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const velocityRef = useRef(0)
  const dragRef = useRef({ active: false, startX: 0, startOffset: 0, lastX: 0, lastT: 0 })

  // 菜单打开时锁定页面滚动
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

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
      {/* 固定导航 */}
      <header className="ba-nav">
        <svg width="28" height="28" viewBox="0 0 256 256" fill="#1a1a1a" aria-hidden="true">
          <path d="M 144 256 L 27.598 256 L 144 139.598 Z M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z M 0 204.402 L 0 112 L 92.402 112 Z" />
        </svg>

        <button className="ba-burger" onClick={() => setOpen(true)} aria-label="Open menu">
          <i />
          <i />
        </button>

        <a className="ba-cta" href="#">Book a meeting</a>
        <span className="ba-balance" aria-hidden="true" />
      </header>

      {/* 遮罩 */}
      <div className={`ba-overlay${open ? ' is-open' : ''}`} onClick={() => setOpen(false)} />

      {/* 全屏/右侧抽屉菜单 */}
      <div className={`ba-drawer${open ? ' is-open' : ''}`}>
        <div className="ba-drawer-head">
          <svg width="28" height="28" viewBox="0 0 256 256" fill="#1a1a1a" aria-hidden="true">
            <path d="M 144 256 L 27.598 256 L 144 139.598 Z M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z M 0 204.402 L 0 112 L 92.402 112 Z" />
          </svg>
          <button className={`ba-close${open ? ' is-open' : ''}`} onClick={() => setOpen(false)} aria-label="Close menu">
            <i />
            <i />
          </button>
        </div>
        <nav className="ba-links">
          {LINKS.map((label, i) => (
            <a key={label} href="#" style={{ '--i': i }} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="ba-drawer-cta">
          <a className="ba-cta ba-cta--lg" href="#" onClick={() => setOpen(false)}>
            Book a meeting
          </a>
        </div>
      </div>

      {/* Hero */}
      <div className="ba-hero">
        <h1>
          Bespoke Architecture
          <br />
          Studio
        </h1>
        <p>The building you deserve has never been built before.</p>
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
              <img
                src={img.src}
                onError={(e) => {
                  if (e.currentTarget.src !== img.fallback) e.currentTarget.src = img.fallback
                }}
                loading="lazy"
                draggable={false}
                alt=""
              />
            </div>
          ))}
        </div>

        <svg className="ba-mask ba-mask--bottom" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 100H1440V50C1440 50 1200 0 720 0C240 0 0 50 0 50V100Z" fill="#fff" />
        </svg>
      </div>

      {/* 底部 */}
      <footer className="ba-bottom">
        <p>We design private residences and commercial spaces from a blank page. No templates, no repeated floorplans, no shortcuts.</p>
        <div className="ba-links-row">
          <a href="#">Book a meeting</a>
          <a href="#">See Projects</a>
        </div>
      </footer>
    </section>
  )
}
