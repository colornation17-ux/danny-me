/**
 * Shared “distant shop radio” bed — SpringWire pulls + SiteRadio.
 * Soft radio muffling + short room reverb. No grit / no crushing.
 */

export const WIRE_RADIO = {
  src: '/audio/wire-radio.mp3',
  startAt: 63, // 1:03
  volume: 0.5, // default slider 0–1
  maxGain: 0.62,
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

    // Distant shop radio — gentle band limit, not megaphone grit
    const highpass = ctx.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = 160
    highpass.Q.value = 0.45

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 2800
    lowpass.Q.value = 0.55

    const midShelf = ctx.createBiquadFilter()
    midShelf.type = 'peaking'
    midShelf.frequency.value = 900
    midShelf.Q.value = 0.65
    midShelf.gain.value = -1.2

    // Short room reverb (readable, not drowning the track)
    const delay = ctx.createDelay(1.0)
    delay.delayTime.value = 0.095

    const feedback = ctx.createGain()
    feedback.gain.value = 0.26

    const wet = ctx.createGain()
    wet.gain.value = 0.28

    const dry = ctx.createGain()
    dry.gain.value = 0.82

    const reverbLow = ctx.createBiquadFilter()
    reverbLow.type = 'lowpass'
    reverbLow.frequency.value = 2100

    masterGain = ctx.createGain()
    masterGain.gain.value = 0

    source.connect(highpass)
    highpass.connect(midShelf)
    midShelf.connect(lowpass)

    lowpass.connect(dry)
    dry.connect(masterGain)

    lowpass.connect(delay)
    delay.connect(reverbLow)
    reverbLow.connect(feedback)
    feedback.connect(delay)
    reverbLow.connect(wet)
    wet.connect(masterGain)

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
