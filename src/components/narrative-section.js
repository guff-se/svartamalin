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
  let out = ''
  let inList = false

  // Punktlistor får stå som separata block med blankrad emellan — angränsande
  // listblock slås ihop till en och samma <ul>.
  const closeList = () => {
    if (inList) { out += '</ul>'; inList = false }
  }

  for (const block of s.split(/\n{2,}/)) {
    const trimmed = block.trim()
    if (!trimmed) continue

    const items = listItems(trimmed)
    if (items) {
      if (!inList) { out += '<ul>'; inList = true }
      out += items.map((item) => `<li>${formatPracticalMarkdown(item)}</li>`).join('')
      continue
    }

    closeList()
    const h3 = trimmed.match(/^###\s+([\s\S]+)$/)
    if (h3) { out += `<h3>${formatPracticalMarkdown(h3[1].trim())}</h3>`; continue }
    const h2 = trimmed.match(/^##\s+([\s\S]+)$/)
    if (h2) { out += `<h2>${formatPracticalMarkdown(h2[1].trim())}</h2>`; continue }
    out += `<p>${formatPracticalMarkdown(trimmed)}</p>`
  }

  closeList()
  return out
}

// Returnerar punkterna om hela blocket är en lista, annars null.
function listItems(block) {
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
  if (!lines.length || !lines.every((l) => /^[*-]\s+/.test(l))) return null
  return lines.map((l) => l.replace(/^[*-]\s+/, ''))
}
