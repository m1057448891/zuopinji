import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ParallaxRise({
  children,
  className = '',
  amount = 90,
  scale = 1.035,
  fromOpacity = 0.35,
  blur = 4,
  start = 'top bottom',
  end = 'top 8%'
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
          filter: `blur(${blur}px)`,
          transformOrigin: '50% 0%'
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: 0.6
          }
        }
      )
    }, el)
    return () => ctx.revert()
  }, [amount, scale, fromOpacity, blur, start, end])

  return (
    <div ref={ref} className={`px-rise ${className}`.trim()}>
      {children}
    </div>
  )
}
