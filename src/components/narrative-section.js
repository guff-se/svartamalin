// Generic narrative-section renderer — fetch:ar text från practical_info[key]
// och skriver h2 (om title given) + paragrafer i el. Stöd för minimal
// markdown: **fet** och paragrafer (dubbla radbrytningar).

import { fetchPracticalMap, formatPracticalMarkdown } from './practical-info.js'

const cache = { map: null, promise: null }

async function getMap() {
  if (cache.map) return cache.map
  if (!cache.promise) {
    cache.promise = fetchPracticalMap().then((r) => {
      cache.map = r.map ?? {}
      return cache.map
    })
  }
  return cache.promise
}

/**
 * Rendera text-sektion i `el`.
 *   title — om satt: h2 ovanför brödtext
 *   key   — practical_info-nyckel för brödtext
 */
export async function renderNarrative(el, { title, key } = {}) {
  if (!el) return
  const map = await getMap()
  const raw = map?.[key]
  if (!raw) { el.textContent = '' ; return }
  el.innerHTML = `
    ${title ? `<h2>${escapeText(title)}</h2>` : ''}
    ${formatParagraphs(raw)}
  `
}

function escapeText(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
}

function formatParagraphs(s) {
  return s
    .split(/\n{2,}/)
    .map((p) => {
      const trimmed = p.trim()
      const h3 = trimmed.match(/^###\s+([\s\S]+)$/)
      if (h3) return `<h3>${formatPracticalMarkdown(h3[1].trim())}</h3>`
      const h2 = trimmed.match(/^##\s+([\s\S]+)$/)
      if (h2) return `<h2>${formatPracticalMarkdown(h2[1].trim())}</h2>`
      return `<p>${formatPracticalMarkdown(trimmed)}</p>`
    })
    .join('')
}
