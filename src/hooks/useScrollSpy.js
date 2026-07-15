import { useEffect, useMemo, useState } from 'react'

function chromeOffset() {
  const nav = document.querySelector('.site-nav')
  const mobileBar = document.querySelector('.cs-rail-mobile')
  const navH = nav?.getBoundingClientRect().height ?? 74
  const barH =
    mobileBar && getComputedStyle(mobileBar).display !== 'none'
      ? mobileBar.getBoundingClientRect().height
      : 0
  return navH + barH + Math.round(window.innerHeight * 0.08)
}

/**
 * Document-order scroll spy with continuous fill.
 * Forces the last section when near document bottom so short Contact bands activate.
 */
export function useScrollSpy(sectionIds, offsetPx) {
  const idsKey = useMemo(
    () => (Array.isArray(sectionIds) ? sectionIds.join('|') : ''),
    [sectionIds],
  )
  const ids = useMemo(() => (idsKey ? idsKey.split('|') : []), [idsKey])

  const [activeId, setActiveId] = useState(ids[0] ?? '')
  const [fillPct, setFillPct] = useState(0)

  useEffect(() => {
    if (!ids.length) return undefined

    let ticking = false

    const update = () => {
      ticking = false
      const sections = ids
        .map((id) => document.getElementById(id))
        .filter(Boolean)
      if (!sections.length) return

      const offset = offsetPx ?? chromeOffset()
      let activeIndex = 0

      for (let i = 0; i < sections.length; i += 1) {
        if (sections[i].getBoundingClientRect().top <= offset) {
          activeIndex = i
        } else {
          break
        }
      }

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      )
      const nearBottom = maxScroll > 0 && window.scrollY >= maxScroll - 64
      if (nearBottom) {
        activeIndex = sections.length - 1
      }

      const nextId = sections[activeIndex].id
      setActiveId((prev) => (prev === nextId ? prev : nextId))

      const n = sections.length
      if (nearBottom || activeIndex >= n - 1) {
        const lastTop = sections[n - 1].getBoundingClientRect().top
        if (nearBottom || lastTop <= offset) {
          setFillPct(100)
          return
        }
      }

      const currentTop = sections[activeIndex].getBoundingClientRect().top
      const nextTop =
        activeIndex < n - 1
          ? sections[activeIndex + 1].getBoundingClientRect().top
          : currentTop + Math.max(sections[activeIndex].offsetHeight, 1)
      const span = Math.max(nextTop - currentTop, 1)
      const intra = Math.min(1, Math.max(0, (offset - currentTop) / span))
      const pct = n <= 1 ? 100 : ((activeIndex + intra) / (n - 1)) * 100
      setFillPct(Math.min(100, Math.max(0, pct)))
    }

    const onScrollOrResize = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [ids, offsetPx])

  return {
    activeId,
    activeIdx: ids.indexOf(activeId),
    fillPct,
  }
}
