#!/usr/bin/env node
/**
 * Iterative portrait generator for Svarta Malin as a child — ~10, innocent, not yet a pirate.
 * On a ship, nautical tattered clothes, hand-drawn / watercolor portrait (not a studio photo).
 * Same pipeline as generate-svarta-malin-portrait.js; no weapons.
 *
 * Input:  images/malin-barn/IMG_5372.JPG … IMG_5376.JPG
 * Output: images/malin-barn-generated/<stem>.jpg, <stem>-v2.jpg, … (never overwrites)
 * Log:    images/malin-barn-generated/prompts.log (appends every run)
 *
 * Default: all five source photos (unlike the captain script, which defaults to one).
 *
 * Default backend: Codex OAuth (`codex login`).
 * Optional API billing: PORTRAIT_USE_API_KEY=1 (requires OPENAI_API_KEY).
 *
 * Usage:
 *   npm run generate-svarta-malin-barn                 # all 5 sources
 *   npm run generate-svarta-malin-barn -- IMG_5374     # specific source
 *   npm run generate-svarta-malin-barn -- --keep-expression
 */

import { readFile, writeFile, mkdir, readdir, unlink, appendFile, access } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { randomBytes } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { editImageWithCodex, hasCodexSubscriptionAuth } from './lib/codex-image.js'

const execFileAsync = promisify(execFile)

const __dirname = dirname(fileURLToPath(import.meta.url))
const IN_DIR = join(__dirname, '..', 'images', 'malin-barn')
const OUT_DIR = join(__dirname, '..', 'images', 'malin-barn-generated')
const PROMPT_LOG = join(OUT_DIR, 'prompts.log')

const INPUT_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const USE_API_KEY = process.env.PORTRAIT_USE_API_KEY === '1'

// ── Fixed child identity ────────────────────────────────────────────────────

const LIKENESS = `HIGHEST PRIORITY — FACIAL IDENTITY: This must be unmistakably the same girl as in the input photo, aged to about ten. Preserve bone structure, jawline, cheekbones, nose shape, eye shape and spacing, ears, hairline, hair colour, skin tone, and distinctive features (freckles, dimples, gap between front teeth if present). Do NOT invent a new face, do NOT beautify into a different child, do NOT swap ethnicity. If the source looks younger than ten, age her up modestly into a 10-year-old — longer face, slightly less baby-round cheeks, still clearly a child. If she already looks around ten, keep that age. NEVER age her into a teenager or adult.`

const AGE = `AGE — ABOUT TEN YEARS OLD: A real 10-year-old girl. Child proportions: larger head relative to body, soft cheeks, small nose, no adult makeup, no adult jaw, no developed figure. She has not yet become a pirate. Innocent, open, still a child.`

const KEEP_EXPRESSION = `FACIAL EXPRESSION — PRESERVE FROM SOURCE: Keep the exact expression from the input photo. Same smile or mouth, same eye openness, same eyebrow position. Do NOT invent a new expression.`

const VARY_EXPRESSION = `FACIAL EXPRESSION — INNOCENT CHILD: Soft, genuine, unguarded. A shy half-smile, a curious open look, a gap-toothed grin, quiet wonder, or a candid glance — never fierce, never commanding, never a villain smirk, never adult glamour. Same girl, child-honest.`

const CHILD = `SVARTA MALIN AS A CHILD: This is Malin before the legend — about ten, a sailor's daughter living aboard a wooden ship. Innocent, curious, wind in her hair. She belongs on deck, not in a studio. Not a captain, not dangerous, not posing for a photographer. A well-made painted portrait of a ship-child.`

const INNOCENT = `INNOCENCE — NON-NEGOTIABLE: She is a child. No weapons of any kind. No flintlock, cutlass, dagger, axe, pistol, sword, hook, eyepatch, Jolly Roger, skull-and-crossbones, pirate hat, tricorn, parrot-as-pirate-prop, treasure-chest loot, rum bottle, or boarding gear. No adult sexuality, no glamour makeup, no lipstick, no smoky kohl, no beauty spot, no hoop-earring pirate jewellery, no feather boa. Nautical child clothes only — striped sailor kit, not a pirate captain's coat.`

const STYLE = `A well-made hand-drawn watercolor portrait — skilled illustrator, not a photograph, not amateur theatre. Transparent pigment washes on textured paper, visible brushwork, ink line with watercolor fill, or gouache portrait. Warm earth and sea palette: ochre, umber, salt-grey, faded navy, cream paper. Careful likeness, painterly edges, paper grain. NOT a studio photo, NOT tintype, NOT film grain photograph, NOT CGI, NOT hyperrealistic, NOT neon, NOT clean digital vector, NOT children's-book cartoon, NOT Disney.`

const CRAFT = `PORTRAIT CRAFT — WELL MADE: This should look like a finished gallery watercolor or a commissioned ink-and-wash portrait. Confident drawing, considered composition, pigment that sits on paper. Handmade, but skilled — not clumsy, not a school-play poster, not a snapshot.`

const COSTUME_CHILD = `COSTUME — NAUTICAL, TATTERED CHILD: She wears a child's sailor kit that has seen weather. Breton stripes or navy sailor collar, rope belt, too-big pea coat or salt-stained smock, patched knees, frayed cuffs, a tear mended with mismatched thread, hem coming down, scuffed bare feet or worn deck shoes. Clothes a bit tattered — lived-in, salt and wind, not costume-shop new, not gold-braid captain finery. Never a pirate coat with epaulettes, never a sash with weapons.`

const BODY = `BODY & POSTURE: A child's pose on a working ship — small against the rail and rigging. Unguarded, not filling the frame with adult swagger. Shoulders relaxed, hands visible, no power stance, no hip cock, no chin-up captain address.`

const ON_SHIP = `SETTING — ON A SHIP, NOT A STUDIO: She is physically on the deck of a wooden sailing ship. Planks underfoot, rail, mast, shrouds, coiled rope, canvas sails, sea and sky beyond. Wind, salt air, open weather. Never a photographer's studio, never a painted backdrop curtain, never a stool in front of a cyclorama, never a garden, never a cottage porch.`

const NEG = `No studio photograph, no photographer's backdrop, no painted kuliss curtain, no stool-and-cyclorama, no tintype, no wet-plate photo, no film grain photo, no garden, no cottage, no school portrait, no pirate, no captain, no tricorn, no skull-and-crossbones, no Jolly Roger, no flintlock, no pistol, no cutlass, no sword, no dagger, no axe, no hook, no eyepatch, no parrot, no rum, no treasure chest of loot, no adult woman, no teenager, no aged-up face, no different person, no face swap, no generic model child, no altered bone structure, no adult makeup, no lipstick, no smoky kohl, no beauty spot, no hoop pirate earrings, no feather boa, no sexy pose, no glamour stare, no hammy villain expression, no power stance, no Pirates of the Caribbean, no Jack Sparrow, no Disney pirate, no modern clothing, no bright saturated colors, no clean digital look, no neon, no glossy CGI, no hyperrealistic skin, no cartoon, no text, no watermark, no playing card overlay.`

const POSE = [
  'standing at the ship\'s rail, small hands on the wood, sea behind her',
  'sitting on a coil of rope on deck, knees up, looking toward the viewer',
  'holding a shroud line, leaning slightly with the ship\'s heel',
  'perched on a deck crate, feet dangling, wind in her hair',
  'crouched by the scuppers looking at a seashell, deck planks around her',
  'standing amidships, one hand on a mast hoop, curious not commanding',
  'sitting on the companionway step, elbows on knees, chin in hands',
  'three-quarter turn at the rail, looking back over her shoulder',
  'leaning on the gunwale watching the wake, hair blown aside',
  'cross-legged on the deck beside coiled hawser, a wooden toy boat in her lap',
  'standing in the bow, small against the bowsprit and stays',
  'sitting with her back against the mast, picture book closed in her lap',
]

const GAZE = [
  'soft open look toward the viewer — unafraid, not fierce',
  'shy half-smile, eyes meeting the viewer then almost glancing away',
  'curious direct gaze, as if she has just been called by name',
  'quiet wonder, a small genuine smile',
  'candid glance, gap-toothed if the source has it, completely unguarded',
]

const COSTUME = [
  'navy sailor-collar smock over Breton stripes, cuffs frayed, one patch on the knee',
  'too-big salt-stained pea coat, striped undershirt, rope belt, hem coming down',
  'faded indigo sailor dress, torn pocket mended with mismatched thread, bare feet',
  'wide-striped Breton jumper gone thin at the elbows, patched skirt, scuffed deck shoes',
  'child\'s navy reefer jacket missing a button, striped stockings with a hole',
  'salt-bleached sailor collar and rope-tied waist, clothes wind-worn not costume-new',
  'oversized striped shirt as a dress, knotted at the side, tattered hem, tar stain on the sleeve',
  'worn sailor kit: navy wool, cream stripe, a tear at the shoulder carefully darned',
]

const PROPS = [
  'a worn picture book (Elsie Beskow / Tomtebobarnen energy) held gently',
  'a single seashell in her open palm',
  'a small unpainted wooden toy boat',
  'nothing in her hands — empty child hands on the rail',
  'a bit of spare marline / thin rope she is fidgeting with',
  'a tin cup of water, no rum',
]

const BACKGROUND = [
  'wooden deck of a sailing ship, rail and sea beyond, fair weather',
  'amidships: mast, shrouds, coiled rope, canvas above, open sky',
  'the bow: bowsprit, stays, water rushing below, no battle',
  'beside the companionway hatch, deck planks and a coiled hawser',
  'at the rail with sails and a quiet horizon, no storm, no kraken',
  'sitting against the mast, rigging and pale sky, salt air',
  'near the stern rail, wake and gulls, timber and rope in the foreground',
]

const MEDIA = [
  'finished watercolor portrait on textured paper, visible washes',
  'ink line and watercolor wash, skilled illustrator\'s portrait',
  'gouache on cream paper, painterly but careful likeness',
  'hand-drawn watercolor on rag paper, pigment pooling in the folds of cloth',
]

function pickRandom(pool) {
  return pool[Math.floor(Math.random() * pool.length)]
}

function buildPrompt({ keepExpression = false } = {}) {
  const pose = pickRandom(POSE)
  const gaze = keepExpression
    ? 'exact same facial expression as the input photo — unchanged smile, mouth, and eyes'
    : pickRandom(GAZE)
  const media = pickRandom(MEDIA)
  const costume = pickRandom(COSTUME)
  const props = pickRandom(PROPS)
  const background = pickRandom(BACKGROUND)

  const subject = `Paint a well-made watercolor / hand-drawn portrait of this girl as Svarta Malin at about ten — innocent, not yet a pirate, standing on a wooden sailing ship. Portrait orientation, aspect ratio 63:88 (playing card proportions), vertical composition.

Render as a ${media}. Half- or three-quarter-length portrait of a child on deck. ${pose}. ${gaze}. Costume (nautical, a bit tattered): ${costume}. Prop: ${props}. She is on a ship: ${background}. No studio, no photograph, no weapons, no pirate captain costume, no adult glamour.`

  const blocks = [LIKENESS, AGE, CHILD, INNOCENT, COSTUME_CHILD, ON_SHIP]
  if (keepExpression) {
    blocks.push(KEEP_EXPRESSION)
  } else {
    blocks.push(VARY_EXPRESSION)
  }
  blocks.push(BODY, CRAFT, subject, STYLE, NEG)

  const summary = [
    keepExpression ? 'keep expr' : 'innocent expr',
    'age ~10 · ship · watercolor',
    pose.split(/[,.]/)[0].slice(0, 28),
  ].join(' · ')

  const picks = {
    pose,
    gaze,
    media,
    costume,
    props,
    background,
  }

  return { prompt: blocks.join(' '), summary, picks }
}

async function logPrompt({
  source,
  output,
  version,
  backend,
  keepExpression,
  summary,
  picks,
  prompt,
  status,
  error = null,
  durationSec = null,
}) {
  await mkdir(OUT_DIR, { recursive: true })

  const lines = [
    '='.repeat(80),
    new Date().toISOString(),
    `status: ${status}`,
    `source: ${source}`,
    `output: ${output}`,
    `version: ${version}`,
    `backend: ${backend}`,
    `keep_expression: ${keepExpression}`,
    `summary: ${summary}`,
  ]

  if (durationSec != null) lines.push(`duration_sec: ${durationSec}`)
  if (error) lines.push(`error: ${error}`)

  lines.push('', 'picks:')
  for (const [key, value] of Object.entries(picks)) {
    lines.push(`  ${key}: ${value}`)
  }

  lines.push('', 'prompt:', prompt, '')

  await appendFile(PROMPT_LOG, `${lines.join('\n')}\n`, 'utf8')
}

// ── I/O & backend (mirrors generate-svarta-malin-portrait.js) ───────────────

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

async function fileExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function resolveOutputPath(stem) {
  await mkdir(OUT_DIR, { recursive: true })
  const names = await readdir(OUT_DIR).catch(() => [])
  const versionRe = new RegExp(`^${escapeRegex(stem)}(?:-v(\\d+))?\\.jpg$`, 'i')

  let maxVersion = 0
  for (const n of names) {
    const m = n.match(versionRe)
    if (!m) continue
    maxVersion = Math.max(maxVersion, m[1] ? Number(m[1]) : 1)
  }

  let version = maxVersion + 1
  for (;;) {
    const filename = version === 1 ? `${stem}.jpg` : `${stem}-v${version}.jpg`
    const path = join(OUT_DIR, filename)
    if (!(await fileExists(path))) return { version, filename, path }
    version += 1
  }
}

async function listSources(filterStem) {
  let names
  try {
    names = await readdir(IN_DIR)
  } catch {
    throw new Error(`Input directory not found: ${IN_DIR}\nDrop childhood photos as IMG_5372.JPG … IMG_5376.JPG`)
  }

  const files = names
    .filter((n) => INPUT_EXTS.has(extname(n).toLowerCase()))
    .sort()

  if (!files.length) {
    throw new Error(`No images in ${IN_DIR} (expected IMG_5372.JPG … IMG_5376.JPG)`)
  }

  if (!filterStem || filterStem === '--all') return files

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
    const tmpFlat = join(tmpdir(), `malin-barn-flat-${randomBytes(8).toString('hex')}.jpg`)
    const tmpSized = join(tmpdir(), `malin-barn-sized-${randomBytes(8).toString('hex')}.jpg`)
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
  console.log(`Expression: ${keepExpression ? 'keep (from source photo)' : 'innocent child (vary)'}`)
  console.log(`Sources: ${queue.map((f) => basename(f)).join(', ')}`)
  console.log(`Output → ${OUT_DIR}`)
  console.log(`Prompt log → ${PROMPT_LOG}\n`)

  for (const file of queue) {
    const stem = basename(file, extname(file))
    const inPath = join(IN_DIR, file)
    const { version, filename, path: outPath } = await resolveOutputPath(stem)
    const { prompt, summary, picks } = buildPrompt({ keepExpression })

    const versionLabel = version > 1 ? ` v${version}` : ''
    process.stdout.write(`🌱 ${file}${versionLabel} → ${filename} (${summary}) … `)

    const start = Date.now()
    const logBase = {
      source: file,
      output: filename,
      version,
      backend: backend.name,
      keepExpression,
      summary,
      picks,
      prompt,
    }

    try {
      const jpeg = await backend.generate(inPath, prompt)
      if (await fileExists(outPath)) {
        throw new Error(`refusing to overwrite existing file: ${filename}`)
      }
      await writeFile(outPath, jpeg, { flag: 'wx' })
      const durationSec = ((Date.now() - start) / 1000).toFixed(1)
      await logPrompt({ ...logBase, status: 'ok', durationSec })
      console.log(`done (${durationSec}s, ${(jpeg.length / 1024).toFixed(0)} KB)`)
      console.log(`   → ${filename}`)
    } catch (err) {
      await logPrompt({ ...logBase, status: 'failed', error: err.message })
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
