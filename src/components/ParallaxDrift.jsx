import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ParallaxDrift({
  children,
  className = '',
  trigger = null,
  amount = 90,
  toOpacity = 0.94,
  toScale = 1,
  scrub = 0.7
}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const triggerEl = trigger
      ? document.querySelector(trigger)
      : el
    if (!triggerEl) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 0, opacity: 1, scale: 1, transformOrigin: '50% 50%' },
        {
          y: -amount,
          opacity: toOpacity,
          scale: toScale,
          ease: 'none',
          scrollTrigger: {
            trigger: triggerEl,
            start: 'bottom bottom',
            end: 'bottom top',
            scrub
          }
        }
      )
    }, el)
    return () => ctx.revert()
  }, [trigger, amount, toOpacity, toScale, scrub])

  return (
    <div ref={ref} className={`px-rise ${className}`.trim()}>
      {children}
    </div>
  )
}
