import { useEffect, useState } from 'react'

const LINKS = [
  { label: '首页', href: '#top', id: 'top' },
  { label: '图片作品', href: '#image-works', id: 'image-works' },
  { label: '创意短片', href: '#shorts-showcase', id: 'shorts-showcase' },
  { label: '商业广告', href: '#ads-showcase', id: 'ads-showcase' },
  { label: 'Skill搭建', href: '#tools-showcase', id: 'tools-showcase' },
  { label: '视频轮播', href: '#carousel-showcase', id: 'carousel-showcase' },
  { label: '图片轮播', href: '#gallery-showcase', id: 'gallery-showcase' },
  { label: '联系我', href: '#contact', id: 'contact' }
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('top')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let raf = 0
    const pageStart = (id) => {
      if (id === 'shorts-showcase') {
        const sectors = document.getElementById('image-works')
        if (sectors) {
          const r = sectors.getBoundingClientRect()
          return r.top + window.scrollY + r.height
        }
      }
      const el = document.getElementById(id)
      return el ? el.getBoundingClientRect().top + window.scrollY : Infinity
    }
    const update = () => {
      const probe = window.scrollY + window.innerHeight * 0.38
      let current = 'top'
      for (const link of LINKS) {
        if (pageStart(link.id) <= probe) current = link.id
      }
      setActive(current)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth > 720) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 90)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`ln-nav${open ? ' is-open' : ''}${scrolled ? ' ln-nav--scrolled' : ''}`}
    >
      <div className="ln-nav__row">
        <a className="ln-logo" href="#top" aria-label="Home">
          <img src="/assets/logo.webp" alt="" width="52" height="52" />
        </a>

        <nav className="ln-pill" aria-label="Main">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.href}
              className={active === l.id ? 'is-active' : ''}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a className="ln-signin" href="#contact">
          Sign in
        </a>

        <button
          className="ln-burger"
          type="button"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <i />
          <i />
          <i />
        </button>
      </div>

      <div
        className={`ln-overlay${open ? ' is-open' : ''}`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      <div className={`ln-sheet${open ? ' is-open' : ''}`} aria-hidden={!open}>
        {LINKS.map((l, i) => (
          <a
            key={l.id}
            href={l.href}
            className={active === l.id ? 'is-active' : ''}
            style={{ '--i': i }}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
        <a
          className="ln-sheet__signin"
          href="#contact"
          style={{ '--i': LINKS.length }}
          onClick={() => setOpen(false)}
        >
          Sign in
        </a>
      </div>
    </header>
  )
}
