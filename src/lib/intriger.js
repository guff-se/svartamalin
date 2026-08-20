// Statiska intriger från content/intriger/{crews,guests}/*.md
// Bundlas vid build; UI filtrerar på inloggad gästs login_slug / crew_id.

import { pirateCardHtml, DEFAULT_OVERLAY } from '../components/pirate-card.js'
import { overlayForGuest } from './card-frame-assignments.js'
import { escapeHtml } from './escape.js'
import { GUEST_REAL_NAMES } from './guest-real-names.js'
import { portraitPath } from './portraits.js'
import { supabase } from './supabase.js'

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
 * @typedef {{ title: string, body: string, slug?: string | null, portraitSrc?: string | null }} Intrig
 * @typedef {{ meta: Record<string, unknown>, intrigues: Intrig[] }} IntrigDoc
 */

/** Rubrik-annotering: `## Titel {slug:login_slug}` */
const SLUG_ATTR_RE = /\s*\{slug:\s*([a-z0-9_]+)\s*\}\s*$/i

/** @param {string} path */
function fileKey(path) {
  const base = path.split('/').pop() ?? ''
  return base.replace(/\.md$/i, '')
}

/** Minimal markdown — **bold** + radbrytningar (samma som content/copy). */
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
 * @param {string | null | undefined} slug
 * @returns {string | null}
 */
export function portraitSrcForSlug(slug) {
  if (!slug) return null
  const realName = GUEST_REAL_NAMES[slug]
  return realName ? portraitPath(realName) : null
}

/**
 * Dela body i intriger på ##-rubriker. Text före första ## ignoreras.
 * Rubrik får valfri `{slug:login_slug}` — syns inte i UI, styr mini-porträtt.
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
    const rawTitle = (nl === -1 ? chunk : chunk.slice(0, nl)).trim()
    const text = (nl === -1 ? '' : chunk.slice(nl + 1)).trim()
    const slugMatch = rawTitle.match(SLUG_ATTR_RE)
    const slug = slugMatch ? slugMatch[1].toLowerCase() : null
    const title = slugMatch ? rawTitle.slice(0, slugMatch.index).trim() : rawTitle
    if (!title && !text) continue
    out.push({
      title,
      body: text,
      slug,
      portraitSrc: portraitSrcForSlug(slug),
    })
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

/**
 * Hämta gäst+piratnamn för intrig-slugs (via real_name — exponerar inte login_slug).
 * @param {Intrig[]} intrigues
 * @returns {Promise<Record<string, { id: string, real_name: string, pirate_name: string | null, pirate_name_id: number | null }>>}
 */
export async function fetchIntrigerGuests(intrigues) {
  /** @type {Record<string, string>} */
  const realToSlug = {}
  for (const i of intrigues ?? []) {
    if (!i.slug) continue
    const rn = GUEST_REAL_NAMES[i.slug]
    if (rn) realToSlug[rn] = i.slug
  }
  const names = Object.keys(realToSlug)
  /** @type {Record<string, { id: string, real_name: string, pirate_name: string | null, pirate_name_id: number | null }>} */
  const bySlug = {}
  if (!names.length) return bySlug

  const { data: guests } = await supabase
    .from('guests')
    .select('id, real_name, pirate_name_id')
    .in('real_name', names)

  const ids = (guests ?? []).map((g) => g.pirate_name_id).filter(Boolean)
  const { data: pnames } = ids.length
    ? await supabase.from('pirate_names').select('id, name').in('id', ids)
    : { data: [] }
  const nameMap = Object.fromEntries((pnames ?? []).map((n) => [n.id, n.name]))

  for (const g of guests ?? []) {
    const slug = realToSlug[g.real_name]
    if (!slug) continue
    bySlug[slug] = {
      id: g.id,
      real_name: g.real_name,
      pirate_name_id: g.pirate_name_id,
      pirate_name: g.pirate_name_id != null ? (nameMap[g.pirate_name_id] ?? null) : null,
    }
  }
  return bySlug
}

/**
 * HTML för en lista intriger (redan filtrerad).
 * @param {Intrig[]} intrigues
 * @param {Record<string, { id: string, real_name: string, pirate_name: string | null, pirate_name_id: number | null }>} [guestsBySlug]
 * @param {{ showCards?: boolean }} [opts] — `showCards: false` för lagintriger (ingen mini-porträtt)
 */
export function intrigerListHtml(intrigues, guestsBySlug = {}, opts = {}) {
  if (!intrigues?.length) return ''
  const showCards = opts.showCards !== false
  return `
    <ul class="intriger-list${showCards ? '' : ' intriger-list--text-only'}">
      ${intrigues.map((i) => {
        const g = i.slug ? guestsBySlug[i.slug] : null
        const card = showCards
          ? `
          <div class="intrig__card">
            ${pirateCardHtml({
              photoSrc: i.portraitSrc ?? undefined,
              pirateName: g?.pirate_name || '…',
              placeholder: !i.portraitSrc,
              overlaySrc: g
                ? overlayForGuest({ id: g.id, pirate_name_id: g.pirate_name_id })
                : DEFAULT_OVERLAY,
            })}
          </div>`
          : ''
        return `
        <li class="intrig">
          ${card}
          <div class="intrig__text">
            <h3 class="intrig__title">${formatMd(i.title)}</h3>
            <div class="intrig__body">${formatMd(i.body)}</div>
          </div>
        </li>`
      }).join('')}
    </ul>
  `
}
