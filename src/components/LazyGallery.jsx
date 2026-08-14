import { Suspense, lazy, useEffect, useState } from 'react'
import useInView from '../lib/useInView.js'

const GalleryShowcase = lazy(() => import('./GalleryShowcase.jsx'))

export default function LazyGallery() {
  const [ref, inView] = useInView('0px 0px 1200px 0px')
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (inView) setShow(true)
  }, [inView])

  return (
    <div ref={ref} id="gallery-showcase" className="lazy-gallery">
      {show && (
        <Suspense fallback={null}>
          <GalleryShowcase />
        </Suspense>
      )}
    </div>
  )
}
