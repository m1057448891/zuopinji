import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import worksData from '../data/works.json'
import { asset } from '../lib/asset.js'

gsap.registerPlugin(ScrollTrigger)

const works = worksData.works
const dragon = works.find((w) => w.original.includes('2026-03-23-5027'))

const SHORTS = [
  {
    no: '01',
    file: asset(dragon?.file || '/works/vid/vid-019.mp4'),
    badge: 'DARK FANTASY',
    en: 'DRAGON KNIGHT — EPIC BATTLE',
    cn: '龙骑士史诗之战',
    desc: '身披铠甲的骑士乘黑色巨龙立于岩石峭壁，乌云翻涌、火星飞散，史诗级暗黑奇幻电影镜头。',
    date: '2026 03.23',
    tags: ['DRAGON RIDER', 'DARK FANTASY', 'CINEMATIC']
  },
  {
    no: '02',
    file: asset('/works/hero/hero-02.mp4'),
    badge: 'AERIAL FILM',
    en: 'SEAGULLS OVER THE CLIFF',
    cn: '海鸥与悬崖',
    desc: '成群白色海鸥在阳光下的绿色海边悬崖上空翱翔，两侧海水深邃，电影感航拍视角。',
    date: '2026',
    tags: ['SEAGULLS', 'COASTAL CLIFF', 'AERIAL']
  },
  {
    no: '03',
    file: asset('/works/hero/hero-04.mp4'),
    badge: 'FISHEYE FILM',
    en: 'BEE — LOW FLIGHT',
    cn: '蜜蜂的低空飞行',
    desc: '蜜蜂在阳光灿烂的公园草地上空低飞，彩色游乐设施作背景，鱼眼近距离跟拍，动感十足。',
    date: '2026',
    tags: ['BEE', 'PLAYGROUND', 'FISHEYE']
  },
  {
    no: '04',
    file: asset('/works/hero/hero-05.mp4'),
    badge: 'DARK FILM',
    en: 'EMBERS & SMOKE',
    cn: '余烬与浓烟',
    desc: '浓烟中橙色火星四溅，木质残骸倾斜坍塌、地面碎石遍地，爆炸后的暗黑电影现场。',
    date: '2026',
    tags: ['SMOKE', 'EXPLOSION', 'EMBERS']
  }
]

function Typewriter({ text, speed = 42 }) {
  const [len, setLen] = useState(0)

  useEffect(() => {
    setLen(0)
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setLen(i)
      if (i >= text.length) clearInterval(timer)
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return (
    <span>
      {text.slice(0, len)}
      <span className="desk__cursor">▍</span>
    </span>
  )
}

export default function ShortsShowcase() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [switching, setSwitching] = useState(false)
  const [prevFile, setPrevFile] = useState(null)
  const switchingRef = useRef(false)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 600px)', () => {
      const ctx = gsap.context(() => {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=200%',
            scrub: 1
          }
        })
        tl.fromTo(
          '.desk__zoom',
          { scale: 1.05, opacity: 0, filter: 'blur(6px)' },
          {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'power1.out',
            duration: 0.14
          },
          0
        )
          .fromTo(
            '.desk__zoom',
            { scale: 1, x: 0, y: 0, transformOrigin: '0 0' },
            {
              scale: 2.4,
              x: -vw * 0.82,
              y: -vh * 0.48,
              ease: 'none',
              duration: 0.86
            },
            0.14
          )
      }, sectionRef)
      return () => ctx.revert()
    })
    return () => mm.revert()
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (v) {
      v.play().catch(() => {})
      v.onended = () => switchTo((index + 1) % SHORTS.length)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const switchTo = (nextIndex) => {
    if (switchingRef.current) return
    switchingRef.current = true
    setSwitching(true)
    setPrevFile(SHORTS[index].file)
    setIndex(nextIndex)
    window.setTimeout(() => {
      setPrevFile(null)
      switchingRef.current = false
      setSwitching(false)
    }, 520)
  }

  const cur = SHORTS[index]
  const prev = () => switchTo((index - 1 + SHORTS.length) % SHORTS.length)
  const next = () => switchTo((index + 1) % SHORTS.length)

  return (
    <section className="desk" id="shorts-showcase" ref={sectionRef}>
      <div className="desk__viewport">
        <div className="desk__zoom">
          <img className="desk__img" src={asset('/works/bg/office.png')} alt="" aria-hidden="true" />
          <div className="desk__screen">
            {prevFile && (
              <video
                className="desk__video-leaving"
                src={prevFile}
                muted
                loop
                playsInline
              />
            )}
            <video
              className="desk__video-entering"
              ref={videoRef}
              src={cur.file}
              muted
              loop
              playsInline
              preload="auto"
              autoPlay
            />
            <div className="desk__glass" aria-hidden="true" />
          </div>
        </div>

        <div className="desk__panel" key={`panel-${index}`}>
          <span className="mono desk__badge">{cur.badge}</span>
          <h2 className="desk__title">{cur.en}</h2>
          <p className="mono desk__type">
            <Typewriter text={cur.desc} />
          </p>
          <div className="mono desk__tags">
            {cur.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <span className="mono desk__date">{cur.date}</span>
          <div className="desk__btns">
            <button className="desk__btn" onClick={prev} aria-label="上一个">
              ◀
            </button>
            <span className="mono desk__counter">
              {String(index + 1).padStart(2, '0')} / {String(SHORTS.length).padStart(2, '0')}
            </span>
            <button className="desk__btn" onClick={next} aria-label="下一个">
              ▶
            </button>
          </div>
        </div>

        <p className="desk__hint mono">SCROLL TO ZOOM — CLICK ◀ ▶ TO SWITCH</p>
      </div>
    </section>
  )
}
