import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'Home', href: '#top', id: 'top' },
  { label: 'Product', href: '#image-works', id: 'image-works' },
  { label: 'Case Studies', href: '#ads-showcase', id: 'ads-showcase' },
  { label: 'Contact', href: '#contact', id: 'contact' }
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('top')

  useEffect(() => {
    let raf = 0
    const update = () => {
      const probe = window.scrollY + window.innerHeight * 0.38
      let current = 'top'
      for (const link of LINKS) {
        const el = document.getElementById(link.id)
        if (!el) continue
        if (el.offsetTop <= probe) current = link.id
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

  return (
    <header className={`ln-nav${open ? ' is-open' : ''}`}>
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
