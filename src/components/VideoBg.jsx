import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

const SRC = 'https://stream.mux.com/s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200.m3u8'

export default function VideoBg() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let hls = null

    if (Hls.isSupported()) {
      // Chrome/Edge/Firefox 用 hls.js 播放（优先，避免 canPlayType 误报）
      hls = new Hls({ enableWorker: true })
      hls.loadSource(SRC)
      hls.attachMedia(video)
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari 原生支持 HLS
      video.src = SRC
    }

    const tryPlay = () => video.play().catch(() => {})
    video.muted = true
    video.setAttribute('muted', '')
    video.addEventListener('loadeddata', tryPlay)
    tryPlay()

    return () => {
      video.removeEventListener('loadeddata', tryPlay)
      if (hls) hls.destroy()
    }
  }, [])

  return (
    <div className="video-bg" aria-hidden="true">
      <video ref={videoRef} muted loop playsInline autoPlay preload="auto" />
      <div className="video-bg__fade" />
    </div>
  )
}
