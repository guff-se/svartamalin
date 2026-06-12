/**
 * Finalize generated map PNGs for web delivery:
 * - transparent decorations: remove baked-in backdrop, resize, RGBA PNG
 * - opaque assets (parchment): resize, RGB PNG
 */

import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import sharp from 'sharp'

const execFileAsync = promisify(execFile)

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
 * @param {number} outW
 * @param {number} outH
 */
async function finalizeTransparentMagick(inPath, outPath, w, h, outW, outH) {
  await execFileAsync('magick', [
    inPath,
    '-alpha', 'set',
    '-fuzz', '12%',
    '-fill', 'none',
    '-draw', 'color 0,0 floodfill',
    '-draw', `color ${w - 1},0 floodfill`,
    '-draw', `color 0,${h - 1} floodfill`,
    '-draw', `color ${w - 1},${h - 1} floodfill`,
    '-resize', `${outW}x${outH}`,
    '-define', 'png:compression-filter=5',
    '-define', 'png:compression-level=9',
    outPath,
  ])
}

/**
 * @param {string} inPath
 * @param {string} outPath
 * @param {number} outW
 * @param {number} outH
 */
async function finalizeOpaqueMagick(inPath, outPath, outW, outH) {
  await execFileAsync('magick', [
    inPath,
    '-resize', `${outW}x${outH}`,
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

/**
 * @param {Buffer} input
 * @param {number} outW
 * @param {number} outH
 */
async function finalizeTransparentSharp(input, outW, outH) {
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
    .resize(outW, outH)
    .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 })
    .toBuffer()
}

/**
 * @param {Buffer} input
 * @param {number} outW
 * @param {number} outH
 */
async function finalizeOpaqueSharp(input, outW, outH) {
  return sharp(input)
    .resize(outW, outH)
    .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 })
    .toBuffer()
}

/**
 * @param {Buffer} input
 * @param {{ width?: number, height?: number, transparent?: boolean }} [opts]
 * @returns {Promise<Buffer>}
 */
export async function optimizeMapPng(input, opts = {}) {
  const outW = opts.width ?? 512
  const outH = opts.height ?? 512
  const transparent = opts.transparent !== false

  if (await hasMagick()) {
    const dir = await mkdtemp(join(tmpdir(), 'map-opt-'))
    const inPath = join(dir, 'in.png')
    const outPath = join(dir, 'out.png')
    try {
      const meta = await sharp(input).metadata()
      const w = meta.width ?? outW
      const h = meta.height ?? outH
      await writeFile(inPath, input)
      if (transparent) {
        await finalizeTransparentMagick(inPath, outPath, w, h, outW, outH)
      } else {
        await finalizeOpaqueMagick(inPath, outPath, outW, outH)
      }
      return await readFile(outPath)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  }

  return transparent
    ? finalizeTransparentSharp(input, outW, outH)
    : finalizeOpaqueSharp(input, outW, outH)
}
