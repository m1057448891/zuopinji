import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '../lib/asset.js'
import FoldText from './FoldText.jsx'
import ParallaxRise from './ParallaxRise.jsx'
import ParallaxDrift from './ParallaxDrift.jsx'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  {
    no: '01',
    category: 'COVER DESIGN',
    name: '短视频封面生成工具',
    en: 'THUMBNAIL GENERATOR',
    tag: 'TOOL 01 / 封面生成',
    image: '/works/tools/poster-01.webp',
    process: [
      { step: '01', text: '输入视频标题与风格关键词，AI 提炼 3 个候选标题' },
      { step: '02', text: '自动生成蓝版赛博科技风与橙版高对比风两版封面' },
      { step: '03', text: '排版大字号 3D 标题、卖点横幅与信息条' },
      { step: '04', text: '输出成品封面图，可直接用于短视频发布' }
    ],
    result: '单次 3 分钟产出两版成品封面，视觉统一、点击率明显提升。',
    metrics: ['2 VERSIONS', '3 MIN', 'CTR +40%']
  },
  {
    no: '02',
    category: 'CONTENT WRITING',
    name: 'AI 文案生成工具',
    en: 'AI COPYWRITER',
    tag: 'TOOL 02 / 文案生成',
    image: '/works/tools/poster-02.webp',
    process: [
      { step: '01', text: '输入主题与发布平台，AI 按爆款结构提炼标题候选' },
      { step: '02', text: '自动完成开头钩子、分层正文与结尾引导' },
      { step: '03', text: '对个人信息自动脱敏，确保内容可公开使用' },
      { step: '04', text: '输出可直接发布的完整 Markdown 文案' }
    ],
    result: '从选题到成文一次完成，结构完整、无需二次大改即可发布。',
    metrics: ['5 TITLES', '1 DRAFT', 'READY 2 PUBLISH']
  },
  {
    no: '03',
    category: 'MUSIC CURATION',
    name: '免费音乐合集生成工具',
    en: 'MUSIC COLLECTION',
    tag: 'TOOL 03 / 音乐合集',
    image: '/works/tools/poster-03.webp',
    process: [
      { step: '01', text: '指定音乐风格，AI 规划合集主题与曲目结构' },
      { step: '02', text: '逐曲搜索并筛选免费可试听的版本' },
      { step: '03', text: '每首曲目附试听与收听链接' },
      { step: '04', text: '交付分类清晰、可直接使用的音乐清单' }
    ],
    result: '每个风格快速获得带免费试听链接的曲库，省去逐个寻找的时间。',
    metrics: ['10+ TRACKS', 'FREE', '1 CLICK']
  },
  {
    no: '04',
    category: 'FACT CHECKING',
    name: '热点真伪辨别工具',
    en: 'FACT CHECK',
    tag: 'TOOL 04 / 热点辟谣',
    image: '/works/tools/poster-04.webp',
    process: [
      { step: '01', text: '提取热点消息的核心论断' },
      { step: '02', text: '多源交叉查证，比对可信信息' },
      { step: '03', text: '判定真伪等级并给出依据' },
      { step: '04', text: '输出脱敏后的辟谣结论，可直接公开引用' }
    ],
    result: '几分钟内完成核实，给出可公开传播的真伪判定与辟谣内容。',
    metrics: ['3+ SOURCES', '5 MIN', 'VERIFIED']
  },
  {
    no: '05',
    category: 'TRANSCRIPTION',
    name: '视频字幕提取工具',
    en: 'SUBTITLE EXTRACTOR',
    tag: 'TOOL 05 / 字幕提取',
    image: '/works/tools/poster-05.webp',
    process: [
      { step: '01', text: '粘贴视频链接，自动检测视频自带字幕' },
      { step: '02', text: '无字幕时自动转写完整音频' },
      { step: '03', text: '生成 SRT / VTT / 逐字稿多种格式' },
      { step: '04', text: '输出带时间戳的文案，可直接使用' }
    ],
    result: '从视频到完整字幕文案一次完成，无需手动逐句记录。',
    metrics: ['SRT / VTT', 'WHISPER', '1 CLICK']
  }
]

export default function ToolsShowcase() {
  const scope = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.projects-card__inner')
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next) return
        const target = 1 - (cards.length - 1 - i) * 0.03
        gsap.fromTo(
          card,
          { scale: 1 },
          {
            scale: target,
            ease: 'none',
            scrollTrigger: {
              trigger: next.closest('.projects-card'),
              start: 'top bottom',
              end: 'top top',
              scrub: true
            }
          }
        )
      })
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <section className="projects" id="tools-showcase" ref={scope}>
      <ParallaxDrift
        className="container projects__head"
        trigger=".projects"
        amount={70}
        toScale={0.98}
      >
        <ParallaxRise
          className="projects__head-rise"
          amount={130}
          scale={1.05}
          fromOpacity={0.25}
        >
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
              fontSize="clamp(3rem, 12vw, 160px)"
              fontWeight={900}
              color="#d7e2ea"
            />
          </h2>
          <p className="mono projects__sub">FIVE AI SKILLS · ONE WORKFLOW</p>
        </ParallaxRise>
      </ParallaxDrift>

      <ParallaxDrift
        className="projects__stack"
        trigger=".projects"
        amount={50}
        toOpacity={0.96}
      >
        {ITEMS.map((item, i) => (
          <article className="projects-card" key={item.no}>
            <div className="projects-card__inner" style={{ top: i * 28 }}>
              <header className="projects-card__head">
                <div className="projects-card__head-left">
                  <span className="projects-card__num">{item.no}</span>
                  <div className="projects-card__title">
                    <span className="projects-card__cat">{item.category}</span>
                    <h3 className="projects-card__name">{item.name}</h3>
                    <span className="projects-card__en">{item.en}</span>
                  </div>
                </div>
                <a className="projects-card__live" href="#contact">
                  Live Project
                </a>
              </header>

              <div className="projects-card__body">
                <div className="projects-card__media">
                  <img
                    src={asset(item.image)}
                    alt={item.name}
                    loading="lazy"
                  />
                  <span className="projects-card__tag mono">{item.tag}</span>
                </div>

                <div className="projects-card__info">
                  <section className="projects-card__section">
                    <h4 className="projects-card__section-title">
                      <span>PROCESS</span>
                      使用过程
                    </h4>
                    <ol className="projects-card__steps">
                      {item.process.map((p) => (
                        <li key={p.step}>
                          <span className="mono">{p.step}</span>
                          <p>{p.text}</p>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section className="projects-card__section projects-card__section--result">
                    <h4 className="projects-card__section-title">
                      <span>RESULT</span>
                      效果
                    </h4>
                    <div className="projects-card__result-row">
                      <p className="projects-card__result">{item.result}</p>
                      <div className="projects-card__metrics">
                        {item.metrics.map((m) => (
                          <span className="mono" key={m}>
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </article>
        ))}
      </ParallaxDrift>
    </section>
  )
}
