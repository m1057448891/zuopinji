import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '../lib/asset.js'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  {
    no: '01',
    cn: '灯塔生花',
    en: 'Lighthouse in Bloom',
    tag: 'DREAMY 3D',
    date: '2026',
    file: '/works/vid/vid-024.mp4',
    poster: '/works/carousel/p1.jpg'
  },
  {
    no: '02',
    cn: '赛博圣母',
    en: 'Cyber Madonna',
    tag: 'GLITCH ART',
    date: '2026',
    file: '/works/vid/vid-025.mp4',
    poster: '/works/carousel/p2.jpg'
  },
  {
    no: '03',
    cn: '灯夜傩舞',
    en: 'Masked Lantern Dancer',
    tag: 'CHINESE FOLK',
    date: '2026',
    file: '/works/vid/vid-026.mp4',
    poster: '/works/carousel/p3.jpg'
  },
  {
    no: '04',
    cn: '白幔圣殿',
    en: 'Veiled Sanctum',
    tag: 'EPIC FANTASY',
    date: '2026',
    file: '/works/vid/vid-027.mp4',
    poster: '/works/carousel/p4.jpg'
  },
  {
    no: '05',
    cn: '剑染残阳',
    en: 'Sword at Dusk',
    tag: 'WUXIA CINEMA',
    date: '2026',
    file: '/works/vid/vid-028.mp4',
    poster: '/works/carousel/p5.jpg'
  },
  {
    no: '06',
    cn: '透框守花',
    en: 'Framed Tenderness',
    tag: 'HEALING LIGHT',
    date: '2026',
    file: '/works/vid/vid-029.mp4',
    poster: '/works/carousel/p6.jpg'
  },
  {
    no: '07',
    cn: '春樱秋千',
    en: 'Sakura Swing',
    tag: 'JAPANESE FRESH',
    date: '2026',
    file: '/works/vid/vid-016.mp4',
    poster: '/works/carousel/p7.jpg'
  }
]

const GAP = 24

function CarouselCard({ item, onOpen }) {
  return (
    <article className="car-card">
      <button
        className="car-card__media"
        onClick={() => onOpen(item)}
        aria-label={item.en}
      >
          <video
            src={asset(item.file)}
            poster={asset(item.poster)}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <span className="car-card__play" aria-hidden="true">
          &#9654;
        </span>
      </button>
      <div className="car-card__info">
        <h3>{item.cn}</h3>
        <span className="car-card__en">{item.en}</span>
        <span className="car-card__rule" aria-hidden="true" />
        <div className="car-card__meta mono">
          <span>{item.tag}</span>
          <span>{item.date}</span>
        </div>
      </div>
    </article>
  )
}

export default function CarouselShowcase() {
  const sectionRef = useRef(null)
  const viewRef = useRef(null)
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [max, setMax] = useState(0)
  const [active, setActive] = useState(null)

  useEffect(() => {
    const measure = () => {
      const view = viewRef.current
      if (!view) return
      const card = view.querySelector('.car-card')
      if (!card) return
      const step = card.getBoundingClientRect().width + GAP
      const visible = Math.max(1, Math.floor(view.clientWidth / step))
      setMax(Math.max(0, ITEMS.length - visible))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.car-card')
    const step = card ? card.getBoundingClientRect().width + GAP : 0
    gsap.to(track, { x: -index * step, duration: 0.9, ease: 'power3.out' })
  }, [index])

  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.utils.toArray('.car-card video').forEach((v) => v.play().catch(() => {}))
    }, 350)
    return () => clearTimeout(timer)
  }, [index])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.carousel__head > *',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.carousel__head', start: 'top 82%', once: true }
        }
      )
      gsap.fromTo(
        '.car-card',
        { y: 64, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.carousel__view', start: 'top 86%', once: true }
        }
      )
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          gsap.utils.toArray('.car-card video').forEach((v) => v.play().catch(() => {}))
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const go = (dir) => {
    setIndex((i) => Math.min(max, Math.max(0, i + dir)))
  }

  const cur = active != null ? ITEMS[active] : null

  return (
    <section className="carousel-showcase" id="carousel-showcase" ref={sectionRef}>
      <div className="carousel__bg" aria-hidden="true">
        <span className="carousel__bg-light carousel__bg-light--1" />
        <span className="carousel__bg-light carousel__bg-light--2" />
        <span className="carousel__bg-sweep" />
        <span className="carousel__bg-sweep carousel__bg-sweep--2" />
      </div>

      <div className="carousel__head">
        <span className="mono carousel__kicker">SELECTED WORKS / 精选动态影像</span>
        <h2 className="carousel__title">
          MOVEMENT, MOOD &amp; STORY
          <br />
          <em>光影、情绪与叙事实验</em>
        </h2>
        <a className="carousel__btn mono" href="#gallery-showcase">
          VIEW ALL WORKS <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className="carousel__bg-marquee" aria-hidden="true">
        <div className="carousel__bg-marquee-track">
          <span className="carousel__bg-word">MOTION</span>
          <span className="carousel__bg-word">MOTION</span>
        </div>
      </div>

      <div className="carousel__view" ref={viewRef}>
        <div className="carousel__track" ref={trackRef}>
          {ITEMS.map((item) => (
            <CarouselCard
              key={item.no}
              item={item}
              onOpen={(it) => setActive(ITEMS.indexOf(it))}
            />
          ))}
        </div>
      </div>

      <div className="carousel__nav">
        <button
          className="car-nav mono"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous"
        >
          &#8592;
        </button>
        <button
          className="car-nav mono"
          onClick={() => go(1)}
          disabled={index >= max}
          aria-label="Next"
        >
          &#8594;
        </button>
      </div>

      {cur && (
        <div className="car-modal" onClick={() => setActive(null)}>
          <div className="car-modal__inner" onClick={(e) => e.stopPropagation()}>
            <video src={asset(cur.file)} poster={asset(cur.poster)} autoPlay loop playsInline controls />
            <div className="car-modal__cap">
              <span className="mono car-modal__no">NO.{cur.no}</span>
              <h3>{cur.cn}</h3>
              <p className="mono">{cur.en}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
