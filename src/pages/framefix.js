import { CARD_OVERLAYS } from '../components/pirate-card.js'
import { CARD_FRAME_LAYOUTS } from '../lib/card-frame-layouts.js'

const STORAGE_KEY = 'svartamalin:framefix-layouts'
const SAMPLE_NAME = 'Kapten Lösskägg'

/** @typedef {{ top: number, left: number, right: number, bottom: number }} PhotoInset */
/** @typedef {{ x: number, y: number }} LabelCenter */
/** @typedef {{ photo: PhotoInset, label: LabelCenter }} FrameLayout */

/** @param {{ top: number, left: number, right: number, bottom: number }} box */
function labelBoxToCenter(box) {
  return {
    x: +(box.left + (100 - box.left - box.right) / 2).toFixed(2),
    y: +(box.top + (100 - box.top - box.bottom) / 2).toFixed(2),
  }
}

/** @returns {Record<string, FrameLayout>} */
function loadLayouts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }

  const out = {}
  for (const [id, box] of Object.entries(CARD_FRAME_LAYOUTS)) {
    out[id] = {
      photo: { ...box.photo },
      label: labelBoxToCenter(box.label),
    }
  }
  return out
}

/** @param {Record<string, FrameLayout>} layouts */
function saveLayouts(layouts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts))
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function round(n) {
  return +n.toFixed(2)
}

/** @param {HTMLElement} cardEl @param {number} clientX @param {number} clientY */
function pctFromPointer(cardEl, clientX, clientY) {
  const r = cardEl.getBoundingClientRect()
  return {
    x: round(clamp(((clientX - r.left) / r.width) * 100, 0, 100)),
    y: round(clamp(((clientY - r.top) / r.height) * 100, 0, 100)),
  }
}

/** @param {PhotoInset} photo */
function photoCorners(photo) {
  return {
    tl: { left: photo.left, top: photo.top },
    tr: { left: 100 - photo.right, top: photo.top },
    bl: { left: photo.left, top: 100 - photo.bottom },
    br: { left: 100 - photo.right, top: 100 - photo.bottom },
  }
}

/** @param {HTMLElement} inner @param {PhotoInset} photo */
function applyPhotoBox(inner, photo) {
  for (const el of inner.querySelectorAll('.framefix__photo, .framefix__photo-bounds')) {
    el.style.top = `${photo.top}%`
    el.style.right = `${photo.right}%`
    el.style.bottom = `${photo.bottom}%`
    el.style.left = `${photo.left}%`
  }

  for (const [key, pos] of Object.entries(photoCorners(photo))) {
    const handle = inner.querySelector(`[data-handle="${key}"]`)
    if (!handle) continue
    handle.style.left = `${pos.left}%`
    handle.style.top = `${pos.top}%`
  }
}

/** @param {HTMLElement} inner @param {LabelCenter} label */
function applyLabel(inner, label) {
  const el = inner.querySelector('.framefix__label')
  if (!el) return
  el.style.left = `${label.x}%`
  el.style.top = `${label.y}%`
}

/** @param {HTMLElement} card @param {FrameLayout} layout */
function renderCoords(card, layout) {
  const pre = card.querySelector('.framefix__coords')
  if (!pre) return
  const { photo, label } = layout
  pre.textContent = [
    `photo: top ${photo.top}%  right ${photo.right}%  bottom ${photo.bottom}%  left ${photo.left}%`,
    `text center: ${label.x}% × ${label.y}%`,
  ].join('\n')
}

/** @param {Record<string, FrameLayout>} layouts */
function buildExport(layouts) {
  const js = {}
  const css = []

  for (const id of Object.keys(layouts).sort((a, b) => Number(a) - Number(b))) {
    const { photo, label } = layouts[id]
    js[id] = {
      photo: { top: photo.top, left: photo.left, right: photo.right, bottom: photo.bottom },
      label: { x: label.x, y: label.y },
    }
    css.push(
      `.pirate-card--frame${id} .pirate-card__photo {\n  inset: ${photo.top}% ${photo.right}% ${photo.bottom}% ${photo.left}%;\n}`,
      `.pirate-card--frame${id} .pirate-card__label {\n  top: ${label.y}%;\n  left: ${label.x}%;\n  right: auto;\n  bottom: auto;\n  transform: translate(-50%, -50%);\n}`,
    )
  }

  return {
    json: JSON.stringify(js, null, 2),
    css: css.join('\n\n'),
    jsModule: `export const CARD_FRAME_LAYOUTS = ${JSON.stringify(
      Object.fromEntries(
        Object.entries(js).map(([id, l]) => [id, {
          photo: l.photo,
          label: {
            top: round(l.label.y - 5),
            left: round(l.label.x - 25),
            right: round(100 - l.label.x - 25),
            bottom: round(100 - l.label.y - 5),
          },
        }]),
      ),
      null,
      2,
    )}`,
  }
}

/** @param {HTMLElement} card @param {string} id @param {FrameLayout} layout @param {Record<string, FrameLayout>} layouts @param {() => void} [onChange] */
function wireCard(card, id, layout, layouts, onChange) {
  const inner = card.querySelector('.framefix__card')
  if (!inner) return

  const sync = () => {
    applyPhotoBox(inner, layout.photo)
    applyLabel(inner, layout.label)
    renderCoords(card, layout)
    saveLayouts(layouts)
    onChange?.()
  }
  sync()
  requestAnimationFrame(sync)

  const handles = card.querySelectorAll('[data-handle]')
  handles.forEach((handle) => {
    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      const corner = handle.dataset.handle
      handle.setPointerCapture(e.pointerId)

      const onMove = (ev) => {
        const p = pctFromPointer(inner, ev.clientX, ev.clientY)
        const ph = layout.photo

        if (corner === 'tl') {
          ph.top = Math.min(p.y, 100 - ph.bottom - 8)
          ph.left = Math.min(p.x, 100 - ph.right - 8)
        } else if (corner === 'tr') {
          ph.top = Math.min(p.y, 100 - ph.bottom - 8)
          ph.right = Math.min(100 - p.x, 100 - ph.left - 8)
        } else if (corner === 'bl') {
          ph.bottom = Math.min(100 - p.y, 100 - ph.top - 8)
          ph.left = Math.min(p.x, 100 - ph.right - 8)
        } else if (corner === 'br') {
          ph.bottom = Math.min(100 - p.y, 100 - ph.top - 8)
          ph.right = Math.min(100 - p.x, 100 - ph.left - 8)
        }

        ph.top = round(ph.top)
        ph.left = round(ph.left)
        ph.right = round(ph.right)
        ph.bottom = round(ph.bottom)
        sync()
      }

      const onUp = () => {
        handle.removeEventListener('pointermove', onMove)
        handle.removeEventListener('pointerup', onUp)
        handle.removeEventListener('pointercancel', onUp)
      }

      handle.addEventListener('pointermove', onMove)
      handle.addEventListener('pointerup', onUp)
      handle.addEventListener('pointercancel', onUp)
    })
  })

  const label = card.querySelector('.framefix__label')
  const labelDot = card.querySelector('.framefix__label-dot')
  for (const el of [label, labelDot].filter(Boolean)) {
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      el.setPointerCapture(e.pointerId)

      const onMove = (ev) => {
        const p = pctFromPointer(inner, ev.clientX, ev.clientY)
        layout.label.x = p.x
        layout.label.y = p.y
        sync()
      }

      const onUp = () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerup', onUp)
        el.removeEventListener('pointercancel', onUp)
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerup', onUp)
      el.addEventListener('pointercancel', onUp)
    })
  }
}

function cardHtml(id, overlaySrc) {
  return `
    <section class="framefix__item" data-frame="${id}">
      <h2 class="framefix__title">Ram ${id}</h2>
      <div class="framefix__stage">
        <div class="framefix__card">
          <div class="framefix__photo">
            <div class="framefix__photo-checker" aria-hidden="true"></div>
          </div>
          <div class="framefix__photo-bounds" aria-hidden="true"></div>
          <span class="framefix__handle" data-handle="tl" title="Dra hörn"></span>
          <span class="framefix__handle" data-handle="tr" title="Dra hörn"></span>
          <span class="framefix__handle" data-handle="bl" title="Dra hörn"></span>
          <span class="framefix__handle" data-handle="br" title="Dra hörn"></span>
          <img class="framefix__overlay" src="${overlaySrc}" alt="" decoding="async" />
          <div class="framefix__label">
            <span class="framefix__label-dot" title="Dra textmitt"></span>
            <span class="framefix__name">${SAMPLE_NAME}</span>
          </div>
        </div>
      </div>
      <pre class="framefix__coords"></pre>
    </section>
  `
}

export function renderFramefix(app) {
  document.body.classList.add('framefix-page')
  document.body.classList.remove('locked', 'revealing')
  document.getElementById('loading-screen')?.setAttribute('hidden', '')
  document.getElementById('top-controls')?.setAttribute('hidden', '')

  const layouts = loadLayouts()

  app.innerHTML = `
    <main class="framefix">
      <header class="framefix__header">
        <div>
          <h1>Ramjustering</h1>
          <p class="framefix__hint">Dra hörnen på bildrutan. Dra namnet (eller röda pricken ovanför) — koordinaterna är textens mitt, samma som i riktiga kort.</p>
        </div>
        <div class="framefix__actions">
          <button type="button" id="framefix-copy-json" class="framefix__btn">Kopiera JSON</button>
          <button type="button" id="framefix-copy-css" class="framefix__btn">Kopiera CSS</button>
          <button type="button" id="framefix-reset" class="framefix__btn framefix__btn--ghost">Återställ</button>
        </div>
      </header>
      <textarea id="framefix-export" class="framefix__export" readonly rows="6" placeholder="Exporterad CSS/JSON visas här…"></textarea>
      <div class="framefix__grid">
        ${CARD_OVERLAYS.map((src, i) => cardHtml(i + 1, src)).join('')}
      </div>
    </main>
  `

  const exportArea = document.getElementById('framefix-export')
  let exportFormat = 'css'
  const refreshExport = (format = exportFormat) => {
    exportFormat = format
    const data = buildExport(layouts)
    exportArea.value = format === 'json' ? data.json : data.css
  }

  app.querySelectorAll('.framefix__item').forEach((card) => {
    const id = card.dataset.frame
    if (!layouts[id]) return
    wireCard(card, id, layouts[id], layouts, () => refreshExport(exportFormat))
  })

  refreshExport('css')

  document.getElementById('framefix-copy-json')?.addEventListener('click', async () => {
    refreshExport('json')
    await navigator.clipboard.writeText(exportArea.value)
  })

  document.getElementById('framefix-copy-css')?.addEventListener('click', async () => {
    refreshExport('css')
    await navigator.clipboard.writeText(exportArea.value)
  })

  document.getElementById('framefix-reset')?.addEventListener('click', () => {
    if (!confirm('Återställa alla ramar till standardvärden?')) return
    localStorage.removeItem(STORAGE_KEY)
    renderFramefix(app)
  })

}
