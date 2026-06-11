#!/usr/bin/env node
// Hämtar geografisk data till piratkartan:
// 1) Geokodar Björkfjärdsvägen 28 via Nominatim (OSM)
// 2) Hämtar Mälarens vattenpolygoner i bbox via Overpass
// 3) Sparar public/map-data.json
//
// Körs en gång (eller manuellt om vi vill uppdatera): `node scripts/fetch-map-data.js`.

import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import polygonClipping from 'polygon-clipping'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Fasta punkter
const STOCKHOLM = { lon: 18.0686, lat: 59.3293, label: 'Stockholm' }       // Sergels torg ungefär
const OVANAN = { lon: 17.493791, lat: 59.291080, label: 'Ovanan' }
const HARBOR = { lon: 17.504457, lat: 59.277164, label: 'Hamnen' }

// Bbox som täcker Stockholm → Hamnen → Ovanan → Södertälje med marginal.
// Utökad ~20 % åt varje håll runt Stockholm/Mälaren/Södertälje-området.
// Expanderat ~20 % åt öster så Ormingelandet/skärgården inte beskärs vid kanten.
const BBOX = { minLat: 59.05, minLon: 17.23, maxLat: 59.48, maxLon: 18.514 }

// Variabel detaljgrad baserat på avstånd till rutten + position i bbox.
const COORD_PRECISION = 6  // ~0.1 m

// Detaljnivåer: nära vägen vs medel vs långt bort / yttre 20 %
const LEVELS = {
  high: { eps: 0.00008, minArea: 3e-6 },
  med:  { eps: 0.0008,  minArea: 1.5e-4 },
  low:  { eps: 0.002,   minArea: 1.5e-3 },
}

const UA = 'svartamalin-rsvp/0.1 (one-shot party site; contact: guff@guff.se)'

// OSRM publika demo-routern — gratis, ingen API-nyckel.
async function fetchDrivingRoute(from, to) {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`OSRM ${res.status}: ${await res.text().catch(() => '')}`)
  const data = await res.json()
  if (!data.routes?.length) throw new Error('OSRM gav ingen rutt')
  return {
    coordinates: data.routes[0].geometry.coordinates, // [[lon,lat], ...]
    distance: data.routes[0].distance,
    duration: data.routes[0].duration,
  }
}

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
]

async function fetchOverpass(query) {
  let lastErr
  for (let i = 0; i < OVERPASS_ENDPOINTS.length; i++) {
    try {
      const res = await fetch(OVERPASS_ENDPOINTS[i], {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': UA },
        body: 'data=' + encodeURIComponent(query),
      })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`Overpass ${res.status} ${body.slice(0, 200)}`)
      }
      const data = await res.json()
      return data
    } catch (e) {
      console.log(`Endpoint ${i + 1} fail (${e.message.slice(0, 80)}…), försöker nästa`)
      lastErr = e
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
  throw lastErr
}

function buildWaterQuery(b) {
  return `
    [out:json][timeout:120];
    (
      way["natural"="water"](${b.minLat},${b.minLon},${b.maxLat},${b.maxLon});
      relation["natural"="water"](${b.minLat},${b.minLon},${b.maxLat},${b.maxLon});
      way["water"](${b.minLat},${b.minLon},${b.maxLat},${b.maxLon});
      relation["water"](${b.minLat},${b.minLon},${b.maxLat},${b.maxLon});
      way["natural"="bay"](${b.minLat},${b.minLon},${b.maxLat},${b.maxLon});
      relation["natural"="bay"](${b.minLat},${b.minLon},${b.maxLat},${b.maxLon});
      way["natural"="strait"](${b.minLat},${b.minLon},${b.maxLat},${b.maxLon});
      relation["natural"="strait"](${b.minLat},${b.minLon},${b.maxLat},${b.maxLon});
      way["place"="sea"](${b.minLat},${b.minLon},${b.maxLat},${b.maxLon});
      relation["place"="sea"](${b.minLat},${b.minLon},${b.maxLat},${b.maxLon});
    );
    out geom;
  `
}

function buildIslandQuery(b) {
  return `
    [out:json][timeout:90];
    (
      way["place"~"^(island|islet)$"](${b.minLat},${b.minLon},${b.maxLat},${b.maxLon});
      relation["place"~"^(island|islet)$"](${b.minLat},${b.minLon},${b.maxLat},${b.maxLon});
    );
    out geom;
  `
}

// Kustlinjer — för att kunna bygga land-polygoner för områden där OSM inte
// har vatten-polygoner (t.ex. Stockholms skärgård / Östersjön).
function buildCoastlineQuery(b) {
  return `
    [out:json][timeout:120];
    way["natural"="coastline"](${b.minLat},${b.minLon},${b.maxLat},${b.maxLon});
    out geom;
  `
}

// Approx equality för koordinater (för att stitcha kustlinje-ways).
function approxEq(a, b, eps = 1e-7) {
  return Math.abs(a[0] - b[0]) < eps && Math.abs(a[1] - b[1]) < eps
}

// Bygg HAVS-polygoner från kustlinje-ways.
// OSM: när man går längs en kustlinje är havet till HÖGER, land till VÄNSTER.
// Öppna kedjor (kustlinjer som lämnar bbox) stängs MEDURS runt bbox-kanten:
// då hamnar havet INUTI den slutna polygonen.
// Stängda kedjor är öar (land) — de returneras separat så de kan målas som
// pergament ovanpå havs-polygonerna.
function coastlinesToSeaAndIslands(elements, bbox) {
  const ways = elements
    .filter((el) => el.type === 'way' && Array.isArray(el.geometry) && el.geometry.length >= 2)
    .map((el) => el.geometry.map((g) => [g.lon, g.lat]))

  // Stitcha ways genom att matcha endpoints
  const remaining = ways.slice()
  const chains = []
  while (remaining.length) {
    let cur = remaining.shift()
    let extended = true
    while (extended) {
      extended = false
      const tail = cur[cur.length - 1]
      const head = cur[0]
      for (let i = 0; i < remaining.length; i++) {
        const w = remaining[i]
        if (approxEq(tail, w[0])) {
          cur = cur.concat(w.slice(1)); remaining.splice(i, 1); extended = true; break
        }
        if (approxEq(tail, w[w.length - 1])) {
          cur = cur.concat(w.slice().reverse().slice(1)); remaining.splice(i, 1); extended = true; break
        }
        if (approxEq(head, w[w.length - 1])) {
          cur = w.concat(cur.slice(1)); remaining.splice(i, 1); extended = true; break
        }
        if (approxEq(head, w[0])) {
          cur = w.slice().reverse().concat(cur.slice(1)); remaining.splice(i, 1); extended = true; break
        }
      }
    }
    chains.push(cur)
  }

  // Stäng varje kedja → polygon
  const corners = [
    [bbox.maxLon, bbox.maxLat], // NE (mellan N och E)
    [bbox.maxLon, bbox.minLat], // SE (mellan E och S)
    [bbox.minLon, bbox.minLat], // SW (mellan S och W)
    [bbox.minLon, bbox.maxLat], // NW (mellan W och N)
  ]
  // edge: 0=N, 1=E, 2=S, 3=W
  const edgeOf = (pt) => {
    const dN = bbox.maxLat - pt[1]
    const dS = pt[1] - bbox.minLat
    const dE = bbox.maxLon - pt[0]
    const dW = pt[0] - bbox.minLon
    const d = Math.min(dN, dS, dE, dW)
    if (d === dN) return 0
    if (d === dE) return 1
    if (d === dS) return 2
    return 3
  }
  const snap = (pt) => {
    const e = edgeOf(pt)
    if (e === 0) return [pt[0], bbox.maxLat]
    if (e === 1) return [bbox.maxLon, pt[1]]
    if (e === 2) return [pt[0], bbox.minLat]
    return [bbox.minLon, pt[1]]
  }

  const seaPolygons = []     // havsytor — blå (sluten via bbox)
  const islandPolygons = []  // slutna öar — pergament
  const openChains = []      // de råa kustlinje-kedjorna (för stroke)
  for (const chain of chains) {
    if (chain.length < 3) continue
    const first = chain[0]
    const last = chain[chain.length - 1]
    if (approxEq(first, last)) {
      islandPolygons.push(chain)
      continue
    }
    const startSnap = snap(first)
    const endSnap = snap(last)
    const startEdge = edgeOf(first)
    const endEdge = edgeOf(last)

    if (startEdge === endEdge) {
      // Kedjan går ut och tillbaka på samma bbox-kant — det är (sannolikt)
      // en ö vars huvuddel ligger utanför bbox. Stäng kort längs den kanten
      // så vi får en land-polygon istället för en sea-polygon som svänger
      // runt hela bbox.
      islandPolygons.push([...chain, endSnap, startSnap, first])
      openChains.push(chain)
      continue
    }

    const closingCorners = []
    let e = endEdge
    let safety = 0
    while (e !== startEdge && safety++ < 5) {
      closingCorners.push(corners[e])
      e = (e + 1) % 4
    }
    seaPolygons.push([...chain, endSnap, ...closingCorners, startSnap, first])
    openChains.push(chain)
  }
  return { seaPolygons, islandPolygons, openChains }
}

function roundCoord([lon, lat]) {
  const p = Math.pow(10, COORD_PRECISION)
  return [Math.round(lon * p) / p, Math.round(lat * p) / p]
}

function decimate(ring, eps) {
  if (ring.length < 4) return ring
  const out = [ring[0]]
  for (let i = 1; i < ring.length - 1; i++) {
    const [px, py] = out[out.length - 1]
    const [x, y] = ring[i]
    if (Math.abs(x - px) > eps || Math.abs(y - py) > eps) out.push(ring[i])
  }
  const last = ring[ring.length - 1]
  if (out[0][0] !== last[0] || out[0][1] !== last[1]) out.push(out[0])
  else out.push(last)
  return out.length >= 4 ? out : ring
}

function processRing(ring, eps) {
  return decimate(ring, eps).map(roundCoord)
}

// För öar — bara hög upplösning runt själva båtfasen (hamn + Ovanan + omgivande
// vatten). Längs bilvägen filtreras små öar bort med samma threshold som
// små sjöar.
function pickIslandLevel(centerLon, centerLat, bbox) {
  // Yttre 20 % av bbox → låg
  const halfLon = (bbox.maxLon - bbox.minLon) / 2
  const halfLat = (bbox.maxLat - bbox.minLat) / 2
  const cLon = (bbox.minLon + bbox.maxLon) / 2
  const cLat = (bbox.minLat + bbox.maxLat) / 2
  const dxN = Math.abs(centerLon - cLon) / halfLon
  const dyN = Math.abs(centerLat - cLat) / halfLat
  if (Math.max(dxN, dyN) > 0.9) return LEVELS.low

  // Avstånd till båt-fasens hot spots
  const hotSpots = [
    [HARBOR.lon, HARBOR.lat],
    [OVANAN.lon, OVANAN.lat],
    [(HARBOR.lon + OVANAN.lon) / 2, (HARBOR.lat + OVANAN.lat) / 2],
  ]
  let minD2 = Infinity
  for (const [hLon, hLat] of hotSpots) {
    const dx = centerLon - hLon
    const dy = centerLat - hLat
    const d2 = dx * dx + dy * dy
    if (d2 < minD2) minD2 = d2
  }
  const d = Math.sqrt(minD2)
  if (d < 0.04) return LEVELS.high  // ~2–4 km från hamn/Ovanan
  if (d < 0.10) return LEVELS.med
  return LEVELS.low
}

function pickLevel(centerLon, centerLat, sampledRoute, bbox) {
  // Yttre 20 % av bbox → låg detaljgrad
  const halfLon = (bbox.maxLon - bbox.minLon) / 2
  const halfLat = (bbox.maxLat - bbox.minLat) / 2
  const cLon = (bbox.minLon + bbox.maxLon) / 2
  const cLat = (bbox.minLat + bbox.maxLat) / 2
  const dxN = Math.abs(centerLon - cLon) / halfLon
  const dyN = Math.abs(centerLat - cLat) / halfLat
  if (Math.max(dxN, dyN) > 0.9) return LEVELS.low

  // Avstånd till rutten
  let minD2 = Infinity
  for (const [rlon, rlat] of sampledRoute) {
    const dx = centerLon - rlon
    const dy = centerLat - rlat
    const d2 = dx * dx + dy * dy
    if (d2 < minD2) minD2 = d2
  }
  const d = Math.sqrt(minD2)
  if (d < 0.02) return LEVELS.high   // ~1–2 km från vägen
  if (d < 0.06) return LEVELS.med    // ~3–6 km
  return LEVELS.low
}

function polygonCenter(ring) {
  let sLon = 0, sLat = 0
  for (const [lon, lat] of ring) { sLon += lon; sLat += lat }
  return [sLon / ring.length, sLat / ring.length]
}

// Bbox-area i grader² som proxy för storlek.
function ringArea(ring) {
  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity
  for (const [lon, lat] of ring) {
    if (lon < minLon) minLon = lon
    if (lon > maxLon) maxLon = lon
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
  }
  return (maxLon - minLon) * (maxLat - minLat)
}

// Konvertera Overpass-elements till GeoJSON-liknande, med variabel detaljgrad
// per feature beroende på position.
function elementsToFeatures(elements, sampledRoute, bbox, isIslands = false) {
  const pickFor = (lon, lat) => isIslands
    ? pickIslandLevel(lon, lat, bbox)
    : pickLevel(lon, lat, sampledRoute, bbox)
  const features = []
  const seenIds = new Set()
  for (const el of elements) {
    // Dedupera: olika queries kan returnera samma element
    const id = `${el.type}-${el.id}`
    if (seenIds.has(id)) continue
    seenIds.add(id)
    if (el.type === 'way' && el.geometry) {
      const ring = el.geometry.map((g) => [g.lon, g.lat])
      if (ring.length >= 4 && ring[0][0] === ring.at(-1)[0] && ring[0][1] === ring.at(-1)[1]) {
        const [cLon, cLat] = polygonCenter(ring)
        const lvl = pickFor(cLon, cLat)
        if (ringArea(ring) < lvl.minArea) continue
        features.push({ type: 'Polygon', coordinates: [processRing(ring, lvl.eps)] })
      }
    } else if (el.type === 'relation' && Array.isArray(el.members)) {
      // Bygg multipolygon: gruppera outer-medlemmar till en lista, inner till en annan.
      const outers = []
      const inners = []
      for (const m of el.members) {
        if (m.type !== 'way' || !m.geometry) continue
        const ring = m.geometry.map((g) => [g.lon, g.lat])
        if (ring.length < 2) continue
        ;(m.role === 'inner' ? inners : outers).push(ring)
      }
      const outerPolys = stitchRings(outers)
      const innerPolys = stitchRings(inners)
      // Detaljnivå utifrån första outer-polygonens center
      const firstOuter = outerPolys[0]
      if (!firstOuter) continue
      const [cLon, cLat] = polygonCenter(firstOuter)
      const lvl = pickFor(cLon, cLat)
      const keep = outerPolys.filter((p) => ringArea(p) >= lvl.minArea)
      if (!keep.length) continue
      const polygons = keep.map((outer, i) => {
        const rings = [processRing(outer, lvl.eps)]
        if (i === 0) for (const inner of innerPolys) rings.push(processRing(inner, lvl.eps))
        return rings
      })
      if (polygons.length === 1) {
        features.push({ type: 'Polygon', coordinates: polygons[0] })
      } else {
        features.push({ type: 'MultiPolygon', coordinates: polygons })
      }
    }
  }
  return features
}

// Slå ihop ringar som delar ändpunkt till slutna polygoner.
function stitchRings(rings) {
  const out = []
  const remaining = rings.map((r) => r.slice())
  while (remaining.length) {
    let cur = remaining.shift()
    let progress = true
    while (progress) {
      progress = false
      const head = cur[0]
      const tail = cur.at(-1)
      // Slut redan?
      if (head[0] === tail[0] && head[1] === tail[1] && cur.length >= 4) break
      for (let i = 0; i < remaining.length; i++) {
        const r = remaining[i]
        const rHead = r[0]
        const rTail = r.at(-1)
        if (tail[0] === rHead[0] && tail[1] === rHead[1]) {
          cur = cur.concat(r.slice(1)); remaining.splice(i, 1); progress = true; break
        }
        if (tail[0] === rTail[0] && tail[1] === rTail[1]) {
          cur = cur.concat(r.slice().reverse().slice(1)); remaining.splice(i, 1); progress = true; break
        }
        if (head[0] === rTail[0] && head[1] === rTail[1]) {
          cur = r.slice().concat(cur.slice(1)); remaining.splice(i, 1); progress = true; break
        }
        if (head[0] === rHead[0] && head[1] === rHead[1]) {
          cur = r.slice().reverse().concat(cur.slice(1)); remaining.splice(i, 1); progress = true; break
        }
      }
    }
    if (cur.length >= 4) out.push(cur)
  }
  return out
}

async function main() {
  console.log('Hämtar bilväg Stockholm → Hamnen via OSRM …')
  const drivingRoute = await fetchDrivingRoute(STOCKHOLM, HARBOR)
  console.log(`Bilväg: ${drivingRoute.coordinates.length} punkter, ${(drivingRoute.distance / 1000).toFixed(1)} km, ${Math.round(drivingRoute.duration / 60)} min`)

  // Avrunda och decimera bilvägen så filen inte blir onödigt stor.
  const driving = drivingRoute.coordinates.map(roundCoord)

  await new Promise((r) => setTimeout(r, 1100))

  // High-res-zonen begränsad till Salmonellahavet/Ovanan/hamn-området (där
  // kameran zoomar in i slutet). Allt annat — inklusive bilvägen genom Mälaren
  // — får MED eller LOW och kan dra ner data-storleken kraftigt.
  const sampledRoute = []
  // Tät sampling längs båt-rutten harbor → Ovanan
  for (let t = 0; t <= 1; t += 0.05) {
    sampledRoute.push([
      HARBOR.lon + (OVANAN.lon - HARBOR.lon) * t,
      HARBOR.lat + (OVANAN.lat - HARBOR.lat) * t,
    ])
  }
  // Spridning runt Salmonellahavet/Ovanan så hela det området får hög res
  for (let dlon = -0.05; dlon <= 0.05; dlon += 0.015) {
    for (let dlat = -0.04; dlat <= 0.04; dlat += 0.015) {
      sampledRoute.push([OVANAN.lon + dlon, OVANAN.lat + dlat])
    }
  }
  // Södra Mälaren / Södertälje-trakten — så att Igelstaviken och
  // omkringliggande vatten inte filtreras bort av LOW-tröskeln.
  for (let lon = 17.45; lon <= 17.85; lon += 0.05) {
    for (let lat = 59.07; lat <= 59.25; lat += 0.04) {
      sampledRoute.push([lon, lat])
    }
  }

  console.log('Hämtar vatten från Overpass i bbox', BBOX, '…')
  const data = await fetchOverpass(buildWaterQuery(BBOX))
  console.log('Fick', data.elements.length, 'vatten-element')
  const waterRaw = elementsToFeatures(data.elements, sampledRoute, BBOX)
  console.log('Genererade', waterRaw.length, 'vatten-features (innan union)')

  // Union: slå ihop vatten-polygoner som delar gränser så de interna kanterna
  // försvinner (inga dubbel-strokade kustlinjer mellan t.ex. Mälaren och en
  // anslutande vik). polygon-clipping accepterar MultiPolygon-format:
  // varje feature → array av Polygon (vardera = [outer, ...inners]).
  function toPolyArrays(features) {
    const polys = []
    for (const f of features) {
      if (f.type === 'Polygon') polys.push(f.coordinates)
      else if (f.type === 'MultiPolygon') for (const p of f.coordinates) polys.push(p)
    }
    return polys
  }
  let water = waterRaw
  try {
    const polys = toPolyArrays(waterRaw)
    if (polys.length > 1) {
      const merged = polygonClipping.union(...polys)
      water = merged.map((p) => ({ type: 'Polygon', coordinates: p }))
      console.log('Efter union:', water.length, 'vatten-features')
    }
  } catch (err) {
    console.warn('Vatten-union misslyckades, fortsätter med oförenade polygoner:', err.message)
  }

  await new Promise((r) => setTimeout(r, 1100))

  console.log('Hämtar öar (place=island/islet) från Overpass …')
  const islandData = await fetchOverpass(buildIslandQuery(BBOX))
  console.log('Fick', islandData.elements.length, 'ö-element')
  const islandsAll = elementsToFeatures(islandData.elements, sampledRoute, BBOX, true)
  // Filtrera bort jättestora "öar" (Södertörn etc. tagges som island i OSM
  // trots att de är fastland — deras pergament-fyllning täcker insjöar.)
  const MAX_ISLAND_AREA = 0.01  // ~100 km² bbox-area
  const islands = islandsAll.filter((f) => {
    const ring = f.type === 'Polygon' ? f.coordinates[0] : f.coordinates[0][0]
    return ringArea(ring) < MAX_ISLAND_AREA
  })
  console.log('Genererade', islandsAll.length, '→', islands.length, 'ö-features (filtrerade)')

  await new Promise((r) => setTimeout(r, 1100))

  console.log('Hämtar kustlinjer (natural=coastline) från Overpass …')
  const coastlineData = await fetchOverpass(buildCoastlineQuery(BBOX))
  console.log('Fick', coastlineData.elements.length, 'kustlinje-element')
  const { seaPolygons, islandPolygons, openChains } = coastlinesToSeaAndIslands(coastlineData.elements, BBOX)
  console.log('Genererade', seaPolygons.length, 'havs-polygoner,', islandPolygons.length, 'ö-polygoner från kustlinje')
  const coastlineSea = seaPolygons.map((ring) => ({
    type: 'Polygon',
    coordinates: [ring.map(roundCoord)],
  }))
  const coastlineIslands = islandPolygons.map((ring) => ({
    type: 'Polygon',
    coordinates: [ring.map(roundCoord)],
  }))
  // Råa kustlinje-kedjor (utan bbox-stängning) som LineString — för stroke
  const coastlineStrokes = openChains.map((chain) => chain.map(roundCoord))

  const out = {
    bbox: BBOX,
    points: {
      stockholm: STOCKHOLM,
      harbor: HARBOR,
      ovanan: OVANAN,
    },
    drivingRoute: driving,  // [[lon,lat], ...] — verklig bilväg
    water,
    islands,
    coastlineSea,
    coastlineIslands,
    coastlineStrokes,
    generatedAt: new Date().toISOString(),
    sources: {
      coordinates: 'OpenStreetMap contributors',
      routing: 'OSRM public demo server',
      water: 'Overpass API — natural=water in bbox',
    },
  }

  const outPath = resolve(__dirname, '..', 'public', 'map-data.json')
  writeFileSync(outPath, JSON.stringify(out))
  console.log('Skrev', outPath, `(${(JSON.stringify(out).length / 1024).toFixed(1)} KB)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
