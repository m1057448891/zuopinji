import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '../lib/asset.js'
import useInView from '../lib/useInView.js'
import { imgSrcSet } from '../lib/imgAttrs.js'
import { videoSources } from '../lib/videoSources.js'

gsap.registerPlugin(ScrollTrigger)

const GAP = 10

const ITEMS = [
  { file: '/works/img/img-015.webp', cn: '深空漫游', en: 'Deep Space Drift' },
  { file: '/works/img/img-023.webp', cn: '雾霭新生', en: 'Mist & Newborn Light' },
  { file: '/works/img/img-013.webp', cn: '软糖小屋', en: 'Candy Cottage' },
  { file: '/works/img/img-018.webp', cn: '风影席卷', en: 'Wind Sweep' },
  { file: '/works/img/img-021.webp', cn: '冷白逆光', en: 'Cold Backlit' },
  { file: '/works/img/img-011.webp', cn: '透明机能', en: 'Glass Massager' },
  { file: '/works/img/img-009.webp', cn: '刀光惊尘', en: 'Blade & Dust' },
  { file: '/works/img/img-016.webp', cn: '草甸低云', en: 'Meadow Clouds' },
  { file: '/works/img/img-017.webp', cn: '草浪云天', en: 'Grass Wave Sky' },
  { file: '/works/img/img-019.webp', cn: '胶片古色', en: 'Film Ancient Beauty' },
  { file: '/works/img/img-022.webp', cn: '仙侠猎妖', en: 'Myth Hunter' },
  { file: '/works/img/img-003.webp', cn: '新春纳福', en: 'New Year Blessing' },
  { file: '/works/img/img-008.webp', cn: '暗夜朦光', en: 'Nocturne' },
  { file: '/works/img/img-012.webp', cn: '花海果酒', en: 'Flower Wine' },
  { file: '/works/img/img-010.webp', cn: '蓝调春日', en: 'Blue Spring' },
  { file: '/works/img/img-004.webp', cn: '千禧幻梦', en: 'Millennium Dream' },
  { file: '/works/img/img-002.webp', cn: '甜酷少女', en: 'Y2K Pop Rebel' },
  { file: '/works/img/img-001.webp', cn: '赛博天使', en: 'Y2K Cyber Angel' },
  { file: '/works/img/img-005.webp', cn: '高校女王', en: 'High Teen Queen' },
  { file: '/works/img/img-006.webp', cn: '东坡上釉', en: 'Dongpo Glaze' },
  { file: '/works/img/img-014.webp', cn: '极简人像', en: 'Minimal Portrait' }
]

const N = ITEMS.length
const COPIES = 5
const EXPANDED = Array.from({ length: COPIES }, (_, c) =>
  ITEMS.map((item, i) => ({ ...item, pos: c * N + i }))
).flat()

export default function GalleryShowcase() {
  const [sectionRef, inView] = useInView('0px 0px 600px 0px')
  const viewRef = useRef(null)
  const trackRef = useRef(null)
  const [pos, setPos] = useState(2 * N)
  const [lightbox, setLightbox] = useState(null)
  const dragRef = useRef({ down: false, startX: 0, baseX: 0, moved: 0, cardPos: -1 })
  const pausedRef = useRef(false)
  const wrapRef = useRef(false)
  const pendingWrapRef = useRef(false)

  const measure = () => {
    const view = viewRef.current
    const card = view && view.querySelector('.gallery-card')
    if (!view || !card) return { step: 0, cardW: 0 }
    const r = card.getBoundingClientRect()
    return { step: r.width + GAP, cardW: r.width }
  }

  const centerX = (p) => {
    const view = viewRef.current
    const { step, cardW } = measure()
    if (!view || !step) return 0
    return view.clientWidth / 2 - (p * step + cardW / 2)
  }

  const animateTo = (p, instant = false) => {
    const track = trackRef.current
    if (!track) return
    const x = centerX(p)
    if (instant) gsap.set(track, { x })
    else gsap.to(track, { x, duration: 0.7, ease: 'power3.out' })
  }

  useLayoutEffect(() => {
    animateTo(pos, true)
    const onResize = () => animateTo(pos, true)
    window.addEventListener('resize', onResize)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery__head > *',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true }
        }
      )
      const cards = gsap.utils.toArray('.gallery-card')
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.02,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
          onComplete: () => gsap.set(cards, { clearProps: 'transform,opacity' })
        }
      )
    }, sectionRef)
    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      if (pausedRef.current || lightbox != null) return
      setPos((p) => p + 1)
    }, 2000)
    return () => clearInterval(t)
  }, [lightbox])

  useEffect(() => {
    if (pos >= 3 * N) {
      pendingWrapRef.current = true
    }
  }, [pos])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const instant = wrapRef.current
    wrapRef.current = false
    const x = centerX(pos)
    if (instant) {
      gsap.set(track, { x })
      return
    }
    const tween = gsap.to(track, {
      x,
      duration: 0.7,
      ease: 'power3.out',
      onComplete: () => {
        if (pendingWrapRef.current) {
          pendingWrapRef.current = false
          wrapRef.current = true
          setPos(pos - N)
        }
      }
    })
    return () => tween.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos])

  const onPointerDown = (e) => {
    const track = trackRef.current
    if (!track) return
    track.setPointerCapture(e.pointerId)
    pausedRef.current = true
    const x = gsap.getProperty(track, 'x')
    const cardEl = e.target.closest('.gallery-card')
    const cardPos = cardEl ? Number(cardEl.dataset.pos) : -1
    dragRef.current = { down: true, startX: e.clientX, baseX: x, moved: 0, cardPos }
  }

  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d.down) return
    d.moved = e.clientX - d.startX
    gsap.set(trackRef.current, { x: d.baseX + d.moved })
  }

  const onPointerUp = () => {
    const d = dragRef.current
    if (!d.down) return
    d.down = false
    pausedRef.current = false
    const view = viewRef.current
    const { step, cardW } = measure()
    if (!view || !step) return
    const center = view.clientWidth / 2 - cardW / 2
    const cur = Math.round((center - d.baseX) / step)
    if (Math.abs(d.moved) < 6) {
      if (d.cardPos >= 0) {
        const nearest = [d.cardPos - N, d.cardPos, d.cardPos + N].reduce((a, b) =>
          Math.abs(b - cur) < Math.abs(a - cur) ? b : a
        )
        const clamped = Math.max(0, Math.min(EXPANDED.length - 1, nearest))
        if (clamped === pos) setLightbox(clamped % N)
        else setPos(clamped)
      }
      return
    }
    const target = cur - Math.round(d.moved / step)
    setPos(Math.max(0, Math.min(EXPANDED.length - 1, target)))
  }

  const curItem = lightbox != null ? ITEMS[lightbox] : null

  useEffect(() => {
    const v = sectionRef.current?.querySelector('.gallery__bg video')
    if (!v) return
    if (inView) v.play().catch(() => {})
    else v.pause()
  }, [inView, sectionRef])

  return (
    <section className="gallery-showcase" id="gallery-showcase" ref={sectionRef}>
      <div className="gallery__bg" aria-hidden="true">
        <video
          poster={inView ? asset('/works/bg/sixth-poster.jpg') : undefined}
          muted
          loop
          playsInline
          preload={inView ? 'auto' : 'none'}
        >
          {inView &&
            videoSources('/works/bg/sixth-bg.mp4').map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
        </video>
        <span className="gallery__shade" />
      </div>

      <div className="gallery__head">
        <span className="mono gallery__kicker">IMAGE GALLERY / 图片轮播</span>
        <h2 className="gallery__title">Every frame is a world.</h2>
        <span className="mono gallery__hint">AUTO LOOP · DRAG TO EXPLORE · CLICK TO VIEW</span>
      </div>

      <div
        className="gallery__view"
        ref={viewRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="gallery__track" ref={trackRef}>
          {EXPANDED.map((item) => (
            <article
              key={item.pos}
              data-pos={item.pos}
              className={`gallery-card ${item.pos === pos ? 'is-active' : ''}`}
            >
              <button className="gallery-card__media" aria-label={item.en}>
                <img
                  src={asset(item.file)}
                  srcSet={imgSrcSet(item.file)}
                  sizes="(min-width: 1400px) 480px, (min-width: 800px) 360px, 90vw"
                  alt={item.cn}
                  loading="lazy"
                  decoding="async"
                />
              </button>
              <div className="gallery-card__info">
                <span className="gallery-card__cn">{item.cn}</span>
                <span className="gallery-card__en">{item.en}</span>
                <div className="gallery-card__row">
                  <span className="mono">2026</span>
                  <span className="mono gallery-card__view">VIEW &#8594;</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {curItem && (
        <div className="gallery-modal" onClick={() => setLightbox(null)}>
          <div className="gallery-modal__inner">
              <img src={asset(curItem.file)} alt={curItem.cn} />
            <div className="gallery-modal__cap">
              <span className="mono gallery-modal__no">
                {String((lightbox % N) + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
              </span>
              <h3>{curItem.cn}</h3>
              <p className="mono">{curItem.en}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
