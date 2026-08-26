#!/usr/bin/env node
/**
 * Generate portraits of the five Svarta Malin skutor.
 * Style baseline: aesthetic-style-guide.md (vintage pirate romanticism).
 *
 * Default backend: ChatGPT subscription via Codex OAuth (`codex login`).
 * Optional API billing: SHIPS_USE_API_KEY=1 (requires OPENAI_API_KEY).
 *
 * Output: images/ships-generated/<stem>.png (första editionen)
 *         images/ships-generated/<stem>-v2.png, -v3.png, … (aldrig overwrite)
 *
 * Usage:
 *   node scripts/generate-ships.js
 *   node scripts/generate-ships.js kurtisanen
 *   node scripts/generate-ships.js 3 fromheten
 */

import { writeFile, mkdir, readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateImageWithCodex, hasCodexSubscriptionAuth } from './lib/codex-image.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'images', 'ships-generated')
const USE_API_KEY = process.env.SHIPS_USE_API_KEY === '1'

// aesthetic-style-guide.md — färdigt engelskt promptblock
const STYLE_GUIDE = `Vintage pirate romanticism in the Svarta Malin style. A theatrical, adventurous and faintly melancholic mood. 18th-century pirate world filtered through 1920s–30s Hollywood studio glamour: weathered, aged, nostalgic.

Theatrical "dress-up" feel: stage costume and theatrical props rather than historically accurate gear — the ship reads as a painted theatre set-piece, a charming disguise, not a perfect reconstruction — handmade, staged and slightly imperfect, not 100% polished.

Treatment: sepia / warm brown / antique photographic finish — scratches, film grain, faint watermark, tintype / wet-plate texture, slightly faded and tarnished. Antique hand-coloured engraving / vintage cigarette-card chromolithograph of a tall ship. Limited palette: sepia, warm browns, cream, muted gold, faded rust-red, faded teal water — often slightly faded.`

const BOW_COMPOSITION = `HIGHEST PRIORITY — HONEST SHIP GEOMETRY, BOW TOWARD THE VIEWER:
The ship must look like a real hull, not a twisted display model. Bow (front) nearer the camera than the stern. Choose ONE of: (A) sailing TOWARD the viewer, bow-on / three-quarter approaching, or (B) true SIDEWAYS profile, hull parallel to the picture plane, sailing left-to-right or right-to-left. The bowsprit points into or across the frame, never away.

FORBIDDEN: sailing away, stern-on, transom facing the camera, hull wrenched around so the back of the ship is shown, "twisted" perspective that displays the nameplate by rotating the stern toward us. The stern may recede or sit in profile — it must not be the hero of the pose.

NAME ON THE BOW ONLY: paint the ship's name in large readable letters on the bow / forecastle / under the bowsprit. NOT on the transom, NOT on the stern gallery.`

const STERN_AWAY = `HIGHEST PRIORITY — EXCEPTION SHIP, SAILING AWAY:
Honest geometry, not a twisted display model. The ship is leaving. Stern nearer the camera than the bow. Three-quarter from behind or nearly stern-on. Bowsprit and bow recede into fog / distance. The hull is not wrenched around.

NAME ON THE STERN / TRANSOM, large and readable — that is the side you see when a ship slips away. Not on the bow.`

const SHARED = `PORTRAIT OF A SINGLE PIRATE SHIP as the hero of the image. Landscape marine painting, 3:2 frame. The ENTIRE ship fits inside the frame with generous sky and water margin — nothing cropped. Empty decks: no people, no faces, no silhouettes on board. Painted theatrical sea-and-sky backdrop, foxed paper, soft vignette. The ship is a stage prop built a little too grand — slightly wrong proportions, slightly over-decorated, charmingly imperfect.`

const NO_PEOPLE = `CRITICAL: Absolutely no people, no faces, no hands, no crew, no silhouettes, no body parts, no mermaids, no figurehead with a realistic human face (stylised carved wood only). Empty ship — vessel and atmosphere only.`

const NEG = `No people, no person, no face, no crew, no crowd, no portrait subject, no modern ship, no steam, no steel hull, no container ship, no yacht, no motorboat, no Pirates of the Caribbean look, no Disney pirate aesthetic, no Jack Sparrow, no glossy CGI, no photorealistic naval photography, no bright saturated neon, no clean digital vector, no watermark text, no UI, no logo, no picture frame around the image, no other ships in the scene. No hull wrenched around only to display a nameplate. No two-masted brig unless the ship is explicitly a barque. No sails printed with playing cards, card suits, aces, or repeating card patterns.`

/** @type {{ id: number, stem: string, aliases: string[], size: string, heading?: 'bow' | 'away', prompt: string }[]} */
const SHIPS = [
  {
    id: 1,
    stem: 'ship-1-kurtisanen',
    aliases: ['1', 'kurtisanen', 'korvetten'],
    size: '1536x1024',
    prompt: `Korvetten Kurtisanen — Svarta Malin's own small, fast, show-off corvette.

A sleek 18th-century CORVETTE: EXACTLY THREE MASTS, ship-rigged (square sails on all three), like a small frigate but smaller and lower in the hull. Count the masts: foremast, mainmast, mizzen — three, not two, not a brig. Dressed like a courtesan's parlour gone to sea. Pearl and jewel-like ornaments along the bow, rust-red silk banners and gold braid, cream sails with gold trim, lanterns glowing, a carved wooden fan or peacock as figurehead (stylised wood, not a person). Jolly Roger with a theatrical skull-and-crossbones. The hull is painted a warm dark wine-brown with gold scrollwork. Mood: ostentatious harbour flagship — caviar and rum, every rival meant to feel underdressed. Name "KURTISANEN" lettered large on the BOW in slightly wobbly gold.`,
  },
  {
    id: 2,
    stem: 'ship-2-fordarvet',
    aliases: ['2', 'fordarvet', 'fördärvet', 'fregatten-fordarvet'],
    size: '1536x1024',
    prompt: `Fregatten Fördärvet — a readable three-masted FRIGATE with a generous but not crushing load of vice.

MIDDLE GROUND. The hull and cream sails must still read as a ship. There should be clearly more garnish than a tidy warship, clearly less than a garbage barge.

YES — a solid helping, not a sprinkle:
- Several sausage (korv) garlands on the rail AND a couple draped from the lower yards / bowsprit, like festive bunting — not covering the whole sail area.
- A carved hog figurehead, a roast or platter on deck, a bowl of grapes.
- Wine casks and a cluster of bottles on deck; a few bottles hanging from stays; a few bobbing near the hull.
- Cigarettes, a clay pipe, an opium pipe or two as small deck still-life.
- A handful of theatrical sex props (wooden dildos, spanking paddles) on the rail or hung from one stay — costume-shop, no bodies.

NO: sails used as laundry-lines stuffed into every fold. NO Christmas-tree masts from deck to truck. NO waterfall of junk hiding the gunwale. NO sea carpeted with debris. NO piles so high the ship disappears. NO empty-looking decks with one lonely sausage.

Cream canvas sails, maybe a wine stain. NO playing-card prints. Warm tavern light, ochre, rust-red. No skulls, no lightning, no bones. Name "FÖRDÄRVET" clearly on the BOW.`,
  },
  {
    id: 3,
    stem: 'ship-3-bortforklaringen',
    aliases: ['3', 'bortforklaringen', 'bortförklaringen', 'barken'],
    size: '1536x1024',
    heading: 'away',
    prompt: `Barken Bortförklaringen — the barque of elegant excuses, prejad three times and always blaming the weather. THIS SHIP IS LEAVING: sailing AWAY from the viewer, slipping into fog, the one exception that does not come toward the camera.

An 18th-century BARQUE (THREE masts, the aftermost mast fore-and-aft rigged) half-lost in theatrical fog, seen from behind as it goes. Mismatched patched sails (stripes, polka dots, different cloth as if every excuse is a different patch) — cloth patches only, NO playing cards, NO card suits. Slightly listing hull, drooping flags, rain-streaked deck. Soft grey-cream and muted teal fog, no storm drama — just weather as an alibi. A carved wooden weather-vane figurehead receding in the distance (stylised wood, not a person). Mood: fog, drift, the last elegant excuse, already almost gone. Name "BORTFÖRKLARINGEN" lettered on the STERN / transom, a little crooked, as if the letters themselves are hedging.`,
  },
  {
    id: 4,
    stem: 'ship-4-fromheten',
    aliases: ['4', 'fromheten', 'fregatten-fromheten'],
    size: '1536x1024',
    prompt: `Fregatten Fromheten — the pious pirates' frigate: clean hands, hymn-book bow, pirate socialism at sea.

A tidy 18th-century FRIGATE (three masts) whitewashed and over-clean for a pirate ship — cream and bone-white sails, pale hull with faded rust-red crosses mixed into the Jolly Roger, a carved wooden hymn-book or haloed skull as figurehead (stylised wood, not a person). Ledger-neat rigging that is still slightly wrong, theatrical holiness. Soft church-candle light on the bow lanterns. Mood: fake sanctimony, räkenskaper and psalms, rena händer that hide a treasure. Name "FROMHETEN" lettered on the BOW in careful but imperfect serif.`,
  },
  {
    id: 5,
    stem: 'ship-5-gnallet',
    aliases: ['5', 'gnallet', 'gnället', 'galeonen'],
    size: '1536x1024',
    prompt: `Galeonen Gnället — the loudest galleon in Salmonellahavet, invited as the orchestra of complaints.

A large 18th-century GALLEON (high ornate stern castle receding behind, bulky hull, three or four masts) overloaded with too many pennants, bells, rattles and mismatched flags — visual noise. Cheap gold that flakes, a carved wooden open-mouth / shouting figurehead (stylised wood, not a person). Cluttered empty decks piled with theatrical props: drums, horns, a megaphone, tangled rope. Palette: faded rust-red, ochre, cream, too much trim. Mood: complaint as performance — they were invited because they are heard. Name "GNÄLLET" lettered large on the BOW, slightly shouting.`,
  },
]

function buildFullPrompt(ship) {
  const heading = ship.heading === 'away' ? STERN_AWAY : BOW_COMPOSITION
  return `${heading} ${NO_PEOPLE} ${SHARED} ${ship.prompt} ${STYLE_GUIDE} ${NEG} ${heading}`
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function matchShip(token) {
  const t = token.toLowerCase().replace(/\.png$/, '').replace(/-v\d+$/, '')
  return SHIPS.find(
    (s) =>
      s.stem === t ||
      s.stem.startsWith(t) ||
      s.aliases.some((a) => a.toLowerCase() === t),
  )
}

/** Next non-colliding path: <stem>.png, then <stem>-v2.png, -v3.png, … */
async function resolveOutputPath(stem) {
  const names = await readdir(OUT_DIR).catch(() => [])
  const versionRe = new RegExp(`^${escapeRegex(stem)}-v(\\d+)\\.png$`)

  let maxVersion = names.includes(`${stem}.png`) ? 1 : 0
  for (const n of names) {
    const m = n.match(versionRe)
    if (m) maxVersion = Math.max(maxVersion, Number(m[1]))
  }

  const version = maxVersion + 1
  const filename = version === 1 ? `${stem}.png` : `${stem}-v${version}.png`
  return { version, filename, path: join(OUT_DIR, filename) }
}

async function generateImageWithApi(fullPrompt, size = '1536x1024', retries = 3) {
  const body = {
    model: 'gpt-image-1',
    prompt: fullPrompt,
    n: 1,
    size,
    output_format: 'png',
    background: 'opaque',
  }

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

async function resolveBackend() {
  if (USE_API_KEY) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('SHIPS_USE_API_KEY=1 but OPENAI_API_KEY is not set')
    }
    return {
      name: 'openai-api',
      generate: (fullPrompt, size) => generateImageWithApi(fullPrompt, size),
    }
  }

  if (await hasCodexSubscriptionAuth()) {
    return {
      name: 'codex-subscription',
      generate: (fullPrompt, size) =>
        generateImageWithCodex({
          prompt: fullPrompt,
          size,
          outputFormat: 'png',
          background: 'opaque',
        }),
    }
  }

  throw new Error(
    'No Codex subscription auth found (~/.codex/auth.json). Run `codex login` with your ChatGPT account, or set SHIPS_USE_API_KEY=1 with OPENAI_API_KEY.',
  )
}

async function main() {
  const backend = await resolveBackend()
  await mkdir(OUT_DIR, { recursive: true })

  const only = process.argv.slice(2)
  const queue = only.length
    ? only.map((token) => {
        const ship = matchShip(token)
        if (!ship) {
          console.error(`Unknown ship "${token}". Try: ${SHIPS.map((s) => s.aliases[1] ?? s.stem).join(', ')}`)
          process.exit(1)
        }
        return ship
      })
    : SHIPS

  console.log(`Backend: ${backend.name}`)
  console.log(`Generating ${queue.length} ship(s) → ${OUT_DIR}\n`)

  for (const ship of queue) {
    const { filename, path: outPath } = await resolveOutputPath(ship.stem)
    const fullPrompt = buildFullPrompt(ship)
    const size = ship.size || '1536x1024'
    process.stdout.write(`🎨 ${filename} (${size}) … `)
    const start = Date.now()
    try {
      const png = await backend.generate(fullPrompt, size)
      await writeFile(outPath, png)
      console.log(`done (${((Date.now() - start) / 1000).toFixed(1)}s, ${(png.length / 1024).toFixed(0)} KB)`)
      console.log(`   → ${outPath}`)
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
