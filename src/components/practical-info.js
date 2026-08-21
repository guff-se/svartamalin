// Copy-texter (praktisk info, manifest, tema, Ovanan m.m.) ligger som markdown
// i content/copy/*.md — versioneras i git och redigeras direkt i repot.
// Inte i Supabase. Nyckel = filnamn utan .md. Renderingen sker i narrative-section.js och webgl.js.

import { escapeHtml } from '../lib/escape.js'

// Minimal markdown — **bold**, [text](url) + radbrytningar.
// Länkar: http/https (ny flik) eller samma-origin-sökväg som börjar med /.
export function formatPracticalMarkdown(s) {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[\w./%-]+)\)/g,
      (_, text, href) => {
        if (href.startsWith('/')) {
          const isFile = /\.[a-z0-9]+$/i.test(href)
          return isFile
            ? `<a href="${href}" download>${text}</a>`
            : `<a href="${href}">${text}</a>`
        }
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
      },
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
