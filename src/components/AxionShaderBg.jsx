import { useState } from 'react'
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react'

export default function AxionShaderBg() {
  // 浏览器/GPU 不支持 WebGPU 时，shader 不会渲染（canvas 透明）。
  // 用 onUnavailable 切换到 CSS 渐变兜底背景，保证任何环境都能看到效果。
  const [unavailable, setUnavailable] = useState(false)

  return (
    <>
      {!unavailable && (
        <Shader
          className="axion-shader"
          aria-hidden="true"
          onUnavailable={() => setUnavailable(true)}
        >
          <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
          <ChromaFlow
            baseColor="#ffffff"
            downColor="#ff5f03"
            leftColor="#ff5f03"
            rightColor="#ff5f03"
            upColor="#ff5f03"
            momentum={13}
            radius={3.5}
          />
          <FlutedGlass
            aberration={0.61}
            angle={31}
            frequency={8}
            highlight={0.12}
            highlightSoftness={0}
            lightAngle={-90}
            refraction={4}
            shape="rounded"
            softness={1}
            speed={0.15}
          />
          <FilmGrain strength={0.05} />
        </Shader>
      )}
      {unavailable && <div className="axion-fallback" aria-hidden="true" />}
    </>
  )
}
