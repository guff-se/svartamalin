// Minimal data-helper för practical_info-tabellen. Renderingen sker i
// narrative-section.js och webgl.js.

import { supabase } from '../lib/supabase.js'
import { escapeHtml } from '../lib/escape.js'

// Minimal markdown — **bold** + radbrytningar.
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
