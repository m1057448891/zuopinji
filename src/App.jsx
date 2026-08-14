import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import SectorsShowcase from './components/SectorsShowcase.jsx'
import ShortsShowcase from './components/ShortsShowcase.jsx'
import AdsShowcase from './components/AdsShowcase.jsx'
import ToolsShowcase from './components/ToolsShowcase.jsx'
import CarouselShowcase from './components/CarouselShowcase.jsx'
import LazyGallery from './components/LazyGallery.jsx'
import LazyContact from './components/LazyContact.jsx'
import ShapeGrid from './components/ShapeGrid.jsx'
import IntroLoader from './components/IntroLoader.jsx'
gsap.registerPlugin(ScrollTrigger)

const HERO_BG = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260723_145606_ab143199-b593-4941-bb1b-9afca215416b.mp4'

export default function App() {
  const [heroVideo] = useState(HERO_BG)

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
          href === '#carousel-showcase' ||
          href === '#ads-showcase'
            ? 0
            : -72
        lenis.scrollTo(
          target.getBoundingClientRect().top + window.scrollY + offset,
          { duration: 1.4 }
        )
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
          <CarouselShowcase />
        </div>
        <LazyGallery />
      </main>
      <LazyContact />
    </div>
  )
}
