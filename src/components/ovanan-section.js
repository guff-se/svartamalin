import { fetchPracticalMap, formatPracticalMarkdown, OVANAN_LABELS } from './practical-info.js'

const MAP_SRC = '/images/maps/ovanan-v9.jpg'

const INTRO_KEY = 'ovanan_intro'
const BLOCK_KEYS = ['ovanan_accommodation', 'ovanan_resources']

function ovananBlockHtml(key, map) {
  const value = map[key]
  if (!value) return ''
  const label = OVANAN_LABELS[key]
  return `
    <div class="ovanan-block">
      ${label ? `<h3>${label}</h3>` : ''}
      <p>${formatPracticalMarkdown(value)}</p>
    </div>
  `
}

function ovananSectionHtml(map) {
  const intro = map[INTRO_KEY] || map.location
  return `
    <h2>Ovanan</h2>
    <div class="ovanan-layout">
      <figure class="ovanan-map">
        <img
          src="${MAP_SRC}"
          alt="Handritad karta över ön Ovanan i Mälaren"
          width="1024"
          height="1536"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div class="ovanan-details">
        ${intro ? `<p class="lead">${formatPracticalMarkdown(intro)}</p>` : ''}
        ${BLOCK_KEYS.map((k) => ovananBlockHtml(k, map)).join('')}
      </div>
    </div>
  `
}

export async function renderOvananSection(el) {
  const { map, error } = await fetchPracticalMap()
  if (error) {
    el.textContent = 'Kunde inte ladda informationen.'
    return
  }
  el.innerHTML = ovananSectionHtml(map)
}
