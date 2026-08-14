import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { asset } from '../lib/asset.js'
import useInView from '../lib/useInView.js'

const PORTRAITS = [1, 2, 3, 4, 5].map((n) => ({
  file: `/works/ads/portrait/${String(n).padStart(2, '0')}.mp4`
}))

export default function PortraitShowcase() {
  const [active, setActive] = useState(0)
  const [sectionRef, inView] = useInView('0px 0px 600px 0px')

  const cur = PORTRAITS[active]
  const next = PORTRAITS[(active + 1) % PORTRAITS.length]
  const prev = PORTRAITS[(active - 1 + PORTRAITS.length) % PORTRAITS.length]

  const go = (dir) =>
    setActive((a) => (a + dir + PORTRAITS.length) % PORTRAITS.length)

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
    <section className="ember-ads vhs-page" id="portrait-showcase" ref={sectionRef}>
      <div className="vhs-page__glow" aria-hidden="true" />

      <div className="vhs-card">
        <AnimatePresence initial={false}>
          <motion.div
            key={active}
            className="vhs-card__media"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <video
              className="vhs-card__video"
              data-play="true"
              autoPlay
              muted
              loop
              playsInline
              preload={inView ? 'auto' : 'none'}
            >
              <source src={asset(cur.file)} type="video/mp4" />
            </video>
          </motion.div>
        </AnimatePresence>

        <div className="vhs-scanlines" aria-hidden="true" />
        <div className="vhs-noise" aria-hidden="true" />
        <div className="vhs-glitch-bar" aria-hidden="true" />
        <div className="vhs-card__vignette" aria-hidden="true" />
      </div>

      <div className="ember-ads__preload" aria-hidden="true">
        <video preload="auto" muted loop playsInline>
          <source src={asset(next.file)} type="video/mp4" />
        </video>
        <video preload="auto" muted loop playsInline>
          <source src={asset(prev.file)} type="video/mp4" />
        </video>
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
