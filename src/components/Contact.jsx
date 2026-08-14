import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/content.js'
import Reveal from './Reveal.jsx'
import Aurora from './Aurora.jsx'
import TrueFocus from './TrueFocus.jsx'
import { asset } from '../lib/asset.js'
import { RESUME_URL } from '../data/site.js'

gsap.registerPlugin(ScrollTrigger)

const LOGOS = [
  { name: 'CAD', src: 'https://cdn.simpleicons.org/autocad?color=0a1b33' },
  { name: 'SU', src: 'https://cdn.simpleicons.org/sketchup?color=0a1b33' },
  { name: 'PS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg' },
  { name: 'PR', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-original.svg' },
  { name: 'AE', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg' },
  { name: 'AU', src: 'https://svgl.app/library/audition.svg' },
  { name: 'AI', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg' },
  { name: 'C4D', src: 'https://cdn.simpleicons.org/cinema4d?color=0a1b33' },
  { name: 'Blender', src: 'https://cdn.simpleicons.org/blender?color=0a1b33' },
  { name: 'D5', src: null },
  { name: 'Word', src: null },
  { name: 'Excel', src: null },
  { name: 'PPT', src: null },
  { name: 'Codex', src: 'https://svgl.app/library/openai.svg' },
  { name: 'Claude', src: 'https://cdn.simpleicons.org/anthropic?color=0a1b33' },
  { name: 'OpenClaw', src: null },
  { name: 'SD', src: null },
  { name: 'ComfyUI', src: null },
  { name: '即梦', src: null },
  { name: '可灵', src: null },
  { name: 'LibLib', src: null }
]

function GlassLogo({ logo }) {
  const [failed, setFailed] = useState(false)
  const showText = !logo.src || failed
  return (
    <div className="contact__glass-card">
      {showText ? (
        <span className="contact__glass-text">{logo.name}</span>
      ) : (
        <img
          className="contact__glass-img"
          src={logo.src}
          alt={logo.name}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

export default function Contact() {
  const scope = useRef(null)
  const [clock, setClock] = useState('')
  const [qrOpen, setQrOpen] = useState(false)

  useEffect(() => {
    const tick = () => {
      setClock(new Date().toLocaleTimeString('en-GB', { hour12: false }))
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact__title-char',
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.05,
          scrollTrigger: { trigger: '.contact', start: 'top 74%', once: true }
        }
      )
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <section className="contact" ref={scope}>
      <div className="contact__grain" aria-hidden="true" />
      <div className="contact__aurora" aria-hidden="true">
        <Aurora
          colorStops={['#c4b5fd', '#a5b4fc', '#f0abfc']}
          blend={0.6}
          amplitude={0.9}
          speed={0.5}
        />
      </div>
      <span className="contact__coords mono">MOSATO SAKAI · 42.0°N 121.7°E</span>

      <div className="container contact__inner">
        <header className="contact__top">
          <div className="contact__weather">
            <span className="contact__sun" aria-hidden="true">
              &#9728;
            </span>
            <div className="mono">
              <span>LIAONING · FU XIN</span>
              <span>AVAILABLE · 可接项目</span>
            </div>
          </div>
          <nav className="contact__topnav mono">
            {RESUME_URL && (
              <a href={RESUME_URL} target="_blank" rel="noreferrer">
                作品集 PDF ↗
              </a>
            )}
            <a href="#top">回到顶部 ↑</a>
          </nav>
        </header>

        <Reveal>
          <div className="contact__focus">
            <TrueFocus
              sentence="马中帅 MOSATO SAKAI"
              separator=" "
              blurAmount={3}
              borderColor="#6d28d9"
              glowColor="rgba(109, 40, 217, 0.55)"
              animationDuration={0.6}
              pauseBetweenAnimations={1.2}
            />
          </div>
          <p className="contact__sub mono">
            {profile.nameEn} · 内容运营 × AI 视觉创作 × 建筑学背景
          </p>
        </Reveal>

        <div className="contact__cols">
          <Reveal delay={80}>
            <div className="contact__col">
              <h3 className="mono">PRIMARY</h3>
              <span className="contact__col-rule" aria-hidden="true" />
              <a href="#image-works">图片作品</a>
              <a href="#shorts-showcase">创意短片</a>
              <a href="#ads-showcase">风格效果</a>
              <a href="#tools-showcase">Skill搭建</a>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="contact__col">
              <h3 className="mono">CONTACT</h3>
              <span className="contact__col-rule" aria-hidden="true" />
              <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
              <a href={`tel:+${profile.contact.phoneRaw}`}>{profile.contact.phone}</a>
              <span>{profile.contact.qq} · QQ</span>
              <span>{profile.contact.location}</span>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="contact__col">
              <h3 className="mono">MORE</h3>
              <span className="contact__col-rule" aria-hidden="true" />
              {RESUME_URL && (
                <a href={RESUME_URL} target="_blank" rel="noreferrer">
                  建筑学作品集 PDF ↓
                </a>
              )}
              <a href="#top">返回顶部 ↑</a>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="contact__col contact__col--qr">
              <h3 className="mono">WECHAT / 微信</h3>
              <span className="contact__col-rule" aria-hidden="true" />
              <button
                className="contact__qr"
                type="button"
                onClick={() => setQrOpen(true)}
                aria-label="放大微信二维码"
              >
                <img src={asset('/works/img/wechat-qr.jpg')} alt="微信二维码" loading="lazy" />
              </button>
              <span className="contact__qr-note">扫码添加，随时沟通</span>
            </div>
          </Reveal>
        </div>

        <div className="contact__glass">
          <span className="mono contact__glass-label">SKILLS / 擅长软件</span>
          <div className="contact__glass-track">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <GlassLogo key={`${logo.name}-${i}`} logo={logo} />
            ))}
          </div>
        </div>

        <div className="contact__dots" aria-hidden="true" />

        <footer className="contact__meta">
          <div className="mono">
            <span>© 2026 {profile.name} · {profile.nameEn}</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
          <div className="mono">
            <span>LIAONING · FU XIN</span>
            <span>{clock}</span>
          </div>
          <div className="mono contact__slogan">
            <span>LET'S MAKE GOOD CONTENT CONNECT</span>
            <span className="contact__slashes" aria-hidden="true">
              //////////////////////////
            </span>
          </div>
        </footer>
      </div>

      <div className="contact__brand" aria-hidden="true">
        MOSATO
      </div>

      {qrOpen &&
        createPortal(
          <div className="contact__qr-modal" onClick={() => setQrOpen(false)}>
            <img src={asset('/works/img/wechat-qr.jpg')} alt="微信二维码" loading="lazy" />
          </div>,
          document.body
        )}
    </section>
  )
}
