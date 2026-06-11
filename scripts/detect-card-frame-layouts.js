#!/usr/bin/env node
/**
 * Detect per-frame photo + name-cartouche boxes via Claude vision (claude CLI).
 * Writes src/lib/card-frame-layouts.js and appends CSS to pirate-card.css.
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

const execFileAsync = promisify(execFile)
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'images', 'cards-originals')
const LAYOUTS_FILE = join(ROOT, 'src', 'lib', 'card-frame-layouts.js')
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

function layoutsJs(layouts) {
  const body = Object.entries(layouts)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([id, box]) => `  ${id}: {\n    photo: { top: ${box.photo.top}, left: ${box.photo.left}, right: ${box.photo.right}, bottom: ${box.photo.bottom} },\n    label: { top: ${box.label.top}, left: ${box.label.left}, right: ${box.label.right}, bottom: ${box.label.bottom} },\n  },`)
    .join('\n')

  return `/**
 * Per-frame layout — photo window + name cartouche (CSS inset %).
 * Regenerate: node scripts/detect-card-frame-layouts.js
 */
export const CARD_FRAME_LAYOUTS = {
${body}
}

/** @param {string} overlaySrc */
export function frameIdFromOverlay(overlaySrc) {
  const m = String(overlaySrc).match(/pirate-card-overlay(\\d+)/)
  const id = m ? Number(m[1]) : 1
  return CARD_FRAME_LAYOUTS[id] ? id : 1
}
`
}

function frameCss(id, box) {
  const { photo, label } = box
  return `.pirate-card--frame${id} .pirate-card__photo {
  inset: ${photo.top}% ${photo.right}% ${photo.bottom}% ${photo.left}%;
}

.pirate-card--frame${id} .pirate-card__label {
  top: ${label.top}%;
  left: ${label.left}%;
  right: ${label.right}%;
  bottom: ${label.bottom}%;
}`
}

async function updateCss(layouts) {
  let css = await readFile(CSS_FILE, 'utf8')
  const start = '/* --- Per-frame layouts (detect-card-frame-layouts.js) --- */'
  const end = '/* --- end per-frame layouts --- */'
  const block = [
    start,
    ...Object.entries(layouts)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([id, box]) => frameCss(id, box)),
    end,
  ].join('\n\n')

  if (css.includes(start)) {
    css = css.replace(new RegExp(`${start}[\\s\\S]*${end}`), block)
  } else {
    css = `${css.trim()}\n\n${block}\n`
  }
  await writeFile(CSS_FILE, css)
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

  let existing = {}
  try {
    const mod = await import(LAYOUTS_FILE + `?t=${Date.now()}`)
    existing = mod.CARD_FRAME_LAYOUTS
  } catch { /* first run */ }

  const layouts = { ...existing }
  for (const file of files) {
    const id = file.match(/(\d+)/)[1]
    console.log(`Detecting frame ${id}…`)
    layouts[id] = await detect(file)
    console.log(`  photo inset: ${JSON.stringify(layouts[id].photo)}`)
    console.log(`  label box:   ${JSON.stringify(layouts[id].label)}`)
  }

  await writeFile(LAYOUTS_FILE, layoutsJs(layouts))
  await updateCss(layouts)
  console.log(`\nUpdated ${LAYOUTS_FILE} and ${CSS_FILE}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
