/**
 * Shared “shop radio” bed — SpringWire pulls + SiteRadio.
 * Clean band-limit + compressor glue + short room. No distortion.
 */

export const WIRE_RADIO = {
  src: '/audio/wire-radio.mp3',
  startAt: 63, // 1:03
  volume: 0.5, // default slider 0–1
  maxGain: 0.68,
  title: 'Radio',
  track: 'I Had Some Help',
}

export const WIRE_RADIO_FOUND_KEY = 'wire-radio-found'

/** Resets on every page load (incl. hard refresh) — not localStorage */
let foundThisSession = false

try {
  window.localStorage.removeItem(WIRE_RADIO_FOUND_KEY)
} catch {
  /* ignore */
}

let audio = null
let ctx = null
let masterGain = null
let connected = false
let fadeTween = null
let playing = false
let startAt = WIRE_RADIO.startAt
let userVolume = WIRE_RADIO.volume

function emit() {
  window.dispatchEvent(
    new CustomEvent('wire-radio', {
      detail: {
        playing,
        title: WIRE_RADIO.track,
        volume: userVolume,
        found: hasFoundWireRadio(),
      },
    }),
  )
}

export function hasFoundWireRadio() {
  return foundThisSession
}

export function markFoundWireRadio() {
  if (foundThisSession) {
    emit()
    return
  }
  foundThisSession = true
  window.dispatchEvent(new CustomEvent('wire-radio-found'))
  emit()
}

function gainFromSlider(v = userVolume) {
  return Math.max(0, Math.min(1, v)) * WIRE_RADIO.maxGain
}

/**
 * Wireless-speaker filter chain — clean band-limit + compressor glue,
 * light room reflection. No distortion. Source → chain → masterGain.
 */
export function createShopRadioEffect(ctx, source, masterGain) {
  // Remove deep bass
  const highpass = ctx.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = 140
  highpass.Q.value = 0.5

  // Soften high frequencies like a small speaker
  const lowpass = ctx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 3200
  lowpass.Q.value = 0.6

  // Reduce boxy frequencies
  const boxCut = ctx.createBiquadFilter()
  boxCut.type = 'peaking'
  boxCut.frequency.value = 700
  boxCut.Q.value = 0.8
  boxCut.gain.value = -2

  // Keep vocals understandable
  const presence = ctx.createBiquadFilter()
  presence.type = 'peaking'
  presence.frequency.value = 1800
  presence.Q.value = 0.9
  presence.gain.value = 1.5

  // Contain the dynamics like a small speaker (glue, no clipping)
  const compressor = ctx.createDynamicsCompressor()
  compressor.threshold.value = -22
  compressor.knee.value = 18
  compressor.ratio.value = 3
  compressor.attack.value = 0.015
  compressor.release.value = 0.22

  // Short room reflection
  const delay = ctx.createDelay(1)
  delay.delayTime.value = 0.075

  const feedback = ctx.createGain()
  feedback.gain.value = 0.06

  const dryGain = ctx.createGain()
  dryGain.gain.value = 0.9

  const wetGain = ctx.createGain()
  wetGain.gain.value = 0.1

  source
    .connect(highpass)
    .connect(lowpass)
    .connect(boxCut)
    .connect(presence)
    .connect(compressor)

  compressor.connect(dryGain)
  dryGain.connect(masterGain)

  compressor.connect(delay)
  delay.connect(feedback)
  feedback.connect(delay)
  delay.connect(wetGain)
  wetGain.connect(masterGain)

  return {
    highpass,
    lowpass,
    boxCut,
    presence,
    compressor,
    delay,
    feedback,
    dryGain,
    wetGain,
  }
}

function ensureGraph(src = WIRE_RADIO.src) {
  if (typeof window === 'undefined') return null

  if (!audio) {
    audio = new Audio()
    audio.preload = 'auto'
    // Same-origin static file — leave crossOrigin unset so playback
    // isn't blocked when the CDN omits CORS headers.
    audio.loop = false
    audio.addEventListener('ended', () => {
      if (!playing) return
      try {
        audio.currentTime = startAt
        audio.play().catch(() => {
          playing = false
          emit()
        })
      } catch {
        playing = false
        emit()
      }
    })
    audio.addEventListener('error', () => {
      playing = false
      emit()
      if (typeof console !== 'undefined') {
        console.warn('[wire-radio] failed to load', WIRE_RADIO.src)
      }
    })
  }

  const absolute = new URL(src, window.location.origin).href
  if (audio.src !== absolute) {
    audio.src = absolute
  }

  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return { audio, ctx: null, masterGain: null }
    ctx = new AC()
  }

  if (!connected && ctx) {
    const source = ctx.createMediaElementSource(audio)

    masterGain = ctx.createGain()
    masterGain.gain.value = 0

    createShopRadioEffect(ctx, source, masterGain)

    masterGain.connect(ctx.destination)
    connected = true
  }

  return { audio, ctx, masterGain }
}

function fadeGain(to, duration = 0.9) {
  if (!masterGain || !ctx) return
  const g = masterGain.gain
  const now = ctx.currentTime
  g.cancelScheduledValues(now)
  g.setValueAtTime(g.value, now)
  g.linearRampToValueAtTime(to, now + Math.max(0.05, duration))
}

async function resumeCtx() {
  if (ctx?.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      /* ignore */
    }
  }
}

export function prefetchWireRadio(src = WIRE_RADIO.src) {
  ensureGraph(src)
}

export function setWireRadioVolume(next) {
  userVolume = Math.max(0, Math.min(1, Number(next) || 0))
  ensureGraph()
  if (playing && masterGain && ctx) {
    fadeGain(gainFromSlider(userVolume), 0.12)
  }
  emit()
  return userVolume
}

export function getWireRadioVolume() {
  return userVolume
}

export async function playWireRadio({
  src = WIRE_RADIO.src,
  startAt: start = WIRE_RADIO.startAt,
} = {}) {
  const graph = ensureGraph(src)
  if (!graph?.audio) return false

  startAt = start
  const { audio: el } = graph
  await resumeCtx()

  if (playing && !el.paused) {
    markFoundWireRadio()
    return true
  }

  const needsSeek = el.paused && (el.currentTime < start - 0.5 || el.ended || el.currentTime === 0)
  if (needsSeek) {
    const seek = () => {
      try {
        el.currentTime = start
      } catch {
        /* ignore */
      }
    }
    if (el.readyState >= 1) seek()
    else el.addEventListener('loadedmetadata', seek, { once: true })
  }

  if (masterGain) masterGain.gain.value = 0

  try {
    await el.play()
  } catch {
    playing = false
    emit()
    return false
  }

  fadeGain(gainFromSlider(userVolume), 1.15)
  playing = true
  markFoundWireRadio()
  emit()
  return true
}

export async function pauseWireRadio() {
  const graph = ensureGraph()
  if (!graph?.audio || !playing) {
    playing = false
    emit()
    return false
  }

  fadeGain(0, 0.35)
  window.clearTimeout(fadeTween)
  fadeTween = window.setTimeout(() => {
    graph.audio.pause()
  }, 360)
  playing = false
  emit()
  return false
}

export async function toggleWireRadio(opts) {
  if (playing) return pauseWireRadio()
  return playWireRadio(opts)
}

export function isWireRadioPlaying() {
  return playing
}

export function wireRadioDefaults() {
  return {
    src: WIRE_RADIO.src,
    startAt: WIRE_RADIO.startAt,
    volume: userVolume,
  }
}
