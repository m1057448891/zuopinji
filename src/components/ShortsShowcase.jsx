import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '../lib/asset.js'
import useInView from '../lib/useInView.js'
import { videoSources } from '../lib/videoSources.js'

gsap.registerPlugin(ScrollTrigger)

const SHORTS = [
  {
    no: '01',
    file: '/works/adsreel/01.mp4',
    poster: '/videos/ads/01-poster.jpg',
    badge: 'PRODUCT FILM',
    en: 'SNEAKER — FIBER CONSTRUCTION',
    cn: '耐克运动鞋构造展示',
    desc: '微距镜头下的纤维生成与构造过程，鞋面材质如植物纤维般层层生长、交织成型，展现运动鞋的结构美学。',
    date: '2026',
    tags: ['SNEAKER', 'MACRO', 'CONSTRUCTION']
  },
  {
    no: '02',
    file: '/works/adsreel/02.mp4',
    poster: '/videos/ads/02-poster.jpg',
    badge: 'JEWELRY FILM',
    en: 'NECKLACE — GOLDEN HOUR',
    cn: '项链',
    desc: '黄昏卧室窗边的柔光逆光下，项链在暖色光线中闪烁，金属与钻石的质感被细致呈现。',
    date: '2026',
    tags: ['NECKLACE', 'JEWELRY', 'GOLDEN HOUR']
  },
  {
    no: '03',
    file: '/works/adsreel/03.mp4',
    poster: '/videos/ads/03-poster.jpg',
    badge: 'PRODUCT FILM',
    en: 'WIRELESS EARBUDS',
    cn: '蓝牙耳机',
    desc: '黑色耳机与充电仓在镜面展台上旋转呈现，顶部光束勾勒出圆润轮廓与指示灯细节。',
    date: '2026',
    tags: ['EARBUDS', 'PRODUCT', 'MACRO']
  },
  {
    no: '04',
    file: '/works/adsreel/04.mp4',
    poster: '/videos/ads/04-poster.jpg',
    badge: 'MACRO FILM',
    en: 'COFFEE — MACRO',
    cn: '咖啡',
    desc: '绵密奶泡与咖啡液的分层特写，方糖立于泡沫之上，微距镜头下的治愈系咖啡时刻。',
    date: '2026',
    tags: ['COFFEE', 'MACRO', 'FOOD FILM']
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
  const [sectionRef, inView] = useInView('0px 0px -100px 0px')
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
    if (!v) return
    if (!inView) {
      v.pause()
      return
    }
    v.play().catch(() => {})
    v.onended = () => switchTo((index + 1) % SHORTS.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, inView])

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

  // 首页缩略图点击后跳转到这里播放对应视频
  useEffect(() => {
    const onPlay = (e) => {
      const file = e.detail?.file
      const idx = SHORTS.findIndex((s) => s.file === file)
      if (idx < 0) return
      switchingRef.current = false
      setSwitching(false)
      setPrevFile(null)
      setIndex(idx)
    }
    window.addEventListener('shorts:play', onPlay)
    return () => window.removeEventListener('shorts:play', onPlay)
  }, [])

  const cur = SHORTS[index]
  const prev = () => switchTo((index - 1 + SHORTS.length) % SHORTS.length)
  const next = () => switchTo((index + 1) % SHORTS.length)

  return (
    <section className="desk" id="shorts-showcase" ref={sectionRef}>
      <div className="desk__viewport">
        <div className="desk__zoom">
          <img
            className="desk__img"
            src={inView ? asset('/works/bg/office.webp') : undefined}
            alt=""
            aria-hidden="true"
          />
          <div className="desk__screen">
            {prevFile && (
              <video
                className="desk__video-leaving"
                muted
                loop
                playsInline
              >
                {videoSources(prevFile).map((s) => (
                  <source key={s.src} src={s.src} type={s.type} />
                ))}
              </video>
            )}
            <video
              className="desk__video-entering"
              ref={videoRef}
              key={cur.file}
              muted
              playsInline
              preload={inView ? 'auto' : 'none'}
              poster={inView ? asset(cur.poster) : undefined}
            >
              {inView &&
                videoSources(cur.file).map((s) => (
                  <source key={s.src} src={s.src} type={s.type} />
                ))}
            </video>
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
