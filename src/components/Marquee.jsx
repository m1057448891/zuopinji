import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Marquee({ items, reverse = false }) {
  const rootRef = useRef(null)
  const scrollRef = useRef(null)
  const row = items.join('　·　')

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        scrollRef.current,
        { x: reverse ? 40 : -40 },
        {
          x: reverse ? -40 : 40,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
        }
      )
    })
    return () => ctx.revert()
  }, [reverse])

  return (
    <div
      className={`marquee ${reverse ? 'marquee--reverse' : ''}`}
      ref={rootRef}
      aria-hidden="true"
    >
      <div className="marquee__scroll" ref={scrollRef}>
        <div className="marquee__track">
          <span>{row}</span>
          <span>{row}</span>
        </div>
      </div>
    </div>
  )
}
