import { supabase } from './lib/supabase.js'
import { escapeHtml } from './lib/escape.js'
import { portraitPath } from './lib/portraits.js'

const app = document.getElementById('app')
const UNLOCKED_KEY = 'svartamalin:admin_unlocked'

function isUnlocked() {
  return localStorage.getItem(UNLOCKED_KEY) === '1'
}

function markUnlocked() {
  localStorage.setItem(UNLOCKED_KEY, '1')
}

async function route() {
  if (!isUnlocked()) {
    renderUnlock()
    return
  }
  renderAdmin()
}

function renderUnlock() {
  app.innerHTML = `
    <section class="unlock">
      <h1>Admin</h1>
      <form id="unlock-form">
        <input id="password" type="password" placeholder="Adminlösenord" autocomplete="off" autofocus />
        <button type="submit">Lås upp</button>
        <p class="error" id="unlock-error"></p>
      </form>
    </section>
  `
  document.getElementById('unlock-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const password = document.getElementById('password').value
    const res = await fetch('/api/admin-unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!res.ok) {
      document.getElementById('unlock-error').textContent = 'Fel lösenord.'
      return
    }
    markUnlocked()
    route()
  })
}

async function renderAdmin() {
  app.innerHTML = `
    <div class="admin">
      <h1>Svarta Malin — Admin</h1>

      <h2>Gäster</h2>
      <div id="guests-table">Laddar…</div>

      <h2>Lag</h2>
      <div id="crews-section"></div>

      <h2>Praktisk info</h2>
      <div id="info-section">Laddar…</div>
    </div>
  `

  await Promise.all([renderGuests(), renderCrews(), renderInfo()])
}

async function renderGuests() {
  const [{ data: guests }, { data: crews }, { data: names }] = await Promise.all([
    supabase.from('guests').select('id, real_name, attending, pirate_name_id, crew_id, phone, email, created_at').order('created_at'),
    supabase.from('crews').select('id, name').order('id'),
    supabase.from('pirate_names').select('id, name').order('id'),
  ])
  const crewOpts = (crews ?? []).map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')

  const el = document.getElementById('guests-table')
  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th class="admin-col-photo">Foto</th>
          <th>Namn</th>
          <th>Status</th>
          <th>Piratnamn</th>
          <th>Lag</th>
          <th>Kontakt</th>
        </tr>
      </thead>
      <tbody>
        ${(guests ?? []).map((g) => `
          <tr>
            <td class="admin-col-photo">${portraitThumbHtml(g.real_name)}</td>
            <td>${escapeHtml(g.real_name)}</td>
            <td>${statusSelect(g.id, g.attending)}</td>
            <td>${pirateNameSelect(g.id, g.pirate_name_id, names ?? [], guests ?? [])}</td>
            <td>
              <select data-guest="${g.id}" class="crew-select">
                <option value="">— Inget lag —</option>
                ${crewOpts.replace(`value="${g.crew_id}"`, `value="${g.crew_id}" selected`)}
              </select>
            </td>
            <td style="font-size:0.8rem; color:var(--paper-dark)">
              ${g.phone ? escapeHtml(g.phone) + '<br/>' : ''}
              ${g.email ? escapeHtml(g.email) : ''}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `

  el.querySelectorAll('.admin-portrait-thumb').forEach((img) => {
    img.addEventListener('error', () => {
      const empty = document.createElement('span')
      empty.className = 'admin-portrait-thumb admin-portrait-thumb--empty'
      empty.title = 'Inget porträtt'
      empty.textContent = '—'
      img.replaceWith(empty)
    })
  })

  el.querySelectorAll('.status-select').forEach((sel) => {
    sel.addEventListener('change', async () => {
      const guestId = sel.dataset.guest
      const attending = { '': null, yes: true, no: false }[sel.value]
      const payload = attending === true
        ? { attending }
        : { attending, pirate_name_id: null }
      const { error } = await supabase.from('guests').update(payload).eq('id', guestId)
      if (error) {
        alert('Misslyckades: ' + error.message)
      }
      renderGuests()
    })
  })

  el.querySelectorAll('.pirate-select').forEach((sel) => {
    sel.addEventListener('change', async () => {
      const guestId = sel.dataset.guest
      const pirateNameId = sel.value === '' ? null : parseInt(sel.value, 10)
      const { error } = await supabase.from('guests').update({ pirate_name_id: pirateNameId }).eq('id', guestId)
      if (error) {
        if (error.code === '23505') {
          alert('Namnet är redan taget av någon annan.')
        } else {
          alert('Misslyckades: ' + error.message)
        }
        renderGuests()
        return
      }
      renderGuests()
    })
  })

  el.querySelectorAll('.crew-select').forEach((sel) => {
    sel.addEventListener('change', async () => {
      const guestId = sel.dataset.guest
      const crewId = sel.value === '' ? null : parseInt(sel.value, 10)
      const { error } = await supabase.from('guests').update({ crew_id: crewId }).eq('id', guestId)
      if (error) alert('Misslyckades: ' + error.message)
    })
  })
}

function portraitThumbHtml(realName) {
  const src = portraitPath(realName)
  const alt = escapeHtml(realName)
  return `<img class="admin-portrait-thumb" src="${src}" alt="${alt}" width="40" height="56" loading="lazy" />`
}

function statusSelect(guestId, attending) {
  const val = attending === true ? 'yes' : attending === false ? 'no' : ''
  return `
    <select data-guest="${guestId}" class="status-select">
      <option value="" ${val === '' ? 'selected' : ''}>Ej svarat</option>
      <option value="yes" ${val === 'yes' ? 'selected' : ''}>Kommer</option>
      <option value="no" ${val === 'no' ? 'selected' : ''}>Avböjt</option>
    </select>
  `
}

function pirateNameSelect(guestId, pirateNameId, names, guests) {
  const takenByOther = new Set(
    guests.filter((g) => g.pirate_name_id && g.id !== guestId).map((g) => g.pirate_name_id),
  )
  const opts = names.map((n) => {
    const selected = n.id === pirateNameId
    const taken = takenByOther.has(n.id)
    const disabled = taken && !selected
    return `<option value="${n.id}" ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}>${escapeHtml(n.name)}${disabled ? ' (taget)' : ''}</option>`
  }).join('')
  return `
    <select data-guest="${guestId}" class="pirate-select">
      <option value="" ${pirateNameId == null ? 'selected' : ''}>— Nollställ —</option>
      ${opts}
    </select>
  `
}

async function renderCrews() {
  const el = document.getElementById('crews-section')
  const { data: crews } = await supabase.from('crews').select('id, name').order('id')
  el.innerHTML = `
    <ul style="list-style:none; padding:0;">
      ${(crews ?? []).map((c) => `<li style="margin:0.25rem 0;">#${c.id} — ${escapeHtml(c.name)}</li>`).join('')}
    </ul>
    <form id="new-crew" style="display:flex; gap:0.5rem; margin-top:1rem;">
      <input id="crew-name" type="text" placeholder="Lagnamn (t.ex. Babords lag)" />
      <button type="submit">Lägg till</button>
    </form>
  `
  document.getElementById('new-crew').addEventListener('submit', async (e) => {
    e.preventDefault()
    const input = document.getElementById('crew-name')
    const name = input.value.trim()
    if (!name) return
    const { error } = await supabase.from('crews').insert({ name })
    if (error) return alert(error.message)
    input.value = ''
    renderCrews()
    renderGuests()
  })
}

async function renderInfo() {
  const el = document.getElementById('info-section')
  const { data } = await supabase.from('practical_info').select('key, value').order('key')
  el.innerHTML = (data ?? []).map((r) => `
    <div class="info-row">
      <label>${escapeHtml(r.key)}</label>
      <textarea data-key="${r.key}">${escapeHtml(r.value)}</textarea>
      <button data-save="${r.key}">Spara</button>
    </div>
  `).join('') + `
    <form id="new-info" style="margin-top:1.5rem; display:flex; gap:0.5rem;">
      <input id="info-key" type="text" placeholder="Nyckel (t.ex. boat_friday)" />
      <input id="info-value" type="text" placeholder="Värde" style="flex:1;" />
      <button type="submit">Lägg till</button>
    </form>
  `

  el.querySelectorAll('button[data-save]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const key = btn.dataset.save
      const value = el.querySelector(`textarea[data-key="${key}"]`).value
      const { error } = await supabase.from('practical_info').upsert({ key, value, updated_at: new Date().toISOString() })
      if (error) return alert(error.message)
      btn.textContent = '✓'
      setTimeout(() => { btn.textContent = 'Spara' }, 1200)
    })
  })

  document.getElementById('new-info').addEventListener('submit', async (e) => {
    e.preventDefault()
    const key = document.getElementById('info-key').value.trim()
    const value = document.getElementById('info-value').value.trim()
    if (!key || !value) return
    const { error } = await supabase.from('practical_info').insert({ key, value })
    if (error) return alert(error.message)
    renderInfo()
  })
}

route()
