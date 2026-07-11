import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../public/work/competitor-watch')

const VIEWPORT = { width: 1280, height: 800 }

async function shot(page, name) {
  const file = path.join(OUT, `${name}.png`)
  await page.screenshot({ path: file, fullPage: false })
  console.log('saved', file)
}

async function waitForApp(page) {
  await page.waitForSelector('[data-sidebar="sidebar"]', { timeout: 60_000 }).catch(() => {})
  await page.waitForTimeout(1500)
}

async function captureSet(baseUrl, prefix, tabs) {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: VIEWPORT })
  for (const { name, url, waitMs = 2000, action } of tabs) {
    await page.goto(`${baseUrl}${url}`, { waitUntil: 'networkidle', timeout: 120_000 })
    await waitForApp(page)
    if (action) await action(page)
    await page.waitForTimeout(waitMs)
    await shot(page, `${prefix}-${name}`)
  }
  await browser.close()
}

await mkdir(OUT, { recursive: true })

// Guest + owner-gated previews (production demo)
await captureSet('https://competitor-watch-1.onrender.com', 'guest', [
  { name: 'dashboard', url: '/?tab=home', waitMs: 8000 },
  { name: 'weekend', url: '/?tab=weather', waitMs: 4000 },
  { name: 'deals', url: '/?tab=deals', waitMs: 4000 },
  { name: 'pulse', url: '/?tab=insights#insights-pulse', waitMs: 3000 },
  {
    name: 'owner-gated',
    url: '/?tab=insights#insights-owner',
    waitMs: 3000,
  },
  {
    name: 'sign-in',
    url: '/?tab=insights',
    waitMs: 1000,
    action: async (page) => {
      const btn = page.getByRole('button', { name: /sign in/i }).first()
      if (await btn.isVisible().catch(() => false)) {
        await btn.click()
        await page.waitForTimeout(800)
      }
    },
  },
])

// Owner signed-in views (local — no APP_PASSWORD unlocks owner tools)
await captureSet('http://localhost:8000', 'owner', [
  { name: 'dashboard', url: '/?tab=home', waitMs: 6000 },
  { name: 'demand', url: '/?tab=insights#insights-owner', waitMs: 3000 },
  {
    name: 'retention',
    url: '/?tab=insights#insights-owner',
    waitMs: 500,
    action: async (page) => {
      const heading = page.getByRole('heading', { name: /retention|outreach|crm/i }).first()
      if (await heading.isVisible().catch(() => false)) {
        await heading.scrollIntoViewIfNeeded()
      }
    },
  },
  { name: 'pace', url: '/?tab=insights#insights-pulse', waitMs: 2000 },
])

console.log('done')
