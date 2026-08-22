import { Suspense, lazy, useEffect, useState } from 'react'
import useInView from '../lib/useInView.js'

const Contact = lazy(() => import('./Contact.jsx'))

export default function LazyContact() {
  const [ref, inView] = useInView('0px 0px 1200px 0px')
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (inView) setShow(true)
  }, [inView])

  return (
    <div ref={ref} id="contact" className="lazy-contact" style={{ minHeight: 'calc(100vh / var(--fit, 1))' }}>
      {show && (
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
      )}
    </div>
  )
}

