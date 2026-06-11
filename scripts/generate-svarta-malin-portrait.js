#!/usr/bin/env node
/**
 * Iterative portrait generator for Svarta Malin — the fiercest pirate captain.
 * Tighter prompt than generate-portraits.js: epic captain energy, big hat always.
 *
 * Input:  images/svarta-malin/malin-tadaa.jpg, malin-tadaa2.jpg, …
 * Output: images/svarta-malin-generated/<stem>.jpg, <stem>-v2.jpg, … (never overwrites)
 * Log:    images/svarta-malin-generated/prompts.log (appends every run)
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

import { readFile, writeFile, mkdir, readdir, unlink, appendFile } from 'node:fs/promises'
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
const PROMPT_LOG = join(OUT_DIR, 'prompts.log')
const DEFAULT_SOURCE = 'malin-tadaa'

const INPUT_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const USE_API_KEY = process.env.PORTRAIT_USE_API_KEY === '1'

// ── Fixed captain identity (low variation) ──────────────────────────────────

const LIKENESS = `HIGHEST PRIORITY — FACIAL IDENTITY: This must be unmistakably the same woman as in the input photo. Preserve bone structure, jawline, cheekbones, nose shape, eye shape and spacing, ears, hairline, skin tone, age, and distinctive features (freckles, dimples). Do NOT invent a new face, do NOT beautify into a different person, do NOT swap ethnicity, do NOT age up or down significantly. She must remain recognisable — expression may change for epic captain drama.`

const KEEP_EXPRESSION = `FACIAL EXPRESSION — PRESERVE FROM SOURCE: Keep the exact expression from the input photo. Same smile or mouth, same eye openness, same eyebrow position. Do NOT invent a new expression.`

const VARY_EXPRESSION = `FACIAL EXPRESSION — HAMMY FEMALE POWER: Expression cranked past eleven — commanding stare, enormous defiant smirk, narrowed lethal eyes, chin so high it defies gravity, silent-film villain flair, panto finale triumph. Same woman, new expression: absurdly theatrical, bold, shamelessly hammy.`

const CAPTAIN = `SVARTA MALIN — THE CAPTAIN: She is the most fierce pirate captain who ever lived — a woman who seized the ship and the legend. Commanding, lethal, self-possessed; the woman every other pirate will eventually kneel to. Epic scale through theatrical excess: power is feminine, absolute, and LOUD — she leads, she decides, she wins. Dangerous swagger dialed to maximum.`

const FEMALE_POWER = `FEMALE POWER — NON-NEGOTIABLE: She must read as a dangerous, self-assured woman in absolute command — not a man's sidekick, not a decorative love interest, not softened or domesticated. Sexy through swagger, confidence, and lethal competence: strong stance, direct power gaze, props held with intent. Alluring because she looks like she could take your ship — formidable femme captain, Bonny-and-Read energy through over-the-top stage costume. No damsel, no submissive gaze.`

const OVER_THE_TOP = `OVER THE TOP — ABSOLUTE MAXIMUM: Every single element pushed past the point of reason. THREE costume layers minimum. THREE props minimum. Hat so big it threatens the top of the frame. Pose so hammy the audience would boo with delight. Makeup you can see from the back row. Backdrop so ambitious the set crew would weep. If it does not feel slightly embarrassing in its excess, ADD MORE. Village-hall pirate panto at full volume — camp swagger, glorious clutter, zero restraint. More is more is MORE.`

const HAT = `HEADWEAR — MANDATORY GIGANTIC KULISS-HAT: An absurdly enormous tricorn — the biggest, most ridiculous pirate hat ever mounted on a human head. Amateur-theatre caricature only: cardboard-stiff felt from a village-hall box, wobbly painted skull-and-crossbones, hot-glued gold braid, plastic feathers sticking out at wild angles, sequins that caught someone's eye at the craft store, maybe a second smaller hat badge pinned on for no reason. So large it rivals the painted backdrop — a kuliss that escaped onto her head. Worn level and proud. No bare head, no small hat — GIGANTIC fake tricorn non-negotiable.`

const STYLE = `Vintage pirate romanticism in the Svarta Malin style. 18th-century pirate world through 1920s–30s Hollywood studio glamour — theatrical, adventurous, weathered and nostalgic. Sepia / warm brown tones, soft diffused studio light, antique photographic finish with film grain and faint scratches. NOT modern clothing, NOT bright saturated colors, NOT clean digital look, NOT neon, NOT glossy CGI, NOT hyperrealistic.`

const AMATEUR = `AMATEUR THEATRE KULISS — ALL OF IT: Village-hall dress rehearsal, community-play cast photo, church-hall variety-show energy. Costumes from a fancy-dress box assembled the night before the show: thrift-store fabrics, uneven hand-stitching, visible safety pins, glue-gun trim, spray-painted gold on cardboard epaulettes, polyester that shines wrong under the lights. Charming, camp, slightly clumsy — never slick, never expensive-looking, never historically accurate. Epic captain energy delivered through glorious homemade excess.`

const COSTUME_AMATEUR = `COSTUME — AMATEUR THEATRE ONLY, LAYERED TO ABSURDITY: Multiple homemade layers piled on — school-play kit PLUS panto cast-off PLUS Halloween bargain bin. Safety pins visible, glue-gun galore, duct-tape holding epaulettes on, tinsel AND pom-poms AND lace cuffs all at once. Two sashes, three necklaces, coat over coat. Coat shoulders two sizes too big, boots from the props cupboard, everything crooked. The audience should smell hot glue from the photograph.`

const PROPS_EXCESS = `PROPS — PILE THEM ON: She must carry or wear multiple obvious stage props at once — never just one accessory. Dual or triple foam pistols, cutlass AND axe AND map, parrot AND flag AND spyglass, treasure spilling at her feet. Props clutter the frame like a dressing-room explosion. All charmingly fake, all too many.`

const BODY = `BODY & POSTURE: Pose so epic and hammy it fills every inch of the frame — shoulders back, chest open, limbs extended, wide power stance. She occupies the stage like a panto lead's curtain call. Exaggerated, theatrical, bold.`

const NEG = `No different person, no face swap, no generic model face, no altered bone structure, no bare head, no hatless portrait, no small hat, no bandana without tricorn, no crooked or askew headwear, no realistic fine leather hat, no movie-quality or historically accurate headwear, no slick cosplay, no tasteful restraint, no subtle minimal costume, no understated elegance, no museum-quality tailoring, no documentary realism, no plain grey studio void, no subtle soft bokeh only, no real location photography background, no passive pin-up, no cheesecake pose, no boudoir damsel, no submissive or downcast gaze, no damsel-in-distress, no male captain overshadowing her, no Pirates of the Caribbean look, no Jack Sparrow, no Disney pirate aesthetic, no modern clothing, no bright saturated colors, no clean digital look, no neon, no glossy CGI, no hyperrealistic skin, no text, no watermark, no playing card overlay.`

// Small pools — one pick each, captain-focused
const POSE = [
  'standing tall, coat flung wide open, chin impossibly lifted — hammy finale address to the audience',
  'one hand on hip, other thrusting cutlass straight at the sky — victory pose, maximum swagger',
  'boot planted on painted crate, torso leaned back, flintlock raised high — conquering the stage',
  'one arm extended opera-style, full Penzance flourish toward the painted horizon',
  'both hands gripping oversized sword hilt overhead — triumph pose, blade pointing up',
  'flintlock held up near cheek, other arm swept wide — silent-film villain menace',
  'wide stance at ship\'s wheel prop, leaning into a hard turn — absurdly large painted wheel',
  'one knee down beside treasure chest, cutlass planted in ground, chin up — epic proclamation',
  'feather boa flying, cutlass swept in a huge theatrical arc across the frame',
  'perched on barrel rim, legs wide, pistol aimed at camera — bold captain excess',
  'skull-and-crossbones flag billowing behind her like a superhero cape',
  'lunging forward one step, cutlass extended toward camera — duel challenge',
  'arms spread wide claiming the entire stage — "this ship is MINE" panto energy',
  'back foot planted, front foot forward, cutlass pointed down — duelist en garde',
  'mid-stride toward camera, coat tails and sash flying — entrance of the conqueror',
  'both elbows on knees, leaning forward from throne-crate — interrogating the mutineers',
  'cutlass held horizontal across chest, chin over the blade — defiant standoff',
  'one fist raised to the sky, cutlass in the other — panto triumph moment',
  'crouched low then rising, cutlass sweeping upward — dynamic captain reveal',
  'speaking-trumpet megaphone raised, other hand commanding the painted crew',
  'turning over shoulder, coat and flag caught mid-swing — dramatic exit pose',
  'pistol extended at arm\'s length straight at camera — Bonny-style bold swagger',
  'seated on crate edge, one booted leg kicked high, pistol across knee — tintype captain',
  'wide stance, coiled rope at feet, cutlass raised in huge dramatic arc',
  'both arms thrown skyward, cutlass and pistol held high — panto curtain-call triumph',
  'balanced on one foot on barrel rim, arms windmilling for balance — absurd heroic excess',
  'charging forward cutlass-first, coat flying behind like a superhero cape',
  'kneeling on BOTH knees, sword planted, arms spread — epic oath to the painted sea',
  'standing on tiptoes, chin at impossible angle, spyglass to eye — scouting conquered waters',
  'dual wielding cutlass and pistol, crossed in X before chest — maximum threat theatre',
  'dragging enormous painted treasure chest with one hand, cutlass aloft in the other',
]

const POSE_EXTRA = [
  'freeze-frame mid-battle leap, cutlass swinging in a huge arc',
  'planting Jolly Roger flag with both hands, foot on chest prop',
]

const GAZE = [
  'piercing hammy stare straight into the camera — she has already won',
  'defiant chin-up stare — unbowed, theatrical, in charge',
  'bold stare with exaggerated lethal smirk — silent-film swagger',
  'sidelong conspiratorial glance — panto villain energy',
  'ice-cold direct stare with raised eyebrow — respect me or regret it',
]

const COSTUME = [
  'oversized charity-shop frock coat, glue-gun gold braid, visible safety pins at the collar',
  'vivid red polyester stage coat, cardboard epaulettes, spray-painted gold trim peeling slightly',
  'striped knit sweater repurposed as pirate shirt under patched velvet waistcoat — school-play kit',
  'emerald-green coat from fancy-dress box, feather boa safety-pinned to shoulder',
  'layered thrift coats — velvet over striped vest, three sizes of mismatched brass buttons',
  'military jacket from party shop, fake gold epaulettes stapled on, polka-dot bandana at neck',
  'lace cuffs sewn on at the last minute over obviously polyester sleeves',
  'hand-sewn coat with uneven stitching, pom-pom trim that seemed like a good idea',
  'Halloween pirate costume assembled from three different bargain bins',
  'duct-tape belt repair, striped polyester sash tied crooked, boots from props cupboard',
  'cream ruffled blouse from church-hall costume store, short waistcoat two sizes too small',
  'gold galon hot-glued to lapels, tinsel trim on cuffs — community-play Pirate King cast-off',
  'striped breeches clearly from a craft drawer, fringed sash made from a curtain remnant',
  'open coat in comic-opera green, lace collar crooked, cravat knotted by someone\'s mum',
  'TWO coats worn at once — outer velvet, inner striped, both too big',
  'three sashes tied at different angles, each from a different fabric bin',
  'shoulder cape made from a curtain remnant, safety-pinned over everything',
  'sequin trim hot-glued over already-tinselled cuffs — craft-store explosion',
  'cardboard cutlass holster AND foam pistol holster AND rope belt — belt overload',
]

const PROPS = [
  'two foam flintlocks tucked in sash — dual-pistol excess',
  'rubber cutlass with peeling gold spray-paint, raised theatrically',
  'plastic parrot clipped to shoulder, cutlass in opposite hand',
  'oversized cardboard treasure map and chunky wooden prop compass',
  'long ostrich-feather prop held aloft, hoop earrings catching light',
  'black skull-and-crossbones flag draped over shoulder, spyglass tucked in sash',
  'open treasure-chest prop with fake gold coins spilling everywhere',
  'coiled rope at feet, foam boarding axe at hip, flintlock in hand',
  'felt eyepatch on elastic string — camp accessory among many',
  'hook-hand glove prop AND eyepatch AND plastic parrot — triple cliché',
  'THREE foam flintlocks visible — belt, sash, and boot top',
  'ship\'s wheel prop gripped with one hand, cutlass in the other',
  'speaking-trumpet megaphone, rum bottle, and foam dagger — prop pile',
  'skull-and-crossbones flag as cape PLUS cutlass PLUS map scroll',
  'chunky wooden compass on string, spyglass, and rolled map — navigator overload',
  'miniature painted treasure chest under arm, coins falling out',
  'spray-painted foam boarding axe AND curved cutlass AND pistol',
]

const ACCESSORIES = [
  'enormous hoop earrings and layered beaded necklaces from craft box',
  'theatrical rouge and powder, exaggerated stage eyebrows',
  'feather boa draped over shoulders, tacky plastic bangles',
  'smoky kohl and beauty spot, silent-film glamour turned up loud',
  'folk-costume beaded earrings, smuggler jewellery piled on',
  'THREE necklaces of different lengths, all from the craft drawer',
  'theatrical rouge so bold it reads in sepia, beauty spot, drawn-on dramatic brows',
  'feather boa AND hoop earrings AND plastic bangles AND beaded choker — jewellery overload',
  'stick-on moustache-twirl energy but feminine — exaggerated stage makeup maximum',
]

const BACKGROUND_EPIC = `BACKGROUND — INSANELY EPIC PAINTED KULISS: The backdrop must be the most ambitious amateur set ever attempted — TWO dramatic scenes at once if needed: storm AND kraken AND fleet AND volcano. Flat painted flats, cardboard cut-outs, cotton-ball smoke, glitter on waves, brush strokes proudly visible, perspective hilariously wrong. Not a real location — a kuliss so extra it competes with her for attention. The set designer went feral.`

const BACKGROUND = [
  'painted cyclorama of raging storm sea — cardboard waves, lightning bolts painted in white, perspective wildly wrong',
  'flat kuliss of full-rigged galleon in full sail — rigging ropes painted comically thick, brush strokes visible',
  'hand-painted treasure island — palms too tall, skull rock, fake gold glitter on sand',
  'painted harbour at sunset — orange sky slapped on with a wide brush, crooked lighthouse on cliff',
  'flat scenery kraken attack — tentacles emerging from misty painted sea, panto terror',
  'painted fleet of cut-out ships on a flat ocean panel — epic armada, charmingly fake',
  'volcano erupting behind painted port city — smoke cotton balls, lava streaks in red poster paint',
  'painted whirlpool spiral in the ocean — dramatic vortex kuliss, stage-left flat meets stage-right awkwardly',
  'enormous painted Jolly Roger flag billowing across the entire backdrop',
  'painted tavern interior with barrels and crooked doorframe — perspective slightly drunk',
  'misty painted cliffs and seagulls drawn too large — rocky coast kuliss in grey and brown washes',
  'painted moon huge in night sky over ship-deck flat — gothic panto romance',
  'flat drop cloth of conquered port — cardboard skyline, painted cannon smoke',
  'painted tropical beach with shipwreck prop half-buried in sand — summer-show excess',
  'wrinkled dark theatrical curtain parted to reveal painted storm-at-sea cyclorama behind',
  'painted ship deck kuliss — mast and rigging as flat cut-outs, painted planks, visible stage screws',
  'hand-painted sunset over Salmonella Sea — dramatic clouds, gold fleck paint on waves',
  'aged sepia studio backdrop with creases — but painted ship and lightning added over it in amateur brushwork',
  'DOUBLE kuliss — storm sea flat IN FRONT OF volcano-and-fleet flat, both visible',
  'painted sea battle — two cut-out ships firing cotton-ball cannon smoke at each other',
  'giant painted kraken AND painted whirlpool AND lightning — triple threat backdrop',
  'conquered port with cardboard castle, painted fireworks, and oversized moon',
  'ship-deck flat WITH painted horizon AND cardboard seagulls on sticks',
  'tavern AND harbour visible through two parted curtains — two sets in one',
  'painted mermaid tail emerging from waves beside the ship kuliss — Lotería chaos',
  'gold glitter glued to painted waves, lightning, AND palm trees — craft-store apocalypse',
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

function pickRandomMany(pool, count) {
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, Math.min(count, pool.length))
}

function joinList(items) {
  return items.join('; ')
}

function buildPrompt({ keepExpression = false } = {}) {
  const pose = keepExpression
    ? 'same head angle and facial expression as the source photo; body may shift slightly for costume'
    : Math.random() < 0.2
      ? pickRandom(POSE_EXTRA)
      : pickRandom(POSE)
  const gaze = keepExpression
    ? 'exact same facial expression as the input photo — unchanged smile, mouth, and eyes'
    : pickRandom(GAZE)
  const media = pickRandom(MEDIA)
  const costume = pickRandomMany(COSTUME, 2)
  const props = pickRandomMany(PROPS, 3)
  const accessories = pickRandomMany(ACCESSORIES, 2)
  const background = pickRandom(BACKGROUND)

  const subject = `Transform this photograph into Svarta Malin — the ultimate vintage pirate captain portrait. Portrait orientation, aspect ratio 63:88 (playing card proportions), vertical composition.

Render as a ${media}. Half- or three-quarter-length portrait. ${pose}. ${gaze}. Costume layers (wear ALL at once): ${joinList(costume)}. Props (carry ALL at once): ${joinList(props)} — obvious costume accessories, not real weapons. Makeup and jewellery (ALL of it): ${joinList(accessories)}. Background: ${background}. ${HAT}`

  const blocks = [LIKENESS, CAPTAIN, FEMALE_POWER, OVER_THE_TOP, COSTUME_AMATEUR, PROPS_EXCESS, BACKGROUND_EPIC, HAT]
  if (keepExpression) {
    blocks.push(KEEP_EXPRESSION)
  } else {
    blocks.push(VARY_EXPRESSION)
  }
  blocks.push(BODY, AMATEUR, subject, STYLE, NEG)

  const summary = [
    keepExpression ? 'keep expr' : 'epic expr',
    'MAX OTT',
    pose.split(/[,.]/)[0].slice(0, 28),
  ].join(' · ')

  const picks = {
    pose,
    gaze,
    media,
    costume: joinList(costume),
    props: joinList(props),
    accessories: joinList(accessories),
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
  console.log(`Output → ${OUT_DIR}`)
  console.log(`Prompt log → ${PROMPT_LOG}\n`)

  for (const file of queue) {
    const stem = basename(file, extname(file))
    const inPath = join(IN_DIR, file)
    const { version, filename, path: outPath } = await resolveOutputPath(stem)
    const { prompt, summary, picks } = buildPrompt({ keepExpression })

    const versionLabel = version > 1 ? ` v${version}` : ''
    process.stdout.write(`⚓ ${file}${versionLabel} (${summary}) … `)

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
      await writeFile(outPath, jpeg)
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
