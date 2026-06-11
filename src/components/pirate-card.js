/**
 * Collectable pirate portrait card — 63:88 playing-card ratio.
 * Photo shows through transparent centre; overlay adds vintage frame + name label.
 */
import { escapeHtml } from '../lib/escape.js'
import { frameIdFromOverlay } from '../lib/card-frame-layouts.js'

/** Curated frame overlays in public/images/cards/ */
export const CARD_OVERLAYS = [
  '/images/cards/pirate-card-overlay1.webp',
  '/images/cards/pirate-card-overlay2.webp',
  '/images/cards/pirate-card-overlay3.webp',
  '/images/cards/pirate-card-overlay4.webp',
  '/images/cards/pirate-card-overlay5.webp',
  '/images/cards/pirate-card-overlay6.webp',
  '/images/cards/pirate-card-overlay7.webp',
]

export const DEFAULT_OVERLAY = CARD_OVERLAYS[0]

/** Stable frame pick for a numeric id (e.g. pirate_name_id). */
export function overlayForId(id) {
  const n = Number(id)
  if (!Number.isFinite(n)) return DEFAULT_OVERLAY
  const i = ((n % CARD_OVERLAYS.length) + CARD_OVERLAYS.length) % CARD_OVERLAYS.length
  return CARD_OVERLAYS[i]
}

/**
 * @param {{ photoSrc?: string, pirateName: string, placeholder?: boolean, overlaySrc?: string }} opts
 */
/** Names longer than typical cartouche width (e.g. "Kapten Nilsson (piraten)"). */
const LONG_PIRATE_NAME_LEN = 20

export function pirateCardHtml({ photoSrc, pirateName, placeholder = false, overlaySrc = DEFAULT_OVERLAY }) {
  const name = escapeHtml(pirateName)
  const longName = pirateName.length > LONG_PIRATE_NAME_LEN
  const frameId = frameIdFromOverlay(overlaySrc)
  const photoMark = photoSrc && !placeholder
    ? `<img class="pirate-card__photo-img" src="${escapeAttr(photoSrc)}" alt="" decoding="async" />`
    : `<span class="pirate-card__placeholder" aria-hidden="true">🏴‍☠️</span>`

  return `
    <article class="pirate-card pirate-card--frame${frameId}">
      <div class="pirate-card__inner">
        <div class="pirate-card__photo" role="img" aria-label="${name}">
          ${photoMark}
        </div>
        <img class="pirate-card__overlay" src="${escapeAttr(overlaySrc)}" alt="" aria-hidden="true" decoding="async" />
        <div class="pirate-card__label">
          <span class="pirate-card__name${longName ? ' pirate-card__name--long' : ''}">${name}</span>
        </div>
      </div>
    </article>
  `
}


function escapeAttr(s) {
  return escapeHtml(s).replace(/`/g, '&#96;')
}
