// Reverenced from src/components/map.js — keep in sync if bbox math changes there.
// Pure projection: lat/lon → SVG-world-coords (0..VIEW_W on X, 0..viewH on Y).

export const VIEW_W = 1600

export function buildProjection(bbox) {
  const midLat = (bbox.minLat + bbox.maxLat) / 2
  const lonScale = Math.cos((midLat * Math.PI) / 180)
  const lonRange = (bbox.maxLon - bbox.minLon) * lonScale
  const latRange = bbox.maxLat - bbox.minLat
  const aspect = lonRange / latRange
  const viewH = Math.round(VIEW_W / aspect)

  const project = ([lon, lat]) => {
    const x = ((lon - bbox.minLon) * lonScale / lonRange) * VIEW_W
    const y = ((bbox.maxLat - lat) / latRange) * viewH
    return [x, y]
  }

  return { project, VIEW_W, viewH, aspect }
}
