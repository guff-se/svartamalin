const audio = document.getElementById('party-audio')
const topControls = document.getElementById('top-controls')
const toggle = document.getElementById('mute-toggle')

const MUTED_KEY = 'svartamalin:muted'

function applyMuted(muted) {
  audio.muted = muted
  toggle.textContent = muted ? '🔇' : '🔊'
  toggle.setAttribute('aria-label', muted ? 'Slå på ljud' : 'Stäng av ljud')
  localStorage.setItem(MUTED_KEY, muted ? '1' : '0')
}

toggle.addEventListener('click', () => applyMuted(!audio.muted))

function showControls() {
  topControls.hidden = false
  applyMuted(localStorage.getItem(MUTED_KEY) === '1')
}

// Låser upp autoplay-rätten i samma user gesture som inloggning, utan att
// låta låten höras. Använder muted play+pause-tricket, vilket browser-policies
// tillåter även utan klick. Idempotent — multipla anrop ger samma promise.
let primingPromise = null
export function primeAudioAutoplay() {
  showControls()
  if (primingPromise) return primingPromise
  primingPromise = (async () => {
    const wasMuted = audio.muted
    audio.muted = true
    try {
      await audio.play()
      audio.pause()
      try { audio.currentTime = 0 } catch {}
    } catch {
      // Autoplay blockerad — startShowAudio försöker igen senare.
    }
    audio.muted = wasMuted
  })()
  return primingPromise
}

// Startar musiken från 0 — anropas när reveal-animationen drar igång.
// Awaitar primingen så vi inte race:ar med dess pause().
export async function startShowAudio() {
  showControls()
  if (primingPromise) {
    try { await primingPromise } catch {}
  }
  try { audio.currentTime = 0 } catch {}
  if (!audio.muted) {
    try { await audio.play() } catch {}
  }
}

export function pauseShowAudio() {
  audio.pause()
  try { audio.currentTime = 0 } catch {}
}

export function showMuteToggle() {
  showControls()
}

export function hideTopControls() {
  topControls.hidden = true
}
