#!/usr/bin/env node
/**
 * Generate pirate map decoration PNGs.
 * Prompts from assets-prompts.md → public/images/map/
 *
 * Every output is post-processed to delivery size/format (see assetOutput):
 * - decorations: 512×512 RGBA PNG (backdrop stripped, compressed)
 * - arrow-down: 128×256 RGBA
 * - city silhouettes: 768×768 / 768×512 RGBA
 * - parchment: 1024×1024 opaque RGB PNG
 *
 * Default backend: ChatGPT subscription via Codex OAuth (`codex login`).
 * Optional API billing: MAP_ASSETS_USE_API_KEY=1 (requires OPENAI_API_KEY).
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateImageWithCodex, hasCodexSubscriptionAuth } from './lib/codex-image.js'
import { optimizeMapPng } from './lib/optimize-map-png.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'images', 'map')
const USE_API_KEY = process.env.MAP_ASSETS_USE_API_KEY === '1'

const STYLE =
  'A naïve, awkward hand-drawn illustration in iron-gall ink and faded watercolour wash, in the style of an enthusiastic but genuinely unskilled 17th–18th century amateur cartographer. Quill-pen linework with wobbly hesitant strokes and uneven pressure, the proportions clearly wrong, watercolour wash spilling outside the outlines. Period palette only — sepia, warm browns, muted rust red, faded teal, ochre, muted green — all slightly aged and oxidised. Looks like an authentic awkward sketch from the age of sail, made by someone who has heard about the subject but is not very good at depicting it. NOT a modern drawing, NOT a child crayon doodle, NOT clean digital art, NOT a polished engraving. Quill pen and iron-gall ink, NOT crayons, NOT felt-tip, NOT modern materials.'

const TRANSPARENT =
  'CRITICAL OUTPUT REQUIREMENTS: PNG with a fully transparent background (alpha channel). ONLY the single subject/object must be visible — absolutely NO parchment sheet, NO paper background, NO notebook lines, NO full-bleed scene backdrop, NO cream or beige fill behind the subject, NO border, NO vignette, NO drop shadow on a backdrop. Isolated cutout sticker / map decoration on complete transparency. Transparent pixels must surround the subject on all sides with generous margin. Nothing else in the image except the one illustration object.'

const NEG =
  'No clean digital vector lines, no modern illustration style, no neon, no photorealism, no professional polish, no children storybook style, no crayon, no felt-tip, no background scenery, no paper texture behind the subject.'

/** Default delivery size for isolated map decorations. */
const DECOR_SIZE = [512, 512]

/**
 * @param {{ transparent?: boolean, size?: [number, number] }} asset
 */
function assetOutput(asset) {
  const transparent = asset.transparent !== false
  const [width, height] = asset.size ?? DECOR_SIZE
  return { width, height, transparent }
}

/** @type {{ file: string, prompt: string, transparent?: boolean, size?: [number, number] }[]} */
const ASSETS = [
  {
    file: 'dragon-warning-1.png',
    prompt:
      'A naïve, awkwardly drawn sea-dragon for a 17th-century pirate map, by an amateur cartographer who has clearly never seen a dragon. Quill pen and iron-gall ink, with patches of muted rust-red and faded green watercolour wash that drift outside the linework. The body is worm-like and lopsided, the wings mismatched in size, the head too big, one eye larger than the other, a forked tongue sticking out. Proportions all wrong, lines wobbly and hesitant. Sepia and period-coloured, aged and slightly oxidised. Looks earnest but unskilled — authentic to the age of sail, but the artist is not good at drawing animals.',
  },
  {
    file: 'dragon-warning-2.png',
    prompt:
      'A naïve, awkwardly drawn sea-dragon for a 17th-century pirate map — variant pose: rearing up with mismatched wings spread, forked tongue out, worm-like lopsided body coiled awkwardly. By an amateur cartographer who has never seen a dragon. Quill pen and iron-gall ink, muted rust-red and faded green watercolour wash drifting outside the linework. Head too big, one eye larger than the other. Wrong proportions, wobbly hesitant lines. Sepia, aged, oxidised. Earnest but unskilled.',
  },
  {
    file: 'skull-warning.png',
    prompt:
      'A naïve hand-drawn skull-and-crossbones for an 18th-century pirate map, drawn by an unskilled amateur cartographer with quill pen and iron-gall ink, lightly washed with pale ochre watercolour that overruns the outlines. The skull is lopsided — eye sockets of different sizes, a crooked rectangular jaw with uneven square teeth, an asymmetric cranium. The crossed bones beneath are awkward, more like sticks than anatomical bones. Sepia and aged-yellow tones, faintly oxidised. Earnest but clumsy in execution — the period is right, the skill is not.',
  },
  {
    file: 'decor-ship.png',
    prompt:
      'A naïve hand-drawn pirate galleon in profile for an 18th-century treasure map, by an unskilled amateur cartographer. Quill pen and iron-gall ink with muted brown wood-wash and a touch of rust-red on a small skull-flag. Three masts leaning at slightly different angles, sails drawn as flat wonky rectangles with quick crosshatching, the hull a lopsided wooden shape, cannon ports as uneven black squares, rigging tangled and inconsistent. Sepia tones, watercolour spilling past the outlines. Period-authentic materials, amateur execution — the cartographer loves ships but cannot quite draw them.',
  },
  {
    file: 'sea-monster.png',
    prompt:
      'A naïve hand-drawn sea serpent for a 17th-century pirate map by an unskilled amateur cartographer. Quill pen and iron-gall ink with muted teal and sepia watercolour wash spilling outside the lines. Long noodle-like body emerging from implied water in three uneven humps, head reared up with a row of crooked triangle teeth and a single oversized googly eye. Scales suggested by quick uneven crosshatch marks. Lopsided proportions — the head too big, the humps different sizes, the teeth not in line. Period-authentic palette (sepia, muted teal, ochre), aged and slightly oxidised. Earnest but goofy — the artist has heard tales of sea monsters and is doing their best.',
  },
  {
    file: 'whale-1.png',
    prompt:
      'A naïve hand-drawn whale facing LEFT for an 18th-century pirate map, drawn in quill pen and iron-gall ink, washed with muted grey-blue watercolour that goes outside the outlines. A chunky sausage-shaped body, a wonky bowtie-shaped tail flipper, a single oversized circle for an eye, a few crooked parallel lines for the water spout. The whale looks more like a fish-sausage than a real cetacean — the amateur cartographer has heard descriptions but never seen one. Sepia and faded blue-grey palette, period-authentic but clumsily executed.',
  },
  {
    file: 'whale-2.png',
    prompt:
      'A naïve hand-drawn whale facing RIGHT for an 18th-century pirate map, drawn in quill pen and iron-gall ink, washed with muted grey-blue watercolour that goes outside the outlines. A chunky sausage-shaped body, a wonky bowtie-shaped tail flipper, a single oversized circle for an eye, a few crooked parallel lines for the water spout. The whale looks more like a fish-sausage than a real cetacean. Sepia and faded blue-grey palette, period-authentic but clumsily executed.',
  },
  {
    file: 'kraken.png',
    prompt:
      'A really badly drawn kraken for a 17th-century pirate map — embarrassingly clumsy, by an amateur cartographer who is terrible at drawing animals. Quill pen and iron-gall ink with sloppy muted purple and muddy teal watercolour splashed way outside the outlines. A lumpy potato-shaped head with two absurdly mismatched googly eyes (one tiny, one huge), a crooked beak drawn like a broken triangle, maybe one or two random jagged teeth that do not line up. Eight tentacles that look nothing alike — one is a stub, two are way too long, one bends the wrong way, tips are just messy curls. Suckers are random o-shapes placed wherever, some floating off the tentacles entirely. Wobbly hesitant quill strokes, visible ink blots, proportions completely wrong, perspective does not work. Looks pathetic and crudely drawn — earnest but genuinely bad, like a doodle by someone who heard "kraken" once and gave up halfway. NOT scary, NOT polished, NOT competent. Period sepia palette, aged and oxidised.',
  },
  {
    file: 'octopus.png',
    prompt:
      'A naïve smaller octopus for an 18th-century pirate map by an unskilled amateur cartographer. Quill pen and iron-gall ink, with muted purple-brown watercolour wash spilling outside the outlines. Roundish blob head with two asymmetric circle eyes with dots in them, eight wobbly tentacles of mismatched lengths curling in different directions, sloppy o-shapes for suckers. Period palette, sepia and muted purple. Lopsided proportions, hesitant quill linework — looks earnest but clearly drawn by someone who has only heard descriptions of octopuses.',
  },
  {
    file: 'mermaid.png',
    prompt:
      'A naïve hand-drawn classical map mermaid symbol for a 17th-century pirate chart by an unskilled amateur cartographer — the kind of decorative sea-creature figure found on old nautical maps. Quill pen and iron-gall ink, with muted skin-tone, rust-red hair and faded teal fish-tail watercolour wash spilling outside the outlines. Simple folk-art figure: head too big, dot-eyes, wonky smile, long wavy hair, a modest high-necked blouse drawn as a few quick lines, triangular fish tail with uneven scale scribbles, clumsy sausage-finger hands holding a small comb. Fully clothed, cartographic symbol only, not realistic. Period palette, aged and oxidised. Earnest but unskilled amateur cartographer execution.',
  },
  {
    file: 'storm-cloud.png',
    prompt:
      'A naïve hand-drawn storm cloud for an 18th-century pirate map by an unskilled amateur cartographer. Quill pen and iron-gall ink, washed with muted grey watercolour that drifts past the outlines, and a streak of pale ochre for the lightning. A bumpy cauliflower-like cloud shape with several lobes, a jagged zig-zag lightning bolt crackling down from the underside, and a small scowling anthropomorphic face peeking out from the cloud — in the spirit of old wind-rose decorations — with mismatched dot eyes and a wavy mouth. Period palette, aged tones. Lopsided, clumsy, hesitant lines — earnest but unskilled.',
  },
  {
    file: 'compass-rose.png',
    prompt:
      'A naïve hand-drawn compass rose for an 18th-century pirate map by an unskilled amateur cartographer. Quill pen and iron-gall ink with a touch of muted rust-red on the north point and faint ochre wash elsewhere, all going slightly outside the lines. An eight-pointed star whose points are visibly different lengths and not properly symmetrical. The cardinal letters N, Ö, S, V (Swedish, the Ö clearly has its two dots) are hand-lettered in shaky uneven capitals. A surrounding circle that is not quite round. Period palette, sepia and aged. Earnest geometry, amateur execution — the cartographer cares but is not good at drawing geometric shapes by hand.',
  },
  {
    file: 'our-ship.png',
    prompt:
      'A naïve hand-drawn pirate galleon in three-quarter profile for an 18th-century treasure map, by an unskilled amateur cartographer. Quill pen and iron-gall ink, with muted brown wood-wash, cream sails, and a touch of rust-red on a small tattered skull-flag — all watercolour drifting past the outlines. Three crooked masts of different heights, sails as wonky rectangles patched together from mismatched striped and polka-dotted cloth (each patch drawn slightly off), a curled-up bowsprit that looks more like a snail horn, square cannon ports along a lopsided hull, a tiny stick-figure female pirate in a triangle hat at the helm. Period palette, sepia and aged. The cartographer adores pirate ships but cannot quite draw them — earnest, clumsy, theatrical-costume vibe.',
  },
  {
    file: 'treasure.png',
    prompt:
      'A naïve hand-drawn small treasure island for an 18th-century pirate map by an unskilled amateur cartographer. Quill pen and iron-gall ink, with muted green for the island, ochre for the sand, and a bold rust-red for the X — watercolour wash spilling outside the outlines. A roughly potato-shaped island, a single crooked palm tree drawn as a stick with three or four leaf-blobs on top, a big lopsided dashed X scribbled across the centre, a small wonky treasure chest peeking out of the sand. Period palette, aged and slightly oxidised. The proportions are off, the X is not symmetrical — earnest but clearly unskilled.',
  },
  {
    file: 'parchment.png',
    transparent: false,
    size: [1024, 1024],
    prompt:
      'A blank seamless aged parchment paper texture — warm cream and tan tones, soft creases, faint watermarks, small ink blots, scorched and frayed edges hinted at, the kind of paper used by 17th-century cartographers. No text or illustrations, just the textured paper itself. Tileable / seamless. High resolution square image.',
  },

  // Land-route decorations (Oregon Trail–inspired, same cartographer style)
  {
    file: 'wagon.png',
    prompt:
      'A naïve hand-drawn covered wagon in Oregon Trail style for an 18th-century travel map, by an unskilled amateur cartographer. Quill pen and iron-gall ink with muted brown wood-wash and ochre canvas cover watercolour spilling outside the outlines. A crooked wooden wagon box, a bent hoop frame holding a lumpy canvas cover drawn as a few wobbly arcs, one oversized wheel bigger than the other, a single ox or horse drawn as a clumsy sausage-with-legs hitched in front. Proportions wrong, perspective broken, wheels not round. Period sepia palette, aged and oxidised. Earnest but clearly bad at drawing wagons.',
  },
  {
    file: 'robbers.png',
    prompt:
      'A naïve hand-drawn group of scary highway robbers for an 18th-century travel map, by an unskilled amateur cartographer. Quill pen and iron-gall ink with dark muted rust-red and black-brown watercolour wash spilling outside the outlines. Two or three menacing bandits in crooked tricorn hats and tattered coats, one pointing a flintlock pistol, one brandishing a crooked cutlass, shadowy scowling faces with mismatched dot-eyes and angry scribble mouths. Ominous and threatening in intent but awkwardly drawn — lopsided bodies, sausage fingers, wrong proportions. Period palette, aged and oxidised. Map decoration of dangerous robbers on the road, not heroic, not polished.',
  },
  {
    file: 'tree-1.png',
    prompt:
      'A naïve hand-drawn small deciduous grove for an 18th-century travel map by an unskilled amateur cartographer. Quill pen and iron-gall ink with muted green watercolour wash spilling outside the outlines. A cluster of four or five crooked trees grouped together — trunks of different heights and thicknesses, lumpy round canopies drawn as overlapping messy cloud shapes with a few scribbled leaf marks, some trees leaning, some canopies touching. Looks like a little patch of woodland on a map, not a single tree. Proportions off, wrong scale between trees. Period palette, sepia and muted green, aged. Isolated grove map symbol.',
  },
  {
    file: 'tree-2.png',
    prompt:
      'A naïve hand-drawn small pine or fir grove for an 18th-century travel map by an unskilled amateur cartographer. Quill pen and iron-gall ink with dark muted green watercolour spilling outside the outlines. A cluster of four or six cone-shaped evergreens grouped together — each drawn as wonky overlapping triangle layers on short crooked trunks, different heights, some taller in the middle like a little forest patch. Asymmetric group, trees overlapping and crowding each other. Period palette, aged and oxidised. Isolated conifer grove map symbol, not a single tree.',
  },
  {
    file: 'tree-3.png',
    prompt:
      'A naïve hand-drawn grove of gnarled dead trees for an 18th-century travel map by an unskilled amateur cartographer. Quill pen and iron-gall ink with pale grey-brown wash spilling outside the outlines. A spooky cluster of three or four bare twisted trunks with crooked branches sticking out at wrong angles like spider legs, no leaves, different heights, branches interlocking. A bleak little copse or dead woodland patch on the map. Ominous but clumsily drawn. Period sepia palette, aged. Isolated dead-tree grove map symbol.',
  },
  {
    file: 'village-1.png',
    prompt:
      'A naïve hand-drawn tiny village cluster for an 18th-century travel map by an unskilled amateur cartographer. Quill pen and iron-gall ink with muted brown and ochre watercolour spilling outside the outlines. Three or four crooked little houses with mismatched roof angles — some triangular, some flat — tiny square windows, one with a lopsided chimney puffing a scribble of smoke. Huddled together like a clumsy map symbol for a settlement. Wrong scale between buildings. Period palette, aged. Isolated village group only.',
  },
  {
    file: 'village-2.png',
    prompt:
      'A naïve hand-drawn small cluster of houses for an 18th-century travel map by an unskilled amateur cartographer. Quill pen and iron-gall ink with muted brown wood and dull red roof watercolour spilling outside the outlines. Five or six crooked little houses huddled close together — mismatched roof angles, some triangular some flat, tiny square windows, a few bent chimneys with scribble smoke, doors as wobbly rectangles. Different sizes and heights, potato-shaped walls, roofs not symmetrical, maybe a crooked fence or path between them. A modest hamlet or farmhouse cluster, not a single building. Period sepia palette, aged. Isolated village group map symbol.',
  },
  {
    file: 'village-3.png',
    prompt:
      'A naïve hand-drawn small hamlet with a church for an 18th-century travel map by an unskilled amateur cartographer. Quill pen and iron-gall ink with muted brown, ochre and grey watercolour spilling outside the outlines. A crooked church with a too-tall steeple and a cross on top, plus two or three tiny lopsided cottages beside it, paths drawn as wobbly dashed lines between them. Buildings different sizes with no consistent perspective. Period palette, aged and oxidised. Isolated hamlet map symbol.',
  },
  {
    file: 'stockholm-silhouette.png',
    size: [768, 768],
    prompt:
      'A naïve hand-drawn city skyline silhouette of Stockholm, Sweden, for an 18th-century travel map by an unskilled amateur cartographer — viewed from the water like an old map vignette. CRITICAL FRAMING: the ENTIRE skyline must fit fully inside the image with generous empty margin on all four sides — at least 15% padding top, bottom, left and right. Nothing cropped, clipped or cut off at any edge. The silhouette is scaled smaller and centered in the frame with plenty of breathing room. Dark sepia and iron-gall ink filled silhouette shapes with wobbly hesitant outlines. Recognisable but clumsily drawn landmarks: the tall tower of Stockholm City Hall (Stadshuset) with its spire, the needle spire of Riddarholmen Church, the Royal Palace roofline, several mismatched church spires and rooftops of varying heights, maybe a crooked bridge or waterfront quay line along the bottom. Buildings are lumpy connected shapes — wrong proportions, some towers too fat or too thin. Period palette, aged dark brown silhouette with faint ochre wash. Horizontal skyline profile, wider than tall but compact enough to fit entirely within the canvas. Map decoration, not photorealistic.',
  },
  {
    file: 'sodertalje-silhouette.png',
    size: [768, 512],
    prompt:
      'A naïve hand-drawn city skyline silhouette of Södertälje, Sweden, for an 18th-century travel map by an unskilled amateur cartographer — viewed from the canal/waterfront like an old map vignette. Dark sepia and iron-gall ink filled silhouette shapes with wobbly hesitant outlines. A smaller waterfront town: crooked church spires, low lopsided warehouse and house rooftops along a canal, maybe lock gates or a bridge drawn as clumsy rectangles, a few masts or chimneys poking up at wrong angles. The Södertälje canal cutting through suggested by a wavy water line at the base. Buildings connected as one lumpy silhouette — wrong scale, amateur execution. Period palette, aged dark brown with faint ochre wash. Horizontal skyline profile, wider than tall. Map decoration for a Swedish town, not photorealistic.',
  },
  {
    file: 'globen.png',
    prompt:
      'A naïve hand-drawn sketch of Globen (the Ericsson Globe arena) in Stockholm, Sweden, for an 18th-century travel map by an unskilled amateur cartographer who has heard of this strange round building but cannot draw it well. Quill pen and iron-gall ink with muted grey-brown watercolour wash spilling outside the outlines. A large lopsided sphere or dome — not quite round, more potato-shaped or egg-shaped — with wobbly horizontal panel lines drawn unevenly around it, a crooked cylindrical base or pedestal underneath drawn too short, maybe a tiny stick-figure flag or antenna poking off at a wrong angle. The proportions are all wrong, perspective broken, the globe leans slightly. Looks earnest but clumsy — like a mapmaker trying to sketch a mysterious round landmark. CRITICAL FRAMING: entire building fits inside the image with generous margin on all sides, nothing cropped. Period sepia palette, aged and oxidised. Isolated landmark only.',
  },
  {
    file: 'arrow-down.png',
    size: [128, 256],
    prompt:
      'A naïve hand-drawn downward-pointing arrow for an 18th-century pirate or travel map, by an unskilled amateur cartographer. Quill pen and iron-gall ink outline with bold muted rust-red watercolour fill that spills slightly outside the wobbly lines. A simple map pointer: short vertical shaft, triangular arrowhead at the bottom pointing straight down — the tip must clearly aim downward. Lines hesitant and uneven, shaft slightly crooked, arrowhead lopsided or asymmetric. Bright enough red to read as a red arrow on a map, but aged and oxidised like period ink — not neon, not digital. Vertical composition, taller than wide. Isolated arrow symbol only, generous transparent margin around it.',
  },
  {
    file: 'harbor-dock-ne.png',
    prompt:
      'A naïve hand-drawn harbor map symbol for an 18th-century pirate or travel chart, by an unskilled amateur cartographer. Top-down bird\'s-eye map view. CRITICAL LAYOUT — compass orientation: the WATER occupies the NORTHEAST side of the image (upper-right quadrant) as a sheltered bay or cove in muted faded teal watercolour wash. The LAND and settlement sit on the southwest / lower-left side — rocky ochre shoreline separating land from water. CRITICAL — HARBOR HOUSES: three or four small crooked harbor cottages and sheds clustered on the land near the shore — mismatched roof angles, tiny square windows, one or two with a bent chimney, simple fisherman\'s huts and storehouses in sepia and muted brown, drawn clumsily at different sizes. CRITICAL — DOCK: a wooden pier extends from the shoreline INTO the northeast water — brown plank decking on crooked pilings, clearly angled toward the northeast (upper-right), getting longer as it reaches into the teal bay. Maybe one tiny moored boat beside the dock. Quill pen and iron-gall ink, watercolour spilling outside outlines. Period palette only. Earnest but unskilled execution. CRITICAL TRANSPARENCY: PNG cutout with full alpha transparency on all sides — transparent pixels surround the harbor on every edge with generous margin. No parchment sheet, no paper texture, no cream or beige background fill, no vignette, no drop shadow on a backdrop. The harbor (houses, shore, dock, and its small NE bay only) is ONE isolated map sticker — nothing outside that shape. No full map sheet, no compass rose, no text labels.',
  },
  {
    file: 'pirate-ogre.png',
    prompt:
      'A naïve hand-drawn pirate ogre for an 18th-century pirate map by an unskilled amateur cartographer who has heard tall tales of brutish sea monsters that walk on two legs. Quill pen and iron-gall ink with muted green-grey skin wash and rust-red pirate coat watercolour spilling outside the wobbly outlines. A hulking lumpy humanoid — potato-shaped head too big for the body, one tusk sticking out at a wrong angle, mismatched googly eyes (one tiny, one huge), a crooked scowling mouth with two or three uneven square teeth. Wearing a clumsily drawn tricorn hat tilted sideways, a tattered frock coat with mismatched brass buttons, one oversized boot and one stubby foot, a bent cutlass held in a sausage-finger hand. Arms too long, legs too short, shoulders uneven. Menacing in intent but awkwardly drawn — proportions completely wrong, perspective broken, hesitant quill strokes with visible ink blots. Period sepia and muted green palette, aged and oxidised. Map decoration of a fearsome pirate ogre, not polished, not scary-realistic. Isolated figure only.',
  },
]

function buildFullPrompt(prompt, transparent) {
  return transparent
    ? `${prompt} ${STYLE} ${TRANSPARENT} ${NEG}`
    : `${prompt} ${STYLE} ${NEG}`
}

async function generateImageWithApi(fullPrompt, transparent = true, retries = 3) {
  const body = {
    model: 'gpt-image-1',
    prompt: fullPrompt,
    n: 1,
    size: '1024x1024',
    output_format: 'png',
  }
  if (transparent) body.background = 'transparent'

  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
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
}

async function generateImageWithCodexBackend(fullPrompt, transparent = true) {
  return generateImageWithCodex({
    prompt: fullPrompt,
    size: '1024x1024',
    outputFormat: 'png',
    // Codex image model rejects background: transparent — rely on TRANSPARENT prompt block.
    ...(transparent ? {} : { background: 'opaque' }),
  })
}

async function resolveBackend() {
  if (USE_API_KEY) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('MAP_ASSETS_USE_API_KEY=1 but OPENAI_API_KEY is not set')
    }
    return { name: 'openai-api', generate: generateImageWithApi }
  }

  if (await hasCodexSubscriptionAuth()) {
    return { name: 'codex-subscription', generate: generateImageWithCodexBackend }
  }

  throw new Error(
    'No Codex subscription auth found (~/.codex/auth.json). Run `codex login` with your ChatGPT account, or set MAP_ASSETS_USE_API_KEY=1 with OPENAI_API_KEY.',
  )
}

async function main() {
  const backend = await resolveBackend()

  await mkdir(OUT_DIR, { recursive: true })

  const only = process.argv.slice(2)
  const queue = only.length
    ? ASSETS.filter((a) => only.some((f) => a.file.startsWith(f.replace(/\.png$/, ''))))
    : ASSETS

  if (!queue.length) {
    console.error('No matching assets. Available:', ASSETS.map((a) => a.file).join(', '))
    process.exit(1)
  }

  console.log(`Backend: ${backend.name}`)
  console.log(`Generating ${queue.length} image(s) → ${OUT_DIR}\n`)

  for (const asset of queue) {
    const outPath = join(OUT_DIR, asset.file)
    if (process.env.SKIP_EXISTING === '1') {
      try {
        const { access } = await import('node:fs/promises')
        await access(outPath)
        console.log(`⏭  skip (exists): ${asset.file}`)
        continue
      } catch {
        /* generate */
      }
    }

    const output = assetOutput(asset)
    const fullPrompt = buildFullPrompt(asset.prompt, output.transparent)

    process.stdout.write(`🎨 ${asset.file} … `)
    const start = Date.now()
    try {
      const raw = await backend.generate(fullPrompt, output.transparent)
      const rawKb = (raw.length / 1024).toFixed(0)
      const png = await optimizeMapPng(raw, output)
      const mode = output.transparent ? 'RGBA' : 'RGB'
      process.stdout.write(
        `finalized ${rawKb}→${(png.length / 1024).toFixed(0)} KB (${output.width}×${output.height} ${mode}) … `,
      )
      await writeFile(outPath, png)
      console.log(`done (${((Date.now() - start) / 1000).toFixed(1)}s, ${(png.length / 1024).toFixed(0)} KB)`)
    } catch (err) {
      console.log('FAILED')
      console.error(`   ${err.message}`)
      process.exitCode = 1
    }
  }

  console.log('\nFinished.')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
