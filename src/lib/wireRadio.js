/**
 * Shared “pocket radio” bed — SpringWire pulls + SiteRadio button.
 * Self-hosted clip at /audio/wire-radio.mp3
 */

export const WIRE_RADIO = {
  src: '/audio/wire-radio.mp3',
  startAt: 63, // 1:03
  volume: 0.14,
  title: 'Radio',
  track: 'I Had Some Help',
}

let audio = null
let ctx = null
let masterGain = null
let connected = false
let fadeTween = null
let playing = false
let startAt = WIRE_RADIO.startAt

function emit() {
  window.dispatchEvent(
    new CustomEvent('wire-radio', {
      detail: { playing, title: WIRE_RADIO.track },
    }),
  )
}

function ensureGraph(src = WIRE_RADIO.src) {
  if (typeof window === 'undefined') return null

  if (!audio) {
    audio = new Audio()
    audio.preload = 'metadata'
    audio.crossOrigin = 'anonymous'
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
  }

  const absolute = new URL(src, window.location.origin).href
  if (audio.src !== absolute) {
    audio.src = src
  }

  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return { audio, ctx: null, masterGain: null }
    ctx = new AC()
  }

  if (!connected && ctx) {
    const source = ctx.createMediaElementSource(audio)

    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 1350
    band.Q.value = 0.85

    const low = ctx.createBiquadFilter()
    low.type = 'highpass'
    low.frequency.value = 280

    const high = ctx.createBiquadFilter()
    high.type = 'lowpass'
    high.frequency.value = 3200

    const shaper = ctx.createWaveShaper()
    shaper.curve = makeSoftClip(0.35)
    shaper.oversample = '2x'

    masterGain = ctx.createGain()
    masterGain.gain.value = 0

    source.connect(low)
    low.connect(band)
    band.connect(high)
    high.connect(shaper)
    shaper.connect(masterGain)
    masterGain.connect(ctx.destination)
    connected = true
  }

  return { audio, ctx, masterGain }
}

function makeSoftClip(amount) {
  const n = 256
  const curve = new Float32Array(n)
  const k = amount * 50 + 1
  for (let i = 0; i < n; i += 1) {
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
  g.linearRampToValueAtTime(to, now + duration)
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

/** Warm metadata so first play seeks faster */
export function prefetchWireRadio(src = WIRE_RADIO.src) {
  ensureGraph(src)
}

export async function playWireRadio({
  src = WIRE_RADIO.src,
  startAt: start = WIRE_RADIO.startAt,
  volume = WIRE_RADIO.volume,
} = {}) {
  const graph = ensureGraph(src)
  if (!graph?.audio) return false

  startAt = start
  const { audio: el } = graph
  await resumeCtx()

  if (playing && !el.paused) return true

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

  fadeGain(volume, 1.1)
  playing = true
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
    volume: WIRE_RADIO.volume,
  }
}
