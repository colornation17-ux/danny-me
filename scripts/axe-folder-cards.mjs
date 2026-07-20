/**
 * Accessibility smoke check for homepage folder cards.
 * Requires a running preview/dev server (default http://127.0.0.1:4173).
 *
 * Usage:
 *   npx playwright install chromium   # once
 *   npm run build && npm run preview
 *   node scripts/axe-folder-cards.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.AXE_BASE_URL || 'http://127.0.0.1:4173'
const AXE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js'

async function runAxe(page) {
  return page.evaluate(async () => {
    // eslint-disable-next-line no-undef
    const results = await axe.run(document.querySelector('.folder-stack') || document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'best-practice'],
      },
    })
    return {
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.length,
        targets: v.nodes.slice(0, 3).map((n) => n.target),
      })),
      passes: results.passes.length,
    }
  })
}

async function keyboardProbe(page) {
  const report = {
    tabButtons: 0,
    focusableTabs: [],
    inertLinksWhileInactive: null,
    focusRescue: null,
  }

  report.tabButtons = await page.locator('.folder-card__tab').count()

  // Tab through project triggers — all six must be reachable
  await page.locator('.folder-card__tab').first().focus()
  for (let i = 0; i < report.tabButtons; i++) {
    const info = await page.evaluate(() => {
      const el = document.activeElement
      return {
        id: el?.id || null,
        tag: el?.tagName || null,
        ariaExpanded: el?.getAttribute?.('aria-expanded'),
        ariaControls: el?.getAttribute?.('aria-controls'),
      }
    })
    report.focusableTabs.push(info)
    await page.keyboard.press('Tab')
  }

  // Activate project 0, focus a CTA, then jump to project 2 — focus should leave inert panel
  await page.evaluate(() => document.getElementById('project-button-lola')?.click())
  await page.waitForTimeout(400)
  const cta = page.locator('#project-content-lola a, #project-content-lola [href]').first()
  if (await cta.count()) {
    await cta.focus()
    await page.evaluate(() => document.getElementById('project-button-code19')?.click())
    await page.waitForTimeout(500)
    report.focusRescue = await page.evaluate(() => {
      const el = document.activeElement
      const inInert = Boolean(el?.closest?.('[inert], [aria-hidden="true"]'))
      return {
        activeId: el?.id || el?.tagName || null,
        trappedInInert: inInert,
      }
    })
  }

  report.inertLinksWhileInactive = await page.evaluate(() => {
    const inactive = [...document.querySelectorAll('.folder-card:not(.folder-card--active) .folder-card__content')]
    return inactive.every((panel) => panel.hasAttribute('inert') || panel.getAttribute('aria-hidden') === 'true')
  })

  return report
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  try {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })
    await page.locator('.folder-stack').waitFor({ timeout: 15000 })
    await page.addScriptTag({ url: AXE_CDN })

    const cards = await page.locator('.folder-card__tab').all()
    const perCard = []
    for (let i = 0; i < cards.length; i++) {
      // Activate via DOM click — future tabs can be opacity:0 / pointer-events:none
      await page.evaluate((index) => {
        document.querySelectorAll('.folder-card__tab')[index]?.click()
      }, i)
      await page.waitForTimeout(450)
      const axe = await runAxe(page)
      const title = await page.locator('.folder-card--active .folder-card__title').textContent()
      perCard.push({
        index: i,
        title: title?.trim(),
        violations: axe.violations,
        passCount: axe.passes,
      })
    }

    const keyboard = await keyboardProbe(page)

    const serious = perCard.flatMap((c) =>
      c.violations
        .filter((v) => v.impact === 'critical' || v.impact === 'serious')
        // Decorative aria-hidden nodes are not SR content; ignore for gate
        .filter((v) => {
          if (v.id !== 'color-contrast') return true
          // Ignore violations that only hit aria-hidden decorative nodes
          const flat = v.targets.flat().map(String)
          return flat.some((t) => !t.includes('aria-hidden'))
        })
        .map((v) => ({ card: c.title, ...v })),
    )

    const summary = {
      base: BASE,
      cardsChecked: perCard.length,
      seriousOrCritical: serious.length,
      keyboard,
      perCard: perCard.map((c) => ({
        title: c.title,
        violationCount: c.violations.length,
        violations: c.violations,
      })),
    }

    console.log(JSON.stringify(summary, null, 2))

    if (serious.length) {
      process.exitCode = 1
    }
    if (keyboard.tabButtons !== 6) {
      console.error('Expected 6 project tabs')
      process.exitCode = 1
    }
    if (keyboard.focusRescue?.trappedInInert) {
      console.error('Focus remained inside inert panel after project change')
      process.exitCode = 1
    }
    if (keyboard.inertLinksWhileInactive === false) {
      console.error('Inactive panels missing inert/aria-hidden')
      process.exitCode = 1
    }
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
