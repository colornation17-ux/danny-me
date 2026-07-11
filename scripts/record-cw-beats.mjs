/**
 * Record portfolio carousel clips from the live local app (embed + snapshot mode).
 * Requires: competitor-watch server on :8000 with portfolio_snapshot.json
 *
 *   npm run record:cw
 *   ONLY=competitor-deals npm run record:cw
 */
import { chromium } from 'playwright'
import { mkdir, rename, readdir, unlink } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../public/work/competitor-watch/videos')
const TMP = path.join(OUT, '_tmp')
const BASE = process.env.CW_BASE || 'http://localhost:8000'
const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(',').map((s) => s.trim())) : null
const VIEWPORT = { width: 1280, height: 900 }

const BEATS = [
  {
    id: 'sales-summary',
    path: '/?tab=insights&embed=portfolio&snapshot=portfolio#insights-pulse',
    header: /your store data/i,
    scrollId: 'insights-pulse',
    duration: 5500,
  },
  {
    id: 'weekend-playbook',
    path: '/?tab=weather&embed=portfolio&snapshot=portfolio',
    header: /weekend playbook/i,
    section: /sales targets by day|the weekend playbook/i,
    duration: 5500,
  },
  {
    id: 'competitor-deals',
    path: '/?tab=deals&embed=portfolio&snapshot=portfolio',
    header: /competitor deals/i,
    deny: /server returned 503/i,
    duration: 6000,
  },
  {
    id: 'competitive-pricing',
    path: '/?tab=insights&embed=portfolio&snapshot=portfolio#insights-pricing',
    header: /your store data/i,
    section: /your prices vs market|market reference prices/i,
    scrollId: 'insights-pricing',
    duration: 5500,
  },
  {
    id: 'customers-rfm',
    path: '/?tab=insights&embed=portfolio&snapshot=portfolio#insights-top-customers',
    header: /your store data/i,
    section: /top customers/i,
    scrollId: 'insights-top-customers',
    duration: 5500,
  },
  {
    id: 'demand-forecast',
    path: '/?tab=insights&embed=portfolio&snapshot=portfolio#insights-demand',
    header: /your store data/i,
    tabClick: /owner tools/i,
    section: /demand forecast/i,
    scrollId: 'insights-demand',
    duration: 6000,
  },
]

async function gentleDrift(page, ms) {
  const start = Date.now()
  while (Date.now() - start < ms) {
    const t = (Date.now() - start) / ms
    const y = Math.sin(t * Math.PI * 2) * 40 + t * 80
    await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: 'auto' }), y)
    await page.waitForTimeout(120)
  }
}

async function waitForBeat(page, beat) {
  await page.waitForLoadState('domcontentloaded', { timeout: 120_000 })
  await page.waitForTimeout(2500)

  if (beat.deny) {
    const bad = page.locator('main').getByText(beat.deny)
    if (await bad.isVisible({ timeout: 2000 }).catch(() => false)) {
      throw new Error(`${beat.id}: page shows error — restart server with portfolio snapshot`)
    }
  }

  if (beat.header) {
    await page.locator('header.sticky h1, header h1').filter({ hasText: beat.header }).first().waitFor({ state: 'visible', timeout: 90_000 })
  }

  if (beat.tabClick) {
    const tab = page.getByRole('tab', { name: beat.tabClick })
    if (await tab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await tab.click()
      await page.waitForTimeout(1500)
    }
  }

  if (beat.scrollId) {
    await page.locator(`#${beat.scrollId}`).first().scrollIntoViewIfNeeded()
    await page.waitForTimeout(1000)
  }

  if (beat.section) {
    await page.getByRole('heading', { name: beat.section }).first().waitFor({ state: 'visible', timeout: 90_000 })
  }

  await page.waitForTimeout(800)
}

async function recordBeat(browser, beat) {
  await mkdir(TMP, { recursive: true })
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: TMP, size: VIEWPORT },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  const url = `${BASE}${beat.path}`
  console.log(`recording ${beat.id} → ${url}`)
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120_000 })
  await waitForBeat(page, beat)
  await gentleDrift(page, beat.duration)
  const video = page.video()
  await context.close()
  const src = await video.path()
  const dest = path.join(OUT, `${beat.id}.webm`)
  await rename(src, dest)
  console.log('saved', dest)
}

const beats = ONLY ? BEATS.filter((b) => ONLY.has(b.id)) : BEATS

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ headless: true })

for (const beat of beats) {
  try {
    await recordBeat(browser, beat)
  } catch (err) {
    console.error(`FAILED ${beat.id}:`, err.message)
  }
}

await browser.close()

for (const f of await readdir(TMP).catch(() => [])) {
  await unlink(path.join(TMP, f)).catch(() => {})
}

console.log('done — videos in', OUT)
