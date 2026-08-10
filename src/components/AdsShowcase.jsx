import { useEffect, useRef, useState } from 'react'

const PRODUCTS = [
  {
    file: '/works/ads/product-01.mp4',
    thumb: '/works/ads/thumbs/t1b.jpg',
    name: '耐克运动鞋',
    en: 'NIKE SNEAKER — AIR FLOW',
    intro: '流畅线条与动感轮廓，为日常与运动场景注入速度感。',
    specs: ['轻量缓震中底', '透气织物鞋面', '耐磨防滑外底']
  },
  {
    file: '/works/ads/product-02.mp4',
    thumb: '/works/ads/thumbs/t2.jpg',
    name: '曜石黑 · 真无线降噪耳机',
    en: 'OBSIDIAN TWS — NOISE CANCEL',
    intro: '哑光黑鹅卵石盒身搭配绿色呼吸灯，低调高级的科技质感。',
    specs: ['磨砂亲肤涂层', '主动降噪', '总续航 30 小时']
  },
  {
    file: '/works/ads/product-03.mp4',
    thumb: '/works/ads/thumbs/t3.jpg',
    name: 'LIQUID PLAY · 幻彩液态金属手柄',
    en: 'LIQUID PLAY — HOLO GAMEPAD',
    intro: '全息流光机身，液态科技雕琢掌控感，视觉美学与操控一体成型。',
    specs: ['全息电镀镜面外壳', '双摇杆 + 十字键 + 触控板', '人体工学流线握柄']
  }
]

export default function AdsShowcase() {
  const [active, setActive] = useState(0)
  const videoRef = useRef(null)

  useEffect(() => {
    const v = videoRef.current
    if (v) v.play().catch(() => {})
  }, [active])

  const cur = PRODUCTS[active]

  return (
    <section className="shop" id="ads-showcase">
      <div className="shop__scan" aria-hidden="true" />

      <div className="shop__window">
        <div className="shop__coupon mono">
          MZS COMMERCIAL SHOWCASE — WIN STORE COUPONS
        </div>

        <div className="shop__header">
          <span className="shop__icon" aria-hidden="true">
            ⊘
          </span>
          <span className="shop__brand">
            mzs<span className="shop__brand-em">/shop</span>
          </span>
          <span className="shop__burger" aria-hidden="true">
            ≡
          </span>
        </div>

        <div className="shop__body">
          <div className="shop__stage">
            <div className="shop__video-box">
              <video
                key={active}
                ref={videoRef}
                src={cur.file}
                muted
                loop
                playsInline
                autoPlay
                controls
              />
              <div className="shop__toggle mono">
                <span className="is-on">3D</span>
                <span>AR</span>
              </div>
            </div>

            <div className="shop__info">
              <div className="shop__info-row">
                <h3>{cur.name}</h3>
                <span className="mono shop__no">
                  NO.{String(active + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="shop__marquee" aria-hidden="true">
                <div className="shop__marquee-track">
                  <span>{cur.specs.join(' * ')} * </span>
                  <span>{cur.specs.join(' * ')} * </span>
                </div>
              </div>
              <button
                className="shop__buy mono"
                onClick={() => setActive((active + 1) % PRODUCTS.length)}
              >
                NEXT PRODUCT →
              </button>
            </div>
          </div>

          <div className="shop__grid">
            {PRODUCTS.map((p, i) => (
              <button
                key={i}
                className={`shop__card ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <img className="shop__card-thumb" src={p.thumb} alt={p.name} loading="lazy" />
                <div className="shop__card-head">
                  <span>{p.name}</span>
                  <span className="mono shop__try">
                    TRY IN <b>AR</b>
                  </span>
                </div>
                <p className="shop__card-intro">{p.intro}</p>
                <ul className="shop__specs">
                  {p.specs.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <span className="shop__card-btn mono">
                  {i === active ? 'VIEWING' : 'SELECT →'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
