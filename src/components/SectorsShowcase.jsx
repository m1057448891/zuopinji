import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import worksData from '../data/works.json'
import { asset } from '../lib/asset.js'
import useInView from '../lib/useInView.js'

gsap.registerPlugin(ScrollTrigger)

const works = worksData.works
const DARK_IMAGES = ['img-008.png', 'img-009.png', 'img-011.png', 'img-022.png']
const images = works.filter(
  (w) => w.type === 'image' && !DARK_IMAGES.includes(w.file.split('/').pop())
)

const RINGS = [
  { count: 12, dir: 1 },
  { count: 14, dir: -1 },
  { count: 12, dir: 1 }
]

const TAGS = ['（ 極簡海報 ）', '（ 商業視覺 ）', '（ 概念插畫 ）', '（ AI 圖像・影像 ）']

export default function SectorsShowcase() {
  let offset = 0
  const [sectionRef, inView] = useInView('0px 0px -80px 0px')

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 600px)', () => {
      const ctx = gsap.context(() => {
        const durations = [40, 48, 56]
        const ringTweens = durations.map((dur, i) =>
          gsap.to(`.sectors__ring--${i + 1}`, {
            rotation: 360 * RINGS[i].dir,
            repeat: -1,
            ease: 'none',
            duration: dur,
            transformOrigin: '50% 50%'
          })
        )

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.sectors',
            start: 'top bottom',
            end: 'top top',
            scrub: 1
          }
        })
        RINGS.forEach((ring, i) => {
          tl.fromTo(
            `.sectors__ring--${i + 1} .sectors__ring-scale`,
            { scale: 0.28 },
            {
              scale: 1,
              ease: 'none',
              immediateRender: true
            },
            0
          )
        })

        const p1 = { v: 0.25 }
        const p2 = { v: 0.25 }
        const p3 = { v: 0.25 }
        tl.to(
          [p1, p2, p3],
          {
            v: 1,
            ease: 'none',
            onUpdate: () => {
              ringTweens[0].timeScale(p1.v)
              ringTweens[1].timeScale(p2.v)
              ringTweens[2].timeScale(p3.v)
            }
          },
          0
        )

        gsap.fromTo(
          '.sectors',
          { scale: 1, opacity: 1, filter: 'blur(0px)' },
          {
            scale: 1.035,
            opacity: 0.08,
            filter: 'blur(4px)',
            ease: 'power1.inOut',
            scrollTrigger: {
              trigger: '.sectors',
              start: 'top top',
              end: 'bottom top',
              scrub: 1
            }
          }
        )
      })
      return () => ctx.revert()
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="sectors" id="image-works" ref={sectionRef}>
      <div className="sectors__grain" aria-hidden="true" />

      {RINGS.map((ring, ri) => {
        const items = Array.from(
          { length: ring.count },
          (_, i) => images[(offset + i) % images.length]
        )
        offset += ring.count
        const vw = window.innerWidth
        const radii = [vw * 0.18, vw * 0.3, vw * (0.5 - 0.031)]
        const sizes = [vw * 0.038, vw * 0.05, vw * 0.062]
        return (
          <div
            className={`sectors__ring sectors__ring--${ri + 1} ${
              ring.dir === -1 ? 'sectors__ring--reverse' : ''
            }`}
            key={ri}
            aria-hidden="true"
          >
            <div className="sectors__ring-scale">
              {items.map((item, i) => {
                const a = (i / ring.count) * Math.PI * 2 + ri * 0.35
                const angleDeg = (a * 180) / Math.PI
                const jitter = ((i * 17) % 9) - 4
                return (
                  <img
                    key={`${item.id}-${ri}-${i}`}
                    className="sectors__thumb"
                    src={inView ? asset(item.file) : undefined}
                    alt=""
                    decoding="async"
                    onError={(e) => {
                      const img = e.currentTarget
                      if (!img.dataset.fb) {
                        img.dataset.fb = '1'
                        img.src = asset('/works/img/img-001.png')
                      }
                    }}
                    style={{
                      left: `calc(50% + ${Math.cos(a) * radii[ri]}px)`,
                      top: `calc(50% + ${Math.sin(a) * radii[ri]}px)`,
                      width: `${sizes[ri]}px`,
                      '--tilt': `${angleDeg + jitter}deg`
                    }}
                  />
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="sectors__center">
        <h2 className="sectors__title">THE SECTORS</h2>
        <p className="mono sectors__sub">
          DEFINING THE CORE DNA OF
          <span>IMAGE AESTHETICS</span>
        </p>
        <div className="mono sectors__meta">
          <span>{images.length}_IMAGE_WORKS</span>
          <span>4_POSTERS</span>
          <span>ESTABLISHED_2026</span>
        </div>
        <span className="sectors__line" aria-hidden="true" />
        <span className="sectors__logo-wrap" aria-hidden="true">
          <span className="sectors__logo">MZ</span>
        </span>
        <p className="sectors__cn">图片作品 · AI 视觉与数字整合</p>
        <div className="mono sectors__tags">
          {TAGS.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      <span className="sectors__vertical mono" aria-hidden="true">
        IMAGE WORKS
      </span>
      <p className="sectors__down mono">DOWN ▾</p>
    </section>
  )
}
