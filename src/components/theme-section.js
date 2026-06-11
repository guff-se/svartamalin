// Renderar "Tema"-sektionen från practical_info-tabellen.
// Tre nycklar: theme_intro (ingen rubrik), theme_fits, theme_doesnt_fit.

import { fetchPracticalMap, formatPracticalMarkdown } from './practical-info.js'

const THEME_KEYS = ['theme_intro', 'theme_fits', 'theme_doesnt_fit']

export async function renderThemeSection(el) {
  const { map, error } = await fetchPracticalMap()
  if (error) {
    el.textContent = 'Kunde inte ladda temat.'
    return
  }
  const items = THEME_KEYS
    .filter((k) => map[k])
    .map((k) => `<p class="theme-item">${formatPracticalMarkdown(map[k])}</p>`)
    .join('')
  el.innerHTML = `
    <h2>Tema</h2>
    <div class="theme-body">${items}</div>
  `
}
