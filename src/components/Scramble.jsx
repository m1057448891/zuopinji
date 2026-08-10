import { useEffect, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789×-·'

export default function Scramble({ text }) {
  const [out, setOut] = useState(text)

  useEffect(() => {
    let n = 0
    const timer = setInterval(() => {
      n += 1
      setOut(
        text
          .split('')
          .map((c, i) => (i < n ? c : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join('')
      )
      if (n >= text.length) {
        clearInterval(timer)
        setOut(text)
      }
    }, 26)
    return () => clearInterval(timer)
  }, [text])

  return <span aria-label={text}>{out}</span>
}
