import { supabase } from '../lib/supabase.js'
import { portraitPath } from '../lib/portraits.js'
import { overlayForGuest } from '../lib/card-frame-assignments.js'
import { sortByPirateNameId } from '../lib/pirate-name-order.js'
import { bindLightboxTriggers, openLightbox } from '../lib/image-lightbox.js'
import { escapeHtml } from '../lib/escape.js'
import { pirateCardHtml } from './pirate-card.js'

const CREWLESS_HEADING = 'Lösdrivare'

export async function renderCrewCollage(el) {
  wirePirateCardGrid(el)
  await refresh(el)

  // Realtime: ny pirat eller namnändring → uppdatera.
  supabase
    .channel('crew-collage')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, () => refresh(el))
    .subscribe()
}

/** Bind portrait-error + lightbox once on a crew-collage container. */
export function wirePirateCardGrid(el) {
  el.addEventListener('error', onPortraitError, true)
  bindCardLightbox(el)
}

/** Klick på piratnamn i intrigtext → porträtt i lightbox. */
export function wirePirateNameLightbox(el) {
  if (!el || el.dataset.pirateHoverBound) return
  el.dataset.pirateHoverBound = '1'

  const openFrom = (trigger) => {
    const src = trigger.dataset.photo
    if (!src) return
    const name = trigger.dataset.pirateName || 'Porträtt'
    const big = document.createElement('img')
    big.src = src
    big.alt = name
    big.className = 'lightbox-image'
    openLightbox({ ariaLabel: name, content: big, returnFocus: trigger })
  }

  el.addEventListener('click', (e) => {
    const trigger = e.target.closest('.pirate-hover')
    if (!trigger || !el.contains(trigger)) return
    openFrom(trigger)
  })
  el.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    const trigger = e.target.closest('.pirate-hover')
    if (!trigger || !el.contains(trigger)) return
    e.preventDefault()
    openFrom(trigger)
  })
}

/** Fill a container with pirate cards (same markup as Besättningen). */
export function fillPirateCardGrid(el, guests) {
  el.innerHTML = pirateCardsHtml(guests)

  makeCardsInteractive(el)
}

function pirateCardsHtml(guests) {
  return sortByPirateNameId(guests).map((p) => pirateCardHtml({
    photoSrc: portraitPath(p.real_name),
    pirateName: p.pirate_name,
    overlaySrc: overlayForGuest({ id: p.id, pirate_name_id: p.pirate_name_id }),
  })).join('')
}

function onPortraitError(e) {
  const img = e.target
  if (!img.matches?.('.pirate-card__photo-img')) return
  const photo = img.closest('.pirate-card__photo')
  if (!photo) return
  img.remove()
  photo.insertAdjacentHTML('afterbegin', '<span class="pirate-card__placeholder" aria-hidden="true">🏴‍☠️</span>')
}

async function refresh(el) {
  const [{ data, error }, { data: crews }] = await Promise.all([
    supabase
      .from('public_guests')
      .select('id, real_name, pirate_name, pirate_name_id, crew_id')
      .not('pirate_name_id', 'is', null),
    supabase.from('crews').select('id, name').order('id'),
  ])

  if (error) {
    el.textContent = 'Kunde inte ladda besättningen.'
    return
  }

  // Grupperad vy: containern är inte längre själva kort-gridden.
  el.classList.remove('crew-collage')
  el.classList.add('crew-groups')

  const groups = groupByCrew(data ?? [], crews ?? [])

  if (!groups.length) {
    el.innerHTML = `<p class="crew-empty">Ingen har mönstrat på än.</p>`
    return
  }

  el.innerHTML = groups.map((group) => `
    <section class="crew-group">
      <h3 class="crew-group__name">${escapeHtml(group.name)}</h3>
      <div class="crew-collage">${pirateCardsHtml(group.guests)}</div>
    </section>
  `).join('')

  makeCardsInteractive(el)
}

/** Ett block per lag i lagordning. */
function groupByCrew(guests, crews) {
  const groups = crews.map((crew) => ({
    name: crew.name,
    guests: guests.filter((g) => g.crew_id === crew.id),
  }))

  const crewIds = new Set(crews.map((c) => c.id))
  const crewless = guests.filter((g) => !crewIds.has(g.crew_id))
  if (crewless.length) groups.push({ name: CREWLESS_HEADING, guests: crewless })

  return groups.filter((group) => group.guests.length)
}

function cloneCardForLightbox(card) {
  const clone = card.cloneNode(true)
  clone.removeAttribute('tabindex')
  clone.removeAttribute('role')
  clone.removeAttribute('aria-label')
  return clone
}

function cardLightboxState(card, cards, index) {
  return {
    ariaLabel: card.querySelector('.pirate-card__name')?.textContent?.trim() || 'Piratkort',
    content: cloneCardForLightbox(card),
    returnFocus: card,
    navigation: cardLightboxNavigation(cards, index),
  }
}

function cardLightboxNavigation(cards, index) {
  if (cards.length < 2) return undefined

  const makeNav = (idx) => ({
    hasPrev: idx > 0,
    hasNext: idx < cards.length - 1,
    step(delta) {
      const newCard = cards[idx + delta]
      if (!newCard) return null
      return cardLightboxState(newCard, cards, idx + delta)
    },
  })

  return makeNav(index)
}

function bindCardLightbox(el) {
  bindLightboxTriggers(el, {
    selector: '.pirate-card',
    getAriaLabel: (card) => card.querySelector('.pirate-card__name')?.textContent?.trim() || 'Piratkort',
    getContent: (card) => cloneCardForLightbox(card),
    getNavigation: (card, container) => {
      const cards = [...container.querySelectorAll('.pirate-card')]
      const index = cards.indexOf(card)
      if (index < 0) return undefined
      return cardLightboxNavigation(cards, index)
    },
    onOpen: (lightbox) => lightbox.addEventListener('error', onPortraitError, true),
  })
}

export function makeCardsInteractive(el) {
  el.querySelectorAll('.pirate-card').forEach((card) => {
    card.setAttribute('tabindex', '0')
    card.setAttribute('role', 'button')
    const name = card.querySelector('.pirate-card__name')?.textContent?.trim()
    if (name) card.setAttribute('aria-label', `Visa ${name} i fullskärm`)
  })
}
