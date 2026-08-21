import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { asset } from '../lib/asset.js'
import useInViewNear from '../lib/useInView.js'
import './PortraitShowcase.css'

// 背景与冰山剪影（IGLOO 概念素材，本地化保证稳定加载）
const BG = asset('/assets/igloo/bg.webp')
const ICEBERG = asset('/assets/igloo/iceberg.webp')

// 9 条竖屏视频作品（视频文件走 CDN，封面帧由站点自身提供）
const VIDEOS = [
  { id: '01', file: '/works/ads/portrait/01.mp4', poster: '/videos/portrait/01-poster.jpg', cn: '曜黑充电舱', en: 'DARK CHARGE CASE', tag: 'PRODUCT FILM' },
  { id: '02', file: '/works/ads/portrait/02.mp4', poster: '/videos/portrait/02-poster.jpg', cn: '灯影青舞', en: 'TEAL DANCE IN LANTERN LIGHT', tag: 'AI SHORT FILM' },
  { id: '03', file: '/works/ads/portrait/03.mp4', poster: '/videos/portrait/03-poster.jpg', cn: '方糖的温柔坠落', en: 'SWEET LANDING', tag: 'MACRO FILM' },
  { id: '04', file: '/works/ads/portrait/04.mp4', poster: '/videos/portrait/04-poster.jpg', cn: '傲娇小鸡摸摸头', en: 'PET THE GRUMPY CHICK', tag: 'GAME ANIMATION' },
  { id: '05', file: '/works/ads/portrait/05.mp4', poster: '/videos/portrait/05-poster.jpg', cn: '翠滴入掌', en: 'EMERALD DROP INTO THE PALM', tag: 'NATURE LOOP' },
  { id: 'anim-01', file: '/works/ads/portrait/anim-01.mp4', poster: '/videos/portrait/anim-01-poster.jpg', cn: '花海灯塔', en: 'LIGHTHOUSE IN BLOOM', tag: 'AI SHORT FILM' },
  { id: 'anim-03', file: '/works/ads/portrait/anim-03.mp4', poster: '/videos/portrait/anim-03-poster.jpg', cn: '电子圣殇', en: 'DIGITAL PIETÀ', tag: 'NEON · GLITCH' },
  { id: 'anim-05', file: '/works/ads/portrait/anim-05.mp4', poster: '/videos/portrait/anim-05-poster.jpg', cn: '车窗玫瑰纪行', en: 'ROSES ALONG THE RAILS', tag: 'RETRO FILM' },
  { id: 'anim-08', file: '/works/ads/portrait/anim-08.mp4', poster: '/videos/portrait/anim-08-poster.jpg', cn: '花雨秋千', en: 'SWING BENEATH THE BLOSSOMS', tag: 'AI SHORT FILM' }
]

// 左侧方形缩略图（4 个）与下方精选卡片（3 个）
const THUMBS = ['01', '03', '04', 'anim-08']
const CARDS = ['02', '05', 'anim-03']
const byId = (id) => VIDEOS.find((v) => v.id === id)

// 逐字母上拉动效（LettersPullUp）
function Letters({ text, className = '', justify = 'center' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <span ref={ref} className={`plu ${className}`} style={{ justifyContent: justify }}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={`${i}-${ch}`}
          className="plu__char"
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: i * 0.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </span>
  )
}

// 错峰出现容器（IntersectionObserver 触发一次，按索引延迟）
function Reveal({ shown, index = 0, step = 150, className = '', children }) {
  return (
    <div
      className={`pio-reveal${shown ? ' is-in' : ''} ${className}`.trim()}
      style={{ transitionDelay: shown ? `${index * step}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

export default function PortraitShowcase() {
  const sectionRef = useRef(null)
  const [sectionRefNear, isNear] = useInViewNear('0px 0px 400px 0px')
  const setSectionRef = useCallback(
    (el) => {
      sectionRef.current = el
      sectionRefNear.current = el
    },
    [sectionRefNear]
  )

  const bgRef = useRef(null)
  const iceRef = useRef(null)
  const heroRef = useRef(null)
  const [heroShown, setHeroShown] = useState(false)
  const [viewShown, setViewShown] = useState(false)

  // 滚动驱动背景/冰山缩放与位移（按 hero 在视口中的位置计算）
  useEffect(() => {
    const els = [bgRef.current, iceRef.current].filter(Boolean)
    if (!els.length) return
    let raf = 0
    const update = () => {
      const hero = heroRef.current
      if (!hero) return
      const r = hero.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.max(0, Math.min((vh - r.top) / vh, 1))
      const t = `scale(${1 + progress * 0.12})`
      const op = `center ${progress * 100}%`
      els.forEach((el) => {
        el.style.transform = t
        el.style.objectPosition = op
      })
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // hero 错峰触发
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setHeroShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // view 错峰触发
  useEffect(() => {
    const el = sectionRef.current?.querySelector('.portrait-igloo__view')
    if (!el) return
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setViewShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // 卡片视频：进入视口自动播放，离开暂停
  useEffect(() => {
    const el = sectionRef.current
    el?.querySelectorAll('video[data-play="true"]').forEach((v) => {
      if (isNear) {
        v.muted = true
        v.play().catch(() => {})
      } else {
        v.pause()
      }
    })
  }, [isNear, sectionRef])

  return (
    <section className="portrait-igloo" id="portrait-showcase" ref={setSectionRef}>
      {/* 共享背景 + 冰山剪影（横跨两屏，冰山在字标之上、UI 之下） */}
      <div className="portrait-igloo__stage" aria-hidden="true">
        <img className="portrait-igloo__bg" ref={bgRef} src={BG} alt="" draggable={false} />
      </div>

      {/* Section 1 · Hero */}
      <div className="portrait-igloo__hero" ref={heroRef}>
        <div className="portrait-igloo__wordmark">
          <Letters text="PORTRAIT" />
        </div>

        <div className="portrait-igloo__iceberg-wrap">
          <img className="portrait-igloo__iceberg" ref={iceRef} src={ICEBERG} alt="" draggable={false} />
        </div>

        <div className="portrait-igloo__rail-wrap">
          <Reveal shown={heroShown} index={3} className="portrait-igloo__rail">
            {THUMBS.map((id) => {
              const v = byId(id)
              return (
                <a
                  key={id}
                  className="portrait-igloo__thumb"
                  href="#portrait-works"
                  aria-label={v.cn}
                  title={v.cn}
                >
                  <img src={asset(v.poster)} alt={v.cn} loading="lazy" decoding="async" />
                </a>
              )
            })}
          </Reveal>
        </div>

        <div className="portrait-igloo__line-wrap">
          <Reveal shown={heroShown} index={7} className="portrait-igloo__line" />
        </div>

        <div className="portrait-igloo__caption-wrap">
          <Reveal shown={heroShown} index={8} className="portrait-igloo__caption">
            <p>
              AI 生成的竖屏短视频精选，探索 9:16 画幅里动态影像的更多可能。
            </p>
            <ChevronDown className="portrait-igloo__chev" size={16} strokeWidth={1.6} />
          </Reveal>
        </div>
      </div>

      {/* Section 2 · Selected Works */}
      <div className="portrait-igloo__view" id="portrait-works">
        <div className="portrait-igloo__view-inner">
          <div className="portrait-igloo__view-top">
            <div className="portrait-igloo__view-head">
              <Reveal shown={viewShown} index={0} className="portrait-igloo__view-title">
                <Letters text="SELECTED WORKS" justify="flex-start" />
              </Reveal>
              <Reveal shown={viewShown} index={0} className="portrait-igloo__view-rule" />
            </div>
            <Reveal shown={viewShown} index={1} className="portrait-igloo__view-sub">
              <p>
                竖屏视频 · 精选作品 —— 用 AI 完成创意、生成与后期，
                把想象力变成可交付的 9:16 影像。
              </p>
            </Reveal>
          </div>

          <div className="portrait-igloo__cards">
            {CARDS.map((id, i) => {
              const v = byId(id)
              return (
                <Reveal
                  key={id}
                  shown={viewShown}
                  index={2 + i}
                  className={`portrait-igloo__card${i === 2 ? ' portrait-igloo__card--last' : ''}`}
                >
                  <video
                    data-play="true"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={asset(v.poster)}
                  >
                    <source src={asset(v.file)} type="video/mp4" />
                  </video>
                  <span className="portrait-igloo__card-title">{v.cn}</span>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}