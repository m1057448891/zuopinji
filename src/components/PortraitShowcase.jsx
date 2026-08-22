import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'
import { asset } from '../lib/asset.js'
import LineSidebar from './LineSidebar.jsx'
import PixelCard from './PixelCard.jsx'
import './PortraitShowcase.css'

const GOLD_EASE = [0.76, 0, 0.24, 1]

// 9 条竖屏视频作品（视频走 CDN，封面帧由站点自身提供）
const VIDEOS = [
  { id: '01', file: '/works/ads/portrait/01.mp4', poster: '/videos/portrait/01-poster.jpg', cn: '蓝牙耳机', en: 'DARK CHARGE CASE', tag: 'PRODUCT FILM', desc: '无线耳机充电舱的暗调特写，冷光与倒影勾勒极简科技质感。' },
  { id: '02', file: '/works/ads/portrait/02.mp4', poster: '/videos/portrait/02-poster.jpg', cn: '灯影傩舞', en: 'TEAL DANCE IN LANTERN LIGHT', tag: 'AI SHORT FILM', desc: '夜色古巷中的青纱舞者，暖黄灯笼光晕与民族风头饰交织成电影感画面。' },
  { id: '03', file: '/works/ads/portrait/03.mp4', poster: '/videos/portrait/03-poster.jpg', cn: '落日咖啡', en: 'SWEET LANDING', tag: 'MACRO FILM', desc: '方糖立于绵密奶泡之上的微距特写，crema 与热气营造治愈氛围。' },
  { id: '04', file: '/works/ads/portrait/04.mp4', poster: '/videos/portrait/04-poster.jpg', cn: '傲娇小鸡', en: 'PET THE GRUMPY CHICK', tag: 'GAME ANIMATION', desc: '牛皮纸涂鸦风的休闲游戏动画，爱心血条与进度条充满治愈趣味。' },
  { id: '05', file: '/works/ads/portrait/05.mp4', poster: '/videos/portrait/05-poster.jpg', cn: '二维雨林', en: 'EMERALD DROP INTO THE PALM', tag: 'NATURE LOOP', desc: '荧光绿露珠自叶尖垂落掌心，雨后微光里安静的生命力。' },
  { id: 'anim-01', file: '/works/ads/portrait/anim-01.mp4', poster: '/videos/portrait/anim-01-poster.jpg', cn: '花海灯塔', en: 'LIGHTHOUSE IN BLOOM', tag: 'AI SHORT FILM', desc: '红白灯塔被花海簇拥，蝴蝶翩跹、暖光如翼，梦幻而治愈。' },
  { id: 'anim-03', file: '/works/ads/portrait/anim-03.mp4', poster: '/videos/portrait/anim-03-poster.jpg', cn: '电子圣母', en: 'DIGITAL PIETÀ', tag: 'NEON · GLITCH', desc: '大理石圣像与霓虹数据流同框，古典静谧与赛博崩坏强烈对冲。' },
  { id: 'anim-05', file: '/works/ads/portrait/anim-05.mp4', poster: '/videos/portrait/anim-05-poster.jpg', cn: '玫瑰纪行', en: 'ROSES ALONG THE RAILS', tag: 'RETRO FILM', desc: '复古红列车窗边的长发女孩，玫瑰沿轨道盛放，胶片感的浪漫旅途。' },
  { id: 'anim-08', file: '/works/ads/portrait/anim-08.mp4', poster: '/videos/portrait/anim-08-poster.jpg', cn: '花雨秋千', en: 'SWING BENEATH THE BLOSSOMS', tag: 'AI SHORT FILM', desc: '樱花纷飞如雨，秋千悬于树荫之间，一帧春色。' }
]

const N = VIDEOS.length
const THUMB_H = 160
const THUMB_GAP = 10
const STEP = THUMB_H + THUMB_GAP // 132
const VISIBLE = 5

// 分屏 hero 的标题内容（左磨砂右纯白，同一份渲染两次）
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
        从产品特写、氛围短片到治愈动画，用AI把想象力变成可交付的影像。
      </motion.p>
    </div>
  )
}

export default function PortraitShowcase() {
  const [active, setActive] = useState(0)
  const videoRef = useRef(null)

  const select = (i) => setActive(Math.max(0, Math.min(N - 1, i)))
  const prev = () => select(active - 1)
  const next = () => select(active + 1)

  // 缩略图列表滚动偏移：让当前项大致居中
  const maxOffset = Math.max(0, (N - VISIBLE) * STEP)
  const thumbOffset = Math.max(0, Math.min(maxOffset, active * STEP - Math.floor(VISIBLE / 2) * STEP))

  // 切换视频后确保自动播放
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    v.play().catch(() => {})
  }, [active])

  const cur = VIDEOS[active]

  return (
    <section className="portrait-travel" id="portrait-showcase">
      <div className="pt-hero">
        {/* ===== 左半：缩略图卡片 + 行边栏 ===== */}
        <div className="pt-hero__left">
          <div className="pt-left-cluster">
            <div className="pt-thumbs">
            <button className="pt-thumbs__arrow" type="button" aria-label="上一个视频" onClick={prev}>
              <ChevronUp size={15} />
            </button>
            <div className="pt-thumbs__viewport">
              <div className="pt-thumbs__list" style={{ transform: `translateY(-${thumbOffset}px)` }}>
                {VIDEOS.map((v, i) => (
                  <PixelCard
                    key={v.id}
                    variant="default"
                    colors="#c4b5fd,#a78bfa,#8b5cf6"
                    gap={6}
                    speed={45}
                    noFocus
                    className={`pt-thumb ${i === active ? 'is-active' : ''}`}
                    onClick={() => select(i)}
                  >
                    <img src={asset(v.poster)} alt={v.cn} loading="lazy" />
                    <span className="pt-thumb__label">{v.cn}</span>
                  </PixelCard>
                ))}
              </div>
            </div>
            <button className="pt-thumbs__arrow" type="button" aria-label="下一个视频" onClick={next}>
              <ChevronDown size={15} />
            </button>
          </div>

            <div className="pt-hero__sidebar">
              <LineSidebar
              items={VIDEOS.map((v) => v.cn)}
              accentColor="#8b5cf6"
              textColor="#d6d6de"
              markerColor="#8a8a94"
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
              defaultActive={0}
              externalActive={active}
                onItemClick={(index) => select(index)}
              />
            </div>
          </div>
        </div>

        {/* ===== 右半：播放对应视频 ===== */}
        <div className="pt-hero__right">
          <div className="pt-hero__bg">
            <video
              key={active}
              ref={videoRef}
              src={asset(cur.file)}
              poster={asset(cur.poster)}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="pt-hero__video"
            />
            <div className="pt-hero__shade" aria-hidden="true" />
            <div className="pt-hero__scrim-top" aria-hidden="true" />
            <div className="pt-hero__fade-bottom" aria-hidden="true" />
          </div>
          <div className="pt-hero__meta">
            <span className="mono pt-hero__meta-index">
              {String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
            </span>
            <h3 className="pt-hero__meta-cn">{cur.cn}</h3>
            <p className="pt-hero__meta-en">{cur.en}</p>
          </div>
        </div>

        {/* ===== 左右页面边缘磨砂箭头 ===== */}
        <button className="pt-page-arrow pt-page-arrow--left" type="button" aria-label="上一个视频" onClick={prev}>
          <ChevronLeft size={20} />
        </button>
        <button className="pt-page-arrow pt-page-arrow--right" type="button" aria-label="下一个视频" onClick={next}>
          <ChevronRight size={20} />
        </button>

        {/* ===== 分屏标题（左磨砂 / 右纯白） ===== */}
        <div className="pt-hero__text pt-hero__text--black">
          <HeroContent />
        </div>
        <div className="pt-hero__text pt-hero__text--white">
          <HeroContent />
        </div>
      </div>
    </section>
  )
}



