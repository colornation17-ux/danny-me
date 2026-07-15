/**
 * Shared “distant shop radio” bed — SpringWire pulls + SiteRadio.
 * Megaphone-ish: midrange punch + slap echo. No hard clipping.
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

    // Megaphone / tin horn: cut mud + air, boost nasal mid scoop
    const highpass = ctx.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = 480
    highpass.Q.value = 0.7

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 2200
    lowpass.Q.value = 0.85

    const megaphonePeak = ctx.createBiquadFilter()
    megaphonePeak.type = 'peaking'
    megaphonePeak.frequency.value = 1250
    megaphonePeak.Q.value = 1.1
    megaphonePeak.gain.value = 7.5

    // Mild grit (not crushed) — soft curve waveshaper
    const grit = ctx.createWaveShaper()
    grit.curve = makeMegaphoneCurve(0.28)
    grit.oversample = '2x'

    // Plaza slap + longer feedback so the reverb reads as megaphone bounce
    const delay = ctx.createDelay(1.5)
    delay.delayTime.value = 0.22

    const feedback = ctx.createGain()
    feedback.gain.value = 0.48

    const wet = ctx.createGain()
    wet.gain.value = 0.55

    const dry = ctx.createGain()
    dry.gain.value = 0.58

    const reverbLow = ctx.createBiquadFilter()
    reverbLow.type = 'lowpass'
    reverbLow.frequency.value = 1900

    // Second tap for a clearer “hall / parking lot” echo
    const delay2 = ctx.createDelay(1.5)
    delay2.delayTime.value = 0.41
    const wet2 = ctx.createGain()
    wet2.gain.value = 0.22

    masterGain = ctx.createGain()
    masterGain.gain.value = 0

    source.connect(highpass)
    highpass.connect(megaphonePeak)
    megaphonePeak.connect(lowpass)
    lowpass.connect(grit)

    grit.connect(dry)
    dry.connect(masterGain)

    grit.connect(delay)
    delay.connect(reverbLow)
    reverbLow.connect(feedback)
    feedback.connect(delay)
    reverbLow.connect(wet)
    wet.connect(masterGain)

    grit.connect(delay2)
    delay2.connect(wet2)
    wet2.connect(masterGain)

    masterGain.connect(ctx.destination)
    connected = true
  }

  return { audio, ctx, masterGain }
}

/** Soft saturation curve — megaphone grit without brickwall clipping */
function makeMegaphoneCurve(amount = 0.25) {
  const n = 256
  const curve = new Float32Array(n)
  const k = Math.max(0.01, amount) * 40
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / (n - 1) - 1
    curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x))
  }
  return curve
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
