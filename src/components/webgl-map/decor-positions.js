// Lat/lon-positioner för dekorations-sprites + sampleRoad-hjälpare.
// EXAKT spegelbild av map.js raderna 209-251. Måste synkas manuellt om
// originalet ändras.

// Statiska lat/lon (passa map.js exakt)
export const DECOR_LL = {
  // Sjö-decor (boat-fasen)
  kraken:     [17.529805, 59.294257],
  octopus:    [17.771634, 59.221499],
  mermaid:    [17.584792, 59.295477],
  seaMonster: [17.463101, 59.301755],
  whale1:     [17.792912, 59.262066],
  decorShip:  [18.174623, 59.329939],
  storm:      [17.42,     59.36],
  compass:    [18.103259, 59.208657],
  skull:      [17.78,     59.29],

  // Land-figurer (drive-fasen, statiska). Keys = filename för att undvika
  // missförstånd när vi swapper bilder.
  pirateOgre: [17.940604, 59.28],
  robbers:    [17.604010, 59.190343],
  tree2:      [17.524204, 59.211292],

  // Städer
  stockholm:  [18.0686,  59.3293],
  sodertalje: [17.6253,  59.1958],

  // Extra byar (utanför rutten)
  village2: [17.489289, 59.255525],
  village3: [17.835,    59.195],
  globen:   [18.083310, 59.293617],

  // Dragons — projicerade direkt
  dragon0: [17.92, 59.31],
  dragon1: [17.65, 59.34],
}

// Sprite-storlekar — EXAKT matchande map.js decorImage size-argument
// (kontrollerade rad-för-rad mot src/components/map.js raderna 318-339,
//  448-528). Skicka inte 1.5-2× för stora värden — det fyller hela skärmen
//  vid inzoom under reveal.
export const DECOR_SIZE = {
  wagon:      90,
  tree:       70,
  pirateOgre: 70,
  village1:   75,
  village2:   70,
  village3:  130,
  globen:     70,
  skull:      90,   // map.js skull(): width=90 height=90
  robbers:   110,
  dragon:     90,   // dragonWarning: width=90
  kraken:     68,   // kraken(): decorImage(..., 90) — krymp 25% från original
  octopus:    80,   // octopus(): decorImage(..., 80)
  mermaid:    50,   // mermaid(): decorImage(..., 50)
  seaMonster: 60,   // seaMonster(): decorImage(..., 60)
  whale:      60,   // whale(): width=60 height=60 (half=30)
  decorShip:  65,   // halverat från 130
  storm:     180,
  compass:   150,
  ourShip:    34,   // halverat från 68
  stockholm: 320,
  sodertalje:260,
  harborDock: 36,
}

/**
 * Sampla punkt längs en projicerad polyline vid relativ position t (0..1)
 * med perpendicular offset i SVG-units. Matchar map.js sampleRoad.
 * @param {Array<[number,number]>} polyline projicerade [x,y]-punkter
 * @param {number} t 0..1
 * @param {number} perpOffsetSvg offset i SVG-units (negativ = vänster)
 */
export function sampleRoad(polyline, t, perpOffsetSvg = 0) {
  const n = polyline.length
  const idx = Math.max(0, Math.min(n - 1, Math.floor(t * (n - 1))))
  const p = polyline[idx]
  const next = polyline[Math.min(n - 1, idx + 1)]
  const dx = next[0] - p[0]
  const dy = next[1] - p[1]
  const len = Math.hypot(dx, dy) || 1
  // perp normalvektor (90° CCW av riktningen)
  return [p[0] + (-dy / len) * perpOffsetSvg, p[1] + (dx / len) * perpOffsetSvg]
}
