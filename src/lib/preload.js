// Förladdar alla kart-PNG:er + card-overlays direkt vid sidstart så att
// inget hackar/popp:ar in vid scroll eller reveal-animationen.

const MAP_IMAGES = [
  '/images/map/parchment.png',
  '/images/map/arrow-down.png',
  '/images/map/our-ship.png',
  '/images/map/decor-ship.png',
  '/images/map/storm-cloud.png',
  '/images/map/compass-rose.png',
  '/images/map/harbor-dock-ne.png',
  '/images/map/stockholm-silhouette.png',
  '/images/map/sodertalje-silhouette.png',
  '/images/map/wagon.png',
  '/images/map/robbers.png',
  '/images/map/globen.png',
  '/images/map/skull-warning.png',
  '/images/map/dragon-warning-1.png',
  '/images/map/dragon-warning-2.png',
  '/images/map/kraken.png',
  '/images/map/octopus.png',
  '/images/map/sea-monster.png',
  '/images/map/mermaid.png',
  '/images/map/whale-1.png',
  '/images/map/whale-2.png',
  '/images/map/tree-1.png',
  '/images/map/tree-2.png',
  '/images/map/pirate-ogre.png',
  '/images/map/x-marks-the-spot.png',
  '/images/maps/ovanan.jpg',
  '/images/map/tree-3.png',
  '/images/map/village-1.png',
  '/images/map/village-2.png',
  '/images/map/village-3.png',
]

const CARD_OVERLAYS = [
  '/images/cards/pirate-card-overlay1.webp',
  '/images/cards/pirate-card-overlay2.webp',
  '/images/cards/pirate-card-overlay3.webp',
  '/images/cards/pirate-card-overlay4.webp',
  '/images/cards/pirate-card-overlay5.webp',
  '/images/cards/pirate-card-overlay6.webp',
  '/images/cards/pirate-card-overlay7.webp',
]

const HERO_ASSETS = [
  '/images/svarta-malin-hero.webp',
]

const ALL = [...MAP_IMAGES, ...CARD_OVERLAYS, ...HERO_ASSETS]

let started = false

export function preloadAssets() {
  if (started) return
  started = true
  for (const src of ALL) {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
  }
}
