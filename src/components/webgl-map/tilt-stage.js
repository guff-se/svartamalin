// 3D-tilt-emulering via Pixi v8:s inbyggda PerspectiveMesh.
//
// Strategi (allokera EN gång, rendera per frame):
//   1. scene.root läggs INTE direkt på app.stage. Istället rendereras den
//      varje frame in i en återanvänd RenderTexture (renderTex).
//   2. En PerspectiveMesh läggs på stage, använder renderTex som textur,
//      och får sina 4 hörn-coords uppdaterade baserat på camera.tilt.
//   3. Resultat: hela scenen kan tippas i 3D utan att vi behöver
//      Z-koordinater på enskilda sprites.
//
// Hörn-warp för att emulera CSS rotateX(tilt deg) perspective(1800px):
//   - tilt=0°  → identity (top och bottom på (0,0)/(w,0) och (0,h)/(w,h))
//   - tilt>0°  → top-kanten dras INÅT (smalare) + ner-mot-mitten (kortare)
//     vilket ger känslan att kartans topp lutar bort från kameran.

import { PerspectiveMesh, RenderTexture } from 'pixi.js'

export class TiltStage {
  constructor(app, worldContainer) {
    this.app = app
    this.world = worldContainer
    this.renderTex = null
    this.mesh = null
    this._lastW = 0
    this._lastH = 0
    this.tilt = 0   // grader
  }

  /** Anropas en gång efter Application.init(). */
  init() {
    this._ensureSized()
    // Mesh:en täcker hela canvas-ytan. Hörn-koordinater uppdateras per frame
    // baserat på tilt-vinkeln.
    this.mesh = new PerspectiveMesh({
      texture: this.renderTex,
      verticesX: 20,
      verticesY: 20,
      x0: 0, y0: 0,
      x1: this._lastW, y1: 0,
      x2: this._lastW, y2: this._lastH,
      x3: 0, y3: this._lastH,
    })
    this.app.stage.addChild(this.mesh)
    this._updateCorners()

    // Render scene→renderTex VARJE frame med hög prio så mesh:en alltid
    // ser senaste worldContainer-rendering.
    this.app.ticker.add(this._tick, this, 100)
  }

  setTilt(deg) {
    this.tilt = deg
    this._updateCorners()
  }

  /** Anropa när canvas storlek ändras. */
  resize() {
    this._ensureSized()
    this._updateCorners()
  }

  _ensureSized() {
    const sw = Math.max(1, this.app.screen.width)
    const sh = Math.max(1, this.app.screen.height)
    if (sw === this._lastW && sh === this._lastH && this.renderTex) return
    if (this.renderTex) this.renderTex.destroy(true)
    this.renderTex = RenderTexture.create({
      width: sw,
      height: sh,
      resolution: this.app.renderer.resolution,
    })
    this._lastW = sw
    this._lastH = sh
    if (this.mesh) this.mesh.texture = this.renderTex
  }

  _updateCorners() {
    if (!this.mesh) return
    const w = this._lastW
    const h = this._lastH
    const θ = (this.tilt * Math.PI) / 180

    // Perspektiv-approximation matchande CSS rotateX(tilt) perspective(1800):
    //   topShrink = horisontell krympning av top-kanten (proc. av halva bredden)
    //   topY      = hur långt ner top-kanten flyttas (foreshortening av höjd)
    //   bottomGrow = hur mycket bottom-kanten "vidgas" utanför viewporten
    const sinT = Math.sin(θ)
    // Använd halva höjden som skala för "djup" — matchar att rotationsaxeln
    // är horisontellt mitt på elementet.
    const halfH = h / 2
    const perspective = 1800
    // Top-kantens djup-Z (bort från kamera)
    const zTop = halfH * sinT
    const zBot = -halfH * sinT
    // Projektionsfaktor för varje kant. 1.0 = ingen påverkan, <1 = krymper, >1 = växer.
    const topFactor = perspective / (perspective + zTop)
    const botFactor = perspective / (perspective + zBot)

    // Centrera kring x = w/2; krymp/växt symmetriskt
    const topW = w * topFactor
    const botW = w * botFactor
    const topX0 = (w - topW) / 2
    const topX1 = topX0 + topW
    const botX0 = (w - botW) / 2
    const botX1 = botX0 + botW

    // Y-positioner: top-kanten dras ner, bottom-kanten dras ner (utanför)
    // proportionellt mot foreshortening
    const topY = halfH * (1 - Math.cos(θ))
    const botY = h + halfH * (Math.cos(θ) - 1) * 0  // håll bottom på h för nu

    this.mesh.geometry.setCorners(
      topX0, topY,
      topX1, topY,
      botX1, botY,
      botX0, botY,
    )
  }

  _tick() {
    if (!this.renderTex) return
    this.app.renderer.render({
      container: this.world,
      target: this.renderTex,
      clear: true,
    })
  }

  destroy() {
    if (this.mesh) {
      this.app.ticker.remove(this._tick, this)
      this.mesh.destroy()
      this.mesh = null
    }
    if (this.renderTex) {
      this.renderTex.destroy(true)
      this.renderTex = null
    }
  }
}
