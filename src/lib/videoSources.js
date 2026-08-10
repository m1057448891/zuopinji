import { asset } from './asset.js'

export function videoSources(file) {
  if (!file) return []
  const hevc = file.replace(/\.mp4$/, '.hevc.mp4')
  return [
    { src: asset(hevc), type: 'video/mp4; codecs="hvc1"' },
    { src: asset(file), type: 'video/mp4; codecs="avc1"' }
  ]
}
