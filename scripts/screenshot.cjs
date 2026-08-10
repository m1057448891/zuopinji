const { chromium } = require('C:/Users/A/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core')
const path = require('path')

const OUT = path.resolve(__dirname, '..', 'qa')
const fs = require('fs')
fs.mkdirSync(OUT, { recursive: true })

;(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true
  })
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  })
  const errors = []
  const badResponses = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('[console] ' + m.text())
  })
  page.on('pageerror', (e) => errors.push('[pageerror] ' + e.message))
  page.on('response', (r) => {
    if (r.status() >= 400) badResponses.push(r.status() + ' ' + r.url())
  })

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'load', timeout: 90000 })
  await page.waitForTimeout(4000)
  const state = await page.evaluate(() => ({
    rootChildren: document.querySelector('#root').children.length,
    sections: [...document.querySelectorAll('section')].map((s) => s.id),
    h1: document.querySelector('h1')?.textContent || null,
    bodyLen: document.body.innerText.length
  }))
  console.log('STATE: ' + JSON.stringify(state))
  console.log('ERRORS SO FAR:\n' + (errors.length ? errors.join('\n') : '(none)'))
  const outerDistInitial = await page.evaluate(() => {
    const t = document.querySelectorAll('.sectors__thumb')[26]
    const s = document.querySelector('.sectors').getBoundingClientRect()
    const r = t.getBoundingClientRect()
    return Math.round(
      Math.hypot(
        r.left + r.width / 2 - (s.left + s.width / 2),
        r.top + r.height / 2 - (s.top + s.height / 2)
      )
    )
  })
  const metrics = await page.evaluate(() => {
    const imgs = [...document.images]
    const vids = [...document.querySelectorAll('video')]
    return {
      viewport: [innerWidth, innerHeight],
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      bodyFont: getComputedStyle(document.body).fontFamily,
      imgsTotal: imgs.length,
      imgsLoaded: imgs.filter((i) => i.complete && i.naturalWidth > 0).length,
      imgsBroken: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
      vidsTotal: vids.length,
      vidsReady: vids.filter((v) => v.readyState >= 1).length,
      navBackdrop: getComputedStyle(document.querySelector('.nav')).backdropFilter,
      heroVideoSrc: document.querySelector('.hero video')?.currentSrc || document.querySelector('.hero video')?.src || null,
      heroText: document.querySelector('.hero')?.innerText.replace(/\s+/g, ' ').trim().slice(0, 160) || '',
      categories: [...document.querySelectorAll('.work-cat')].map((c) => ({
        id: c.id,
        title: c.querySelector('.work-cat__head h3')?.innerText,
        count: c.querySelectorAll('.work-card').length
      })),
      sections: [...document.querySelectorAll('section')].map((s) => {
        const r = s.getBoundingClientRect()
        return { id: s.id, top: Math.round(r.top), height: Math.round(r.height), width: Math.round(r.width) }
      })
    }
  })
  console.log('METRICS: ' + JSON.stringify(metrics, null, 2))
  console.log('BAD RESPONSES:\n' + (badResponses.length ? badResponses.join('\n') : '(none)'))
  await page.screenshot({ path: path.join(OUT, '01-hero.png') })

  await page.hover('.hero__list--cn li:nth-child(2) .hero__list-item')
  await page.waitForTimeout(700)
  await page.screenshot({ path: path.join(OUT, '01-hero-list-hover.png') })
  const listHover = await page.evaluate(() => ({
    color: getComputedStyle(
      document.querySelector('.hero__list--cn li:nth-child(2) .hero__list-item')
    ).color
  }))
  console.log('LIST HOVER: ' + JSON.stringify(listHover))
  await page.mouse.move(0, 0)
  await page.waitForTimeout(600)

  await page.hover('.hero__strip:nth-child(2) .hero__car-thumb')
  await page.waitForTimeout(700)
  const waveHover = await page.evaluate(() => ({
    strip2Waving: document
      .querySelector('.hero__strip:nth-child(2)')
      ?.classList.contains('is-waving')
  }))
  console.log('WAVE HOVER: ' + JSON.stringify(waveHover))
  await page.mouse.move(0, 0)
  await page.waitForTimeout(300)

  await page.click('.hero__strip:nth-child(3) .hero__car-thumb')
  await page.waitForTimeout(800)
  await page.screenshot({ path: path.join(OUT, '01-hero-carousel-3.png') })
  const carState = await page.evaluate(() => ({
    index: document.querySelector('.hero__car-index')?.innerText,
    titlePresent: !!document.querySelector('.hero__car-title'),
    activeThumb:
      [...document.querySelectorAll('.hero__car-thumb')].findIndex((t) =>
        t.classList.contains('is-active')
      ) + 1,
    waveBars: document.querySelectorAll('.hero__wave span').length,
    heroVideo: document.querySelector('.hero__video')?.currentSrc || document.querySelector('.hero__video')?.src
  }))
  console.log('CAROUSEL STATE: ' + JSON.stringify(carState))
  await page.click('.hero__car-arrow:last-child')
  await page.waitForTimeout(500)
  const carNext = await page.evaluate(() => ({
    index: document.querySelector('.hero__car-index')?.innerText,
    heroVideo: document.querySelector('.hero__video')?.currentSrc || document.querySelector('.hero__video')?.src
  }))
  console.log('CAROUSEL NEXT: ' + JSON.stringify(carNext))

  await page.evaluate(() =>
    window.scrollTo(0, document.querySelector('.hero').offsetHeight - 240)
  )
  await page.waitForTimeout(900)
  await page.screenshot({ path: path.join(OUT, '01-02-boundary.png') })

  const sections = [
    ['#image-works', '02-image-works'],
    ['#shorts-showcase', '03-shorts-showcase'],
    ['#ads-showcase', '04-ads-showcase'],
    ['#carousel-showcase', '05-carousel-showcase'],
    ['#gallery-showcase', '06-gallery-showcase'],
    ['#contact', '07-contact']
  ]
  for (const [sel, name] of sections) {
    await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'start' }), sel)
    await page.waitForTimeout(1800)
    await page.screenshot({ path: path.join(OUT, name + '.png') })

    if (name === '02-image-works') {
      const sectorsInfo = await page.evaluate(() => ({
        title: document.querySelector('.sectors__title')?.innerText,
        meta: document.querySelector('.sectors__meta')?.innerText.replace(/\s+/g, ' '),
        rings: document.querySelectorAll('.sectors__ring').length,
        ringDirections: [...document.querySelectorAll('.sectors__ring')].map(
          (r) => getComputedStyle(r).animationDirection
        ),
        ringAnim: getComputedStyle(document.querySelector('.sectors__ring')).animationName,
        titleFont: getComputedStyle(document.querySelector('.sectors__title')).fontFamily,
        titleTracking: getComputedStyle(document.querySelector('.sectors__title')).letterSpacing,
        metaJustify: getComputedStyle(document.querySelector('.sectors__meta')).justifyContent,
        logoAnim: getComputedStyle(document.querySelector('.sectors__logo')).animationName,
        thumbs: document.querySelectorAll('.sectors__thumb').length,
        vertical: document.querySelector('.sectors__vertical')?.innerText,
        downText: document.querySelector('.sectors__down')?.innerText,
        downRect: (() => {
          const r = document.querySelector('.sectors__down')?.getBoundingClientRect()
          return r ? { top: Math.round(r.top), bottom: Math.round(r.bottom) } : null
        })()
      }))
      console.log('SECTORS INFO: ' + JSON.stringify(sectorsInfo))
      const outerDistNow = await page.evaluate(() => {
        const t = document.querySelectorAll('.sectors__thumb')[26]
        const s = document.querySelector('.sectors').getBoundingClientRect()
        const r = t.getBoundingClientRect()
        return Math.round(
          Math.hypot(
            r.left + r.width / 2 - (s.left + s.width / 2),
            r.top + r.height / 2 - (s.top + s.height / 2)
          )
        )
      })
      console.log('RING GROWTH: initial=' + outerDistInitial + ' now=' + outerDistNow)
      const thumbSamples = await page.evaluate(() =>
        [0, 6, 16, 22].map((i) => {
          const t = document.querySelectorAll('.sectors__thumb')[i]
          const r = t.getBoundingClientRect()
          return {
            i,
            w: Math.round(r.width),
            h: Math.round(r.height),
            cssW: getComputedStyle(t).width,
            tilt: getComputedStyle(t).getPropertyValue('--tilt'),
            transform: getComputedStyle(t).transform.slice(0, 60)
          }
        })
      )
      console.log('THUMB SAMPLES: ' + JSON.stringify(thumbSamples))
      const radial = await page.evaluate(() => {
        const vw = innerWidth / 2
        const vh = innerHeight / 2
        const deg = (r) => ((r * 180) / Math.PI + 360) % 360
        const mod180 = (a) => ((a % 180) + 180) % 180
        const rows = [...document.querySelectorAll('.sectors__thumb')].map((t) => {
          const r = t.getBoundingClientRect()
          const pos = Math.atan2(r.top + r.height / 2 - vh, r.left + r.width / 2 - vw)
          const m = new DOMMatrix(getComputedStyle(t).transform)
          const ring = t.closest('.sectors__ring')
          const rm = new DOMMatrix(getComputedStyle(ring).transform)
          const rot = Math.atan2(m.b, m.a) + Math.atan2(rm.b, rm.a)
          const diff = Math.abs(mod180(deg(pos)) - mod180(deg(rot)))
          return { diff: Math.round(Math.min(diff, 180 - diff)) }
        })
        const ok = rows.filter((x) => x.diff <= 12).length
        return { total: rows.length, aligned: ok }
      })
      console.log('RADIAL CHECK: ' + JSON.stringify(radial))

      const logoT1 = await page.evaluate(
        () => getComputedStyle(document.querySelector('.sectors__logo')).transform
      )
      await page.waitForTimeout(1200)
      const logoT2 = await page.evaluate(
        () => getComputedStyle(document.querySelector('.sectors__logo')).transform
      )
      console.log('LOGO SPIN: changed=' + (logoT1 !== logoT2))

      const ringT1 = await page.evaluate(() => {
        const rings = document.querySelectorAll('.sectors__ring')
        return [
          getComputedStyle(rings[0]).transform,
          getComputedStyle(rings[1]).transform
        ]
      })
      await page.waitForTimeout(1300)
      const ringT2 = await page.evaluate(() => {
        const rings = document.querySelectorAll('.sectors__ring')
        return [
          getComputedStyle(rings[0]).transform,
          getComputedStyle(rings[1]).transform
        ]
      })
      console.log(
        'RING ROTATION: ring1Changed=' +
          (ringT1[0] !== ringT2[0]) +
          ' ring2Changed=' +
          (ringT1[1] !== ringT2[1])
      )
      await page.evaluate(() => {
        const s = document.querySelector('#image-works')
        window.scrollTo(0, s.offsetTop + s.offsetHeight - innerHeight / 2)
      })
      await page.waitForTimeout(1200)
      await page.screenshot({ path: path.join(OUT, '02-03-boundary.png') })
    }

    if (name === '03-shorts-showcase') {
      const shortsInfo = await page.evaluate(() => ({
        screen: !!document.querySelector('.desk__screen'),
        panel: !!document.querySelector('.desk__panel'),
        buttons: document.querySelectorAll('.desk__btn').length,
        counter: document.querySelector('.desk__counter')?.innerText,
        title: document.querySelector('.desk__title')?.innerText,
        playing: !document.querySelector('.desk__screen video')?.paused
      }))
      console.log('SHORTS INFO: ' + JSON.stringify(shortsInfo))
      await page.evaluate(() => window.scrollBy(0, innerHeight * 0.9))
      await page.waitForTimeout(1300)
      const shortsScrolled = await page.evaluate(() => ({
        screenTransform: getComputedStyle(document.querySelector('.desk__zoom')).transform.slice(0, 36),
        title: document.querySelector('.desk__title')?.innerText
      }))
      console.log('SHORTS SCROLL: ' + JSON.stringify(shortsScrolled))
      await page.evaluate(() => document.querySelectorAll('.desk__btn')[1].click())
      await page.waitForTimeout(1200)
      const shortsClicked = await page.evaluate(() => ({
        counter: document.querySelector('.desk__counter')?.innerText,
        title: document.querySelector('.desk__title')?.innerText,
        playing: !document.querySelector('.desk__screen video')?.paused
      }))
      console.log('SHORTS CLICK: ' + JSON.stringify(shortsClicked))
      await page.screenshot({ path: path.join(OUT, '03-shorts-mid.png') })
    }

    if (name === '04-ads-showcase') {
      const adsInfo = await page.evaluate(() => ({
        window: !!document.querySelector('.shop__window'),
        cards: document.querySelectorAll('.shop__card').length,
        cardImgs: document.querySelectorAll('.shop__card-thumb').length,
        shopBg: getComputedStyle(document.querySelector('.shop')).backgroundColor,
        shopHeight: (() => {
          const r = document.querySelector('.shop').getBoundingClientRect()
          return { h: Math.round(r.height), viewport: innerHeight }
        })(),
        shopScroll: document.querySelector('.shop').scrollHeight,
        title: document.querySelector('.shop__info h3')?.innerText,
        videoSrc: document.querySelector('.shop__stage video')?.src,
        marqueeAnim: getComputedStyle(
          document.querySelector('.shop__marquee-track')
        ).animationName
      }))
      console.log('ADS INFO: ' + JSON.stringify(adsInfo))
      const marqueeT1 = await page.evaluate(
        () => getComputedStyle(document.querySelector('.shop__marquee-track')).transform
      )
      await page.waitForTimeout(1300)
      const marqueeT2 = await page.evaluate(
        () => getComputedStyle(document.querySelector('.shop__marquee-track')).transform
      )
      console.log('ADS MARQUEE: changed=' + (marqueeT1 !== marqueeT2))
      await page.evaluate(() => document.querySelectorAll('.shop__card')[1].click())
      await page.waitForTimeout(900)
      const adsSwitched = await page.evaluate(() => ({
        videoSrc: document.querySelector('.shop__stage video')?.src,
        title: document.querySelector('.shop__info h3')?.innerText,
        activeCards: document.querySelectorAll('.shop__card.is-active').length
      }))
      console.log('ADS SWITCHED: ' + JSON.stringify(adsSwitched))
      await page.screenshot({ path: path.join(OUT, '04-ads-mid.png') })
    }

    if (name === '05-carousel-showcase') {
      const carouselInfo = await page.evaluate(() => ({
        cards: document.querySelectorAll('.car-card').length,
        arrows: document.querySelectorAll('.car-nav').length,
        trackTransform: getComputedStyle(document.querySelector('.carousel__track')).transform.slice(0, 50),
        title: document.querySelector('.carousel__title')?.innerText.replace(/\s+/g, ' ').slice(0, 80),
        firstCardTitle: document.querySelector('.car-card__info h3')?.innerText
      }))
      console.log('CAROUSEL INFO: ' + JSON.stringify(carouselInfo))
      await page.click('.car-nav:last-child')
      await page.waitForTimeout(1200)
      const carouselNext = await page.evaluate(() => ({
        trackTransform: getComputedStyle(document.querySelector('.carousel__track')).transform.slice(0, 50),
        leftDisabled: document.querySelector('.car-nav:first-child').disabled
      }))
      console.log('CAROUSEL NEXT: ' + JSON.stringify(carouselNext))
      await page.click('.car-card__media')
      await page.waitForTimeout(900)
      const carouselModal = await page.evaluate(() => ({
        modal: !!document.querySelector('.car-modal'),
        modalVideo: !!document.querySelector('.car-modal video'),
        modalTitle: document.querySelector('.car-modal__cap h3')?.innerText
      }))
      console.log('CAROUSEL MODAL: ' + JSON.stringify(carouselModal))
      await page.screenshot({ path: path.join(OUT, '05-carousel-modal.png') })
      await page.mouse.click(24, 24)
      await page.waitForTimeout(500)
      const carouselClosed = await page.evaluate(() => !document.querySelector('.car-modal'))
      console.log('CAROUSEL CLOSED: ' + carouselClosed)
    }

    if (name === '06-gallery-showcase') {
      const galleryInfo = await page.evaluate(() => ({
        cards: document.querySelectorAll('.gallery-card').length,
        active: document.querySelectorAll('.gallery-card.is-active').length,
        bgVideo: !!document.querySelector('.gallery__bg video'),
        title: document.querySelector('.gallery__title')?.innerText,
        firstCard: document.querySelector('.gallery-card__cn')?.innerText
      }))
      console.log('GALLERY INFO: ' + JSON.stringify(galleryInfo))
      const galleryActive = await page.evaluate(() => ({
        title: document.querySelector('.gallery-card.is-active .gallery-card__cn')?.innerText
      }))
      console.log('GALLERY ACTIVE: ' + JSON.stringify(galleryActive))
      const activePoint = await page.evaluate(() => {
        const el = document.querySelector('.gallery-card.is-active .gallery-card__media')
        const r = el.getBoundingClientRect()
        return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) }
      })
      await page.mouse.click(activePoint.x, activePoint.y)
      await page.waitForTimeout(800)
      const galleryModal = await page.evaluate(() => ({
        modal: !!document.querySelector('.gallery-modal'),
        img: !!document.querySelector('.gallery-modal img'),
        title: document.querySelector('.gallery-modal__cap h3')?.innerText
      }))
      console.log('GALLERY MODAL: ' + JSON.stringify(galleryModal))
      await page.screenshot({ path: path.join(OUT, '06-gallery-modal.png') })
      await page.mouse.click(24, 24)
      await page.waitForTimeout(500)
      const galleryClosed = await page.evaluate(() => !document.querySelector('.gallery-modal'))
      console.log('GALLERY CLOSED: ' + galleryClosed)
    }

    if (name === '07-contact') {
      const contactInfo = await page.evaluate(() => ({
        title: document.querySelector('.contact__title')?.innerText.replace(/\s+/g, ' '),
        cols: document.querySelectorAll('.contact__col').length,
        qr: !!document.querySelector('.contact__qr img'),
        glassCards: document.querySelectorAll('.contact__glass-card').length,
        brand: document.querySelector('.contact__brand')?.innerText
      }))
      console.log('CONTACT MANTIS: ' + JSON.stringify(contactInfo))
      await page.screenshot({ path: path.join(OUT, '07-contact-mantis2.png') })
      await page.click('.contact__qr')
      await page.waitForTimeout(600)
      const qrModal = await page.evaluate(() => ({
        open: !!document.querySelector('.contact__qr-modal'),
        img: !!document.querySelector('.contact__qr-modal img')
      }))
      console.log('QR MODAL: ' + JSON.stringify(qrModal))
      await page.mouse.click(24, 24)
      await page.waitForTimeout(500)
      const qrClosed = await page.evaluate(() => !document.querySelector('.contact__qr-modal'))
      console.log('QR CLOSED: ' + qrClosed)
    }

  }

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(800)
  await page.screenshot({ path: path.join(OUT, '06-full.png'), fullPage: true })

  console.log('ERRORS:\n' + (errors.length ? errors.join('\n') : '(none)'))
  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
