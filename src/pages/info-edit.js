// Edit-info-sida — kan nås från huvudsidan via "Min info"-knapp.
// Användaren kan ändra mat-preferenser, övrig info, telefon, e-post.
// Pirat-namnet är LÅST efter val (visas men kan ej ändras).

import { supabase } from '../lib/supabase.js'
import { getGuestId } from '../lib/state.js'
import { escapeHtml } from '../lib/escape.js'

export async function renderInfoEdit(app, onDone) {
  const id = getGuestId()
  if (!id) { onDone(); return }

  // Försök med food_notes; om kolumnen saknas (migrationen inte körd än),
  // fall tillbaka utan den så sidan ändå kan laddas och redigeras.
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
    app.innerHTML = `<section class="rsvp"><div class="rsvp-card"><h2>Kunde inte ladda din info.</h2><p class="farewell">${escapeHtml(error?.message ?? 'okänt fel')}</p><div class="row"><button id="back" class="ghost">Tillbaka</button></div></div></section>`
    document.getElementById('back').addEventListener('click', onDone)
    return
  }

  // Säkerställ default-värden så även en helt tom rad renderar formuläret.
  data.phone ??= ''
  data.email ??= ''
  data.food_notes ??= ''
  data.notes ??= ''

  app.innerHTML = `
    <section class="rsvp">
      <div class="rsvp-card">
        <p class="step-hint">— ${escapeHtml(data.real_name)} —</p>
        <h2>Din info</h2>
        <form id="info-form" class="info-form" autocomplete="on">
          <label class="info-field">
            <span>Allergier / matpreferenser</span>
            <textarea id="food-notes" rows="3" placeholder="t.ex. inga räkor, vegetarian, glutenintolerant…">${escapeHtml(data.food_notes ?? '')}</textarea>
          </label>
          <label class="info-field">
            <span>Övrig info vi bör veta</span>
            <textarea id="other-notes" rows="3" placeholder="t.ex. trasig fot, kommer sent, höjdrädd…">${escapeHtml(data.notes ?? '')}</textarea>
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
    const payloadFull = { food_notes: food || null, notes: other || null, phone: phone || null, email: email || null }
    let { error } = await supabase.from('guests').update(payloadFull).eq('id', id)
    if (error && /food_notes/.test(error.message ?? '')) {
      // Migrationen inte körd: spara övriga fält så datat inte tappas
      const { food_notes, ...payloadNoFood } = payloadFull  // eslint-disable-line no-unused-vars
      const r = await supabase.from('guests').update(payloadNoFood).eq('id', id)
      error = r.error
    }
    if (error) { alert('Något gick fel: ' + error.message); return }
    const ok = document.getElementById('info-saved')
    ok.hidden = false
    setTimeout(() => onDone(), 600)
  })
}
