/**
 * Capture LinkedIn clips:
 * 1) Home hero float
 * 2) About RoadTrip map (smooth rAF scroll — avoids step jitter)
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

function toGif(webmPath, gifPath, { ss = 0, t = null, scale = 1200, fps = 18 } = {}) {
  const palette = join(OUT, '_palette.png')
  const trim = []
  if (ss) trim.push('-ss', String(ss))
  if (t) trim.push('-t', String(t))
  const vf = `fps=${fps},scale=${scale}:-1:flags=lanczos`
  const r1 = spawnSync(
    'ffmpeg',
    ['-y', ...trim, '-i', webmPath, '-vf', `${vf},palettegen=stats_mode=diff`, palette],
    { stdio: 'inherit' },
  )
  if (r1.status !== 0) throw new Error(`palettegen failed: ${webmPath}`)
  const r2 = spawnSync(
    'ffmpeg',
    [
      '-y',
      ...trim,
      '-i',
      webmPath,
      '-i',
      palette,
      '-lavfi',
      `${vf}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4`,
      '-loop',
      '0',
      gifPath,
    ],
    { stdio: 'inherit' },
  )
  if (r2.status !== 0) throw new Error(`paletteuse failed: ${webmPath}`)
}

function toMp4(webmPath, mp4Path, { ss = 0, t = null } = {}) {
  const trim = []
  if (ss) trim.push('-ss', String(ss))
  if (t) trim.push('-t', String(t))
  const r = spawnSync(
    'ffmpeg',
    [
      '-y',
      ...trim,
      '-i',
      webmPath,
      '-vf',
      'scale=1440:-2',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-crf',
      '18',
      '-an',
      mp4Path,
    ],
    { stdio: 'inherit' },
  )
  if (r.status !== 0) throw new Error(`mp4 failed: ${webmPath}`)
}

async function recordClip(name, url, run) {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 2,
    recordVideo: { dir: OUT, size: { width: W, height: H } },
  })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1200)
  await run(page)
  await page.close()
  await context.close()
  await browser.close()

  const files = readdirSync(OUT)
    .filter((f) => f.endsWith('.webm'))
    .map((f) => ({ f, t: statSync(join(OUT, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t)
  if (!files.length) throw new Error('No webm recorded')
  const src = join(OUT, files[0].f)
  const dest = join(OUT, `${name}.webm`)
  if (existsSync(dest)) unlinkSync(dest)
  renameSync(src, dest)
  return dest
}

async function main() {
  // ── Hero ──────────────────────────────────────────────────────────
  const heroWebm = await recordClip('hero-landing', `${BASE}/`, async (page) => {
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(7500)
  })
  toGif(heroWebm, join(OUT, 'hero-landing-linkedin.gif'), { ss: 2.0, t: 6.5 })
  toMp4(heroWebm, join(OUT, 'hero-landing.mp4'), { ss: 2.0, t: 6.5 })
  console.log('Hero done')

  // ── About Road Trip map ───────────────────────────────────────────
  const mapWebm = await recordClip('about-roadtrip', `${BASE}/about`, async (page) => {
    await page.waitForSelector('.road-trip', { timeout: 20000 })
    // Jump to trip, let ScrollTrigger pin settle
    await page.evaluate(() => {
      const el = document.querySelector('.road-trip')
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 8)
    })
    await page.waitForTimeout(900)
    await page.evaluate(() => {
      // eslint-disable-next-line no-undef
      if (window.ScrollTrigger) window.ScrollTrigger.refresh()
    }).catch(() => {})

    // Smooth rAF scroll through the pinned scrub distance
    await page.evaluate(async () => {
      const trip = document.querySelector('.road-trip')
      if (!trip) return
      const start = trip.getBoundingClientRect().top + window.scrollY
      // Match RoadTrip end ≈ innerHeight * (2.2 + stops*0.12) — drive most of it
      const distance = Math.max(3200, window.innerHeight * 3.4)
      const duration = 7800
      const t0 = performance.now()
      await new Promise((resolve) => {
        const frame = (now) => {
          const p = Math.min(1, (now - t0) / duration)
          // smoothstep — less mechanical than linear steps
          const e = p * p * (3 - 2 * p)
          window.scrollTo(0, start + distance * e)
          if (p < 1) requestAnimationFrame(frame)
          else resolve()
        }
        requestAnimationFrame(frame)
      })
    })
    await page.waitForTimeout(500)
  })
  toGif(mapWebm, join(OUT, 'about-roadtrip-linkedin.gif'), {
    ss: 1.2,
    t: 8.0,
    scale: 1200,
    fps: 18,
  })
  toMp4(mapWebm, join(OUT, 'about-roadtrip.mp4'), { ss: 1.2, t: 8.0 })
  console.log('Road trip done →', OUT)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
