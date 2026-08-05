#!/usr/bin/env node
/**
 * Generate Svarta Malin intro / prop images.
 *
 * Style baseline: aesthetic-style-guide.md (vintage pirate romanticism).
 * Per-asset prompts may freely change medium, perspective and content.
 * Intro scenes are empty of people — objects, sets and atmosphere only.
 *
 * Default backend: ChatGPT subscription via Codex OAuth (`codex login`).
 * Optional API billing: THEATRE_PROPS_USE_API_KEY=1 (requires OPENAI_API_KEY).
 *
 * Usage:
 *   node scripts/generate-theatre-props.js
 *   node scripts/generate-theatre-props.js theatre-props-feast
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateImageWithCodex, hasCodexSubscriptionAuth } from './lib/codex-image.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'images', 'theatre-props-generated')
const USE_API_KEY = process.env.THEATRE_PROPS_USE_API_KEY === '1'

// aesthetic-style-guide.md — färdigt engelskt promptblock
const STYLE_GUIDE = `Vintage pirate romanticism in the Svarta Malin style. A theatrical, adventurous and faintly melancholic mood. 18th-century pirate world filtered through 1920s–30s Hollywood studio glamour: weathered, aged, nostalgic.

Theatrical "dress-up" feel: stage costume and theatrical props rather than historically accurate gear — props read as costume accessories, backgrounds can be painted stage backdrops. Charming disguise, not a perfect reconstruction — handmade, staged and slightly imperfect, not 100% polished.

Treatment: sepia / warm brown / black-and-white tones, soft diffused lighting, antique photographic finish — scratches, film grain, faint watermark, tintype / wet-plate texture, slightly faded and tarnished. Limited bold illustration palette where relevant: green, orange, clear red, cream, gold — often slightly faded.`

const NO_PEOPLE = `CRITICAL: Absolutely no people, no faces, no hands, no silhouettes, no body parts, no mannequins with faces. Empty scene — objects and atmosphere only.`

const NEG = `No people, no person, no face, no hands, no crowd, no portrait subject, no modern clothing on a body, no bright saturated neon colors, no clean digital look, no glossy CGI, no Pirates of the Caribbean look, no Disney pirate aesthetic, no Jack Sparrow, no text, no watermark, no border frame, no UI, no logo.`

const PROPS_PILE_STYLE = `LOW QUALITY deliberately crappy snapshot from a village-hall props cupboard. Blurry, soft focus, heavy film grain, muddy shadows, disposable-camera energy. Plain flat dark brown background (#3d2817 to #2a1a0e), no table, no floor, no vignette.`

/** @type {{ file: string, prompt: string, mode?: 'guide' | 'props-pile', size?: string }[]} */
const ASSETS = [
  {
    file: 'theatre-props-pile.png',
    mode: 'props-pile',
    size: '1024x1024',
    prompt: `A messy pile of amateur theatre pirate props stacked and tangled together — still life, no people. Items: rubber cutlasses with chipped gold spray-paint, foam flintlocks, bent plastic spyglass, crumpled felt-tip treasure map, painted compass, felt eyepatch, tangled rope, sad plastic parrot, crushed tricorn with marker skull, shoebox treasure chest, polyester sash, craft beads, peeled-label bottle. Square composition, pile centered.`,
  },

  // manifest_friday — överdåd: tomt festbord innan stormen
  {
    file: 'theatre-props-feast.png',
    mode: 'guide',
    size: '1024x1536',
    prompt: `Antique hand-coloured engraving / chromolithograph of an EMPTY pirate banquet table on a theatre stage (no diners).

A tall candlelit table abandoned mid-toast, composed for a PORTRAIT / vertical frame (taller than wide): toppled wine glasses, spilled dark wine staining the cloth, open caviar tin, rum bottles, gold-rimmed plates, a crooked birthday cake with too many mismatched candles still burning, empty chairs pushed back as if everyone just left to fight. Painted stormy-sea backdrop rising behind, heavy stage curtains framing the sides. Mood: last night of excess before everything burns — the feast remains, the guests are gone. Vertical theatrical composition filling a 2:3 portrait canvas, sepia-warm cream and gold, foxed paper edges, soft vignette.`,
  },

  // manifest_saturday — svek / förlisning: plundrad skatt + brutet förbund
  {
    file: 'theatre-props-betrayal.png',
    mode: 'guide',
    size: '1024x1536',
    prompt: `Antique hand-coloured engraving / chromolithograph still life on a theatre stage (no people).

PORTRAIT / vertical 2:3 frame. FOCUS: a large theatrical pirate SKULL (stage prop skull with crossed bones or a skull crest) dominates the centre — the clear visual centrepiece, lit by candlelight, slightly larger and sharper than everything else. Around it, aftermath of betrayal: an open half-empty treasure chest, scattered gold coins and ribbons, a torn alliance map ripped in two, abandoned rubber cutlasses, a toppled rum bottle, snapped rope, crumpled Jolly Roger, wet deck boards, tall painted stormy sea backdrop. Mood: the surface cracks — treachery, plunder, the night before shipwreck. The skull is the hero of the composition. Sepia-warm cream, faded rust-red and gold, foxed paper, soft vignette, theatrical props not real bones.`,
  },

  // manifest_play — play to lose: spektakulärt misslyckande utan kropp
  {
    file: 'theatre-props-duel.png',
    mode: 'guide',
    size: '1024x1536',
    prompt: `Vintage tintype / wet-plate still life on a painted studio stage (no people).

PORTRAIT / vertical 2:3 frame. Aftermath of a theatrical pirate duel that someone gloriously LOST, arranged tall: a rubber cutlass lying on the boards in the foreground, a crushed cardboard crown, a felt eyepatch tangled in its elastic, rope coiled like a tripwire, a foam flintlock snapped at the barrel, a toppled goblet, a torn paper Jolly Roger flag, a single spotlight pool of light on the mess with dark empty stage rising behind. Mood: play to lose — flopping spectacularly made the drama better. Sepia antique photo grain and scratches, shallow depth of field.`,
  },

  // manifest_prep — kostym + skatt, backstage utan människor
  {
    file: 'theatre-props-treasure.png',
    mode: 'guide',
    size: '1024x1536',
    prompt: `Hand-coloured cigarette-card chromolithograph of a pirate COSTUME WORKSHOP backstage — empty of people.

PORTRAIT / vertical 2:3 frame. Open wardrobe trunk spilling striped fabric, half-finished polyester sash with crooked stitches, needle and thread stuck in cloth, scissors, tricorn with skull crest mid-decoration (gold braid, loose feather), and the crew's homemade treasure: a glowing chest stuffed with ribbons, stage jewels and party streamers stacked in a tall still-life. Warm lantern light, painted dressing-room backdrop rising behind, vanity mirror with no reflection of a person. Mood: sew your costume, build your skatt, invent surprises. Cream / faded rust-red / muted green / gold palette, slightly imperfect linework.`,
  },
]

function buildFullPrompt(asset) {
  if (asset.mode === 'props-pile') {
    return `${asset.prompt} ${PROPS_PILE_STYLE} ${STYLE_GUIDE} ${NEG}`
  }
  return `${NO_PEOPLE} ${asset.prompt} ${STYLE_GUIDE} ${NEG}`
}

async function generateImageWithApi(fullPrompt, size = '1024x1024', retries = 3) {
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
      throw new Error('THEATRE_PROPS_USE_API_KEY=1 but OPENAI_API_KEY is not set')
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
    'No Codex subscription auth found (~/.codex/auth.json). Run `codex login` with your ChatGPT account, or set THEATRE_PROPS_USE_API_KEY=1 with OPENAI_API_KEY.',
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
    const fullPrompt = buildFullPrompt(asset)
    const size = asset.size || '1024x1536'

    process.stdout.write(`🎨 ${asset.file} (${size}) … `)
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
