// WebGL-port av map.js. Mountar PIXI.Application i ett DOM-element och
// bygger scenen från map-data.json + dekorations-PNGs.
// P2: Camera-klass + self-test som animerar kameran (zoom + pan + rotate)
// så vi kan verifiera 60fps på desktop + mobil innan timelinen byggs i P5.

import { Application } from 'pixi.js'
import { buildScene } from './scene.js'
import { Camera } from './camera.js'

let app = null
let hostEl = null
let camAnimId = 0

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
  app.stage.addChild(scene.root)

  const { VIEW_W, viewH } = scene.proj
  const camera = new Camera({ rootContainer: scene.root, app, viewW: VIEW_W, viewH: viewH })

  // Default: hela världen
  camera.cx = VIEW_W / 2
  camera.cy = viewH / 2
  camera.w = VIEW_W
  camera.h = viewH
  camera.apply()

  app.renderer.on('resize', () => camera.apply())

  // P2 self-test: pendla in/ut i en oändlig loop så vi kan visuellt se
  // att zoom + pan + rotate är smooth. Stoppas i P5 när timeline tar över.
  const startWall = performance.now()
  const tick = () => {
    const t = ((performance.now() - startWall) / 1000) % 16
    // 0-8s: zooma in mot Stockholm-pos och rotera lite. 8-16s: tillbaka.
    const phase = t < 8 ? t / 8 : (16 - t) / 8
    const sx = scene.journey.sx
    const sy = scene.journey.sy
    camera.cx = VIEW_W / 2 + (sx - VIEW_W / 2) * phase
    camera.cy = viewH / 2 + (sy - viewH / 2) * phase
    camera.w  = VIEW_W * (1 - 0.5 * phase)
    camera.h  = viewH * (1 - 0.5 * phase)
    camera.rot = 15 * phase
    camera.apply()
    camAnimId = requestAnimationFrame(tick)
  }
  camAnimId = requestAnimationFrame(tick)

  // Stash refs så P3-P5 kan ta över
  app._svm = { scene, camera }
}

export function unmountWebglMap() {
  if (!app) return
  if (camAnimId) cancelAnimationFrame(camAnimId)
  camAnimId = 0
  app.destroy({ removeView: true }, { children: true, texture: false })
  app = null
  if (hostEl) {
    hostEl.innerHTML = ''
    hostEl = null
  }
}
