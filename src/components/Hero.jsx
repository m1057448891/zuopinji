import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '../lib/asset.js'
import { videoSources } from '../lib/videoSources.js'

gsap.registerPlugin(ScrollTrigger)

const EXT_BG = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260723_145606_ab143199-b593-4941-bb1b-9afca215416b.mp4'
const isRemote = (p) => /^https?:/.test(p || '')

const slides = [
  {
    no: '01',
    cn: '视觉方向',
    video: '/works/hero/hero-01.mp4'
  },
  {
    no: '02',
    cn: '图片作品',
    video: '/works/hero/hero-02.mp4'
  },
  {
    no: '03',
    cn: '海报',
    video: '/works/hero/hero-03.mp4'
  },
  {
    no: '04',
    cn: '商业广告',
    video: '/works/hero/hero-04.mp4'
  },
  {
    no: '05',
    cn: '创意短片',
    video: '/works/hero/hero-05.mp4'
  }
]

const listItems = [
  { no: '01', cn: '图片作品', en: 'IMAGE WORKS', href: '#image-works' },
  { no: '02', cn: '创意短片', en: 'SHORTS', href: '#shorts-showcase' },
  { no: '03', cn: '商业广告', en: 'COMMERCIAL', href: '#ads-showcase' },
  { no: '04', cn: 'Skill搭建', en: 'SKILL BUILD', href: '#tools-showcase' },
  { no: '05', cn: '视频轮播', en: 'MOTION REEL', href: '#carousel-showcase' },
  { no: '06', cn: '图片轮播', en: 'IMAGE GALLERY', href: '#gallery-showcase' }
]

const WAVE = Array.from({ length: 24 }, (_, i) => 24 + ((i * 29) % 60))

function ThumbVideo({ slide }) {
  const videoRef = useRef(null)

  const handleEnter = () => {
    const v = videoRef.current
    if (!v) return
    v.src = isRemote(slide.video) ? slide.video : asset(slide.video)
    v.load()
    v.play().catch(() => {})
  }

  const handleLeave = () => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.removeAttribute('src')
    v.load()
  }

  return (
    <video
      ref={videoRef}
      poster={asset(slide.video.replace(/\.mp4$/, '-poster.jpg'))}
      muted
      loop
      playsInline
      preload="none"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    />
  )
}

export default function Hero({ video }) {
  const scope = useRef(null)
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(null)
  const [activeVideo, setActiveVideo] = useState(video)
  const mainVideoRef = useRef(null)

  const selectSlide = (i) => {
    setActive(i)
    setActiveVideo(slides[i].video)
  }

  useEffect(() => {
    if (video) setActiveVideo(video)
  }, [video])

  useEffect(() => {
    const timer = setTimeout(() => {
      const v = mainVideoRef.current
      if (v) {
        v.load()
        v.play().catch(() => {})
      }
    }, 1200)
    return () => clearTimeout(timer)
  }, [activeVideo])

  const prev = () => {
    const i = (active + slides.length - 1) % slides.length
    selectSlide(i)
  }
  const next = () => {
    const i = (active + 1) % slides.length
    selectSlide(i)
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero__video',
        { scale: 1.04, yPercent: -3 },
        {
          scale: 1.14,
          yPercent: 9,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        }
      )
      gsap.fromTo(
        '.hero__giant--left',
        { xPercent: -14, autoAlpha: 0 },
        { xPercent: 0, autoAlpha: 1, duration: 1.4, ease: 'power3.out', delay: 0.1 }
      )
      gsap.fromTo(
        '.hero__giant--right',
        { xPercent: 14, autoAlpha: 0 },
        { xPercent: 0, autoAlpha: 1, duration: 1.4, ease: 'power3.out', delay: 0.18 }
      )
      gsap.fromTo(
        '.hero__list--cn .hero__list-item',
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          delay: 0.4,
          ease: 'power3.out'
        }
      )
      gsap.fromTo(
        '.hero__list--en .hero__list-item',
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          delay: 0.55,
          ease: 'power3.out'
        }
      )
      gsap.fromTo(
        '.hero__carousel',
        { autoAlpha: 0, y: 54 },
        { autoAlpha: 1, y: 0, duration: 1.2, delay: 0.7, ease: 'power3.out' }
      )
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="top" ref={scope}>
      <div className="hero__bg">
        <video
          key={activeVideo}
          className="hero__video"
          ref={mainVideoRef}
          muted
          loop
          playsInline
          preload="none"
          src={isRemote(activeVideo) ? activeVideo : undefined}
          poster={
            activeVideo
              ? isRemote(activeVideo)
                ? asset('/works/hero/hero-01-poster.jpg')
                : asset(activeVideo.replace(/\.mp4$/, '-poster.jpg'))
              : undefined
          }
          aria-hidden="true"
        >
          {!isRemote(activeVideo) && videoSources(activeVideo).map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
        <div className="hero__grid" aria-hidden="true" />
        <div className="hero__shade" aria-hidden="true" />
      </div>

      <span className="hero__giant hero__giant--left" aria-hidden="true">
        STUDIO
      </span>
      <span className="hero__giant hero__giant--right" aria-hidden="true">
        DIGITAL
      </span>

      <div className="hero__lists">
        <ul className="hero__list hero__list--cn">
          {listItems.map((s) => (
            <li key={s.no}>
              <a className="hero__list-item" href={s.href}>
                <span className="mono">{s.no}</span>
                {s.cn}
              </a>
            </li>
          ))}
        </ul>
        <ul className="hero__list hero__list--en">
          {listItems.map((s) => (
            <li key={s.no}>
              <a className="hero__list-item" href={s.href}>
                {s.en}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="container hero__carousel">
        <div className="hero__car-head">
          <div className="hero__car-controls hero__car-controls--center">
            <button className="hero__car-arrow" onClick={prev} aria-label="上一个">
              《
            </button>
            <span className="hero__car-index mono">{slides[active].no} // 05</span>
            <button className="hero__car-arrow" onClick={next} aria-label="下一个">
              》
            </button>
          </div>
        </div>

        <div className="hero__strips">
          {slides.map((s, i) => (
            <div
              className={`hero__strip ${i === active ? 'is-active' : ''} ${
                hovered === i ? 'is-waving' : ''
              }`}
              key={s.no}
            >
              <div className="hero__wave" aria-hidden="true">
                {WAVE.map((h, k) => (
                  <span key={k} style={{ height: `${h}%`, animationDelay: `${(k % 6) * 0.08}s` }} />
                ))}
              </div>
              <button
                className={`hero__car-thumb ${i === active ? 'is-active' : ''}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => selectSlide(i)}
              >
                <ThumbVideo slide={s} />
                <span className="mono">{s.no}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <a className="hero__float-btn" href="#contact" aria-label="联系我">
        ✦
      </a>
    </section>
  )
}
