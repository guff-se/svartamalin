// WebGL-port av map.js. Mountar PIXI.Application i ett DOM-element och
// bygger scenen från map-data.json + dekorations-PNGs.
// P2: Camera-klass + self-test som animerar kameran (zoom + pan + rotate)
// så vi kan verifiera 60fps på desktop + mobil innan timelinen byggs i P5.

import { Application } from 'pixi.js'
import { buildScene } from './scene.js'
import { Camera } from './camera.js'
import { TiltStage } from './tilt-stage.js'
import { buildRevealTimeline } from './reveal-timeline.js'
import { startShowAudio } from '../../lib/audio.js'

let app = null
let hostEl = null
let camAnimId = 0
let tiltStage = null
let revealRafId = 0

export async function mountWebglMap(el) {
  if (app) return  // idempotent

  hostEl = el
  app = new Application()
  await app.init({
    resizeTo: el,
    background: '#3a2410',
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
  })
  el.appendChild(app.canvas)

  const scene = await buildScene()
  // OBS: lägg INTE scene.root på stage:n direkt. TiltStage renderar den
  // varje frame i en RenderTexture som visas via en PerspectiveMesh för
  // 3D-tilt-emulering.
  tiltStage = new TiltStage(app, scene.root)
  tiltStage.init()

  const { VIEW_W, viewH } = scene.proj
  const camera = new Camera({ rootContainer: scene.root, app, viewW: VIEW_W, viewH: viewH })

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

  // P5: bygg och kör reveal-timeline
  const tl = buildRevealTimeline(scene, camera, tiltStage)
  const endTime = tl.duration()

  // Wall-clock-driven rAF (bypass GSAP lagSmoothing — matchar fix i map.js)
  startShowAudio()
  const startWall = performance.now()
  const tick = () => {
    const t = (performance.now() - startWall) / 1000
    if (t >= endTime) {
      tl.progress(1)
      revealRafId = 0
      return
    }
    tl.time(t)
    revealRafId = requestAnimationFrame(tick)
  }
  revealRafId = requestAnimationFrame(tick)

  // Skip-knapp
  const skipBtn = document.getElementById('webgl-skip')
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      if (revealRafId) cancelAnimationFrame(revealRafId)
      revealRafId = 0
      tl.progress(1)
    })
  }

  app._svm = { scene, camera, tiltStage, tl }
}

export function unmountWebglMap() {
  if (!app) return
  if (camAnimId) cancelAnimationFrame(camAnimId)
  camAnimId = 0
  if (revealRafId) cancelAnimationFrame(revealRafId)
  revealRafId = 0
  if (tiltStage) { tiltStage.destroy(); tiltStage = null }
  app.destroy({ removeView: true }, { children: true, texture: false })
  app = null
  if (hostEl) {
    hostEl.innerHTML = ''
    hostEl = null
  }
}
