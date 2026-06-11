// Drive route + boat route med marching-ants och draw-in.
//
// Approach: polyline → cumulativ arc-length → varje frame ritas dashes som
// korta linjesegment på en Graphics. Phase-offset över tid ger marching-
// effekten. Progress-tröskel ger draw-in.
//
// Drive route: ~880 OSRM-punkter projicerade.
// Boat route: 100 sampel från quadratic Bezier (hamn → mid+offset → Ovanan).

import { Graphics } from 'pixi.js'

const DRIVE_COLOR = 0x8b2c1a
const BOAT_COLOR = 0x8b2c1a
const DRIVE_WIDTH = 3
const BOAT_WIDTH = 3

// Marching-ants dash pattern (arc-length-units = SVG-units = pixels-pre-camera-scale)
const DRIVE_DASH = { on: 6, off: 5 }
const BOAT_DASH  = { on: 12, off: 9 }
// För draw-in-fasen används tätare strecking
const DRIVE_DASH_DRAW = { on: 1, off: 0 }  // solid line under draw
const BOAT_DASH_DRAW  = { on: 1, off: 0 }

export class Route {
  /**
   * @param {Array<[number,number]>} polyline projicerade världs-coords
   * @param {number} width stroke width
   * @param {number} color rgb 0xRRGGBB
   * @param {{on:number, off:number}} dash marching-ants-pattern
   */
  constructor(polyline, width, color, dash) {
    this.points = polyline
    this.width = width
    this.color = color
    this.dash = dash
    this.solid = false  // true = solid line, ingen dash
    this.progress = 0   // 0..1, hur mycket av rutten som är "ritad"
    this.phase = 0      // marching-offset i arc-length-units
    this.g = new Graphics()

    // Pre-compute cumulativa arc-längder
    this.cumLen = new Float32Array(polyline.length)
    let acc = 0
    for (let i = 1; i < polyline.length; i++) {
      const dx = polyline[i][0] - polyline[i-1][0]
      const dy = polyline[i][1] - polyline[i-1][1]
      acc += Math.hypot(dx, dy)
      this.cumLen[i] = acc
    }
    this.totalLen = acc
  }

  /** Rita rutten på sin Graphics. Anropas varje frame. */
  draw() {
    const g = this.g
    g.clear()
    const targetLen = this.progress * this.totalLen
    if (targetLen <= 0) return

    if (this.solid) {
      // Solid linje från start till targetLen
      this._strokeRange(0, targetLen)
      g.stroke({ width: this.width, color: this.color, cap: 'round', join: 'round', alpha: 0.85 })
      return
    }

    // Marching-ants: iterera dash-positioner från phase till targetLen
    const cycle = this.dash.on + this.dash.off
    // Start vid -phase mod cycle så marching ser ut att flyta framåt
    let s = -((this.phase % cycle) + cycle) % cycle
    while (s < targetLen) {
      const dashStart = Math.max(0, s)
      const dashEnd = Math.min(targetLen, s + this.dash.on)
      if (dashEnd > dashStart) {
        this._strokeRange(dashStart, dashEnd)
      }
      s += cycle
    }
    g.stroke({ width: this.width, color: this.color, cap: 'round', join: 'round', alpha: 0.85 })
  }

  /** Lägg till linjesegment som täcker arc-length [a, b] på `this.g`. */
  _strokeRange(a, b) {
    const pts = this.points
    const cum = this.cumLen
    const n = cum.length
    // Hitta start-segment: cum[i-1] <= a < cum[i]
    let i = 1
    while (i < n && cum[i] <= a) i++
    if (i >= n) return
    // Interpolera startpunkt
    let prevLen = cum[i-1]
    let segLen = cum[i] - prevLen
    let t = segLen > 0 ? (a - prevLen) / segLen : 0
    let px = pts[i-1][0] + (pts[i][0] - pts[i-1][0]) * t
    let py = pts[i-1][1] + (pts[i][1] - pts[i-1][1]) * t
    this.g.moveTo(px, py)

    // Lägg till mellanliggande hela vertices
    while (i < n && cum[i] < b) {
      this.g.lineTo(pts[i][0], pts[i][1])
      i++
    }
    if (i >= n) {
      this.g.lineTo(pts[n-1][0], pts[n-1][1])
      return
    }
    // Interpolera slutpunkt
    prevLen = cum[i-1]
    segLen = cum[i] - prevLen
    t = segLen > 0 ? (b - prevLen) / segLen : 0
    const ex = pts[i-1][0] + (pts[i][0] - pts[i-1][0]) * t
    const ey = pts[i-1][1] + (pts[i][1] - pts[i-1][1]) * t
    this.g.lineTo(ex, ey)
  }
}

/** Bygg drive + boat routes från projekterade koordinater. Returnerar { drive, boat }. */
export function buildRoutes({ drivingPoly, harbor, ovanan }) {
  const drive = new Route(drivingPoly, DRIVE_WIDTH, DRIVE_COLOR, DRIVE_DASH)

  // Båtrutt: quadratic Bezier från hamn till Ovanan med kontrollpunkt offset åt höger+upp.
  // (Spegelbild av map.js raderna 165-167.)
  const [hx, hy] = harbor
  const [ox, oy] = ovanan
  const mx = (hx + ox) / 2 + 60
  const my = (hy + oy) / 2 - 40
  const SAMPLES = 120
  const boatPoly = []
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES
    const u = 1 - t
    const x = u * u * hx + 2 * u * t * mx + t * t * ox
    const y = u * u * hy + 2 * u * t * my + t * t * oy
    boatPoly.push([x, y])
  }
  const boat = new Route(boatPoly, BOAT_WIDTH, BOAT_COLOR, BOAT_DASH)

  return { drive, boat, drivePoly: drivingPoly, boatPoly }
}
