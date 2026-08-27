import { supabase } from '../lib/supabase.js'
import { getGuestId } from '../lib/state.js'
import { escapeHtml } from '../lib/escape.js'
import { portraitPath } from '../lib/portraits.js'
import { overlayForGuest } from '../lib/card-frame-assignments.js'
import { sortByPirateNameId } from '../lib/pirate-name-order.js'
import { fetchPirateGuests, getCrewIntriger, intrigerListHtml } from '../lib/intriger.js'
import { crewShip, huntedCrewShip } from '../lib/ships.js'
import { pirateCardHtml } from './pirate-card.js'
import { makeCardsInteractive, wirePirateCardGrid, wirePirateNameLightbox } from './crew-collage.js'
import { openLightbox } from '../lib/image-lightbox.js'

/**
 * Lagets skuta, lagintriger och besättning i samma kort.
 * @param {HTMLElement} el  — #crew-intriger card
 */
export async function renderCrewIntriger(el) {
  const section = el.closest('.card-section')
  const show = () => { if (section) section.hidden = false }

  const guestId = getGuestId()
  if (!guestId) {
    show()
    el.innerHTML = `<p class="crew-empty">Logga in som gäst för att se din besättning.</p>`
    return
  }

  const { data: me } = await supabase
    .from('guests')
    .select('crew_id')
    .eq('id', guestId)
    .maybeSingle()

  if (!me || me.crew_id === null) {
    show()
    el.innerHTML = `
      <p class="crew-empty">
        Lagen seglas fortfarande ihop. Du får besked när din besättning är klar.
      </p>
    `
    return
  }

  const [{ data: crew }, { data: mates }, pirates] = await Promise.all([
    supabase.from('crews').select('id, name').eq('id', me.crew_id).maybeSingle(),
    supabase
      .from('guests')
      .select('id, real_name, phone, email, pirate_name_id')
      .eq('crew_id', me.crew_id)
      .not('pirate_name_id', 'is', null),
    fetchPirateGuests(),
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

  // Sista ## är jakten på en annan skuta (STYLE.md). Mini-bilden = den jagade skutan.
  const huntShip = huntedCrewShip(me.crew_id)
  const crewIntriger = getCrewIntriger(me.crew_id).map((intrig, i, arr) =>
    huntShip && i === arr.length - 1 ? { ...intrig, ship: huntShip } : intrig,
  )
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

  show()
  el.innerHTML = `
    ${shipHtml}
    <h2 class="crew-name">${escapeHtml(crewName)}</h2>
    <p class="crew-sub">Din skuta</p>
    ${crewIntriger.length ? intrigerListHtml(crewIntriger, {}, { showCards: false, pirates }) : ''}
    <div class="crew-members">
      <h3 class="my-crew-members-heading">Besättningen</h3>
      <div class="crew-collage" id="my-crew-collage"></div>
    </div>
  `

  const shipFig = el.querySelector('.crew-ship')
  if (shipFig && ship) wireShipLightbox(shipFig, ship)

  const huntFig = el.querySelector('.intrig__ship')
  if (huntFig && huntShip) wireShipLightbox(huntFig, huntShip)

  const intrigList = el.querySelector('.intriger-list')
  if (intrigList) wirePirateNameLightbox(intrigList)

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
