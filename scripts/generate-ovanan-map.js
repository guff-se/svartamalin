#!/usr/bin/env node
/**
 * Hand-drawn chart of Ovanan island from satellite reference.
 * Style: aesthetic-style-guide.md + amateur cartographer (generate-map-assets.js).
 *
 * Default backend: ChatGPT subscription via Codex OAuth (`codex login`).
 * Optional API billing: OVANAN_MAP_USE_API_KEY=1 (requires OPENAI_API_KEY).
 *
 * Input:  images/ovanan-satellite.png
 * Output: images/ovanan-map-generated/ovanan.jpg (then -v2, -v3 … on redos)
 *
 * Usage:
 *   node scripts/generate-ovanan-map.js
 *   node scripts/generate-ovanan-map.js --redo
 */

import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { randomBytes } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { editImageWithCodex, hasCodexSubscriptionAuth } from './lib/codex-image.js'

const execFileAsync = promisify(execFile)

const __dirname = dirname(fileURLToPath(import.meta.url))
const IN_PATH = join(__dirname, '..', 'images', 'ovanan-satellite.png')
const OUT_DIR = join(__dirname, '..', 'images', 'ovanan-map-generated')
const STEM = 'ovanan'

const USE_API_KEY = process.env.OVANAN_MAP_USE_API_KEY === '1'

// aesthetic-style-guide.md — Svarta Malin mood; amateur execution from generate-map-assets.js
const STYLE = `Vintage pirate romanticism in the Svarta Malin style. 18th-century pirate world filtered through theatrical nautical-chart romanticism: weathered, aged, nostalgic. Sepia, warm browns, faded teal water, ochre sand, muted green forest — all slightly aged and oxidised. Foxed parchment, ink blots, soft diffused light. NOT modern GIS, NOT satellite photo, NOT clean digital vector, NOT neon, NOT glossy CGI.`

const AMATEUR = `GENUINELY BAD DRAWING — HIGHEST PRIORITY: Embarrassingly incompetent — worse than a colouring book, like a drunk adult drawing a map poster at midnight. Thick marker lines that wobble and overshoot, double-traced shaky outlines, ink blots, colour scribbled outside borders, smudged fingerprints, visible eraser ghosts, roofs floating off walls, docks different lengths. NOT skilled ink illustration, NOT fine pen art, NOT crosshatch, NOT stippling. Camp charm through visible failure at every stroke.`

const CARTOON = `CARTOONISH, VARIED, AND BADLY EXECUTED: Thick wobbly marker outlines — uneven weight, corners that miss. Trees = MANY different bad cartoon trees all over the forest — vary size wildly (tiny stub trees, medium lollipops, a few comically oversized trees), vary shape (round blob, triangle pine scribble, lopsided broccoli, bent trunk leaning wrong way, two trunks on one canopy, canopy floating above the stick). No two trees alike; each drawn badly in its own way. NO tree shading, NO fine branches, flat green blobs on brown sticks. Rocks along west shore = pebbles and boulders of different sizes — some huge, some tiny, overlapping messily, childish squiggles inside, one rock drawn as an obvious potato. Houses = EXACTLY FOUR cottages (no more, no less), each a different bad design — mismatched roof angles, doors too big, chimneys crooked, one house noticeably worse than the others. Docks = two bent piers, different lengths and angles. Water = flat teal with a few lazy wavy marks of different sizes. Visual variety everywhere but unified by incompetent execution.`

const CARTOGRAPHER = `Naïve awkward top-down island chart in iron-gall ink and faded watercolour wash. Period palette only — sepia, warm browns, faded teal, ochre, muted green — oxidised and uneven. Quill pen and iron-gall ink, NOT crayons, NOT felt-tip, NOT modern materials.`

const GEOGRAPHY = `HIGHEST PRIORITY — MATCH THE INPUT SATELLITE LAYOUT: Transform the reference photo into a cartoonish hand-drawn chart while preserving Ovanan's real geography. Same overall silhouette — long narrow teardrop island oriented vertically, wider north end tapering to a point at the south. Western (left) shore: pale rocky cliff strip with chunky cartoon rock shapes. Eastern and central land: forest covered in many small poorly drawn cartoon trees. Small lawn patch as a lighter green smear near the buildings. Exactly four crooked cartoon cottages in the north-central cluster — count must be four, not five or six. Two bent dock piers on the east shore. Teal cartoon water around the island.`

const DECOR = `Chart decoration only: hand-lettered label "OVANAN" in badly drawn shaky capitals — letters different heights, wobbly baseline. Optional tiny crooked compass rose in a corner, drawn as badly as the rest. Aged parchment fills the frame. Plain geographic island chart — only land, water, trees, rocks, buildings, and docks from the reference.`

const NEG = `No fifth house, no extra buildings beyond the four cottages, no identical repeated stamp symbols, no uniform tree grid, no cookie-cutter copies, no side lighting on trees, no shading on canopies, no volumetric foliage, no skilled shading, no delicate gradients, no fine crosshatch, no stippling, no painterly rendering, no precise linework, no fine pen illustration, no clean symmetry, no professional vintage map illustration, no polished engraving, no RPG fantasy map polish, no photorealistic trees, no botanical art, no architectural precision, no clean vector lines, no serif typography, no tidy minimal simplicity. CRITICAL — NO TREASURE MARKINGS: no X, no treasure chest, no skull-and-crossbones, no pirate flag. No satellite photography, no Google Earth look, no 3D buildings, no neon, no text other than the island name label, no watermark text.`

function buildPrompt() {
  return [AMATEUR, CARTOON, GEOGRAPHY, CARTOGRAPHER, STYLE, DECOR, NEG, AMATEUR].join(' ')
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function resolveOutputPath() {
  const names = await readdir(OUT_DIR).catch(() => [])
  const versionRe = new RegExp(`^${escapeRegex(STEM)}-v(\\d+)\\.jpg$`)

  let maxVersion = names.includes(`${STEM}.jpg`) ? 1 : 0
  for (const n of names) {
    const m = n.match(versionRe)
    if (m) maxVersion = Math.max(maxVersion, Number(m[1]))
  }

  const version = maxVersion + 1
  const filename = version === 1 ? `${STEM}.jpg` : `${STEM}-v${version}.jpg`
  return { version, filename, path: join(OUT_DIR, filename) }
}

async function normalizeInputImage(inputPath) {
  const cleanup = []

  if (process.platform === 'darwin') {
    const tmpFlat = join(tmpdir(), `ovanan-flat-${randomBytes(8).toString('hex')}.jpg`)
    const tmpSized = join(tmpdir(), `ovanan-sized-${randomBytes(8).toString('hex')}.jpg`)
    cleanup.push(tmpFlat, tmpSized)
    await execFileAsync('sips', ['-s', 'format', 'jpeg', inputPath, '--out', tmpFlat])
    await execFileAsync('sips', ['-Z', '1536', tmpFlat, '--out', tmpSized])
    const bytes = await readFile(tmpSized)
    return { bytes, mime: 'image/jpeg', cleanup }
  }

  const bytes = await readFile(inputPath)
  return { bytes, mime: 'image/png', cleanup }
}

async function generateWithApi(inputPath, prompt, retries = 3) {
  const { bytes, mime, cleanup } = await normalizeInputImage(inputPath)

  const body = {
    model: 'gpt-image-1',
    images: [{ image_url: `data:${mime};base64,${bytes.toString('base64')}` }],
    prompt,
    n: 1,
    size: '1024x1536',
    quality: 'high',
    output_format: 'jpeg',
    output_compression: 90,
    background: 'opaque',
    input_fidelity: 'high',
  }

  try {
    for (let attempt = 1; attempt <= retries; attempt++) {
      const res = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (res.ok) {
        const b64 = data.data?.[0]?.b64_json
        if (!b64) throw new Error('No image data in response')
        return Buffer.from(b64, 'base64')
      }

      const msg = data.error?.message || JSON.stringify(data)
      if (attempt < retries && res.status >= 500) {
        process.stdout.write(`retry ${attempt}/${retries - 1} … `)
        await new Promise((r) => setTimeout(r, 3000 * attempt))
        continue
      }
      throw new Error(msg)
    }

    throw new Error('Unreachable')
  } finally {
    await Promise.all(cleanup.map((p) => unlink(p).catch(() => {})))
  }
}

async function generateWithCodex(inputPath, prompt) {
  const { bytes, mime, cleanup } = await normalizeInputImage(inputPath)
  try {
    return await editImageWithCodex({
      prompt,
      imageDataUrl: `data:${mime};base64,${bytes.toString('base64')}`,
      size: '1024x1536',
      outputFormat: 'jpeg',
    })
  } finally {
    await Promise.all(cleanup.map((p) => unlink(p).catch(() => {})))
  }
}

async function resolveBackend() {
  if (USE_API_KEY) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OVANAN_MAP_USE_API_KEY=1 but OPENAI_API_KEY is not set')
    }
    return { name: 'openai-api', generate: generateWithApi }
  }

  if (await hasCodexSubscriptionAuth()) {
    return { name: 'codex-subscription', generate: generateWithCodex }
  }

  throw new Error(
    'No Codex subscription auth found (~/.codex/auth.json). Run `codex login`, or set OVANAN_MAP_USE_API_KEY=1 with OPENAI_API_KEY.',
  )
}

async function main() {
  const backend = await resolveBackend()
  const prompt = buildPrompt()

  try {
    await readFile(IN_PATH)
  } catch {
    throw new Error(`Input not found: ${IN_PATH}`)
  }

  await mkdir(OUT_DIR, { recursive: true })
  const { version, filename, path: outPath } = await resolveOutputPath()
  const versionLabel = version > 1 ? ` v${version}` : ''

  console.log(`Backend: ${backend.name}`)
  console.log(`Input:   ${IN_PATH}`)
  console.log(`Output:  ${outPath}\n`)
  process.stdout.write(`🗺️  Ovanan map${versionLabel} … `)

  const start = Date.now()
  try {
    const jpeg = await backend.generate(IN_PATH, prompt)
    await writeFile(outPath, jpeg)
    console.log(`done (${((Date.now() - start) / 1000).toFixed(1)}s, ${(jpeg.length / 1024).toFixed(0)} KB)`)
    console.log(`   → ${filename}`)
  } catch (err) {
    console.log('FAILED')
    console.error(`   ${err.message}`)
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
