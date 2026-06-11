// Renderar "Tema"-sektionen från practical_info-tabellen.
// theme_intro: prosa-paragraf högst upp.
// theme_fits / theme_doesnt_fit: två-kolumners +/- bullet-listor.
//
// Format i DB:
//   **Header:**
//   * item ett
//   * item två

import { escapeHtml } from '../lib/escape.js'
import { fetchPracticalMap, formatPracticalMarkdown } from './practical-info.js'

function renderBulletColumn(raw, variant) {
  if (!raw) return ''
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean)
  // Första raden = rubrik (typiskt "**Pluskonto:**"). Resten = "* item".
  const header = lines[0]
  const items = lines.slice(1)
    .filter((l) => l.startsWith('* ') || l.startsWith('- '))
    .map((l) => l.slice(2).trim())
  const headerHtml = `<h3 class="theme-col__title">${formatPracticalMarkdown(header)}</h3>`
  const list = items.length
    ? `<ul class="theme-list theme-list--${variant}">${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`
    : ''
  return `<div class="theme-col theme-col--${variant}">${headerHtml}${list}</div>`
}

export async function renderThemeSection(el) {
  const { map, error } = await fetchPracticalMap()
  if (error) {
    el.textContent = 'Kunde inte ladda temat.'
    return
  }
  const intro = map.theme_intro
    ? `<p class="theme-item">${formatPracticalMarkdown(map.theme_intro)}</p>`
    : ''
  const columns = `
    <div class="theme-columns">
      ${renderBulletColumn(map.theme_fits, 'plus')}
      ${renderBulletColumn(map.theme_doesnt_fit, 'minus')}
    </div>
  `
  el.innerHTML = `
    <h2>Tema</h2>
    <div class="theme-body">${intro}${columns}</div>
  `
}
