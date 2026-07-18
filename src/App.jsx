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

/** Scroll to hash targets, or top of page — hash-aware so Work → #projects works. */
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
            target.focus({ preventScroll: true })
          } catch {
            /* ignore */
          }
          return
        }
      }

      window.scrollTo(0, 0)
      try {
        document.getElementById('main-content')?.focus({ preventScroll: true })
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
