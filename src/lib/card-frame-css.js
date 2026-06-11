/**
 * Per-frame card layout — parsed from / written to pirate-card.css.
 * Source of truth: src/styles/pirate-card.css (between layout markers).
 */

export const CARD_FRAME_CSS_BLOCK_RE =
  /\/\* --- Per-frame layouts[\s\S]*?\/\* --- end per-frame layouts --- \*\//

/** @typedef {{ top: number, left: number, right: number, bottom: number }} PhotoInset */
/** @typedef {{ x: number, y: number }} LabelCenter */
/** @typedef {{ photo: PhotoInset, label: LabelCenter }} FrameLayout */

/** @param {{ top: number, left: number, right: number, bottom: number }} box */
export function labelBoxToCenter(box) {
  return {
    x: +(box.left + (100 - box.left - box.right) / 2).toFixed(2),
    y: +(box.top + (100 - box.top - box.bottom) / 2).toFixed(2),
  }
}

/**
 * @param {string} cssText
 * @returns {Record<string, FrameLayout>}
 */
export function parseCardFrameLayouts(cssText) {
  /** @type {Record<string, FrameLayout>} */
  const layouts = {}

  const photoRe =
    /\.pirate-card--frame(\d+)\s+\.pirate-card__photo\s*\{[^}]*inset:\s*([\d.]+)%\s+([\d.]+)%\s+([\d.]+)%\s+([\d.]+)%/g
  let m
  while ((m = photoRe.exec(cssText)) !== null) {
    const id = m[1]
    layouts[id] ??= {}
    layouts[id].photo = {
      top: +m[2],
      right: +m[3],
      bottom: +m[4],
      left: +m[5],
    }
  }

  const labelBlockRe = /\.pirate-card--frame(\d+)\s+\.pirate-card__label\s*\{([^}]+)\}/g
  while ((m = labelBlockRe.exec(cssText)) !== null) {
    const top = m[2].match(/top:\s*([\d.]+)%/)
    const left = m[2].match(/left:\s*([\d.]+)%/)
    if (!top || !left) continue
    const id = m[1]
    layouts[id] ??= {}
    layouts[id].label = { x: +left[1], y: +top[1] }
  }

  return layouts
}

/** @param {Record<string, FrameLayout>} layouts */
export function buildCardFrameCssRules(layouts) {
  return Object.keys(layouts)
    .sort((a, b) => Number(a) - Number(b))
    .flatMap((id) => {
      const { photo, label } = layouts[id]
      return [
        `.pirate-card--frame${id} .pirate-card__photo {\n  inset: ${photo.top}% ${photo.right}% ${photo.bottom}% ${photo.left}%;\n}`,
        `.pirate-card--frame${id} .pirate-card__label {\n  top: ${label.y}%;\n  left: ${label.x}%;\n  right: auto;\n  bottom: auto;\n  transform: translate(-50%, -50%);\n}`,
      ]
    })
}

/** @param {Record<string, FrameLayout>} layouts */
export function buildCardFrameCssBlock(layouts) {
  return [
    '/* --- Per-frame layouts (pirate-card.css — source of truth; tune via /framefix) --- */',
    ...buildCardFrameCssRules(layouts),
    '/* --- end per-frame layouts --- */',
  ].join('\n\n')
}

/** @param {string} cssText @param {Record<string, FrameLayout>} layouts */
export function replaceCardFrameCssBlock(cssText, layouts) {
  const block = buildCardFrameCssBlock(layouts)
  if (CARD_FRAME_CSS_BLOCK_RE.test(cssText)) {
    return cssText.replace(CARD_FRAME_CSS_BLOCK_RE, block)
  }
  return `${cssText.trim()}\n\n${block}\n`
}
