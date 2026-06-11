// WebGL-port av map.js. Mountar PIXI.Application i ett DOM-element.
// P0: bara tom canvas med diagnos-text för att verifiera att Pixi v8 +
// Vite-bundlen kompilerar och att DOM-mount funkar.

import { Application, Container, Graphics, Text } from 'pixi.js'

let app = null
let hostEl = null

export async function mountWebglMap(el) {
  if (app) return  // idempotent

  hostEl = el
  app = new Application()
  await app.init({
    resizeTo: el,
    background: '#3a2410',  // matchar map.js bottenplåt
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
  })
  el.appendChild(app.canvas)

  // P0-sanity: rita en cirkel + text så vi vet att Pixi renderar
  const probe = new Container()
  const g = new Graphics()
  g.circle(0, 0, 80).fill({ color: 0xb8924a, alpha: 0.8 }).stroke({ color: 0xe8d8b4, width: 2 })
  probe.addChild(g)

  const txt = new Text({
    text: 'WebGL P0 — pixi.js v8 mountad',
    style: { fontFamily: 'Georgia', fontSize: 22, fill: 0xe8d8b4, align: 'center' },
  })
  txt.anchor.set(0.5)
  txt.y = 110
  probe.addChild(txt)

  // Centrera probe
  const center = () => {
    probe.x = app.screen.width / 2
    probe.y = app.screen.height / 2
  }
  center()
  app.stage.addChild(probe)
  app.renderer.on('resize', center)
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
