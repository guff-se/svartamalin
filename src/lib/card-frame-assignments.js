/**
 * Locked card frame per guest (1–7). Keys = guest UUID from Supabase.
 * Uppdatera via /frameselect → Kopiera assignments.
 */
import { CARD_OVERLAYS, DEFAULT_OVERLAY } from '../components/pirate-card.js'

export const CARD_FRAME_ASSIGNMENTS = {
  // "guest-uuid": 3,
}

const FRAME_COUNT = CARD_OVERLAYS.length

/** @param {{ id: string, pirate_name_id?: number | null }} guest */
export function frameIdForGuest(guest) {
  const locked = CARD_FRAME_ASSIGNMENTS[guest.id]
  if (locked >= 1 && locked <= FRAME_COUNT) return locked

  const n = Number(guest.pirate_name_id)
  if (Number.isFinite(n)) {
    return ((n % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT + 1
  }
  return 1
}

/** @param {{ id: string, pirate_name_id?: number | null }} guest */
export function overlayForGuest(guest) {
  const id = frameIdForGuest(guest)
  return CARD_OVERLAYS[id - 1] ?? DEFAULT_OVERLAY
}

/** @param {string} guestId */
export function isFrameLocked(guestId) {
  return Object.prototype.hasOwnProperty.call(CARD_FRAME_ASSIGNMENTS, guestId)
}
