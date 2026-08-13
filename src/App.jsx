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
import GalleryShowcase from './components/GalleryShowcase.jsx'
import LazyContact from './components/LazyContact.jsx'
import worksData from './data/works.json'

gsap.registerPlugin(ScrollTrigger)

const works = worksData.works

function resolveAsset(key, type) {
  return works.find((w) => w.original.includes(key) && (!type || w.type === type)) || null
}

export default function App() {
  const [heroVideo, setHeroVideo] = useState(null)

  useEffect(() => {
    const video =
      resolveAsset('0001-0150', 'video') ||
      works.find((w) => w.type === 'video')
    setHeroVideo(video?.file || '/works/vid/vid-001.mp4')
  }, [])

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
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
        lenis.scrollTo(target, {
          offset: href === '#contact' || href === '#tools-showcase' ? 0 : -72,
          duration: 1.4
        })
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <div className="site">
      <Nav />
      <main>
        <Hero video={heroVideo} />
        <SectorsShowcase />
        <ShortsShowcase />
        <AdsShowcase />
        <ToolsShowcase />
        <CarouselShowcase />
        <GalleryShowcase />
      </main>
      <LazyContact />
    </div>
  )
}
