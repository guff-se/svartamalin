// Edit-info-sida — kan nås från huvudsidan via "Min info"-knapp.
// Användaren kan ändra mat-preferenser, övrig info, telefon, e-post.
// Pirat-namnet är LÅST efter val (visas men kan ej ändras).

import { supabase } from '../lib/supabase.js'
import { getGuestId } from '../lib/state.js'
import { escapeHtml } from '../lib/escape.js'

export async function renderInfoEdit(app, onDone) {
  const id = getGuestId()
  if (!id) { onDone(); return }

  const { data, error } = await supabase
    .from('guests')
    .select('real_name, pirate_name_id, phone, email, food_notes, notes, pirate_names(name)')
    .eq('id', id)
    .maybeSingle()
  if (error || !data) {
    app.innerHTML = `<section class="rsvp"><div class="rsvp-card"><h2>Kunde inte ladda din info.</h2><div class="row"><button id="back" class="ghost">Tillbaka</button></div></div></section>`
    document.getElementById('back').addEventListener('click', onDone)
    return
  }

  const pirateName = data.pirate_names?.name ?? null

  app.innerHTML = `
    <section class="rsvp">
      <div class="rsvp-card">
        <p class="step-hint">— ${escapeHtml(data.real_name)} —</p>
        <h2>Din info</h2>
        ${pirateName ? `<p class="farewell">Pirat-namn: <strong>${escapeHtml(pirateName)}</strong> (kan ej ändras)</p>` : ''}
        <form id="info-form" class="info-form" autocomplete="on">
          <label class="info-field">
            <span>Allergier / matpreferenser</span>
            <textarea id="food-notes" rows="3" placeholder="t.ex. inga räkor, vegetarian, glutenintolerant…">${escapeHtml(data.food_notes ?? '')}</textarea>
          </label>
          <label class="info-field">
            <span>Övrig info vi bör veta</span>
            <textarea id="other-notes" rows="3" placeholder="t.ex. trasig fot, hund med, kommer sent…">${escapeHtml(data.notes ?? '')}</textarea>
          </label>
          <label class="info-field">
            <span>Telefon</span>
            <input id="phone" type="tel" inputmode="tel" value="${escapeHtml(data.phone ?? '')}" />
          </label>
          <label class="info-field">
            <span>E-post</span>
            <input id="email" type="email" value="${escapeHtml(data.email ?? '')}" />
          </label>
          <div class="row">
            <button type="submit">Spara</button>
            <button type="button" id="cancel" class="ghost">Avbryt</button>
          </div>
          <p class="info-saved" id="info-saved" hidden>Sparat ✓</p>
        </form>
      </div>
    </section>
  `
  document.getElementById('cancel').addEventListener('click', onDone)
  document.getElementById('info-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const food = document.getElementById('food-notes').value.trim()
    const other = document.getElementById('other-notes').value.trim()
    const phone = document.getElementById('phone').value.trim()
    const email = document.getElementById('email').value.trim()
    const { error } = await supabase
      .from('guests')
      .update({
        food_notes: food || null,
        notes: other || null,
        phone: phone || null,
        email: email || null,
      })
      .eq('id', id)
    if (error) { alert('Något gick fel: ' + error.message); return }
    const ok = document.getElementById('info-saved')
    ok.hidden = false
    setTimeout(() => onDone(), 600)
  })
}
