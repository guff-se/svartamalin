import { renderUnlock } from './pages/unlock.js'
import { hideTopControls, pauseShowAudio, showTopControls } from './lib/audio.js'
import { isReadyForShow } from './lib/guest.js'
import { clearSession, getGuestId, isPeekMode } from './lib/state.js'
import { showLoading, hideLoading } from './lib/loading.js'
import { initPerf } from './lib/perf.js'
import { preloadAssets } from './lib/preload.js'
import { mountMapBackground, unmountMapBackground } from './components/map.js'

initPerf()
preloadAssets()

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
  route()
}

document.getElementById('logout-btn').addEventListener('click', logout)
document.getElementById('info-btn').addEventListener('click', () => {
  history.pushState(null, '', '/info')
  route()
})
window.addEventListener('popstate', route)

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

function isInfoRoute() {
  const path = location.pathname.replace(/\/$/, '') || '/'
  return path === '/info'
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
    document.body.classList.add('locked')
    renderUnlock(app, async () => {
      markUnlocked()
      route()
    })
    return
  }

  document.body.classList.remove('locked')

  if (!(await isReadyForShow()) && !isPeekMode()) {
    hideLoading()
    showTopControls()
    const { renderRsvp } = await import('./pages/rsvp.js')
    renderRsvp(app, () => route())
    return
  }

  // /info → edit-form för matpref/övrig info/kontakt (piratnamn låst).
  if (isInfoRoute()) {
    hideLoading()
    showTopControls()
    unmountMapBackground()
    const { renderInfoEdit } = await import('./pages/info-edit.js')
    renderInfoEdit(app, () => { history.pushState(null, '', '/'); route() })
    return
  }

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
