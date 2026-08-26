import { supabase } from '../lib/supabase.js'
import { getGuestId } from '../lib/state.js'
import { escapeHtml } from '../lib/escape.js'
import { getCrewIntriger, intrigerListHtml } from '../lib/intriger.js'
import { crewShip } from '../lib/ships.js'
import { openLightbox } from '../lib/image-lightbox.js'

/**
 * Lagets skuta + lagintriger. Döljer section om gästen saknar lag.
 * @param {HTMLElement} el  — #crew-intriger card
 */
export async function renderCrewIntriger(el) {
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
    .select('crew_id')
    .eq('id', guestId)
    .maybeSingle()

  if (!me || me.crew_id === null) {
    hide()
    return
  }

  const { data: crew } = await supabase
    .from('crews')
    .select('id, name')
    .eq('id', me.crew_id)
    .maybeSingle()

  const crewName = crew?.name ?? '—'
  const crewIntriger = getCrewIntriger(me.crew_id)
  const ship = crewShip(me.crew_id)
  const shipHtml = ship
    ? `
      <figure class="crew-ship">
        <img
          src="${escapeHtml(ship.src)}"
          alt="${escapeHtml(ship.alt)}"
          width="${ship.width}"
          height="${ship.height}"
        />
      </figure>
    `
    : ''

  if (section) section.hidden = false
  el.innerHTML = `
    ${shipHtml}
    <h2 class="crew-name">${escapeHtml(crewName)}</h2>
    <p class="crew-sub">Din skuta</p>
    ${crewIntriger.length ? intrigerListHtml(crewIntriger, {}, { showCards: false }) : ''}
  `

  const shipFig = el.querySelector('.crew-ship')
  if (shipFig && ship) wireShipLightbox(shipFig, ship)
}

function wireShipLightbox(fig, ship) {
  fig.setAttribute('tabindex', '0')
  fig.setAttribute('role', 'button')
  fig.setAttribute('aria-label', `Visa ${ship.alt} i fullskärm`)
  const open = () => {
    const big = document.createElement('img')
    big.src = ship.src
    big.alt = ship.alt
    big.className = 'lightbox-image'
    openLightbox({ ariaLabel: ship.alt, content: big, returnFocus: fig })
  }
  fig.addEventListener('click', open)
  fig.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open()
    }
  })
}
