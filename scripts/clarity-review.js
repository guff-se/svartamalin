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

function buildPrompt(guest, crewMeta) {
  if (!guest.crewPath) {
    throw new Error(`${guest.slug}: saknar crew_id, kan inte bygga prompt`)
  }

  const roster = formatRoster(guest, crewMeta)

  return `You are a clarity auditor. Evaluate whether one larp character briefing can stand on its own.

STRICT RULES:
- Use the Read tool ONLY on these two files, then stop. No other files. No Grep, Glob, or exploration.
  1. ${guest.guestPath}
  2. ${guest.crewPath}
- Do not use any outside knowledge of this larp or this project. Do not infer from training data.
- YAML between --- fences and \`{slug:...}\` tags in headings are metadata the guest does not see. Ignore them.
- Do not invent explanations for unexplained terms.

READER IDENTITY: You are **${guest.pirateName}** of **${guest.crewName}**. This is YOU. This is YOUR TEAM.

KNOWN TO THE READER (everyone at the party; names and teams are known; do not flag these as unexplained):

${roster}

TASK: After reading those two files, evaluate how well YOU can understand your character and what is going on. Look for concepts, items, events, places, or mechanics that are MENTIONED but not EXPLAINED (the text incorrectly assumes you already understand them). Pirate names and team names from the roster need no explanation.

OUTPUT exactly this structure, in Swedish:
RATING: green | yellow | red
(green = can act on everything; leftover questions are flavor. yellow = can play but some mentioned things lack explanation. red = cannot understand a central plot/instruction without guessing)
TERMS: comma-separated list of unexplained terms/concepts/items/events, or "none"
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
} else if (flag('--write-prompts')) {
  writePrompts(data)
} else {
  printList(data)
}
