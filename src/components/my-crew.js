import { supabase } from '../lib/supabase.js'
import { escapeHtml } from '../lib/escape.js'

export async function renderMyCrew(el, guestId) {
  if (!guestId) {
    el.innerHTML = `<p class="crew-empty">Logga in som gäst för att se ditt lag.</p>`
    return
  }

  const { data: me } = await supabase
    .from('guests')
    .select('crew_id')
    .eq('id', guestId)
    .maybeSingle()

  if (!me || me.crew_id === null) {
    el.innerHTML = `
      <p class="crew-empty">
        Lagen seglas fortfarande ihop. Du får besked när din besättning är klar.
      </p>
    `
    return
  }

  const [{ data: crew }, { data: mates }] = await Promise.all([
    supabase.from('crews').select('id, name').eq('id', me.crew_id).maybeSingle(),
    supabase
      .from('guests')
      .select('id, real_name, phone, email, pirate_name_id')
      .eq('crew_id', me.crew_id)
      .neq('id', guestId),
  ])

  // Hämta piratnamnen för mates
  const ids = (mates ?? []).map((m) => m.pirate_name_id).filter(Boolean)
  const { data: names } = ids.length
    ? await supabase.from('pirate_names').select('id, name').in('id', ids)
    : { data: [] }
  const nameMap = Object.fromEntries((names ?? []).map((n) => [n.id, n.name]))

  const crewName = crew?.name ?? 'Ditt lag'

  el.innerHTML = `
    <div class="crew-header">
      <h3 class="crew-name">${escapeHtml(crewName)}</h3>
      <button type="button" class="crew-rename-btn" id="crew-rename-btn">Byt lagnamn</button>
    </div>
    <form class="crew-rename-form" id="crew-rename-form" hidden>
      <label class="visually-hidden" for="crew-rename-input">Nytt lagnamn</label>
      <input
        type="text"
        id="crew-rename-input"
        class="crew-rename-input"
        maxlength="80"
        value="${escapeHtml(crewName)}"
        autocomplete="off"
      />
      <div class="crew-rename-actions">
        <button type="submit" class="crew-rename-save">Spara</button>
        <button type="button" class="crew-rename-cancel ghost">Avbryt</button>
      </div>
      <p class="crew-rename-error" id="crew-rename-error" hidden></p>
    </form>
    <ul class="crew-list">
      ${(mates ?? []).map((m) => `
        <li>
          <div class="name">${escapeHtml(m.real_name)}</div>
          <div class="pirate">${escapeHtml(nameMap[m.pirate_name_id] ?? '—')}</div>
          ${m.phone ? `<div class="contact">📞 ${escapeHtml(m.phone)}</div>` : ''}
          ${m.email ? `<div class="contact">✉️ ${escapeHtml(m.email)}</div>` : ''}
        </li>
      `).join('')}
    </ul>
  `

  bindRenameHandlers(el, guestId)
}

function bindRenameHandlers(el, guestId) {
  const renameBtn = el.querySelector('#crew-rename-btn')
  const form = el.querySelector('#crew-rename-form')
  const input = el.querySelector('#crew-rename-input')
  const cancelBtn = el.querySelector('.crew-rename-cancel')
  const errorEl = el.querySelector('#crew-rename-error')
  const header = el.querySelector('.crew-header')

  if (!renameBtn || !form || !input) return

  const showForm = () => {
    header.hidden = true
    form.hidden = false
    errorEl.hidden = true
    errorEl.textContent = ''
    input.focus()
    input.select()
  }

  const hideForm = () => {
    form.hidden = true
    header.hidden = false
    errorEl.hidden = true
    errorEl.textContent = ''
  }

  renameBtn.addEventListener('click', showForm)
  cancelBtn.addEventListener('click', hideForm)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const newName = input.value.trim()
    if (!newName) {
      errorEl.textContent = 'Skriv ett lagnamn.'
      errorEl.hidden = false
      return
    }

    const saveBtn = form.querySelector('.crew-rename-save')
    saveBtn.disabled = true

    const { error } = await supabase.rpc('update_my_crew_name', {
      p_guest_id: guestId,
      p_name: newName,
    })

    saveBtn.disabled = false

    if (error) {
      errorEl.textContent = error.message.includes('tomt')
        ? 'Lagnamn får inte vara tomt.'
        : 'Kunde inte spara: ' + error.message
      errorEl.hidden = false
      return
    }

    await renderMyCrew(el, guestId)
  })
}
