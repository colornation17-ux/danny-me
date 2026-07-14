import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { applyPageMeta, metaForPath } from '../lib/seo'

/** Keeps document title, description, Open Graph, and canonical in sync with the route. */
export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    applyPageMeta(metaForPath(pathname))
  }, [pathname])

  return null
}
