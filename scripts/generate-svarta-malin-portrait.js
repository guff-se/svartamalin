#!/usr/bin/env node
/**
 * Iterative portrait generator for Svarta Malin — the fiercest pirate captain.
 * Tighter prompt than generate-portraits.js: epic captain energy, big hat always.
 *
 * Input:  images/svarta-malin/malin-tadaa.jpg, malin-tadaa2.jpg, …
 * Output: images/svarta-malin-generated/<stem>.jpg, <stem>-v2.jpg, … (never overwrites)
 *
 * Copy a chosen version to public/images/portraits/<id>.jpg for production.
 *
 * Default backend: Codex OAuth (`codex login`).
 * Optional API billing: PORTRAIT_USE_API_KEY=1 (requires OPENAI_API_KEY).
 *
 * Usage:
 *   npm run generate-svarta-malin                    # malin-tadaa.jpg (default)
 *   npm run generate-svarta-malin -- malin-tadaa2    # specific source
 *   npm run generate-svarta-malin -- --all           # one output per source file
 *   npm run generate-svarta-malin -- --keep-expression
 */

import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { randomBytes } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { editImageWithCodex, hasCodexSubscriptionAuth } from './lib/codex-image.js'

const execFileAsync = promisify(execFile)

const __dirname = dirname(fileURLToPath(import.meta.url))
const IN_DIR = join(__dirname, '..', 'images', 'svarta-malin')
const OUT_DIR = join(__dirname, '..', 'images', 'svarta-malin-generated')
const DEFAULT_SOURCE = 'malin-tadaa'

const INPUT_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const USE_API_KEY = process.env.PORTRAIT_USE_API_KEY === '1'

// ── Fixed captain identity (low variation) ──────────────────────────────────

const LIKENESS = `HIGHEST PRIORITY — FACIAL IDENTITY: This must be unmistakably the same woman as in the input photo. Preserve bone structure, jawline, cheekbones, nose shape, eye shape and spacing, ears, hairline, skin tone, age, and distinctive features (freckles, dimples). Do NOT invent a new face, do NOT beautify into a different person, do NOT swap ethnicity, do NOT age up or down significantly. She must remain recognisable — expression may change for epic captain drama.`

const KEEP_EXPRESSION = `FACIAL EXPRESSION — PRESERVE FROM SOURCE: Keep the exact expression from the input photo. Same smile or mouth, same eye openness, same eyebrow position. Do NOT invent a new expression.`

const VARY_EXPRESSION = `FACIAL EXPRESSION — FEMALE POWER: Adapt expression to unapologetic female authority — commanding stare, defiant smirk, narrowed lethal eyes, chin-lifted queen energy. Same woman, new expression: she is not performing for anyone's approval; she has already taken command.`

const CAPTAIN = `SVARTA MALIN — THE CAPTAIN: She is the most fierce pirate captain who ever lived — a woman who seized the ship and the legend. Commanding, lethal, self-possessed; the woman every other pirate will eventually kneel to. Epic scale and presence, not camp panto. Power is feminine and absolute: she leads, she decides, she wins. Dangerous through swagger and authority — she owns the ship, the crew, and the horizon.`

const FEMALE_POWER = `FEMALE POWER — NON-NEGOTIABLE: She must read as a dangerous, self-assured woman in absolute command — not a man's sidekick, not a decorative love interest, not softened or domesticated. Sexy through swagger, confidence, and lethal competence: strong stance, direct power gaze, props held with intent. Alluring because she looks like she could take your ship and your respect — formidable femme captain, Bonny-and-Read energy filtered through Hollywood glamour. No damsel, no submissive gaze, no posed-for-the-male-gaze passivity.`

const HAT = `HEADWEAR — MANDATORY BIG HAT: She MUST wear a large, dramatic tricorn pirate hat — wide brim, imposing silhouette, clearly the biggest hat in the room. White skull-and-crossbones emblem, gold braid or feather trim. Hat worn level and proud atop her head, never crooked, never sliding over her eyes. No bare head, no bandana-only, no small cocked hat — BIG captain's tricorn is non-negotiable.`

const STYLE = `Vintage pirate romanticism in the Svarta Malin style. 18th-century pirate world through 1920s–30s Hollywood studio glamour — theatrical, adventurous, weathered and nostalgic. Sepia / warm brown tones, soft diffused studio light, antique photographic finish with film grain and faint scratches. NOT modern clothing, NOT bright saturated colors, NOT clean digital look, NOT neon, NOT glossy CGI, NOT hyperrealistic.`

const AMATEUR = `STAGE COSTUME, EPIC STAGING: Theatrical pirate dress-up — hand-sewn coat, gold galon trim, costume props — charming disguise not museum reconstruction. But the POSE and PRESENCE read epic captain, not village-hall panto. Painted studio backdrop or softly blurred ship-deck scenery.`

const BODY = `BODY & POSTURE: Confident upright captain posture — shoulders back, chest open, wide power stance, fit and capable. She fills the frame with authority. Flattering but plausible for this person — strong, not diminutive.`

const NEG = `No different person, no face swap, no generic model face, no altered bone structure, no bare head, no hatless portrait, no small hat, no bandana without tricorn, no crooked or askew headwear, no passive pin-up, no cheesecake pose, no boudoir damsel, no submissive or downcast gaze, no hand-wringing, no clinging to a male figure, no damsel-in-distress, no decorative arm candy, no male captain overshadowing her, no softened or infantilised femininity, no male-gaze boudoir posing, no Pirates of the Caribbean look, no Jack Sparrow, no Disney pirate aesthetic, no modern clothing, no bright saturated colors, no clean digital look, no neon, no glossy CGI, no hyperrealistic skin, no glitter makeup, no face gems, no text, no watermark, no playing card overlay.`

// Small pools — one pick each, captain-focused
const POSE = [
  'standing tall, coat open, chin lifted — queen addressing her crew, not asking permission',
  'one hand on hip, other on sword hilt — wide power stance, weight on both feet',
  'arms crossed, cutlass held across chest — immovable female authority',
  'boot on a crate, chin up, flintlock at her side — she conquered this deck',
  'three-quarter turn, coat tails swinging — she looks back at territory she already claimed',
  'both hands on sword hilt, blade between boots — duelist queen, not sidekick',
  'flintlock raised with calm lethal authority — she fires when she chooses',
  'wide stance, hands on belt, shoulders squared — captain who took the ship herself',
  'one arm extended, pointing toward the horizon — her orders, her course',
  'seated on the captain\'s chair edge, leaning forward — interrogating a mutineer',
]

const GAZE = [
  'piercing gaze straight into the camera — she has already won and knows it',
  'defiant chin-up stare — unbowed, unbroken, in charge',
  'bold stare with a faint lethal smirk — female power, not flirtation',
  'sidelong glance of a woman who outsmarted you three moves ago',
  'ice-cold direct stare — respect me or regret it',
]

const COSTUME = [
  'layered dark frock coat with heavy gold braid and soutache — captain\'s regalia',
  'vivid red or deep green stage coat with gold epaulettes and wide sash',
  'high-collared velvet captain\'s coat, white shoulder baldric, dark cravat',
  'open frock coat over cream poet shirt, studded belt with prop holster',
  'military-style costume jacket with fake gold epaulettes and striped sash',
]

const PROPS = [
  'theatrical flintlock tucked in sash',
  'foam cutlass at belt, second pistol in holster — dual threat',
  'curved cutlass in one hand, black skull-and-crossbones flag over opposite shoulder',
  'rolled parchment map in one hand, spyglass tucked in sash',
  'coiled rope at feet, cutlass raised in one hand',
]

const BACKGROUND = [
  'aged sepia studio backdrop with soft vignette',
  'painted theatrical ship-deck backdrop — rigging and sails, softly blurred',
  'misted grey sea and cliffs, out of focus behind her',
  '1920s studio backdrop, mottled grey, shallow depth of field',
]

const MEDIA = [
  'weathered sepia studio portrait with soft vignette',
  '1920s Hollywood studio glamour publicity still, aged and nostalgic',
  'antique wet-plate tintype photograph with chemical patina',
  'faded hand-tinted photographic portrait on cabinet card',
]

function pickRandom(pool) {
  return pool[Math.floor(Math.random() * pool.length)]
}

function buildPrompt({ keepExpression = false } = {}) {
  const pose = keepExpression
    ? 'same head angle and facial expression as the source photo; body may shift slightly for costume'
    : pickRandom(POSE)
  const gaze = keepExpression
    ? 'exact same facial expression as the input photo — unchanged smile, mouth, and eyes'
    : pickRandom(GAZE)

  const subject = `Transform this photograph into Svarta Malin — the ultimate vintage pirate captain portrait. Portrait orientation, aspect ratio 63:88 (playing card proportions), vertical composition.

Render as a ${pickRandom(MEDIA)}. Half- or three-quarter-length portrait. ${pose}. ${gaze}. ${pickRandom(COSTUME)}. Props: ${pickRandom(PROPS)} — costume accessories only, not real weapons. Background: ${pickRandom(BACKGROUND)}. ${HAT}`

  const blocks = [LIKENESS, CAPTAIN, FEMALE_POWER, HAT]
  if (keepExpression) {
    blocks.push(KEEP_EXPRESSION)
  } else {
    blocks.push(VARY_EXPRESSION)
  }
  blocks.push(BODY, AMATEUR, subject, STYLE, NEG)

  const summary = [
    keepExpression ? 'keep expr' : 'epic expr',
    'big tricorn',
    pose.split(/[,.]/)[0].slice(0, 28),
  ].join(' · ')

  return { prompt: blocks.join(' '), summary }
}

// ── I/O & backend (mirrors generate-portraits.js) ───────────────────────────

function mimeForExt(ext) {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.webp':
      return 'image/webp'
    default:
      return 'application/octet-stream'
  }
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function resolveOutputPath(stem) {
  await mkdir(OUT_DIR, { recursive: true })
  const names = await readdir(OUT_DIR).catch(() => [])
  const versionRe = new RegExp(`^${escapeRegex(stem)}-v(\\d+)\\.jpg$`)

  let maxVersion = names.includes(`${stem}.jpg`) ? 1 : 0
  for (const n of names) {
    const m = n.match(versionRe)
    if (m) maxVersion = Math.max(maxVersion, Number(m[1]))
  }

  const version = maxVersion + 1
  const filename = version === 1 ? `${stem}.jpg` : `${stem}-v${version}.jpg`
  return { version, filename, path: join(OUT_DIR, filename) }
}

async function listSources(filterStem) {
  let names
  try {
    names = await readdir(IN_DIR)
  } catch {
    throw new Error(`Input directory not found: ${IN_DIR}\nDrop photos as malin-tadaa.jpg, malin-tadaa2.jpg, …`)
  }

  const files = names
    .filter((n) => INPUT_EXTS.has(extname(n).toLowerCase()))
    .sort()

  if (!files.length) {
    throw new Error(`No images in ${IN_DIR} (expected malin-tadaa.jpg, malin-tadaa2.jpg, …)`)
  }

  if (!filterStem) return [files.find((f) => basename(f, extname(f)) === DEFAULT_SOURCE) || files[0]]

  if (filterStem === '--all') return files

  const match = files.filter((f) => {
    const stem = basename(f, extname(f))
    return stem === filterStem || stem.startsWith(filterStem)
  })
  if (!match.length) {
    throw new Error(`No source matching "${filterStem}" in ${IN_DIR}\nAvailable: ${files.join(', ')}`)
  }
  return match
}

async function normalizeInputImage(inputPath) {
  const cleanup = []

  if (process.platform === 'darwin') {
    const tmpFlat = join(tmpdir(), `malin-flat-${randomBytes(8).toString('hex')}.jpg`)
    const tmpSized = join(tmpdir(), `malin-sized-${randomBytes(8).toString('hex')}.jpg`)
    cleanup.push(tmpFlat, tmpSized)
    await execFileAsync('sips', ['-s', 'format', 'jpeg', inputPath, '--out', tmpFlat])
    await execFileAsync('sips', ['-Z', '1536', tmpFlat, '--out', tmpSized])
    const bytes = await readFile(tmpSized)
    return { bytes, mime: 'image/jpeg', cleanup }
  }

  const ext = extname(inputPath).toLowerCase()
  const bytes = await readFile(inputPath)
  return { bytes, mime: mimeForExt(ext), cleanup }
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
      throw new Error('PORTRAIT_USE_API_KEY=1 but OPENAI_API_KEY is not set')
    }
    return { name: 'openai-api', generate: generateWithApi }
  }

  if (await hasCodexSubscriptionAuth()) {
    return { name: 'codex-subscription', generate: generateWithCodex }
  }

  throw new Error(
    'No Codex subscription auth found (~/.codex/auth.json). Run `codex login`, or set PORTRAIT_USE_API_KEY=1 with OPENAI_API_KEY.',
  )
}

function parseArgs(argv) {
  let filterStem = null
  let keepExpression = false
  let all = false

  for (const arg of argv) {
    if (arg === '--keep-expression' || arg === '-k') {
      keepExpression = true
      continue
    }
    if (arg === '--all') {
      all = true
      continue
    }
    if (arg.startsWith('-')) continue
    filterStem = arg.replace(/\.(jpe?g|png|webp)$/i, '')
  }

  if (all) filterStem = '--all'
  return { filterStem, keepExpression }
}

async function main() {
  const backend = await resolveBackend()
  const { filterStem, keepExpression } = parseArgs(process.argv.slice(2))
  const queue = await listSources(filterStem)

  console.log(`Backend: ${backend.name}`)
  console.log(`Expression: ${keepExpression ? 'keep (from source photo)' : 'epic captain (vary)'}`)
  console.log(`Sources: ${queue.map((f) => basename(f)).join(', ')}`)
  console.log(`Output → ${OUT_DIR}\n`)

  for (const file of queue) {
    const stem = basename(file, extname(file))
    const inPath = join(IN_DIR, file)
    const { version, filename, path: outPath } = await resolveOutputPath(stem)
    const { prompt, summary } = buildPrompt({ keepExpression })

    const versionLabel = version > 1 ? ` v${version}` : ''
    process.stdout.write(`⚓ ${file}${versionLabel} (${summary}) … `)

    const start = Date.now()
    try {
      const jpeg = await backend.generate(inPath, prompt)
      await writeFile(outPath, jpeg)
      console.log(`done (${((Date.now() - start) / 1000).toFixed(1)}s, ${(jpeg.length / 1024).toFixed(0)} KB)`)
      console.log(`   → ${filename}`)
    } catch (err) {
      console.log('FAILED')
      console.error(`   ${err.message}`)
      process.exitCode = 1
    }
  }

  console.log('\nFinished. Re-run for another variation (adds -v2, -v3, …).')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
