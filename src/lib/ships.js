/** Chosen skuta portraits for the crew card. Keys = crews.id. */

export const CREW_SHIPS = {
  1: {
    src: '/images/ships/kurtisanen.webp',
    alt: 'Korvetten Kurtisanen',
    width: 1280,
    height: 853,
  },
  2: {
    src: '/images/ships/fordarvet.webp',
    alt: 'Fregatten Fördärvet',
    width: 1280,
    height: 853,
  },
  3: {
    src: '/images/ships/bortforklaringen.webp',
    alt: 'Barken Bortförklaringen',
    width: 1280,
    height: 853,
  },
  4: {
    src: '/images/ships/fromheten.webp',
    alt: 'Fregatten Fromheten',
    width: 1280,
    height: 853,
  },
  5: {
    src: '/images/ships/gnallet.webp',
    alt: 'Galeonen Gnället',
    width: 1280,
    height: 853,
  },
}

export function crewShip(crewId) {
  return CREW_SHIPS[crewId] ?? null
}

/**
 * Skuta N jagar N+1:s skatt (5 jagar 1). Se content/huvudstory/lagskatter.md.
 * @param {number | string | null | undefined} crewId
 * @returns {number | null}
 */
export function huntedCrewId(crewId) {
  const n = Number(crewId)
  if (!Number.isInteger(n) || n < 1 || n > 5) return null
  return n === 5 ? 1 : n + 1
}

/** @param {number | string | null | undefined} crewId */
export function huntedCrewShip(crewId) {
  return crewShip(huntedCrewId(crewId))
}
