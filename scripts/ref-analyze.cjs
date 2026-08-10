const { chromium } = require('C:/Users/A/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core')
const path = require('path')
const fs = require('fs')

const OUT = path.resolve(__dirname, '..', 'qa')
fs.mkdirSync(OUT, { recursive: true })

;(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true
  })
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))

  await page.goto('https://nudot.com.tw/?ref=landing.love', {
    waitUntil: 'load',
    timeout: 90000
  })
  await page.waitForTimeout(6000)

  await page.screenshot({ path: path.join(OUT, 'ref-hero.png') })

  const info = await page.evaluate(() => {
    const body = getComputedStyle(document.body)
    const hero = document.querySelector('section, main, [class*="hero"], [class*="Hero"], header')
    const heroStyle = hero ? getComputedStyle(hero) : null
    const anims = new Set()
    document.querySelectorAll('*').forEach((el) => {
      const s = getComputedStyle(el)
      if (s.animationName && s.animationName !== 'none') anims.add(s.animationName)
      if (s.transitionProperty && s.transitionProperty !== 'all' && s.transitionProperty !== 'none') anims.add('transition:' + s.transitionProperty.split(',')[0])
    })
    return {
      title: document.title,
      bodyBg: body.backgroundColor,
      bodyColor: body.color,
      bodyFont: body.fontFamily,
      bodyFontSize: body.fontSize,
      heroTag: hero ? hero.tagName : null,
      heroClass: hero ? hero.className : null,
      heroBg: heroStyle ? heroStyle.backgroundColor : null,
      heroBgImage: heroStyle ? (heroStyle.backgroundImage || '').slice(0, 120) : null,
      canvases: document.querySelectorAll('canvas').length,
      videos: document.querySelectorAll('video').length,
      imgs: document.querySelectorAll('img').length,
      animations: [...anims].slice(0, 40),
      headings: [...document.querySelectorAll('h1,h2,h3')].slice(0, 12).map((h) => h.tagName + ':' + (h.innerText || '').trim().slice(0, 40)),
      navText: (document.querySelector('nav, header')?.innerText || '').replace(/\s+/g, ' ').slice(0, 300),
      scrollHeight: document.documentElement.scrollHeight,
      scripts: [...document.querySelectorAll('script[src]')].map((s) => s.src).slice(0, 20)
    }
  })
  console.log(JSON.stringify(info, null, 2))
  console.log('ERRORS:', errors.join(' | ') || '(none)')

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2))
  await page.waitForTimeout(3000)
  await page.screenshot({ path: path.join(OUT, 'ref-scroll1.png') })

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3))
  await page.waitForTimeout(3000)
  await page.screenshot({ path: path.join(OUT, 'ref-scroll2.png') })

  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
