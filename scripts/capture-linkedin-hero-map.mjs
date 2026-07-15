/**
 * Fresh LinkedIn clips:
 * 1) Home hero landing animation
 * 2) About RoadTrip section only — starts at Indiana, no page chrome
 */
import { chromium } from 'playwright'
import { spawnSync } from 'node:child_process'
import {
  mkdirSync,
  renameSync,
  readdirSync,
  existsSync,
  statSync,
  unlinkSync,
} from 'node:fs'
import { join } from 'node:path'

const OUT = join(process.cwd(), 'exports', 'linkedin')
const BASE = process.env.PORTFOLIO_URL || 'https://danny-me-rho.vercel.app'
const W = 1440
const H = 900

mkdirSync(OUT, { recursive: true })

function ffmpegGif(webm, gif, { ss = 0, t = 6.5, scale = 1200, fps = 18 } = {}) {
  const palette = join(OUT, '_palette.png')
  const trim = ['-ss', String(ss), '-t', String(t)]
  const vf = `fps=${fps},scale=${scale}:-1:flags=lanczos`
  let r = spawnSync(
    'ffmpeg',
    ['-y', ...trim, '-i', webm, '-vf', `${vf},palettegen=stats_mode=diff`, palette],
    { stdio: 'inherit' },
  )
  if (r.status !== 0) throw new Error('palettegen failed')
  r = spawnSync(
    'ffmpeg',
    [
      '-y',
      ...trim,
      '-i',
      webm,
      '-i',
      palette,
      '-lavfi',
      `${vf}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4`,
      '-loop',
      '0',
      gif,
    ],
    { stdio: 'inherit' },
  )
  if (r.status !== 0) throw new Error('gif failed')
}

function ffmpegMp4(webm, mp4, { ss = 0, t = 6.5 } = {}) {
  const r = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-ss',
      String(ss),
      '-t',
      String(t),
      '-i',
      webm,
      '-vf',
      'scale=1440:-2',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-crf',
      '18',
      '-an',
      mp4,
    ],
    { stdio: 'inherit' },
  )
  if (r.status !== 0) throw new Error('mp4 failed')
}

async function record(name, url, run) {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 2,
    recordVideo: { dir: OUT, size: { width: W, height: H } },
  })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1000)
  await run(page)
  await page.close()
  await context.close()
  await browser.close()

  const newest = readdirSync(OUT)
    .filter((f) => f.endsWith('.webm'))
    .map((f) => ({ f, t: statSync(join(OUT, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t)[0]
  if (!newest) throw new Error('no webm')
  const dest = join(OUT, `${name}.webm`)
  if (existsSync(dest)) unlinkSync(dest)
  renameSync(join(OUT, newest.f), dest)
  return dest
}

async function main() {
  // ── 1) Hero landing ───────────────────────────────────────────────
  const hero = await record('hero-landing', `${BASE}/`, async (page) => {
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(7800)
  })
  ffmpegGif(hero, join(OUT, 'hero-landing-linkedin.gif'), { ss: 1.8, t: 6.5 })
  ffmpegMp4(hero, join(OUT, 'hero-landing.mp4'), { ss: 1.8, t: 6.5 })
  console.log('✓ hero-landing')

  // ── 2) Map section only, start Indiana ─────────────────────────────
  const map = await record('about-roadtrip', `${BASE}/about`, async (page) => {
    await page.waitForSelector('.road-trip__pin', { timeout: 20000 })

    // Hide chrome so the GIF is only the drive section
    await page.addStyleTag({
      content: `
        .site-nav,
        .site-footer,
        .about-hero__content,
        .about-solo-trips,
        .about-photobook,
        .about-travel > .about-section__eyebrow,
        .about-travel > .about-travel__story {
          display: none !important;
        }
        .about-travel { padding: 0 !important; margin: 0 !important; }
        .road-trip__pin {
          background: #ffffff !important;
        }
      `,
    })

    // Park at scroll start of the pin = Indianapolis (stop 0)
    await page.evaluate(() => {
      const trip = document.querySelector('.road-trip')
      const y = trip.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, y)
    })
    await page.waitForTimeout(700)
    await page.evaluate(() => {
      // force ST to resolve pin metrics after style hide
      window.dispatchEvent(new Event('resize'))
    })
    await page.waitForTimeout(500)

    // Confirm we're at the trip; hold Indiana briefly, then drive west
    await page.evaluate(async () => {
      const trip = document.querySelector('.road-trip')
      const start = trip.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, start)
      await new Promise((r) => setTimeout(r, 900)) // hold Indy

      // Drive through ~first half of route (IN → plains/west) — smooth
      const distance = Math.max(2800, window.innerHeight * 2.8)
      const duration = 7200
      const t0 = performance.now()
      await new Promise((resolve) => {
        const frame = (now) => {
          const p = Math.min(1, (now - t0) / duration)
          const e = p * p * (3 - 2 * p)
          window.scrollTo(0, start + distance * e)
          if (p < 1) requestAnimationFrame(frame)
          else resolve()
        }
        requestAnimationFrame(frame)
      })
    })
    await page.waitForTimeout(400)
  })

  ffmpegGif(map, join(OUT, 'about-roadtrip-linkedin.gif'), {
    ss: 1.0,
    t: 8.0,
    scale: 1200,
    fps: 18,
  })
  ffmpegMp4(map, join(OUT, 'about-roadtrip.mp4'), { ss: 1.0, t: 8.0 })
  // Smaller upload-friendly GIF
  ffmpegGif(map, join(OUT, 'about-roadtrip-linkedin-sm.gif'), {
    ss: 1.2,
    t: 6.5,
    scale: 1080,
    fps: 14,
  })
  console.log('✓ about-roadtrip (from Indiana)')
  console.log('Files in', OUT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
