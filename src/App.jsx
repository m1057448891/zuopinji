import { lazy, Suspense, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import SectorsShowcase from './components/SectorsShowcase.jsx'
import ShortsShowcase from './components/ShortsShowcase.jsx'
import AdsShowcase from './components/AdsShowcase.jsx'
import PortraitShowcase from './components/PortraitShowcase.jsx'
import ToolsShowcase from './components/ToolsShowcase.jsx'
import LazyGallery from './components/LazyGallery.jsx'
import LazyContact from './components/LazyContact.jsx'
import ShapeGrid from './components/ShapeGrid.jsx'
import IntroLoader from './components/IntroLoader.jsx'
gsap.registerPlugin(ScrollTrigger)

const HERO_BG = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260723_145606_ab143199-b593-4941-bb1b-9afca215416b.mp4'
const AxionShaderBg = lazy(() => import('./components/AxionShaderBg.jsx'))

export default function App() {
  const [heroVideo] = useState(HERO_BG)

  // 提前预加载图片轮播页（含 shader），避免点击导航时现加载导致卡顿
  useEffect(() => {
    const t = setTimeout(() => {
      import('./components/GalleryShowcase.jsx').catch(() => {})
    }, 1200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]')
      if (!link) return
      const href = link.getAttribute('href')
      if (href === '#' || href === '#top') {
        e.preventDefault()
        lenis.scrollTo(0, { duration: 1.2 })
        return
      }
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        if (href === '#shorts-showcase') {
          const sectors = document.querySelector('.sectors')
          const y = sectors
            ? sectors.offsetTop + sectors.offsetHeight
            : target.offsetTop
          lenis.scrollTo(y, { duration: 1.4 })
          return
        }
        const offset =
          href === '#contact' ||
          href === '#tools-showcase' ||
          href === '#gallery-showcase' ||
          href === '#ads-showcase' ||
          href === '#portrait-showcase'
            ? 0
            : -72
        const y = target.getBoundingClientRect().top + window.scrollY + offset
        lenis.scrollTo(y, {
          duration: 1.4,
          onComplete: () => {
            const top = target.getBoundingClientRect().top
            const expectedTop = -offset
            if (
              Math.abs(top - expectedTop) > 2 &&
              Math.abs(top - expectedTop) < 900
            ) {
              lenis.scrollTo(window.scrollY + (top - expectedTop), {
                duration: 0.5
              })
            }
          }
        })
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      delete window.__lenis
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <div className="site">
      <IntroLoader />
      <Nav />
      <main>
        <Hero video={heroVideo} />
        <SectorsShowcase />
        <ShortsShowcase />
        <AdsShowcase />
        <div className="ba-seamless">
          <div className="ba-seamless__bg" aria-hidden="true">
            <Suspense fallback={null}>
              <AxionShaderBg />
            </Suspense>
          </div>
          <PortraitShowcase />
          <LazyGallery />
        </div>
        <div className="grid-stage">
          <div className="grid-stage__bg" aria-hidden="true">
            <ShapeGrid
              direction="diagonal"
              speed={0.35}
              squareSize={44}
              borderColor="rgba(255,255,255,0.09)"
              hoverFillColor="rgba(156,195,255,0.22)"
              shape="square"
              hoverTrailAmount={6}
            />
          </div>
          <ToolsShowcase />
        </div>
      </main>
      <LazyContact />
    </div>
  )
}
