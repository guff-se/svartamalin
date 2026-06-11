import { supabase } from '../lib/supabase.js'
import { portraitPath } from '../lib/portraits.js'
import { CARD_FRAME_ASSIGNMENTS, frameIdForGuest } from '../lib/card-frame-assignments.js'
import { CARD_OVERLAYS, pirateCardHtml } from '../components/pirate-card.js'

const STORAGE_KEY = 'svartamalin:frame-assignments-draft'
const SAMPLE_NAME = 'Kapten Lösskägg'

/** @returns {Record<string, number>} */
function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return {}
}

/** @param {Record<string, number>} draft */
function saveDraft(draft) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
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
          <p class="frameselect__hint">Välj en ram per person. Klicka en person, sedan en ram — valet sparas lokalt tills du kopierar till <code>card-frame-assignments.js</code>.</p>
        </div>
        <div class="frameselect__actions">
          <button type="button" id="frameselect-copy" class="frameselect__btn">Kopiera assignments</button>
          <button type="button" id="frameselect-clear-draft" class="frameselect__btn frameselect__btn--ghost">Rensa utkast</button>
        </div>
      </header>
      <p class="frameselect__status" id="frameselect-status"></p>
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

  const draft = loadDraft()
  /** @type {typeof draft} */
  let assignments = { ...CARD_FRAME_ASSIGNMENTS, ...draft }

  const { data: guests, error } = await supabase
    .from('guests')
    .select('id, real_name, pirate_name_id, pirate_names(name)')
    .order('real_name')

  const peopleEl = document.getElementById('frameselect-people')
  const pickerEl = document.getElementById('frameselect-picker')
  const statusEl = document.getElementById('frameselect-status')

  if (error || !guests?.length) {
    peopleEl.textContent = error ? 'Kunde inte ladda gäster.' : 'Inga gäster hittades.'
    return
  }

  /** @type {{ id: string, real_name: string, pirate_name_id: number | null, pirate_name: string | null } | null} */
  let selected = null

  const lockedCount = () => Object.keys(assignments).length
  const isLocked = (id) => Object.prototype.hasOwnProperty.call(assignments, id)

  const updateStatus = () => {
    const n = guests.length
    const locked = guests.filter((g) => isLocked(g.id)).length
    statusEl.textContent = `${locked} av ${n} har låst ram.`
  }

  const renderPicker = () => {
    if (!selected) {
      pickerEl.hidden = true
      return
    }
    pickerEl.hidden = false

    const guest = { id: selected.id, pirate_name_id: selected.pirate_name_id }
    const activeFrame = isLocked(selected.id)
      ? assignments[selected.id]
      : frameIdForGuest(guest)

    document.getElementById('frameselect-preview').innerHTML = pirateCardHtml({
      photoSrc: portraitPath(selected.real_name),
      pirateName: SAMPLE_NAME,
      overlaySrc: CARD_OVERLAYS[activeFrame - 1],
    })

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
          <span class="frameselect__option-num">Ram ${frame}</span>
        </button>
      `
    }).join('')

    pickerEl.querySelectorAll('.frameselect__option').forEach((btn) => {
      btn.addEventListener('click', () => {
        const frame = Number(btn.dataset.frame)
        assignments[selected.id] = frame
        saveDraft({ ...assignments })
        renderPeople()
        renderPicker()
        updateStatus()
      })
    })
  }

  const renderPeople = () => {
    peopleEl.innerHTML = guests.map((g) => {
      const guest = { id: g.id, pirate_name_id: g.pirate_name_id }
      const frame = isLocked(g.id) ? assignments[g.id] : frameIdForGuest(guest)
      const active = selected?.id === g.id
      return `
        <button type="button" class="frameselect__person${active ? ' is-active' : ''}" data-id="${g.id}">
          <span class="frameselect__person-name">${escape(g.real_name)}</span>
          <span class="frameselect__person-meta">
            ${g.pirate_names?.name ? escape(g.pirate_names.name) + ' · ' : ''}
            ${isLocked(g.id) ? `🔒 ram ${frame}` : `ram ${frame} (auto)`}
          </span>
        </button>
      `
    }).join('')

    peopleEl.querySelectorAll('.frameselect__person').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id
        selected = guests.find((g) => g.id === id) ?? null
        renderPeople()
        renderPicker()
      })
    })
  }

  renderPeople()
  selected = guests[0]
  renderPeople()
  renderPicker()
  updateStatus()

  document.getElementById('frameselect-copy')?.addEventListener('click', async () => {
    const module = buildAssignmentsModule(assignments)
    await navigator.clipboard.writeText(module)
    statusEl.textContent = 'Kopierat! Klistra in i src/lib/card-frame-assignments.js'
  })

  document.getElementById('frameselect-clear-draft')?.addEventListener('click', () => {
    if (!confirm('Rensa lokalt utkast? (Committed assignments i filen påverkas inte förrän du kopierar nytt.)')) return
    localStorage.removeItem(STORAGE_KEY)
    assignments = { ...CARD_FRAME_ASSIGNMENTS }
    renderPeople()
    renderPicker()
    updateStatus()
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
