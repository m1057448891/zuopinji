import sizes from '../data/imageSizes.json'
import { asset } from './asset.js'

const STEPS = [480, 960, 1600, 2400]

export function imgSrcSet(file) {
  const meta = sizes[file]
  if (!meta) return undefined
  const parts = STEPS.filter((w) => meta.v[w]).map(
    (w) => `${asset(file.replace(/\.webp$/, `@${w}.webp`))} ${meta.v[w]}w`
  )
  return parts.join(', ') || undefined
}
