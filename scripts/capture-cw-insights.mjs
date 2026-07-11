import { chromium } from 'playwright'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../public/work/competitor-watch')
const VIEWPORT = { width: 1280, height: 800 }

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: VIEWPORT })

await page.goto('http://localhost:8000/?tab=insights#insights-owner', {
  waitUntil: 'networkidle',
  timeout: 120_000,
})
await page.waitForSelector('[data-sidebar="sidebar"]', { timeout: 60_000 }).catch(() => {})
await page.waitForTimeout(3000)

// Owner tools tab — full scrollable page with forecast + CRM
const ownerTab = page.getByRole('tab', { name: /owner tools/i })
if (await ownerTab.isVisible().catch(() => false)) {
  await ownerTab.click()
  await page.waitForTimeout(2500)
}

await page.waitForSelector('text=Demand forecast', { timeout: 30_000 }).catch(() => {})
await page.waitForTimeout(1500)

const fullPath = path.join(OUT, 'owner-insights-full.png')
await page.screenshot({ path: fullPath, fullPage: true })
console.log('saved', fullPath)

// Focused crops via scroll position for fallback slides
async function scrollShot(name, locatorText) {
  const el = page.getByRole('heading', { name: locatorText }).first()
  if (await el.isVisible().catch(() => false)) {
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)
    await page.screenshot({
      path: path.join(OUT, `${name}.png`),
      fullPage: false,
    })
    console.log('saved', name)
  }
}

await scrollShot('owner-forecast', /demand forecast/i)
await scrollShot('owner-crm', /segments & outreach/i)

await browser.close()
console.log('done')
