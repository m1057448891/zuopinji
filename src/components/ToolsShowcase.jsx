import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FoldText from './FoldText.jsx'
import './ToolsShowcase.css'

gsap.registerPlugin(ScrollTrigger)

// 代码卡片的语法高亮 token：[类型, 文本]  type: k=键名 s=字符串 p=标点/符号 c=注释/暗色
const C = (k, s) => [k, s]

const ITEMS = [
  {
    no: '01',
    category: 'COVER DESIGN',
    name: '短视频封面生成工具',
    en: 'THUMBNAIL GENERATOR',
    desc: '输入视频标题与风格关键词，AI 提炼候选标题，生成蓝橙双版 3D 封面，直接用于发布。',
    metrics: ['2 VERSIONS', '3 MIN', 'CTR +40%'],
    codeLabel: 'cover_job.config',
    code: [
      [C('p', 'cover_job'), C('p', ' = {')],
      [C('k', '  title'), C('p', ' = '), C('s', '"我的视频标题"')],
      [C('k', '  style'), C('p', ' = '), C('s', '"cyber-blue | orange"')],
      [C('k', '  drafts'), C('p', ' = '), C('s', '"3 candidate titles"')],
      [C('k', '  output'), C('p', ' = '), C('s', '"2 versions · 3D title"')],
      [C('p', '}')]
    ]
  },
  {
    no: '02',
    category: 'CONTENT WRITING',
    name: 'AI 文案生成工具',
    en: 'AI COPYWRITER',
    desc: '按爆款结构一次完成标题候选、开头钩子、分层正文与结尾引导，自动脱敏后可直接发布。',
    metrics: ['5 TITLES', '1 DRAFT', 'READY 2 PUBLISH'],
    codeLabel: 'copy_job.config',
    code: [
      [C('p', 'copy_job'), C('p', ' = {')],
      [C('k', '  topic'), C('p', ' = '), C('s', '"主题 / 平台"')],
      [C('k', '  hook'), C('p', ' = '), C('s', '"爆款开头钩子"')],
      [C('k', '  body'), C('p', ' = '), C('s', '"分层正文"')],
      [C('k', '  safe'), C('p', ' = '), C('s', '"auto 脱敏"')],
      [C('k', '  output'), C('p', ' = '), C('s', '"markdown 可直接发布"')],
      [C('p', '}')]
    ]
  },
  {
    no: '03',
    category: 'MUSIC CURATION',
    name: '免费音乐合集生成工具',
    en: 'MUSIC COLLECTION',
    desc: '指定音乐风格，AI 规划合集并逐曲筛选免费可试听版本，附收听链接一键使用。',
    metrics: ['10+ TRACKS', 'FREE', '1 CLICK'],
    codeLabel: 'music_job.config',
    code: [
      [C('p', 'music_job'), C('p', ' = {')],
      [C('k', '  style'), C('p', ' = '), C('s', '"chill / lofi / ..."')],
      [C('k', '  tracks'), C('p', ' = '), C('s', '"10+ curated"')],
      [C('k', '  free'), C('p', ' = '), C('s', '"true · 可试听"')],
      [C('k', '  links'), C('p', ' = '), C('s', '"listen + download"')],
      [C('p', '}')]
    ]
  },
  {
    no: '04',
    category: 'FACT CHECKING',
    name: '热点真伪辨别工具',
    en: 'FACT CHECK',
    desc: '提取热点消息核心论断，多源交叉查证并判定真伪等级，输出可公开引用的辟谣内容。',
    metrics: ['3+ SOURCES', '5 MIN', 'VERIFIED'],
    codeLabel: 'fact_job.config',
    code: [
      [C('p', 'fact_job'), C('p', ' = {')],
      [C('k', '  claim'), C('p', ' = '), C('s', '"热点消息"')],
      [C('k', '  sources'), C('p', ' = '), C('s', '"3+ 交叉查证"')],
      [C('k', '  verdict'), C('p', ' = '), C('s', '"TRUE / FALSE / MIXED"')],
      [C('k', '  output'), C('p', ' = '), C('s', '"脱敏辟谣稿"')],
      [C('p', '}')]
    ]
  },
  {
    no: '05',
    category: 'TRANSCRIPTION',
    name: '视频字幕提取工具',
    en: 'SUBTITLE EXTRACTOR',
    desc: '自动提取或转写视频字幕，输出 SRT / VTT / 逐字稿多种格式，带时间戳直接使用。',
    metrics: ['SRT / VTT', 'WHISPER', '1 CLICK'],
    codeLabel: 'subtitle_job.config',
    code: [
      [C('p', 'subtitle_job'), C('p', ' = {')],
      [C('k', '  url'), C('p', ' = '), C('s', '"视频链接"')],
      [C('k', '  mode'), C('p', ' = '), C('s', '"auto | whisper"')],
      [C('k', '  formats'), C('p', ' = '), C('s', '"srt / vtt / txt"')],
      [C('k', '  timecode'), C('p', ' = '), C('s', '"true"')],
      [C('p', '}')]
    ]
  }
]

const N = ITEMS.length

function CodeCard({ code, label }) {
  return (
    <div className="tg-code">
      <div className="tg-code__bar">
        <span className="tg-code__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="tg-code__label">{label}</span>
      </div>
      <pre className="tg-code__body">
        {code.map((line, i) => (
          <div className="tg-code__line" key={i}>
            <span className="tg-code__no">{String(i + 1).padStart(2, '0')}</span>
            <span className="tg-code__text">
              {line.map((tok, j) => (
                <span key={j} className={`tg-tok tg-tok--${tok[0]}`}>
                  {tok[1]}
                </span>
              ))}
            </span>
          </div>
        ))}
      </pre>
    </div>
  )
}

export default function ToolsShowcase() {
  const scopeRef = useRef(null)
  const runwayRef = useRef(null)
  const triggerRef = useRef(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const runway = runwayRef.current
    if (!runway) return

    const st = ScrollTrigger.create({
      trigger: runway,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        runway.style.setProperty('--accord-p', p.toFixed(4))
        setActive(Math.max(0, Math.min(N - 1, Math.round(p * (N - 1)))))
      }
    })
    triggerRef.current = st
    runway.style.setProperty('--accord-p', '0')

    return () => st.kill()
  }, [])

  const goTo = (i) => {
    const st = triggerRef.current
    const lenis = window.__lenis
    if (!st) return
    const y = st.start + ((i + 0.5) / N) * (st.end - st.start)
    if (lenis) lenis.scrollTo(y, { duration: 1.2 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section className="projects tools-grid" id="tools-showcase" ref={scopeRef}>
      <div className="container projects__head">
        <span className="mono projects__kicker">SKILL BUILD / Skill搭建</span>
        <h2 className="projects__heading projects__heading--fold">
          <FoldText
            text="SKILL BUILD"
            splitBy="char"
            hinge="top"
            trigger="scroll"
            duration={0.65}
            stagger={0.045}
            ease="power3.out"
            perspective={700}
            creaseShading={0.55}
            fontSize="clamp(2.6rem, 9vw, 120px)"
            fontWeight={900}
            color="#d7e2ea"
          />
        </h2>
        <p className="mono projects__sub">FIVE AI SKILLS · ONE WORKFLOW</p>
      </div>

      <div className="tools-accordion" ref={runwayRef}>
        <div className="tools-accordion__sticky">
          <div className="tools-accordion__inner">
            {/* 左侧特性导航 */}
            <nav className="tg-nav" aria-label="技能导航">
              {ITEMS.map((item, i) => (
                <button
                  key={item.no}
                  type="button"
                  className={`tg-nav__item mono ${i === active ? 'tg-nav__item--active' : ''}`}
                  onClick={() => goTo(i)}
                >
                  <span className="tg-nav__dot" aria-hidden="true" />
                  <span className="tg-nav__label">{item.category}</span>
                </button>
              ))}
            </nav>

            {/* 右侧堆叠面板 */}
            <div className="tg-stage">
              {ITEMS.map((item, i) => (
                <article
                  key={item.no}
                  className="tg-card"
                  style={{ '--i': i, zIndex: N - i }}
                >
                  <div className="tg-card__copy">
                    <span className="tg-card__eyebrow mono">{item.category}</span>
                    <h3 className="tg-card__title">{item.en}</h3>
                    <p className="tg-card__cn">{item.name}</p>
                    <p className="tg-card__desc">{item.desc}</p>
                    <div className="tg-card__metrics">
                      {item.metrics.map((m) => (
                        <span className="mono" key={m}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="tg-card__visual">
                    <div className="tg-visual__panel" aria-hidden="true" />
                    <div className="tg-visual__halo" aria-hidden="true" />
                    <CodeCard code={item.code} label={item.codeLabel} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

