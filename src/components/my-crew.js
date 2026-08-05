import { supabase } from '../lib/supabase.js'
import { getGuestId } from '../lib/state.js'
import { escapeHtml } from '../lib/escape.js'
import { portraitPath } from '../lib/portraits.js'
import { overlayForGuest } from '../lib/card-frame-assignments.js'
import { sortByPirateNameId } from '../lib/pirate-name-order.js'
import { getCrewIntriger, intrigerListHtml } from '../lib/intriger.js'
import { pirateCardHtml } from './pirate-card.js'
import { makeCardsInteractive, wirePirateCardGrid } from './crew-collage.js'

export async function renderMyCrew(el) {
  const guestId = getGuestId()
  if (!guestId) {
    el.innerHTML = `<p class="crew-empty">Logga in som gäst för att se din besättning.</p>`
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
      .not('pirate_name_id', 'is', null),
  ])

  const ids = (mates ?? []).map((m) => m.pirate_name_id).filter(Boolean)
  const { data: names } = ids.length
    ? await supabase.from('pirate_names').select('id, name').in('id', ids)
    : { data: [] }
  const nameMap = Object.fromEntries((names ?? []).map((n) => [n.id, n.name]))

  const crewName = crew?.name ?? '—'
  const withPirateNames = (mates ?? [])
    .map((m) => ({ ...m, pirate_name: nameMap[m.pirate_name_id] }))
    .filter((m) => m.pirate_name)

  const crewIntriger = getCrewIntriger(me.crew_id)
  const crewIntrigerHtml = crewIntriger.length
    ? `
      <div class="crew-intriger">
        ${intrigerListHtml(crewIntriger, {}, { showCards: false })}
      </div>
    `
    : ''

  el.innerHTML = `
    <h2 class="crew-name">${escapeHtml(crewName)}</h2>
    <p class="crew-sub">Din skuta</p>
    ${crewIntrigerHtml}
    <h3 class="my-crew-members-heading">Besättningen</h3>
    <div class="crew-collage" id="my-crew-collage"></div>
  `

  const grid = el.querySelector('#my-crew-collage')
  wirePirateCardGrid(grid)

  if (!withPirateNames.length) {
    grid.innerHTML = `<p class="crew-empty">Ingen i besättningen har mönstrat på än.</p>`
    return
  }

  grid.innerHTML = sortByPirateNameId(withPirateNames).map((m) => `
    <div class="my-crew-member">
      ${pirateCardHtml({
        photoSrc: portraitPath(m.real_name),
        pirateName: m.pirate_name,
        overlaySrc: overlayForGuest({ id: m.id, pirate_name_id: m.pirate_name_id }),
      })}
      ${contactHtml(m)}
    </div>
  `).join('')

  makeCardsInteractive(grid)
}

function contactHtml({ phone, email }) {
  const lines = []
  if (phone) {
    lines.push(
      `<a class="my-crew-contact__link" href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a>`,
    )
  }
  if (email) {
    lines.push(
      `<a class="my-crew-contact__link" href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`,
    )
  }
  if (!lines.length) {
    return `<div class="my-crew-contact my-crew-contact--empty">—</div>`
  }
  return `<div class="my-crew-contact">${lines.join('')}</div>`
}
