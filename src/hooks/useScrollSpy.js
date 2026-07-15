import { useEffect, useState } from 'react'

/** Active section = last whose top crossed the offset line below the sticky nav. */
export function useScrollSpy(sectionIds, offsetPx) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!sections.length) return

    let ticking = false

    const update = () => {
      ticking = false
      const nav = document.querySelector('.site-nav')
      const offset =
        offsetPx ??
        (nav?.getBoundingClientRect().height ?? 74) + Math.round(window.innerHeight * 0.12)
      let next = sections[0].id

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= offset) {
          next = section.id
        } else {
          break
        }
      }

      setActiveId((prev) => (prev === next ? prev : next))
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
  }, [sectionIds, offsetPx])

  return { activeId, activeIdx: sectionIds.indexOf(activeId) }
}
