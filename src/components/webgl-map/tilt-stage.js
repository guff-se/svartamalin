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
    // Oversize renderTex 1.3× canvas så att det finns extra kart-material
    // som kan dyka upp i bild när perspective-mesh:en foreshortenar topp/
    // botten. Matchar originalets SVG-trick (width:130%; left:-15%; ...).
    const OVERSIZE = 1.7
    const canvasW = Math.max(1, this.app.screen.width)
    const canvasH = Math.max(1, this.app.screen.height)
    const sw = Math.round(canvasW * OVERSIZE)
    const sh = Math.round(canvasH * OVERSIZE)
    if (sw === this._lastW && sh === this._lastH && this.renderTex) return
    if (this.renderTex) this.renderTex.destroy(true)
    this.renderTex = RenderTexture.create({
      width: sw,
      height: sh,
      resolution: this.app.renderer.resolution,
    })
    this._lastW = sw
    this._lastH = sh
    this._canvasW = canvasW
    this._canvasH = canvasH
    if (this.mesh) this.mesh.texture = this.renderTex
  }

  _updateCorners() {
    if (!this.mesh) return
    // Mesh:en placeras i CANVAS-koordinater. RenderTex är oversize:ad
    // (samma OVERSIZE-faktor som i _ensureSized). Centrera mesh kring
    // canvas-mitten och låt den extendera bortom canvas-kanterna.
    // Vid tilt θ behövs baseH ≥ ch / cos(θ) för att topp-kanten ska nå
    // canvas-toppen, dvs OVERSIZE ≥ 1/cos(50°) ≈ 1.56. Vi har 1.7 för
    // marginal.
    const cw = this._canvasW
    const ch = this._canvasH
    const OVERSIZE = 1.7
    const baseW = cw * OVERSIZE
    const baseH = ch * OVERSIZE
    const cx = cw / 2
    const cy = ch / 2

    const θ = (this.tilt * Math.PI) / 180
    const sinT = Math.sin(θ)
    const halfH = baseH / 2
    const perspective = 1800
    const zTop = halfH * sinT
    const zBot = -halfH * sinT
    const topFactor = perspective / (perspective + zTop)
    const botFactor = perspective / (perspective + zBot)

    const topW = baseW * topFactor
    const botW = baseW * botFactor
    const topX0 = cx - topW / 2
    const topX1 = cx + topW / 2
    const botX0 = cx - botW / 2
    const botX1 = cx + botW / 2

    // y: roterar runt mitten cy → top kommer mot mitten, bot pressas utanför
    const topY = cy - halfH * Math.cos(θ)
    const botY = cy + halfH * Math.cos(θ)

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
