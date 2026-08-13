import { useEffect, useRef, useState } from 'react'

const BG =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4'

const STATS = [
  { icon: '<', target: 120, suffix: 'ms', decimals: 0, label: 'Inference Time' },
  { icon: '%', target: 99.99, suffix: '%', decimals: 2, label: 'Platform Uptime' },
  { icon: '*', target: 24, suffix: '/7', decimals: 0, label: 'Autonomous Runtime' },
  { icon: '#', target: 2.4, suffix: 'M', decimals: 1, label: 'Context Windows' }
]

function Stat({ stat, index }) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const delay = 480 + index * 90
    const duration = 1500 + index * 80
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now() + delay
        const tick = (now) => {
          const t = Math.min(1, Math.max(0, (now - start) / duration))
          const eased = 1 - Math.pow(1 - t, 3)
          setValue(stat.target * eased)
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.25 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [stat.target, index])

  return (
    <div
      className="ln-stat anim"
      style={{ '--d': `${0.5 + index * 0.08}s` }}
      ref={ref}
    >
      <span className="ln-stat__icon" aria-hidden="true">
        {stat.icon}
      </span>
      <span className="ln-stat__value">
        {value.toFixed(stat.decimals)}
        {stat.suffix}
      </span>
      <span className="ln-stat__label">{stat.label}</span>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="landing" id="top">
      <div className="landing__bg" aria-hidden="true">
        <video
          className="landing__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/works/hero/hero-01-poster.jpg"
        >
          <source src={BG} type="video/mp4" />
        </video>
      </div>

      <div className="landing__body">
        <div className="landing__trust anim" style={{ '--d': '0.05s' }}>
          <span className="ln-avatar ln-avatar--1">
            <i className="fa-brands fa-microsoft" aria-hidden="true" />
          </span>
          <span className="ln-avatar ln-avatar--2">
            <i className="fa-brands fa-amazon" aria-hidden="true" />
          </span>
          <span className="ln-avatar ln-avatar--3">
            <i className="fa-brands fa-google" aria-hidden="true" />
          </span>
          <span className="ln-trust">Trusted by 2000+ Enterprises</span>
        </div>

        <h1 className="landing__headline">
          <span className="landing__line" style={{ '--d': '0.12s' }}>
            Intelligence
          </span>
          <span className="landing__line" style={{ '--d': '0.3s' }}>
            Designed To Evolve
          </span>
        </h1>

        <p className="landing__sub anim" style={{ '--d': '0.28s' }}>
          Build applications that reason, adapt and collaborate using a modular
          AI platform designed for production.
        </p>

        <a
          className="landing__cta anim"
          style={{ '--d': '0.4s' }}
          href="#image-works"
        >
          Get Started
        </a>
      </div>

      <footer className="landing__stats">
        {STATS.map((stat, i) => (
          <Stat key={stat.label} stat={stat} index={i} />
        ))}
      </footer>
    </section>
  )
}
