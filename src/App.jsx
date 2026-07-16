import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
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

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
