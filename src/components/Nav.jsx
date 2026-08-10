import { useEffect, useState } from 'react'

const links = [
  { href: '#image-works', label: '图片作品', en: 'IMAGES' },
  { href: '#shorts-showcase', label: '创意短片', en: 'SHORTS' },
  { href: '#ads-showcase', label: '商业广告', en: 'ADS' },
  { href: '#carousel-showcase', label: '视频轮播', en: 'MOTION REEL' },
  { href: '#gallery-showcase', label: '图片轮播', en: 'IMAGE GALLERY' }
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a className="nav__logo" href="#top" aria-label="回到顶部">
          <span className="nav__logo-text mono">STUDIO</span>
        </a>
        <nav className="nav__links" aria-label="主导航">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              <span className="nav__link-en">{l.en}</span>
              <span>{l.label}</span>
            </a>
          ))}
        </nav>
        <a className="btn btn--ghost nav__cta" href="#contact">
          联系我
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
        </a>
      </div>
    </header>
  )
}
