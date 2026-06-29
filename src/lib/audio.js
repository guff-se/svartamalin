import { startSongSubtitles, stopSongSubtitles } from './subtitles.js'

const audio = document.getElementById('party-audio')
const topControls = document.getElementById('top-controls')
const toggle = document.getElementById('mute-toggle')

const MUTED_KEY = 'svartamalin:muted'

function wantsMuted() {
  return localStorage.getItem(MUTED_KEY) === '1'
}

function applyMuted(muted) {
  audio.muted = muted
  toggle.textContent = muted ? '🔇' : '🔊'
  toggle.setAttribute('aria-label', muted ? 'Slå på ljud' : 'Stäng av ljud')
  localStorage.setItem(MUTED_KEY, muted ? '1' : '0')
}

// Synkront i user-gesture — inga await före play().
let sessionUnlocked = false
let mutedBackgroundPlay = false
let gestureListenerInstalled = false

function whenAudioReady() {
  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    const done = () => {
      audio.removeEventListener('canplaythrough', done)
      audio.removeEventListener('error', done)
      resolve()
    }
    audio.addEventListener('canplaythrough', done, { once: true })
    audio.addEventListener('error', done, { once: true })
    audio.load()
  })
}

function unlockFromGesture() {
  if (sessionUnlocked) return
  sessionUnlocked = true
  const prefMuted = wantsMuted()
  audio.muted = true
  audio.play().catch(() => {})
  audio.pause()
  try { audio.currentTime = 0 } catch {}
  audio.muted = prefMuted
}

async function tryStartAudible() {
  if (wantsMuted()) {
    audio.pause()
    stopSongSubtitles()
    return true
  }
  try {
    await audio.play()
    startSongSubtitles()
    return true
  } catch {
    return false
  }
}

function installGestureUnlockUntilPlaying() {
  if (gestureListenerInstalled || sessionUnlocked) return
  gestureListenerInstalled = true

  const onGesture = () => {
    unlockFromGesture()
    void (async () => {
      await whenAudioReady()
      try { audio.currentTime = 0 } catch {}
      applyMuted(wantsMuted())
      if (await tryStartAudible()) {
        window.removeEventListener('pointerdown', onGesture, true)
        gestureListenerInstalled = false
      }
    })()
  }

  window.addEventListener('pointerdown', onGesture, { capture: true, passive: true })
}

async function startMutedBackgroundPlay() {
  if (sessionUnlocked || mutedBackgroundPlay) return
  await whenAudioReady()
  audio.muted = true
  try {
    await audio.play()
    mutedBackgroundPlay = true
  } catch {}
}

toggle.addEventListener('click', () => {
  // Fälla: audion spelar inte men ikonen visar 🔊 — klick råkar muta.
  // Om ljud önskas men är pausat: starta (gest), toggla inte till mute.
  if (audio.paused && !wantsMuted()) {
    applyMuted(false)
    unlockFromGesture()
    void tryStartAudible()
    return
  }

  const wasMuted = audio.muted
  applyMuted(!wasMuted)
  if (!audio.muted) {
    unlockFromGesture()
    void tryStartAudible()
  } else {
    audio.pause()
    stopSongSubtitles()
  }
})

function showControls() {
  topControls.hidden = false
  applyMuted(wantsMuted())
}

// Anropas från unlock-submit — måste vara synkront (inga await i prime).
export function primeAudioAutoplay() {
  unlockFromGesture()
}

// True om audion redan "välsignats" av en user-gesture denna sidladdning.
// Fresh login → true (login-klicket primade). Reload → false tills användaren
// interagerar. Används för att avgöra om retur-splashen behövs.
export function isAudioUnlocked() {
  return sessionUnlocked
}

export function prepareAudioForReturningSession() {
  showControls()
  installGestureUnlockUntilPlaying()
  const loading = document.getElementById('loading-screen')
  if (loading) {
    loading.addEventListener('pointerdown', () => unlockFromGesture(), { once: true, capture: true })
  }
  void startMutedBackgroundPlay()
}

export async function startShowAudio() {
  await whenAudioReady()
  if (!sessionUnlocked && !mutedBackgroundPlay) {
    await startMutedBackgroundPlay()
  }

  try { audio.currentTime = 0 } catch {}
  showControls()

  if (!audio.muted) {
    const ok = await tryStartAudible()
    if (!ok) installGestureUnlockUntilPlaying()
  } else {
    audio.pause()
    stopSongSubtitles()
  }
}

export function pauseShowAudio() {
  stopSongSubtitles()
  audio.pause()
  try { audio.currentTime = 0 } catch {}
}

export function showTopControls() {
  showControls()
}

export function showMuteToggle() {
  showTopControls()
}

export function hideTopControls() {
  topControls.hidden = true
}
