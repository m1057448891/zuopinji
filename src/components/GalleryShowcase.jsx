import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '../lib/asset.js'

gsap.registerPlugin(ScrollTrigger)

// —— 素材层：使用站内作品图片，8 张卡片作为原型素材 ——
const CARDS = [
  { no: '01', cn: '深空漫游', en: 'Deep Space Drift', img: '/works/img/img-015.webp' },
  { no: '02', cn: '雾霭新生', en: 'Mist & Newborn Light', img: '/works/img/img-023.webp' },
  { no: '03', cn: '软糖小屋', en: 'Candy Cottage', img: '/works/img/img-013.webp' },
  { no: '04', cn: '风影席卷', en: 'Wind Sweep', img: '/works/img/img-018.webp' },
  { no: '05', cn: '冷白逆光', en: 'Cold Backlit', img: '/works/img/img-021.webp' },
  { no: '06', cn: '透明机能', en: 'Glass Massager', img: '/works/img/img-011.webp' },
  { no: '07', cn: '刃光惊鸿', en: 'Blade & Dust', img: '/works/img/img-009.webp' },
  { no: '08', cn: '草甸低云', en: 'Meadow Clouds', img: '/works/img/img-016.webp' }
]
const N = CARDS.length
const R = 248
const SPACING = 168

export default function GalleryShowcase() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const cardsRef = useRef([])
  const idxRef = useRef(0)
  const [index, setIndex] = useState(0)
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
    const stripXY = (i, w, h) => ({ x: w / 2 + (i - (N - 1) / 2) * SPACING, y: h / 2 + 26 })

    const ctx = gsap.context(() => {
      // L1 入场：四角汇聚 → 直线 → 圆环（仅一次）
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: section, start: 'top 82%', once: true }
      })
      tl.fromTo(
        cards,
        {
          opacity: 0,
          scale: 0.35,
          x: (i) => (i % 2 ? -1 : 1) * vw() * 0.62,
          y: (i) => (i % 2 ? 1 : -1) * vh() * 0.5,
          rotation: (i) => (i % 2 ? 26 : -26)
        },
        {
          opacity: 1,
          scale: 1,
          x: (i) => vw() / 2 + (i - (N - 1) / 2) * SPACING,
          y: (i) => vh() / 2 + 26,
          rotation: 0,
          stagger: 0.055,
          duration: 1.05
        },
        0
      )
        .to(
          cards,
          {
            x: (i) => circleXY(i, vw(), vh()).x,
            y: (i) => circleXY(i, vw(), vh()).y,
            rotation: (i) => i * 14 - 50,
            duration: 1.05,
            ease: 'power2.inOut',
            stagger: 0.045
          },
          0.85
        )

      // L3 滚动：圆形 → 横向长卷（scrub 联动）
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress
          const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
          const w = vw()
          const h = vh()
          const idx = Math.min(N - 1, Math.max(0, Math.round(p * (N - 1))))
          if (idx !== idxRef.current) {
            idxRef.current = idx
            setIndex(idx)
          }
          cards.forEach((el, i) => {
            const c = circleXY(i, w, h)
            const s = stripXY(i, w, h)
            gsap.set(el, {
              x: c.x + (s.x - c.x) * e,
              y: c.y + (s.y - c.y) * e,
              rotation: (1 - e) * (i * 14 - 50),
              zIndex: i === idx ? 5 : 1
            })
          })
          gsap.set('.proto__fill', { opacity: 0.05 + p * 0.18 })
        }
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section className="proto" id="gallery-showcase" ref={sectionRef}>
      <div className="proto__stage" ref={stageRef}>
        {/* L1 背景层 */}
        <div className="proto__fill" aria-hidden="true" />

        {/* L2 导航层（原型内嵌极简导航，仅示意） */}
        <nav className="proto__nav" aria-hidden="true">
          <span className="proto__brand">MZS · PROTO</span>
          <span className="proto__menu">
            <i>INTRO</i>
            <i>VISION</i>
            <i>INTELLIGENCE</i>
          </span>
        </nav>

        {/* L4 文本层 */}
        <div className="proto__headline">
          <h2>IMAGES, INTELLIGENTLY ARRANGED</h2>
          <p>卡片汇聚成圆 · 滚动展开为内容长卷</p>
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

        <div className="proto__progress">
          <span className="mono proto__step">
            STEP {String(index + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
          </span>
          <div className="proto__bar">
            <i style={{ width: `${((index + 1) / N) * 100}%` }} />
          </div>
          <span className="proto__desc">
            <b>{cur.cn}</b> · {cur.en}
          </span>
        </div>

        {/* L5 标注层（可开关） */}
        {notes && (
          <div className="proto__notes">
            <span className="proto-note proto-note--1">
              ① 入场：四角汇聚 → 直线 → 圆环
              <em>GSAP timeline · stagger 0.05 · 共约 1.9s</em>
            </span>
            <span className="proto-note proto-note--2">
              ② 圆环态：卡片各自倾斜，轮盘感
              <em>rotation = i×14 − 50°</em>
            </span>
            <span className="proto-note proto-note--3">
              ③ 滚动 p 0→1：圆形 → 横向长卷
              <em>ScrollTrigger scrub · lerp 双缓动</em>
            </span>
            <span className="proto-note proto-note--4">
              ④ 当前步高亮 / 悬停 scale 1.05
              <em>STEP 计数与进度条联动</em>
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
