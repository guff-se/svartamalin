#!/usr/bin/env node
// Hämtar gästernas karaktärsunderlag från Supabase → content/roller/{login_slug}.md
//
// Kör: `npm run fetch-roller`  (eller `node scripts/fetch-roller.js`)
// Kräver VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY i .env.local.

import { createClient } from '@supabase/supabase-js'
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_DIR = resolve(ROOT, 'content/roller')
const README_NAME = 'README.md'
const KEEP_FILES = new Set([README_NAME])

const FIELDS = [
  { col: 'character_facts', heading: 'Karaktär' },
  { col: 'character_object', heading: 'Föremål' },
  { col: 'character_skill', heading: 'Göra / inte göra' },
  { col: 'character_play_with', heading: 'Övrigt' },
]

const META_FIELDS = [
  { key: 'pirate_name', heading: 'Piratnamn' },
  { key: 'real_name', heading: 'Riktigt namn' },
  { key: 'crew', heading: 'Skuta' },
  { key: 'crew_id', heading: 'crew_id' },
]

loadEnvLocal()

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error('Saknar VITE_SUPABASE_URL eller VITE_SUPABASE_ANON_KEY — lägg dem i .env.local')
  process.exit(1)
}

const supabase = createClient(url, key)

const { data: guests, error: guestErr } = await supabase
  .from('guests')
  .select(
    [
      'login_slug',
      'real_name',
      'crew_id',
      'pirate_name_id',
      ...FIELDS.map((f) => f.col),
    ].join(', '),
  )
  .eq('attending', true)
  .order('login_slug')

if (guestErr) {
  console.error('Kunde inte hämta gäster:', guestErr.message)
  process.exit(1)
}

const [{ data: crews, error: crewErr }, { data: names, error: nameErr }] = await Promise.all([
  supabase.from('crews').select('id, name').order('id'),
  supabase.from('pirate_names').select('id, name'),
])

if (crewErr) {
  console.error('Kunde inte hämta lag:', crewErr.message)
  process.exit(1)
}
if (nameErr) {
  console.error('Kunde inte hämta piratnamn:', nameErr.message)
  process.exit(1)
}

const crewById = Object.fromEntries((crews ?? []).map((c) => [c.id, c.name]))
const pirateById = Object.fromEntries((names ?? []).map((n) => [n.id, n.name]))

mkdirSync(OUT_DIR, { recursive: true })

const written = new Set()
/** @type {Change[]} */
const changes = []
let unchanged = 0
let filled = 0
let empty = 0

for (const g of guests ?? []) {
  const slug = g.login_slug
  if (!slug) continue
  const pirateName = g.pirate_name_id != null ? (pirateById[g.pirate_name_id] ?? null) : null
  const crewName = g.crew_id != null ? (crewById[g.crew_id] ?? null) : null
  const hasAny = FIELDS.some((f) => trimField(g[f.col]))
  if (hasAny) filled += 1
  else empty += 1

  const next = renderGuestMd({
    slug,
    realName: g.real_name,
    pirateName,
    crewId: g.crew_id,
    crewName,
    fields: Object.fromEntries(FIELDS.map((f) => [f.col, g[f.col]])),
  })

  const fileName = `${slug}.md`
  const filePath = resolve(OUT_DIR, fileName)
  const prev = existsSync(filePath) ? readFileSync(filePath, 'utf8') : null

  if (prev === next) {
    unchanged += 1
  } else {
    const type = prev == null ? 'added' : 'changed'
    changes.push(diffGuest(type, slug, prev, next))
    writeFileSync(filePath, next)
  }
  written.add(fileName)
}

for (const name of readdirSync(OUT_DIR)) {
  if (!name.endsWith('.md') || KEEP_FILES.has(name)) continue
  if (written.has(name)) continue
  const filePath = resolve(OUT_DIR, name)
  const prev = readFileSync(filePath, 'utf8')
  const slug = name.replace(/\.md$/i, '')
  changes.push(diffGuest('removed', slug, prev, null))
  unlinkSync(filePath)
}

if (changes.length) {
  for (const c of changes) {
    const mark = c.type === 'added' ? '+' : c.type === 'removed' ? '-' : '~'
    const fields = c.diffs.map((d) => d.heading).join(', ') || '—'
    console.log(`  ${mark} ${c.slug} (${fields})`)
  }
}

const nChanged = changes.filter((c) => c.type === 'changed').length
const nAdded = changes.filter((c) => c.type === 'added').length
const nRemoved = changes.filter((c) => c.type === 'removed').length

console.log(
  `Roller: ${unchanged} oförändrade` +
    `, ${nChanged} ändrade, ${nAdded} nya, ${nRemoved} borttagna` +
    ` (${filled} ifyllda, ${empty} tomma)`,
)

/**
 * @typedef {{ heading: string, before: string, after: string }} FieldDiff
 * @typedef {{ type: 'added' | 'changed' | 'removed', slug: string, pirateName: string | null, realName: string | null, diffs: FieldDiff[] }} Change
 */

/**
 * @param {'added' | 'changed' | 'removed'} type
 * @param {string} slug
 * @param {string | null} prev
 * @param {string | null} next
 * @returns {Change}
 */
function diffGuest(type, slug, prev, next) {
  const before = parseGuestMd(prev)
  const after = parseGuestMd(next)
  const pirateName = after.fm.pirate_name || before.fm.pirate_name || null
  const realName = after.fm.real_name || before.fm.real_name || null
  /** @type {FieldDiff[]} */
  const diffs = []

  for (const meta of META_FIELDS) {
    const a = stringifyMeta(before.fm[meta.key])
    const b = stringifyMeta(after.fm[meta.key])
    if (a === b) continue
    if (type === 'added' && !b) continue
    if (type === 'removed' && !a) continue
    diffs.push({ heading: meta.heading, before: a, after: b })
  }

  for (const field of FIELDS) {
    const a = before.sections[field.heading] ?? ''
    const b = after.sections[field.heading] ?? ''
    if (a === b) continue
    if (type === 'added' && !b) continue
    if (type === 'removed' && !a) continue
    diffs.push({ heading: field.heading, before: a, after: b })
  }

  return { type, slug, pirateName, realName, diffs }
}

function stringifyMeta(value) {
  if (value == null || value === '') return ''
  return String(value)
}

/** @param {string | null | undefined} md */
function parseGuestMd(md) {
  /** @type {Record<string, string | null>} */
  const fm = {}
  /** @type {Record<string, string>} */
  const sections = {}
  if (!md) return { fm, sections }

  let body = md
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---', 3)
    if (end !== -1) {
      for (const line of md.slice(4, end).split('\n')) {
        const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
        if (!m) continue
        let val = m[2].trim()
        if (val === 'null') val = ''
        else if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          try {
            val = JSON.parse(val)
          } catch {
            val = val.slice(1, -1)
          }
        }
        fm[m[1]] = val
      }
      body = md.slice(end + 4)
    }
  }

  const parts = body.split(/^## /m)
  for (let i = 1; i < parts.length; i++) {
    const chunk = parts[i]
    const nl = chunk.indexOf('\n')
    const heading = (nl === -1 ? chunk : chunk.slice(0, nl)).trim()
    let text = (nl === -1 ? '' : chunk.slice(nl + 1)).trim()
    if (text === '_Tomt._') text = ''
    sections[heading] = text
  }
  return { fm, sections }
}

function renderGuestMd({ slug, realName, pirateName, crewId, crewName, fields }) {
  const title = pirateName || realName
  const lines = [
    '---',
    `slug: ${yamlScalar(slug)}`,
    `real_name: ${yamlScalar(realName)}`,
    `pirate_name: ${pirateName ? yamlScalar(pirateName) : 'null'}`,
    `crew_id: ${crewId == null ? 'null' : crewId}`,
    `crew: ${crewName ? yamlScalar(crewName) : 'null'}`,
    '---',
    '',
    `# ${title}`,
    '',
  ]

  const metaBits = []
  if (pirateName && realName) metaBits.push(realName)
  if (crewName) metaBits.push(crewName)
  if (metaBits.length) {
    lines.push(metaBits.join(' · '))
    lines.push('')
  }

  for (const field of FIELDS) {
    const body = trimField(fields[field.col])
    lines.push(`## ${field.heading}`)
    lines.push('')
    lines.push(body || '_Tomt._')
    lines.push('')
  }

  return lines.join('\n')
}

function trimField(value) {
  if (value == null) return ''
  return String(value).trim()
}

/** Minimal YAML scalar: quote only when needed. */
function yamlScalar(value) {
  const str = String(value)
  if (
    str === '' ||
    /[:#{}[\],&*?|<>=!%@`'"]/.test(str) ||
    /^\s|\s$/.test(str) ||
    /^(true|false|null|~)$/i.test(str)
  ) {
    return JSON.stringify(str)
  }
  return str
}

function loadEnvLocal() {
  const p = resolve(ROOT, '.env.local')
  if (!existsSync(p)) return
  for (const raw of readFileSync(p, 'utf8').split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let val = line.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (process.env[key] == null) process.env[key] = val
  }
}
