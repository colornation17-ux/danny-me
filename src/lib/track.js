import { track as vercelTrack } from '@vercel/analytics'

const onceKeys = new Set()

/**
 * Fire a Vercel Analytics custom event.
 * @param {string} name  Event name (shown in Vercel → Analytics → Events)
 * @param {Record<string, string | number | boolean | null>} [data]
 * @param {{ once?: string }} [opts]  If `once` is set, only fire once per page load for that key
 */
export function track(name, data, opts = {}) {
  try {
    if (opts.once) {
      if (onceKeys.has(opts.once)) return
      onceKeys.add(opts.once)
    }
    vercelTrack(name, data)
  } catch {
    // Analytics must never break UX
  }
}
