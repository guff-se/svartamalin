// In-page perf-överlägg. Aktiveras med ?perf=1 i URL:en.
// Visar FPS, slowest-frame, dropped-frame-count och senaste perf.marks.

let enabled = false
let overlayEl = null
let frames = 0
let lastSecond = 0
let droppedFrames = 0
let slowestFrame = 0
let lastFrameAt = 0
const frameHistory = []
const HISTORY_SIZE = 240   // 4s @ 60fps
const recentMarks = []

export function isPerfEnabled() {
  return enabled
}

export function initPerf() {
  enabled = new URLSearchParams(location.search).get('perf') === '1'
  if (!enabled) return

  overlayEl = document.createElement('div')
  overlayEl.id = 'perf-overlay'
  overlayEl.innerHTML = `
    <div class="perf-row" id="perf-fps">— fps</div>
    <div class="perf-row" id="perf-slowest">slowest: —</div>
    <div class="perf-row" id="perf-dropped">dropped: 0</div>
    <canvas id="perf-graph" width="240" height="48"></canvas>
    <div class="perf-marks" id="perf-marks"></div>
  `
  Object.assign(overlayEl.style, {
    position: 'fixed', top: '8px', left: '8px', zIndex: '9999',
    background: 'rgba(0,0,0,0.85)', color: '#0f0',
    font: '11px monospace', padding: '8px', borderRadius: '4px',
    pointerEvents: 'none', minWidth: '240px',
  })
  const style = document.createElement('style')
  style.textContent = `
    #perf-overlay canvas { display: block; margin: 4px 0; background: rgba(0,0,0,0.5); }
    #perf-overlay .perf-row { margin: 2px 0; }
    #perf-overlay .perf-marks { font-size: 10px; color: #ff0; max-height: 100px; overflow: hidden; }
    #perf-overlay .perf-marks div { white-space: nowrap; }
  `
  document.head.appendChild(style)
  document.body.appendChild(overlayEl)

  lastSecond = performance.now()
  lastFrameAt = performance.now()
  requestAnimationFrame(tick)

  // PerformanceObserver för paint/measure events
  try {
    const obs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' || entry.entryType === 'mark') {
          recentMarks.unshift(`${entry.name}: ${entry.duration ? entry.duration.toFixed(1) + 'ms' : 'mark'}`)
          if (recentMarks.length > 8) recentMarks.pop()
          renderMarks()
        }
      }
    })
    obs.observe({ entryTypes: ['measure', 'mark'] })
  } catch {}
}

function tick(now) {
  const dt = now - lastFrameAt
  lastFrameAt = now
  frames++

  // Räkna "dropped" som frames > 22ms (>~45fps target)
  if (dt > 22) droppedFrames++
  if (dt > slowestFrame) slowestFrame = dt

  frameHistory.push(dt)
  if (frameHistory.length > HISTORY_SIZE) frameHistory.shift()

  if (now - lastSecond >= 1000) {
    const fps = Math.round(frames * 1000 / (now - lastSecond))
    document.getElementById('perf-fps').textContent = `${fps} fps`
    document.getElementById('perf-slowest').textContent = `slowest: ${slowestFrame.toFixed(1)}ms`
    document.getElementById('perf-dropped').textContent = `dropped (>22ms): ${droppedFrames}`
    frames = 0
    lastSecond = now
    slowestFrame = 0
    renderGraph()
  }
  requestAnimationFrame(tick)
}

function renderGraph() {
  const canvas = document.getElementById('perf-graph')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)
  // 16.67ms line (60fps target)
  ctx.strokeStyle = '#0a0'; ctx.beginPath(); ctx.moveTo(0, h - 16.67/2); ctx.lineTo(w, h - 16.67/2); ctx.stroke()
  // 33ms line (30fps target)
  ctx.strokeStyle = '#a00'; ctx.beginPath(); ctx.moveTo(0, h - 33/2); ctx.lineTo(w, h - 33/2); ctx.stroke()
  // Frame times
  ctx.fillStyle = '#0f0'
  for (let i = 0; i < frameHistory.length; i++) {
    const x = (i / frameHistory.length) * w
    const dt = frameHistory[i]
    const y = h - Math.min(dt / 2, h)
    ctx.fillRect(x, y, w / frameHistory.length, h - y)
  }
}

function renderMarks() {
  const el = document.getElementById('perf-marks')
  if (!el) return
  el.innerHTML = recentMarks.map((m) => `<div>${m}</div>`).join('')
}

export function perfMark(name) {
  if (!enabled) return
  try { performance.mark(name) } catch {}
}

export function perfMeasure(name, start, end) {
  if (!enabled) return
  try { performance.measure(name, start, end) } catch {}
}

// A/B-test-flaggor i URL:en så vi kan slå av enskilda misstänkta flaskhalsar
// utan att redigera koden. Exempel: ?no-coastline=1&no-tilt=1
const params = new URLSearchParams(location.search)
export const perfFlags = {
  noCoastlineStroke: params.get('no-coastline') === '1',
  noTilt:            params.get('no-tilt') === '1',
  noParchment:       params.get('no-parchment') === '1',
  noDecorations:     params.get('no-decor') === '1',
  noWaves:           params.get('no-waves') === '1',
  noCamRotate:       params.get('no-rot') === '1',
}
if (Object.values(perfFlags).some(Boolean)) {
  console.warn('[perf flags]', Object.entries(perfFlags).filter(([, v]) => v).map(([k]) => k).join(', '))
}
