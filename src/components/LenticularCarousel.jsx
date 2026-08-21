import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './LenticularCarousel.css'

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

function parseAspect(aspectRatio) {
  const [w, h] = String(aspectRatio).split('/').map((s) => parseFloat(s))
  return { w: w || 3, h: h || 4 }
}

/**
 * LenticularCarousel —— 复刻 React Bits Pro 的 "Lenticular Carousel" 效果：
 * 卡片像透镜印刷（lenticular print）一样翻转：hover/聚焦时，垂直棱纹以
 * 扫过式（wipe）翻转露出另一面（视频 + 标题），并带折射视差、棱纹反光、
 * 全息箔片、倾斜与抬升。附带上/下一张、分段进度点、拖拽、键盘、自动播放。
 */
const LenticularCarousel = forwardRef(function LenticularCarousel(
  {
    items = [],
    initialIndex = 2,
    cardWidth = 260,
    aspectRatio = '3 / 4',
    gap = 26,
    borderRadius = 14,
    strips = 56,
    sweep = 0.6,
    refraction = 0.32,
    ridge = 0.5,
    foil = 0.5,
    foilScale = 8,
    scrim = 0.85,
    tilt = 14,
    travel = 0.64,
    lift = 40,
    perspective = 1200,
    inactiveScale = 0.9,
    inactiveDim = 0.55,
    speed = 1,
    trigger = 'hover',
    showLabels = true,
    labelColor = '#ffffff',
    showControls = true,
    showDots = true,
    loop = false,
    autoplay = false,
    autoplayDelay = 3200,
    enableDrag = true,
    enableKeyboard = true,
    paused = false,
    className = '',
    onIndexChange,
    onCardClick
  },
  ref
) {
  const count = items.length
  const ratio = useMemo(() => parseAspect(aspectRatio), [aspectRatio])
  const cardHeight = cardWidth * (ratio.h / ratio.w)
  const step = cardWidth + gap

  const [index, setIndex] = useState(() => clamp(initialIndex || 0, 0, Math.max(0, count - 1)))
  const [dragOffset, setDragOffset] = useState(0)
  const indexRef = useRef(index)
  const rootRef = useRef(null)
  const stripRef = useRef(null)
  const slideRefs = useRef([])
  const videoRefs = useRef([])
  const dragRef = useRef(null)

  // 触屏设备（无 hover）时退化为 focus 翻转
  const canHover = useMemo(
    () => (typeof window !== 'undefined' ? window.matchMedia('(hover: hover)').matches : true),
    []
  )
  const useHover = trigger === 'hover' && canHover

  const setFlip = useCallback((i, p) => {
    const el = slideRefs.current[i]
    if (el) el.style.setProperty('--flip', clamp(p, 0, 1).toFixed(4))
    const video = videoRefs.current[i]
    if (video) {
      if (p > 0.45) {
        if (video.preload !== 'auto') video.preload = 'auto'
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }
  }, [])

  const goTo = useCallback(
    (i, notify = true) => {
      if (count === 0) return
      let next = i
      if (loop) next = ((i % count) + count) % count
      else next = clamp(i, 0, count - 1)
      if (next === indexRef.current) return
      indexRef.current = next
      setIndex(next)
      setDragOffset(0)
      if (notify) onIndexChange?.(next)
    },
    [count, loop, onIndexChange]
  )

  useImperativeHandle(ref, () => ({
    goTo,
    next: () => goTo(indexRef.current + 1),
    prev: () => goTo(indexRef.current - 1)
  }))

  // 列表变化（如搜索过滤）时把焦点收回到有效范围内，并复位翻转
  useEffect(() => {
    if (count === 0) return
    if (indexRef.current >= count) goTo(Math.max(0, count - 1), false)
    slideRefs.current.forEach((el, i) => {
      if (!el) return
      el.style.setProperty('--flip', '0')
      el.classList.remove('lc-slide--tracking')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  // 自动播放
  useEffect(() => {
    if (!autoplay || paused || count < 2) return
    const t = setInterval(() => goTo(indexRef.current + 1), Math.max(500, autoplayDelay * speed))
    return () => clearInterval(t)
  }, [autoplay, paused, autoplayDelay, speed, goTo, count])

  // —— hover 翻转（跟随光标，travel 控制扫过距离）——
  const handleEnter = (i, e) => {
    if (!useHover || dragRef.current) return
    const el = slideRefs.current[i]
    el?.classList.add('lc-slide--tracking')
  }
  const handleMove = (i, e) => {
    if (!useHover || dragRef.current) return
    const r = e.currentTarget.getBoundingClientRect()
    const p = (e.clientX - r.left) / (r.width * Math.max(0.1, travel))
    setFlip(i, p)
  }
  const handleLeave = (i) => {
    if (!useHover) return
    const el = slideRefs.current[i]
    el?.classList.remove('lc-slide--tracking')
    setFlip(i, 0)
  }
  const handleFocus = (i) => {
    if (!useHover) setFlip(i, 1)
  }
  const handleBlur = (i) => {
    if (!useHover) setFlip(i, 0)
  }

  // —— 拖拽导航 ——
  const dragState = useRef(null)
  const handlePointerDown = (e) => {
    if (!enableDrag || count < 2) return
    if (e.target.closest('.lc-controls, .lc-dots, .lc-card')) return
    dragRef.current = true
    dragState.current = { startX: e.clientX, startIndex: indexRef.current }
    rootRef.current?.setPointerCapture?.(e.pointerId)
  }
  const handlePointerMove = (e) => {
    if (!dragState.current) return
    setDragOffset(e.clientX - dragState.current.startX)
  }
  const handlePointerUp = (e) => {
    if (!dragState.current) return
    const dx = e.clientX - dragState.current.startX
    if (Math.abs(dx) > step / 4) {
      goTo(dragState.current.startIndex + (dx < 0 ? 1 : -1))
    } else {
      setDragOffset(0)
    }
    dragState.current = null
    dragRef.current = false
  }
  const handlePointerCancel = () => {
    dragState.current = null
    dragRef.current = false
    setDragOffset(0)
  }

  // —— 键盘导航 ——
  const handleKeyDown = (e) => {
    if (!enableKeyboard) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(indexRef.current + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(indexRef.current - 1)
    }
  }

  const vars = {
    '--lc-card-w': `${cardWidth}px`,
    '--lc-card-h': `${cardHeight}px`,
    '--lc-radius': `${borderRadius}px`,
    '--lc-perspective': `${perspective}px`,
    '--lc-tilt': `${tilt}deg`,
    '--lc-lift': `${lift}px`,
    '--lc-strips': strips,
    '--lc-ridge': ridge,
    '--lc-foil': foil,
    '--lc-foil-scale': foilScale,
    '--lc-scrim': scrim,
    '--lc-label-color': labelColor,
    '--lc-inactive-scale': inactiveScale,
    '--lc-inactive-dim': inactiveDim,
    '--lc-refraction': `${refraction * 40}px`
  }

  return (
    <div
      ref={rootRef}
      className={`lc-root ${paused ? 'lc-root--paused' : ''} ${className || ''}`.trim()}
      style={vars}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label="作品画廊"
    >
      <div className="lc-viewport" style={{ height: cardHeight + lift * 2 }}>
        <div
          ref={stripRef}
          className="lc-strip"
          style={{
            gap: `${gap}px`,
            marginLeft: `calc(50% - ${cardWidth / 2}px)`,
            transform: `translateX(calc(${-index} * ${step}px + ${dragOffset}px)) translateY(-50%)`
          }}
        >
          {items.map((item, i) => {
            const active = i === index
            return (
              <div
                key={item.id ?? i}
                ref={(el) => (slideRefs.current[i] = el)}
                className={`lc-slide ${active ? '' : 'lc-slide--inactive'}`}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  '--lc-active': active ? 1 : 0,
                  '--flip': 0
                }}
              >
                <button
                  type="button"
                  className="lc-card"
                  aria-label={item.title || item.cn || item.id}
                  onPointerEnter={(e) => handleEnter(i, e)}
                  onPointerMove={(e) => handleMove(i, e)}
                  onPointerLeave={() => handleLeave(i)}
                  onFocus={() => handleFocus(i)}
                  onBlur={() => handleBlur(i)}
                  onClick={() => onCardClick?.(item, i)}
                >
                  {/* 正面：封面帧 */}
                  <div
                    className="lc-face lc-face--front"
                    style={{ backgroundImage: `url(${item.front})` }}
                  >
                    {item.cn && (
                      <span className="lc-frontlabel">
                        <span className="lc-frontlabel__title">{item.cn}</span>
                      </span>
                    )}
                  </div>

                  {/* 反面：翻转后露出的视频 + 标题 */}
                  <div className="lc-face lc-face--back">
                    <div className="lc-media">
                      {item.video ? (
                        <video
                          ref={(el) => (videoRefs.current[i] = el)}
                          src={item.video}
                          poster={item.front}
                          muted
                          loop
                          playsInline
                          preload="none"
                          className="lc-video"
                        />
                      ) : (
                        <div
                          className="lc-still"
                          style={{ backgroundImage: `url(${item.back || item.front})` }}
                        />
                      )}
                    </div>
                    <div className="lc-foil" aria-hidden="true" />
                    {showLabels && (
                      <div className="lc-label">
                        {item.title && <p className="lc-label__title">{item.title}</p>}
                        {item.subtitle && <p className="lc-label__sub">{item.subtitle}</p>}
                      </div>
                    )}
                  </div>

                  {/* 透镜棱纹与高光 */}
                  <div className="lc-lens" aria-hidden="true" />
                  <div className="lc-sheen" aria-hidden="true" />
                </button>
              </div>
            )
          })}
        </div>

        {showControls && count > 1 && (
          <div className="lc-controls">
            <button type="button" className="lc-control" aria-label="上一张" onClick={() => goTo(indexRef.current - 1)}>
              <ChevronLeft size={18} />
            </button>
            <button type="button" className="lc-control" aria-label="下一张" onClick={() => goTo(indexRef.current + 1)}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {showDots && count > 1 && (
        <div className="lc-dots">
          {items.map((item, i) => (
            <button
              key={item.id ?? i}
              type="button"
              className={`lc-dot ${i === index ? 'lc-dot--active' : ''}`}
              aria-label={`第 ${i + 1} 张`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
})

export default LenticularCarousel


