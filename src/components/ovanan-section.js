import { bindLightboxTriggers } from '../lib/image-lightbox.js'
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
      <figure
        class="ovanan-map"
        tabindex="0"
        role="button"
        aria-label="Visa kartan över Ovanan i fullskärm"
      >
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

function bindMapLightbox(el) {
  bindLightboxTriggers(el, {
    selector: '.ovanan-map',
    getAriaLabel: (figure) => figure.querySelector('img')?.alt || 'Karta över Ovanan',
    getContent: (figure) => {
      const img = figure.querySelector('img')
      const wrap = document.createElement('div')
      wrap.className = 'pirate-card-lightbox__image'
      const w = Number(img?.getAttribute('width')) || 1024
      const h = Number(img?.getAttribute('height')) || 1536
      wrap.style.setProperty('--lightbox-aspect', `${w} / ${h}`)
      wrap.appendChild(img.cloneNode(true))
      return wrap
    },
  })
}

export async function renderOvananSection(el) {
  const { map, error } = await fetchPracticalMap()
  if (error) {
    el.textContent = 'Kunde inte ladda informationen.'
    return
  }
  el.innerHTML = ovananSectionHtml(map)
  bindMapLightbox(el)
}
