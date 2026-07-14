import { SITE } from '../data/site'
import { getProjectBySlug } from '../data/projects'

const DEFAULT_DESCRIPTION =
  'Danny Varghese — product designer who ships AI into real operations. Selected work across conversational AI, retail systems, and HMI.'

const DEFAULT_IMAGE = `${SITE.url}/og.png?v=5`

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function applyPageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
}) {
  const url = `${SITE.url}${path === '/' ? '/' : path}`
  const fullTitle = title.includes(SITE.name) ? title : `${title} · ${SITE.name}`

  document.title = fullTitle
  upsertMeta('name', 'description', description)
  upsertMeta('property', 'og:type', type)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:title', fullTitle)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:image', image.startsWith('http') ? image : `${SITE.url}${image}`)
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', fullTitle)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta(
    'name',
    'twitter:image',
    image.startsWith('http') ? image : `${SITE.url}${image}`,
  )
  upsertLink('canonical', url)
}

export function metaForPath(pathname) {
  if (pathname === '/') {
    return {
      title: `${SITE.name} — Product Designer`,
      description: DEFAULT_DESCRIPTION,
      path: '/',
      image: DEFAULT_IMAGE,
    }
  }

  if (pathname === '/about') {
    return {
      title: 'About',
      description: `${SITE.name} — product designer between Indianapolis and Georgia. HCI, retail AI ops, photography, and road trips.`,
      path: '/about',
    }
  }

  if (pathname === '/play') {
    return {
      title: 'Lab',
      description: `Side quests and experiments by ${SITE.name}: pitch prototypes, student projects, design systems, branding, and motion.`,
      path: '/play',
    }
  }

  const projectMatch = pathname.match(/^\/projects\/([^/]+)\/?$/)
  if (projectMatch) {
    const project = getProjectBySlug(projectMatch[1])
    if (project) {
      const imagePath = project.hero || project.cover || '/og.png'
      return {
        title: project.title,
        description: project.blurb || project.outcome || DEFAULT_DESCRIPTION,
        path: `/projects/${project.slug}`,
        image: imagePath.startsWith('http') ? imagePath : `${SITE.url}${imagePath}`,
        type: 'article',
      }
    }
    return {
      title: 'Project not found',
      description: DEFAULT_DESCRIPTION,
      path: pathname,
    }
  }

  return {
    title: SITE.name,
    description: DEFAULT_DESCRIPTION,
    path: pathname,
  }
}
