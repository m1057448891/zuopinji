import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/content.js'
import Reveal from './Reveal.jsx'
import SectionHead from './SectionHead.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const scope = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.portrait',
        { yPercent: 10 },
        {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: '.about__grid', start: 'top bottom', end: 'bottom top', scrub: 1 }
        }
      )
      gsap.utils.toArray('.stat__value').forEach((el) => {
        const raw = el.textContent.trim()
        const num = parseFloat(raw)
        const suffix = raw.replace(/[\d.]/g, '')
        const obj = { v: 0 }
        gsap.to(obj, {
          v: num,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => {
            el.textContent = Math.round(obj.v) + suffix
          }
        })
      })
      gsap.utils.toArray('.timeline__item').forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, x: 48 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1,
            delay: (i % 3) * 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
          }
        )
      })
      gsap.fromTo(
        '.skill-block',
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.skill-blocks', start: 'top 88%', once: true }
        }
      )
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <section className="about section" id="about" ref={scope}>
      <div className="container">
        <Reveal>
          <SectionHead no="01" en="PROFILE" title="个人经历" label="个人介绍与经历" />
        </Reveal>

        <Reveal>
          <p className="about__manifesto">
            任何优秀的运营与视觉内容，都源自一个精准的「核心点」。
            <span className="mono about__manifesto-en">
              CONTENT, DESIGN, and AIGC — EVERY PIXEL WITH A PURPOSE.
            </span>
          </p>
        </Reveal>

        <div className="about__grid">
          <Reveal className="about__left">
            <div className="portrait">
              <div className="portrait__frame" aria-label="马中帅">
                <div className="portrait__mono">MZ</div>
                <div className="portrait__ring" aria-hidden="true" />
                <span className="portrait__caption mono">PORTRAIT · 待替换为个人照片</span>
              </div>
              <div className="portrait__contact">
                <div className="portrait__row">
                  <span className="mono portrait__label">PHONE</span>
                  <a href={`tel:+${profile.contact.phoneRaw}`}>{profile.contact.phone}</a>
                </div>
                <div className="portrait__row">
                  <span className="mono portrait__label">EMAIL</span>
                  <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
                </div>
                <div className="portrait__row">
                  <span className="mono portrait__label">BASE</span>
                  <span>{profile.contact.location}</span>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="about__right">
            <Reveal>
              <p className="about__role mono">
                {profile.role} — {profile.education}
              </p>
              <div className="about__intro">
                {profile.intro.map((p) => (
                  <p key={p.slice(0, 12)}>{p}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="stats">
                {profile.stats.map((s) => (
                  <div className="stat" key={s.label}>
                    <div className="stat__value">{s.value}</div>
                    <div className="stat__label">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="timeline">
                {profile.timeline.map((t) => (
                  <article className="timeline__item" key={t.org + t.role}>
                    <div className="timeline__marker" aria-hidden="true" />
                    <div className="timeline__head">
                      <span className="timeline__tag mono">{t.tag}</span>
                      <h3>{t.org}</h3>
                      <span className="timeline__role">{t.role}</span>
                      <span className="timeline__period mono">{t.period}</span>
                    </div>
                    <p className="timeline__desc">{t.desc}</p>
                  </article>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="awards">
                <h4 className="mono awards__title">AWARDS / 获奖经历</h4>
                <ul className="awards__list">
                  {profile.awards.map((a, i) => (
                    <li key={`${a}-${i}`}>{a}</li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="skill-blocks">
                <div className="skill-block">
                  <span className="mono skill-block__label">设计软件</span>
                  <div className="skill-block__tags">
                    {profile.skills.design.map((s) => <span key={s}>{s}</span>)}
                  </div>
                </div>
                <div className="skill-block">
                  <span className="mono skill-block__label">音视频</span>
                  <div className="skill-block__tags">
                    {profile.skills.media.map((s) => <span key={s}>{s}</span>)}
                  </div>
                </div>
                <div className="skill-block">
                  <span className="mono skill-block__label">AI 工具链</span>
                  <div className="skill-block__tags">
                    {profile.skills.ai.map((s) => <span key={s}>{s}</span>)}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal>
          <div className="about__cloud">
            {[...profile.skills.ai, ...profile.skills.design, ...profile.skills.media].map((s) => (
              <span className="mono" key={s}>
                {s}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
