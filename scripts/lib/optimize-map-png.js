/**
 * Post-process generated map decoration PNGs:
 * - remove baked-in light backdrop (Codex has no transparent background)
 * - resize to 512×512 (standard map sprite size)
 * - emit RGBA PNG with strong compression
 */

import sharp from 'sharp'

const MAP_SIZE = 512
const FUZZ = 18

function readPixel(data, width, channels, x, y) {
  const i = (y * width + x) * channels
  return [data[i], data[i + 1], data[i + 2]]
}

function matchesBg(r, g, b, seed, fuzz) {
  return (
    Math.abs(r - seed[0]) <= fuzz
    && Math.abs(g - seed[1]) <= fuzz
    && Math.abs(b - seed[2]) <= fuzz
  )
}

function floodFromCorner(data, width, height, channels, x, y, fuzz, visited) {
  const seed = readPixel(data, width, channels, x, y)
  const queue = [x, y]

  while (queue.length) {
    const cy = queue.pop()
    const cx = queue.pop()
    const idx = cy * width + cx
    if (cx < 0 || cy < 0 || cx >= width || cy >= height || visited[idx]) continue
    const px = readPixel(data, width, channels, cx, cy)
    if (!matchesBg(px[0], px[1], px[2], seed, fuzz)) continue
    visited[idx] = 1
    const i = idx * channels
    data[i + 3] = 0
    queue.push(cx + 1, cy, cx - 1, cy, cx, cy + 1, cx, cy - 1)
  }
}

/**
 * @param {Buffer} input
 * @param {{ width?: number, height?: number }} [opts]
 * @returns {Promise<Buffer>}
 */
export async function optimizeMapPng(input, opts = {}) {
  const width = opts.width ?? MAP_SIZE
  const height = opts.height ?? MAP_SIZE

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width: w, height: h, channels } = info
  const visited = new Uint8Array(w * h)

  for (const [x, y] of [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]]) {
    floodFromCorner(data, w, h, channels, x, y, FUZZ, visited)
  }

  return sharp(data, { raw: { width: w, height: h, channels } })
    .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer()
}
