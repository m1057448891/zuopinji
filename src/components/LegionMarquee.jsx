const TEXT =
  'MOSATO SAKAI  ·  VISUAL CREATOR  ·  内容运营 × AI 视觉创作  ·  CONTENT OPERATION × AI VISUAL  ·  把想象力变成可交付的作品  ·  '

export default function LegionMarquee() {
  return (
    <div className="legion-marquee" aria-hidden="true">
      <div className="legion-marquee__track">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i}>{TEXT}</span>
        ))}
      </div>
    </div>
  )
}
