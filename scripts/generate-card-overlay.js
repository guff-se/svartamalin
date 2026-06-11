#!/usr/bin/env node
/**
 * Generate collectable pirate portrait card frame overlays via OpenAI Images API (gpt-image-1).
 * Prompt styled per aesthetic-style-guide.md → public/images/cards/pirate-card-overlay-NN.png
 *
 * Usage:
 *   node scripts/generate-card-overlay.js          # all variants
 *   node scripts/generate-card-overlay.js 11 12    # specific variants only
 *
 * Requires: OPENAI_API_KEY
 */

import { writeFile, mkdir, copyFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'images', 'cards')

// aesthetic-style-guide.md — full Svarta Malin prompt block
const STYLE = `Vintage pirate romanticism in the Svarta Malin style. A theatrical, adventurous and faintly melancholic mood. 18th-century pirate world filtered through 1920s–30s Hollywood studio glamour: weathered, aged, nostalgic. Theatrical dress-up feel — stage costume and theatrical props, hand-sewn, improvised, a touch over-the-top, charming disguise, NOT a perfect reconstruction — handmade, staged and slightly imperfect, not 100% polished. Treatment: sepia / warm brown / black-and-white tones, antique photographic finish — scratches, film grain, faint watermark, tintype / wet-plate texture, slightly faded and tarnished. Vintage cigarette card chromolithograph or antique hand-coloured engraving aesthetic. Limited palette: sepia, warm browns, cream, muted gold, faded rust-red accents. Soft diffused light feel on the frame edges.`

const IMPERFECT = `IMPORTANT — UN-TALENTED ARTIST: Drawn by someone who loves pirates but is bad at drawing — wobbly linework, lopsided proportions, ink smudges, felt-tip bleeding. Less clutter than an overcrowded doodle sheet: pick a few motifs only, not dozens. Detail effort goes mainly to the bottom label. NOT skilled, NOT professional, NOT talented — charmingly bad but not jam-packed.`

const TRANSPARENT = `CRITICAL PNG TRANSPARENCY: Output MUST have a real alpha channel. The portrait area (centre and upper ~75% of the card) must stay mostly transparent so a photo shows through — no paper fill, no cream rectangle, no opaque background in the middle. FRAME OVERLAY ONLY. Visible ink in three zones: (1) SKINNY hairline sliver on left, right, and top edges only — razor-thin, 0.5% wide max, minimal decoration on the sliver itself, (2) BOTTOM LABEL zone (~12-15% height) — this is where most decorative detail goes: ornate blank name cartouche, filigree, pirate motifs, NO text, (3) a few small decorative accents MAY intrude slightly inward from the side/top edges into the portrait area — subtle corner vignettes, tiny corner skull or anchor doodles peeking in, but keep these sparse and small. Do not clutter the whole portrait area.`

const NEG = `No fill in centre, no opaque middle, no paper texture in centre, no background behind portrait area, no thick border, no wide frame, no mat, no inner margin, no band wider than a hairline, no double-line frame, no portrait, no face, no person, no text, no letters, no sample name, no white rectangle, no cream rectangle in the middle, no neon, no glossy CGI, no clean vector perfection.`

const BASE = `A collectable vintage pirate playing card FRAME OVERLAY, portrait orientation, aspect ratio 63:88. SKINNY hairline sliver on outer edges only (0.5% wide max) — plain or nearly plain thin line, NOT wide, NOT a mat. Most decoration concentrated in the bottom blank name label cartouche (no text). A few small pirate details may peek inward from corners into the frame area — restrained, not cluttered. Upper and centre portrait area stays transparent for a photo. Sepia, warm brown, cream, muted gold, homemade imperfect Svarta Malin style, untalented but earnest artist.`

/** @type {{ id: number, file: string, variant: string }[]} */
const VARIANTS = [
  { id: 1, file: 'pirate-card-overlay-01.png', variant: 'Variant A: single thin sepia ink line border with tiny corner ticks, flat rectangular cream label strip at bottom.' },
  { id: 2, file: 'pirate-card-overlay-02.png', variant: 'Variant B: thin double gold-and-brown rules, minimal corner dots only, simple scroll-ended label banner at bottom.' },
  { id: 3, file: 'pirate-card-overlay-03.png', variant: 'Variant C: thin twisted rope line border (very narrow), small skull icon top-centre on the thin frame only, rounded label plaque at bottom.' },
  { id: 4, file: 'pirate-card-overlay-04.png', variant: 'Variant D: ultra-minimal — hairline black-brown border, L-shaped corner brackets only (no full heavy frame), plain dark sepia label bar at bottom.' },
  { id: 5, file: 'pirate-card-overlay-05.png', variant: 'Variant E: thin dashed vintage cigarette-card border, aged chromolithograph texture on the thin line only, torn-paper style blank label strip at bottom.' },
  { id: 6, file: 'pirate-card-overlay-06.png', variant: 'Variant F: thin border with small flourishes ONLY at the four corners (centre edges bare), ornate but skinny, decorative cartouche label area at bottom (empty).' },
  { id: 7, file: 'pirate-card-overlay-07.png', variant: 'Variant G: thin cross-hatched ink border line, weathered tintype aesthetic on the trim only, simple cream rectangular text field at bottom.' },
  { id: 8, file: 'pirate-card-overlay-08.png', variant: 'Variant H: thin braided gold line border, theatrical 1920s glamour accent on trim only, pill-shaped blank name label at bottom.' },
  { id: 9, file: 'pirate-card-overlay-09.png', variant: 'Variant I: thin wobbly hand-drawn quill line border (narrow), amateur cartographer feel on the slim edge only, bracketed label box at bottom.' },
  { id: 10, file: 'pirate-card-overlay-10.png', variant: 'Variant J: thin border with alternating tiny skull and anchor motifs spaced along the slim edge, blank ribbon banner label at bottom.' },
  // v2 — aesthetic-style-guide.md + deliberately imperfect
  { id: 11, file: 'pirate-card-overlay-11.png', variant: 'Variant K: worn 1920s Hollywood cigarette-card chromolithograph frame — thin sepia and cream border with wobbly off-register gold print, tiny lopsided skull-and-crossbones at top, grain and scratches on the trim only, blank torn-paper label strip at bottom. Lines do not meet cleanly at corners.' },
  { id: 12, file: 'pirate-card-overlay-12.png', variant: 'Variant L: antique hand-coloured engraving style thin frame — quill-pen ink with hesitant wobbly strokes, faded rust-red wash spilling outside the border lines, mismatched corner flourishes, blank parchment-coloured name cartouche at bottom (empty). Tintype mount aesthetic, amateur and skewed.' },
  { id: 13, file: 'pirate-card-overlay-13.png', variant: 'Variant M: theatrical stage-prop collectable card frame — thin border drawn like costume sketch ink, braid/soutache gold trim that is uneven and hand-sewn looking, small wonky tricorn-with-skull doodle top-centre, blank sepia label banner at bottom with visible ink blots. Dress-up charm, deliberately ugly linework, not polished.' },
  // v3 — explicitly homemade / craft-night
  { id: 14, file: 'pirate-card-overlay-14.png', variant: 'Variant N: looks homemade at a kitchen table — thin border cut from aged cardboard with scissors (edges slightly uneven), sepia felt-tip marker line wobbling around the trim, smudged thumbprint stain on one corner, blank label strip at bottom drawn as a crooked rectangle with marker bleeding outside the edges. Craft project, not professional printing.' },
  { id: 15, file: 'pirate-card-overlay-15.png', variant: 'Variant O: DIY pirate party craft card — thin border made of glued-on strips of torn sepia paper and cream tape, visible glue wrinkles, hand-stamped tiny skull in the wrong place (off-centre), blank bottom label as a lopsided paper scrap pasted on. Collage aesthetic, charmingly messy, made by an enthusiastic amateur.' },
  { id: 16, file: 'pirate-card-overlay-16.png', variant: 'Variant P: homemade theatre-programme frame — thin border sketched in ballpoint pen then traced over shakily in brown ink, watercolour wash spilling past the lines on the trim only, corners do not align, blank bottom name banner looks like a folded paper label taped on (empty). Looks like someone made it the night before a dress-up party, earnest and clumsy.' },
  // v4 — hairline sliver + bottom label only
  { id: 17, file: 'pirate-card-overlay-17.png', variant: 'Variant Q: absolute minimum — one hairline wobbly sepia ink sliver tracing the card edge (pencil-thin), nothing else on the sides or top except the line itself, small blank cream label rectangle at bottom only. Homemade, hesitant pen stroke, corners barely meet.' },
  { id: 18, file: 'pirate-card-overlay-18.png', variant: 'Variant R: hairline sliver border — single broken dashed vintage cigarette-card line (1 pixel thick feel), tiny lopsided skull doodle sitting ON the top edge of the sliver only, compact blank sepia label bar at bottom. Worn, off-register, amateur print.' },
  { id: 19, file: 'pirate-card-overlay-19.png', variant: 'Variant S: hairline sliver — one shaky brown felt-tip marker line around the outer edge only (marker running dry in places), no corner decorations, no side ornaments, just the sliver and a crooked homemade blank paper label strip glued at the bottom. Maximum transparency, minimum ink.' },
  // v5 — micro-detailed hairline + guaranteed centre transparency
  { id: 20, file: 'pirate-card-overlay-20.png', variant: 'Variant T: sub-hairline sepia ink sliver with tiny micro-engraved details etched ON the line itself — miniature skull, anchor, rope knot, and compass rose motifs no bigger than pinheads, spaced along the impossibly thin edge only. Elaborate corner filigree that does NOT extend inward. Ornate blank bottom label cartouche with scroll ends (empty, no text). Centre 100% transparent alpha.' },
  { id: 21, file: 'pirate-card-overlay-21.png', variant: 'Variant U: vintage cigarette-card chromolithograph hairline — single off-register gold-and-sepia sliver with detailed micro-printing ON the line: tiny crossed bones, star, wave, and dot patterns, all confined to the razor-thin edge. Worn grain on the sliver only. Bottom label is a richly decorated but blank name plaque with filigree border (no text). Portrait area completely empty transparent PNG.' },
  { id: 22, file: 'pirate-card-overlay-22.png', variant: 'Variant V: homemade theatrical frame — one ultra-thin wobbly quill line with detailed tiny doodles hanging off the sliver like earrings: mini tricorn, hoop earring, flintlock, all drawn ON the hairline without widening it. Bottom blank label strip has hand-drawn braid/soutache gold trim and ink blots (empty). Maximum centre transparency, details only on sliver and label.' },
  // v6 — lots of attempted detail, bad artist
  { id: 23, file: 'pirate-card-overlay-23.png', variant: 'Variant W: overcrowded hairline sliver crammed with too many badly drawn micro-doodles by an untalented artist — lopsided skulls, crooked anchors, misshapen stars, wavy swords, dot eyes all wrong, ink smears, details overlapping messily ON the thin edge only. Bottom label over-decorated with clumsy scrollwork and smudged gold felt-tip (blank, no text). Centre fully transparent.' },
  { id: 24, file: 'pirate-card-overlay-24.png', variant: 'Variant X: enthusiastic kid-energy pirate border — hairline edge covered in poorly drawn tiny pirate clutter: broken cutlasses, squashed ships, bad skull faces, tangled rope scribbles, all wobbly and childlike ON the sliver. Artist clearly untalented but tried to add everything. Bottom blank label is a crooked rectangle with too many mismatched corner flourishes drawn badly. Transparent portrait window.' },
  { id: 25, file: 'pirate-card-overlay-25.png', variant: 'Variant Y: amateur craft-night disaster — hairline border with densely packed but horribly executed vintage pirate motifs (tricorn, pistol, parrot, chest, flag) all tiny and drawn wrong ON the thin edge, some scribbled out, marker bleeding, coffee stain on one corner. Bottom label over-ornamented with lopsided braids and dots by someone not good at decoration (empty). Centre 100% transparent alpha.' },
  // v7 — skinny edge, detail at bottom, sparse corner intrusions
  { id: 26, file: 'pirate-card-overlay-26.png', variant: 'Variant Z: plain skinny sepia hairline on top and sides only. Bottom third is a richly decorated blank name cartouche — scroll ends, rope knot, one lopsided skull, gold filigree, all clumsily drawn (no text). One small anchor doodle peeking in from lower-left corner only. Not cluttered.' },
  { id: 27, file: 'pirate-card-overlay-27.png', variant: 'Variant AA: minimal hairline sliver border, barely visible wobbly ink. Elaborate bottom label plaque with theatrical braid trim, tiny crossed bones, and faded rust-red wash — badly drawn but ornate (empty). Tiny tricorn sketch intruding from top-left corner into frame. Sparse details elsewhere.' },
  { id: 28, file: 'pirate-card-overlay-28.png', variant: 'Variant AB: skinny cigarette-card chromolithograph hairline edge. Bottom label is the star — ornate blank banner with corner flourishes, one wonky ship doodle, sepia and cream (no text). Small skull-and-crossbones peeking in from top-right corner only. Rest of portrait area transparent, restrained detail count.' },
]

const MAX_ID = Math.max(...VARIANTS.map((v) => v.id))

async function generateImage(prompt, retries = 3) {
  const fullPrompt = `${prompt} ${STYLE} ${IMPERFECT} ${TRANSPARENT} ${NEG}`

  const body = {
    model: 'gpt-image-1',
    prompt: fullPrompt,
    n: 1,
    size: '1024x1536',
    output_format: 'png',
    background: 'transparent',
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

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set')
    process.exit(1)
  }

  await mkdir(OUT_DIR, { recursive: true })

  const args = process.argv.slice(2).map(Number).filter((n) => n >= 1 && n <= MAX_ID)
  const queue = args.length
    ? VARIANTS.filter((v) => args.includes(v.id))
    : VARIANTS

  if (!queue.length) {
    console.error(`No matching variants. Use ids 1–${MAX_ID}.`)
    process.exit(1)
  }

  console.log(`Generating ${queue.length} overlay(s) → ${OUT_DIR}\n`)

  for (const v of queue) {
    const outPath = join(OUT_DIR, v.file)
    process.stdout.write(`🎨 ${v.file} … `)
    const start = Date.now()
    try {
      const png = await generateImage(`${BASE} ${v.variant}`)
      await writeFile(outPath, png)
      console.log(`done (${((Date.now() - start) / 1000).toFixed(1)}s, ${(png.length / 1024).toFixed(0)} KB)`)
    } catch (err) {
      console.log('FAILED')
      console.error(`   ${err.message}`)
      process.exitCode = 1
    }
  }

  const latest = queue[queue.length - 1]
  if (latest) {
    await copyFile(join(OUT_DIR, latest.file), join(OUT_DIR, 'pirate-card-overlay.png'))
    console.log(`\n→ pirate-card-overlay.png updated (copy of ${latest.file})`)
  }

  console.log('\nPick a favourite: pass overlaySrc to pirateCardHtml or change DEFAULT_OVERLAY in pirate-card.js')
}

main()
