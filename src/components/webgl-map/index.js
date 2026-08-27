// WebGL-karta (produktion). Port av map.js — mountar Pixi Application,
// bygger scenen från map-data.json + dekorations-PNGs, kör reveal-timeline.

import { Application } from 'pixi.js'
import { buildScene } from './scene.js'
import { Camera } from './camera.js'
import { TiltStage } from './tilt-stage.js'
import { buildRevealTimeline } from './reveal-timeline.js'
import { startShowAudio } from '../../lib/audio.js'
import { hideLoading } from '../../lib/loading.js'

let app = null
let hostEl = null
let camAnimId = 0
let tiltStage = null
let revealRafId = 0
let sceneFrozen = false
let staticBg = false
let snapshotUrl = null
let onWindowResize = null
let resizeTimer = 0

/** En sista render av världen → mesh, sen stoppa tickern så bakgrunden fryser. */
function freezeBackground() {
  if (!app || sceneFrozen) return
  sceneFrozen = true
  if (tiltStage) tiltStage.renderOnce()
  app.render()
  app.ticker.stop()
}

/** Efter resize med stoppad ticker — uppdatera textur + stage en gång. */
function renderFrozenFrame() {
  if (!app || !sceneFrozen) return
  if (tiltStage) tiltStage.renderOnce()
  app.render()
}

/** Riv Pixi men lämna #webgl-stage (snapshot ligger kvar). */
function teardownPixiKeepSnapshot() {
  if (onWindowResize) {
    window.removeEventListener('resize', onWindowResize)
    onWindowResize = null
  }
  if (resizeTimer) {
    clearTimeout(resizeTimer)
    resizeTimer = 0
  }
  if (tiltStage) {
    tiltStage.destroy()
    tiltStage = null
  }
  if (app) {
    app.destroy({ removeView: true }, { children: true, texture: false })
    app = null
  }
}

/**
 * Byt den frysta WebGL-canvasen mot en statisk bild så backdrop-filter
 * på korten inte längre samplar en WebGL-yta under scroll (Chromium-flicker).
 * 2D-canvas läggs in samma tick (pixel-identisk), därefter JPEG-img.
 */
function replaceBackgroundWithSnapshot() {
  if (!app || !hostEl || staticBg) return
  const gl = app.canvas
  const w = gl.width
  const h = gl.height
  if (w < 2 || h < 2) return

  const snap = document.createElement('canvas')
  snap.className = 'webgl-snapshot'
  snap.width = w
  snap.height = h
  const ctx = snap.getContext('2d', { alpha: false })
  try {
    ctx.drawImage(gl, 0, 0)
  } catch (err) {
    console.warn('WebGL snapshot failed:', err)
    return
  }
  try {
    const { data } = ctx.getImageData(w >> 1, h >> 1, 1, 1)
    if (data[0] + data[1] + data[2] < 12) {
      console.warn('WebGL snapshot was empty, keeping canvas')
      return
    }
  } catch (err) {
    console.warn('WebGL snapshot sample failed:', err)
    return
  }

  hostEl.appendChild(snap)
  staticBg = true
  teardownPixiKeepSnapshot()

  snap.toBlob((blob) => {
    if (!blob || !hostEl || !hostEl.contains(snap)) return
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.className = 'webgl-snapshot'
    img.alt = ''
    const show = () => {
      if (!hostEl || !hostEl.contains(snap)) {
        URL.revokeObjectURL(url)
        return
      }
      hostEl.replaceChild(img, snap)
      snapshotUrl = url
    }
    img.onload = () => {
      if (img.decode) img.decode().then(show, show)
      else show()
    }
    img.onerror = () => URL.revokeObjectURL(url)
    img.src = url
  }, 'image/jpeg', 0.92)
}

export async function mountWebglMap(el) {
  if (!el) {
    hideLoading()
    return
  }
  // Redan monterad på samma element (t.ex. dubbel route) — dölj loading,
  // men starta om ljudet om reveal kördes om utan ny mount.
  if (hostEl === el && (app || staticBg)) {
    hideLoading()
    startShowAudio()
    return
  }
  if (app || hostEl) unmountWebglMap()

  const mountStart = performance.now()
  hostEl = el

  try {
  // Vänta in browser-layout så el.clientWidth/Height inte är 0 (kan hända
  // om mountWebglMap kallas direkt efter app.innerHTML-byte, t.ex. när
  // RSVP fullförs och vi byter till WebGL-vyn samma synkrona tick — då
  // har layouten inte hunnit räknas än → Pixi mountas 0×0 → svart skärm).
  await new Promise((r) => requestAnimationFrame(r))

  app = new Application()
  await app.init({
    // Använd INTE resizeTo — på iOS triggar adresslist-kollaps en
    // resize och Pixi rebygger canvasen → flicker i kombination med
    // scroll. Vi sätter en gång och uppdaterar bara på faktiska
    // window-resize-events (debounced).
    width: el.clientWidth,
    height: el.clientHeight,
    background: '#3a2410',
    antialias: true,
    autoDensity: true,
    // Behåll sista framen så drawImage() i snapshot inte får en tom buffer.
    preserveDrawingBuffer: true,
    resolution: window.devicePixelRatio || 1,
  })
  el.appendChild(app.canvas)

  // Försök låsa orientation till portrait på mobil. Stöds på Android-
  // Chromium (kräver ofta fullscreen) men inte iOS Safari. Om det misslyckas
  // fallback:ar vi via att blockera orientation-flips i resize-handlern.
  try { screen.orientation?.lock?.('portrait-primary').catch(() => {}) } catch {}

  // Manuell debounced resize — bara reagera på faktiska viewport-ändringar
  // (fönsterstorlek på desktop). Vi BLOCKERAR explicit orientation-flips
  // (rotation av telefonen) eftersom animationen är byggd för en specifik
  // aspect och kameran blir trasig om allt skalas om mid-animation.
  let lastW = el.clientWidth
  let lastH = el.clientHeight
  const initialPortrait = lastH > lastW
  onWindowResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      if (!app) return
      const w = el.clientWidth
      const h = el.clientHeight
      if (Math.abs(w - lastW) < 4 && Math.abs(h - lastH) < 140) return
      // Blockera orientation-flips (portrait <-> landscape) — animationen
      // bryts om kamerans aspect plötsligt inverteras mitt under reveal.
      const nowPortrait = h > w
      if (nowPortrait !== initialPortrait) return
      lastW = w; lastH = h
      app.renderer.resize(w, h)
      renderFrozenFrame()
    }, 250)
  }
  window.addEventListener('resize', onWindowResize)


  const scene = await buildScene()
  // OBS: lägg INTE scene.root på stage:n direkt. TiltStage renderar den
  // varje frame i en RenderTexture som visas via en PerspectiveMesh för
  // 3D-tilt-emulering.
  tiltStage = new TiltStage(app, scene.root)
  tiltStage.init()

  const { VIEW_W, viewH } = scene.proj
  const camera = new Camera({ rootContainer: scene.root, app, viewW: VIEW_W, viewH: viewH, tiltStage })

  // Default: hela världen
  camera.cx = VIEW_W / 2
  camera.cy = viewH / 2
  camera.w = VIEW_W
  camera.h = viewH
  camera.apply()

  // Routes ritas varje frame med marching-ants (timeline:n styr progress)
  const routeTick = () => {
    const t = performance.now() / 1000
    scene.routes.drive.phase = -t * 5
    scene.routes.boat.phase = -t * 6.2
    scene.routes.drive.draw()
    scene.routes.boat.draw()
  }
  app.ticker.add(routeTick)

  app.renderer.on('resize', () => {
    camera.apply()
    tiltStage.resize()
  })

  // P5: bygg reveal-timeline (sätter initial cam-state på Stockholm)
  const tl = buildRevealTimeline(scene, camera, tiltStage)
  const endTime = tl.duration()

  // Minst 600ms loading screen — samma mönster som /old map.js. Hindrar
  // att kartan "hoppar" innan animationen startar (initialt fit-world,
  // sen omedelbart timeline-state på Stockholm = synligt hopp).
  const elapsed = performance.now() - mountStart
  if (elapsed < 600) await new Promise((r) => setTimeout(r, 600 - elapsed))

  // Wall-clock-driven rAF (bypass GSAP lagSmoothing — matchar fix i map.js)
  startShowAudio()
  const startWall = performance.now()
  let revealDone = false
  document.body.classList.add('webgl-revealing')
  const finishReveal = () => {
    if (revealDone) return
    revealDone = true
    // Sista draw av rutter (fryst phase) — ingen ambient efter intro.
    scene.routes.drive.draw()
    scene.routes.boat.draw()
    app.ticker.remove(routeTick)
    freezeBackground()
    replaceBackgroundWithSnapshot()
    document.body.classList.remove('webgl-revealing')
    document.body.classList.add('webgl-revealed')
  }
  const tick = () => {
    const t = (performance.now() - startWall) / 1000
    if (t >= endTime) {
      tl.progress(1)
      revealRafId = 0
      finishReveal()
      return
    }
    tl.time(t)
    revealRafId = requestAnimationFrame(tick)
  }
  revealRafId = requestAnimationFrame(tick)

  const skipBtn = document.getElementById('webgl-skip')
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      if (revealRafId) cancelAnimationFrame(revealRafId)
      revealRafId = 0
      tl.progress(1)
      finishReveal()
    })
  }

  app._svm = { scene, camera, tiltStage, tl }
  } catch (err) {
    console.error('WebGL map mount failed:', err)
    unmountWebglMap()
    throw err
  } finally {
    hideLoading()
  }
}

export function unmountWebglMap() {
  if (!app && !hostEl) return
  if (camAnimId) cancelAnimationFrame(camAnimId)
  camAnimId = 0
  if (revealRafId) cancelAnimationFrame(revealRafId)
  revealRafId = 0
  sceneFrozen = false
  staticBg = false
  teardownPixiKeepSnapshot()
  document.body.classList.remove('webgl-revealed')
  document.body.classList.remove('webgl-revealing')
  if (snapshotUrl) {
    URL.revokeObjectURL(snapshotUrl)
    snapshotUrl = null
  }
  if (hostEl) {
    hostEl.innerHTML = ''
    hostEl = null
  }
}
