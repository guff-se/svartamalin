/**
 * Per-frame layout — photo window + name cartouche (CSS inset %).
 * Regenerate: node scripts/detect-card-frame-layouts.js
 */
export const CARD_FRAME_LAYOUTS = {
  1: {
    photo: { top: 7, left: 7, right: 7, bottom: 23 },
    label: { top: 85, left: 17, right: 17, bottom: 4 },
  },
  2: {
    photo: { top: 8, left: 9, right: 9, bottom: 22 },
    label: { top: 83, left: 14, right: 14, bottom: 7 },
  },
  3: {
    photo: { top: 7, left: 7, right: 7, bottom: 37 },
    label: { top: 83, left: 16, right: 16, bottom: 6 },
  },
  4: {
    photo: { top: 14, left: 10, right: 10, bottom: 18 },
    label: { top: 87, left: 13, right: 26, bottom: 4 },
  },
  5: {
    photo: { top: 7, left: 7, right: 7, bottom: 18 },
    label: { top: 89, left: 18, right: 18, bottom: 4 },
  },
  6: {
    photo: { top: 6, left: 7, right: 7, bottom: 17 },
    label: { top: 87, left: 15, right: 15, bottom: 4 },
  },
  7: {
    photo: { top: 5, left: 5, right: 5, bottom: 22 },
    label: { top: 82, left: 10, right: 10, bottom: 4 },
  },
}

/** @param {string} overlaySrc */
export function frameIdFromOverlay(overlaySrc) {
  const m = String(overlaySrc).match(/pirate-card-overlay(\d+)/)
  const id = m ? Number(m[1]) : 1
  return CARD_FRAME_LAYOUTS[id] ? id : 1
}
