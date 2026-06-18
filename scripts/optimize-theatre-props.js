#!/usr/bin/env node
/**
 * Optimize theatre-props source PNGs → WebP for web delivery.
 *
 * Source: images/theatre-props-generated/theatre-props-*.png
 * Output: public/images/theatre-props-*.webp
 *
 * Usage: node scripts/optimize-theatre-props.js
 */

import { readdir, mkdir, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'images', 'theatre-props-generated')
const OUT_DIR = join(ROOT, 'public', 'images')

const WIDTH = 768
const QUALITY = 82

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const files = (await readdir(SRC_DIR))
    .filter((f) => /^theatre-props-.*\.png$/i.test(f))
    .sort()

  if (!files.length) {
    console.error(`No theatre-props-*.png in ${SRC_DIR}`)
    process.exit(1)
  }

  let totalIn = 0
  let totalOut = 0

  for (const file of files) {
    const src = join(SRC_DIR, file)
    const outName = file.replace(/\.png$/i, '.webp')
    const out = join(OUT_DIR, outName)

    const meta = await sharp(src).metadata()
    const srcBytes = (await stat(src)).size

    const info = await sharp(src)
      .resize(WIDTH, WIDTH, { fit: 'inside', withoutEnlargement: true })
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
