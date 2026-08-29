// Publika karaktärsbeskrivningar från content/karaktarer/*.md
// Bundlas vid build. Lookup via piratnamn.

const raw = import.meta.glob('../../content/karaktarer/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

/** @type {Map<string, string>} pirate_name (normalized) → blurb */
const byPirateName = new Map()

for (const [path, text] of Object.entries(raw)) {
  if (path.endsWith('/README.md')) continue
  const { meta, body } = parseFrontmatter(String(text))
  const name = typeof meta.pirate_name === 'string' ? meta.pirate_name.trim() : ''
  const blurb = body.trim()
  if (!name || !blurb) continue
  byPirateName.set(normalizePirateName(name), blurb)
}

/** @param {string} rawText */
function parseFrontmatter(rawText) {
  const text = rawText.replace(/^\uFEFF/, '')
  if (!text.startsWith('---')) return { meta: {}, body: text.trim() }
  const end = text.indexOf('\n---', 3)
  if (end === -1) return { meta: {}, body: text.trim() }
  const fm = text.slice(3, end).trim()
  const body = text.slice(end + 4).trim()
  /** @type {Record<string, string>} */
  const meta = {}
  for (const line of fm.split('\n')) {
    const m = line.trim().match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!m) continue
    meta[m[1]] = m[2].trim()
  }
  return { meta, body }
}

function normalizePirateName(s) {
  return String(s).toLowerCase().replace(/[–—]/g, '-')
}

/** @param {string | null | undefined} pirateName */
export function blurbForPirateName(pirateName) {
  if (!pirateName) return null
  return byPirateName.get(normalizePirateName(pirateName)) ?? null
}

/**
 * Wrap lightbox content with the public character blurb when available.
 * @param {Node} content
 * @param {string | null | undefined} pirateName
 * @returns {Node}
 */
export function withPirateBlurb(content, pirateName) {
  const text = blurbForPirateName(pirateName)
  if (!text) return content

  const figure = document.createElement('div')
  figure.className = 'pirate-card-lightbox__figure'
  figure.appendChild(content)

  const p = document.createElement('p')
  p.className = 'pirate-card-lightbox__blurb'
  p.textContent = text
  figure.appendChild(p)

  return figure
}
