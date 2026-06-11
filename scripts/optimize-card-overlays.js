#!/usr/bin/env node
/**
 * Resize and convert curated card frame PNGs → WebP for web delivery.
 *
 * Source: images/cards-originals/pirate-card-overlay*.png
 * Output: public/images/cards/pirate-card-overlay*.webp
 *
 * 756×1056 (63:88 × 12) covers 3× retina at the largest card size (~15rem).
 *
 * Usage: node scripts/optimize-card-overlays.js
 */

import { readdir, mkdir, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'images', 'cards-originals')
const OUT_DIR = join(ROOT, 'public', 'images', 'cards')

const WIDTH = 756
const HEIGHT = 1056
const QUALITY = 82

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const files = (await readdir(SRC_DIR))
    .filter((f) => /^pirate-card-overlay\d+\.png$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  if (files.length === 0) {
    console.error(`No pirate-card-overlay*.png found in ${SRC_DIR}`)
    process.exit(1)
  }

  console.log(`Optimizing ${files.length} overlay(s) → ${WIDTH}×${HEIGHT} WebP\n`)

  let totalIn = 0
  let totalOut = 0

  for (const file of files) {
    const src = join(SRC_DIR, file)
    const outName = file.replace(/\.png$/i, '.webp')
    const out = join(OUT_DIR, outName)

    const meta = await sharp(src).metadata()
    const srcBytes = (await stat(src)).size

    const info = await sharp(src)
      .resize(WIDTH, HEIGHT, { fit: 'fill' })
      .webp({ quality: QUALITY, alphaQuality: 100, effort: 6 })
      .toFile(out)
    totalIn += srcBytes
    totalOut += info.size

    console.log(
      `${file} (${meta.width}×${meta.height}, ${Math.round(srcBytes / 1024)} KB)`
      + ` → ${outName} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`,
    )
  }

  console.log(
    `\nTotal: ${Math.round(totalIn / 1024)} KB → ${Math.round(totalOut / 1024)} KB`
    + ` (${Math.round((1 - totalOut / totalIn) * 100)}% smaller)`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
