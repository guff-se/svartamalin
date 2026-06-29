#!/usr/bin/env node
/**
 * Transcribe audio with ElevenLabs Scribe v2 (word-level timestamps).
 *
 * Usage:
 *   ELEVENLABS_API_KEY=... node scripts/transcribe-audio.js [audio-file]
 *
 * Defaults to "Martin Ljung - Svarta Malin.m4a" in project root.
 * Writes pristine STT output, then applies lyric corrections:
 *   public/data/svarta-malin-transcript-stt.json  (full API response, untouched)
 *   public/data/svarta-malin-words-stt.json       (STT words only)
 *   public/data/svarta-malin-transcript.json      (lyrics-aligned, for subtitles + animation)
 *   public/data/svarta-malin-words.json           (lyrics-aligned compact)
 *   public/data/svarta-malin-subtitle-lines.json  (line breaks for subtitles only)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { basename, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

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
const sttOut = join(outDir, `${slug}-transcript-stt.json`)
const sttWordsOut = join(outDir, `${slug}-words-stt.json`)

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
writeFileSync(sttOut, JSON.stringify(data, null, 2))

const words = data.words
  .filter((w) => w.type === 'word')
  .map((w, i) => ({ i, text: w.text, start: w.start, end: w.end, ms: Math.round(w.start * 1000) }))

const compact = {
  text: data.text,
  language: data.language_code,
  duration: data.audio_duration_secs ?? words.at(-1)?.end,
  words,
}
writeFileSync(sttWordsOut, JSON.stringify(compact, null, 2))

console.log(`Done: ${words.length} words, ${compact.duration?.toFixed(1)}s`)
console.log(`  ${sttOut}`)
console.log(`  ${sttWordsOut}`)

console.log('Applying lyric alignment…')
const fix = spawnSync('node', ['scripts/fix-transcript-lyrics.js'], { cwd: root, stdio: 'inherit' })
if (fix.status !== 0) process.exit(fix.status ?? 1)
