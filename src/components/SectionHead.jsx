export default function SectionHead({ no, en, title, label }) {
  return (
    <div className="sec-head">
      <span className="sec-head__no mono">
        {no} // {en}
      </span>
      <h2>{title}</h2>
      <span className="sec-head__bracket mono">( {label} )</span>
    </div>
  )
}
