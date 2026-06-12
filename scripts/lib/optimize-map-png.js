/**
 * Post-process generated map decoration PNGs:
 * - remove baked-in light backdrop (Codex has no transparent background)
 * - resize to 512×512 (standard map sprite size)
 * - emit RGBA PNG with strong compression
 */

import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import sharp from 'sharp'

const execFileAsync = promisify(execFile)

const MAP_SIZE = 512
const FUZZ = 18

async function hasMagick() {
  try {
    await execFileAsync('magick', ['-version'])
    return true
  } catch {
    return false
  }
}

/**
 * @param {string} inPath
 * @param {string} outPath
 * @param {number} w
 * @param {number} h
 */
async function optimizeWithMagick(inPath, outPath, w, h) {
  await execFileAsync('magick', [
    inPath,
    '-alpha', 'set',
    '-fuzz', '12%',
    '-fill', 'none',
    '-draw', 'color 0,0 floodfill',
    '-draw', `color ${w - 1},0 floodfill`,
    '-draw', `color 0,${h - 1} floodfill`,
    '-draw', `color ${w - 1},${h - 1} floodfill`,
    '-resize', `${MAP_SIZE}x${MAP_SIZE}`,
    '-define', 'png:compression-filter=5',
    '-define', 'png:compression-level=9',
    outPath,
  ])
}

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

/** @param {Buffer} input */
async function optimizeWithSharp(input) {
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
    .resize(MAP_SIZE, MAP_SIZE)
    .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 })
    .toBuffer()
}

/**
 * @param {Buffer} input
 * @param {{ width?: number, height?: number }} [opts]
 * @returns {Promise<Buffer>}
 */
export async function optimizeMapPng(input, opts = {}) {
  const mapW = opts.width ?? MAP_SIZE
  const mapH = opts.height ?? MAP_SIZE
  if (mapW !== MAP_SIZE || mapH !== MAP_SIZE) {
    throw new Error(`optimizeMapPng only supports ${MAP_SIZE}×${MAP_SIZE} today`)
  }

  if (await hasMagick()) {
    const dir = await mkdtemp(join(tmpdir(), 'map-opt-'))
    const inPath = join(dir, 'in.png')
    const outPath = join(dir, 'out.png')
    try {
      const meta = await sharp(input).metadata()
      const w = meta.width ?? MAP_SIZE
      const h = meta.height ?? MAP_SIZE
      await writeFile(inPath, input)
      await optimizeWithMagick(inPath, outPath, w, h)
      return await readFile(outPath)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  }

  return optimizeWithSharp(input)
}
