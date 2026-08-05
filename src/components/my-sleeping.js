import { supabase } from '../lib/supabase.js'
import { getGuestId } from '../lib/state.js'
import { escapeHtml } from '../lib/escape.js'

/**
 * "Din sovplats" — rum och bädd för inloggad gäst, plus vilka hen delar rum med.
 * Döljer hela .practical-sub om gästen inte är inloggad eller saknar sovplats.
 * @param {HTMLElement} el — #my-sleeping
 */
export async function renderMySleeping(el) {
  if (!el) return
  const block = el.closest('.practical-sub')
  const hide = () => {
    el.innerHTML = ''
    if (block) block.hidden = true
  }

  const guestId = getGuestId()
  if (!guestId) {
    hide()
    return
  }

  const { data: me, error } = await supabase
    .from('guests')
    .select('id, real_name, sleeping_room, sleeping_bed')
    .eq('id', guestId)
    .maybeSingle()

  // Migrationen (supabase/migrations/add-sleeping-spot.sql) inte körd än.
  if (error && /sleeping_/.test(error.message ?? '')) {
    console.warn('Din sovplats: sleeping-kolumner saknas i databasen — kör add-sleeping-spot.sql')
    hide()
    return
  }
  if (error || !me?.sleeping_room) {
    hide()
    return
  }

  const { data: roommates } = await supabase
    .from('guests')
    .select('id, real_name, sleeping_bed, pirate_name_id')
    .eq('sleeping_room', me.sleeping_room)
    .neq('id', guestId)
    .order('real_name')

  const ids = (roommates ?? []).map((m) => m.pirate_name_id).filter(Boolean)
  const { data: names } = ids.length
    ? await supabase.from('pirate_names').select('id, name').in('id', ids)
    : { data: [] }
  const nameMap = Object.fromEntries((names ?? []).map((n) => [n.id, n.name]))

  if (block) block.hidden = false
  el.innerHTML = `
    <p class="sleeping-spot">
      <span class="sleeping-spot__room">${escapeHtml(me.sleeping_room)}</span>
      ${me.sleeping_bed ? `<span class="sleeping-spot__bed">${escapeHtml(me.sleeping_bed)}</span>` : ''}
    </p>
    ${roommatesHtml(roommates ?? [], nameMap)}
  `
}

function roommatesHtml(roommates, nameMap) {
  if (!roommates.length) {
    return `<p class="sleeping-mates__empty">Rummet är ditt eget — ingen annan snarkning att stå ut med.</p>`
  }
  const items = roommates.map((m) => {
    const pirateName = nameMap[m.pirate_name_id]
    return `
    <li>
      <span class="sleeping-mates__name">${escapeHtml(pirateName ?? m.real_name)}</span>
      ${pirateName ? `<span class="sleeping-mates__real">${escapeHtml(m.real_name)}</span>` : ''}
      ${m.sleeping_bed ? `<span class="sleeping-mates__bed">${escapeHtml(m.sleeping_bed)}</span>` : ''}
    </li>
  `
  }).join('')
  return `
    <p class="sleeping-mates__intro">Du delar rum med:</p>
    <ul class="sleeping-mates">${items}</ul>
  `
}
