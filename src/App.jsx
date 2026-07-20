import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useLayoutEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import SiteRadioGate from './components/SiteRadioGate'
import Seo from './components/Seo'
import Home from './pages/Home'
import About from './pages/About'
import Play from './pages/Play'
import Project from './pages/Project'
import NotFound from './pages/NotFound'

/** Scroll to hash targets, or top of page — hash-aware so Work → #projects works.
 *  On route change, move focus to the page H1 (or main) so SR users hear the new view. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) {
        const id = decodeURIComponent(hash.slice(1))
        const target = document.getElementById(id)
        if (target) {
          target.scrollIntoView({ block: 'start' })
          try {
            if (!target.hasAttribute('tabindex')) {
              target.setAttribute('tabindex', '-1')
            }
            target.focus({ preventScroll: true })
          } catch {
            /* ignore */
          }
          return
        }
      }

      window.scrollTo(0, 0)
      try {
        const main = document.getElementById('main-content')
        const heading = main?.querySelector('h1')
        const focusTarget = heading || main
        if (heading && !heading.hasAttribute('tabindex')) {
          heading.setAttribute('tabindex', '-1')
        }
        focusTarget?.focus({ preventScroll: true })
      } catch {
        /* ignore */
      }
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Seo />
      <div className="app">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Nav />
        <main className="main" id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/play" element={<Play />} />
            <Route path="/projects/:slug" element={<Project />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <SiteRadioGate />
        <Footer />
      </div>
      {/* Visitors, pages, referrers, countries — Vercel → Analytics.
          Custom events (pull_wire, career_timeline, photo_map) need Pro → Events tab. */}
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  )
}
