// Copy-texter (praktisk info, manifest, tema, Ovanan m.m.) ligger som markdown
// i content/copy/*.md — versioneras i git och redigeras direkt i repot.
// Inte i Supabase. Nyckel = filnamn utan .md. Renderingen sker i narrative-section.js och webgl.js.

import { escapeHtml } from '../lib/escape.js'

// Minimal markdown — **bold**, [text](https://…) + radbrytningar.
// Bara http/https i länkar: texten går genom innerHTML.
export function formatPracticalMarkdown(s) {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )
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
