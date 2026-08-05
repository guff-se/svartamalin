// Copy-texter (praktisk info, manifest, tema, Ovanan m.m.) ligger som markdown
// i content/copy/*.md — versioneras i git och redigeras direkt i repot.
// Nyckel = filnamn utan .md. Renderingen sker i narrative-section.js och webgl.js.

import { escapeHtml } from '../lib/escape.js'

// Minimal markdown — **bold** + radbrytningar.
export function formatPracticalMarkdown(s) {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
}

// Bundlas in vid build via Vite. eager → synkron access, raw → filens innehåll.
const files = import.meta.glob('/content/copy/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const COPY = Object.fromEntries(
  Object.entries(files).map(([path, raw]) => [
    path.split('/').pop().replace(/\.md$/, ''),
    String(raw).trim(),
  ]),
)

// Behåller async-signaturen så anropsställena (await) är oförändrade.
export async function fetchPracticalMap() {
  return { map: COPY }
}
