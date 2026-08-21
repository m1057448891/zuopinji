import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'motion/react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { asset } from '../lib/asset.js'
import useInViewNear from '../lib/useInView.js'
import './PortraitShowcase.css'

// 9 条竖屏视频作品（视频文件走 CDN，封面帧由站点自身提供）
const VIDEOS = [
  { id: '01', file: '/works/ads/portrait/01.mp4', poster: '/videos/portrait/01-poster.jpg', cn: '曜黑充电舱', en: 'DARK CHARGE CASE', tag: 'PRODUCT FILM', desc: '无线耳机充电舱的暗调特写，冷光与倒影勾勒极简科技质感。' },
  { id: '02', file: '/works/ads/portrait/02.mp4', poster: '/videos/portrait/02-poster.jpg', cn: '灯影青舞', en: 'TEAL DANCE IN LANTERN LIGHT', tag: 'AI SHORT FILM', desc: '夜色古巷中的青纱舞者，暖黄灯笼光晕与民族风头饰交织成电影感画面。' },
  { id: '03', file: '/works/ads/portrait/03.mp4', poster: '/videos/portrait/03-poster.jpg', cn: '方糖的温柔坠落', en: 'SWEET LANDING', tag: 'MACRO FILM', desc: '方糖立于绵密奶泡之上的微距特写，crema 与热气营造治愈氛围。' },
  { id: '04', file: '/works/ads/portrait/04.mp4', poster: '/videos/portrait/04-poster.jpg', cn: '傲娇小鸡摸摸头', en: 'PET THE GRUMPY CHICK', tag: 'GAME ANIMATION', desc: '牛皮纸涂鸦风的休闲游戏动画，爱心血条与进度条充满治愈趣味。' },
  { id: '05', file: '/works/ads/portrait/05.mp4', poster: '/videos/portrait/05-poster.jpg', cn: '翠滴入掌', en: 'EMERALD DROP INTO THE PALM', tag: 'NATURE LOOP', desc: '荧光绿露珠自叶尖垂落掌心，雨后微光里安静的生命力。' },
  { id: 'anim-01', file: '/works/ads/portrait/anim-01.mp4', poster: '/videos/portrait/anim-01-poster.jpg', cn: '花海灯塔', en: 'LIGHTHOUSE IN BLOOM', tag: 'AI SHORT FILM', desc: '红白灯塔被花海簇拥，蝴蝶翩跹、暖光如翼，梦幻而治愈。' },
  { id: 'anim-03', file: '/works/ads/portrait/anim-03.mp4', poster: '/videos/portrait/anim-03-poster.jpg', cn: '电子圣殇', en: 'DIGITAL PIETÀ', tag: 'NEON · GLITCH', desc: '大理石圣像与霓虹数据流同框，古典静谧与赛博崩坏强烈对冲。' },
  { id: 'anim-05', file: '/works/ads/portrait/anim-05.mp4', poster: '/videos/portrait/anim-05-poster.jpg', cn: '车窗玫瑰纪行', en: 'ROSES ALONG THE RAILS', tag: 'RETRO FILM', desc: '复古红列车窗边的长发女孩，玫瑰沿轨道盛放，胶片感的浪漫旅途。' },
  { id: 'anim-08', file: '/works/ads/portrait/anim-08.mp4', poster: '/videos/portrait/anim-08-poster.jpg', cn: '花雨秋千', en: 'SWING BENEATH THE BLOSSOMS', tag: 'AI SHORT FILM', desc: '樱花纷飞如雨，秋千悬于树荫之间，一帧春色。' }
]

// 左侧缩略图（前 4 条，可点击切换 hero 背景视频）
const RAIL = ['01', '02', '03', 'anim-03']
const byId = (id) => VIDEOS.find((v) => v.id === id)

// 逐字母上拉动画
function Letters({ text, className = '', justify = 'center' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <span ref={ref} className={`plu ${className}`} style={{ justifyContent: justify }}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={`${i}-${ch}`}
          className="plu__char"
          initial={{ y: 24, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </span>
  )
}

// 滚动驱动背景/冰山缩放
function useScrollZoom(refs, maxScale = 0.12) {
  const list = Array.isArray(refs) ? refs : [refs]
  useEffect(() => {
    const els = list.map((r) => r.current).filter(Boolean)
    if (!els.length) return
    let raf = 0
    const update = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1)
      const t = `scale(${1 + progress * maxScale})`
      els.forEach((el) => {
        el.style.transform = t
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export default function PortraitShowcase() {
  const sectionRef = useRef(null)
  const bgRef = useRef(null)
  const iceRef = useRef(null)
  const [sectionRefNear, isNear] = useInViewNear('0px 0px 500px 0px')
  const setSectionRef = useCallback(
    (el) => {
      sectionRef.current = el
      sectionRefNear.current = el
    },
    [sectionRefNear]
  )
  const [bgId, setBgId] = useState('01')
  const [start, setStart] = useState(0)
  const [direction, setDirection] = useState(1)

  useScrollZoom([bgRef, iceRef])

  const bg = byId(bgId)
  const visible = [0, 1, 2].map((i) => VIDEOS[(start + i) % VIDEOS.length])

  const go = (dir) => {
    setDirection(dir)
    setStart((s) => (s + dir + VIDEOS.length) % VIDEOS.length)
  }

  // 卡片视频：进入视口自动播放，离开暂停
  useEffect(() => {
    const el = sectionRef.current
    const videos = el?.querySelectorAll('video[data-play="true"]')
    videos?.forEach((v) => {
      if (isNear) {
        v.muted = true
        v.play().catch(() => {})
      } else {
        v.pause()
      }
    })
  }, [start, isNear, sectionRef])

  // 自动轮播
  useEffect(() => {
    if (!isNear) return
    const t = setInterval(() => {
      setDirection(1)
      setStart((s) => (s + 1) % VIDEOS.length)
    }, 6500)
    return () => clearInterval(t)
  }, [isNear])

  const viewReveal = {
    hidden: {},
    show: { transition: { staggerChildren: 0.16, delayChildren: 0.08 } }
  }
  const viewItem = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  }

  return (
    <section className="portrait-igloo" id="portrait-showcase" ref={setSectionRef}>
      {/* Section 1 · Hero */}
      <div className="portrait-igloo__hero">
        <div className="portrait-igloo__bg" ref={bgRef} aria-hidden="true">
          <AnimatePresence mode="sync" initial={false}>
            <motion.video
              key={bg.id}
              src={asset(bg.file)}
              poster={asset(bg.poster)}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatePresence>
        </div>
        <div className="portrait-igloo__scrim" aria-hidden="true" />
        <div className="portrait-igloo__grain" aria-hidden="true" />

        <p className="portrait-igloo__eyebrow mono">MOSATO SAKAI — 竖屏视频 · AI 动态影像</p>

        <div className="portrait-igloo__wordmark" aria-hidden="true">
          <Letters text="PORTRAIT" />
        </div>

        {/* 冰山剪影：盖在字标之上、所有 UI 之下，与背景同步缩放 */}
        <img
          className="portrait-igloo__iceberg"
          ref={iceRef}
          src={asset('/assets/igloo/iceberg.webp')}
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        {/* 左侧缩略图 */}
        <motion.div
          className="portrait-igloo__rail"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {RAIL.map((id) => {
            const v = byId(id)
            return (
              <button
                key={id}
                type="button"
                className={`portrait-igloo__thumb${bgId === id ? ' is-active' : ''}`}
                onClick={() => setBgId(id)}
                aria-label={`播放 ${v.cn}`}
                title={v.cn}
              >
                <img src={asset(v.poster)} alt={v.cn} loading="lazy" decoding="async" />
              </button>
            )
          })}
        </motion.div>

        {/* 右侧滚动线 */}
        <motion.div
          className="portrait-igloo__line"
          aria-hidden="true"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* 底部说明 */}
        <motion.div
          className="portrait-igloo__caption"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p>
            AI 生成的竖屏短视频精选 —— 从产品特写、氛围短片到治愈动画，
            探索动态影像在 9:16 画幅里的更多可能。
          </p>
          <ChevronDown className="portrait-igloo__chev" size={16} strokeWidth={1.6} />
        </motion.div>
      </div>

      {/* Section 2 · Selected Works */}
      <div className="portrait-igloo__view">
        <motion.div
          className="portrait-igloo__view-inner"
          variants={viewReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.div className="portrait-igloo__view-head" variants={viewItem}>
            <div className="portrait-igloo__view-top">
              <h2 className="portrait-igloo__view-title">
                <Letters text="SELECTED WORKS" justify="flex-start" />
              </h2>
              <div className="portrait-igloo__view-rule" aria-hidden="true" />
            </div>
            <p className="portrait-igloo__view-sub">
              竖屏视频 · 精选作品 —— 用 AI 完成创意、生成与后期，
              把想象力变成可交付的 9:16 影像。
            </p>
          </motion.div>

          <motion.div variants={viewItem}>
            <div className="portrait-igloo__cards">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                {visible.map((item) => (
                  <motion.div
                    key={item.id}
                    className="portrait-igloo__card"
                    custom={direction}
                    initial={{ opacity: 0, x: direction > 0 ? 48 : -48, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: direction > 0 ? -48 : 48, scale: 0.97 }}
                    transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
                  >
                    <video
                      data-play="true"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster={asset(item.poster)}
                    >
                      <source src={asset(item.file)} type="video/mp4" />
                    </video>
                    <div className="portrait-igloo__card-shade" aria-hidden="true" />
                    <div className="portrait-igloo__card-info">
                      <span className="portrait-igloo__card-tag">{item.tag}</span>
                      <span className="portrait-igloo__card-cn">{item.cn}</span>
                      <span className="portrait-igloo__card-en">{item.en}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div className="portrait-igloo__nav" variants={viewItem}>
            <button
              type="button"
              className="portrait-igloo__btn"
              aria-label="上一个视频"
              onClick={() => go(-1)}
            >
              <ChevronLeft size={20} strokeWidth={1.8} />
            </button>
            <span className="portrait-igloo__counter">
              {String(start + 1).padStart(2, '0')} / {String(VIDEOS.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              className="portrait-igloo__btn"
              aria-label="下一个视频"
              onClick={() => go(1)}
            >
              <ChevronRight size={20} strokeWidth={1.8} />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
