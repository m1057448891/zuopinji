import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { asset } from '../lib/asset.js'
import useInView from '../lib/useInView.js'
import { videoSources } from '../lib/videoSources.js'

const ADS = [
  { file: '/works/ads/showreel/commercial.mp4', portrait: false, no: '01', en: 'SELECTED TVC', cn: '品牌广告' },
  { file: '/works/ads/showreel/photography.mp4', portrait: false, no: '02', en: 'REALISTIC PHOTOGRAPHY', cn: '写实摄影' },
  { file: '/works/ads/product-03.mp4', portrait: false, no: '03', en: 'LIQUID PLAY GAMEPAD', cn: '幻彩手柄' },
  { file: '/works/ads/product-01.mp4', portrait: false, no: '04', en: 'AIR FLOW SNEAKER', cn: '运动鞋' },
  { file: '/works/ads/product-02.mp4', portrait: true, no: '05', en: 'OBSIDIAN TWS EARBUDS', cn: '降噪耳机' },
  { file: '/works/ads/showreel/macro.mp4', portrait: true, no: '06', en: 'MICRO WONDER', cn: '微距奇境' },
  { file: '/works/ads/showreel/necklace.mp4', portrait: false, no: '07', en: 'DAWN LIGHT NECKLACE', cn: '项链宣传' },
  { file: '/works/ads/showreel/tiger.mp4', portrait: false, no: '08', en: 'TIGER GENERAL', cn: '白虎武将' },
  { file: '/works/ads/showreel/cinematic.mp4', portrait: false, no: '09', en: 'CINEMATIC OPENING', cn: '电影开场' },
  { file: '/works/ads/showreel/playback.mp4', portrait: false, no: '10', en: 'EDITORIAL PLAYBACK', cn: '视频演示' }
]

const sourcesFor = (file) =>
  /product-\d+/.test(file)
    ? videoSources(file)
    : [{ src: asset(file), type: 'video/mp4' }]

export default function AdsShowcase() {
  const [active, setActive] = useState(0)
  const [sectionRef, inView] = useInView('0px 0px 600px 0px')

  const cur = ADS[active]
  const next = ADS[(active + 1) % ADS.length]
  const prev = ADS[(active - 1 + ADS.length) % ADS.length]

  const go = (dir) =>
    setActive((a) => (a + dir + ADS.length) % ADS.length)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const videos = section.querySelectorAll('video[data-play="true"]')
    videos.forEach((v) => {
      if (inView) {
        v.muted = true
        v.play().catch(() => {})
      } else {
        v.pause()
      }
    })
  }, [active, inView, sectionRef])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <section className="ember-ads" id="ads-showcase" ref={sectionRef}>
      <div className="ember-ads__stage" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.div
            key={`${active}-${cur.portrait ? 'p' : 'l'}`}
            className="ember-ads__slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {cur.portrait ? (
              <>
                <video
                  className="ember-ads__video ember-ads__video--mirror"
                  data-play="true"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={inView ? 'auto' : 'none'}
                >
                  {sourcesFor(cur.file).map((s) => (
                    <source key={s.src} src={s.src} type={s.type} />
                  ))}
                </video>
                <video
                  className="ember-ads__video ember-ads__video--right"
                  data-play="true"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={inView ? 'auto' : 'none'}
                >
                  {sourcesFor(cur.file).map((s) => (
                    <source key={s.src} src={s.src} type={s.type} />
                  ))}
                </video>
              </>
            ) : (
              <video
                className="ember-ads__video"
                data-play="true"
                autoPlay
                muted
                loop
                playsInline
                preload={inView ? 'auto' : 'none'}
              >
                {sourcesFor(cur.file).map((s) => (
                  <source key={s.src} src={s.src} type={s.type} />
                ))}
              </video>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="ember-ads__preload" aria-hidden="true">
        <video preload="auto" muted loop playsInline>
          {sourcesFor(next.file).map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
        <video preload="auto" muted loop playsInline>
          {sourcesFor(prev.file).map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      </div>

      <div className="ember-ads__panel">
        <div className="ember-ads__left">
          <svg className="ember-ads__svg" aria-hidden="true">
            <defs>
              <mask
                id="adsGlassMask"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="100%"
                height="100%"
              >
                <rect width="100%" height="100%" fill="white" />
                <text
                  className="ember-ads__cut"
                  x="9%"
                  y="52%"
                  textLength="82%"
                  lengthAdjust="spacingAndGlyphs"
                  fill="black"
                >
                  MOSATO
                </text>
              </mask>
            </defs>
          </svg>
          <div className="ember-ads__blur" />
          <div className="ember-ads__left-inner">
            <div className="ember-ads__top">
              <span className="ember-ads__eyebrow">
                MOSATO SAKAI — 马中帅
              </span>
              <h2 className="ember-ads__heading">
                商业广告<em>精选作品</em>
              </h2>
              <span className="ember-ads__sub">SELECTED COMMERCIALS</span>
            </div>
            <div className="ember-ads__spacer" aria-hidden="true" />
            <div className="ember-ads__bottom">
              <div className="ember-ads__rule" aria-hidden="true" />
              <p className="ember-ads__intro">
                AI 视觉 × 创意制作 — 横屏全屏沉浸，竖屏半屏展示，点击两侧箭头切换素材。
              </p>
              <div className="ember-ads__meta mono">
                <span>NO.{cur.no} / {String(ADS.length).padStart(2, '0')}</span>
                <span>{cur.en}</span>
                <span>{cur.cn}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ember-ads__right">
          <div className="ember-ads__right-title">
            COMMERCIAL
            <span>SHOWREEL — 2024 / 2026</span>
          </div>
        </div>
      </div>

      <button
        className="ember-ads__nav ember-ads__nav--prev"
        type="button"
        aria-label="上一个视频"
        onClick={() => go(-1)}
      >
        <ChevronLeft size={22} strokeWidth={1.6} />
      </button>
      <button
        className="ember-ads__nav ember-ads__nav--next"
        type="button"
        aria-label="下一个视频"
        onClick={() => go(1)}
      >
        <ChevronRight size={22} strokeWidth={1.6} />
      </button>
    </section>
  )
}
