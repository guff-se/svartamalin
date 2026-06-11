/**
 * Locked card frame per guest (1–7). Keys = guest UUID from Supabase.
 * Uppdatera via /frameselect → Kopiera assignments.
 */
import { CARD_OVERLAYS, DEFAULT_OVERLAY } from '../components/pirate-card.js'

export const CARD_FRAME_ASSIGNMENTS = {
  '0899f594-edfb-40cd-8222-25e304b54d6d': 6,
  '2cdb037a-a214-47de-af2f-a53ada36172d': 1,
  '374e9c06-0709-4c18-9925-cd335da43aaa': 2,
  '416b54dc-f7cd-4d7e-9c57-cf5a1df17706': 2,
  '433ee2d0-9aed-4a58-8b3b-a2341f670e20': 5,
  '4d93808f-ca94-47e7-af0f-b49721ace76f': 5,
  '53dc7e38-505c-42eb-80c3-6952b419f49b': 5,
  '59fcdc5d-057b-472f-aa70-862ece53a678': 6,
  '5b1516ad-36c5-43c7-9d07-9634f3f30b8a': 6,
  '5c379a4f-1e61-43ab-b86d-18eb2c37fe78': 7,
  '5d63ff67-2f5e-443e-a6fc-bc4d1cc7da17': 4,
  '6dc78e95-094c-44d3-839b-6566e4b76a09': 5,
  '72629504-09de-4ba7-bf85-30d4a745ed66': 4,
  '75d7d929-c157-4098-8527-5d9319c55a74': 7,
  '8217ac17-91f7-4b0e-9482-b1cff2bc3a47': 5,
  '85af5d5e-e3fe-43f5-b881-086a994dce4a': 6,
  '896414ef-fc8d-4df3-990e-66f02c99f8bf': 1,
  '9d51ea74-3684-4131-bfed-95eb20792ffe': 6,
  'b770e9dd-f076-4cd8-a8b3-cfb9f0b123ef': 5,
  'b8c01c47-1566-4c45-acab-5840415fe1e4': 7,
  'baaf5019-a3c7-47c8-a48a-ac18935402aa': 2,
  'c0a1d8ab-fb5c-4266-b693-357ebdffbe6f': 4,
  'c528d83b-e905-4cb6-a0e8-2b0dca806798': 6,
  'c732e53f-7a81-4414-9145-40720991b249': 4,
  'da3a8647-519d-4555-a70c-0634736f24f7': 6,
  'df2a07ed-cd30-4a99-ae3e-eb9198493311': 1,
  'dfd2e841-0cdf-4306-b635-8b9df068dd05': 3,
  'e63bf301-781a-4a0d-bfb7-c60773aa93ed': 5,
  'fe35c00e-99fc-41e0-9245-afe1c0ba0a98': 4,
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
