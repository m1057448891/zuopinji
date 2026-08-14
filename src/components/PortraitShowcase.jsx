import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { asset } from '../lib/asset.js'
import useInViewNear from '../lib/useInView.js'

const FILES = [
  '01',
  '02',
  '03',
  '04',
  '05',
  'anim-01',
  'anim-03',
  'anim-05',
  'anim-08'
]

const VIDEOS = FILES.map((file, i) => {
  const no = String(i + 1).padStart(2, '0')
  return {
    id: i + 1,
    no,
    file: `/works/ads/portrait/${file}.mp4`,
    label: `AI MOTION ${no}`,
    text: 'AI 生成竖屏动效 · MOSATO SAKAI'
  }
})

const itemVar = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 16 }
  }
}

export default function PortraitShowcase() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [sectionRef, isNear] = useInViewNear('0px 0px 600px 0px')
  const revealRef = useRef(null)
  const inView = useInView(revealRef, { once: true, margin: '-100px' })

  const visible = [0, 1, 2].map((i) => VIDEOS[(current + i) % VIDEOS.length])
  const upcoming = VIDEOS[(current + 3) % VIDEOS.length]

  const go = (dir) => {
    setDirection(dir)
    setCurrent((c) => (c + dir + VIDEOS.length) % VIDEOS.length)
  }

  useEffect(() => {
    if (!isNear) return
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent((c) => (c + 1) % VIDEOS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isNear])

  useEffect(() => {
    const el = sectionRef.current
    const videos = el?.querySelectorAll('video[data-play="true"]')
    videos?.forEach((v) => {
      if (isNear) v.play().catch(() => {})
      else v.pause()
    })
  }, [current, isNear, sectionRef])

  return (
    <section className="flow-cards" id="portrait-showcase" ref={sectionRef}>
      <motion.div
        className="flow-cards__inner"
        ref={revealRef}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } }
        }}
      >
        <motion.header className="flow-cards__head" variants={itemVar}>
          <h2 className="flow-cards__title">AI MOTION</h2>
          <div className="flow-cards__nav">
            <button
              className="flow-cards__btn"
              type="button"
              aria-label="上一个视频"
              onClick={() => go(-1)}
            >
              <ChevronLeft size={20} strokeWidth={1.8} />
            </button>
            <button
              className="flow-cards__btn"
              type="button"
              aria-label="下一个视频"
              onClick={() => go(1)}
            >
              <ChevronRight size={20} strokeWidth={1.8} />
            </button>
          </div>
        </motion.header>

        <motion.div className="flow-cards__grid" variants={itemVar}>
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            {visible.map((item, idx) => (
              <motion.div
                key={`${item.id}-${current}-${idx}`}
                className="flow-card"
                custom={direction}
                initial={{
                  opacity: 0,
                  x: direction > 0 ? 100 : -100,
                  scale: 0.95
                }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? -100 : 100,
                  scale: 0.95
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.32, 0.72, 0, 1],
                  opacity: { duration: 0.5 }
                }}
              >
                <video
                  className="flow-card__bg"
                  data-play="true"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                >
                  <source src={asset(item.file)} type="video/mp4" />
                </video>
                <div className="flow-card__shade" aria-hidden="true" />
                <div className="flow-card__content">
                  <span className="flow-card__label">{item.label}</span>
                  <p className="flow-card__text">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <div className="ember-ads__preload" aria-hidden="true">
        <video preload="auto" muted loop playsInline>
          <source src={asset(upcoming.file)} type="video/mp4" />
        </video>
      </div>
    </section>
  )
}
