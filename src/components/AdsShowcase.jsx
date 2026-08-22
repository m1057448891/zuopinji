import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { asset } from '../lib/asset.js'
import useInView from '../lib/useInView.js'

const ORDER = ['01', '02', '03', '04']

const ADS = ORDER.map((file, i) => {
  const no = String(i + 1).padStart(2, '0')
  return {
    file: `/works/shorts/${file}.mp4`,
    no,
    en: `AI SHORTS ${no}`,
    cn: `创意短片 ${no}`
  }
})

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
  // 首页缩略图点击后跳转到这里播放对应视频
  useEffect(() => {
    const onPlay = (e) => {
      const file = e.detail?.file
      const idx = ADS.findIndex((a) => a.file === file)
      if (idx < 0) return
      setActive(idx)
    }
    window.addEventListener('shorts:play', onPlay)
    return () => window.removeEventListener('shorts:play', onPlay)
  }, [])

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
            key={active}
            className="ember-ads__slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <video
              className="ember-ads__video"
              data-play="true"
              autoPlay
              muted
              loop
              playsInline
              preload={inView ? 'auto' : 'none'}
              poster={asset(`/videos/shorts/${cur.no}-poster.jpg`)}
            >
              <source src={asset(cur.file)} type="video/mp4" />
            </video>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="ember-ads__preload" aria-hidden="true">
        <video preload={inView ? 'auto' : 'none'} muted loop playsInline>
          <source src={asset(next.file)} type="video/mp4" />
        </video>
        <video preload={inView ? 'auto' : 'none'} muted loop playsInline>
          <source src={asset(prev.file)} type="video/mp4" />
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
                创意短片<em>精选作品</em>
              </h2>
              <span className="ember-ads__sub">SELECTED CREATIVE SHORTS</span>
            </div>
            <div className="ember-ads__spacer" aria-hidden="true" />
            <div className="ember-ads__bottom">
              <div className="ember-ads__rule" aria-hidden="true" />
              <p className="ember-ads__intro">
                AI 短片精选 — 点击两侧箭头切换。
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
            CREATIVE SHORTS
            <span>SHOWREEL — AI SHORTS</span>
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
