import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { asset } from '../lib/asset.js'
import LineSidebar from './LineSidebar.jsx'
import './PortraitShowcase.css'

const GOLD_EASE = [0.76, 0, 0.24, 1]

// 9 条竖屏视频作品（视频走 CDN，封面帧由站点自身提供）
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

const HERO_BG = VIDEOS[1] // hero 背景视频：灯影青舞（暗调电影感，适合白字）
const GEM = VIDEOS[0]     // gem 卡片视频：曜黑充电舱

// 分屏 hero 的标题内容（左黑右白，同一份渲染两次）
function HeroContent() {
  return (
    <div className="pt-hero__content">
      <div className="pt-hero__line">
        <motion.h1
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1.1, ease: GOLD_EASE }}
        >
          AI PORTRAIT
        </motion.h1>
      </div>
      <div className="pt-hero__line pt-hero__line--mb">
        <motion.h1
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1.1, delay: 0.08, ease: GOLD_EASE }}
        >
          VIDEOS
        </motion.h1>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.55, ease: GOLD_EASE }}
      >
        从产品特写、氛围短片到治愈动画，用 AI 把想象力变成可交付的 9:16 竖屏影像。
      </motion.p>
    </div>
  )
}

export default function PortraitShowcase() {
  const heroVideoRef = useRef(null)
  const [query, setQuery] = useState('')
  const [detail, setDetail] = useState(null)

  // 防御性自动播放：强制 muted 并在 loadeddata 后重播
  useEffect(() => {
    const v = heroVideoRef.current
    if (!v) return
    const play = () => {
      v.muted = true
      v.play().catch(() => {})
    }
    play()
    v.addEventListener('loadeddata', play)
    return () => v.removeEventListener('loadeddata', play)
  }, [])

  const filtered = useMemo(
    () => VIDEOS.filter((v) => (v.cn + v.en + v.tag).toLowerCase().includes(query.toLowerCase())),
    [query]
  )

  const goCards = () => {
    document.getElementById('portrait-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  const goToCard = (index) => {
    const works = document.getElementById('portrait-works')
    if (!works) return
    works.scrollIntoView({ behavior: 'smooth' })
    const track = works.querySelector('.pt-cards__track')
    const card = works.querySelectorAll('.pt-card')[index]
    if (track && card) {
      window.setTimeout(() => {
        const trackRect = track.getBoundingClientRect()
        const cardRect = card.getBoundingClientRect()
        const offset =
          cardRect.left - trackRect.left - (trackRect.width - cardRect.width) / 2
        track.scrollTo({ left: track.scrollLeft + offset, behavior: 'smooth' })
      }, 550)
    }
  }

  const closeDetail = () => {
    document.body.classList.remove('hide-site-nav')
    setDetail(null)
  }

  const openDetail = (v) => {
    document.body.classList.add('hide-site-nav')
    setDetail(v)
  }

  // 详情覆盖层（对应 TourDetailSection）
  const DetailOverlay = detail && (
    <div
      className="pt-detail"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDetail()
      }}
    >
      <div className="pt-detail__stage">
        <motion.div
          className="pt-detail__video-box"
          initial={{ scale: 1.02, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: GOLD_EASE }}
        >
          <video
            src={asset(detail.file)}
            poster={asset(detail.poster)}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="pt-detail__video"
          />
        </motion.div>
        <motion.div
          className="pt-detail__card"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: GOLD_EASE }}
        >
          <button className="pt-detail__back" type="button" onClick={closeDetail}>
            <ArrowLeft size={15} />
            返回
          </button>
          <h1>{detail.cn}</h1>
          <p className="pt-detail__en">{detail.en}</p>
          <p className="pt-detail__desc">{detail.desc}</p>
          <div className="pt-detail__meta">
            <span>{detail.tag}</span>
            <span>2026 · 竖屏 9:16</span>
          </div>
        </motion.div>
      </div>
    </div>
  )

  return (
    <section className="portrait-travel" id="portrait-showcase">
      {/* ===== Hero 分屏 ===== */}
      <div className="pt-hero">
        <div className="pt-hero__left" aria-hidden="true" />

        <div className="pt-hero__right">
          <div className="pt-hero__bg">
            <motion.div
              className="pt-hero__bg-inner"
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.2, ease: GOLD_EASE }}
            >
              <video
                ref={heroVideoRef}
                src={asset(HERO_BG.file)}
                poster={asset(HERO_BG.poster)}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="pt-hero__video"
              />
            </motion.div>
            <div className="pt-hero__shade" aria-hidden="true" />
            <div className="pt-hero__scrim-top" aria-hidden="true" />
          </div>

          <motion.div
            className="pt-gem"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.5, ease: GOLD_EASE }}
          >
            <div className="pt-gem__media">
              <video
                src={asset(GEM.file)}
                poster={asset(GEM.poster)}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="pt-gem__video"
              />
            </div>
            <div className="pt-gem__content">
              <div>
                <h3>精选作品</h3>
                <p>{GEM.cn} —— {GEM.desc}</p>
              </div>
              <button id="pt-explorebtn" type="button" className="pt-gem__btn" onClick={goCards}>
                查看全部 <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="pt-hero__sidebar">
          <LineSidebar
            items={VIDEOS.map((v) => v.cn)}
            accentColor="#8b5cf6"
            textColor="#55575d"
            markerColor="#9b9ba1"
            showIndex
            showMarker
            proximityRadius={90}
            maxShift={24}
            falloff="smooth"
            markerLength={44}
            tickScale={0.5}
            scaleTick
            itemGap={13}
            fontSize={0.82}
            smoothing={90}
            onItemClick={goToCard}
          />
        </div>

        <div className="pt-hero__text pt-hero__text--black">
          <HeroContent />
        </div>
        <div className="pt-hero__text pt-hero__text--white">
          <HeroContent />
        </div>
      </div>

      {/* ===== 作品列表（对应 DestinationsSection） ===== */}
      <div className="pt-cards" id="portrait-works">
        <div className="pt-cards__inner">
          <motion.input
            id="pt-search"
            placeholder="搜索你的作品"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: GOLD_EASE }}
          />
          <motion.p
            className="pt-cards__popular"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            POPULAR
          </motion.p>
          <div className="pt-cards__track">
            {filtered.length === 0 && (
              <p className="pt-cards__empty">没有找到 "{query}" 相关的作品</p>
            )}
            {filtered.map((v, i) => (
              <motion.div
                key={v.id}
                className="pt-card"
                style={{ width: 235, flexShrink: 0 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.55, ease: GOLD_EASE }}
              >
                <button type="button" className="pt-card__link" onClick={() => openDetail(v)}>
                  <div className="pt-card__media">
                    <video
                      src={`${asset(v.file)}#t=0.1`}
                      poster={asset(v.poster)}
                      muted
                      playsInline
                      preload="metadata"
                      className="pt-card__thumb"
                    />
                  </div>
                  <h3 className="pt-card__name">{v.cn}</h3>
                  <p className="pt-card__sub">{v.tag} · 2026</p>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {DetailOverlay}
    </section>
  )
}