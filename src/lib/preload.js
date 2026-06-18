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

let assetsPromise = null

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve()
    img.onerror = () => resolve()  // tolerera fel — vi ska bara CACHA, inte gate:a
    img.src = src
  })
}

/** Förladdar animationens assets. Returnerar Promise som settlar när allt är inne i cache. */
export function preloadAssets() {
  if (assetsPromise) return assetsPromise
  assetsPromise = Promise.all(ALL.map(preloadImage))
  return assetsPromise
}

let crewStarted = false
/**
 * Förladdar pirate-portraits. Anropas EFTER preloadAssets() settlat så vi
 * inte konkurrerar med animation-assets om bandbredd.
 */
export async function preloadCrewPortraits() {
  if (crewStarted) return
  crewStarted = true
  const { supabase } = await import('./supabase.js')
  const { portraitPath } = await import('./portraits.js')
  const { data } = await supabase
    .from('public_guests')
    .select('real_name, pirate_name_id')
    .not('pirate_name_id', 'is', null)
  if (!data) return
  // fetchpriority="low" via Image() finns inte — bara dl till cache parallellt.
  // Browsers begränsar per-origin connections, så detta kör som "låg" naturligt
  // efter animation-assets redan tagit sina connections.
  for (const g of data) preloadImage(portraitPath(g.real_name))
}
