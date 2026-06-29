const audio = document.getElementById('party-audio')
const root = document.getElementById('song-subtitles')
const lineEl = root?.querySelector('.song-subtitles__line')

const TRANSCRIPT_URL = '/data/svarta-malin-transcript.json'
const SUBTITLE_LINES_URL = '/data/svarta-malin-subtitle-lines.json'

let cuesPromise = null
let rafId = 0
let activeIndex = -1

/**
 * Group word timestamps into subtitle cues — one per lyric line.
 * Line breaks come from subtitle-lines.json only; word timings are untouched.
 */
export function buildCuesFromTranscript(data, lineWordCounts) {
  const words = (data.words ?? []).filter((w) => w.type === 'word')
  const cues = []
  let buf = []
  let start = null
  let end = null
  let lineIdx = 0
  let wordsInLine = 0

  const flush = () => {
    if (!buf.length) return
    cues.push({ start, end, text: buf.join(' ') })
    buf = []
    start = null
    end = null
    wordsInLine = 0
    lineIdx++
  }

  for (const w of words) {
    if (start === null) start = w.start
    end = w.end
    buf.push(w.text)
    wordsInLine++
    const lineLen = lineWordCounts?.[lineIdx]
    if (lineLen != null && wordsInLine >= lineLen) flush()
  }
  flush()
  return cues
}

function loadCues() {
  if (!cuesPromise) {
    cuesPromise = Promise.all([
      fetch(TRANSCRIPT_URL).then((r) => {
        if (!r.ok) throw new Error(`transcript ${r.status}`)
        return r.json()
      }),
      fetch(SUBTITLE_LINES_URL).then((r) => {
        if (!r.ok) throw new Error(`subtitle-lines ${r.status}`)
        return r.json()
      }),
    ])
      .then(([data, lines]) => buildCuesFromTranscript(data, lines.wordCounts))
      .catch((err) => {
        console.warn('Song subtitles: could not load transcript', err)
        cuesPromise = null
        return []
      })
  }
  return cuesPromise
}

function findCueIndex(cues, t) {
  let lo = 0
  let hi = cues.length - 1
  let found = -1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (t < cues[mid].start) hi = mid - 1
    else { found = mid; lo = mid + 1 }
  }
  if (found < 0) return -1
  const cue = cues[found]
  return t <= cue.end ? found : -1
}

function showCue(cues, index) {
  if (!root || !lineEl) return
  if (index === activeIndex) return
  activeIndex = index
  if (index < 0) {
    root.hidden = true
    lineEl.textContent = ''
    return
  }
  root.hidden = false
  lineEl.textContent = cues[index].text
}

function tick(cues) {
  rafId = 0
  if (!audio || audio.paused) return
  const t = audio.currentTime
  showCue(cues, findCueIndex(cues, t))
  rafId = requestAnimationFrame(() => tick(cues))
}

function onPlay() {
  loadCues().then((cues) => {
    if (!cues.length || !audio || audio.paused) return
    if (rafId) cancelAnimationFrame(rafId)
    tick(cues)
  })
}

function onPause() {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
  activeIndex = -1
  if (root) root.hidden = true
  if (lineEl) lineEl.textContent = ''
}

let wired = false
function wireAudio() {
  if (wired || !audio) return
  wired = true
  audio.addEventListener('play', onPlay)
  audio.addEventListener('pause', onPause)
  audio.addEventListener('ended', onPause)
}

export function startSongSubtitles() {
  wireAudio()
  if (audio && !audio.paused) onPlay()
}

export function stopSongSubtitles() {
  onPause()
}
