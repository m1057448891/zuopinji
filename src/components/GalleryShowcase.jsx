import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '../lib/asset.js'

gsap.registerPlugin(ScrollTrigger)

// —— 素材层：8 张方形卡片，每张对应一个关键词与作品 ——
const CARDS = [
  { no: '01', cn: '深空漫游', en: 'Spatial', img: '/works/img/img-015.webp' },
  { no: '02', cn: '雾霭新生', en: 'Vision', img: '/works/img/img-023.webp' },
  { no: '03', cn: '软糖小屋', en: 'Texture', img: '/works/img/img-013.webp' },
  { no: '04', cn: '风影席卷', en: 'Motion', img: '/works/img/img-018.webp' },
  { no: '05', cn: '冷白逆光', en: 'Light', img: '/works/img/img-021.webp' },
  { no: '06', cn: '透明机能', en: 'Form', img: '/works/img/img-011.webp' },
  { no: '07', cn: '刃光惊鸿', en: 'Color', img: '/works/img/img-009.webp' },
  { no: '08', cn: '草甸低云', en: 'System', img: '/works/img/img-016.webp' }
]
const N = CARDS.length
const R = 236
const SPACING = 158

const smooth = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
const clamp01 = (v) => Math.min(1, Math.max(0, v))

export default function GalleryShowcase() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const cardsRef = useRef([])
  const idxRef = useRef(0)
  const [index, setIndex] = useState(0)
  const [layer, setLayer] = useState(false)
  const [notes, setNotes] = useState(true)

  const cur = CARDS[index]

  useLayoutEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const cards = cardsRef.current
    if (!section || !stage || !cards.length) return

    const vw = () => stage.clientWidth
    const vh = () => stage.clientHeight

    const circleXY = (i, w, h) => {
      const a = (i / N) * Math.PI * 2 - Math.PI / 2
      return { x: w / 2 + Math.cos(a) * R, y: h / 2 + Math.sin(a) * R * 0.72 }
    }
    const stripXY = (i, w, h) => ({ x: w / 2 + (i - (N - 1) / 2) * SPACING, y: h / 2 + 30 })

    const ctx = gsap.context(() => {
      // 入场：四角汇聚 → 直线 → 圆环（一次）
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: section, start: 'top 82%', once: true }
      })
      tl.fromTo(
        cards,
        {
          opacity: 0,
          scale: 0.3,
          x: (i) => (i % 2 ? -1 : 1) * vw() * 0.62,
          y: (i) => (i % 2 ? 1 : -1) * vh() * 0.52,
          rotation: (i) => (i % 2 ? 28 : -28)
        },
        {
          opacity: 1,
          scale: 1,
          x: (i) => vw() / 2 + (i - (N - 1) / 2) * SPACING,
          y: (i) => vh() / 2 + 30,
          rotation: 0,
          stagger: 0.05,
          duration: 1.0
        },
        0
      )
        .to(
          cards,
          {
            x: (i) => circleXY(i, vw(), vh()).x,
            y: (i) => circleXY(i, vw(), vh()).y,
            rotation: (i) => i * 14 - 50,
            duration: 1.0,
            ease: 'power2.inOut',
            stagger: 0.045
          },
          0.8
        )

      // 滚动：圆环 → 长卷 → 收拢为菱形智能层
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress
          const w = vw()
          const h = vh()
          const stripE = smooth(clamp01(p / 0.7))
          const collapseE = smooth(clamp01((p - 0.74) / 0.26))
          const idx = Math.min(N - 1, Math.max(0, Math.round(p * (N - 1))))

          if (idx !== idxRef.current) {
            idxRef.current = idx
            setIndex(idx)
          }
          const nextLayer = p > 0.74
          setLayer(nextLayer)

          cards.forEach((el, i) => {
            const c = circleXY(i, w, h)
            const s = stripXY(i, w, h)
            const off = i - idx
            const x = c.x + (s.x - c.x) * stripE
            const y = c.y + (s.y - c.y) * stripE
            const rot = (1 - stripE) * (i * 14 - 50) + stripE * off * 8
            const scale = stripE > 0 ? (i === idx ? 1 : 0.82) : 1
            const opacity = stripE > 0 ? (i === idx ? 1 : 0.42) : 1
            const blur = stripE > 0 ? (i === idx ? 0 : 3) : 0

            gsap.set(el, {
              x: x + (w / 2 - x) * collapseE,
              y: y + (h / 2 - y) * collapseE,
              rotation: rot * (1 - collapseE),
              scale: scale * (1 - collapseE * 0.86),
              opacity: opacity * (1 - collapseE),
              filter: `blur(${blur * (1 - collapseE * 0.5)}px)`,
              zIndex: i === idx ? 5 : 1
            })
          })

          gsap.set('.proto__diamond', { scale: 0.4 + collapseE * 0.6, opacity: collapseE })
          gsap.set('.proto__headline', { opacity: 1 - p * 4, y: -p * 80 })
          gsap.set('.proto__fill', { opacity: collapseE })
        }
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section className="proto" id="gallery-showcase" ref={sectionRef}>
      <div className={`proto__stage${layer ? ' is-layer' : ''}`} ref={stageRef}>
        {/* L1 背景层 */}
        <div className="proto__fill" aria-hidden="true" />

        {/* L2 导航层 */}
        <nav className="proto__nav" aria-hidden="true">
          <span className="proto__brand">MZS · PROTO</span>
          <span className="proto__menu">
            <i>INTRO</i>
            <i>VISION</i>
            <i>INTELLIGENCE</i>
          </span>
        </nav>

        {/* L4 文本层：中央标题 */}
        <div className="proto__headline">
          <h2>The future is built on Artificial Intelligence.</h2>
          <p>AI × CONTENT WORKFLOW</p>
        </div>

        {/* 智能层收拢态 */}
        <div className="proto__layer">
          <span className="proto__diamond" aria-hidden="true" />
          <h3>INTELLIGENCE LAYER</h3>
          <p>优化流程 · 降低成本 · 激发创造</p>
          <div className="proto__layer-words mono">
            <span>HIGH LEVEL</span>
            <span>OPERATIONAL</span>
            <span>GRANULAR</span>
            <span>AGNOSTIC</span>
          </div>
        </div>

        {/* L3 卡片层 */}
        <div className="proto__cards">
          {CARDS.map((c, i) => (
            <button
              key={c.no}
              ref={(el) => (cardsRef.current[i] = el)}
              className={`proto__card${i === index ? ' is-active' : ''}`}
              aria-label={c.cn}
            >
              <img src={asset(c.img)} alt={c.cn} />
              <span className="proto__card-no mono">{c.no}</span>
            </button>
          ))}
        </div>

        {/* 底部关键词 / 步骤联动 */}
        <div className="proto__progress">
          <span className="mono proto__keyword">{cur.en}</span>
          <span className="mono proto__step">
            {String(index + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
          </span>
          <div className="proto__bar">
            <i style={{ width: `${((index + 1) / N) * 100}%` }} />
          </div>
          <span className="proto__desc">{cur.cn}</span>
        </div>

        {/* L5 标注层 */}
        {notes && (
          <div className="proto__notes">
            <span className="proto-note proto-note--1">
              ① 入场：四角汇聚 → 直线 → 圆环
              <em>GSAP timeline · stagger 0.05 · 约 1.9s</em>
            </span>
            <span className="proto-note proto-note--2">
              ② 滚动 p 0→0.7：圆环 → 横向长卷
              <em>中间清晰 scale 1，两侧 0.82 / 0.42 / blur 3px</em>
            </span>
            <span className="proto-note proto-note--3">
              ③ p 0.74→1：卡片收拢为菱形智能层
              <em>背景切换蓝绿渐变 · 关键词淡入</em>
            </span>
            <span className="proto-note proto-note--4">
              ④ 关键词与步骤计数随当前卡片联动
              <em>SPATIAL → SYSTEM · 01/08 → 08/08</em>
            </span>
            <div className="proto-states">
              <i>默认</i>
              <i>悬停</i>
              <i>滚动中</i>
            </div>
            <div className="proto-legend mono">
              L1 背景 / L2 导航 / L3 卡片 / L4 文本 / L5 标注
            </div>
          </div>
        )}

        <button className="proto__toggle mono" onClick={() => setNotes((v) => !v)}>
          {notes ? '标注 ON' : '标注 OFF'}
        </button>
      </div>
    </section>
  )
}
