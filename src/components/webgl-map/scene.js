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
import { DECOR_POS, DECOR_SIZE } from './decor-positions.js'
import { buildRoutes } from './routes.js'

const MAP_DATA_URL = '/map-data.json'

const DECOR_ASSETS = {
  parchment:    '/images/map/parchment.png',
  wagon:        '/images/map/wagon.png',
  tree1:        '/images/map/tree-1.png',
  tree2:        '/images/map/tree-2.png',
  tree3:        '/images/map/tree-3.png',
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

  // Vatten (inland) — alla water-features som filled polys
  const waterColor = 0x4a6a74
  const waterG = new Graphics()
  addFeaturesToGraphics(waterG, water, project)
  waterG.fill({ color: waterColor })
  root.addChild(waterG)

  // Yttre hav (Saltsjön/skärgård från coastline-sea)
  const coastlineSeaG = new Graphics()
  addFeaturesToGraphics(coastlineSeaG, coastlineSea, project)
  coastlineSeaG.fill({ color: waterColor })
  root.addChild(coastlineSeaG)

  // Öar — fyll med pergament-textur
  const islandFill = { texture: textures.parchment }
  const islandsG = new Graphics()
  addFeaturesToGraphics(islandsG, islands, project)
  islandsG.fill(islandFill)
  root.addChild(islandsG)

  const coastlineIslandsG = new Graphics()
  addFeaturesToGraphics(coastlineIslandsG, coastlineIslands, project)
  coastlineIslandsG.fill(islandFill)
  root.addChild(coastlineIslandsG)

  // Kustlinje-strokes (öppna chains, bara stroke)
  const coastlineStrokeG = new Graphics()
  for (const chain of coastlineStrokes) {
    if (chain.length < 2) continue
    const [x0, y0] = project(chain[0])
    coastlineStrokeG.moveTo(x0, y0)
    for (let i = 1; i < chain.length; i++) {
      const [x, y] = project(chain[i])
      coastlineStrokeG.lineTo(x, y)
    }
  }
  coastlineStrokeG.stroke({ width: 1.2, color: 0x2a1810, alpha: 0.85, join: 'round' })
  root.addChild(coastlineStrokeG)

  // Routes — drive (OSRM-polyline) och boat (Bezier-sample)
  const drivingPoly = drivingRoute.map((ll) => project(ll))
  const [hxRoute, hyRoute] = project([points.harbor.lon, points.harbor.lat])
  const [oxRoute, oyRoute] = project([points.ovanan.lon, points.ovanan.lat])
  const routes = buildRoutes({
    drivingPoly,
    harbor: [hxRoute, hyRoute],
    ovanan: [oxRoute, oyRoute],
  })
  const routesLayer = new Container()
  routesLayer.label = 'routes'
  routesLayer.addChild(routes.drive.g)
  routesLayer.addChild(routes.boat.g)
  root.addChild(routesLayer)

  // --- Decor sprites ---
  const decor = new Container()
  decor.label = 'decor'
  root.addChild(decor)

  const sprites = {}

  const addSprite = (key, [lon, lat], size, opts = {}) => {
    const [x, y] = project([lon, lat])
    const s = new Sprite(textures[key])
    s.anchor.set(opts.anchorX ?? 0.5, opts.anchorY ?? 0.5)
    s.width = size
    s.height = size
    s.x = x
    s.y = y
    s.label = key
    decor.addChild(s)
    sprites[key] = s
    return s
  }

  // Städer — bottenkant förankrad
  const stockholmSize = DECOR_SIZE.stockholm
  addSprite('stockholm', [points.stockholm.lon, points.stockholm.lat], stockholmSize, { anchorY: 1.0 })
  // Stockholm-silhuetten är bredare än hög: width × 0.45 (matchar originalet)
  sprites.stockholm.height = stockholmSize * 0.45

  const sodSize = DECOR_SIZE.sodertalje
  addSprite('sodertalje', [17.6253, 59.1958], sodSize, { anchorY: 1.0 })
  sprites.sodertalje.height = sodSize * 0.45

  // Land-decor (drive-fas)
  addSprite('wagon', DECOR_POS.wagon, DECOR_SIZE.wagon)
  addSprite('tree1', DECOR_POS.tree1, DECOR_SIZE.tree)
  addSprite('tree2', DECOR_POS.tree2, DECOR_SIZE.tree)
  addSprite('tree3', DECOR_POS.tree3, DECOR_SIZE.tree)
  addSprite('village1', DECOR_POS.village1, DECOR_SIZE.village)
  addSprite('village2', DECOR_POS.village2, DECOR_SIZE.village)
  addSprite('village3', DECOR_POS.village3, DECOR_SIZE.village3)
  addSprite('globen', DECOR_POS.globen, DECOR_SIZE.globen)
  addSprite('skull', DECOR_POS.skull, DECOR_SIZE.skull)
  addSprite('robbers', DECOR_POS.robbers, DECOR_SIZE.robbers)
  addSprite('dragon0', DECOR_POS.dragon0, DECOR_SIZE.dragon)
  addSprite('dragon1', DECOR_POS.dragon1, DECOR_SIZE.dragon)

  // Sjö-decor (boat-fas)
  addSprite('kraken', DECOR_POS.kraken, DECOR_SIZE.kraken)
  addSprite('octopus', DECOR_POS.octopus, DECOR_SIZE.octopus)
  addSprite('mermaid', DECOR_POS.mermaid, DECOR_SIZE.mermaid)
  addSprite('seaMonster', DECOR_POS.seaMonster, DECOR_SIZE.seaMonster)
  addSprite('whale1', DECOR_POS.whale1, DECOR_SIZE.whale)
  addSprite('decorShip', DECOR_POS.decorShip, DECOR_SIZE.decorShip)
  addSprite('storm', DECOR_POS.storm, DECOR_SIZE.storm)
  addSprite('compass', DECOR_POS.compass, DECOR_SIZE.compass)

  // Hamn-marker (bryggan + text)
  const [hx, hy] = project([points.harbor.lon, points.harbor.lat])
  const harborMarker = new Container()
  harborMarker.label = 'harbor-marker'
  const dock = new Sprite(textures.harborDock)
  dock.anchor.set(0.5, 1.0)
  dock.width = DECOR_SIZE.harborDock
  dock.height = DECOR_SIZE.harborDock
  harborMarker.addChild(dock)
  const harborLabel = new Text({
    text: 'Hamnen',
    style: {
      fontFamily: 'Metamorphous, Georgia, serif',
      fontSize: 12.8,
      fontWeight: 'bold',
      fill: 0x2a1810,
      letterSpacing: 0.8,
    },
  })
  harborLabel.anchor.set(0, 0.5)
  harborLabel.x = 22
  harborLabel.y = -12
  harborMarker.addChild(harborLabel)
  harborMarker.x = hx
  harborMarker.y = hy
  decor.addChild(harborMarker)

  // Vårt skepp (kommer animeras längs båt-pathen)
  const ourShip = new Sprite(textures.ourShip)
  ourShip.anchor.set(0.5, 1.0)  // bottom-middle som SVG-originalet
  ourShip.width = DECOR_SIZE.ourShip
  ourShip.height = DECOR_SIZE.ourShip
  ourShip.x = hx
  ourShip.y = hy
  ourShip.label = 'our-ship'
  root.addChild(ourShip)  // ovanpå allt

  // Sea-label (SALMONELLAHAVET) — text mitt på sjön
  const [lx, ly] = project([17.755, 59.275])
  const seaLabel = new Text({
    text: 'SALMONELLAHAVET',
    style: {
      fontFamily: 'Metamorphous, Georgia, serif',
      fontSize: 13.6,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: 0x2a1810,
      letterSpacing: 5.4,
    },
  })
  seaLabel.anchor.set(0.5, 0.5)
  seaLabel.x = lx
  seaLabel.y = ly
  root.addChild(seaLabel)

  return {
    root,
    proj,
    sprites,
    harborMarker,
    ourShip,
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
      boatPoly: routes.boatPoly,
    },
  }
}

// Hjälpare: addera GeoJSON-features (Polygon/MultiPolygon) till en Graphics.
// Anropare gör `.fill(...)` efteråt.
function addFeaturesToGraphics(g, features, project) {
  for (const f of features) {
    if (!f) continue
    if (f.type === 'Polygon') {
      for (const ring of f.coordinates) drawRing(g, ring, project)
    } else if (f.type === 'MultiPolygon') {
      for (const poly of f.coordinates) for (const ring of poly) drawRing(g, ring, project)
    }
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
