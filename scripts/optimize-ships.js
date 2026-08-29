#!/usr/bin/env node
/**
 * Optimize chosen skuta portraits → WebP for web delivery.
 *
 * Chosen sources (images/ships-generated/*-final.png).
 *
 * Output: public/images/ships/*.webp
 *
 * Usage: node scripts/optimize-ships.js
 */

import { mkdir, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'images', 'ships-generated')
const OUT_DIR = join(ROOT, 'public', 'images', 'ships')

const MAX_EDGE = 1280
const QUALITY = 82

/** @type {{ src: string, out: string }[]} */
const CHOSEN = [
  { src: 'kurtisanen-final.png', out: 'kurtisanen.webp' },
  { src: 'fordarvet-final.png', out: 'fordarvet.webp' },
  { src: 'bortforklaringen-final.png', out: 'bortforklaringen.webp' },
  { src: 'fromheten-final.png', out: 'fromheten.webp' },
  { src: 'gnallet-final.png', out: 'gnallet.webp' },
]

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  let totalIn = 0
  let totalOut = 0

  for (const { src: srcName, out: outName } of CHOSEN) {
    const src = join(SRC_DIR, srcName)
    const out = join(OUT_DIR, outName)
    const meta = await sharp(src).metadata()
    const srcBytes = (await stat(src)).size

    const info = await sharp(src)
      .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(out)

    totalIn += srcBytes
    totalOut += info.size
    console.log(
      `${srcName} (${meta.width}×${meta.height}, ${Math.round(srcBytes / 1024)} KB)`
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
