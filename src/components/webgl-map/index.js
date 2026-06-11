// WebGL-port av map.js. Mountar PIXI.Application i ett DOM-element och
// bygger scenen från map-data.json + dekorations-PNGs.
// P1: statisk scen, kamera fixad så hela världen syns.

import { Application } from 'pixi.js'
import { buildScene } from './scene.js'

let app = null
let hostEl = null

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

  // P1-kamera: visa hela världen, centrerad. Letterboxing om viewport-aspect
  // skiljer sig från världs-aspect.
  const fitWorld = () => {
    const { VIEW_W, viewH } = scene.proj
    const sw = app.screen.width
    const sh = app.screen.height
    const scale = Math.min(sw / VIEW_W, sh / viewH)
    scene.root.scale.set(scale)
    scene.root.x = (sw - VIEW_W * scale) / 2
    scene.root.y = (sh - viewH * scale) / 2
  }
  fitWorld()
  app.renderer.on('resize', fitWorld)
}

export function unmountWebglMap() {
  if (!app) return
  app.destroy({ removeView: true }, { children: true, texture: false })
  app = null
  if (hostEl) {
    hostEl.innerHTML = ''
    hostEl = null
  }
}
