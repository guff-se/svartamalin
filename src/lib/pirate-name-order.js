/** pirate_name_id for Svarta Malin — reserved, not on guest RSVP name picker. */
export const SVARTA_MALIN_NAME_ID = 60

/** @param {number} id */
export function isSelectablePirateName(id) {
  return Number(id) !== SVARTA_MALIN_NAME_ID
}

/**
 * Besättningen / RSVP order: Svarta Malin first, then ascending pirate_name_id.
 * @param {number} a
 * @param {number} b
 */
export function comparePirateNameIds(a, b) {
  const idA = Number(a)
  const idB = Number(b)
  if (idA === SVARTA_MALIN_NAME_ID) return idB === SVARTA_MALIN_NAME_ID ? 0 : -1
  if (idB === SVARTA_MALIN_NAME_ID) return 1
  return idA - idB
}

/** @template {{ pirate_name_id?: number | null }} T */
export function sortByPirateNameId(rows) {
  return [...rows].sort((a, b) => comparePirateNameIds(a.pirate_name_id, b.pirate_name_id))
}
