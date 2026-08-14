// 媒体基地址：把 /works/... 下的大文件（视频/图片）指向对象存储 CDN。
// 未配置 VITE_MEDIA_BASE 时保持原行为（本地开发用 public/works）。
const MEDIA_BASE = (import.meta.env.VITE_MEDIA_BASE || '').replace(/\/+$/, '')

export const asset = (p) => {
  if (!p) return p
  if (/^https?:/i.test(p)) return p
  const clean = p.replace(/^\//, '')
  if (clean.startsWith('works/') && MEDIA_BASE) {
    return `${MEDIA_BASE}/${clean}`
  }
  return import.meta.env.BASE_URL + clean
}
