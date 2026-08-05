import { renderUnlock } from './pages/unlock.js'
import { bindMuteButton, hideTopControls, pauseShowAudio, prepareAudioForReturningSession, primeAudioAutoplay, isAudioUnlocked } from './lib/audio.js'
import { clearSession, getGuestId } from './lib/state.js'
import { showLoading, hideLoading } from './lib/loading.js'
import { initPerf } from './lib/perf.js'
import { preloadAssets, preloadCrewPortraits } from './lib/preload.js'
import { mountMapBackground, unmountMapBackground } from './components/map.js'
import { unmountWebglMap } from './components/webgl-map/index.js'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

initPerf()
// Animation-assets först. När de är inne i cache, börja ladda crew-portraits
// i bakgrunden — undviker konkurrans med Pixi/reveal under intro-animationen.
preloadAssets().then(preloadCrewPortraits)

const app = document.getElementById('app')

// Re-export så befintliga importörer fortsätter funka
export { showLoading, hideLoading }

function isUnlocked() {
  return localStorage.getItem('svartamalin:unlocked') === '1'
}

function markUnlocked() {
  localStorage.setItem('svartamalin:unlocked', '1')
}

function logout() {
  clearSession()
  pauseShowAudio()
  hideTopControls()
  unmountMapBackground()
  unmountWebglMap()
  route()
}

document.getElementById('logout-btn').addEventListener('click', logout)
document.getElementById('info-btn').addEventListener('click', async () => {
  const { openInfoModal } = await import('./pages/info-edit.js')
  openInfoModal()
})

function devRoute() {
  const path = location.pathname.replace(/\/$/, '') || '/'
  if (path === '/framefix') return 'framefix'
  if (path === '/frameselect') return 'frameselect'
  return null
}

function isOldRoute() {
  const path = location.pathname.replace(/\/$/, '') || '/'
  return path === '/old'
}

// Themed "Sätt segel"-splash för återvändande sessioner. Resolvar när
// användaren tappar — tappet är user-gesturen som låser upp audion.
function showReturningSplash() {
  return new Promise((resolve) => {
    const el = document.createElement('div')
    el.className = 'returning-splash'
    el.innerHTML = `
      <div class="returning-splash__inner">
        <button class="returning-splash__btn" type="button">Sätt segel!</button>
        <p class="returning-splash__audio-hint">
          <button type="button" class="audio-hint__mute" aria-label="Stäng av ljud">🔊</button>
          Ljud rekommenderas
        </p>
      </div>
    `
    const go = () => {
      primeAudioAutoplay()   // synkront i gesturen — välsignar audio-elementet
      el.removeEventListener('click', go)
      el.remove()
      resolve()
    }
    el.addEventListener('click', go)
    document.body.appendChild(el)
    bindMuteButton(el.querySelector('.audio-hint__mute'))
    el.querySelector('.returning-splash__btn')?.focus()
  })
}


async function route() {
  const dev = devRoute()
  if (dev === 'framefix') {
    hideTopControls()
    unmountMapBackground()
    document.body.classList.remove('locked')
    const { renderFramefix } = await import('./pages/framefix.js')
    renderFramefix(app)
    return
  }
  if (dev === 'frameselect') {
    hideTopControls()
    unmountMapBackground()
    document.body.classList.remove('locked')
    const { renderFrameselect } = await import('./pages/frameselect.js')
    renderFrameselect(app)
    return
  }

  // Kräver både upplåsning och kopplad gästprofil (per-personligt lösenord).
  if (!isUnlocked() || !getGuestId()) {
    if (isUnlocked() && !getGuestId()) {
      localStorage.removeItem('svartamalin:unlocked')
    }
    hideTopControls()
    unmountWebglMap()
    document.body.classList.add('locked')
    renderUnlock(app, async () => {
      markUnlocked()
      route()
    })
    return
  }

  document.body.classList.remove('locked')

  // Återvändande session (reload medan inloggad) saknar user-gesture denna
  // sidladdning → browsern blockerar audible autoplay. Visa en splash som
  // skördar ett tap; det "välsignar" audion precis som login-klicket gör.
  // Fresh login har redan primat (isAudioUnlocked) → ingen splash.
  if (!isOldRoute() && !isAudioUnlocked()) {
    await showReturningSplash()
  }

  await preloadAssets()
  prepareAudioForReturningSession()

  // /old → SVG-originalet (renderHome + mountMapBackground)
  if (isOldRoute()) {
    showLoading()
    document.body.classList.add('revealing')
    mountMapBackground()
    const { renderHome } = await import('./pages/home.js')
    renderHome(app)
    return
  }

  // Default / → WebGL-versionen
  showLoading()
  unmountMapBackground()
  document.body.classList.add('webgl-revealing')
  const { renderWebgl } = await import('./pages/webgl.js')
  renderWebgl(app)
  // hideLoading() anropas inifrån mountWebglMap efter att scenen är klar
  // + minst 600ms (samma mönster som /old map.js).
}

route()
