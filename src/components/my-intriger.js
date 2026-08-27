import { supabase } from '../lib/supabase.js'
import { getGuestId } from '../lib/state.js'
import { escapeHtml } from '../lib/escape.js'
import { portraitPath } from '../lib/portraits.js'
import { overlayForGuest } from '../lib/card-frame-assignments.js'
import { fetchIntrigerGuests, fetchPirateGuests, getGuestIntriger, intrigerListHtml } from '../lib/intriger.js'
import { pirateCardHtml } from './pirate-card.js'
import { makeCardsInteractive, wirePirateCardGrid, wirePirateNameLightbox } from './crew-collage.js'
import { renderNarrative } from './narrative-section.js'

/**
 * Personliga intriger — egen card. Döljer hela section om det inte finns något att visa.
 * @param {HTMLElement} el  — #my-intriger card
 */
export async function renderMyIntriger(el) {
  const section = el.closest('.card-section')
  const hide = () => {
    el.innerHTML = ''
    if (section) section.hidden = true
  }

  const guestId = getGuestId()
  if (!guestId) {
    hide()
    return
  }

  const { data: me } = await supabase
    .from('guests')
    .select('id, real_name, login_slug, pirate_name_id')
    .eq('id', guestId)
    .maybeSingle()

  const intrigues = getGuestIntriger(me?.login_slug)
  if (!intrigues.length) {
    hide()
    return
  }

  const [{ data: pname }, pirates] = await Promise.all([
    me?.pirate_name_id
      ? supabase.from('pirate_names').select('name').eq('id', me.pirate_name_id).maybeSingle()
      : Promise.resolve({ data: null }),
    fetchPirateGuests(),
  ])
  const guestsBySlug = await fetchIntrigerGuests(intrigues, pirates)

  const pirateName = pname?.name || '…'
  const heroCard = me
    ? pirateCardHtml({
        photoSrc: portraitPath(me.real_name),
        pirateName,
        overlaySrc: overlayForGuest({ id: me.id, pirate_name_id: me.pirate_name_id }),
      })
    : ''

  if (section) section.hidden = false
  el.innerHTML = `
    <div class="intriger-hero">
      ${heroCard}
    </div>
    <h2 class="intriger-print-name">${escapeHtml(pirateName)}</h2>
    <p class="intriger-sub">Din roll</p>
    <div class="intriger-note"></div>
    ${intrigerListHtml(intrigues, guestsBySlug, { pirates })}
  `

  await renderNarrative(el.querySelector('.intriger-note'), { key: 'intriger_personal' })

  const hero = el.querySelector('.intriger-hero')
  if (hero) {
    wirePirateCardGrid(hero)
    makeCardsInteractive(hero)
  }

  const list = el.querySelector('.intriger-list')
  if (list) {
    wirePirateCardGrid(list)
    makeCardsInteractive(list)
    wirePirateNameLightbox(list)
  }
}
