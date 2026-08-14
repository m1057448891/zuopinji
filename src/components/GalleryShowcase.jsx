import { useEffect, useRef } from 'react'
import { asset } from '../lib/asset.js'
import AxionShaderBg from './AxionShaderBg.jsx'
import FoldText from './FoldText.jsx'

const IMAGES = [
  { img: '/works/gallery/g-01.webp' },
  { img: '/works/gallery/g-02.webp' },
  { img: '/works/gallery/g-03.webp' },
  { img: '/works/gallery/g-04.webp' },
  { img: '/works/gallery/g-05.webp' },
  { img: '/works/gallery/g-06.webp' },
  { img: '/works/gallery/g-07.webp' },
  { img: '/works/gallery/g-08.webp' },
  { img: '/works/gallery/g-09.webp' },
  { img: '/works/gallery/g-10.webp' },
  { img: '/works/gallery/g-11.webp' },
  { img: '/works/gallery/g-12.webp' },
  { img: '/works/gallery/g-13.webp' },
  { img: '/works/gallery/g-14.webp' },
  { img: '/works/gallery/g-15.webp' },
  { img: '/works/gallery/g-16.webp' },
  { img: '/works/gallery/g-17.webp' },
  { img: '/works/gallery/g-18.webp' },
  { img: '/works/gallery/g-19.webp' },
  { img: '/works/gallery/g-20.webp' },
  { img: '/works/gallery/g-21.webp' }
]

const SPEED = 0.8

export default function GalleryShowcase() {
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const velocityRef = useRef(0)
  const dragRef = useRef({ active: false, startX: 0, startOffset: 0, lastX: 0, lastT: 0 })

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
      <div className="ba-axion" aria-hidden="true">
        <AxionShaderBg />
      </div>

      {/* Hero */}
        <div className="ba-hero">
          <h1>
            <FoldText
              text={'MOSATO SAKAI\nVISUAL CREATOR'}
              splitBy="line"
              hinge="top"
              trigger="scroll"
              duration={0.65}
              stagger={0.1}
              ease="power3.out"
              perspective={700}
              creaseShading={0.55}
              fontSize="clamp(30px, 3.6vw, 52px)"
              fontWeight={600}
              color="#171717"
            />
          </h1>
          <p>内容运营 × AI 视觉创作 · 把想象力变成可交付的作品</p>
        </div>

      {/* 无限图带 */}
      <div className="ba-marquee">
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
