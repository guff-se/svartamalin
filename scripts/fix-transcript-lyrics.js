#!/usr/bin/env node
/**
 * Align official lyrics (svartamalin-sångtext.txt) onto ElevenLabs word
 * timestamps. Reads the pristine STT output and writes lyric-corrected
 * copies — the STT source is never modified.
 *
 *   public/data/svarta-malin-transcript-stt.json  ← ElevenLabs original (input)
 *   public/data/svarta-malin-words-stt.json       ← compact STT (input)
 *   public/data/svarta-malin-transcript.json      ← lyrics-corrected timings (output)
 *   public/data/svarta-malin-words.json           ← compact corrected (output)
 *   public/data/svarta-malin-subtitle-lines.json  ← line breaks for subtitles only (output)
 *
 * Usage: node scripts/fix-transcript-lyrics.js
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const lyricsPath = join(root, 'svartamalin-sångtext.txt')
const sttPath = join(root, 'public/data/svarta-malin-transcript-stt.json')
const sttWordsPath = join(root, 'public/data/svarta-malin-words-stt.json')
const transcriptPath = join(root, 'public/data/svarta-malin-transcript.json')
const wordsPath = join(root, 'public/data/svarta-malin-words.json')
const subtitleLinesPath = join(root, 'public/data/svarta-malin-subtitle-lines.json')

function tokenizeLyrics(text) {
  return text
    .replace(/\r/g, '')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean)
}

/** Non-empty lines from the lyrics sheet — used only for subtitle grouping. */
function parseLyricLines(text) {
  return text
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/\s+/).filter(Boolean))
}

function norm(w) {
  return w
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[.,!?:;…–—\-]/g, '')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/å/g, 'a')
    .replace(/é/g, 'e')
}

/** Pairs of normalized forms treated as the same STT slip. */
const EQUIV = [
  ['ja', 'jag'],
  ['de', 'dom'],
  ['dem', 'dom'],
  ['mig', 'mej'],
  ['sig', 'sej'],
  ['manniskor', 'mannskor'],
  ['vandblad', 'wennblad'],
  ['vaster', 'wester'],
  ['enok', 'enock'],
  ['raanok', 'raanock'],
  ['donik', 'donick'],
  ['loskagg', 'losskagg'],
  ['horring', 'hurring'],
  ['rasol', 'rasop'],
  ['vedholm', 'wedholm'],
  ['platon', 'plathorn'],
  ['ekade', 'kalle'],
  ['faj', 'fight'],
  ['rykten', 'rycken'],
  ['maj', 'right'],
  ['gaende', 'going'],
  ['kapten', 'kapen'],
  ['arland', 'erland'],
  ['knappten', 'knappten'], // knappt+en
  ['bogben', 'bordsben'],
]

function equiv(a, b) {
  if (a === b) return true
  return EQUIV.some(([x, y]) => (a === x && b === y) || (a === y && b === x))
}

function matchScore(a, b) {
  const na = norm(a)
  const nb = norm(b)
  if (!na || !nb) return -2
  if (na === nb || equiv(na, nb)) return 3
  if (na.startsWith(nb) || nb.startsWith(na)) return 2
  if (na.includes(nb) || nb.includes(na)) return 1
  return -1
}

function align(lyrics, transcriptTexts) {
  const n = lyrics.length
  const m = transcriptTexts.length
  const gap = -1
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0))
  const bt = Array.from({ length: n + 1 }, () => Array(m + 1).fill(null))

  for (let i = 1; i <= n; i++) {
    dp[i][0] = dp[i - 1][0] + gap
    bt[i][0] = 'up'
  }
  for (let j = 1; j <= m; j++) {
    dp[0][j] = dp[0][j - 1] + gap
    bt[0][j] = 'left'
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const diag = dp[i - 1][j - 1] + matchScore(lyrics[i - 1], transcriptTexts[j - 1])
      const up = dp[i - 1][j] + gap
      const left = dp[i][j - 1] + gap
      let best = diag
      let dir = 'diag'
      if (up > best) {
        best = up
        dir = 'up'
      }
      if (left > best) {
        best = left
        dir = 'left'
      }
      dp[i][j] = best
      bt[i][j] = dir
    }
  }

  let i = n
  let j = m
  const pairs = []
  while (i > 0 || j > 0) {
    const dir = bt[i][j]
    if (dir === 'diag') {
      pairs.unshift({ li: i - 1, ti: j - 1 })
      i--
      j--
    } else if (dir === 'up') {
      pairs.unshift({ li: i - 1, ti: null })
      i--
    } else {
      pairs.unshift({ li: null, ti: j - 1 })
      j--
    }
  }
  return pairs
}

function buildLyricToTrans(lyrics, transWords, pairs) {
  const lyricToTrans = new Map()
  const usedTrans = new Set()

  for (const { li, ti } of pairs) {
    if (li == null || ti == null) continue
    if (!lyricToTrans.has(li)) lyricToTrans.set(li, [])
    lyricToTrans.get(li).push(ti)
    usedTrans.add(ti)
  }

  // Merge consecutive unmatched transcript tokens into the previous lyric word
  // (e.g. salmonella, + havets → Salmonellahavets; det + samma → detsamma).
  for (let li = 0; li < lyrics.length; li++) {
    const tis = lyricToTrans.get(li)
    if (!tis?.length) continue
    const sorted = [...new Set(tis)].sort((a, b) => a - b)
    let next = sorted[sorted.length - 1] + 1
    while (next < transWords.length && !usedTrans.has(next)) {
      const merged = sorted
        .map((idx) => transWords[idx].text)
        .concat(transWords[next].text)
        .map(norm)
        .join('')
      const target = norm(lyrics[li])
      if (target.startsWith(merged) || merged.startsWith(target) || target === merged) {
        sorted.push(next)
        usedTrans.add(next)
        lyricToTrans.set(li, sorted)
        next++
      } else {
        break
      }
    }
  }

  // Split one transcript token across consecutive unmatched lyrics words
  // (e.g. Knappten → knappt + en).
  for (let li = 0; li < lyrics.length; li++) {
    const tis = lyricToTrans.get(li)
    if (!tis || tis.length !== 1) continue
    const ti = tis[0]
    if (usedTrans.has(ti + 1)) continue

    const run = [li]
    let lj = li + 1
    while (lj < lyrics.length && !lyricToTrans.has(lj)) {
      run.push(lj)
      lj++
    }
    if (run.length < 2) continue

    const combined = run.map((idx) => norm(lyrics[idx])).join('')
    const spoken = norm(transWords[ti].text)
    if (combined === spoken || spoken.startsWith(combined) || combined.startsWith(spoken)) {
      for (const idx of run) lyricToTrans.set(idx, [ti])
    }
  }

  return lyricToTrans
}

function splitDuration(start, end, parts) {
  const dur = Math.max(0.02, end - start)
  const step = dur / parts
  return Array.from({ length: parts }, (_, i) => ({
    start: start + step * i,
    end: i === parts - 1 ? end : start + step * (i + 1),
  }))
}

function buildTimedWords(lyrics, transWords, lyricToTrans) {
  const timed = []
  const splitGroups = new Map()

  for (const [li, tis] of lyricToTrans) {
    if (tis.length === 1) {
      const key = tis[0]
      if (!splitGroups.has(key)) splitGroups.set(key, [])
      splitGroups.get(key).push(li)
    }
  }

  for (let li = 0; li < lyrics.length; li++) {
    const tis = lyricToTrans.get(li)
    if (!tis?.length) continue

    if (tis.length > 1) {
      const first = transWords[tis[0]]
      const last = transWords[tis[tis.length - 1]]
      timed[li] = {
        text: lyrics[li],
        start: first.start,
        end: last.end,
        type: 'word',
      }
      continue
    }

    const ti = tis[0]
    const tw = transWords[ti]
    const group = splitGroups.get(ti)?.sort((a, b) => a - b) ?? [li]
    if (group.length > 1 && group[0] === li) {
      const slots = splitDuration(tw.start, tw.end, group.length)
      group.forEach((idx, i) => {
        timed[idx] = {
          text: lyrics[idx],
          start: slots[i].start,
          end: slots[i].end,
          type: 'word',
        }
      })
    } else if (group.length === 1) {
      timed[li] = {
        text: lyrics[li],
        start: tw.start,
        end: tw.end,
        type: 'word',
      }
    }
  }

  // Interpolate lyrics words with no transcript anchor.
  let li = 0
  while (li < lyrics.length) {
    if (timed[li]) {
      li++
      continue
    }

    let runEnd = li
    while (runEnd < lyrics.length && !timed[runEnd]) runEnd++
    const runLen = runEnd - li

    const prev = timed.slice(0, li).filter(Boolean).at(-1)
    let next = null
    for (let k = runEnd; k < lyrics.length; k++) {
      if (timed[k]) {
        next = timed[k]
        break
      }
    }

    const start = prev?.end ?? 0
    const end = next?.start ?? start + 0.08 * runLen
    const slots = splitDuration(start, end, runLen)
    for (let r = 0; r < runLen; r++) {
      timed[li + r] = {
        text: lyrics[li + r],
        start: slots[r].start,
        end: slots[r].end,
        type: 'word',
      }
    }
    li = runEnd
  }

  return lyrics.map((_, i) => timed[i])
}

function interleaveSpacing(words) {
  const out = []
  for (let i = 0; i < words.length; i++) {
    const w = words[i]
    out.push({ ...w })
    if (i < words.length - 1) {
      const next = words[i + 1]
      out.push({
        text: ' ',
        start: w.end,
        end: next.start,
        type: 'spacing',
      })
    }
  }
  return out
}

const lyricsRaw = readFileSync(lyricsPath, 'utf8')
const lyrics = tokenizeLyrics(lyricsRaw)
const lyricLines = parseLyricLines(lyricsRaw)

if (!existsSync(sttPath)) {
  console.error(`Missing STT source: ${sttPath}`)
  console.error('Run scripts/transcribe-audio.js first, or restore from git.')
  process.exit(1)
}

const stt = JSON.parse(readFileSync(sttPath, 'utf8'))
const transWords = stt.words.filter((w) => w.type === 'word')

const pairs = align(lyrics, transWords.map((w) => w.text))
const lyricToTrans = buildLyricToTrans(lyrics, transWords, pairs)
const timedWords = buildTimedWords(lyrics, transWords, lyricToTrans)
const words = interleaveSpacing(timedWords)

const fullText = lyrics.join(' ')
const transcript = {
  ...stt,
  text: fullText,
  words,
}
writeFileSync(transcriptPath, JSON.stringify(transcript))

// Compact STT words file is kept as-is; write corrected compact separately.
const compact = {
  text: fullText,
  language: stt.language_code ?? 'swe',
  duration: stt.audio_duration_secs ?? timedWords.at(-1)?.end,
  words: timedWords.map((w, i) => ({
    i,
    text: w.text,
    start: w.start,
    end: w.end,
    ms: Math.round(w.start * 1000),
  })),
}
writeFileSync(wordsPath, JSON.stringify(compact, null, 2))

writeFileSync(
  subtitleLinesPath,
  JSON.stringify({ wordCounts: lyricLines.map((line) => line.length) }, null, 2),
)

if (!existsSync(sttWordsPath)) {
  const sttCompact = {
    text: stt.text,
    language: stt.language_code ?? 'swe',
    duration: stt.audio_duration_secs ?? transWords.at(-1)?.end,
    words: transWords.map((w, i) => ({
      i,
      text: w.text,
      start: w.start,
      end: w.end,
      ms: Math.round(w.start * 1000),
    })),
  }
  writeFileSync(sttWordsPath, JSON.stringify(sttCompact, null, 2))
  console.log(`Created ${sttWordsPath}`)
}

const matched = pairs.filter((p) => p.li != null && p.ti != null).length
const lyricsOnly = pairs.filter((p) => p.li != null && p.ti == null).length
const transOnly = pairs.filter((p) => p.li == null && p.ti != null).length
console.log(`STT source: ${sttPath} (${transWords.length} words, untouched)`)
console.log(`Updated ${transcriptPath}`)
console.log(`Updated ${wordsPath}`)
console.log(`Updated ${subtitleLinesPath}`)
console.log(`Lyrics: ${lyrics.length} words`)
console.log(`Alignment: ${matched} matched, ${lyricsOnly} lyrics-only, ${transOnly} transcript-only`)
