import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260723_145606_ab143199-b593-4941-bb1b-9afca215416b.mp4'

const IMAGES = [
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260723_152456_65bd59eb-4e9c-4be8-82eb-2aadd5b91e03.png&w=1920&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260723_152522_96817909-a45f-4d68-9509-f399dda97419.png&w=1920&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260723_152537_150da197-35c4-483c-bd9e-ebcf9335a640.png&w=1920&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260723_152546_2e114d2c-293d-4c42-89e5-da7eddcfbfa3.png&w=1920&q=85'
]

const N = IMAGES.length

export default function GalleryShowcase() {
  const [active, setActive] = useState(2)

  // 本页在视口内时隐藏全站导航，避免双导航冲突
  useEffect(() => {
    const sec = document.getElementById('gallery-showcase')
    if (!sec) return
    const io = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle('hide-site-nav', entry.isIntersecting && entry.intersectionRatio > 0.35)
      },
      { threshold: [0.2, 0.35, 0.6] }
    )
    io.observe(sec)
    return () => {
      io.disconnect()
      document.body.classList.remove('hide-site-nav')
    }
  }, [])

  const prev = () => setActive((a) => (a - 1 + N) % N)
  const next = () => setActive((a) => (a + 1) % N)

  return (
    <section className="gallery-showcase flow" id="gallery-showcase">
      {/* 背景视频（整页循环播放） */}
      <video className="flow__bg" src={BG_VIDEO} autoPlay loop muted playsInline aria-hidden="true" />

      {/* 内容层 */}
      <div className="flow__content">
        {/* ZONE A — 顶部 */}
        <div className="flow__top">
          <span className="flow__logo">V — IX</span>
          <p className="flow__blurb">
            Let your gaze wander and linger. Pass over each frame to uncover what li...
          </p>
        </div>

        {/* ZONE B — 中部 */}
        <div className="flow__mid">
          <h1 className="flow__headline">
            Form &amp;
            <br />
            Function
          </h1>
          <p className="flow__copy">
            Every frame holds a piece of an unfolding story — surfaces, forms, and gestures caught in transit. Wander
            through the arrangements with silent observation.
          </p>
          <div className="flow__cta-wrap">
            <i className="flow__bracket flow__bracket--tl" />
            <i className="flow__bracket flow__bracket--tr" />
            <i className="flow__bracket flow__bracket--bl" />
            <i className="flow__bracket flow__bracket--br" />
            <button className="flow__cta" type="button">
              Reveal Hidden
            </button>
          </div>
        </div>

        {/* ZONE C — 底部 */}
        <div className="flow__bottom">
          <div className="flow__arrows">
            <span className="flow__arrow-wrap">
              <i className="flow__mini flow__mini--tl" />
              <i className="flow__mini flow__mini--tr" />
              <i className="flow__mini flow__mini--bl" />
              <i className="flow__mini flow__mini--br" />
              <button className="flow__arrow" type="button" onClick={prev} aria-label="Previous">
                <ArrowLeft size={18} />
              </button>
            </span>
            <span className="flow__arrow-wrap">
              <i className="flow__mini flow__mini--tl" />
              <i className="flow__mini flow__mini--tr" />
              <i className="flow__mini flow__mini--bl" />
              <i className="flow__mini flow__mini--br" />
              <button className="flow__arrow" type="button" onClick={next} aria-label="Next">
                <ArrowRight size={18} />
              </button>
            </span>
          </div>

          <div className="flow__side">
            <span className="flow__counter">
              {String(active + 1).padStart(2, '0')}/{String(N).padStart(2, '0')}
            </span>
            <div className="flow__thumbs">
              {IMAGES.map((src, i) => (
                <button
                  key={i}
                  className={`flow__thumb${i === active ? ' is-active' : ''}`}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Slide ${i + 1}`}
                >
                  <img src={src} alt="" />
                  {i === active && (
                    <span className="flow__frame" aria-hidden="true">
                      <i className="flow__dot flow__dot--tl" />
                      <i className="flow__dot flow__dot--tr" />
                      <i className="flow__dot flow__dot--bl" />
                      <i className="flow__dot flow__dot--br" />
                      <i className="flow__dot flow__dot--tm" />
                      <i className="flow__dot flow__dot--bm" />
                      <i className="flow__dot flow__dot--lm" />
                      <i className="flow__dot flow__dot--rm" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
