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

  el.innerHTML = `
    <h3 style="text-align:center; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold)">
      ${escapeHtml(crew?.name ?? 'Ditt lag')}
    </h3>
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
}

