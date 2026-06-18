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

function updateStatusStats(guests) {
  const el = document.getElementById('status-stats')
  if (!el) return

  let yes = 0
  let no = 0
  let pending = 0
  for (const g of guests) {
    if (g.attending === true) yes++
    else if (g.attending === false) no++
    else pending++
  }

  el.innerHTML = `
    <span class="pill yes">Kommer: ${yes}</span>
    <span class="pill no">Avböjt: ${no}</span>
    <span class="pill pending">Ej svarat: ${pending}</span>
    <span class="admin-stat-total">${guests.length} gäster</span>
  `
}

async function renderAdmin() {
  app.innerHTML = `
    <div class="admin">
      <h1>Svarta Malin — Admin</h1>
      <div id="status-stats" class="admin-status-stats">Laddar…</div>

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
    supabase.from('guests').select('id, real_name, attending, pirate_name_id, crew_id, phone, email').order('real_name'),
    supabase.from('crews').select('id, name').order('id'),
    supabase.from('pirate_names').select('id, name').order('position'),
  ])
  const crewOpts = (crews ?? []).map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')

  updateStatusStats(guests ?? [])

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
  return `<img class="admin-portrait-thumb" src="${src}" alt="${alt}" width="56" height="78" loading="lazy" />`
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

function crewMemberCounts(guests) {
  const counts = new Map()
  for (const g of guests ?? []) {
    if (g.crew_id == null) continue
    counts.set(g.crew_id, (counts.get(g.crew_id) ?? 0) + 1)
  }
  return counts
}

async function renderCrews() {
  const el = document.getElementById('crews-section')
  const [{ data: crews }, { data: guests }] = await Promise.all([
    supabase.from('crews').select('id, name').order('id'),
    supabase.from('guests').select('crew_id'),
  ])
  const memberCounts = crewMemberCounts(guests)

  el.innerHTML = `
    <ul class="crew-admin-list">
      ${(crews ?? []).map((c) => {
        const members = memberCounts.get(c.id) ?? 0
        return `
          <li class="crew-admin-row" data-crew="${c.id}">
            <span class="crew-admin-id">#${c.id}</span>
            <input
              type="text"
              class="crew-name-input"
              data-crew="${c.id}"
              data-original="${escapeHtml(c.name)}"
              value="${escapeHtml(c.name)}"
              maxlength="80"
            />
            <span class="crew-admin-members">${members} gäst${members === 1 ? '' : 'er'}</span>
            <button type="button" class="crew-save-btn" data-crew="${c.id}">Spara</button>
            <button type="button" class="crew-delete-btn" data-crew="${c.id}" data-members="${members}">Ta bort</button>
          </li>
        `
      }).join('')}
    </ul>
    <form id="new-crew" class="crew-admin-new">
      <input id="crew-name" type="text" placeholder="Lagnamn (t.ex. Babords lag)" maxlength="80" />
      <button type="submit">Lägg till</button>
    </form>
  `

  el.querySelectorAll('.crew-save-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const crewId = parseInt(btn.dataset.crew, 10)
      const input = el.querySelector(`.crew-name-input[data-crew="${crewId}"]`)
      const name = input.value.trim()
      if (!name) return alert('Lagnamn får inte vara tomt.')
      if (name === input.dataset.original) return

      btn.disabled = true
      const { data, error } = await supabase.from('crews').update({ name }).eq('id', crewId).select('id')
      btn.disabled = false

      if (error) return alert('Misslyckades: ' + error.message)
      if (!data?.length) {
        return alert('Kunde inte spara lagnamnet. Kör migrationen crews-admin-policies.sql i Supabase.')
      }

      input.dataset.original = name
      btn.textContent = '✓'
      setTimeout(() => { btn.textContent = 'Spara' }, 1200)
      renderGuests()
    })
  })

  el.querySelectorAll('.crew-delete-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const crewId = parseInt(btn.dataset.crew, 10)
      const members = parseInt(btn.dataset.members, 10) || 0
      const input = el.querySelector(`.crew-name-input[data-crew="${crewId}"]`)
      const crewName = input?.value.trim() || `#${crewId}`
      const msg = members > 0
        ? `Ta bort laget "${crewName}" och koppla bort ${members} gäst${members === 1 ? '' : 'er'}?`
        : `Ta bort laget "${crewName}"?`
      if (!confirm(msg)) return

      btn.disabled = true
      if (members > 0) {
        const { error: unlinkError } = await supabase
          .from('guests')
          .update({ crew_id: null })
          .eq('crew_id', crewId)
        if (unlinkError) {
          btn.disabled = false
          return alert('Kunde inte koppla bort gäster: ' + unlinkError.message)
        }
      }

      const { data, error } = await supabase.from('crews').delete().eq('id', crewId).select('id')
      btn.disabled = false

      if (error) return alert('Misslyckades: ' + error.message)
      if (!data?.length) {
        return alert('Kunde inte ta bort laget. Kör migrationen crews-admin-policies.sql i Supabase.')
      }

      renderCrews()
      renderGuests()
    })
  })

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
