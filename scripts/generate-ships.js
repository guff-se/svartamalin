#!/usr/bin/env node
/**
 * Generate portraits of the five Svarta Malin skutor.
 * Style baseline: aesthetic-style-guide.md (vintage pirate romanticism).
 *
 * Default backend: ChatGPT subscription via Codex OAuth (`codex login`).
 * Optional API billing: SHIPS_USE_API_KEY=1 (requires OPENAI_API_KEY).
 *
 * Output: images/ships-generated/<file>.png
 *
 * Usage:
 *   node scripts/generate-ships.js
 *   node scripts/generate-ships.js kurtisanen
 *   node scripts/generate-ships.js 3 fromheten
 */

import { writeFile, mkdir } from 'node:fs/promises'
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

const SHARED = `PORTRAIT OF A SINGLE PIRATE SHIP as the hero of the image. Landscape marine painting, 3:2 frame. The ENTIRE ship fits inside the frame with generous sky and water margin — nothing cropped. Empty decks: no people, no faces, no silhouettes on board. Painted theatrical sea-and-sky backdrop, foxed paper, soft vignette. The ship is a stage prop built a little too grand — slightly wrong proportions, slightly over-decorated, charmingly imperfect.`

const NO_PEOPLE = `CRITICAL: Absolutely no people, no faces, no hands, no crew, no silhouettes, no body parts, no mermaids, no figurehead with a realistic human face (stylised carved wood only). Empty ship — vessel and atmosphere only.`

const NEG = `No people, no person, no face, no crew, no crowd, no portrait subject, no modern ship, no steam, no steel hull, no container ship, no yacht, no motorboat, no Pirates of the Caribbean look, no Disney pirate aesthetic, no Jack Sparrow, no glossy CGI, no photorealistic naval photography, no bright saturated neon, no clean digital vector, no watermark text, no UI, no logo, no picture frame around the image, no other ships in the scene. No stern-first view, no ship sailing away from the camera, no transom nameplate, no name on the stern, no twisted hull posed only to show the back.`

/** @type {{ id: number, file: string, aliases: string[], size: string, prompt: string }[]} */
const SHIPS = [
  {
    id: 1,
    file: 'ship-1-kurtisanen.png',
    aliases: ['1', 'kurtisanen', 'korvetten'],
    size: '1536x1024',
    prompt: `Korvetten Kurtisanen — Svarta Malin's own small, fast, show-off corvette.

A sleek 18th-century CORVETTE (smaller than a frigate, two masts, low elegant hull) dressed like a courtesan's parlour gone to sea. Pearl and jewel-like ornaments along the bow, rust-red silk banners and gold braid, cream sails with gold trim, lanterns glowing, a carved wooden fan or peacock as figurehead (stylised wood, not a person). Jolly Roger with a theatrical skull-and-crossbones. The hull is painted a warm dark wine-brown with gold scrollwork. Mood: ostentatious harbour flagship — caviar and rum, every rival meant to feel underdressed. Name "KURTISANEN" lettered large on the BOW in slightly wobbly gold.`,
  },
  {
    id: 2,
    file: 'ship-2-fordarvet.png',
    aliases: ['2', 'fordarvet', 'fördärvet', 'fregatten-fordarvet'],
    size: '1536x1024',
    prompt: `Fregatten Fördärvet — a frigate of vice: sin, gluttony and rotten habits, not death.

An 18th-century FRIGATE (three masts) dressed as a floating tavern of excess gone sour. Wine-dark hull stained with spilled grog, greasy gold trim, rum barrels and empty bottles lashed to the rails, dice and playing-card motifs on the sails, a stained velvet banner, overflowing carved wooden goblet or hog as figurehead (stylised wood, not a person — no skull). Cream sails blotched with wine and grease. Mood: frosseri, dåliga vanor, synd — hungover splendour, too much of everything, perdition as appetite not as a grave. Warm tavern-lantern light, ochre and faded rust-red, no storm-of-the-dead, no lightning, no bones. Name "FÖRDÄRVET" lettered on the BOW in wine-stained gold.`,
  },
  {
    id: 3,
    file: 'ship-3-bortforklaringen.png',
    aliases: ['3', 'bortforklaringen', 'bortförklaringen', 'barken'],
    size: '1536x1024',
    prompt: `Barken Bortförklaringen — the barque of elegant excuses, prejad three times and always blaming the weather.

An 18th-century BARQUE (three masts, the aftermost mast fore-and-aft rigged) half-lost in theatrical fog. Mismatched patched sails (stripes, polka dots, different cloth as if every excuse is a different patch), slightly listing hull, drooping flags, rain-streaked deck. Soft grey-cream and muted teal fog, no storm drama — just weather as an alibi. A carved wooden weather-vane or apologetic shrug of a figurehead (stylised wood, not a person). Mood: fog, drift, the last elegant excuse. Name "BORTFÖRKLARINGEN" lettered on the BOW, a little crooked, as if the letters themselves are hedging.`,
  },
  {
    id: 4,
    file: 'ship-4-fromheten.png',
    aliases: ['4', 'fromheten', 'fregatten-fromheten'],
    size: '1536x1024',
    prompt: `Fregatten Fromheten — the pious pirates' frigate: clean hands, hymn-book bow, pirate socialism at sea.

A tidy 18th-century FRIGATE (three masts) whitewashed and over-clean for a pirate ship — cream and bone-white sails, pale hull with faded rust-red crosses mixed into the Jolly Roger, a carved wooden hymn-book or haloed skull as figurehead (stylised wood, not a person). Ledger-neat rigging that is still slightly wrong, theatrical holiness. Soft church-candle light on the bow lanterns. Mood: fake sanctimony, räkenskaper and psalms, rena händer that hide a treasure. Name "FROMHETEN" lettered on the BOW in careful but imperfect serif.`,
  },
  {
    id: 5,
    file: 'ship-5-gnallet.png',
    aliases: ['5', 'gnallet', 'gnället', 'galeonen'],
    size: '1536x1024',
    prompt: `Galeonen Gnället — the loudest galleon in Salmonellahavet, invited as the orchestra of complaints.

A large 18th-century GALLEON (high ornate stern castle receding behind, bulky hull, three or four masts) overloaded with too many pennants, bells, rattles and mismatched flags — visual noise. Cheap gold that flakes, a carved wooden open-mouth / shouting figurehead (stylised wood, not a person). Cluttered empty decks piled with theatrical props: drums, horns, a megaphone, tangled rope. Palette: faded rust-red, ochre, cream, too much trim. Mood: complaint as performance — they were invited because they are heard. Name "GNÄLLET" lettered large on the BOW, slightly shouting.`,
  },
]

function buildFullPrompt(ship) {
  return `${BOW_COMPOSITION} ${NO_PEOPLE} ${SHARED} ${ship.prompt} ${STYLE_GUIDE} ${NEG} ${BOW_COMPOSITION}`
}

function matchShip(token) {
  const t = token.toLowerCase().replace(/\.png$/, '')
  return SHIPS.find(
    (s) =>
      s.file.replace(/\.png$/, '') === t ||
      s.file.startsWith(t) ||
      s.aliases.some((a) => a.toLowerCase() === t),
  )
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
          console.error(`Unknown ship "${token}". Try: ${SHIPS.map((s) => s.aliases[1] ?? s.file).join(', ')}`)
          process.exit(1)
        }
        return ship
      })
    : SHIPS

  console.log(`Backend: ${backend.name}`)
  console.log(`Generating ${queue.length} ship(s) → ${OUT_DIR}\n`)

  for (const ship of queue) {
    const outPath = join(OUT_DIR, ship.file)
    const fullPrompt = buildFullPrompt(ship)
    const size = ship.size || '1536x1024'

    process.stdout.write(`🎨 ${ship.file} (${size}) … `)
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
