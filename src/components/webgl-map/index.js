// WebGL-karta (produktion). Port av map.js — mountar Pixi Application,
// bygger scenen från map-data.json + dekorations-PNGs, kör reveal-timeline.

import { Application } from 'pixi.js'
import { buildScene } from './scene.js'
import { Camera } from './camera.js'
import { TiltStage } from './tilt-stage.js'
import { buildRevealTimeline } from './reveal-timeline.js'
import { startAmbient } from './ambient.js'
import { startShowAudio } from '../../lib/audio.js'
import { hideLoading } from '../../lib/loading.js'

let app = null
let hostEl = null
let camAnimId = 0
let tiltStage = null
let revealRafId = 0

export async function mountWebglMap(el) {
  if (!el) {
    hideLoading()
    return
  }
  // Redan monterad på samma element (t.ex. dubbel route) — dölj bara loading.
  if (app && hostEl === el) {
    hideLoading()
    return
  }
  if (app) unmountWebglMap()

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
  let resizeTimer = 0
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (Math.abs(w - lastW) < 4 && Math.abs(h - lastH) < 140) return
      // Blockera orientation-flips (portrait <-> landscape) — animationen
      // bryts om kamerans aspect plötsligt inverteras mitt under reveal.
      const nowPortrait = h > w
      if (nowPortrait !== initialPortrait) return
      lastW = w; lastH = h
      app.renderer.resize(w, h)
    }, 250)
  })


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
  app.ticker.add(() => {
    const t = performance.now() / 1000
    scene.routes.drive.phase = -t * 5
    scene.routes.boat.phase = -t * 6.2
    scene.routes.drive.draw()
    scene.routes.boat.draw()
  })

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
  let ambientStarted = false
  document.body.classList.add('webgl-revealing')
  const finishReveal = () => {
    if (!ambientStarted) { startAmbient(scene); ambientStarted = true }
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
  if (!app) return
  if (camAnimId) cancelAnimationFrame(camAnimId)
  camAnimId = 0
  if (revealRafId) cancelAnimationFrame(revealRafId)
  revealRafId = 0
  if (tiltStage) { tiltStage.destroy(); tiltStage = null }
  document.body.classList.remove('webgl-revealed')
  document.body.classList.remove('webgl-revealing')
  app.destroy({ removeView: true }, { children: true, texture: false })
  app = null
  if (hostEl) {
    hostEl.innerHTML = ''
    hostEl = null
  }
}
