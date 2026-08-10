import { useEffect, useRef } from 'react'

const FONT = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  X: ['10001', '01010', '00100', '00100', '00100', '01010', '10001'],
  Y: ['10001', '01010', '00100', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000']
}

const SEGMENTS = [
  { text: 'BRANDING', label: '（品牌識別）' },
  { text: 'WEB DESIGN', label: '（網頁設計）' },
  { text: 'UI UX', label: '（介面體驗）' },
  { text: 'MOTION', label: '（動態設計）' },
  { text: 'AIGC VISUAL', label: '（AI 視覺）' },
  { text: 'STUDIO', label: '' }
]

export default function DotMarquee({ paused }) {
  const canvasRef = useRef(null)
  const pausedRef = useRef(paused)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let offset = 0
    let last = performance.now()

    const resize = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    resize()

    const speed = 62
    const dot = Math.max(12, Math.floor(canvas.height / 8))
    const spacing = dot * 1.22
    const charW = spacing * 5
    const charH = spacing * 7
    const advance = charW + spacing
    const gap = spacing * 13

    const lineW = SEGMENTS.reduce((w, seg) => {
      let sw = 0
      for (const ch of seg.text) sw += advance
      return w + sw + gap
    }, 0)

    const drawChar = (ch, x, y) => {
      const rows = FONT[ch] || FONT[' ']
      for (let r = 0; r < 7; r += 1) {
        for (let c = 0; c < 5; c += 1) {
          if (rows[r][c] === '1') {
            ctx.beginPath()
            ctx.arc(x + c * spacing + spacing * 0.5, y + r * spacing + spacing * 0.5, dot * 0.42, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      const y = (canvas.height - charH) / 2
      const start = -(offset % lineW)
      for (let pass = 0; pass < 2; pass += 1) {
        let x = start + pass * lineW
        for (const seg of SEGMENTS) {
          for (const ch of seg.text) {
            drawChar(ch, x, y)
            x += advance
          }
          if (seg.label) {
            ctx.font = '13px "PingFang SC", "Microsoft YaHei", sans-serif'
            ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'
            ctx.fillText(seg.label, x - advance * seg.text.length + spacing * 0.5, y + charH + 26)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
          }
          x += gap
        }
      }
    }

    const loop = (t) => {
      const dt = Math.min(0.1, (t - last) / 1000)
      last = t
      if (!pausedRef.current) offset += speed * dt
      draw()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="dot-marquee"
      data-paused={paused ? 'true' : 'false'}
      aria-hidden="true"
    />
  )
}
