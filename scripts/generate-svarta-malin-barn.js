#!/usr/bin/env node
/**
 * Iterative portrait generator for Svarta Malin as a child — ~10, innocent, not yet a pirate.
 * Nautical tattered clothes; varies medium, prop (rope / toy boat / telescope), and place.
 * Same pipeline as generate-svarta-malin-portrait.js; no weapons; never overwrites.
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
 *   npm run generate-svarta-malin-barn -- --times 3    # three full passes
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

const CHILD = `SVARTA MALIN AS A CHILD: This is Malin before the legend — about ten, a sailor's daughter. Innocent, curious, wind in her hair. She may be aboard or ashore on the Swedish coast. Not a captain, not dangerous, not posing in a photographer's studio.`

const INNOCENT = `INNOCENCE — NON-NEGOTIABLE: She is a child. No weapons of any kind. No flintlock, cutlass, dagger, axe, pistol, sword, hook, eyepatch, Jolly Roger, skull-and-crossbones, pirate hat, tricorn, parrot-as-pirate-prop, treasure-chest loot, rum bottle, or boarding gear. No adult sexuality, no glamour makeup, no lipstick, no smoky kohl, no beauty spot, no hoop-earring pirate jewellery, no feather boa. Nautical child clothes only — striped sailor kit, not a pirate captain's coat. A telescope is a child's brass spyglass, never a weapon.`

const STYLE = `Vintage Svarta Malin portrait — weathered, nostalgic, faintly melancholic. Use the named palette. The chosen medium must read clearly and look well-made. NOT a photographer's studio, NOT CGI, NOT neon, NOT Disney, NOT a children's-book cartoon, NOT glossy digital, NOT hyperrealistic photography.`

const CRAFT = `PORTRAIT CRAFT — WELL MADE: A finished commissioned portrait in the stated medium. Confident composition, careful likeness, handmade and skilled — not clumsy, not a school-play poster, not a snapshot, not a studio cyclorama.`

const COSTUME_CHILD = `COSTUME — NAUTICAL, TATTERED CHILD: Wear the specific outfit named below. Lived-in, salt and wind, a bit tattered — not costume-shop new, not gold-braid captain finery. Never a pirate coat with epaulettes, never a sash with weapons, never a tricorn.`

const BODY = `BODY & POSTURE: Follow the named pose. A child's body — unguarded, no power stance, no hip cock, no chin-up captain address.`

const PLACE = `SETTING — COASTAL CHILDHOOD, NEVER A STUDIO: Follow the named place, weather, and light. Outdoors, nautical, Swedish coast. Never a photographer's studio, never a painted backdrop curtain, never a stool in front of a cyclorama, never a garden, never a cottage porch.`

const NEG = `No studio photograph, no photographer's backdrop, no painted kuliss curtain, no stool-and-cyclorama, no garden, no cottage, no school portrait, no pirate, no captain, no tricorn, no skull-and-crossbones, no Jolly Roger, no flintlock, no pistol, no cutlass, no sword, no dagger, no axe, no hook, no eyepatch, no parrot, no rum, no treasure chest of loot, no adult woman, no teenager, no aged-up face, no different person, no face swap, no generic model child, no altered bone structure, no adult makeup, no lipstick, no smoky kohl, no beauty spot, no hoop pirate earrings, no feather boa, no sexy pose, no glamour stare, no hammy villain expression, no power stance, no Pirates of the Caribbean, no Jack Sparrow, no Disney pirate, no modern clothing, no bright saturated colors, no clean digital look, no neon, no glossy CGI, no hyperrealistic skin, no cartoon, no text, no watermark, no playing card overlay.`

const LOCATIONS = [
  {
    id: 'ship',
    place: 'on the deck of a wooden sailing ship — rail, mast, shrouds, canvas, sea beyond',
    poses: [
      'standing at the ship\'s rail, small hands on the wood, sea behind her',
      'sitting on a coil of rope on deck, knees up, looking toward the viewer',
      'holding a shroud line, leaning slightly with the ship\'s heel',
      'perched on a deck crate, feet dangling, wind in her hair',
      'three-quarter turn at the rail, looking back over her shoulder',
      'standing in the bow, small against the bowsprit and stays',
      'sitting at the capstan, one boot on a spoke',
      'lying on her stomach on warm deck planks, chin in hands',
      'climbing the first ratlines, only a few rungs up, not high',
    ],
  },
  {
    id: 'dock',
    place: 'on a weathered wooden dock / jetty, pilings and still harbour water, moored boats behind',
    poses: [
      'sitting on the dock edge, heels kicking above the water',
      'standing on the jetty, one hand on a mooring post',
      'cross-legged on sun-bleached planks, harbour behind her',
      'leaning on a piling, looking back toward the viewer',
      'walking the dock, small against the quay and masts',
      'lying on the dock on her side, looking down at the water',
      'sitting with her back against a cleat, knees to chest',
    ],
  },
  {
    id: 'rock',
    place: 'on a granite rock by the water, Swedish skerries, waves at the foot of the stone',
    poses: [
      'sitting on a sun-warmed rock, knees drawn up, sea behind',
      'standing on a low skerry boulder, wind in her hair',
      'perched on a cliff-edge rock, water far below, not dangerous-looking',
      'crouched on wet stone at the waterline, spray on her shins',
      'lying back on flat granite, sky and a gull above',
      'standing one-footed on a stepping-stone in a rock pool',
    ],
  },
  {
    id: 'shore',
    place: 'on a pebble beach / shoreline, seaweed and driftwood, a quiet bay',
    poses: [
      'standing barefoot at the water\'s edge, small waves at her feet',
      'sitting on driftwood, the bay opening behind her',
      'crouched on pebbles, looking up from the shore',
      'walking away along the tideline, looking back over her shoulder',
      'kneeling to pick something from the wrack line',
    ],
  },
  {
    id: 'harbour',
    place: 'on a stone harbour wall / quay, ladders, iron rings, fishing boats at rest',
    poses: [
      'sitting on the harbour wall, legs hanging toward the water',
      'standing by an iron mooring ring, stone quay and masts behind',
      'leaning over the quay edge, curious, not commanding',
      'sitting on a stone bollard, swinging one foot',
      'halfway down a quay ladder, paused, looking up',
    ],
  },
  {
    id: 'rowboat',
    place: 'in or beside a small wooden rowboat pulled up on shore or tied at a dock',
    poses: [
      'sitting in the stern of a beached rowboat, oars shipped',
      'standing in the shallows beside the rowboat, one hand on the gunwale',
      'perched on the thwart of a tied dinghy at the dock',
      'lying in the bottom of the boat looking at the sky',
      'pushing the bow off the pebbles, both hands on the stem',
    ],
  },
  {
    id: 'lighthouse',
    place: 'at the foot of a whitewashed lighthouse on granite, door ajar, sea and sky huge',
    poses: [
      'standing small against the lighthouse wall, looking toward the viewer',
      'sitting on the lighthouse doorstep, knees together',
      'leaning in the open lighthouse doorway, half in shadow',
    ],
  },
  {
    id: 'nets',
    place: 'among fishing nets hung to dry on poles, cork floats, a glimpse of harbour beyond',
    poses: [
      'standing half-hidden in hanging nets, face catching light',
      'sitting under the nets as under a tent, looking out',
      'reaching up to touch a cork float on a drying net',
    ],
  },
  {
    id: 'slipway',
    place: 'on a wooden boat slipway / båtslipp, wet boards, keel-blocks, a hull nearby',
    poses: [
      'walking down the wet slipway toward the water',
      'sitting on a keel-block, slip and hull behind her',
      'crouched on the slip, looking at the water at the bottom',
    ],
  },
  {
    id: 'reeds',
    place: 'in tall reeds at a sheltered inlet, water glinting between the stems',
    poses: [
      'standing among reeds, only her upper half visible',
      'sitting at the reed-edge with her feet in the shallows',
      'parting the reeds to look out at a small boat',
    ],
  },
  {
    id: 'sandbar',
    place: 'on a sandbar at low tide, tidal pools, the mainland a dark strip',
    poses: [
      'standing in a tidal pool up to her shins',
      'crouched over a pool, reflection beside her',
      'running a few steps on wet sand, looking back',
    ],
  },
  {
    id: 'beached',
    place: 'among several beached fishing boats on a strand, keels in the sand',
    poses: [
      'sitting in the shade under a beached hull',
      'standing between two keels, looking toward the viewer',
      'climbing onto a beached boat\'s gunwale, not high',
    ],
  },
]

const GAZE = [
  'soft open look toward the viewer — unafraid, not fierce',
  'shy half-smile, eyes meeting the viewer then almost glancing away',
  'curious direct gaze, as if she has just been called by name',
  'quiet wonder, a small genuine smile',
  'candid glance, gap-toothed if the source has it, completely unguarded',
  'looking down at the water, then catching the viewer from under her brow',
  'squinting slightly in wind or sun, still a child, not fierce',
  'laughing with her mouth open, unposed',
  'serious and quiet, thinking, not sad',
  'looking at her prop, absorbed, not at the viewer',
  'looking past the viewer at a distant sail',
  'biting her lower lip, concentrating',
  'eyes almost closed against spray, smiling',
  'profile, looking out to sea, we see the side of her face',
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
  'yellowed oilskin three sizes too big, sleeves rolled, striped dress underneath',
  'thick knitted fisherman\'s jumper, sagging, patched elbows, bare legs',
  'patched canvas dungarees over a striped vest, one strap unbuttoned',
  'faded red flannel undershirt and a too-long navy skirt, hem wet',
  'grey wool socks with holes, wooden clogs, short smock, wind at the hem',
  'sou\'wester rain hat (not a tricorn) and a dripping oilskin, hair stuck to her cheeks',
  'cream Guernsey knit gone out at the cuffs, rope belt, no shoes',
  'checked skirt and a sailor blouse, one cuff unbuttoned and flapping',
  'only a striped singlet and rolled trousers, sun on her shoulders, salt on her skin',
  'a faded kerchief tied under her chin (not a pirate bandana), pea coat open',
]

const PROPS = [
  'a coil of thick hawser rope in her lap, one end in her hands',
  'a length of worn rope slung over her shoulder like a sash',
  'thin marline / spare line she is fidgeting into a knot',
  'sitting against a coil of dock rope, one strand in her fingers',
  'a small unpainted wooden toy boat held in both hands',
  'a carved pine toy boat with a paper sail, in her lap',
  'a wooden toy boat she is about to set on the water',
  'a toy dinghy tucked under one arm',
  'a small brass spyglass held to one eye — a child\'s telescope, not a captain\'s',
  'a closed brass telescope held in both hands like something precious',
  'a spyglass tucked under her arm, looking toward the horizon without using it',
  'a short brass telescope pointed at a distant island, seated',
  'a single oar taller than she is, held upright',
  'a cork fishing float on a bit of net, in her palms',
  'a wooden bucket, empty, the rope handle in one hand',
  'a child\'s compass on a string around her neck, she is looking at it',
  'a tin lantern (unlit), not a weapon, hanging from her fingers',
  'a starfish or large shell, not a treasure chest',
  'a folded paper boat she has just made',
  'a coil of netting with a few corks, trailing at her feet',
]

const MEDIA = [
  'finished watercolor on rag paper, transparent washes, visible paper grain',
  'ink line and watercolor wash, skilled illustrator\'s portrait',
  'gouache on cream board, opaque pigment, painterly but careful likeness',
  'antique hand-coloured copper engraving — fine etched line, later tinted in muted earth and sea colours',
  'vintage chromolithograph, cabinet-card / cigarette-card print, limited bold palette slightly faded',
  'sepia bistre ink wash drawing, warm brown monochrome, paper showing through',
  'soft pastel on toned paper, chalky strokes, sea-air light',
  'oil sketch on canvas, alla prima, visible brush, unfinished edges around a finished face',
  'conté crayon portrait on cream paper, warm brown and black, a little white chalk',
  'hand-coloured lithograph, 19th-century print, slightly off-register tints',
  'Swedish picture-book illustration in the spirit of Bauer or Beskow — lyrical, not cartoon, not Disney',
  'pencil underdrawing with watercolor, Sargent-like wet paper, careful child likeness',
  'charcoal and white chalk on grey paper, smudged sea air',
  'sanguine red-chalk drawing, cream paper, a little graphite',
  'drypoint etching, velvety burr, a faint hand-tint in the sky',
  'aquatint in two greys and a warm ochre',
  'egg tempera on gesso panel, matte, small careful strokes',
  'woodcut with hand-colour, bold simplified shapes, still a likeness not a cartoon',
  'coloured pencil on warm paper, layered, slightly waxy',
  'limited three-colour letterpress-style print, cream, navy, rust',
  'Prussian-blue cyanotype look, then hand-tinted cheeks and hair — still handmade, not a studio photo',
  'mezzotint, dark velvety ground, her face emerging in light',
]

const WEATHER = [
  'bright overcast Baltic light, no hard shadows',
  'stiff breeze, clothes and hair moving, whitecaps far out',
  'sea fog, masts and rocks half-lost, soft edges',
  'just after rain, wet wood and stone shining',
  'still high-summer noon, heat-haze over the water',
  'grey chop, a little spray',
  'dead-calm water like glass, one gull',
  'a squall passing, a bright patch of sun on her',
]

const LIGHT = [
  'low evening sun, long warm shadows, gold on the water',
  'cold morning light from the east, pale',
  'dusk, the sky still light, her face half shadow',
  'midday glare bouncing off the water onto her chin',
  'diffused cloud-light, even and kind',
  'backlit, hair a bright edge, face in open shade',
  'a shaft of sun through fog, theatrical but natural',
  'late afternoon raking light across planks or granite',
]

const FRAMING = [
  'close three-quarter, face large in the frame',
  'full-length, the child small in the landscape',
  'half-length, the named prop large in the foreground',
  'almost profile, the place opening behind her ear',
  'slightly high angle, she looks up',
  'low angle from the water or the dock, she is still a small child not a hero',
  'cropped at the knees, wind filling the rest of the frame',
  'she is off-centre, the sea taking half the picture',
]

const HAIR = [
  'same colour and hairline as the source; loose and windblown',
  'same colour and hairline as the source; one messy braid',
  'same colour and hairline as the source; wet fringe stuck to her forehead',
  'same colour and hairline as the source; a faded ribbon half-undone',
  'same colour and hairline as the source; tucked behind both ears',
  'same colour and hairline as the source; salted and sticking up at the crown',
  'same colour and hairline as the source; a single lock in her mouth',
]

const PALETTE = [
  'ochre, umber, salt-grey, cream',
  'cold Prussian blue, cream, a little rust',
  'faded rust, moss green, driftwood grey',
  'near-monochrome sepia with one note of faded red',
  'limited green, orange, cream — slightly faded print colours',
  'bone, tar-black, and a wash of sea-green',
  'warm gold hour: amber, brown, pale sky',
  'chalky pastels: grey-blue, sand, white',
]

function pickRandom(pool) {
  return pool[Math.floor(Math.random() * pool.length)]
}

function buildPrompt({ keepExpression = false } = {}) {
  const location = pickRandom(LOCATIONS)
  const pose = pickRandom(location.poses)
  const gaze = keepExpression
    ? 'exact same facial expression as the input photo — unchanged smile, mouth, and eyes'
    : pickRandom(GAZE)
  const media = pickRandom(MEDIA)
  const costume = pickRandom(COSTUME)
  const props = pickRandom(PROPS)
  const weather = pickRandom(WEATHER)
  const light = pickRandom(LIGHT)
  const framing = pickRandom(FRAMING)
  const hair = pickRandom(HAIR)
  const palette = pickRandom(PALETTE)

  const subject = `Make a well-made portrait of this girl as Svarta Malin at about ten — innocent, not yet a pirate. Portrait orientation, aspect ratio 63:88 (playing card proportions), vertical composition.

Medium: ${media}. Palette: ${palette}. Framing: ${framing}. Place: ${location.place}. Weather: ${weather}. Light: ${light}. Pose: ${pose}. ${gaze}. Hair: ${hair}. Costume (nautical, a bit tattered): ${costume}. Prop (must be visible): ${props}. No studio, no weapons, no pirate captain costume, no adult glamour.`

  const blocks = [LIKENESS, AGE, CHILD, INNOCENT, COSTUME_CHILD, PLACE]
  if (keepExpression) {
    blocks.push(KEEP_EXPRESSION)
  } else {
    blocks.push(VARY_EXPRESSION)
  }
  blocks.push(BODY, CRAFT, subject, STYLE, NEG)

  const summary = [
    keepExpression ? 'keep expr' : 'innocent expr',
    `age ~10 · ${location.id} · ${media.split(',')[0].slice(0, 18)}`,
    pose.split(/[,.]/)[0].slice(0, 22),
  ].join(' · ')

  const picks = {
    location: location.id,
    place: location.place,
    pose,
    gaze,
    media,
    costume,
    props,
    weather,
    light,
    framing,
    hair,
    palette,
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
  let times = 1

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--keep-expression' || arg === '-k') {
      keepExpression = true
      continue
    }
    if (arg === '--all') {
      all = true
      continue
    }
    if (arg === '--times' || arg === '-n') {
      times = Math.max(1, Number(argv[++i]) || 1)
      continue
    }
    if (arg.startsWith('--times=')) {
      times = Math.max(1, Number(arg.slice(8)) || 1)
      continue
    }
    if (arg.startsWith('-')) continue
    filterStem = arg.replace(/\.(jpe?g|png|webp)$/i, '')
  }

  if (all) filterStem = '--all'
  return { filterStem, keepExpression, times }
}

async function main() {
  const backend = await resolveBackend()
  const { filterStem, keepExpression, times } = parseArgs(process.argv.slice(2))
  const queue = await listSources(filterStem)

  console.log(`Backend: ${backend.name}`)
  console.log(`Expression: ${keepExpression ? 'keep (from source photo)' : 'innocent child (vary)'}`)
  console.log(`Sources: ${queue.map((f) => basename(f)).join(', ')}`)
  console.log(`Passes: ${times} (${queue.length * times} portraits)`)
  console.log(`Output → ${OUT_DIR}`)
  console.log(`Prompt log → ${PROMPT_LOG}\n`)

  for (let pass = 1; pass <= times; pass++) {
    if (times > 1) console.log(`── pass ${pass}/${times} ──`)

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
  }

  console.log('\nFinished. Re-run for another variation (adds -v2, -v3, …).')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
