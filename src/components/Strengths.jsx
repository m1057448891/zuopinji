import { strengths } from '../data/content.js'
import Reveal from './Reveal.jsx'
import SectionHead from './SectionHead.jsx'

export default function Strengths() {
  return (
    <section className="strengths section" id="strengths">
      <div className="container">
        <Reveal>
          <SectionHead no="03" en="CAPABILITIES" title="个人优势" label="核心能力" />
        </Reveal>

        <div className="strengths__grid">
          {strengths.map((s, i) => (
            <Reveal key={s.no} delay={(i % 4) * 70}>
              <article className="strength-card">
                <div className="strength-card__head">
                  <span className="strength-card__no mono">{s.no}</span>
                  <span className="strength-card__en mono">{s.en}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="strength-card__tags">
                  {s.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <span className="strength-card__arrow" aria-hidden="true">→</span>
                <span className="strength-card__corner" aria-hidden="true" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
