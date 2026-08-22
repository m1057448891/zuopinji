import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '../lib/asset.js'
import FoldText from './FoldText.jsx'
import './ToolsShowcase.css'
import GradientWaves from './GradientWaves.jsx'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  {
    no: '01',
    category: 'COVER DESIGN',
    name: '短视频封面生成工具',
    en: 'THUMBNAIL GENERATOR',
    desc: '输入视频标题与风格关键词，AI 提炼候选标题，生成蓝橙双版 3D 封面，直接用于发布。',
    metrics: ['2 VERSIONS', '3 MIN', 'CTR +40%'],
    poster: '/tools/poster-thumbnail.jpg'
  },
  {
    no: '02',
    category: 'CONTENT WRITING',
    name: 'AI 文案生成工具',
    en: 'AI COPYWRITER',
    desc: '按爆款结构一次完成标题候选、开头钩子、分层正文与结尾引导，自动脱敏后可直接发布。',
    metrics: ['5 TITLES', '1 DRAFT', 'READY 2 PUBLISH'],
    poster: '/tools/poster-copywriter.jpg'
  },
  {
    no: '03',
    category: 'MUSIC CURATION',
    name: '免费音乐合集生成工具',
    en: 'MUSIC COLLECTION',
    desc: '指定音乐风格，AI 规划合集并逐曲筛选免费可试听版本，附收听链接一键使用。',
    metrics: ['10+ TRACKS', 'FREE', '1 CLICK'],
    poster: '/tools/poster-music.jpg'
  },
  {
    no: '04',
    category: 'FACT CHECKING',
    name: '热点真伪辨别工具',
    en: 'FACT CHECK',
    desc: '提取热点消息核心论断，多源交叉查证并判定真伪等级，输出可公开引用的辟谣内容。',
    metrics: ['3+ SOURCES', '5 MIN', 'VERIFIED'],
    poster: '/tools/poster-factcheck.jpg'
  },
  {
    no: '05',
    category: 'TRANSCRIPTION',
    name: '视频字幕提取工具',
    en: 'SUBTITLE EXTRACTOR',
    desc: '自动提取或转写视频字幕，输出 SRT / VTT / 逐字稿多种格式，带时间戳直接使用。',
    metrics: ['SRT / VTT', 'WHISPER', '1 CLICK'],
    poster: '/tools/poster-subtitle.jpg'
  }
]

const N = ITEMS.length

export default function ToolsShowcase() {
  const scopeRef = useRef(null)
  const runwayRef = useRef(null)
  const triggerRef = useRef(null)
  const stickyRef = useRef(null)
const [active, setActive] = useState(0)
      const activeRef = useRef(0)
  activeRef.current = active

  useLayoutEffect(() => {
    const runway = runwayRef.current
    if (!runway) return

    const st = ScrollTrigger.create({
      trigger: runway,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        runway.style.setProperty('--accord-p', p.toFixed(4))
        setActive(Math.max(0, Math.min(N - 1, Math.round(p * (N - 1)))))
      }
    })
    triggerRef.current = st
    runway.style.setProperty('--accord-p', '0')

    return () => st.kill()
  }, [])


  // 滚轮步进：鼠标在手风琴区域内滚轮一次切到下一张/上一张
  // 用 capture 阶段监听，抢在 Lenis 之前拦截滚轮，避免页面滚动与切换冲突
  useEffect(() => {
    let lockUntil = 0
    const onWheel = (e) => {
      const sticky = stickyRef.current
      const st = triggerRef.current
      const lenis = window.__lenis
      if (!sticky || !st) return
      const abs = Math.abs(e.deltaY)
      if (abs < 5 || abs > 500) return
      // 仅在手风琴可见区域内拦截滚轮
      const r = sticky.getBoundingClientRect()
      if (e.clientY < r.top || e.clientY > r.bottom) return
      const now = performance.now()
      if (now < lockUntil) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }
      const dir = e.deltaY > 0 ? 1 : -1
      const cur = activeRef.current
      const next = Math.max(0, Math.min(N - 1, cur + dir))
      if (next === cur) return
      e.preventDefault()
      e.stopImmediatePropagation()
      lockUntil = now + 1000
      const y = st.start + (next / (N - 1)) * (st.end - st.start)
      if (lenis) lenis.scrollTo(y, { duration: 1.0 })
      else window.scrollTo({ top: y, behavior: 'smooth' })
    }
    window.addEventListener('wheel', onWheel, { passive: false, capture: true })
    return () => window.removeEventListener('wheel', onWheel, { capture: true })
  }, [])

  const goTo = (i) => {
    const st = triggerRef.current
    const lenis = window.__lenis
    if (!st) return
    const y = st.start + (i / (N - 1)) * (st.end - st.start)
    if (lenis) lenis.scrollTo(y, { duration: 1.2 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section className="projects tools-grid" id="tools-showcase" ref={scopeRef}>
      <GradientWaves
        className="tools-waves"
        horizonColor="#5227FF"
        waveColor="#FF9FFC"
        crestColor="#FFFFFF"
        speed={0.35}
        amplitude={3}
        waveScale={0.6}
        waveRatio={0.9}
        swell={35}
        turbulence={20}
        tilt={1.11}
        zoom={1.0}
        height={5.5}
        fogDepth={26}
        detail="medium"
        brightness={1}
        opacity={1}
        mouseInteraction
        parallaxStrength={0.5}
        grain={false}
      />
      <div className="container projects__head">
        <span className="mono projects__kicker">SKILL BUILD / Skill搭建</span>
        <h2 className="projects__heading projects__heading--fold">
          <FoldText
            text="SKILL BUILD"
            splitBy="char"
            hinge="top"
            trigger="scroll"
            duration={0.65}
            stagger={0.045}
            ease="power3.out"
            perspective={700}
            creaseShading={0.55}
            fontSize="clamp(2.6rem, 9vw, 120px)"
            fontWeight={900}
            color="#d7e2ea"
          />
        </h2>
        <p className="mono projects__sub">FIVE AI SKILLS · ONE WORKFLOW</p>
      </div>

      <div className="tools-accordion" ref={runwayRef}>
        <div className="tools-accordion__sticky" ref={stickyRef}>
          <div className="tools-accordion__inner">
            {/* 左侧特性导航（圆点 + 标签，激活右移 2px） */}
            <nav className="tg-nav mono" aria-label="技能导航">
              {ITEMS.map((item, i) => (
                <button
                  key={item.no}
                  type="button"
                  className={`tg-nav__item ${i === active ? 'tg-nav__item--active' : ''}`}
                  onClick={() => goTo(i)}
                >
                  <span className="tg-nav__dot" aria-hidden="true" />
                  <span className="tg-nav__label">{item.category}</span>
                </button>
              ))}
            </nav>

            {/* 右侧堆叠：旧卡折叠成顶部条带，当前卡完整显示 */}
            <div className="tg-stack">
              {ITEMS.map((item, i) => (
                <article
                  key={item.no}
                  className="tg-card" data-no={item.no}
                  style={{ '--i': i, zIndex: N - i }}
                >
                  <div className="tg-card__head mono">
                    <span className="tg-card__head-no">{item.no}</span>
                    <span className="tg-card__head-cat">{item.category}</span>
                    <span className="tg-card__head-idx">
                      {String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="tg-card__body">
                    <div className="tg-card__copy">
                      <span className="tg-card__eyebrow mono">{item.category}</span>
                      <h3 className="tg-card__title">{item.en}</h3>
                      <p className="tg-card__cn">{item.name}</p>
                      <p className="tg-card__desc">{item.desc}</p>
                      <div className="tg-card__metrics">
                        {item.metrics.map((m) => (
                          <span className="mono" key={m}>
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="tg-card__visual">
                      <div className="tg-visual__glow" aria-hidden="true" />
                      <img className="tg-card__poster" src={asset(item.poster)} alt={item.name} loading="lazy" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}




