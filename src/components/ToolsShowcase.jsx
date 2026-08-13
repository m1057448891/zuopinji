import AccordionGallery from './AccordionGallery.jsx'
import { asset } from '../lib/asset.js'

const ITEMS = [
  { image: '/works/tools/tool-01.webp', label: '短视频封面', alt: '短视频封面生成工具海报' },
  { image: '/works/tools/tool-02.webp', label: 'AI 文案', alt: 'AI 文案生成工具海报' },
  { image: '/works/tools/tool-03.webp', label: '音乐合集', alt: '免费音乐合集生成工具海报' },
  { image: '/works/tools/tool-04.webp', label: '热点辨别', alt: '热点真伪辨别工具海报' },
  { image: '/works/tools/tool-05.webp', label: '字幕提取', alt: '视频字幕提取工具海报' }
]

export default function ToolsShowcase() {
  return (
    <section className="tools" id="tools-showcase">
      <span className="tools__watermark" aria-hidden="true">
        SKILLS
      </span>
      <div className="container tools__inner">
        <header className="tools__head">
          <span className="mono tools__kicker">SKILL BUILD / Skill搭建</span>
          <h2 className="tools__title">
            CONTENT, IN SECONDS
            <em>文案 · 封面 · 音乐 · 辟谣 · 字幕</em>
          </h2>
          <p className="mono tools__sub">FIVE AI SKILLS · ONE WORKFLOW</p>
        </header>
        <div className="tools__gallery">
          <AccordionGallery
            items={ITEMS.map((it) => ({ ...it, image: asset(it.image) }))}
            defaultIndex={2}
            accentColor="#9cc3ff"
            overlayColor="#060010"
            textColor="#ffffff"
            height={540}
            gap={10}
            radius={14}
            expandRatio={0.48}
            duration={0.65}
            ease="power3.out"
            parallax={0.15}
            tilt={6}
            stagger={0.06}
            trigger="hover"
          />
        </div>
      </div>
      <span className="tools__vertical mono" aria-hidden="true">
        SKILL BUILD
      </span>
    </section>
  )
}
