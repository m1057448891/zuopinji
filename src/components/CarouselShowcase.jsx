import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '../lib/asset.js'
import { videoSources } from '../lib/videoSources.js'
import FoldText from './FoldText.jsx'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  { no: '01', cn: '灯塔生花', en: 'Lighthouse in Bloom', tag: 'DREAMY 3D', date: '2026', file: '/works/vid/vid-024.mp4', poster: '/works/carousel/p1.jpg' },
  { no: '02', cn: '赛博圣母', en: 'Cyber Madonna', tag: 'GLITCH ART', date: '2026', file: '/works/vid/vid-025.mp4', poster: '/works/carousel/p2.jpg' },
  { no: '03', cn: '灯夜傩舞', en: 'Masked Lantern Dancer', tag: 'CHINESE FOLK', date: '2026', file: '/works/vid/vid-026.mp4', poster: '/works/carousel/p3.jpg' },
  { no: '04', cn: '白幔圣殿', en: 'Veiled Sanctum', tag: 'EPIC FANTASY', date: '2026', file: '/works/vid/vid-027.mp4', poster: '/works/carousel/p4.jpg' },
  { no: '05', cn: '剑染残阳', en: 'Sword at Dusk', tag: 'WUXIA CINEMA', date: '2026', file: '/works/vid/vid-028.mp4', poster: '/works/carousel/p5.jpg' },
  { no: '06', cn: '透框守花', en: 'Framed Tenderness', tag: 'HEALING LIGHT', date: '2026', file: '/works/vid/vid-029.mp4', poster: '/works/carousel/p6.jpg' },
  { no: '07', cn: '春樱秋千', en: 'Sakura Swing', tag: 'JAPANESE FRESH', date: '2026', file: '/works/vid/vid-016.mp4', poster: '/works/carousel/p7.jpg' }
]

const N = ITEMS.length

export default function CarouselShowcase() {
  const sectionRef = useRef(null)
  const spaceRef = useRef(null)
  const bgRef = useRef(null)
  const headRef = useRef(null)
  const indexRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [active, setActive] = useState(null)

  const cur = ITEMS[index]

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: spaceRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          const idx = Math.min(N - 1, Math.max(0, Math.round(p * (N - 1))))
          if (idx !== indexRef.current) {
            indexRef.current = idx
            setIndex(idx)
          }
          if (bgRef.current) gsap.set(bgRef.current, { y: p * -140 })
          if (headRef.current) gsap.set(headRef.current, { opacity: 1 - p * 0.55, y: p * -36 })
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const jumpTo = (i) => {
    const space = spaceRef.current
    if (!space) return
    const rect = space.getBoundingClientRect()
    const top = rect.top + window.scrollY
    const range = Math.max(0, space.offsetHeight - window.innerHeight)
    const target = top + (i / (N - 1)) * range
    const lenis = window.__lenis
    if (lenis) lenis.scrollTo(target, { duration: 1.3 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <section className="reel-oryzo" id="carousel-showcase" ref={sectionRef}>
      <div className="reel-oryzo__bg" ref={bgRef} aria-hidden="true">
        {ITEMS.map((it) => (
          <img key={it.no} className={it.no === cur.no ? 'is-live' : ''} src={asset(it.poster)} alt="" />
        ))}
      </div>

      <div className="reel-oryzo__space" ref={spaceRef}>
        <div className="reel-oryzo__sticky">
          <div className="reel-oryzo__inner">
            <header className="reel-oryzo__head" ref={headRef}>
              <span className="mono reel-oryzo__kicker">SELECTED WORKS / 精选动态影像</span>
              <h2 className="reel-oryzo__title">
                <FoldText
                  text="MOVEMENT, MOOD & STORY"
                  splitBy="word"
                  hinge="top"
                  trigger="scroll"
                  duration={0.65}
                  stagger={0.06}
                  ease="power3.out"
                  perspective={700}
                  creaseShading={0.55}
                  fontSize="clamp(30px, 3.4vw, 52px)"
                  fontWeight={800}
                  color="#f5ede4"
                />
              </h2>
              <em className="reel-oryzo__sub">光影 · 情绪 · 叙事实验</em>
            </header>

            <div className="reel-oryzo__main">
              <div className="reel-oryzo__stage">
                <button
                  className="reel-oryzo__frame"
                  onClick={() => setActive(cur)}
                  aria-label={cur.en}
                >
                  {ITEMS.map((it, i) => (
                    <img
                      key={it.no}
                      className={`reel-oryzo__slide${i === index ? ' is-active' : ''}`}
                      src={asset(it.poster)}
                      alt={it.cn}
                      style={{
                        transform: `translateX(${(i - index) * 108}%) scale(${i === index ? 1 : 0.94})`,
                        zIndex: i === index ? 2 : 1
                      }}
                    />
                  ))}
                  <span className="reel-oryzo__hud mono">
                    <span className="reel-oryzo__hud-dot" aria-hidden="true" />
                    {cur.tag} · {cur.date}
                  </span>
                  <span className="reel-oryzo__play" aria-hidden="true">
                    ▶
                  </span>
                </button>
                <p className="reel-oryzo__desc">
                  <b>{cur.cn}</b> · {cur.en}
                </p>
              </div>

              <aside className="reel-oryzo__thumbs">
                {ITEMS.map((it, i) => (
                  <button
                    key={it.no}
                    className={`reel-oryzo__thumb${i === index ? ' is-active' : ''}`}
                    onClick={() => jumpTo(i)}
                    aria-label={it.cn}
                  >
                    <img src={asset(it.poster)} alt={it.cn} />
                    <span className="mono">{it.no}</span>
                  </button>
                ))}
              </aside>
            </div>

            <p className="reel-oryzo__hint mono">SCROLL TO CONTINUE ↓</p>
          </div>
        </div>
      </div>

      {active && (
        <div className="car-modal" onClick={() => setActive(null)}>
          <div className="car-modal__inner" onClick={(e) => e.stopPropagation()}>
            <video poster={asset(active.poster)} autoPlay loop playsInline controls>
              {videoSources(active.file).map((s) => (
                <source key={s.src} src={s.src} type={s.type} />
              ))}
            </video>
            <div className="car-modal__cap">
              <span className="mono car-modal__no">NO.{active.no}</span>
              <h3>{active.cn}</h3>
              <p className="mono">{active.en}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
