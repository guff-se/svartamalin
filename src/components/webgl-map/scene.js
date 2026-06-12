// Bygger den statiska Pixi-scenen från map-data.json + dekorations-PNGs.
// Returnerar en `Scene` med refs till alla element som timeline:n behöver.
//
// Lager (botten → topp inuti rootContainer):
//   bottom-plate (mörkbrun)
//   parchment-tile (täcker hela världen)
//   water (blå polygoner)
//   coastline-sea (yttre hav, samma blå)
//   islands (pergament-textur ovanpå vattnet)
//   coastline-islands (pergament fill)
//   coastline-stroke (mörka linjer)
//   driveRoute (P4)
//   boatRoute (P4)
//   decor (alla sprites + cities)
//   harbor-marker (sprite + text)
//   sea-label (SALMONELLAHAVET)
//   ourShip (animerad)

import { Assets, Container, Graphics, Sprite, Text, TilingSprite, Texture } from 'pixi.js'
import { buildProjection } from './projection.js'
import { DECOR_LL, DECOR_SIZE, sampleRoad } from './decor-positions.js'
import { buildRoutes } from './routes.js'
import { catmullRomPolyline } from './catmull-rom.js'

const MAP_DATA_URL = '/map-data.json'

const DECOR_ASSETS = {
  parchment:    '/images/map/parchment.png',
  wagon:        '/images/map/wagon.png',
  // Keys = filename för att undvika missförstånd. Bytt bild = bytt key.
  pirateOgre: '/images/map/pirate-ogre.png',
  tree1:      '/images/map/tree-1.png',
  tree2:      '/images/map/tree-2.png',
  village1:     '/images/map/village-1.png',
  village2:     '/images/map/village-2.png',
  village3:     '/images/map/village-3.png',
  globen:       '/images/map/globen.png',
  skull:        '/images/map/skull-warning.png',
  robbers:      '/images/map/robbers.png',
  dragon0:      '/images/map/dragon-warning-1.png',
  dragon1:      '/images/map/dragon-warning-2.png',
  kraken:       '/images/map/kraken.png',
  octopus:      '/images/map/octopus.png',
  mermaid:      '/images/map/mermaid.png',
  seaMonster:   '/images/map/sea-monster.png',
  whale1:       '/images/map/whale-1.png',
  decorShip:    '/images/map/decor-ship.png',
  storm:        '/images/map/storm-cloud.png',
  compass:      '/images/map/compass-rose.png',
  ourShip:      '/images/map/our-ship.png',
  stockholm:    '/images/map/stockholm-silhouette.png',
  sodertalje:   '/images/map/sodertalje-silhouette.png',
  harborDock:   '/images/map/harbor-dock-ne.png',
  ovananMap:    '/images/maps/ovanan.jpg',
  xMarks:       '/images/map/x-marks-the-spot.png',
}

export async function buildScene() {
  // Ladda data + alla texturer parallellt
  const dataPromise = fetch(MAP_DATA_URL).then((r) => r.json())
  const textures = {}
  await Promise.all(
    Object.entries(DECOR_ASSETS).map(async ([k, src]) => {
      textures[k] = await Assets.load(src)
    }),
  )
  const data = await dataPromise

  const { bbox, points, water, islands = [], coastlineSea = [], coastlineIslands = [], coastlineStrokes = [], drivingRoute } = data
  const proj = buildProjection(bbox)
  const { project, VIEW_W, viewH } = proj

  // ROOT — alla world-coords i SVG-units (0..VIEW_W × 0..viewH).
  // Camera (P2) styr root.position/scale/rotation.
  const root = new Container()
  root.label = 'webgl-root'

  // Bottenplåt
  const bottom = new Graphics()
  bottom.rect(0, 0, VIEW_W, viewH).fill({ color: 0x3a2410 })
  root.addChild(bottom)

  // Pergament — tiling över hela världen (+ extra rand så zoom-ut inte avslöjar kanter)
  const parchment = new TilingSprite({
    texture: textures.parchment,
    width: VIEW_W * 1.6,
    height: viewH * 1.6,
  })
  parchment.x = -VIEW_W * 0.3
  parchment.y = -viewH * 0.3
  root.addChild(parchment)

  // Vatten + öar med evenodd-fill så GeoJSON-polygon-holes respekteras
  // (en outer ring + interior rings = öar i sjöar i öar).
  const waterColor = 0x4a6a74
  const waterG = new Graphics()
  fillFeatures(waterG, water, project, { color: waterColor })
  root.addChild(waterG)

  const coastlineSeaG = new Graphics()
  fillFeatures(coastlineSeaG, coastlineSea, project, { color: waterColor })
  root.addChild(coastlineSeaG)

  const islandsG = new Graphics()
  fillFeatures(islandsG, islands, project, { texture: textures.parchment })
  root.addChild(islandsG)

  const coastlineIslandsG = new Graphics()
  fillFeatures(coastlineIslandsG, coastlineIslands, project, { texture: textures.parchment })
  root.addChild(coastlineIslandsG)

  // Kustlinje-strokes — matchar originalets <path class="coastline"
  // d="${coastlineStrokeD}${coastlineIslandsPath}${waterPath}${islandsPath}" />
  // som strokear ALLA polygon-kanter + öppna kustlinje-chains. Utan denna
  // saknar inlandsöar och sjöar sin tydliga konturlinje.
  const coastlineG = new Graphics()
  // 1) Öppna chains (havs-kustlinje)
  for (const chain of coastlineStrokes) {
    if (chain.length < 2) continue
    const [x0, y0] = project(chain[0])
    coastlineG.moveTo(x0, y0)
    for (let i = 1; i < chain.length; i++) {
      const [x, y] = project(chain[i])
      coastlineG.lineTo(x, y)
    }
  }
  // 2) Alla polygon-ringar (outer + holes) från water, islands, coastlineSea,
  //    coastlineIslands som linjer i samma path → stroke en gång.
  const addPolygonRingsToStrokes = (features) => {
    for (const f of features) {
      if (!f) continue
      const polys = f.type === 'Polygon' ? [f.coordinates] : f.type === 'MultiPolygon' ? f.coordinates : []
      for (const poly of polys) {
        for (const ring of poly) {
          if (ring.length < 2) continue
          const [x0, y0] = project(ring[0])
          coastlineG.moveTo(x0, y0)
          for (let i = 1; i < ring.length; i++) {
            const [x, y] = project(ring[i])
            coastlineG.lineTo(x, y)
          }
        }
      }
    }
  }
  addPolygonRingsToStrokes(coastlineIslands)
  addPolygonRingsToStrokes(water)
  addPolygonRingsToStrokes(islands)
  coastlineG.stroke({ width: 1.2, color: 0x2a1810, alpha: 0.85, join: 'round' })
  root.addChild(coastlineG)

  // Routes — drive (OSRM-polyline) och boat (Bezier-sample)
  const drivingPoly = drivingRoute.map((ll) => project(ll))
  const [hxRoute, hyRoute] = project([points.harbor.lon, points.harbor.lat])
  const [oxRoute, oyRoute] = project([points.ovanan.lon, points.ovanan.lat])
  const routes = buildRoutes({
    drivingPoly,
    harbor: [hxRoute, hyRoute],
    ovanan: [oxRoute, oyRoute],
  })

  // Camera-path för drive-fasen: SAMA Catmull-Rom-smoothing som originalet
  // (5 waypoints jämnt fördelade längs OSRM-rutten → cubic Bezier interpolering).
  // Detta är OBLIGATORISKT — kameran måste följa en glatt path, inte de
  // jagged OSRM-vertices, annars rycker den vid varje hörn (~880 corners).
  const driveCumLen = (() => {
    const out = [0]
    for (let i = 1; i < drivingPoly.length; i++) {
      const dx = drivingPoly[i][0] - drivingPoly[i-1][0]
      const dy = drivingPoly[i][1] - drivingPoly[i-1][1]
      out.push(out[i-1] + Math.hypot(dx, dy))
    }
    return out
  })()
  const totalDriveLen = driveCumLen[driveCumLen.length - 1]
  const sampleDriveAt = (target) => {
    if (target <= 0) return { x: drivingPoly[0][0], y: drivingPoly[0][1] }
    if (target >= totalDriveLen) return { x: drivingPoly.at(-1)[0], y: drivingPoly.at(-1)[1] }
    for (let i = 1; i < driveCumLen.length; i++) {
      if (driveCumLen[i] >= target) {
        const t = (target - driveCumLen[i-1]) / (driveCumLen[i] - driveCumLen[i-1])
        return {
          x: drivingPoly[i-1][0] + (drivingPoly[i][0] - drivingPoly[i-1][0]) * t,
          y: drivingPoly[i-1][1] + (drivingPoly[i][1] - drivingPoly[i-1][1]) * t,
        }
      }
    }
    return { x: drivingPoly.at(-1)[0], y: drivingPoly.at(-1)[1] }
  }
  const N = 4  // 5 waypoints, matchar map.js
  const driveWaypoints = []
  for (let i = 0; i <= N; i++) driveWaypoints.push(sampleDriveAt((i / N) * totalDriveLen))
  const camDrivePoly = catmullRomPolyline(driveWaypoints, 80)  // 320 punkter total, glatt nog

  // --- Decor sprites (renderas före routes så vägen syns ovanpå) ---
  const decor = new Container()
  decor.label = 'decor'
  root.addChild(decor)

  // Routes ovanpå decor (matchar map.js där drivingRoute/boatRoute path
  // står efter alla decorImage-anrop i SVG-strukturen).
  const routesLayer = new Container()
  routesLayer.label = 'routes'
  routesLayer.addChild(routes.drive.g)
  routesLayer.addChild(routes.boat.g)
  root.addChild(routesLayer)

  const sprites = {}

  const addSprite = (key, [lon, lat], size, opts = {}) => {
    const [x, y] = project([lon, lat])
    const s = new Sprite(textures[key])
    s.anchor.set(opts.anchorX ?? 0.5, opts.anchorY ?? 0.5)
    s.width = size
    s.height = size
    // Spara baseScale eftersom Pixi width/height-setter manipulerar scale.x/.y
    // internt. När reveal-timeline tweens scale, måste den tween:a TILL
    // baseScale (inte 1.0) annars hoppar sprite:n till texture-native storlek
    // (~5-6× större än avsett).
    s._baseScale = { x: s.scale.x, y: s.scale.y }
    s.x = x
    s.y = y
    s.label = key
    decor.addChild(s)
    sprites[key] = s
    return s
  }

  // Städer — citySilhouette i map.js: box width × (width*0.45), bottom-anchored,
  // preserveAspectRatio="meet" så bilden FITS inom boxen utan att stretchas.
  // Plus text-etikett y=20 under bottenkanten.
  const addCity = (key, ll, boxWidth, label, imgYOffset = 0) => {
    const [cx, cy] = project(ll)
    const boxH = boxWidth * 0.45
    const tex = textures[key]
    // Beräkna effektiv visuell storlek som bevarar texturens aspect inom box:n
    // (motsvarar SVG preserveAspectRatio="xMidYMid meet").
    const texAspect = tex.width / tex.height
    const boxAspect = boxWidth / boxH
    let w, h
    if (texAspect > boxAspect) { w = boxWidth; h = boxWidth / texAspect }
    else { w = boxH * texAspect; h = boxH }
    const s = new Sprite(tex)
    s.anchor.set(0.5, 1.0)  // bottom-middle
    s.width = w
    s.height = h
    s._baseScale = { x: s.scale.x, y: s.scale.y }
    s.x = cx
    s.y = cy + imgYOffset
    s.label = key
    decor.addChild(s)
    sprites[key] = s
    // Etikett under sprite:n (y=20 i originalets citySilhouette)
    const labelText = new Text({
      text: label,
      style: {
        fontFamily: 'Metamorphous, Georgia, serif',
        fontSize: 22,
        fontStyle: 'italic',
        fontWeight: 'bold',
        letterSpacing: 2.2,
        fill: 0x1a0a05,
      },
    })
    labelText.anchor.set(0.5, 0)
    labelText.x = cx
    labelText.y = cy + 20
    decor.addChild(labelText)
    return s
  }
  addCity('stockholm',  [points.stockholm.lon, points.stockholm.lat], DECOR_SIZE.stockholm,  'Stockholm', 28)
  addCity('sodertalje', [17.6253, 59.1958],                            DECOR_SIZE.sodertalje, 'Södertälje')

  // sampleRoad-positionerade sprites: wagon (på vägen, t=0.08), tree1 (offset
  // -40 från vägen, t=0.20), village1 (offset +35, t=0.38). Matchar map.js
  // raderna 233-235 exakt. Får sin position från den projicerade OSRM-polyline.
  const addRoadSprite = (key, t, perpOffset, size) => {
    const [x, y] = sampleRoad(drivingPoly, t, perpOffset)
    const s = new Sprite(textures[key])
    s.anchor.set(0.5, 0.5)
    s.width = size
    s.height = size
    s._baseScale = { x: s.scale.x, y: s.scale.y }
    s.x = x; s.y = y
    s.label = key
    decor.addChild(s)
    sprites[key] = s
    return s
  }
  addRoadSprite('wagon',    0.08,   0, DECOR_SIZE.wagon)
  addRoadSprite('tree1',    0.20, -40, DECOR_SIZE.tree)
  addRoadSprite('village1', 0.38,  35, DECOR_SIZE.village1)

  // sampleRoad-positioner — kräver att drivingPoly redan är beräknad
  // (gjord nedan i routes-blocket), så vi placerar dessa sprites där.
  // För kvarvarande sprites: vanlig project([lon, lat]).

  // Sjö-decor (boat-fas)
  addSprite('kraken',     DECOR_LL.kraken,     DECOR_SIZE.kraken)
  addSprite('octopus',    DECOR_LL.octopus,    DECOR_SIZE.octopus)
  addSprite('mermaid',    DECOR_LL.mermaid,    DECOR_SIZE.mermaid)
  addSprite('seaMonster', DECOR_LL.seaMonster, DECOR_SIZE.seaMonster)
  addSprite('whale1',     DECOR_LL.whale1,     DECOR_SIZE.whale)
  addSprite('decorShip',  DECOR_LL.decorShip,  DECOR_SIZE.decorShip)
  addSprite('storm',      DECOR_LL.storm,      DECOR_SIZE.storm)
  addSprite('compass',    DECOR_LL.compass,    DECOR_SIZE.compass)
  addSprite('skull',      DECOR_LL.skull,      DECOR_SIZE.skull)

  // "Pestholmen"-label under skull (matchar map.js skull()-funktionen)
  {
    const [sx, sy] = project(DECOR_LL.skull)
    const pestholmenLabel = new Text({
      text: 'Pestholmen',
      style: {
        fontFamily: 'Metamorphous, Georgia, serif',
        fontSize: 14,
        fontStyle: 'italic',
        letterSpacing: 1.4,
        fill: 0x1a0a05,
      },
    })
    pestholmenLabel.anchor.set(0.5, 0)
    pestholmenLabel.x = sx
    pestholmenLabel.y = sy + 58
    decor.addChild(pestholmenLabel)
  }

  // Land-figurer (statiska lat/lon)
  addSprite('pirateOgre', DECOR_LL.pirateOgre, DECOR_SIZE.pirateOgre)
  addSprite('tree2',      DECOR_LL.tree2,      DECOR_SIZE.tree)
  addSprite('robbers',  DECOR_LL.robbers,  DECOR_SIZE.robbers)
  addSprite('village2', DECOR_LL.village2, DECOR_SIZE.village2)
  addSprite('village3', DECOR_LL.village3, DECOR_SIZE.village3)
  addSprite('globen',   DECOR_LL.globen,   DECOR_SIZE.globen)
  addSprite('dragon0',  DECOR_LL.dragon0,  DECOR_SIZE.dragon)
  addSprite('dragon1',  DECOR_LL.dragon1,  DECOR_SIZE.dragon)

  // Hamn-marker (bryggan + text)
  const [hx, hy] = project([points.harbor.lon, points.harbor.lat])
  const harborMarker = new Container()
  harborMarker.label = 'harbor-marker'
  const dock = new Sprite(textures.harborDock)
  dock.anchor.set(0.5, 0.5)  // mitten-mitten på hamn-koordinaten
  dock.width = DECOR_SIZE.harborDock
  dock.height = DECOR_SIZE.harborDock
  harborMarker.addChild(dock)
  // harbor-marker tweenas via Container (inte sprite) — Container har
  // default scale 1, så ingen baseScale behövs här.
  harborMarker._baseScale = { x: 1, y: 1 }
  harborMarker.x = hx
  harborMarker.y = hy
  decor.addChild(harborMarker)

  // Vårt skepp (kommer animeras längs båt-pathen)
  const ourShip = new Sprite(textures.ourShip)
  ourShip.anchor.set(0.5, 1.0)  // bottom-middle som SVG-originalet
  ourShip.width = DECOR_SIZE.ourShip
  ourShip.height = DECOR_SIZE.ourShip
  ourShip._baseScale = { x: ourShip.scale.x, y: ourShip.scale.y }
  ourShip.x = hx
  ourShip.y = hy
  ourShip.label = 'our-ship'
  root.addChild(ourShip)  // ovanpå allt

  // Ovanan-overlay: foto av ön. Centrerad på ovanan-koordinaten, sized
  // för att täcka ön. Initially alpha 0 — fadear in när skeppet anlänt.
  // ovanan.jpg = 1024×1536 (aspect 0.667).
  const OVANAN_W = 7.5
  const OVANAN_H = OVANAN_W * (1536 / 1024)  // 11.25
  const ovananMap = new Sprite(textures.ovananMap)
  ovananMap.anchor.set(0.5, 0.5)
  ovananMap.width = OVANAN_W
  ovananMap.height = OVANAN_H
  ovananMap._baseScale = { x: ovananMap.scale.x, y: ovananMap.scale.y }
  ovananMap.x = oxRoute
  ovananMap.y = oyRoute
  ovananMap.alpha = 0
  ovananMap.label = 'ovanan-map'
  root.addChild(ovananMap)

  // X marks the spot — placeras på övre delen av ovanan.jpg (där husen är).
  // Offset ~ -25% av OVANAN_H från centrum. Storlek skalar med OVANAN_W.
  const xMarks = new Sprite(textures.xMarks)
  xMarks.anchor.set(0.5, 0.5)
  xMarks.width = OVANAN_W * 0.2
  xMarks.height = OVANAN_W * 0.2
  xMarks._baseScale = { x: xMarks.scale.x, y: xMarks.scale.y }
  xMarks.x = oxRoute
  xMarks.y = oyRoute - OVANAN_H * 0.25
  xMarks.alpha = 0
  xMarks.label = 'x-marks'
  root.addChild(xMarks)

  // Sea-label (SALMONELLAHAVET) — projicerad lat/lon från map.js rad 385.
  // Renderar vid 5× fontSize och skalar ner via scale så textens bitmap har
  // hög upplösning (annars pixleras den under boat-fasens inzoom). Pixi:s
  // resolution-option fungerar inte alltid pålitligt med oversize-renderTex,
  // så vi använder den klassiska "rita stort, skala ner"-tekniken.
  const [lx, ly] = project([17.549469, 59.293733])
  const SEA_LABEL_OVERSIZE = 5
  const seaLabel = new Text({
    text: 'SALMONELLAHAVET',
    style: {
      fontFamily: 'Metamorphous, Georgia, serif',
      fontSize: 13.6 * SEA_LABEL_OVERSIZE,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: 0x2a1810,
      letterSpacing: 5.4 * SEA_LABEL_OVERSIZE,
    },
  })
  seaLabel.anchor.set(0.5, 0.5)
  seaLabel.scale.set(1 / SEA_LABEL_OVERSIZE)
  seaLabel.x = lx
  seaLabel.y = ly
  root.addChild(seaLabel)

  return {
    root,
    proj,
    sprites,
    harborMarker,
    ourShip,
    ovananMap,
    xMarks,
    seaLabel,
    routesLayer,
    routes,
    points,
    journey: {
      sx: project([points.stockholm.lon, points.stockholm.lat])[0],
      sy: project([points.stockholm.lon, points.stockholm.lat])[1],
      hx,
      hy,
      ox: oxRoute,
      oy: oyRoute,
      drivingRoute,
      drivingPoly,
      camDrivePoly,           // glatt path för kamera-flygning
      boatPoly: routes.boatPoly,
    },
  }
}

// Rita GeoJSON-features. För varje Polygon: outer ring fills, hole rings
// "cuts" via Pixi v8 Graphics.cut() (subtraherar path från föregående fill,
// skapar äkta hål — så öar inuti Mälaren-polygonen blir transparenta).
function fillFeatures(g, features, project, fillStyle) {
  for (const f of features) {
    if (!f) continue
    if (f.type === 'Polygon') {
      drawPolygonWithHoles(g, f.coordinates, project, fillStyle)
    } else if (f.type === 'MultiPolygon') {
      for (const poly of f.coordinates) {
        drawPolygonWithHoles(g, poly, project, fillStyle)
      }
    }
  }
}

function drawPolygonWithHoles(g, rings, project, fillStyle) {
  if (!rings.length) return
  // Ring 0 = outer boundary → fill
  drawRing(g, rings[0], project)
  g.fill(fillStyle)
  // Resten = hål → cut() från föregående fill
  for (let i = 1; i < rings.length; i++) {
    drawRing(g, rings[i], project)
    g.cut()
  }
}

function drawRing(g, ring, project) {
  if (ring.length < 3) return
  const pts = []
  for (const ll of ring) {
    const [x, y] = project(ll)
    pts.push(x, y)
  }
  g.poly(pts)
}
