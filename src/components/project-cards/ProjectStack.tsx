import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import gsap from 'gsap'
import ProjectCard from './ProjectCard'
import {
  resolveLayoutMode,
  type FeaturedProjectCard,
  type LayoutMode,
} from './project-card.types'
import './project-cards.css'

const NAV_H = 74

type Props = {
  projects: FeaturedProjectCard[]
}

/**
 * ProjectStack — controller for active index, scroll scrub (desktop), and
 * responsive layout mode (desktop folder / tablet rail / mobile accordion).
 */
export default function ProjectStack({ projects }: Props) {
  const stackRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [navH, setNavH] = useState(NAV_H)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => {
    if (typeof window === 'undefined') return 'desktop'
    return resolveLayoutMode(window.innerWidth, window.innerHeight)
  })
  const total = projects.length
  const activeIndexRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const read = () => setReduceMotion(mq.matches)
    read()
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])

  useEffect(() => {
    const el = stackRef.current
    if (!el) return undefined

    const syncMode = () => {
      const width = el.clientWidth || window.innerWidth
      const height = window.innerHeight
      setLayoutMode(resolveLayoutMode(width, height))
    }

    syncMode()
    const ro = new ResizeObserver(syncMode)
    ro.observe(el)
    window.addEventListener('resize', syncMode, { passive: true })
    window.visualViewport?.addEventListener('resize', syncMode)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', syncMode)
      window.visualViewport?.removeEventListener('resize', syncMode)
    }
  }, [])

  useEffect(() => {
    const nav = document.querySelector('.site-nav--folio, .site-nav')
    if (!nav) return undefined
    const read = () => {
      const h = Math.round(nav.getBoundingClientRect().height) || NAV_H
      setNavH(h)
      // Measured nav offset only — never tab width
      stackRef.current?.style.setProperty('--folder-nav-h', `${h}px`)
      stackRef.current?.style.setProperty('--pc-nav-h', `${h}px`)
    }
    read()
    const ro = new ResizeObserver(read)
    ro.observe(nav)
    window.visualViewport?.addEventListener('resize', read)
    return () => {
      ro.disconnect()
      window.visualViewport?.removeEventListener('resize', read)
    }
  }, [])

  useEffect(() => {
    if (layoutMode !== 'desktop') return undefined
    const stack = stackRef.current
    if (!stack) return undefined

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const rect = stack.getBoundingClientRect()
        const scrolled = -(rect.top - navH)
        const stickyH = window.innerHeight - navH
        const scrollRange = stack.offsetHeight - stickyH
        if (scrollRange <= 0 || total <= 1) {
          if (activeIndexRef.current !== 0) {
            activeIndexRef.current = 0
            setActiveIndex(0)
          }
          return
        }
        const progress = Math.max(0, Math.min(1, scrolled / scrollRange))
        const idx = Math.round(progress * (total - 1))
        if (idx !== activeIndexRef.current) {
          activeIndexRef.current = idx
          // Do not move focus when scroll changes active project
          setActiveIndex(idx)
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.visualViewport?.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.visualViewport?.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [total, navH, layoutMode])

  const prevActive = useRef(0)
  useLayoutEffect(() => {
    if (reduceMotion || layoutMode !== 'desktop') return
    const prev = prevActive.current
    prevActive.current = activeIndex
    if (activeIndex <= prev) return
    const stack = stackRef.current
    if (!stack) return
    const card = stack.querySelector(`[data-index="${activeIndex}"]`)
    if (!card) return
    gsap.killTweensOf(card)
    gsap.fromTo(
      card,
      { y: '105%' },
      {
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
        clearProps: 'transform',
        onComplete: () => {
          gsap.set(card, { clearProps: 'willChange' })
        },
      },
    )
  }, [activeIndex, reduceMotion, layoutMode])

  useEffect(() => {
    if (layoutMode === 'desktop') return undefined
    const stack = stackRef.current
    if (!stack) return undefined
    const cards = stack.querySelectorAll('.folder-card')
    gsap.killTweensOf(cards)
    gsap.set(cards, { clearProps: 'transform' })
    return undefined
  }, [layoutMode])

  const activate = useCallback(
    (index: number) => {
      if (layoutMode !== 'desktop') {
        activeIndexRef.current = index
        setActiveIndex(index)
        // Bring the opened accordion / rail panel into view after layout
        window.requestAnimationFrame(() => {
          const card = stackRef.current?.querySelector(
            `[data-index="${index}"]`,
          )
          card?.scrollIntoView({
            block: 'nearest',
            behavior: reduceMotion ? 'auto' : 'smooth',
          })
        })
        return
      }
      const stack = stackRef.current
      if (!stack || total <= 0) return
      const stackAbsTop = stack.getBoundingClientRect().top + window.scrollY
      const stickyH = window.innerHeight - navH
      const scrollRange = Math.max(0, stack.offsetHeight - stickyH)
      const progress = total <= 1 ? 0 : index / (total - 1)
      const targetScroll = stackAbsTop - navH + progress * scrollRange
      window.scrollTo({
        top: targetScroll,
        behavior: reduceMotion ? 'auto' : 'smooth',
      })
    },
    [total, navH, reduceMotion, layoutMode],
  )

  return (
    <div
      className={`folder-stack project-stack folder-stack--${layoutMode}`}
      ref={stackRef}
      style={
        {
          '--folder-count': total,
        } as CSSProperties
      }
      data-layout={layoutMode}
      aria-label={`${total} featured projects`}
    >
      <div className="folder-sticky">
        {projects.map((project, index) => {
          const cardState =
            index < activeIndex
              ? 'past'
              : index === activeIndex
                ? 'active'
                : 'future'
          return (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              total={total}
              cardState={cardState}
              layoutMode={layoutMode}
              reduceMotion={reduceMotion}
              onActivate={activate}
            />
          )
        })}
      </div>
    </div>
  )
}
