import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ParallaxRise({
  children,
  className = '',
  amount = 110,
  scale = 1.04,
  fromOpacity = 0.3,
  end = 'top 10%',
  scrub = 0.7
}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          y: amount,
          scale,
          opacity: fromOpacity,
          transformOrigin: '50% 0%'
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end,
            scrub
          }
        }
      )
    }, el)
    return () => ctx.revert()
  }, [amount, scale, fromOpacity, end, scrub])

  return (
    <div ref={ref} className={`px-rise ${className}`.trim()}>
      {children}
    </div>
  )
}
