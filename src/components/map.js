// Generativ piratkarta som fullskärmsbakgrund för hela sajten.
// Vattenpolygoner från OSM, bilväg Stockholm→Hamn från OSRM, båtrutt
// Hamn→Ovanan handritad. Massor av animerade faror: bläckfisk, valar,
// sjömonster, piratskepp, dimridåer, kompassros, blixt.

import { gsap } from 'gsap'
import { pauseShowAudio, startShowAudio } from '../lib/audio.js'
import { hideLoading } from '../lib/loading.js'
import { perfMark, perfMeasure, perfFlags } from '../lib/perf.js'

const VIEW_W = 1600

let stageEl = null
let revealSyncCleanup = null
let viewH = 0
let projectFn = null
const cam = { cx: 0, cy: 0, w: 0, h: 0, rot: 0, tilt: 0 }
const stage = {} // sx, sy, hx, hy, ox, oy fylls i av render()

// Catmull-Rom → cubic Bezier SVG-path. Ger en glatt kurva genom flera punkter.
function catmullRomToBezierPath(points) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

// dismissLoadingScreen → använd lib/loading.js hideLoading direkt

function stopRevealSync() {
  if (revealSyncCleanup) {
    revealSyncCleanup()
    revealSyncCleanup = null
  }
}

export function unmountMapBackground() {
  stopRevealSync()
  pauseShowAudio()
  if (!stageEl) return
  gsap.killTweensOf(stageEl)
  gsap.killTweensOf(stageEl.querySelectorAll('*'))
  stageEl.remove()
  stageEl = null
}

export async function mountMapBackground() {
  if (stageEl) {
    hideLoading()
    return
  }
  stageEl = document.createElement('div')
  stageEl.id = 'map-bg'
  stageEl.innerHTML = '<div class="map-loading">Sjökortet rullas ut…</div>'
  document.body.prepend(stageEl)

  let data
  try {
    const res = await fetch('/map-data.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    data = await res.json()
  } catch (err) {
    stageEl.innerHTML = '<div class="map-loading">Kunde inte ladda kartan.</div>'
    console.error(err)
    hideLoading()
    return
  }

  perfMark('render-start')
  render(data)
  perfMark('render-end')
  perfMeasure('SVG render', 'render-start', 'render-end')

  // Säkerställ att load-screenen syns minst 600ms så det inte flashar förbi
  await new Promise((r) => setTimeout(r, 600))

  hideLoading()
  await runReveal()
  animate()
}

function render(data) {
  const { bbox, points, water, islands = [], coastlineSea = [], coastlineIslands = [], coastlineStrokes = [], drivingRoute } = data

  const midLat = (bbox.minLat + bbox.maxLat) / 2
  const lonScale = Math.cos((midLat * Math.PI) / 180)
  const lonRange = (bbox.maxLon - bbox.minLon) * lonScale
  const latRange = bbox.maxLat - bbox.minLat
  const aspect = lonRange / latRange
  viewH = Math.round(VIEW_W / aspect)

  const project = ([lon, lat]) => {
    const x = ((lon - bbox.minLon) * lonScale / lonRange) * VIEW_W
    const y = ((bbox.maxLat - lat) / latRange) * viewH
    return [x, y]
  }
  projectFn = project

  const ringToPath = (ring) => {
    let d = ''
    for (let i = 0; i < ring.length; i++) {
      const [x, y] = project(ring[i])
      d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1)
    }
    return d + 'Z'
  }

  // Vatten + öar: bygg en path-string per feature. Att hålla dem separata
  // är viktigt eftersom överlappande polygoner med evenodd skulle skapa hål.
  const featureToPath = (f) => {
    let d = ''
    if (f.type === 'Polygon') {
      for (const ring of f.coordinates) d += ringToPath(ring)
    } else if (f.type === 'MultiPolygon') {
      for (const poly of f.coordinates) for (const ring of poly) d += ringToPath(ring)
    }
    return d
  }
  const waterPaths = water.map(featureToPath).filter(Boolean)
  const islandPaths = islands.map(featureToPath).filter(Boolean)
  const coastlineSeaPaths = coastlineSea.map(featureToPath).filter(Boolean)
  const coastlineIslandPaths = coastlineIslands.map(featureToPath).filter(Boolean)
  // Råa kustlinje-kedjor som öppna line-paths (för stroke, inte fill)
  const coastlineStrokeD = coastlineStrokes.map((chain) => {
    let d = ''
    for (let i = 0; i < chain.length; i++) {
      const [x, y] = project(chain[i])
      d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1)
    }
    return d
  }).join('')
  // För kustlinje-stroke
  const waterPath = waterPaths.join('')
  const islandsPath = islandPaths.join('')
  const coastlineIslandsPath = coastlineIslandPaths.join('')

  const [sx, sy] = project([points.stockholm.lon, points.stockholm.lat])
  const [hx, hy] = project([points.harbor.lon, points.harbor.lat])
  const [ox, oy] = project([points.ovanan.lon, points.ovanan.lat])
  // Slut-focal: hårdkodad lat/lon så bbox-expansion åt öster inte flyttar
  // kameran. Detta motsvarar geografiska mittpunkten av ursprungsvyn.
  const [endFxBase, endFy] = project([17.765, 59.308])
  // Slutposition skiftad 5% av visningsbredden åt höger (visningsbredd = VIEW_W * 0.865).
  const endFx = endFxBase + VIEW_W * 0.865 * 0.05
  Object.assign(stage, { sx, sy, hx, hy, ox, oy, endFx, endFy })

  // Bilväg: bygg path från OSRM-koordinater
  let drivingD = ''
  for (let i = 0; i < drivingRoute.length; i++) {
    const [x, y] = project(drivingRoute[i])
    drivingD += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1)
  }

  // Båtrutt: kurvad linje från hamnen till Ovanan, bukten åt höger och uppåt.
  const mx = (hx + ox) / 2 + 60
  const my = (hy + oy) / 2 - 40
  const boatD = `M ${hx.toFixed(1)} ${hy.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ox.toFixed(1)} ${oy.toFixed(1)}`

  // Glatta kamera-paths — separata från de visuella rutterna.
  // Driving cam: Catmull-Rom genom waypoints som är jämnt spridda LÄNGS
  // den verkliga bilvägen. Vi projicerar OSRM-punkterna, mäter kumulativ
  // båglängd och samplar N+1 punkter på lika stora intervall.
  const drivePts = drivingRoute.map((p) => {
    const [x, y] = project(p)
    return { x, y }
  })
  const cumLen = [0]
  for (let i = 1; i < drivePts.length; i++) {
    const dx = drivePts[i].x - drivePts[i - 1].x
    const dy = drivePts[i].y - drivePts[i - 1].y
    cumLen.push(cumLen[i - 1] + Math.hypot(dx, dy))
  }
  const totalDriveLen = cumLen[cumLen.length - 1]

  const sampleDriveAt = (target) => {
    if (target <= 0) return drivePts[0]
    if (target >= totalDriveLen) return drivePts[drivePts.length - 1]
    // Linjär sökning — drivingRoute har bara ~878 punkter, snabbt nog.
    for (let i = 1; i < cumLen.length; i++) {
      if (cumLen[i] >= target) {
        const t = (target - cumLen[i - 1]) / (cumLen[i] - cumLen[i - 1])
        return {
          x: drivePts[i - 1].x + (drivePts[i].x - drivePts[i - 1].x) * t,
          y: drivePts[i - 1].y + (drivePts[i].y - drivePts[i - 1].y) * t,
        }
      }
    }
    return drivePts[drivePts.length - 1]
  }

  const N = 4
  const driveWaypoints = []
  for (let i = 0; i <= N; i++) {
    driveWaypoints.push(sampleDriveAt((i / N) * totalDriveLen))
  }
  const camDriveD = catmullRomToBezierPath(driveWaypoints)
  const camBoatD = boatD  // båtrutten är redan en glatt Q-kurva

  // Decorationspositioner — placerade nära den faktiska rutten så de syns
  // i kameran under reveal.
  const dragons = [
    [17.92, 59.31],  // Tidigt längs körningen
    [17.65, 59.34],  // Norr om Ekerö, mitt i körningen
  ].map(project)
  const skullPos = project([17.78, 59.29])    // Bilväg passerar nära
  const monsterPos = project([17.45, 59.32])  // Vid harbor/Adelsö
  const whale1Pos = project([17.792912, 59.262066])
  const decorShipPos = project([18.174623, 59.329939])
  // Sampla en punkt längs den faktiska bilvägen vid relativ position t (0..1)
  // med en liten perpendicular offset så figuren inte sitter mitt i vägen.
  const sampleRoad = (t, perpOffsetSvg = 0) => {
    const idx = Math.max(0, Math.min(drivePts.length - 1, Math.floor(t * (drivePts.length - 1))))
    const p = drivePts[idx]
    const next = drivePts[Math.min(drivePts.length - 1, idx + 1)]
    const dx = next.x - p.x
    const dy = next.y - p.y
    const len = Math.hypot(dx, dy) || 1
    // perp normalvektor (90° CCW av riktningen)
    return [p.x + (-dy / len) * perpOffsetSvg, p.y + (dx / len) * perpOffsetSvg]
  }
  // Land-figurer längs bilvägen — placerade på den verkliga rutten, med
  // små offsets så att de hamnar bredvid och inte på vägen.
  const wagonPos = sampleRoad(0.08, 0)        // På vägen, tidigt
  const tree3Pos = sampleRoad(0.20, -40)      // Strax bredvid
  const villagePos = sampleRoad(0.38, 35)     // På/vid vägen
  const tree1Pos = project([17.930604, 59.236150])
  const robbersPos = project([17.604010, 59.190343])
  const tree2Pos = project([17.524204, 59.211292])
  // Städer (silhuetter)
  const stockholmCityPos = project([18.0686, 59.3293])
  const sodertaljePos = project([17.6253, 59.1958])
  // Extra byar
  const village2Pos = project([17.489289, 59.255525])  // användarvald position
  const village3Pos = project([17.835, 59.195])        // Botkyrka, söder om Stockholm
  const globenPos = project([18.083310, 59.293617])    // Globen (Avicii Arena)
  // Båtfas:
  const krakenPos = project([17.529805, 59.294257])
  const octopusPos = project([17.771634, 59.221499])
  const mermaidPos = project([17.584792, 59.295477])
  const stormPos = project([17.42, 59.36])     // NV
  const compassPos = project([18.103259, 59.208657])

  stageEl.innerHTML = `
    <svg
      class="treasure-map"
      viewBox="0 0 ${VIEW_W} ${viewH}"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Animerad sjökarta över Mälaren från Stockholm till Ovanan"
    >
      ${defs()}

      <!-- Bakfärg (rotorns bottenplåt) -->
      <rect width="${VIEW_W}" height="${viewH}" fill="#3a2410" />

      <!-- Rotor: allt kartinnehåll roterar tillsammans -->
      <g class="map-rotor">
      <!-- Pergamentbakgrund. ?no-parchment=1 ersätter med flat fyllning för perf-test. -->
      <rect
        x="${(-VIEW_W * 0.3).toFixed(0)}"
        y="${(-viewH * 0.3).toFixed(0)}"
        width="${(VIEW_W * 1.6).toFixed(0)}"
        height="${(viewH * 1.6).toFixed(0)}"
        fill="${perfFlags.noParchment ? '#d5c193' : 'url(#parchment-tile)'}"
      />

      <!-- Hav-lager (skärgård/Saltsjön från kustlinje-stängning) -->
      <g class="coastline-sea" fill="#4a6a74" fill-rule="evenodd">
        ${coastlineSeaPaths.map((d) => `<path d="${d}" />`).join('')}
      </g>

      <!-- Inlandsvatten (Mälaren m.fl.) — en samlad path -->
      <path class="water-layer" d="${waterPath}" fill="#4a6a74" fill-rule="evenodd" />
      <!-- Vågmönster på samma path. ?no-waves=1 stänger av. -->
      ${perfFlags.noWaves ? '' : `<path class="water-waves" d="${waterPath}" fill="url(#wave-pattern)" fill-rule="evenodd" opacity="0.45" />`}

      <!-- Öar ritas SIST så de garanterat syns ovanpå all blå.
           Slagna ihop i en samlad path per typ för att minska DOM-noder
           (1000+ separata path-element drog ner FPS). -->
      <path class="coastline-islands" d="${coastlineIslandsPath}" fill="url(#parchment-tile)" fill-rule="evenodd" />
      <path class="islands" d="${islandsPath}" fill="url(#parchment-tile)" fill-rule="evenodd" />

      <!-- Kustlinje-strokes. För havspolygoner använder vi de RÅA kedjorna
           (ej bbox-closing-delarna) så ingen synlig rektangel-linje.
           Misstänkt största per-frame raster-kostnaden — kan slås av med ?no-coastline=1 -->
      ${perfFlags.noCoastlineStroke ? '' : `
      <path
        class="coastline"
        d="${coastlineStrokeD}${coastlineIslandsPath}${waterPath}${islandsPath}"
        fill="none"
        stroke="#2a1810"
        stroke-width="1.2"
        stroke-linejoin="round"
        opacity="0.85"
      />`}

      <!-- Städer (silhuetter, breda) -->
      ${citySilhouette('stockholm-city', stockholmCityPos[0], stockholmCityPos[1], '/images/map/stockholm-silhouette.png', 320, 'Stockholm', 28)}
      ${citySilhouette('sodertalje', sodertaljePos[0], sodertaljePos[1], '/images/map/sodertalje-silhouette.png', 260, 'Södertälje')}

      <!-- Land-figurer (under rutten) -->
      ${decorImage('wagon', wagonPos[0], wagonPos[1], '/images/map/wagon.png', 90)}
      ${decorImage('village village-1', villagePos[0], villagePos[1], '/images/map/village-1.png', 75)}
      ${decorImage('village village-2', village2Pos[0], village2Pos[1], '/images/map/village-2.png', 70)}
      ${decorImage('village village-3', village3Pos[0], village3Pos[1], '/images/map/village-3.png', 130)}
      ${decorImage('globen', globenPos[0], globenPos[1], '/images/map/globen.png', 70)}
      ${decorImage('robbers', robbersPos[0], robbersPos[1], '/images/map/robbers.png', 110)}
      ${decorImage('tree tree-1', tree1Pos[0], tree1Pos[1], '/images/map/tree-1.png', 70)}
      ${decorImage('tree tree-2', tree2Pos[0], tree2Pos[1], '/images/map/tree-2.png', 70)}
      ${decorImage('tree tree-3', tree3Pos[0], tree3Pos[1], '/images/map/tree-3.png', 70)}

      <!-- Sjömonster och faror (under rutten) -->
      ${kraken(krakenPos[0], krakenPos[1])}
      ${seaMonster(monsterPos[0], monsterPos[1])}
      ${octopus(octopusPos[0], octopusPos[1])}
      ${whale(whale1Pos[0], whale1Pos[1], 'whale-1')}
      ${mermaid(mermaidPos[0], mermaidPos[1])}
      ${skull(skullPos[0], skullPos[1])}
      ${decorShip(decorShipPos[0], decorShipPos[1])}
      ${dragons.map(([x, y], i) => dragonWarning(x, y, i)).join('')}

      <!-- Stormcell -->
      ${stormCloud(stormPos[0], stormPos[1])}

      <!-- Dold "journey"-path för kamerasamplering -->
      <path id="journey-path" d="${drivingD} ${boatD}" fill="none" stroke="none" />

      <!-- Bilväg (dasharray styrs av JS för draw-in + marching ants) -->
      <path
        class="driving-route"
        d="${drivingD}"
        fill="none"
        stroke="#8b2c1a"
        stroke-width="3"
        stroke-linecap="round"
        opacity="0.85"
      />

      <!-- Båtrutt (dasharray styrs av JS) -->
      <path
        class="boat-route"
        id="boat-route-path"
        d="${boatD}"
        fill="none"
        stroke="#8b2c1a"
        stroke-width="6"
        stroke-linecap="butt"
      />

      <!-- Markörer (Stockholm-silhouetten har egen etikett ovan).
           Hamnen-markören dyker upp under reveal när vi når hamnen. -->
      <g class="harbor-marker">
        ${marker(hx, hy, 'Hamnen', 'right')}
      </g>

      <!-- Kompassros -->
      ${compassRose(compassPos[0], compassPos[1])}

      <!-- Drivande dimridåer -->
      ${fog(0)} ${fog(1)} ${fog(2)} ${fog(3)}

      <!-- Dolda kamera-paths för smooth panorering -->
      <path id="cam-drive-path" d="${camDriveD}" fill="none" stroke="none" />
      <path id="cam-boat-path" d="${camBoatD}" fill="none" stroke="none" />

      <!-- "Salmonellahavet"-etiketten ligger ovanpå alla bilder utom skeppet -->
      ${(() => { const [lx, ly] = project([17.549469, 59.293733]); return `
      <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" class="sea-label" text-anchor="middle" fill="#2a1810">SALMONELLAHAVET</text>
      `})()}

      <!-- Vårt piratskepp — högst upp så det aldrig täcks av andra bilder.
           Pivot: bottom-middle. -->
      <g class="our-ship">
        <image href="/images/map/our-ship.png" x="-45" y="-90" width="90" height="90"
               preserveAspectRatio="xMidYMid meet" />
      </g>

      </g>
    </svg>
  `
}

// ---------- Defs ----------

function defs() {
  return `
    <defs>
      <!-- Pergament-tile (används som land-fyllning) -->
      <pattern id="parchment-tile" x="0" y="0" width="1200" height="1200" patternUnits="userSpaceOnUse">
        <image href="/images/map/parchment.png" x="0" y="0" width="1200" height="1200"
               preserveAspectRatio="xMidYMid slice" />
      </pattern>

      <!-- Vågmönster (används som overlay på natural=water polygoner) -->
      <pattern id="wave-pattern" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
        <path d="M 0 20 q 10 -6 20 0 t 20 0 t 20 0 t 20 0" stroke="#1a2832" stroke-width="0.6" fill="none" opacity="0.6" />
      </pattern>
    </defs>
  `
}

// ---------- Dekorationsfunktioner ----------

function marker(x, y, label, side) {
  const dx = side === 'left' ? -10 : 10
  const anchor = side === 'left' ? 'end' : 'start'
  return `
    <g class="marker">
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="#2a1810" stroke="#e8d8b4" stroke-width="1" />
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.5" fill="#e8d8b4" />
      <text x="${(x + dx).toFixed(1)}" y="${(y + 4).toFixed(1)}" class="marker-label" text-anchor="${anchor}" fill="#2a1810">${label}</text>
    </g>
  `
}


// Bild-baserade dekorationer. Varje använder en PNG från public/images/map/.
// `<image>` centreras kring (x, y) via negativ x/y offset.
function decorImage(cls, x, y, href, size) {
  const half = size / 2
  return `
    <g class="${cls}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})">
      <image href="${href}" x="${-half}" y="${-half}" width="${size}" height="${size}"
             preserveAspectRatio="xMidYMid meet" />
    </g>
  `
}

function octopus(x, y) {
  return decorImage('octopus', x, y, '/images/map/octopus.png', 80)
}

function seaMonster(x, y) {
  return decorImage('sea-monster', x, y, '/images/map/sea-monster.png', 60)
}

function whale(x, y, cls, flipped = false) {
  const half = 30
  const flip = flipped ? `transform="scale(-1,1)"` : ''
  return `
    <g class="whale ${cls}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})">
      <g ${flip}>
        <image href="/images/map/${cls === 'whale-2' ? 'whale-2' : 'whale-1'}.png"
               x="${-half}" y="${-half}" width="60" height="60"
               preserveAspectRatio="xMidYMid meet" />
      </g>
    </g>
  `
}

function kraken(x, y) {
  return decorImage('kraken', x, y, '/images/map/kraken.png', 90)
}

function mermaid(x, y) {
  return decorImage('mermaid', x, y, '/images/map/mermaid.png', 50)
}

function skull(x, y) {
  return `
    <g class="skull-warning" transform="translate(${x.toFixed(1)},${y.toFixed(1)})">
      <image href="/images/map/skull-warning.png" x="-45" y="-45" width="90" height="90"
             preserveAspectRatio="xMidYMid meet" />
      <text x="0" y="58" class="warning-label" text-anchor="middle" fill="#1a0a05">Pestholmen</text>
    </g>
  `
}

function decorShip(x, y) {
  return decorImage('decor-ship', x, y, '/images/map/decor-ship.png', 130)
}

// Stadssilhuetter: bredare än de är höga, bottenkant förankrad på (x, y).
// imgYOffset låter dig flytta enbart silhuett-PNGen utan att etiketten följer med.
function citySilhouette(cls, x, y, href, width, label, imgYOffset = 0) {
  const height = width * 0.45
  return `
    <g class="${cls} city" transform="translate(${x.toFixed(1)},${y.toFixed(1)})">
      <image href="${href}" x="${-width / 2}" y="${-height + imgYOffset}" width="${width}" height="${height}"
             preserveAspectRatio="xMidYMax meet" />
      <text x="0" y="20" class="city-label" text-anchor="middle" fill="#1a0a05">${label}</text>
    </g>
  `
}

function dragonWarning(x, y, i) {
  const variant = i === 0 ? 'dragon-warning-1' : 'dragon-warning-2'
  return `
    <g class="dragon-warning d${i}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})">
      <image href="/images/map/${variant}.png" x="-45" y="-45" width="90" height="90"
             preserveAspectRatio="xMidYMid meet" />
    </g>
  `
}

function compassRose(x, y) {
  return `
    <g class="compass-rose" transform="translate(${x.toFixed(1)},${y.toFixed(1)})">
      <g class="compass-spin">
        <image href="/images/map/compass-rose.png" x="-75" y="-75" width="150" height="150"
               preserveAspectRatio="xMidYMid meet" />
      </g>
    </g>
  `
}

function stormCloud(x, y) {
  return decorImage('storm-cloud', x, y, '/images/map/storm-cloud.png', 180)
}

function fog(i) {
  return `<ellipse class="fog fog-${i}" cx="0" cy="0" rx="220" ry="60" fill="#e8d8b4" opacity="0.18" />`
}


// ---------- Reveal-storyboard (60 s) ----------
// Timeline-positioner = sekunder i låten. Drivs av audio.currentTime när ljud är på.

async function playRevealTimeline(tl, skipToEnd) {
  stopRevealSync()
  tl.pause()
  tl.progress(0)

  const audio = document.getElementById('party-audio')
  const endTime = tl.duration()

  await startShowAudio()

  if (audio?.muted) {
    return new Promise((resolve) => {
      tl.eventCallback('onComplete', () => {
        tl.eventCallback('onComplete', null)
        resolve()
      })
      tl.play()
    })
  }

  return new Promise((resolve) => {
    let rafId = 0
    const finish = () => {
      stopRevealSync()
      resolve()
    }
    // Använd rAF istället för audio.timeupdate-event (som bara fyrar 4-15
    // ggr/sek och gör att timeline:n hoppar i chunks även vid hög FPS).
    // audio.currentTime uppdateras kontinuerligt av browsern så läsning
    // per frame ger smidig sync med ljudet.
    const tick = () => {
      const t = audio.currentTime
      tl.time(t)
      if (t >= endTime - 0.05 || tl.progress() >= 0.999) {
        tl.progress(1)
        finish()
        return
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    revealSyncCleanup = () => { if (rafId) cancelAnimationFrame(rafId) }
    skipToEnd.fn = () => {
      finish()
      tl.progress(1)
    }
  })
}

async function runReveal() {
  const svg = stageEl.querySelector('svg')
  if (!svg) return

  // Reveal körs varje gång sidan laddas — ingen "skippa vid återbesök".
  const { sx, sy, hx, hy, ox, oy } = stage

  // Dölj alla dekorationer och rutter initialt.
  gsap.set(['.octopus', '.kraken', '.sea-monster', '.whale-1', '.mermaid',
            '.skull-warning', '.decor-ship', '.dragon-warning', '.storm-cloud',
            '.compass-rose', '.our-ship',
            '.wagon', '.village-1', '.village-2', '.village-3', '.robbers', '.tree',
            '.globen', '.stockholm-city'].join(','),
           { opacity: 0, scale: 0.3, transformOrigin: '50% 50%' })
  // Vägar: använd stroke-dashoffset-tricket för att rita ut vägen progressivt.
  // Sätt dasharray = totalLen, dashoffset = totalLen → osynlig. Animera offset → 0.
  const drivingEl = svg.querySelector('.driving-route')
  const boatEl = svg.querySelector('.boat-route')
  const drivingTotalLen = drivingEl.getTotalLength()
  const boatTotalLen = boatEl.getTotalLength()
  gsap.set('.driving-route', {
    strokeDasharray: drivingTotalLen,
    strokeDashoffset: drivingTotalLen,
    opacity: 1,
  })
  gsap.set('.boat-route', {
    strokeDasharray: boatTotalLen,
    strokeDashoffset: boatTotalLen,
    opacity: 1,
  })
  gsap.set('.harbor-marker', { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })

  // Skip-knapp (ingen storytelling-text)
  const caption = document.createElement('div')
  caption.id = 'reveal-caption'
  caption.innerHTML = `<button class="skip-btn" type="button">Hoppa över ↷</button>`
  stageEl.appendChild(caption)

  // Kamera börjar zoomad på Stockholm — men brett nog att rymma faror under flygningen.
  // Behåller SVG-aspekt så att kartan inte stretchas.
  const ASPECT = VIEW_W / viewH
  const ZOOM_W = VIEW_W * 0.56  // 20 % mer inzoomad än tidigare 0.7
  const ZOOM_H = ZOOM_W / ASPECT
  cam.cx = sx; cam.cy = sy; cam.w = ZOOM_W; cam.h = ZOOM_H; cam.rot = 0; cam.tilt = 0

  const rotor = svg.querySelector('.map-rotor')
  // Zoom: viewBox per frame (SVG paint invalideras vid attribut-ändring → text
  // ritas om vektor-skarpt). Rotation: inner <g> via SVG transform-attribut.
  // 3D-tilt: CSS rotateX på SVG-elementet kombinerat med perspective på parent.
  let lastTilt = -1
  const applyCam = () => {
    const vbx = cam.cx - cam.w / 2
    const vby = cam.cy - cam.h / 2
    svg.setAttribute('viewBox', `${vbx.toFixed(1)} ${vby.toFixed(1)} ${cam.w.toFixed(1)} ${cam.h.toFixed(1)}`)
    if (cam.rot !== 0) {
      rotor.setAttribute('transform',
        `rotate(${cam.rot.toFixed(2)} ${cam.cx.toFixed(1)} ${cam.cy.toFixed(1)})`)
    } else {
      rotor.removeAttribute('transform')
    }
    if (!perfFlags.noTilt && cam.tilt !== lastTilt) {
      svg.style.transform = cam.tilt === 0 ? '' : `rotateX(${cam.tilt.toFixed(1)}deg)`
      lastTilt = cam.tilt
    }
  }
  applyCam()

  // Glatta kamera-paths
  const camDrive = svg.querySelector('#cam-drive-path')
  const camBoat = svg.querySelector('#cam-boat-path')
  const camDriveLen = camDrive.getTotalLength()
  const camBoatLen = camBoat.getTotalLength()

  // Tangentvinkel vid given längd, i grader.
  // Vi vill att riktningen-framåt pekar uppåt på skärmen ⇒ rotera kartan med -90 - tangentDeg.
  const tangentAt = (pathEl, len, total) => {
    const a = pathEl.getPointAtLength(Math.max(0, len - 0.5))
    const b = pathEl.getPointAtLength(Math.min(total, len + 0.5))
    return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI
  }
  const rotFromTangent = (deg) => -90 - deg
  // Normalisera vinkel till [-180, 180] så lerp mot 0 (norr) går kortaste vägen.
  const normAngle = (a) => {
    while (a > 180) a -= 360
    while (a < -180) a += 360
    return a
  }
  // 50/50-mix mellan vägriktning och norr-upp
  const ROAD_FOLLOW = 0.5
  const blendRot = (deg) => normAngle(rotFromTangent(deg)) * ROAD_FOLLOW

  // rotMix går från 0 (norr-upp) till 1 (full vägriktnings-blend) under intron.
  const rotMix = { v: 0 }
  const driveStartTangent = tangentAt(camDrive, 0, camDriveLen)

  // Kameran börjar norr-upp (rot=0) och roteras mot vägriktningen under intron
  cam.rot = 0
  applyCam()

  const ship = document.querySelector('.our-ship')

  document.body.classList.add('revealing')
  const skipToEnd = { fn: () => tl.progress(1) }
  const onKey = (e) => { if (e.key === 'Escape') skipToEnd.fn() }
  document.addEventListener('keydown', onKey)

  const tl = gsap.timeline({ paused: true })
  // Cleanup körs i finally efter playRevealTimeline (se nedan) så det körs
  // oavsett om timeline drevs via audio-sync eller manuellt play() i muted-läge.
  caption.querySelector('.skip-btn').addEventListener('click', () => skipToEnd.fn())

  // 0–3 s: Stockholm — kamera lutar in i 3D-flygläge och roteras mot vägriktningen
  tl.fromTo('.stockholm-city', { opacity: 0, scale: 0.5 },
    { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(2)' }, 0.2)
  tl.to(cam, { tilt: 35, duration: 4, ease: 'power2.inOut', onUpdate: applyCam }, 1)
  // Parallellt med tilten: rotMix 0→1 så kameran roteras smidigt från norr
  // mot vägriktnings-blenden. driveProgress använder rotMix.v multiplicerat.
  tl.to(rotMix, {
    v: 1,
    duration: 4,
    ease: 'power2.inOut',
    onUpdate() {
      // Endast innan driveProgress startat — annars överskriver driveProgress
      if (driveProgress.p === 0) {
        cam.rot = blendRot(driveStartTangent) * rotMix.v
        applyCam()
      }
    },
  }, 1)

  // 3–32 s: Bilväg ritas ut allteftersom kameran flyger längs den (+5s till).
  tl.to('.driving-route', { strokeDashoffset: 0, duration: 29, ease: 'power2.inOut' }, 3)
  tl.set('.driving-route', { strokeDasharray: '6 5', strokeDashoffset: 0 }, 32)

  const driveProgress = { p: 0 }
  tl.to(driveProgress, {
    p: 1,
    duration: 29,
    ease: 'power2.inOut',
    onUpdate() {
      const len = driveProgress.p * camDriveLen
      const pt = camDrive.getPointAtLength(len)
      cam.cx = pt.x; cam.cy = pt.y
      cam.rot = blendRot(tangentAt(camDrive, len, camDriveLen)) * rotMix.v
      applyCam()
    },
  }, 3)

  // Reveal-konfig: alla "X dyker upp vid tid T" enkelt utlyfta så positioner,
  // tider och storlekar kan justeras på ett ställe. fade=fade-in opacity-mål
  // (default 1), scale 0=från, scale 1=till, ease default back.out(2).
  // Faror och landsobjekt under drive-fasen (3-32s):
  const driveReveals = [
    { sel: '.wagon',              t: 4,    dur: 0.7, from: 0.3 },
    { sel: '.tree-3',             t: 8,    dur: 0.6, from: 0.4 },
    { sel: '.globen',             t: 11,   dur: 0.9, from: 0.3 },
    { sel: '.dragon-warning.d0',  t: 13,   dur: 0.7, from: 0.3, fade: 0.85 },
    { sel: '.tree-1',             t: 15,   dur: 0.6, from: 0.4 },
    { sel: '.village-1',          t: 16,   dur: 0.9, from: 0.3 },
    { sel: '.skull-warning',      t: 17.5, dur: 0.7, from: 0.3 },
    { sel: '.robbers',            t: 20,   dur: 0.8, from: 0.3 },
    { sel: '.tree-2',             t: 22,   dur: 0.6, from: 0.4 },
    { sel: '.dragon-warning.d1',  t: 25,   dur: 0.7, from: 0.3, fade: 0.85 },
    { sel: '.decor-ship',         t: 28,   dur: 0.9, from: 0.5, ease: 'power2.out' },
  ]
  for (const r of driveReveals) {
    tl.fromTo(r.sel,
      { opacity: 0, scale: r.from },
      { opacity: r.fade ?? 1, scale: 1, duration: r.dur, ease: r.ease ?? 'back.out(2)' },
      r.t)
  }

  // 32–35 s: Hamnen (skift +5s)
  tl.to(cam, { w: ZOOM_W * 0.6, h: ZOOM_H * 0.6, duration: 3, ease: 'power2.inOut', onUpdate: applyCam }, 32)
  tl.to(cam, { rot: 0, duration: 3.5, ease: 'power3.inOut', onUpdate: applyCam }, 32)
  tl.to(cam, { tilt: 0, duration: 3.5, ease: 'power3.inOut', onUpdate: applyCam }, 32)
  // Hamn-fasens reveal-objekt (32-37s) + village-2 vid båt-fasens start
  const harborReveals = [
    { sel: '.harbor-marker',  t: 33.5, dur: 1.2, from: 0.4 },
    { sel: '.sea-monster',    t: 33,   dur: 0.9, from: 0.3 },
    { sel: '.whale-1',        t: 35,   dur: 0.9, from: 0.3 },
    { sel: '.village-2',      t: 24,   dur: 0.9, from: 0.3 },
    { sel: '.village-3',      t: 26,   dur: 0.9, from: 0.3 },
  ]
  for (const r of harborReveals) {
    tl.fromTo(r.sel,
      { opacity: 0, scale: r.from },
      { opacity: r.fade ?? 1, scale: 1, duration: r.dur, ease: r.ease ?? 'back.out(2)' },
      r.t)
  }

  // 38–57 s: Båtrutt (2s kortare)
  tl.to('.boat-route', { strokeDashoffset: 0, duration: 19, ease: 'power2.inOut' }, 38)
  tl.set('.boat-route', { strokeDasharray: '12 9', strokeDashoffset: 0 }, 57)
  tl.fromTo('.our-ship', { opacity: 0, scale: 0.5 },
    { opacity: 1, scale: 1, duration: 0.8 }, 37)

  // Båt-inzoomning
  tl.to(cam, { w: ZOOM_W * 0.35, h: ZOOM_H * 0.35, duration: 2, ease: 'power2.inOut', onUpdate: applyCam }, 37)

  // Båtfas: kamera följer båt-Bezier (kortare 22s)
  const shipState = { tx: 0, ty: 0, angle: 0 }
  const setShip = () => {
    if (ship) ship.setAttribute('transform', `translate(${shipState.tx},${shipState.ty}) rotate(${shipState.angle})`)
  }
  const boatProgress = { p: 0 }
  tl.to(boatProgress, {
    p: 0.99,
    duration: 19,
    ease: 'power2.inOut',
    onUpdate() {
      const len = boatProgress.p * camBoatLen
      const pt = camBoat.getPointAtLength(len)
      cam.cx = pt.x; cam.cy = pt.y
      applyCam()
      // Sampla tangent från en punkt SLIGHTLY FÖRE current, så vi alltid har
      // en giltig riktning även vid endpoint (annars blir pt2==pt vid p=1
      // och vinkeln snappar till 0).
      const prevLen = Math.max(0, len - 4)
      const ptPrev = camBoat.getPointAtLength(prevLen)
      shipState.tx = pt.x
      shipState.ty = pt.y
      shipState.angle = Math.atan2(pt.y - ptPrev.y, pt.x - ptPrev.x) * 180 / Math.PI + 180
      setShip()
    },
  }, 38)

  // Vid framkomst: skeppet stannar precis som det är, ingen rotation.
  tl.call(() => {
    gsap.killTweensOf(ship)
  }, null, 57.5)

  // Sjökreatur under båtfasen (38-59s)
  const boatReveals = [
    { sel: '.mermaid', t: 39, dur: 0.9, from: 0.3 },
    { sel: '.kraken',  t: 48, dur: 1,   from: 0.2 },
    { sel: '.octopus', t: 56, dur: 1,   from: 0.2 },
  ]
  for (const r of boatReveals) {
    tl.fromTo(r.sel,
      { opacity: 0, scale: r.from },
      { opacity: 1, scale: 1, duration: r.dur, ease: 'back.out(2)' },
      r.t)
  }

  // 61–66 s: Zoomar ut, helheten visas. Focal är hårdkodad på ursprungs-vyns
  // mittpunkt — så bbox-expansion åt öster inte flyttar slut-kameran.
  // cam.w/h matchar gamla 0.8 × old_lonRange ≈ 0.65 × new_lonRange.
  tl.to(cam, {
    cx: stage.endFx,
    cy: stage.endFy,
    w: VIEW_W * 0.865,
    h: viewH * 0.865,
    duration: 5,
    ease: 'power2.inOut',
    onUpdate: applyCam,
  }, 61)
  // Slut-reveal (efter zoom-ut)
  const endReveals = [
    { sel: '.compass-rose', t: 63, dur: 1.5, from: 0.3 },
    { sel: '.storm-cloud',  t: 64, dur: 1.5, from: 0.5, ease: 'power2.out' },
  ]
  for (const r of endReveals) {
    tl.fromTo(r.sel,
      { opacity: 0, scale: r.from },
      { opacity: 1, scale: 1, duration: r.dur, ease: r.ease ?? 'back.out(2)' },
      r.t)
  }
  // Södertälje, village-2, village-3 visas från start (utanför rutten —
   // ingen poäng att dölja dem under reveal)

  try {
    await playRevealTimeline(tl, skipToEnd)
  } finally {
    // Cleanup — körs garanterat oavsett hur timeline avslutades.
    stopRevealSync()
    document.body.classList.remove('revealing')
    document.removeEventListener('keydown', onKey)
    if (caption.isConnected) caption.remove()
    cam.cx = stage.endFx; cam.cy = stage.endFy
    cam.w = VIEW_W * 0.865; cam.h = viewH * 0.865
    cam.rot = 0; cam.tilt = 0
    applyCam()
  }
}

// ---------- Ambient animationer (efter reveal) ----------

function animate() {
  // Marching ants
  gsap.to('.driving-route', { strokeDashoffset: '-=11', duration: 2.2, repeat: -1, ease: 'none' })
  gsap.to('.boat-route', { strokeDashoffset: '-=21', duration: 3.4, repeat: -1, ease: 'none' })

  // Dimridåer: alla fyra driftar i olika hastigheter för djup
  const fogs = document.querySelectorAll('.fog')
  const fogPaths = [
    { y: 400, dur: 140 },
    { y: 220, dur: 180 },
    { y: 580, dur: 110 },
    { y: 720, dur: 200 },
  ]
  fogs.forEach((el, i) => {
    const p = fogPaths[i] || fogPaths[0]
    gsap.set(el, { x: -300 - i * 200, y: p.y })
    gsap.to(el, { x: VIEW_W + 300, duration: p.dur, repeat: -1, ease: 'none', delay: -i * 30 })
  })

  // Kraken-tentakel-pulse
  gsap.to('.kraken', { scale: 1.04, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 50%' })

  // Val-drift (sakta upp-och-ned)
  gsap.to('.whale', { y: '+=4', duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })

  // Sjöjungfru gungar
  gsap.to('.mermaid', { rotation: 3, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 80%' })

  // Träd-svaj
  gsap.utils.toArray('.tree').forEach((el, i) => {
    gsap.to(el, { rotation: 1.5, duration: 2.4 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 100%' })
  })

  // Byar pulserar mjukt
  gsap.utils.toArray('.village').forEach((el, i) => {
    gsap.to(el, { scale: 1.03, duration: 3 + i * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 100%', delay: i * 0.5 })
  })

  // Kompassen snurrar långsamt
  gsap.to('.compass-spin', { rotation: 360, duration: 90, repeat: -1, ease: 'none', transformOrigin: '50% 50%' })

  // Drake-vingar fladdrar
  gsap.utils.toArray('.dragon-warning').forEach((el, i) => {
    gsap.to(el, { y: '-=3', duration: 1.8 + i * 0.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  })

  // Sjömonster snurrar långsamt
  gsap.to('.sea-monster', { rotation: 4, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 50%' })

  // Bläckfisk-armar (samma rörelse som kraken — skala-puls)
  gsap.to('.octopus', { scale: 1.05, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 50%' })

  // Skull-zoom — hotfullt pulserande
  gsap.to('.skull-warning', { scale: 1.08, duration: 2.0, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 50%' })

  // Dekor-skepp guppar
  gsap.to('.decor-ship', { y: '+=3', rotation: 2, duration: 3.6, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 80%' })

  // Stormmoln driftar sakta
  gsap.to('.storm-cloud', { x: '+=20', duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' })

  // Vagn rullar (liten gunga)
  gsap.to('.wagon', { rotation: 1.5, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 100%' })

  // Rövare lurar — subtilt
  gsap.to('.robbers', { y: '-=2', duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
}

