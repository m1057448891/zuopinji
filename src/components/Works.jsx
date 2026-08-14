import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import worksData from '../data/works.json'
import Reveal from './Reveal.jsx'
import SectionHead from './SectionHead.jsx'
import ImageShowcase from './ImageShowcase.jsx'
import { asset } from '../lib/asset.js'

gsap.registerPlugin(ScrollTrigger)

const works = worksData.works

const matchText = (w, re) => re.test(w.original) || re.test(w.title)

const ads = works.filter((w) =>
  matchText(w, /商业产品|广告|KF1|筋膜枪|果酒|量子纤维|游戏手柄/)
)
const posters = works.filter(
  (w) => !ads.includes(w) && matchText(w, /海报|封面|广告创意|艺术海报/)
)
const images = works.filter(
  (w) => w.type === 'image' && !posters.includes(w) && !ads.includes(w)
)
const shorts = works.filter((w) => w.type === 'video' && !ads.includes(w))

const featuredKeys = [
  'jimeng-2026-03-20-3032',
  'jimeng-2026-03-18-1985',
  'jimeng-2026-03-23-5237',
  'jimeng-2026-05-09-1427',
  'jimeng-2026-03-25-6056',
  'jimeng-2026-03-29-2437'
]

const cubeKeys = [
  'jimeng-2026-03-20-3032',
  'jimeng-2026-03-18-1985',
  'jimeng-2026-05-09-1427',
  'jimeng-2026-03-21-6486',
  'jimeng-2026-08-07-5151',
  'jimeng-2026-03-23-5596'
]

function WorkCard({ item, variant = '', index }) {
  const videoRef = useRef(null)

  const handleEnter = (e) => {
    const v = videoRef.current
    if (v) v.play().catch(() => {})
    e.currentTarget.classList.add('work-card--hover')
  }
  const handleLeave = (e) => {
    const v = videoRef.current
    if (v) v.pause()
    e.currentTarget.classList.remove('work-card--hover')
  }

  return (
    <article
      className={`work-card ${variant}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="work-card__media">
        {item.type === 'video' ? (
          <video
            ref={videoRef}
            src={asset(item.file)}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={item.title}
          />
        ) : (
          <img src={asset(item.file)} alt={item.title} loading={index < 2 ? 'eager' : 'lazy'} />
        )}
      </div>
      <div className="work-card__overlay">
        <div className="work-card__top">
          <span className="work-card__type mono">
            {item.type === 'video' ? 'VIDEO / 动态影像' : 'IMAGE / 视觉作品'}
          </span>
          <span className="work-card__date mono">{item.date}</span>
        </div>
        <div className="work-card__bottom">
          <h3 className="work-card__title">{item.title}</h3>
          <span className="work-card__arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8" /></svg>
          </span>
        </div>
      </div>
      <a className="work-card__link" href={asset(item.file)} target="_blank" rel="noreferrer">
        <span className="visually-hidden">打开作品：{item.title}</span>
      </a>
    </article>
  )
}

function CategoryBlock({ id, no, en, title, items }) {
  return (
    <div className="work-cat" id={id}>
      <div className="work-cat__head">
        <span className="mono work-cat__en">
          {no} // {en}
        </span>
        <h3>{title}</h3>
        <span className="mono work-cat__count">{items.length} WORKS</span>
      </div>
      <div className="gallery">
        {items.map((w, i) => (
          <Reveal key={w.id} delay={(i % 4) * 50}>
            <WorkCard item={w} index={i} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default function Works() {
  const scope = useRef(null)
  const featured =
    featuredKeys
      .map((k) => works.find((w) => w.original.includes(k)))
      .filter(Boolean)
      .slice(0, 6)
  const cubeItems = cubeKeys.map((k) => works.find((w) => w.original.includes(k))).filter(Boolean)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.work-card__media').forEach((media) => {
        gsap.fromTo(
          media,
          { yPercent: -6, scale: 1.1 },
          {
            yPercent: 6,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: 1 }
          }
        )
      })
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <section className="works section" id="works" ref={scope}>
      <div className="container">
        <Reveal>
          <SectionHead no="02" en="SELECTED WORKS" title="精选项目" label="AI 视觉与动态影像" />
        </Reveal>

        <Reveal>
          <ImageShowcase items={cubeItems} />
        </Reveal>

        <CategoryBlock id="image-gallery" no="01" en="IMAGE WORKS" title="图片作品" items={images} />
        <CategoryBlock id="posters" no="02" en="POSTERS" title="海报" items={posters} />
        <CategoryBlock id="ads" no="03" en="STYLE EFFECTS" title="风格效果" items={ads} />
        <CategoryBlock id="shorts" no="04" en="CREATIVE SHORTS" title="创意短片" items={shorts} />
      </div>
    </section>
  )
}
