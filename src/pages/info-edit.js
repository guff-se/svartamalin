// Modal för "Din info" — overlay ovanpå huvudsidan utan route-byte.
// Bakgrunds-content och WebGL-animationen påverkas inte; modalens close
// tar bara bort DOM-noden.

import { supabase } from '../lib/supabase.js'
import { getGuestId } from '../lib/state.js'
import { escapeHtml } from '../lib/escape.js'

let openEl = null   // singleton — bara en modal i taget

export async function openInfoModal() {
  if (openEl) return
  const id = getGuestId()
  if (!id) return

  // Bygg modal-element (initialt med "Laddar…" så användaren får feedback)
  openEl = document.createElement('div')
  openEl.className = 'info-modal'
  openEl.innerHTML = `
    <div class="info-modal__backdrop"></div>
    <div class="info-modal__card" role="dialog" aria-modal="true" aria-label="Din info">
      <p class="info-modal__loading">Laddar…</p>
    </div>
  `
  document.body.appendChild(openEl)

  // Close-handlers — backdrop, Escape, close-button (sätts efter render)
  const close = () => {
    if (!openEl) return
    openEl.remove()
    openEl = null
    window.removeEventListener('keydown', onKey)
  }
  const onKey = (e) => { if (e.key === 'Escape') close() }
  window.addEventListener('keydown', onKey)
  openEl.querySelector('.info-modal__backdrop').addEventListener('click', close)

  // Hämta data (defensivt mot saknad food_notes-kolumn)
  let { data, error } = await supabase
    .from('guests')
    .select('real_name, phone, email, food_notes, notes')
    .eq('id', id)
    .maybeSingle()
  if (error && /food_notes/.test(error.message ?? '')) {
    const r = await supabase
      .from('guests')
      .select('real_name, phone, email, notes')
      .eq('id', id)
      .maybeSingle()
    data = r.data
    error = r.error
  }
  if (error || !data) {
    if (!openEl) return  // close skedde under fetch
    openEl.querySelector('.info-modal__card').innerHTML = `
      <p class="info-modal__error">Kunde inte ladda din info.<br><small>${escapeHtml(error?.message ?? 'okänt fel')}</small></p>
      <div class="row"><button id="info-modal-close" class="ghost">Stäng</button></div>
    `
    document.getElementById('info-modal-close').addEventListener('click', close)
    return
  }
  if (!openEl) return  // close skedde under fetch

  data.phone ??= ''; data.email ??= ''; data.food_notes ??= ''; data.notes ??= ''

  openEl.querySelector('.info-modal__card').innerHTML = `
    <p class="step-hint">— ${escapeHtml(data.real_name)} —</p>
    <h2>Din info</h2>
    <form id="info-form" class="info-form" autocomplete="on">
      <label class="info-field">
        <span>Allergier / matpreferenser</span>
        <textarea id="food-notes" rows="3" placeholder="t.ex. inga räkor, vegetarian, glutenintolerant…">${escapeHtml(data.food_notes)}</textarea>
      </label>
      <label class="info-field">
        <span>Övrig info vi bör veta</span>
        <textarea id="other-notes" rows="3" placeholder="t.ex. träben, kommer sent, höjdrädd…">${escapeHtml(data.notes)}</textarea>
      </label>
      <label class="info-field">
        <span>Telefon</span>
        <input id="phone" type="tel" inputmode="tel" value="${escapeHtml(data.phone)}" />
      </label>
      <label class="info-field">
        <span>E-post</span>
        <input id="email" type="email" value="${escapeHtml(data.email)}" />
      </label>
      <div class="row">
        <button type="submit">Spara</button>
        <button type="button" id="cancel" class="ghost">Avbryt</button>
      </div>
      <p class="info-saved" id="info-saved" hidden>Sparat ✓</p>
    </form>
  `
  document.getElementById('cancel').addEventListener('click', close)
  document.getElementById('info-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const food = document.getElementById('food-notes').value.trim()
    const other = document.getElementById('other-notes').value.trim()
    const phone = document.getElementById('phone').value.trim()
    const email = document.getElementById('email').value.trim()

    const payloadFull = { food_notes: food || null, notes: other || null, phone: phone || null, email: email || null }
    let { error: e1 } = await supabase.from('guests').update(payloadFull).eq('id', id)
    if (e1 && /food_notes/.test(e1.message ?? '')) {
      const { food_notes, ...payloadNoFood } = payloadFull  // eslint-disable-line no-unused-vars
      const r = await supabase.from('guests').update(payloadNoFood).eq('id', id)
      e1 = r.error
    }
    if (e1) { alert('Något gick fel: ' + e1.message); return }

    const ok = document.getElementById('info-saved')
    if (ok) ok.hidden = false
    setTimeout(close, 600)
  })
}
