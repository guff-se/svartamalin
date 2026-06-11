// Catmull-Rom spline-sampling. Spegel av map.js catmullRomToBezierPath, men
// returnerar en sampled polyline (inte SVG-path-string) så Pixi kan följa den.

/**
 * Generera en glatt polyline genom givna waypoints via Catmull-Rom spline.
 * @param {Array<{x:number,y:number}>} points waypoints (≥2)
 * @param {number} samplesPerSegment antal sampel mellan varje par av waypoints
 * @returns {Array<[number,number]>} polyline-punkter
 */
export function catmullRomPolyline(points, samplesPerSegment = 40) {
  if (points.length < 2) return points.map((p) => [p.x, p.y])
  const out = [[points[0].x, points[0].y]]
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    // Cubic Bezier-kontrollpunkter (samma som catmullRomToBezierPath i map.js)
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    // Sampel:a kubisk Bezier från p1 → c1 → c2 → p2 (men hoppa över t=0
    // för att inte duplicera föregående punkt)
    for (let j = 1; j <= samplesPerSegment; j++) {
      const t = j / samplesPerSegment
      const u = 1 - t
      const x = u*u*u*p1.x + 3*u*u*t*c1x + 3*u*t*t*c2x + t*t*t*p2.x
      const y = u*u*u*p1.y + 3*u*u*t*c1y + 3*u*t*t*c2y + t*t*t*p2.y
      out.push([x, y])
    }
  }
  return out
}
