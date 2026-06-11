import { supabase } from '../lib/supabase.js'
import { escapeHtml } from '../lib/escape.js'

export const OVANAN_LABELS = {
  ovanan_intro: null,
  ovanan_accommodation: 'Boende',
  ovanan_resources: 'Resurser',
}

export const PRACTICAL_LABELS = {
  dates: 'Datum',
  transport_intro: 'Transport',
  boat_friday: 'Båt fredag',
  boat_sunday: 'Båt söndag',
  kids_policy: 'Barnpolicy',
  packing: 'Packning',
  teams_intro: 'Lagsystem',
}

export const RSVP_PRACTICAL_KEYS = ['dates', 'boat_friday']

const ORDER = [
  'dates',
  'transport_intro',
  'boat_friday',
  'boat_sunday',
  'kids_policy',
  'packing',
  'teams_intro',
]

// Minimal markdown — bara **bold** och radbrytningar.
export function formatPracticalMarkdown(s) {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
}

export async function fetchPracticalMap() {
  const { data, error } = await supabase
    .from('practical_info')
    .select('key, value')
  if (error) return { error }
  return { map: Object.fromEntries((data ?? []).map((r) => [r.key, r.value])) }
}

function practicalItemsHtml(keys, map, itemClass = 'info-item', showLabels = true) {
  return keys
    .filter((k) => map[k])
    .map((k) => `
      <div class="${itemClass}">
        ${showLabels ? `<h3>${escapeHtml(PRACTICAL_LABELS[k] ?? k)}</h3>` : ''}
        <p>${formatPracticalMarkdown(map[k])}</p>
      </div>
    `).join('')
}

export async function renderPracticalInfoKeys(el, keys) {
  const { map, error } = await fetchPracticalMap()
  if (error) {
    el.textContent = 'Kunde inte ladda informationen.'
    return
  }
  el.innerHTML = practicalItemsHtml(keys, map, 'rsvp-practical__item', false)
}

export async function renderPracticalInfo(el) {
  const { map, error } = await fetchPracticalMap()
  if (error) {
    el.textContent = 'Kunde inte ladda informationen.'
    return
  }
  el.innerHTML = practicalItemsHtml(ORDER, map, 'info-item')
}

