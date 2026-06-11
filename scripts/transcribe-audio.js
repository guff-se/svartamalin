#!/usr/bin/env node
/**
 * Transcribe audio with ElevenLabs Scribe v2 (word-level timestamps).
 *
 * Usage:
 *   ELEVENLABS_API_KEY=... node scripts/transcribe-audio.js [audio-file]
 *
 * Defaults to "Martin Ljung - Svarta Malin.m4a" in project root.
 * Writes:
 *   public/data/svarta-malin-transcript.json  (full API response)
 *   public/data/svarta-malin-words.json       (words only, for animation sync)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { basename, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const apiKey = process.env.ELEVENLABS_API_KEY
if (!apiKey) {
  console.error('Missing ELEVENLABS_API_KEY')
  process.exit(1)
}

const input = process.argv[2] ?? join(root, 'Martin Ljung - Svarta Malin.m4a')
const outDir = join(root, 'public/data')
mkdirSync(outDir, { recursive: true })

const slug = process.argv[2]
  ? basename(input, '.m4a').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  : 'svarta-malin'
const fullOut = join(outDir, `${slug}-transcript.json`)
const wordsOut = join(outDir, `${slug}-words.json`)

const form = new FormData()
form.append('model_id', 'scribe_v2')
form.append('file', new Blob([readFileSync(input)]), basename(input))
form.append('language_code', 'sv')
form.append('timestamps_granularity', 'word')
form.append('tag_audio_events', 'false')

console.log(`Transcribing ${input}…`)
const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
  method: 'POST',
  headers: { 'xi-api-key': apiKey },
  body: form,
})

if (!res.ok) {
  console.error(`API error ${res.status}:`, await res.text())
  process.exit(1)
}

const data = await res.json()
writeFileSync(fullOut, JSON.stringify(data, null, 2))

const words = data.words
  .filter((w) => w.type === 'word')
  .map((w, i) => ({ i, text: w.text, start: w.start, end: w.end, ms: Math.round(w.start * 1000) }))

const compact = {
  text: data.text,
  language: data.language_code,
  duration: data.audio_duration_secs ?? words.at(-1)?.end,
  words,
}
writeFileSync(wordsOut, JSON.stringify(compact, null, 2))

console.log(`Done: ${words.length} words, ${compact.duration?.toFixed(1)}s`)
console.log(`  ${fullOut}`)
console.log(`  ${wordsOut}`)
