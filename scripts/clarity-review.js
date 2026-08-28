#!/usr/bin/env node
/**
 * Bygger isolerade clarity-review-paket, en per gäst i content/intriger/guests/.
 *
 * Rostern kommer från content/roller/{slug}.md (pirate_name, crew, crew_id)
 * plus guests/*.md (vem som har intrig) och crews/{id}.md (lagnamn).
 *
 * Kör:
 *   npm run clarity-review              lista + pekare till rutinen
 *   node scripts/clarity-review.js --json
 *   node scripts/clarity-review.js --prompt navidmodiri
 *   node scripts/clarity-review.js --scan malintadaa
 *   node scripts/clarity-review.js --write-prompts
 *
 * Promptfilerna är input till Cursor Task-subagenter. Rutin:
 * content/intriger/clarity-review.md
 */

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const GUESTS_DIR = join(ROOT, 'content/intriger/guests')
const CREWS_DIR = join(ROOT, 'content/intriger/crews')
const ROLLER_DIR = join(ROOT, 'content/roller')
const ANTECK_DIR = join(ROOT, 'content/anteckningar')
const INTRO_PATH = join(ROOT, 'content/copy/intriger_intro.md')
const PROMPTS_DIR = join(ROOT, 'tmp/clarity-review')

const args = process.argv.slice(2)
const flag = (name) => args.includes(name)
const after = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}

function read(path) {
  return readFileSync(path, 'utf8')
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  const out = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z_]+):\s*(.+)$/)
    if (kv) out[kv[1]] = kv[2].trim()
  }
  return out
}

function crewNameFromFile(id) {
  const text = read(join(CREWS_DIR, `${id}.md`))
  const m = text.match(/\*\*(.+?)\*\*/)
  return m ? m[1] : `crew ${id}`
}

function loadRoster() {
  const slugs = readdirSync(GUESTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .sort()

  const guests = slugs.map((slug) => {
    const guestText = read(join(GUESTS_DIR, `${slug}.md`))
    const crewFromGuest = guestText.match(/crew_id:\s*(\d+)/)
    const crewId = crewFromGuest ? Number(crewFromGuest[1]) : null

    let pirateName
    let crewName
    let rollerCrewId

    try {
      const roller = parseFrontmatter(read(join(ROLLER_DIR, `${slug}.md`)))
      pirateName = roller.pirate_name
      crewName = roller.crew
      rollerCrewId = roller.crew_id ? Number(roller.crew_id) : null
    } catch {
      // roller saknas: fall tillbaka på anteckningar
    }

    if (!pirateName) {
      try {
        const ant = parseFrontmatter(read(join(ANTECK_DIR, `${slug}.md`)))
        pirateName = ant.pirate_name
      } catch {
        pirateName = slug
      }
    }

    const id = crewId ?? rollerCrewId
    if (!crewName && id) crewName = crewNameFromFile(id)

    if (crewId && rollerCrewId && crewId !== rollerCrewId) {
      console.warn(`Varning: ${slug} har crew_id ${crewId} i gästfilen men ${rollerCrewId} i roller/`)
    }

    return {
      slug,
      pirateName,
      crewId: id,
      crewName,
      guestPath: join(GUESTS_DIR, `${slug}.md`),
      crewPath: id ? join(CREWS_DIR, `${id}.md`) : null,
    }
  })

  const crews = [...new Set(guests.map((g) => g.crewId).filter(Boolean))].sort((a, b) => a - b)
  const crewMeta = crews.map((id) => ({
    id,
    name: crewNameFromFile(id),
    members: guests.filter((g) => g.crewId === id),
  }))

  return { guests, crewMeta }
}

/** Brödtexten gästen ser: YAML och {slug:…} räknas inte. */
function guestBody(text) {
  return text
    .replace(/^---\n[\s\S]*?\n---\n?/, '')
    .replace(/\{slug:[^}]+\}/g, '')
}

/**
 * Bestämd form (-en/-et/-na) som första nämnande, utan att saken först
 * presenterats som "en jolle" / "ett svärd". Heuristik: överflaggar hellre
 * än missar. Auditorn avgör. Se clarity-review.md.
 */
const DEFINITE_SKIP = new Set([
  'redan', 'sedan', 'igen', 'utan', 'mellan', 'nästan', 'varken',
  'festen', 'hamnen', 'ön', 'kajen', 'helgen', 'natten', 'morgonen',
  'kvällen', 'dagen', 'mörkret', 'skymningen', 'dimman', 'världen',
  'tiden', 'stället', 'platsen', 'sidan', 'sättet', 'resten',
  'tillfället', 'ögonblicket', 'jobbet', 'saken', 'någon',
  'kroppen', 'munnen', 'handen', 'halsen', 'hjärtat', 'blicken',
  'leendet', 'andan', 'huden', 'fötterna', 'öronen',
  'romen', 'vinet', 'glaset', 'bordet', 'faten', 'kojan', 'sängen',
  'skutan', 'skeppet', 'besättningen', 'kölen', 'flaggan', 'ratten',
  'havet', 'vattnet', 'listan', 'kaptenerna',
  'sanningen', 'lögnen', 'ryktet', 'namnet', 'hemligheten',
  'gymmet', 'storstugan', 'ovanan', 'salmonellahavet',
  'siffran', 'koden', 'skatten', 'låset', 'kistan', 'ledtråden',
  'korvetten', 'fregatten', 'barken', 'galeonen', 'kurtisanen',
])

function definiteStems(word) {
  const w = word.toLowerCase()
  const stems = new Set()
  if (w.endsWith('na') && w.length > 5) stems.add(w.slice(0, -2))
  if (w.endsWith('et') && w.length > 5) stems.add(w.slice(0, -2))
  if (w.endsWith('en') && w.length > 5) {
    stems.add(w.slice(0, -2))
    stems.add(w.slice(0, -1))
  }
  return [...stems]
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function introducedIndefinite(haystack, stems) {
  const lower = haystack.toLowerCase()
  const det = 'en|ett|sin|sitt|sina|din|ditt|dina|min|mitt|mina|hans|hennes|deras'
  return stems.some((stem) => {
    const s = escapeRe(stem)
    return new RegExp(`\\b(?:${det})\\s+${s}\\b`).test(lower)
  })
}

function scanDefiniteForm(guestText, knownTexts = []) {
  const body = guestBody(guestText)
  const known = knownTexts.map((t) => guestBody(t)).join('\n')
  const re =
    /([A-Za-zÅÄÖåäö]{3,}(?:en|et|na))\s+(där|som|du|hon|han|ni|jag|hen)\b/gi
  const found = []
  const seen = new Set()
  let m
  while ((m = re.exec(body))) {
    const word = m[1]
    const key = word.toLowerCase()
    if (DEFINITE_SKIP.has(key) || seen.has(key)) continue
    const stems = definiteStems(word)
    if (!stems.length) continue
    const before = known + '\n' + body.slice(0, m.index)
    if (introducedIndefinite(before, stems)) continue
    seen.add(key)
    found.push(word)
  }
  return found
}

function formatRoster(guest, crewMeta) {
  const skutor = crewMeta
    .map((c) => (c.id === guest.crewId ? `${c.name} ← YOU` : c.name))
    .join(', ')

  const pirateLines = crewMeta.map((c) => {
    const names = c.members
      .map((m) =>
        m.slug === guest.slug ? `**${m.pirateName} ← YOU**` : m.pirateName,
      )
      .join(', ')
    return `- ${c.name}: ${names}`
  })

  return `SKUTOR (lag): ${skutor}

PIRATNAMN:
${pirateLines.join('\n')}`
}

function definiteCandidates(guest) {
  const guestText = read(guest.guestPath)
  const known = [read(INTRO_PATH)]
  if (guest.crewPath) known.push(read(guest.crewPath))
  return scanDefiniteForm(guestText, known)
}

function buildPrompt(guest, crewMeta) {
  if (!guest.crewPath) {
    throw new Error(`${guest.slug}: saknar crew_id, kan inte bygga prompt`)
  }

  const roster = formatRoster(guest, crewMeta)
  const definite = definiteCandidates(guest)
  const definiteLine = definite.length ? definite.join(', ') : 'none'

  return `You are a clarity auditor. Evaluate whether one larp character briefing can stand on its own.

STRICT RULES:
- Use the Read tool ONLY on these three files, then stop. No other files. No Grep, Glob, or exploration.
  1. ${guest.guestPath}
  2. ${guest.crewPath}
  3. ${INTRO_PATH}
- Do not use any outside knowledge of this larp or this project. Do not infer from training data.
- YAML between --- fences and \`{slug:...}\` tags in headings are metadata the guest does not see. Ignore them.
- Do not invent explanations for unexplained terms.

READER IDENTITY: You are **${guest.pirateName}** of **${guest.crewName}**. This is YOU. This is YOUR TEAM.

KNOWN TO THE READER (do not flag these as unexplained):

${roster}

Also known:
- Salmonellahavet and Ovanan are known words (the sea and the island). The intro names them.
- Gymmet and Storstugan are buildings on the island. Do not flag them as unexplained.
- Gubben i stubben and Gumman på udden are clues you can work out from the names (a stump, a point of land). Do not ask for a further explanation of what they are.
- Team-treasure doors (lagskatter): each crew built its own doors. They already know how to handle them. Intrigue text about a code digit, "nästa ledtråd", an achilles heel, or the first step toward another crew's treasure is a reminder, not a new mechanic. Do not flag those as unexplained.
- Svarta Malin's secret lover: the identity is a secret Malin already knows. The name must not appear in guest text. Do not flag that the lover is unnamed, for Malin or for anyone hunting the name. Kapten Dunka as a visible decoy is intentional.

TASK: After reading those three files, evaluate how well YOU can understand your character and what is going on.

Look for three kinds of gap. All belong in TERMS.

1. Unexplained mentions: concepts, items, events, places, or mechanics that are named but never explained. The text incorrectly assumes you already understand them. Pirate names, team names, Salmonellahavet, Ovanan, Gymmet, Storstugan, Gubben i stubben, Gumman på udden, and team-treasure doors need no explanation.

2. Empty knowledge (more serious than an unexplained prop): the text asserts that YOU already know, have heard, have seen, or have already chosen a specific fact, but the three documents never state the content of that fact. Search the body for claims like "du vet", "du vet redan", "du känner till", "du har sett", "bara du vet", "du är den enda som vet", "du har hört". Then ask: can I, from these three files alone, say WHAT it is that I know? If no, it is empty knowledge.
   - Flag it even if the surrounding plot is otherwise playable.
   - Do not flag "du vet inte" / "du anar inte" (those tell you that you lack knowledge).
   - Do not flag knowledge the same paragraph just stated (e.g. "din dövhet är påhitt … du vet att den är påhitt").
   - Do not flag team-treasure doors (the crew already knows those).
   - If the text then tells you to act on that fact (say it, withhold it, use it, choose based on it), the rating is red. You cannot play "I already know X" when X is missing.

3. Definite form without introduction (Swedish bestämd form). The first mention of a specific object or event is in definite form (-en, -et, -na) as if you already knew which one. Example: "jollen du kapade i dimman" without first establishing that there was a dinghy and that you cut it. Flag even when a relative clause is attached ("skålen där du kallade henne en fasa till kapten") if that is the first mention of the thing. Do not flag festen, hamnen, ön, kajen, gymmet, Storstugan, team-treasure doors, body parts, or a thing already introduced as "en X" / "ett X".
   Heuristic candidates in this file (verify each; skip flavor and anything already introduced): ${definiteLine}

OUTPUT exactly this structure, in Swedish:
RATING: green | yellow | red
(green = can act on everything; leftover questions are flavor. yellow = can play but some mentioned things lack explanation. red = cannot understand a central plot/instruction without guessing, including any empty-knowledge claim you are told to act on)
TERMS: comma-separated list of unexplained terms/concepts/items/events AND empty-knowledge claims AND definite-form-without-intro, or "none"
EMPTY-KNOWLEDGE: each claim where the text says you already know something but never states what; quote a short phrase and say what is missing. or "none"
UNDERSTANDING: 4-8 sentences: who you are, what you want this weekend, what is unclear.
Do not suggest rewrites.
`
}

function printList({ guests, crewMeta }) {
  console.log(`${guests.length} gäster, ${crewMeta.length} lag.\n`)
  console.log('slug'.padEnd(22), 'piratnamn'.padEnd(22), 'lag')
  for (const g of guests) {
    console.log(
      g.slug.padEnd(22),
      (g.pirateName || '?').padEnd(22),
      `${g.crewName || '?'} (${g.crewId ?? '?'})`,
    )
  }
  console.log(`
Rutin: content/intriger/clarity-review.md
Prompt för en gäst: node scripts/clarity-review.js --prompt <slug>
Bestämd form:       node scripts/clarity-review.js --scan <slug>
Alla promptfiler:   node scripts/clarity-review.js --write-prompts
JSON:               node scripts/clarity-review.js --json`)
}

function writePrompts({ guests, crewMeta }) {
  mkdirSync(PROMPTS_DIR, { recursive: true })
  const index = []
  for (const g of guests) {
    const prompt = buildPrompt(g, crewMeta)
    const file = join(PROMPTS_DIR, `${g.slug}.txt`)
    writeFileSync(file, prompt)
    index.push({
      slug: g.slug,
      pirateName: g.pirateName,
      crewId: g.crewId,
      crewName: g.crewName,
      promptFile: file,
      guestPath: g.guestPath,
      crewPath: g.crewPath,
      introPath: INTRO_PATH,
    })
  }
  writeFileSync(join(PROMPTS_DIR, 'index.json'), JSON.stringify(index, null, 2) + '\n')
  console.log(`Skrev ${guests.length} promptfiler + index.json → ${PROMPTS_DIR}`)
}

const data = loadRoster()

if (flag('--json')) {
  console.log(JSON.stringify(data, null, 2))
} else if (flag('--prompt')) {
  const slug = after('--prompt')
  const guest = data.guests.find((g) => g.slug === slug)
  if (!guest) {
    console.error(`Okänd slug: ${slug}`)
    process.exit(1)
  }
  process.stdout.write(buildPrompt(guest, data.crewMeta))
} else if (flag('--scan')) {
  const slug = after('--scan')
  const guest = data.guests.find((g) => g.slug === slug)
  if (!guest) {
    console.error(`Okänd slug: ${slug}`)
    process.exit(1)
  }
  const found = definiteCandidates(guest)
  console.log(found.length ? found.join(', ') : 'none')
} else if (flag('--write-prompts')) {
  writePrompts(data)
} else {
  printList(data)
}
