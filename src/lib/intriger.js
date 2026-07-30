// Statiska intriger från content/intriger/{crews,guests}/*.md
// Bundlas vid build; UI filtrerar på inloggad gästs login_slug / crew_id.

import { escapeHtml } from './escape.js'

const crewRaw = import.meta.glob('../../content/intriger/crews/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const guestRaw = import.meta.glob('../../content/intriger/guests/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

/**
 * @typedef {{ title: string, body: string }} Intrig
 * @typedef {{ meta: Record<string, unknown>, intrigues: Intrig[] }} IntrigDoc
 */

/** @param {string} path */
function fileKey(path) {
  const base = path.split('/').pop() ?? ''
  return base.replace(/\.md$/i, '')
}

/** Minimal markdown — **bold** + radbrytningar (samma som practical_info). */
function formatMd(s) {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
}

/**
 * Minimal frontmatter: key: value | key: [a, b]
 * @param {string} raw
 * @returns {{ meta: Record<string, unknown>, body: string }}
 */
export function parseFrontmatter(raw) {
  const text = raw.replace(/^\uFEFF/, '')
  if (!text.startsWith('---')) return { meta: {}, body: text.trim() }
  const end = text.indexOf('\n---', 3)
  if (end === -1) return { meta: {}, body: text.trim() }
  const fm = text.slice(3, end).trim()
  const body = text.slice(end + 4).trim()
  /** @type {Record<string, unknown>} */
  const meta = {}
  for (const line of fm.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const m = t.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!m) continue
    const [, key, valRaw] = m
    const val = valRaw.trim()
    if (val.startsWith('[') && val.endsWith(']')) {
      meta[key] = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else if (val) {
      meta[key] = val.replace(/^["']|["']$/g, '')
    } else {
      meta[key] = true
    }
  }
  return { meta, body }
}

/**
 * Dela body i intriger på ##-rubriker. Text före första ## ignoreras.
 * @param {string} body
 * @returns {Intrig[]}
 */
export function splitIntriger(body) {
  if (!body.trim()) return []
  const parts = body.split(/^##\s+/m)
  /** @type {Intrig[]} */
  const out = []
  for (let i = 1; i < parts.length; i++) {
    const chunk = parts[i]
    const nl = chunk.indexOf('\n')
    const title = (nl === -1 ? chunk : chunk.slice(0, nl)).trim()
    const text = (nl === -1 ? '' : chunk.slice(nl + 1)).trim()
    if (!title && !text) continue
    out.push({ title, body: text })
  }
  return out
}

/** @param {string} raw @returns {IntrigDoc} */
export function parseIntrigDoc(raw) {
  const { meta, body } = parseFrontmatter(raw)
  return { meta, intrigues: splitIntriger(body) }
}

/** @param {Record<string, string>} modules */
function indexByKey(modules) {
  /** @type {Record<string, IntrigDoc>} */
  const map = {}
  for (const [path, raw] of Object.entries(modules)) {
    map[fileKey(path)] = parseIntrigDoc(typeof raw === 'string' ? raw : '')
  }
  return map
}

const crewDocs = indexByKey(/** @type {Record<string, string>} */ (crewRaw))
const guestDocs = indexByKey(/** @type {Record<string, string>} */ (guestRaw))

/** @param {number | string | null | undefined} crewId */
export function getCrewIntriger(crewId) {
  if (crewId == null) return []
  return crewDocs[String(crewId)]?.intrigues ?? []
}

/** @param {string | null | undefined} loginSlug */
export function getGuestIntriger(loginSlug) {
  if (!loginSlug) return []
  return guestDocs[loginSlug]?.intrigues ?? []
}

/** HTML för en lista intriger (redan filtrerad). */
export function intrigerListHtml(intrigues) {
  if (!intrigues?.length) return ''
  return `
    <ul class="intriger-list">
      ${intrigues.map((i) => `
        <li class="intrig">
          <h3 class="intrig__title">${formatMd(i.title)}</h3>
          <div class="intrig__body">${formatMd(i.body)}</div>
        </li>
      `).join('')}
    </ul>
  `
}
