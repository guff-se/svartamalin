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

// Låser upp autoplay i samma user gesture som inloggning. Startar audion
// MUTED och låter den fortsätta — på mobil (Chrome/iOS) krävs att play()
// triggas direkt i user-gesture-call-stacken UTAN await innan, och att vi
// inte pausar (paus + senare play utanför user gesture blockas av vissa
// browsers även om muted-play "unlockat" elementet).
let primed = false
export function primeAudioAutoplay() {
  if (primed) return
  primed = true
  audio.muted = true
  // SYNCHRONOUS i user-gesture: play() måste anropas innan något await.
  // Vi awaitar inte — promise-resolution sker async men play()-call:et är
  // sync, vilket är vad mobila browsers kollar.
  audio.play().catch(() => {
    // Om muted-play blockas (sällsynt), startShowAudio försöker igen.
    primed = false
  })
}

// Startar musiken från 0 — anropas när reveal-animationen drar igång.
// Audion spelas redan (muted) sen unlock; vi seekar till 0 och unmutear.
export async function startShowAudio() {
  showControls()  // sätter audio.muted från localStorage-preferens
  try { audio.currentTime = 0 } catch {}
  try { await audio.play() } catch {}
}

export function pauseShowAudio() {
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
