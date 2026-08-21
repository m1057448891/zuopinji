import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '../lib/asset.js'

gsap.registerPlugin(ScrollTrigger)

const listItems = [
  { no: '01', cn: '图片作品', en: 'IMAGE WORKS', href: '#image-works' },
  { no: '02', cn: '创意短片', en: 'SHORTS', href: '#shorts-showcase' },
  { no: '03', cn: '风格效果', en: 'STYLE EFFECTS', href: '#ads-showcase' },
  { no: '04', cn: 'Skill搭建', en: 'SKILL BUILD', href: '#tools-showcase' },
  { no: '05', cn: '图片轮播', en: 'IMAGE GALLERY', href: '#gallery-showcase' }
]

const WAVE = Array.from({ length: 24 }, (_, i) => 24 + ((i * 29) % 60))

// 这四个视频已移入创意短片页：首页只展示静态海报，点击跳转到创意短片页播放
const SHORTS = [
  { no: '02', file: '/works/hero/hero-02.mp4', cn: '海鸥掠岸', en: 'SEAGULLS' },
  { no: '03', file: '/works/hero/hero-03.mp4', cn: '网格隧道', en: 'GRID TUNNEL' },
  { no: '04', file: '/works/hero/hero-04.mp4', cn: '蜜蜂低飞', en: 'BEE LOW FLIGHT' },
  { no: '05', file: '/works/hero/hero-05.mp4', cn: '余烬与浓烟', en: 'EMBERS & SMOKE' }
]

export default function Hero({ video }) {
  const scope = useRef(null)
  const mainVideoRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const v = mainVideoRef.current
      if (v) {
        v.load()
        v.play().catch(() => {})
      }
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  const goShorts = (file) => {
    window.dispatchEvent(new CustomEvent('shorts:play', { detail: { file } }))
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
          className="hero__video"
          ref={mainVideoRef}
          muted
          loop
          playsInline
          preload="none"
          src={asset(video)}
          aria-hidden="true"
        />
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
          <span className="hero__car-index mono">CREATIVE SHORTS // 04</span>
        </div>

        <div className="hero__strips">
          {SHORTS.map((s) => (
            <div className="hero__strip" key={s.no}>
              <div className="hero__wave" aria-hidden="true">
                {WAVE.map((h, k) => (
                  <span key={k} style={{ height: `${h}%`, animationDelay: `${(k % 6) * 0.08}s` }} />
                ))}
              </div>
              <a
                className="hero__car-thumb"
                href="#shorts-showcase"
                onClick={() => goShorts(s.file)}
                aria-label={s.cn}
              >
                <img src={asset(s.file.replace(/\.mp4$/, '-poster.jpg'))} alt={s.cn} loading="lazy" decoding="async" />
                <span className="mono">{s.no}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
