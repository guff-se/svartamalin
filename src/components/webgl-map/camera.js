// Camera för Pixi-scenen. Spegelbild av cam{cx,cy,w,h,rot,tilt} + applyCam() i map.js.
// Mappar world-coords (SVG-units) → screen via root.position/scale/rotation.
//
// cx, cy = world-koord i centrum av viewporten
// w, h   = world-bredd/höjd som ska synas (cam.w/h matchar exakt VIEW_W/viewH för "fit world")
// rot    = world-rotation runt cam-centrum, i grader
// tilt   = 3D-tilt (P3 — implementeras separat)

export class Camera {
  constructor({ rootContainer, app, viewW, viewH, tiltStage }) {
    this.root = rootContainer
    this.app = app
    this.tiltStage = tiltStage
    this.VIEW_W = viewW
    this.VIEW_H = viewH

    this.cx = viewW / 2
    this.cy = viewH / 2
    this.w  = viewW
    this.h  = viewH
    this.rot = 0
    this.tilt = 0
  }

  /** Applicera nuvarande {cx,cy,w,h,rot} på root-containerns transform.
   *  Använder Math.max (slice/cover) så cam.w fyller bredden eller cam.h
   *  fyller höjden (vilket som ger störst scale) — matchar originalets
   *  preserveAspectRatio="xMidYMid slice"-beteende. Math.min skulle ge meet
   *  (letterbox) vilket gör vyn mer utzoomad än originalet.
   *
   *  renderTarget-size kan vara större än canvas (för tilt-kompensation),
   *  passas in via app._svm?.tiltStage._lastW/H om TiltStage finns.
   */
  apply() {
    // Använd oversized render-target-storlek så cam:n matar texturen i den
    // storlek som tilt-mesh:en behöver.
    const sw = this.tiltStage?._lastW ?? this.app.screen.width
    const sh = this.tiltStage?._lastH ?? this.app.screen.height

    const scale = Math.max(sw / this.w, sh / this.h)
    const rotRad = (this.rot * Math.PI) / 180

    // Tilt-kompensation: vid lutning biaserar perspektivet visuell fokus
    // mot nedre halvan av skärmen (bottenkanten är förstorad, topp-kanten
    // krympt). Skifta pivot framåt i journey-riktningen så att blicken
    // hamnar i bildens centrum.
    //
    // "Framåt på skärmen" = screen-up = world-dir (-sin(rot), -cos(rot)).
    // Magnitud: proportionellt mot cam.h och tilt (linjärt approximerat).
    const forward = this.h * this.tilt * 0.0022  // tunable; 50° tilt = 11 % av cam.h
    const dx = -Math.sin(rotRad) * forward
    const dy = -Math.cos(rotRad) * forward

    this.root.scale.set(scale)
    this.root.pivot.set(this.cx + dx, this.cy + dy)
    this.root.position.set(sw / 2, sh / 2)
    this.root.rotation = rotRad
  }
}
