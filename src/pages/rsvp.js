import { supabase } from '../lib/supabase.js'
import { getGuestId, setPeekMode } from '../lib/state.js'
import { escapeHtml } from '../lib/escape.js'
import { portraitPath } from '../lib/portraits.js'
import { overlayForGuest } from '../lib/card-frame-assignments.js'
import { pirateCardHtml } from '../components/pirate-card.js'
import { renderPracticalInfoKeys, RSVP_PRACTICAL_KEYS } from '../components/practical-info.js'
import { bindVisibleScrollbar } from '../lib/visible-scrollbar.js'

// Steg-state hålls i closures här i modulen.
let stage = 'attending' // 'attending' | 'pirate' | 'declined'
let guest = null   // { id, real_name }

export async function renderRsvp(app, onDone) {
  const existingId = getGuestId()
  if (!existingId) {
    app.innerHTML = `
      <section class="rsvp">
        <div class="rsvp-card">
          <p class="step-hint">— Inskrivning —</p>
          <h2>Du måste logga in först.</h2>
          <p class="farewell">Gå tillbaka och ange ditt personliga lösenord.</p>
        </div>
      </section>
    `
    return
  }

  const { data, error } = await supabase
    .from('guests')
    .select('id, real_name, attending, pirate_name_id')
    .eq('id', existingId)
    .maybeSingle()

  if (error || !data) {
    app.innerHTML = `
      <section class="rsvp">
        <div class="rsvp-card">
          <h2>Kunde inte hitta din profil.</h2>
          <p class="farewell">Logga ut och försök igen med ditt lösenord.</p>
        </div>
      </section>
    `
    return
  }

  guest = data
  if (data.attending === null) stage = 'attending'
  else if (data.attending === false) stage = 'declined'
  else if (data.pirate_name_id === null) stage = 'pirate'
  else { onDone(); return }

  render(app, onDone)
}

function render(app, onDone) {
  const sectionClass = stage === 'pirate' ? 'rsvp rsvp--pirate-pick' : 'rsvp'
  app.innerHTML = `<section class="${sectionClass}"><div class="rsvp-card" id="rsvp-card"></div></section>`
  const card = document.getElementById('rsvp-card')

  if (stage === 'attending') renderAttendingStep(card, onDone)
  else if (stage === 'pirate') renderPirateStep(card, onDone)
  else if (stage === 'declined') renderDeclinedStep(card, onDone)
}

function renderAttendingStep(card, onDone) {
  card.innerHTML = `
    <p class="step-hint">— ${escapeHtml(guest.real_name)} —</p>
    <div class="rsvp-practical" id="rsvp-practical"></div>
    <h2>Hörsammar du kallelsen?</h2>
    <div class="row">
      <button id="yes">Ja, jag kommer</button>
      <button id="no" class="ghost">Nej, jag måste avstå</button>
    </div>
  `
  renderPracticalInfoKeys(document.getElementById('rsvp-practical'), RSVP_PRACTICAL_KEYS)
  document.getElementById('yes').addEventListener('click', () => updateAttending(true, onDone))
  document.getElementById('no').addEventListener('click', () => updateAttending(false, onDone))
}

async function updateAttending(attending, onDone) {
  const payload = attending === true
    ? { attending }
    : { attending, pirate_name_id: null }
  const { error } = await supabase
    .from('guests')
    .update(payload)
    .eq('id', guest.id)
  if (error) {
    alert('Något gick fel: ' + error.message)
    return
  }
  guest.attending = attending
  if (attending !== true) guest.pirate_name_id = null
  stage = attending ? 'pirate' : 'declined'
  render(document.getElementById('app'), onDone)
}

async function renderPirateStep(card, onDone) {
  card.innerHTML = `
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
  previewEl.addEventListener('error', onPortraitPreviewError, true)

  const selectName = (pirateNameId, pirateName) => {
    selection.id = pirateNameId
    selection.name = pirateName
    updatePreview(pirateName, pirateNameId)
    grid.querySelectorAll('button[data-id]').forEach((btn) => {
      btn.classList.toggle('selected', parseInt(btn.dataset.id, 10) === pirateNameId)
    })
    confirmBtn.disabled = false
  }

  confirmBtn.addEventListener('click', () => {
    if (selection.id == null) return
    claimName(selection.id, onDone)
  })

  const grid = document.getElementById('name-grid')
  await refreshNames(grid, onDone, updatePreview, selection, selectName, confirmBtn)
  const unbindScrollbar = bindVisibleScrollbar(grid)

  const channel = supabase
    .channel('rsvp-pirate-names')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, () => {
      refreshNames(grid, onDone, updatePreview, selection, selectName, confirmBtn)
    })
    .subscribe()

  const cleanup = () => {
    unbindScrollbar()
    supabase.removeChannel(channel)
  }
  window.addEventListener('beforeunload', cleanup, { once: true })
}

function onPortraitPreviewError(e) {
  const img = e.target
  if (!img.matches?.('.pirate-card__photo-img')) return
  const photo = img.closest('.pirate-card__photo')
  if (!photo) return
  img.remove()
  photo.insertAdjacentHTML('afterbegin', '<span class="pirate-card__placeholder" aria-hidden="true">🏴‍☠️</span>')
}

async function refreshNames(grid, onDone, updatePreview, selection, selectName, confirmBtn) {
  const { data: names } = await supabase
    .from('pirate_names')
    .select('id, name, position')
    .order('position')

  const { data: claimed } = await supabase
    .from('guests')
    .select('pirate_name_id')
    .not('pirate_name_id', 'is', null)

  const claimedIds = new Set((claimed ?? []).map((g) => g.pirate_name_id))

  if (selection.id != null && claimedIds.has(selection.id)) {
    selection.id = null
    selection.name = null
    confirmBtn.disabled = true
    updatePreview('—')
  }

  grid.innerHTML = (names ?? []).map((n) => {
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

async function claimName(pirateNameId, onDone) {
  const { error } = await supabase
    .from('guests')
    .update({ pirate_name_id: pirateNameId })
    .eq('id', guest.id)
    .is('pirate_name_id', null)

  if (error) {
    if (error.code === '23505') {
      alert('Någon hann före — välj ett annat namn.')
      return
    }
    alert('Något gick fel: ' + error.message)
    return
  }
  onDone()
}

function renderDeclinedStep(card, onDone) {
  card.innerHTML = `
    <p class="step-hint">— Tråkigt —</p>
    <h2>Vi kommer sakna dig.</h2>
    <p class="farewell">
      Om vindarna vänder är du välkommen tillbaka hit och ändra ditt svar.
    </p>
    <div class="row">
      <button id="peek">Jag vill se vad jag missar</button>
      <button id="change" class="ghost">Jag ändrar mig</button>
    </div>
  `
  document.getElementById('peek').addEventListener('click', () => {
    setPeekMode(true)
    onDone()
  })
  document.getElementById('change').addEventListener('click', async () => {
    setPeekMode(false)
    await supabase.from('guests').update({ attending: null }).eq('id', guest.id)
    guest.attending = null
    stage = 'attending'
    render(document.getElementById('app'), onDone)
  })
}

