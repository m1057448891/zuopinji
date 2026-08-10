import { useEffect, useState } from 'react'
import DotMarquee from './DotMarquee.jsx'

const LEFT = ['内容运营', '用户分析', '数据复盘', '活动执行', '品牌顾问']
const RIGHT_TOP = ['AI 视觉', '动态设计', '品牌视觉', '插画设计']
const RIGHT_BOTTOM = ['文案策划', '短视频', '海报设计', '产品摄影']

export default function ImageShowcase({ items }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 2500)
    return () => clearInterval(timer)
  }, [items.length])

  const current = items[index]

  return (
    <div className="showcase">
      <DotMarquee paused={false} />

      <div className="showcase-stage">
        <div className="showcase-dots" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="86" x2="58" y2="8" className="showcase-dots__line" />
          </svg>
        </div>

        <ul className="showcase-list showcase-list--left">
          {LEFT.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <div className="showcase-list showcase-list--right">
          <ul>
            {RIGHT_TOP.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <span className="showcase-bracket mono">（ 介面/體驗 ）</span>
          <ul>
            {RIGHT_BOTTOM.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <button className="showcase-card" onClick={() => setSelected(current)} aria-label="查看大图">
          <img key={index} src={current.file} alt={current.title} loading="lazy" />
        </button>

        <p className="showcase-caption mono">創意能量持續輸出中 ▍</p>
        <p className="showcase-down mono">DOWN ▾</p>
      </div>

      {selected && (
        <div className="cube-overlay" onClick={() => setSelected(null)} role="dialog" aria-modal="true">
          <img src={selected.file} alt={selected.title} className="cube-overlay__flip" />
          <button className="cube-overlay__close" onClick={() => setSelected(null)} aria-label="关闭">
            ×
          </button>
          <span className="mono cube-overlay__meta">
            {selected.title} — CLICK ANYWHERE TO CLOSE
          </span>
        </div>
      )}
    </div>
  )
}
