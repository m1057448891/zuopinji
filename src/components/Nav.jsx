import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const LINKS = [
  { label: '首页', href: '#top', id: 'top' },
  { label: '图片作品', href: '#image-works', id: 'image-works' },
  { label: '创意短片', href: '#shorts-showcase', id: 'shorts-showcase' },
  { label: '风格效果', href: '#ads-showcase', id: 'ads-showcase' },
  { label: '竖屏视频', href: '#portrait-showcase', id: 'portrait-showcase' },
  { label: '图片轮播', href: '#gallery-showcase', id: 'gallery-showcase' },
  { label: 'Skill搭建', href: '#tools-showcase', id: 'tools-showcase' },
  { label: '联系我', href: '#contact', id: 'contact' }
]

function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

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
      if (window.innerWidth > 900) setOpen(false)
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
        <nav className="ln-pill" aria-label="Main">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.href}
              className={active === l.id ? 'is-active' : ''}
            >
              {active === l.id && (
                <motion.span
                  className="ln-active-pill"
                  layoutId="lnActivePill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="ln-pill__label">{l.label}</span>
            </a>
          ))}
        </nav>

        <button
          className="ln-burger"
          type="button"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      <div
        className={`ln-overlay${open ? ' is-open' : ''}`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            className="ln-sheet"
            initial={{ opacity: 0, x: '-50%', y: -14, scale: 0.98 }}
            animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
            exit={{ opacity: 0, x: '-50%', y: -14, scale: 0.98 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={l.href}
                className={active === l.id ? 'is-active' : ''}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
