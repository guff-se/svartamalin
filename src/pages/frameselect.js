import { supabase } from '../lib/supabase.js'
import { portraitPath } from '../lib/portraits.js'
import {
  CARD_FRAME_ASSIGNMENTS,
  frameIdForGuest,
  overlayForGuest,
} from '../lib/card-frame-assignments.js'
import { CARD_OVERLAYS, pirateCardHtml } from '../components/pirate-card.js'

const STORAGE_KEY = 'svartamalin:frame-assignments-draft'
const SAMPLE_NAME = 'Kapten Lösskägg'

/** @param {{ id: string, pirate_name_id?: number | null }} guest */
function guestRef(guest) {
  return { id: guest.id, pirate_name_id: guest.pirate_name_id }
}

/**
 * Draft = only pending edits (deltas vs card-frame-assignments.js).
 * Older versions stored a full snapshot and could override committed file values.
 * @returns {Record<string, number>}
 */
function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const stored = JSON.parse(raw)
    /** @type {Record<string, number>} */
    const delta = {}
    for (const [id, frame] of Object.entries(stored)) {
      if (CARD_FRAME_ASSIGNMENTS[id] !== frame) delta[id] = frame
    }
    if (Object.keys(stored).length !== Object.keys(delta).length) {
      persistDraft(delta)
    }
    return delta
  } catch { /* ignore */ }
  return {}
}

/** @param {Record<string, number>} draft */
function persistDraft(draft) {
  if (Object.keys(draft).length === 0) {
    localStorage.removeItem(STORAGE_KEY)
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  }
}

/** @param {Record<string, number>} draft @param {string} guestId @param {number} frame */
function setDraftFrame(draft, guestId, frame) {
  if (CARD_FRAME_ASSIGNMENTS[guestId] === frame) {
    delete draft[guestId]
  } else {
    draft[guestId] = frame
  }
  persistDraft(draft)
}

/** @param {Record<string, number>} draft @param {{ id: string, pirate_name_id?: number | null }} guest */
function effectiveFrame(draft, guest) {
  if (Object.prototype.hasOwnProperty.call(draft, guest.id)) {
    return draft[guest.id]
  }
  return frameIdForGuest(guestRef(guest))
}

/** @param {Record<string, number>} draft @param {{ id: string, pirate_name_id?: number | null }} guest */
function effectiveOverlay(draft, guest) {
  const frame = effectiveFrame(draft, guest)
  return CARD_OVERLAYS[frame - 1] ?? overlayForGuest(guestRef(guest))
}

/** @param {Record<string, number>} draft */
function buildAssignmentsModule(draft) {
  const merged = { ...CARD_FRAME_ASSIGNMENTS, ...draft }
  const lines = Object.entries(merged)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, frame]) => `  '${id}': ${frame},`)
  return `/**
 * Locked card frame per guest (1–7). Keys = guest UUID from Supabase.
 * Uppdatera via /frameselect → Kopiera assignments.
 */
import { CARD_OVERLAYS, DEFAULT_OVERLAY } from '../components/pirate-card.js'

export const CARD_FRAME_ASSIGNMENTS = {
${lines.join('\n')}
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
`
}

export async function renderFrameselect(app) {
  document.body.classList.add('frameselect-page')
  document.body.classList.remove('locked', 'revealing')
  document.getElementById('loading-screen')?.setAttribute('hidden', '')
  document.getElementById('top-controls')?.setAttribute('hidden', '')

  app.innerHTML = `
    <main class="frameselect">
      <header class="frameselect__header">
        <div>
          <h1>Ramväljare</h1>
          <p class="frameselect__hint">Visar samma ramar som sajten (<code>card-frame-assignments.js</code>). Lokala ändringar sparas som utkast tills du kopierar till filen.</p>
        </div>
        <div class="frameselect__actions">
          <button type="button" id="frameselect-copy" class="frameselect__btn">Kopiera assignments</button>
          <button type="button" id="frameselect-clear-draft" class="frameselect__btn frameselect__btn--ghost">Rensa utkast</button>
        </div>
      </header>
      <p class="frameselect__status" id="frameselect-status"></p>
      <div class="frameselect__totals" id="frameselect-totals" aria-label="Antal per ram"></div>
      <div class="frameselect__layout">
        <aside class="frameselect__people" id="frameselect-people" aria-label="Personer">Laddar…</aside>
        <section class="frameselect__picker" id="frameselect-picker" hidden>
          <div class="frameselect__preview" id="frameselect-preview"></div>
          <p class="frameselect__picker-label">Välj ram</p>
          <div class="frameselect__options" id="frameselect-options"></div>
        </section>
      </div>
    </main>
  `

  /** @type {Record<string, number>} */
  const draft = loadDraft()

  const { data: guests, error } = await supabase
    .from('guests')
    .select('id, real_name, pirate_name_id, pirate_names(name)')
    .order('real_name')

  const peopleEl = document.getElementById('frameselect-people')
  const pickerEl = document.getElementById('frameselect-picker')
  const statusEl = document.getElementById('frameselect-status')
  const totalsEl = document.getElementById('frameselect-totals')

  if (error || !guests?.length) {
    peopleEl.textContent = error ? 'Kunde inte ladda gäster.' : 'Inga gäster hittades.'
    return
  }

  /** @type {{ id: string, real_name: string, pirate_name_id: number | null, pirate_name: string | null } | null} */
  let selected = null

  const computeFrameCounts = () => {
    const counts = Array(CARD_OVERLAYS.length).fill(0)
    for (const g of guests) {
      const frame = effectiveFrame(draft, g)
      if (frame >= 1 && frame <= counts.length) counts[frame - 1]++
    }
    return counts
  }

  const updateStatus = () => {
    const n = guests.length
    const locked = guests.filter((g) => g.id in CARD_FRAME_ASSIGNMENTS).length
    const pending = Object.keys(draft).length
    statusEl.textContent = pending
      ? `${locked} låsta i filen · ${pending} osparade ändringar`
      : `${locked} av ${n} låsta, matchar sajten`
  }

  const updateFrameTotals = () => {
    const counts = computeFrameCounts()
    totalsEl.innerHTML = counts.map((n, i) => {
      const frame = i + 1
      const active = selected && effectiveFrame(draft, selected) === frame
      return `<span class="frameselect__total${active ? ' is-active' : ''}">Ram ${frame}: <strong>${n}</strong></span>`
    }).join('')
  }

  const refresh = () => {
    renderPeople()
    renderPicker()
    updateStatus()
    updateFrameTotals()
  }

  const renderPicker = () => {
    if (!selected) {
      pickerEl.hidden = true
      return
    }
    pickerEl.hidden = false

    const activeFrame = effectiveFrame(draft, selected)

    document.getElementById('frameselect-preview').innerHTML = pirateCardHtml({
      photoSrc: portraitPath(selected.real_name),
      pirateName: SAMPLE_NAME,
      overlaySrc: effectiveOverlay(draft, selected),
    })

    const counts = computeFrameCounts()

    document.getElementById('frameselect-options').innerHTML = CARD_OVERLAYS.map((src, i) => {
      const frame = i + 1
      const picked = activeFrame === frame
      return `
        <button type="button" class="frameselect__option${picked ? ' is-picked' : ''}" data-frame="${frame}" aria-pressed="${picked}">
          ${pirateCardHtml({
            photoSrc: portraitPath(selected.real_name),
            pirateName: SAMPLE_NAME,
            overlaySrc: src,
          })}
          <span class="frameselect__option-num">Ram ${frame} · ${counts[i]}</span>
        </button>
      `
    }).join('')

    pickerEl.querySelectorAll('.frameselect__option').forEach((btn) => {
      btn.addEventListener('click', () => {
        const frame = Number(btn.dataset.frame)
        setDraftFrame(draft, selected.id, frame)
        refresh()
      })
    })
  }

  const frameLabel = (g) => {
    const frame = effectiveFrame(draft, g)
    if (g.id in draft) return `✎ ram ${frame} (utkast)`
    if (g.id in CARD_FRAME_ASSIGNMENTS) return `🔒 ram ${frame}`
    return `ram ${frame} (auto)`
  }

  const renderPeople = () => {
    peopleEl.innerHTML = guests.map((g) => {
      const active = selected?.id === g.id
      return `
        <button type="button" class="frameselect__person${active ? ' is-active' : ''}" data-id="${g.id}">
          <span class="frameselect__person-name">${escape(g.real_name)}</span>
          <span class="frameselect__person-meta">
            ${g.pirate_names?.name ? escape(g.pirate_names.name) + ' · ' : ''}
            ${frameLabel(g)}
          </span>
        </button>
      `
    }).join('')

    peopleEl.querySelectorAll('.frameselect__person').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id
        selected = guests.find((g) => g.id === id) ?? null
        refresh()
      })
    })
  }

  selected = guests[0]
  refresh()

  document.getElementById('frameselect-copy')?.addEventListener('click', async () => {
    const module = buildAssignmentsModule(draft)
    await navigator.clipboard.writeText(module)
    statusEl.textContent = 'Kopierat! Klistra in i src/lib/card-frame-assignments.js'
  })

  document.getElementById('frameselect-clear-draft')?.addEventListener('click', () => {
    if (!confirm('Rensa lokalt utkast? Visningen återgår till det som gäller på sajten.')) return
    for (const key of Object.keys(draft)) delete draft[key]
    persistDraft(draft)
    refresh()
  })

  app.addEventListener('error', onPortraitError, true)
}

function onPortraitError(e) {
  const img = e.target
  if (!img.matches?.('.pirate-card__photo-img')) return
  const photo = img.closest('.pirate-card__photo')
  if (!photo) return
  img.remove()
  photo.insertAdjacentHTML('afterbegin', '<span class="pirate-card__placeholder" aria-hidden="true">🏴‍☠️</span>')
}

function escape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
