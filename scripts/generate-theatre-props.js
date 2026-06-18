#!/usr/bin/env node
/**
 * Generate amateur theatre prop still-life PNGs (white background).
 * Style per scripts/generate-portraits.js + aesthetic-style-guide.md
 *
 * Default backend: ChatGPT subscription via Codex OAuth (`codex login`).
 * Optional API billing: THEATRE_PROPS_USE_API_KEY=1 (requires OPENAI_API_KEY).
 *
 * Usage:
 *   node scripts/generate-theatre-props.js
 *   node scripts/generate-theatre-props.js props-pile
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateImageWithCodex, hasCodexSubscriptionAuth } from './lib/codex-image.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'images', 'theatre-props-generated')
const USE_API_KEY = process.env.THEATRE_PROPS_USE_API_KEY === '1'

// generate-portraits.js — fixed series baseline
const STYLE = `Vintage pirate romanticism in the Svarta Malin style — but LOW QUALITY, deliberately crappy. A bad snapshot from a village-hall props cupboard, not a nice photo. Blurry, soft focus, heavy film grain, slightly overexposed in places, muddy shadows, cheap disposable-camera or old phone-camera energy. Sepia-yellowed and faded. NOT sharp, NOT high resolution, NOT professional product photography, NOT clean digital look, NOT neon, NOT glossy CGI, NOT hyperrealistic.`

const AMATEUR = `AMATEUR EXECUTION — MAXIMUM CRAP: Obvious fake stage props from a pound shop or party-supplies aisle — wobbly plastic cutlasses with chipped gold spray-paint, foam flintlocks that look like toys, a bent cardboard spyglass, a treasure map drawn in felt-tip on crumpled printer paper, a chunky painted-wood compass with the needle stuck, felt eyepatch, tangled nylon rope, a sad deflated plastic parrot, a crushed tricorn with a crooked skull painted on in marker, plastic bangles, a shoebox treasure chest, polyester sash from a costume bag, cheap feather boa shedding feathers, beads from a craft kit, an empty glass bottle with the label peeled off, toilet-roll tube scroll. Props dumped in a messy heap like someone swept them off a rehearsal floor. Village-hall panto energy — charmingly rubbish, never convincing or expensive.`

const BACKGROUND = `CRITICAL: Plain flat white background (#FFFFFF) behind the prop pile only. No floor, no table, no gradient, no shadow on a surface — just white fill around the heap.`

const NEG = `No sharp focus, no crisp detail, no museum-quality replicas, no expensive cosplay, no professional studio lighting, no clean product shot, no bright saturated colors, no neon, no glossy CGI, no hyperrealistic rendering, no transparent background, no grey backdrop, no text, no watermark, no border frame, no Pirates of the Caribbean look, no Disney pirate aesthetic.`

/** @type {{ file: string, prompt: string }[]} */
const ASSETS = [
  {
    file: 'theatre-props-pile.png',
    prompt: `A crappy low-quality photograph of a messy pile of amateur theatre pirate props stacked and tangled together — still life, no people. Bad snapshot quality: soft blur, heavy grain, slightly washed out, unflattering flat flash or dim hall lighting. Items in the heap: two rubber cutlasses with chipped gold spray-paint, foam flintlock pistols, bent plastic spyglass, crumpled felt-tip treasure map on printer paper, chunky painted compass, felt eyepatch, tangled rope, sad plastic parrot, crushed tricorn with marker skull, plastic jewellery, shoebox treasure chest, polyester sash, shedding feather boa, craft beads, peeled-label bottle, cardboard scroll. Dumped chaotically like swept off a rehearsal floor. Square composition, pile centered on plain white background.`,
  },
]

function buildFullPrompt(prompt) {
  return `${prompt} ${STYLE} ${AMATEUR} ${BACKGROUND} ${NEG}`
}

async function generateImageWithApi(fullPrompt, retries = 3) {
  const body = {
    model: 'gpt-image-1',
    prompt: fullPrompt,
    n: 1,
    size: '1024x1024',
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

async function generateImageWithCodexBackend(fullPrompt) {
  return generateImageWithCodex({
    prompt: fullPrompt,
    size: '1024x1024',
    outputFormat: 'png',
    background: 'opaque',
  })
}

async function resolveBackend() {
  if (USE_API_KEY) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('THEATRE_PROPS_USE_API_KEY=1 but OPENAI_API_KEY is not set')
    }
    return { name: 'openai-api', generate: generateImageWithApi }
  }

  if (await hasCodexSubscriptionAuth()) {
    return { name: 'codex-subscription', generate: generateImageWithCodexBackend }
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
    const fullPrompt = buildFullPrompt(asset.prompt)

    process.stdout.write(`🎨 ${asset.file} … `)
    const start = Date.now()
    try {
      const png = await backend.generate(fullPrompt)
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
