#!/usr/bin/env node
/**
 * Batch-generate vintage pirate portraits from original photos.
 * Style per aesthetic-style-guide.md → images/portraits-generated/
 *
 * Default backend: ChatGPT subscription via Codex OAuth (`codex login`).
 * Optional API billing: PORTRAIT_USE_API_KEY=1 (requires OPENAI_API_KEY).
 *
 * Input:  images/portraits-originals/<name>.{jpg,jpeg,png}
 * Output: images/portraits-generated/<name>.jpg (first run)
 *         images/portraits-generated/<name>-v2.jpg, -v3.jpg, … (redos — never overwrites)
 *
 * Copy a chosen version to public/images/portraits/<id>.jpg for production use.
 *
 * Facial expression (default: vary for theatrical pose/gaze):
 *   images/portraits-originals/keep-expression.txt — stems that always keep expression
 *   --keep-expression                                — keep expression for all in this run
 *   --keep-expression navid josefin                  — keep expression for named stems
 *   --no-keep-expression                             — ignore keep-expression.txt for this run
 *
 * Usage:
 *   node scripts/generate-portraits.js              # all originals
 *   node scripts/generate-portraits.js navid       # filter by basename prefix
 *   node scripts/generate-portraits.js --keep-expression navid
 *   node scripts/generate-portraits.js --no-keep-expression navid
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
const IN_DIR = join(__dirname, '..', 'images', 'portraits-originals')
const OUT_DIR = join(__dirname, '..', 'images', 'portraits-generated')
const KEEP_EXPRESSION_FILE = join(IN_DIR, 'keep-expression.txt')

const INPUT_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const USE_API_KEY = process.env.PORTRAIT_USE_API_KEY === '1'

// aesthetic-style-guide.md — fixed series baseline (production flavour varies per portrait)
const STYLE = `Vintage pirate romanticism in the Svarta Malin style. 18th-century pirate world seen through vintage portraiture — theatrical, adventurous, faintly melancholic. Weathered, aged, nostalgic. Soft diffused lighting, shallow depth of field, blurred background. NOT modern clothing, NOT bright saturated colors, NOT clean digital look, NOT neon, NOT glossy CGI, NOT hyperrealistic, NOT slick modern fashion photography.`

const AMATEUR = `AMATEUR EXECUTION — PREFER HOMEMAKE: Obvious stage costume, painted flat backdrops, cheap party-shop props, hammy poses, thrift-store fabrics, glue-gun trim, uneven stitching. Village-hall panto or community-play energy over slick studio polish. Charming, camp, slightly clumsy — never expensive-looking or professionally art-directed.`

const LIKENESS = `HIGHEST PRIORITY — FACIAL IDENTITY: This must be unmistakably the same individual as in the input photo. Preserve bone structure, jawline, cheekbones, nose shape, eye shape and spacing, ears, hairline, skin tone, age, and distinctive features (moles, scars, dimples, facial hair pattern). Do NOT invent a new face, do NOT beautify into a different person, do NOT swap gender or ethnicity, do NOT age up or down significantly. The person must remain recognisable — but facial expression may change unless explicitly told to preserve it.`

const KEEP_EXPRESSION = `FACIAL EXPRESSION — PRESERVE FROM SOURCE: Keep the exact expression from the input photo. Same smile or neutral mouth, same teeth visibility, same eye openness, same eyebrow position, same cheek tension, and same emotional tone. Do NOT invent a smirk, frown, dramatic stare, or any new expression. The person should look like themselves in the original photo, just in pirate costume.`

const VARY_EXPRESSION = `FACIAL EXPRESSION — CHANGE FOR THEATRE: Do NOT copy the exact smile, mouth, or emotional tone from the source photo. Adapt expression to match the dramatic pirate pose and gaze — hammy smirk, bold stare, theatrical melancholy, confident grin, or narrowed dramatic eyes are all fine. Same person, new expression.`

const NEG_KEEP_EXPRESSION = `No changed smile, no new expression, no invented smirk or frown, no different mouth shape, no eyes narrowed or widened versus the source photo.`

const NEG_VARY_EXPRESSION = `No frozen copy of the source photo's exact smile or mouth, no identical candid snapshot expression.`

const BODY = `BODY & POSTURE: Give them a reasonably nice, flattering body — fit, healthy, and attractive in a natural way. Confident upright posture, good shoulders, a physique that reads as capable and appealing without being exaggerated. Gentle flattering interpretation is fine (slimmer, more toned, better posture than a casual snapshot) but stay plausible for this person — not a different body type, not cartoon muscles, not glamour-model unrealistic. Costume can be adjusted to fit and flatter.`

const WOMEN = `WOMEN — BADASS AND SEXY: If the subject is a woman, she must read as a dangerous, self-assured pirate captain — fierce, capable, and commanding, not a passive pin-up. Sexy through swagger, confidence, and attitude: strong stance, direct or sidelong power gaze, props held with intent. Alluring and formidable; hot because she looks like she could take the ship, not because she is merely decorative or posed for the male gaze.`

const NEG = `No different person, no face swap, no generic model face, no altered bone structure, no changed nose or eyes, no beautification that changes identity, no unflattering slouch, no awkward or dumpy posture, no exaggerated bodybuilder physique, no documentary historical reenactment, no museum-quality tailoring, no real weapons, no leather that looks genuinely aged, no expensive modern cosplay, no modern digital blockbuster polish, no modern clothing, no bright saturated colors, no clean digital look, no neon, no glossy CGI, no hyperrealistic skin, no safety pins, no glitter makeup, no rhinestones or crystals on the face, no face gems or stick-on jewels around the eyes, no modern party makeup, no festival rave makeup, no sparkly eye accents, no crooked or askew headwear, no ill-fitting hats, no oversized floppy hats, no hat sliding over the eyes or face, no poorly worn or lopsided headwear, no Pirates of the Caribbean look, no Disney pirate aesthetic, no Jack Sparrow influence, no Johnny Depp ragged dreadlocks-and-beads cosplay, no PotC blockbuster Caribbean pirate movie style, no passive pin-up, no cheesecake pose, no boudoir damsel, no text, no watermark text, no border frame, no playing card overlay.`

/** Low-weight media pick — triggers HAND_DRAWN branch in buildPrompt(). */
const HAND_DRAWN_MEDIA =
  'sepia charcoal and graphite hand-drawn portrait sketch on aged parchment — visible pencil strokes and soft illustrative shading, 18th-century historical illustration, NOT a photograph'

const HAND_DRAWN = `HAND-DRAWN ILLUSTRATION (NOT PHOTOGRAPHY): Render as a monochromatic sepia charcoal/graphite sketch on textured aged parchment — visible hand-drawn strokes, soft blended shading, illustrative rather than photographic. Weathered fibrous paper with darkened edges and a natural vignette. Drawing-medium texture only: charcoal dust, paper tooth, graphite hatch marks. Looks like an 18th–19th century historical portrait illustration or period concept-art sketch — earnest, theatrical, slightly amateur — never a camera capture.`

const NEG_HAND_DRAWN = `No photograph, no camera realism, no photographic depth of field, no lens blur, no wet-plate photo texture, no tintype photographic finish, no studio photography look, no film grain from a camera.`

const HAND_DRAWN_TREATMENT = [
  'visible charcoal and graphite pencil strokes',
  'soft blended conté-crayon shading on rough paper',
  'fibrous aged parchment tooth texture',
  'weathered darkened paper edges like a stored folio page',
  'light charcoal smudging and finger-blend marks',
  'subtle crosshatch shading on costume folds',
  'sepia wash over pencil linework',
  'soft vignette from foxed parchment ageing',
]

const HAND_DRAWN_LIGHTING =
  'soft tonal shading implied by charcoal hatching and crosshatch — illustrative, not photographic studio light'

const HAND_DRAWN_BACKGROUND =
  'neutral aged parchment ground with paper texture only — no painted scenery, no photographic backdrop'

/** Repeat items to increase random pick weight. */
function repeat(items, times = 2) {
  return items.flatMap((item) => Array(times).fill(item))
}

/** Inclusive range for pools that pick multiple distinct items per portrait. */
const MULTI_PICK = [1, 4]

/**
 * Attribute pools — aesthetic-style-guide.md.
 * Amateur-leaning entries are repeated so they win the random shuffle more often.
 */
const ATTRIBUTES = {
  era: {
    count: 1,
    pool: [
      '1930s publicity still, weathered and nostalgic',
      'silent-era matinee-idol studio portrait',
      'interwar tabloid glamour photograph',
      '18th-century pirate world through a 1920s studio photographer\'s lens',
      'vintage Hollywood cigarette-card era',
      'aged pre-war studio publicity portrait',
      '1920s–30s Hollywood studio glamour',
      'antique wet-plate era, chemical stains and soft focus',
      'hand-coloured engraving portrait period',
      'Lotería folk-card illustration era',
      'daguerreotype revival, tarnished silver plate',
      'gothic-romantic Victorian carte de visite mood',
    ],
  },
  production: {
    count: 1,
    pool: repeat([
      'enthusiastic dress-up at a village-hall pirate panto',
      'community-play cast portrait, hammy and endearing',
      'amateur dramatics society publicity still',
      'local theatre dress rehearsal snapshot',
      'church-hall variety-show costume, camp and homemade',
      'school production pirate kit, charmingly improvised',
      'thrift-store costume assembled the night before',
      'hand-sewn stage costume, slightly over-the-top, not 100% polished',
      'theatrical dress-up — charming disguise, not perfect reconstruction',
      'painted-canvas backdrops and obvious stage props',
      'stage costume and theatrical props rather than historically accurate gear',
      'handmade, staged and slightly imperfect',
      'enthusiastic amateur theatre, never slick or expensive-looking',
      'last-minute costume night before the show',
      'obviously fake pirate gear from a fancy-dress box',
    ], 3),
  },
  aesthetic: {
    count: 1,
    pool: [
      ...repeat([
        'theatrical "dress-up" feel with painted stage backdrops',
        'Lotería-card folk-art pirate illustration feel',
        'collectable vintage cigarette-card chromolithograph mood',
        'handmade, staged and slightly imperfect',
        'vintage pirate romanticism, theatrical and adventurous',
        'bohemian folkloric smuggler charm',
      ], 3),
      'faintly melancholic nostalgic smuggler romance',
      'confident, alluring silent-film pirate star',
      'gothic-romantic pirate portrait',
      'antique hand-coloured engraving atmosphere',
      'weathered matinee-poster romanticism',
      'dramatic studio portrait, gaze to camera or to the side',
    ],
  },
  media: {
    count: 1,
    pool: [
      ...repeat([
        'weathered sepia photo from a community theatre dress rehearsal',
        'aged sepia cabinet card from a local play publicity shoot',
        'antique wet-plate tintype photograph',
        'modern tintype-style photograph',
        'faded hand-tinted photographic portrait',
        'vintage cigarette card chromolithograph portrait',
        'hand-coloured copper engraving portrait',
        'antique photographic print with visible plate texture',
        'vintage collectable playing-card portrait illustration',
      ], 2),
      'aged sepia cabinet card',
      'daguerreotype-style portrait with tarnished silver-plate finish',
      '1920s Hollywood studio glamour publicity still',
      'weathered sepia studio portrait with soft vignette',
      // Low chance (~1/23): hand-drawn sketch branch (see HAND_DRAWN_MEDIA)
      HAND_DRAWN_MEDIA,
    ],
  },
  mood: {
    count: 1,
    pool: [
      ...repeat(['playful camp swagger', 'hammy and endearing', 'theatrical and adventurous'], 3),
      'faintly melancholic and nostalgic',
      'bold, confident and alluring',
      'fierce badass swagger — sexy and dangerous',
      'commanding pirate-captain energy, alluring but lethal',
      'wistful romantic yearning for the open sea',
      'mischievous smuggler bravado',
      'gothic-romantic brooding',
      'bohemian folkloric charm',
      'dramatic and self-assured',
      'weathered nostalgic romance',
      'self-possessed femme fatale of the high seas',
    ],
  },
  treatment: {
    count: MULTI_PICK,
    pool: [
      'visible film grain',
      'fine scratches across the surface',
      'faint watermark stain',
      'soft vignette darkening the corners',
      'slightly faded and tarnished tones',
      'dust specks and age spots',
      'wet-plate / tintype chemical texture',
      'antique-plate oxidation and patina',
      'uneven chemical staining like a wet-plate accident',
      'light leak along one edge',
      'soft focus falloff at the edges',
      'creased paper texture as if stored in a trunk',
      'mild silvering on dark areas like old tintype',
    ],
  },
  palette: {
    count: 1,
    pool: [
      'warm sepia and chocolate brown',
      'black-and-white with cream highlights',
      'sepia / warm brown / black-and-white tones',
      'muted sepia with a touch of faded gold',
      'oxidised brown tones with pale cream accents',
      'weathered monochrome with rust-brown shadows',
      'aged ivory and umber, lightly sun-bleached',
      'limited bold palette accents — cream, gold and muted rust on sepia base',
    ],
  },
  framing: {
    count: 1,
    pool: [
      'half-length portrait showing a flattering torso',
      'three-quarter-length portrait with confident stance',
      'half-length portrait, shoulders back, posture proud',
      'bust portrait with dramatic collar and shoulders',
      'half- or three-quarter-length portrait, dramatic pose',
    ],
  },
  hat: {
    count: 1,
    pool: [
      'no hat — bare head, natural hair visible',
      'no hat — hair jewelry',
      'soft wide-brimmed tricorn with white skull-and-crossbones, worn level and fitted',
      ...repeat([
        'theatrical tricorn with painted skull-and-crossbones, worn square on the head',
        'feathered costume tricorn from a party shop, properly seated',
        'felt tricorn with skull emblem, fitted and level',
        'bandana beneath a tricorn, both worn neatly',
        'classic pirate tricorn with gold braid trim, well fitted',
      ], 2),
      'small cocked tricorn at a classic period angle, worn properly',
      'polka-dot or striped bandana tied pirate-style, no hat',
      'headscarf wrapped neatly pirate-style, no hat',
    ],
  },
  exposure: {
    count: 1,
    pool: [
      'standard costume coverage',
      'sleeveless vest or open waistcoat, bare arms visible',
      'open shirt collar with chest partly visible under a loose vest',
      'off-one-shoulder blouse or sash, one bare shoulder',
      'low neckline showing collarbone and upper chest',
      'vest worn open over bare chest, theatrical and tasteful',
      'rolled-up sleeves exposing forearms',
      'open frock coat over bare arms and an unlaced pirate shirt',
      '1920s glamour portrait with bare shoulders',
      'pirate shirt unlaced at the top, sternum and shoulders visible',
      'wet-shirt effect over the torso, vintage glamour, not explicit',
      'open waistcoat and loosened sash, midriff hinted at below the ribs',
      'one shoulder bare beneath a slipping coat or shawl',
    ],
  },
  pose: {
    count: 1,
    pool: [
      ...repeat([
        'leaning slightly forward as if addressing the audience',
        'one hand on hip, chin lifted theatrically',
        'one elbow resting on an imaginary barrel, swaggering',
        'bare arms visible, hands on hips in a swaggering stance',
      ], 2),
      'arms crossed, cutlass or prop held across the chest',
      'turned three-quarters with coat tails or sash swinging',
      'standing tall, coat open to show costume layers beneath',
      'one hand resting on belt or sash, chin lifted with swagger',
      'dramatic pose, studio portrait stance',
      'boot on a crate, chin up — captain of the ship',
      'flintlock or cutlass raised with authority, not coy',
      'weight on one hip, defiant power stance',
      // Inspiration: Female Pirates History, Penzance, Hollywood pins
      'arm extended forward, flintlock aimed toward camera — bold Bonny-style swagger',
      'seated on a crate or barrel, one booted leg raised, pistol resting across the knee',
      'crouching playfully beside a treasure-chest prop, one knee up, pistol in hand',
      'holding a long ostrich-feather prop aloft in one hand, other hand on hip',
      'leaning against a rocky prop or post, shoulders relaxed, contemplative pin-up lean',
      'sitting with pistol held loosely over one knee, layered coats, tintype captain pose',
      'stately captain pose — hands resting forward on belt or sword hilt, commanding',
      'one arm extended opera-style as if addressing the crew, Penzance theatrical flourish',
      'wide stance with coiled rope at feet, cutlass raised in a dramatic arc',
      'skull-and-crossbones flag draped over one shoulder, chin lifted proudly',
      'kneeling on one knee beside a treasure chest, cutlass resting on the ground',
      'seated on edge of prop crate, elbow on knee, pistol dangling from relaxed hand',
      'back foot planted, cutlass pointed down at side, weight forward — duelist stance',
      'turning over the shoulder, sash and coat tails caught mid-swing',
      'pistol held up near cheek or chin, silent-film villain flair',
      'both hands on sword hilt, blade tip resting on the ground between boots',
      'reaching one hand toward camera as if offering a compass or map scroll',
      'perched on a barrel rim, legs apart, cutlass across the thighs',
    ],
  },
  gaze: {
    count: 1,
    pool: [
      'confident gaze straight into the camera',
      'dramatic gaze to the side',
      'wistful gaze over the shoulder toward distant sea',
      'bold stare with a faint smirk',
      'sidelong conspiratorial glance',
      'defiant chin-up stare into the middle distance',
      'silent-film star gaze, soft and direct',
    ],
  },
  lighting: {
    count: 1,
    pool: [
      ...repeat([
        'flat even front light like an old photo booth',
        'flat even front light like a village-hall photo booth',
        'backlit haze as if near a painted sunset backdrop',
        'harsh overhead hall light with flat shadows',
        'single bare bulb rehearsal lighting',
      ], 3),
      'soft diffused studio light',
      '1920s Hollywood studio soft-box glamour lighting',
      'warm natural sunlight against a rocky coastline',
      'moody side-lit with shallow depth of field',
      'gentle Rembrandt lighting with soft shadows',
      'overcast coastal daylight, soft and grey',
      'muted interwar studio key light with feathered shadows',
    ],
  },
  costume: {
    count: MULTI_PICK,
    pool: [
      ...repeat([
        'oversized thrifted frock coat with gold braid and soutache trim',
        'striped polyester pirate sash tied at the hip',
        'polka-dot bandana tied at the neck',
        'feather boa from a party shop draped over one shoulder',
        'high-collared blouse with lace trim',
        'patched velvet waistcoat',
        'striped knit sweater repurposed as a pirate shirt',
        'gold galon trim on lapels',
        'mismatched brass buttons on a charity-shop coat',
        'hand-sewn coat with uneven stitching and glue-gun trim',
        'striped fabrics and theatrical sash, clearly costume not authentic',
        'lace cuffs sewn on at the last minute',
        'obviously polyester fabric from a bargain bin',
        'costume coat with spray-painted gold trim',
      ], 2),
      // Inspiration: engraving, Penzance, Hollywood pins, gothic tintype
      'emerald-green open stage coat over bare chest or striped top',
      'bright rust-red or orange theatrical trousers or breeches',
      'cream ruffled blouse with red-and-blue striped hem — Penzance opera',
      'military-style costume jacket with fake gold epaulettes',
      'pleated cream skirt-panel or kilt over striped trousers — comic opera',
      'striped sleeveless tank top, 1920s Hollywood pin-up pirate',
      'studded faux-leather wrist cuff or wide bracelet',
      'striped shorts with one high boot, playful shore-raid pin-up',
      'fringed sash over bold striped trousers',
      'high-collared gothic velvet coat with tassel or cord trim',
      'vivid red stage coat with gold braid and soutache — Pirate King flair',
      'white shoulder sash or baldric over a dark coat',
      'layered worn frock coats, thrift-store captain look',
      'tailored jacket with oversized lace collar and dark neck scarf',
      'red coat with sleeves rolled up, white cuffs exposed',
      'open frock coat in green or red, swaggering theatrical layers',
      'dark cravat or long neck scarf knotted at the throat',
      'striped open blouse with several arm bangles',
      'ornamented dark coat with metallic braid and galon — Defina studio glamour',
      'striped open blouse with hoop earrings and dark sash — vintage pin-up layers',
      'light pleated opera skirt-panel with weapon belt over breeches',
      'fur or faux-fur mantle draped over one shoulder',
      'off-the-shoulder striped peasant blouse with loose sash',
      'high-waisted striped breeches with wide leather belt',
      'cream poet shirt with billowing sleeves under a short waistcoat',
    ],
  },
  props: {
    count: MULTI_PICK,
    pool: [
      ...repeat([
        'obviously theatrical flintlock pistol tucked in the sash',
        'rubber or foam cutlass with peeling gold spray-paint',
        'tacky plastic bangles and costume jewellery',
        'coiled rope that reads as a stage prop',
        'cardboard treasure-map prop peeking from a pocket',
        'felt eyepatch on elastic string',
        'plastic parrot clipped to the shoulder',
        'miniature painted treasure chest prop',
        'chunky wooden prop compass on a string',
        'beaded necklace from a craft box',
        'spray-painted foam dagger in a cardboard holster',
        'cheap costume-shop hoop earrings',
      ], 2),
      // Inspiration: engraving, Penzance, pins, opera stills
      'second foam flintlock tucked in belt — dual-pistol swagger',
      'foam boarding axe or hatchet at the hip',
      'curved cutlass raised in one hand, theatrical arc',
      'black skull-and-crossbones flag draped over shoulder',
      'stage sword or rapier at the belt, opera pirate',
      'coiled rope held in one hand or piled at feet',
      'open treasure chest prop with fake gold coins spilling out',
      'flintlock extended at arm\'s length, aimed forward',
      'flintlock resting across lap or knee',
      'flintlock held near cheek, dramatic silent-film menace',
      'long ostrich-feather prop held aloft',
      'rolled parchment map scroll in one hand',
      'brass spyglass tucked in sash or held to eye',
      'rum bottle or tankard as tavern prop',
      'hook-hand glove prop, foam and painted gold',
      'large hoop earring catching the light — held or worn',
      'pearl or cord necklaces layered over the costume',
      'studded leather belt with oversized buckle and holster',
      'crossed cutlasses on the wall behind — or one held, one sheathed',
      'ship\'s wheel prop gripped with both hands',
      'lantern or candle prop casting warm glow',
      'speaking-trumpet or megaphone — comic captain',
      'treasure map spread across a barrel top',
      'musket-style long prop gun slung over shoulder',
      'decorative dagger in boot top',
    ],
  },
  accessories: {
    count: 1,
    pool: [
      'bohemian smudged kohl eyeliner and theatrical rouge — matte, no glitter',
      'folk-costume beaded earrings and smuggler jewellery',
      'gothic-romantic dark lipstick and a beauty mark',
      'minimal makeup — exaggerated stage eyebrows only',
      'smoky eyes and a single beauty spot, silent-film style — matte period makeup',
      '1920s studio glamour makeup, soft and period — no sparkle',
      'theatrical rouge and powder, old-fashioned stage makeup only',
      'subtle sepia-toned period makeup, natural skin texture visible',
    ],
  },
  background: {
    count: 1,
    pool: [
      ...repeat([
        'painted canvas stage backdrop of a wobbly ship with visible brush strokes',
        'flat painted cloth backdrop of a rocky coastline, clearly a theatre set',
        'wrinkled dark theatrical curtain with cheap gold fleck paint',
        'painted flat scenery of a harbour — perspective slightly wrong, charmingly fake',
        'painted drop cloth of a tavern interior with crooked doorframe',
        'flat scenery of tall ship rigging and sails — ropes drawn too thick',
        'misted grey sea and cliffs painted on a single flat panel',
        'rough canvas cyclorama with a hand-painted sunset',
        'painted palm trees and beach, obviously a summer-panto set',
      ], 3),
      'aged sepia studio backdrop with creases and water stains',
      '1920s studio backdrop, softly blurred mottled grey',
      'natural sunlight against rocky coastline, out of focus',
    ],
  },
}

/** Resolve a fixed count or inclusive [min, max] range. */
function pickCount(count) {
  if (Array.isArray(count)) {
    const [min, max] = count
    return min + Math.floor(Math.random() * (max - min + 1))
  }
  return count
}

/** Pick `count` random distinct items from a pool. */
function pickRandom(pool, count) {
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, Math.min(count, pool.length))
}

/** Build one variation: random picks across all attribute pools. */
function buildVariation() {
  const picks = {}
  for (const [key, { pool, count }] of Object.entries(ATTRIBUTES)) {
    picks[key] = pickRandom(pool, pickCount(count))
  }
  return { picks }
}

function joinList(items) {
  return items.join('; ')
}

function isHandDrawnMedia(media) {
  return media === HAND_DRAWN_MEDIA
}

function variationSummary(picks, keepExpression) {
  const short = (key) => picks[key][0]?.split(/[,.]/)[0].slice(0, 26) ?? key
  const parts = [
    isHandDrawnMedia(picks.media[0]) ? 'charcoal sketch' : short('era'),
    short('production'),
    short('hat'),
  ]
  if (keepExpression) parts.push('keep expr')
  return parts.join(' · ')
}

function buildPrompt(stem, version, { keepExpression = false } = {}) {
  const { picks } = buildVariation()
  const [era] = picks.era
  const [production] = picks.production
  const [aesthetic] = picks.aesthetic
  const [media] = picks.media
  const [mood] = picks.mood
  const [palette] = picks.palette
  const [framing] = picks.framing
  const [pose] = keepExpression
    ? ['same head angle and facial expression as the source photo; body may shift slightly for costume']
    : picks.pose
  const [gaze] = keepExpression
    ? ['exact same facial expression as the input photo — unchanged smile, mouth, and eyes']
    : picks.gaze
  const [lighting] = picks.lighting
  const [accessories] = picks.accessories
  const [background] = picks.background
  const handDrawn = isHandDrawnMedia(media)
  const treatment = handDrawn
    ? pickRandom(HAND_DRAWN_TREATMENT, pickCount(MULTI_PICK))
    : picks.treatment

  const subject = `Transform this photograph into a vintage Svarta Malin pirate portrait. The input photo is the identity reference — preserve who this person is, not necessarily their exact candid expression. Portrait orientation, aspect ratio 63:88 (standard playing card proportions), vertical composition.

Era and filter: ${era}. Production context: ${production}. Overall aesthetic: ${aesthetic}, ${mood}.

Render as a ${media} of the same person. Colour palette: ${palette}. Surface treatment: ${joinList(treatment)}. ${framing}, ${pose}, ${gaze}. ${handDrawn ? HAND_DRAWN_LIGHTING : lighting}. Headwear: ${joinList(picks.hat)}. Skin and coverage: ${joinList(picks.exposure)}. Costume layers: ${joinList(picks.costume)}. Props and held items: ${joinList(picks.props)} — props read as costume accessories, not real weapons. Makeup and accessories: ${accessories}. Background: ${handDrawn ? HAND_DRAWN_BACKGROUND : background}. The face stays faithful to the source photo.`

  const blocks = [LIKENESS]
  if (keepExpression) {
    blocks.push(KEEP_EXPRESSION, NEG_KEEP_EXPRESSION)
  } else {
    blocks.push(VARY_EXPRESSION, NEG_VARY_EXPRESSION)
  }
  blocks.push(BODY, WOMEN, AMATEUR, subject)
  if (handDrawn) {
    blocks.push(HAND_DRAWN, NEG_HAND_DRAWN)
  } else {
    blocks.push(STYLE)
  }
  blocks.push(NEG)

  return { prompt: blocks.join(' '), summary: variationSummary(picks, keepExpression) }
}

function normalizeStem(name) {
  return name.replace(/\.(jpe?g|png|webp)$/i, '')
}

/** @returns {{ filters: string[], keepExpressionStems: Set<string>, keepExpressionAll: boolean, noKeepExpression: boolean }} */
function parseArgs(argv) {
  const filters = []
  const keepExpressionStems = new Set()
  let keepExpressionAll = false
  let noKeepExpression = false

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--no-keep-expression' || arg === '--vary-expression') {
      noKeepExpression = true
      continue
    }
    if (arg === '--keep-expression' || arg === '-k') {
      if (i + 1 >= argv.length || argv[i + 1].startsWith('-')) {
        keepExpressionAll = true
      } else {
        i++
        while (i < argv.length && !argv[i].startsWith('-')) {
          keepExpressionStems.add(normalizeStem(argv[i]))
          i++
        }
        i--
      }
      continue
    }
    filters.push(arg)
  }

  return { filters, keepExpressionStems, keepExpressionAll, noKeepExpression }
}

async function loadKeepExpressionFile() {
  try {
    const text = await readFile(KEEP_EXPRESSION_FILE, 'utf8')
    return new Set(
      text
        .split('\n')
        .map((line) => line.replace(/#.*$/, '').trim())
        .filter(Boolean)
        .map(normalizeStem),
    )
  } catch {
    return new Set()
  }
}

function shouldKeepExpression(stem, { fileStems, cliStems, cliAll, noKeepExpression }) {
  if (noKeepExpression) return false
  if (cliStems.has(stem)) return true
  if (cliAll) return true
  if (fileStems.has(stem)) return true
  return false
}

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

/** Next non-colliding output path: <stem>.jpg, then <stem>-v2.jpg, <stem>-v3.jpg, … */
async function resolveOutputPath(stem) {
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

async function listOriginals(filter = []) {
  let names
  try {
    names = await readdir(IN_DIR)
  } catch {
    throw new Error(`Input directory not found: ${IN_DIR}`)
  }

  const files = names
    .filter((n) => INPUT_EXTS.has(extname(n).toLowerCase()))
    .sort()

  if (!filter.length) return files

  return files.filter((f) => {
    const stem = basename(f, extname(f))
    return filter.some((q) => stem.startsWith(q.replace(/\.(jpe?g|png|webp)$/i, '')))
  })
}

/** Flatten iPhone MPO/HEIC-in-JPEG and resize for the API (max 1536px long edge). */
async function normalizeInputImage(inputPath) {
  const cleanup = []

  if (process.platform === 'darwin') {
    const tmpFlat = join(tmpdir(), `portrait-flat-${randomBytes(8).toString('hex')}.jpg`)
    const tmpSized = join(tmpdir(), `portrait-sized-${randomBytes(8).toString('hex')}.jpg`)
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

async function generatePortraitWithApi(inputPath, prompt, retries = 3) {
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

async function generatePortraitWithCodex(inputPath, prompt) {
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
    return { name: 'openai-api', generate: generatePortraitWithApi }
  }

  if (await hasCodexSubscriptionAuth()) {
    return { name: 'codex-subscription', generate: generatePortraitWithCodex }
  }

  throw new Error(
    'No Codex subscription auth found (~/.codex/auth.json). Run `codex login` with your ChatGPT account, or set PORTRAIT_USE_API_KEY=1 with OPENAI_API_KEY.',
  )
}

async function main() {
  const backend = await resolveBackend()
  const { filters, keepExpressionStems, keepExpressionAll, noKeepExpression } = parseArgs(process.argv.slice(2))
  const keepExpressionFile = await loadKeepExpressionFile()
  const queue = await listOriginals(filters)

  if (!queue.length) {
    console.error(
      filters.length
        ? `No matching originals for: ${filters.join(', ')}`
        : `No images in ${IN_DIR} (expected .jpg, .jpeg, .png, .webp)`,
    )
    process.exit(1)
  }

  await mkdir(OUT_DIR, { recursive: true })

  const keepOpts = {
    fileStems: keepExpressionFile,
    cliStems: keepExpressionStems,
    cliAll: keepExpressionAll,
    noKeepExpression,
  }

  console.log(`Backend: ${backend.name}`)
  if (noKeepExpression) {
    console.log('Expression: vary (manifest ignored for this run)')
  } else if (keepExpressionAll) {
    console.log('Expression: keep (all photos in this run)')
  } else if (keepExpressionStems.size) {
    console.log(`Expression: keep for ${[...keepExpressionStems].join(', ')}; vary for others`)
  } else if (keepExpressionFile.size) {
    console.log(`Expression: keep for ${[...keepExpressionFile].join(', ')} (keep-expression.txt); vary for others`)
  } else {
    console.log('Expression: vary (default)')
  }
  console.log(`Generating ${queue.length} portrait(s) → ${OUT_DIR}\n`)

  for (const file of queue) {
    const stem = basename(file, extname(file))
    const inPath = join(IN_DIR, file)
    const { version, filename, path: outPath } = await resolveOutputPath(stem)
    const keepExpression = shouldKeepExpression(stem, keepOpts)

    const { prompt, summary } = buildPrompt(stem, version, { keepExpression })
    const versionLabel = version > 1 ? ` v${version}` : ''
    process.stdout.write(`🎨 ${file}${versionLabel} (${summary}) … `)

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

  console.log('\nFinished.')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
