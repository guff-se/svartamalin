// RSVP som sekvens av modaler — attending → info → pirate-namn.
// Designen matchar info-edit.js (samma .info-modal-CSS).
//
// Användning:
//   const completed = await openRsvpFlow()
//   if (completed) refreshOsaCard()

import { supabase } from '../lib/supabase.js'
import { getGuestId, setPeekMode } from '../lib/state.js'
import { escapeHtml } from '../lib/escape.js'
import { portraitPath } from '../lib/portraits.js'
import { overlayForGuest } from '../lib/card-frame-assignments.js'
import { pirateCardHtml } from './pirate-card.js'
import { bindVisibleScrollbar } from '../lib/visible-scrollbar.js'
import { isSelectablePirateName } from '../lib/pirate-name-order.js'
import { fetchPracticalMap, formatPracticalMarkdown } from './practical-info.js'

let openEl = null

function buildModal() {
  if (openEl) return openEl
  openEl = document.createElement('div')
  openEl.className = 'info-modal info-modal--rsvp'
  openEl.innerHTML = `
    <div class="info-modal__backdrop"></div>
    <div class="info-modal__card" role="dialog" aria-modal="true" aria-label="Svar"></div>
  `
  document.body.appendChild(openEl)
  return openEl
}

function closeModal() {
  if (!openEl) return
  openEl.remove()
  openEl = null
}

function cardEl() { return openEl?.querySelector('.info-modal__card') }

async function fetchGuest() {
  const id = getGuestId()
  if (!id) return null
  let { data, error } = await supabase
    .from('guests')
    .select('id, real_name, attending, pirate_name_id, food_notes, notes, phone, email')
    .eq('id', id)
    .maybeSingle()
  if (error && /food_notes/.test(error.message ?? '')) {
    const r = await supabase
      .from('guests')
      .select('id, real_name, attending, pirate_name_id, notes, phone, email')
      .eq('id', id)
      .maybeSingle()
    data = r.data
  }
  return data
}

function hasInfoFilled(g) {
  return Boolean((g?.food_notes ?? '').trim()) || Boolean((g?.notes ?? '').trim())
}

/** Öppnar RSVP-sekvensen. Returnerar true om fullföljd, false om avbruten. */
export async function openRsvpFlow() {
  if (openEl) return false
  buildModal()

  // Escape stänger hela flödet
  const onKey = (e) => { if (e.key === 'Escape') { closeModal(); window.removeEventListener('keydown', onKey) } }
  window.addEventListener('keydown', onKey)
  openEl.querySelector('.info-modal__backdrop').addEventListener('click', () => {
    closeModal()
    window.removeEventListener('keydown', onKey)
  })

  let guest = await fetchGuest()
  if (!guest) { closeModal(); return false }

  // Steg 1: attending (om null)
  if (guest.attending === null) {
    const cont = await stepAttending(guest)
    if (!cont) { closeModal(); window.removeEventListener('keydown', onKey); return false }
    guest = await fetchGuest()
  }

  // Avböjt → done
  if (guest.attending === false) {
    closeModal()
    window.removeEventListener('keydown', onKey)
    return true
  }

  // Steg 2: info (alltid — för-ifylld med befintliga värden)
  {
    const cont = await stepInfo(guest)
    if (!cont) { closeModal(); window.removeEventListener('keydown', onKey); return false }
    guest = await fetchGuest()
  }

  // Steg 3: piratnamn (om null)
  if (guest.attending === true && guest.pirate_name_id == null) {
    const cont = await stepPirate(guest)
    if (!cont) { closeModal(); window.removeEventListener('keydown', onKey); return false }
  }

  closeModal()
  window.removeEventListener('keydown', onKey)
  return true
}

// ============= STEG 1: ATTENDING =============
async function stepAttending(guest) {
  const { map } = await fetchPracticalMap()
  const facts = [
    ['Datum', map?.dates],
    ['Tid', map?.boat_friday],
    ['Plats', map?.location],
  ].filter(([, v]) => v)
  const factsHtml = facts.length ? `
    <dl class="rsvp-facts">
      ${facts.map(([k, v]) => `<div><dt>${escapeHtml(k)}</dt><dd>${formatPracticalMarkdown(v)}</dd></div>`).join('')}
    </dl>
  ` : ''
  return new Promise((resolve) => {
    cardEl().innerHTML = `
      <p class="step-hint">— ${escapeHtml(guest.real_name)} —</p>
      <h2>Hörsammar du kallelsen?</h2>
      ${factsHtml}
      <div class="row">
        <button id="rsvp-yes">Ja, jag kommer</button>
        <button id="rsvp-no" class="ghost">Nej, jag måste avstå</button>
      </div>
    `
    document.getElementById('rsvp-yes').addEventListener('click', async () => {
      await supabase.from('guests').update({ attending: true }).eq('id', guest.id)
      resolve(true)
    })
    document.getElementById('rsvp-no').addEventListener('click', async () => {
      await supabase.from('guests').update({ attending: false, pirate_name_id: null }).eq('id', guest.id)
      // Visa "tråkigt" + peek-knapp
      cardEl().innerHTML = `
        <p class="step-hint">— Tråkigt —</p>
        <h2>Vi kommer sakna dig.</h2>
        <p class="farewell">Om vindarna vänder är du välkommen tillbaka och ändra ditt svar.</p>
        <div class="row">
          <button id="rsvp-close">Stäng</button>
          <button id="rsvp-change" class="ghost">Jag ändrar mig</button>
        </div>
      `
      document.getElementById('rsvp-close').addEventListener('click', () => {
        setPeekMode(true); resolve(false)
      })
      document.getElementById('rsvp-change').addEventListener('click', async () => {
        setPeekMode(false)
        await supabase.from('guests').update({ attending: null }).eq('id', guest.id)
        // Visa attending-steget igen
        const cont = await stepAttending(await fetchGuest())
        resolve(cont)
      })
    })
  })
}

// ============= STEG 2: INFO (mat / kontakt) =============
function stepInfo(guest) {
  return new Promise((resolve) => {
    cardEl().innerHTML = `
      <p class="step-hint">— ${escapeHtml(guest.real_name)} —</p>
      <h2>Berätta lite om dig</h2>
      <p class="farewell">Vi vill veta innan du går ombord.</p>
      <form id="info-form" class="info-form" autocomplete="on">
        <label class="info-field">
          <span>Allergier / matpreferenser</span>
          <textarea id="food-notes" rows="3" placeholder="t.ex. inga räkor, vegetarian, glutenintolerant…">${escapeHtml(guest.food_notes ?? '')}</textarea>
        </label>
        <label class="info-field">
          <span>Övrig info vi bör veta</span>
          <textarea id="other-notes" rows="3" placeholder="t.ex. träben, kommer sent, höjdrädd…">${escapeHtml(guest.notes ?? '')}</textarea>
        </label>
        <label class="info-field">
          <span>Telefon (frivilligt)</span>
          <input id="phone" type="tel" inputmode="tel" value="${escapeHtml(guest.phone ?? '')}" />
        </label>
        <label class="info-field">
          <span>E-post (frivilligt)</span>
          <input id="email" type="email" value="${escapeHtml(guest.email ?? '')}" />
        </label>
        <div class="row"><button type="submit">Fortsätt</button></div>
      </form>
    `
    document.getElementById('info-form').addEventListener('submit', async (e) => {
      e.preventDefault()
      const payload = {
        food_notes: document.getElementById('food-notes').value.trim() || null,
        notes:      document.getElementById('other-notes').value.trim() || null,
        phone:      document.getElementById('phone').value.trim() || null,
        email:      document.getElementById('email').value.trim() || null,
      }
      let { error } = await supabase.from('guests').update(payload).eq('id', guest.id)
      if (error && /food_notes/.test(error.message ?? '')) {
        const { food_notes, ...noFood } = payload  // eslint-disable-line no-unused-vars
        const r = await supabase.from('guests').update(noFood).eq('id', guest.id)
        error = r.error
      }
      if (error) { alert('Något gick fel: ' + error.message); return }
      resolve(true)
    })
  })
}

// ============= STEG 3: PIRATNAMN =============
async function stepPirate(guest) {
  return new Promise(async (resolve) => {
    openEl?.classList.add('info-modal--wide')
    cardEl().innerHTML = `
      <p class="step-hint">— ${escapeHtml(guest.real_name)} —</p>
      <div class="pirate-pick">
        <div class="pirate-pick__card" id="pirate-card-preview"></div>
        <div class="pirate-pick__picker">
          <h2>Välj ditt piratnamn</h2>
          <div class="name-grid-scroller">
            <div id="name-grid" class="name-grid">Laddar…</div>
            <div class="name-grid-scrollbar" aria-hidden="true">
              <div class="name-grid-scrollbar__thumb"></div>
            </div>
          </div>
          <div class="row pirate-pick__confirm">
            <button id="confirm-pirate" type="button" disabled>Välj</button>
          </div>
        </div>
      </div>
    `

    const selection = { id: null, name: null }
    const confirmBtn = document.getElementById('confirm-pirate')
    const previewEl = document.getElementById('pirate-card-preview')

    const updatePreview = (pirateName, pirateNameId) => {
      previewEl.innerHTML = pirateCardHtml({
        photoSrc: portraitPath(guest.real_name),
        pirateName,
        overlaySrc: overlayForGuest({ id: guest.id, pirate_name_id: pirateNameId }),
      })
    }
    updatePreview('—')

    const grid = document.getElementById('name-grid')

    const selectName = (pirateNameId, pirateName) => {
      selection.id = pirateNameId
      selection.name = pirateName
      updatePreview(pirateName, pirateNameId)
      grid.querySelectorAll('button[data-id]').forEach((btn) => {
        btn.classList.toggle('selected', parseInt(btn.dataset.id, 10) === pirateNameId)
      })
      confirmBtn.disabled = false
    }

    const loadNames = async () => {
      const { data: names } = await supabase
        .from('pirate_names').select('id, name, position').order('position')
      const { data: claimed } = await supabase
        .from('guests').select('pirate_name_id').not('pirate_name_id', 'is', null)
      const claimedIds = new Set((claimed ?? []).map((g) => g.pirate_name_id))

      if (selection.id != null && (claimedIds.has(selection.id) || !isSelectablePirateName(selection.id))) {
        selection.id = null; selection.name = null
        confirmBtn.disabled = true
        updatePreview('—')
      }

      const selectable = (names ?? []).filter((n) => isSelectablePirateName(n.id))
      grid.innerHTML = selectable.map((n) => {
        const isClaimed = claimedIds.has(n.id)
        const isSelected = selection.id === n.id
        return `<button type="button" data-id="${n.id}" data-name="${escapeHtml(n.name)}" class="${isClaimed ? 'claimed' : ''}${isSelected ? ' selected' : ''}" ${isClaimed ? 'disabled' : ''}>${escapeHtml(n.name)}</button>`
      }).join('')
      grid.querySelectorAll('button[data-id]').forEach((btn) => {
        if (btn.disabled) return
        const name = btn.dataset.name
        const pirateNameId = parseInt(btn.dataset.id, 10)
        btn.addEventListener('mouseenter', () => updatePreview(name, pirateNameId))
        btn.addEventListener('focus', () => updatePreview(name, pirateNameId))
        btn.addEventListener('click', () => selectName(pirateNameId, name))
      })
      confirmBtn.disabled = selection.id == null
      grid._syncScrollbar?.()
    }

    await loadNames()
    const unbindScrollbar = bindVisibleScrollbar(grid)
    const channel = supabase.channel('rsvp-modal-pirate-names')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, loadNames)
      .subscribe()

    confirmBtn.addEventListener('click', async () => {
      if (selection.id == null) return
      const { error } = await supabase
        .from('guests').update({ pirate_name_id: selection.id })
        .eq('id', guest.id).is('pirate_name_id', null)
      if (error) {
        if (error.code === '23505') { alert('Någon hann före. Välj ett annat namn.'); loadNames(); return }
        alert('Något gick fel: ' + error.message); return
      }
      unbindScrollbar()
      supabase.removeChannel(channel)
      resolve(true)
    })
  })
}
