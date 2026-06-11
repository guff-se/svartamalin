// WebGL-port av map.js. Mountar PIXI.Application i ett DOM-element och
// bygger scenen från map-data.json + dekorations-PNGs.
// P2: Camera-klass + self-test som animerar kameran (zoom + pan + rotate)
// så vi kan verifiera 60fps på desktop + mobil innan timelinen byggs i P5.

import { Application } from 'pixi.js'
import { buildScene } from './scene.js'
import { Camera } from './camera.js'
import { TiltStage } from './tilt-stage.js'

let app = null
let hostEl = null
let camAnimId = 0
let tiltStage = null

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

  app.renderer.on('resize', () => {
    camera.apply()
    tiltStage.resize()
  })

  // P3 self-test: pendla zoom/pan/rotate + tilt så vi kan visuellt verifiera
  // att 3D-tilten också funkar. Ersätts av timeline i P5.
  const startWall = performance.now()
  const tick = () => {
    const t = ((performance.now() - startWall) / 1000) % 16
    const phase = t < 8 ? t / 8 : (16 - t) / 8
    const sx = scene.journey.sx
    const sy = scene.journey.sy
    camera.cx = VIEW_W / 2 + (sx - VIEW_W / 2) * phase
    camera.cy = viewH / 2 + (sy - viewH / 2) * phase
    camera.w  = VIEW_W * (1 - 0.5 * phase)
    camera.h  = viewH * (1 - 0.5 * phase)
    camera.rot = 15 * phase
    camera.apply()
    tiltStage.setTilt(50 * phase)
    camAnimId = requestAnimationFrame(tick)
  }
  camAnimId = requestAnimationFrame(tick)

  // Stash refs så P5 kan ta över
  app._svm = { scene, camera, tiltStage }
}

export function unmountWebglMap() {
  if (!app) return
  if (camAnimId) cancelAnimationFrame(camAnimId)
  camAnimId = 0
  if (tiltStage) { tiltStage.destroy(); tiltStage = null }
  app.destroy({ removeView: true }, { children: true, texture: false })
  app = null
  if (hostEl) {
    hostEl.innerHTML = ''
    hostEl = null
  }
}
