#!/usr/bin/env node
/**
 * Detect per-frame photo + name-cartouche boxes via Claude vision (claude CLI).
 * Writes layout block to src/styles/pirate-card.css (sole source of truth).
 *
 * Usage: node scripts/detect-card-frame-layouts.js [1 2 3 ...]
 *
 * Requires: claude CLI, images in images/cards-originals/pirate-card-overlayN.png
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import {
  labelBoxToCenter,
  parseCardFrameLayouts,
  replaceCardFrameCssBlock,
} from '../src/lib/card-frame-css.js'

const execFileAsync = promisify(execFile)
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'images', 'cards-originals')
const CSS_FILE = join(ROOT, 'src', 'styles', 'pirate-card.css')

const PROMPT = `Look at images/cards-originals/{file}. This is a pirate card frame overlay (63:88). The centre is for a portrait photo; the bottom has a name cartouche/banner.

Return ONLY valid JSON, no markdown:
{"photo":{"top":N,"left":N,"right":N,"bottom":N},"label":{"top":N,"left":N,"right":N,"bottom":N}}

Rules:
- Values are CSS inset percentages (0-100) from each edge of the card.
- photo = inner portrait window (where the face photo shows through)
- label = text area inside the bottom name cartouche (not the decorative flourishes outside it)
- Be precise per this specific frame's geometry.`

async function detect(file) {
  const prompt = PROMPT.replace('{file}', file)
  const { stdout } = await execFileAsync('claude', [
    '-p', prompt,
    '--add-dir', ROOT,
  ], { cwd: ROOT, maxBuffer: 10 * 1024 * 1024 })

  const line = stdout.trim().split('\n').filter((l) => l.startsWith('{')).pop()
  if (!line) throw new Error(`No JSON from claude for ${file}: ${stdout}`)
  return JSON.parse(line)
}

async function main() {
  const filter = process.argv.slice(2).map((n) => `pirate-card-overlay${n}.png`)
  const all = (await readdir(SRC_DIR))
    .filter((f) => /^pirate-card-overlay\d+\.png$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  const files = filter.length ? all.filter((f) => filter.includes(f)) : all
  if (!files.length) {
    console.error('No overlay PNGs found')
    process.exit(1)
  }

  const css = await readFile(CSS_FILE, 'utf8')
  const layouts = parseCardFrameLayouts(css)

  for (const file of files) {
    const id = file.match(/(\d+)/)[1]
    console.log(`Detecting frame ${id}…`)
    const detected = await detect(file)
    layouts[id] = {
      photo: detected.photo,
      label: labelBoxToCenter(detected.label),
    }
    console.log(`  photo inset: ${JSON.stringify(layouts[id].photo)}`)
    console.log(`  label center: ${JSON.stringify(layouts[id].label)}`)
  }

  await writeFile(CSS_FILE, replaceCardFrameCssBlock(css, layouts))
  console.log(`\nUpdated ${CSS_FILE}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
