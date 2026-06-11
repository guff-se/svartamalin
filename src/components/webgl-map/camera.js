// Camera för Pixi-scenen. Spegelbild av cam{cx,cy,w,h,rot,tilt} + applyCam() i map.js.
// Mappar world-coords (SVG-units) → screen via root.position/scale/rotation.
//
// cx, cy = world-koord i centrum av viewporten
// w, h   = world-bredd/höjd som ska synas (cam.w/h matchar exakt VIEW_W/viewH för "fit world")
// rot    = world-rotation runt cam-centrum, i grader
// tilt   = 3D-tilt (P3 — implementeras separat)

export class Camera {
  constructor({ rootContainer, app, viewW, viewH }) {
    this.root = rootContainer
    this.app = app
    this.VIEW_W = viewW
    this.VIEW_H = viewH

    this.cx = viewW / 2
    this.cy = viewH / 2
    this.w  = viewW
    this.h  = viewH
    this.rot = 0
    this.tilt = 0
  }

  /** Applicera nuvarande {cx,cy,w,h,rot} på root-containerns transform. */
  apply() {
    const sw = this.app.screen.width
    const sh = this.app.screen.height

    // Skala så att cam.w world-units fyller hela skärmbredden, fit-height för
    // att inte stretch:a. Använd min så hela cam.w × cam.h alltid syns.
    const scale = Math.min(sw / this.w, sh / this.h)
    this.root.scale.set(scale)

    // Rotation runt cam-centrum: Pixi roterar runt root.pivot.
    // Sätt pivot till (cx, cy) i world-coords, sen position till skärmcentrum.
    this.root.pivot.set(this.cx, this.cy)
    this.root.position.set(sw / 2, sh / 2)
    this.root.rotation = (this.rot * Math.PI) / 180
  }
}
