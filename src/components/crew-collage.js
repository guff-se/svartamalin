import { supabase } from '../lib/supabase.js'
import { portraitPath } from '../lib/portraits.js'
import { overlayForId, pirateCardHtml } from './pirate-card.js'

let lightboxEl = null
let lightboxReturnFocus = null

export async function renderCrewCollage(el) {
  el.addEventListener('error', onPortraitError, true)
  bindCardLightbox(el)
  await refresh(el)

  // Realtime: ny pirat eller namnändring → uppdatera.
  supabase
    .channel('crew-collage')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, () => refresh(el))
    .subscribe()
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
  const { data, error } = await supabase
    .from('public_guests')
    .select('id, real_name, pirate_name, pirate_name_id')
    .not('pirate_name_id', 'is', null)
    .order('pirate_name_id')

  if (error) {
    el.textContent = 'Kunde inte ladda besättningen.'
    return
  }

  if (!data || data.length === 0) {
    el.innerHTML = `<p class="crew-empty">Ingen har mönstrat på än.</p>`
    return
  }

  el.innerHTML = data.map((p) => pirateCardHtml({
    photoSrc: portraitPath(p.real_name),
    pirateName: p.pirate_name,
    overlaySrc: overlayForId(p.pirate_name_id),
  })).join('')

  makeCardsInteractive(el)
}

function bindCardLightbox(el) {
  if (el.dataset.lightboxBound) return
  el.dataset.lightboxBound = '1'

  el.addEventListener('click', (e) => {
    const card = e.target.closest('.pirate-card')
    if (!card || !el.contains(card)) return
    openCardLightbox(card)
  })

  el.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    const card = e.target.closest('.pirate-card')
    if (!card || !el.contains(card)) return
    e.preventDefault()
    openCardLightbox(card)
  })
}

function makeCardsInteractive(el) {
  el.querySelectorAll('.pirate-card').forEach((card) => {
    card.setAttribute('tabindex', '0')
    card.setAttribute('role', 'button')
    const name = card.querySelector('.pirate-card__name')?.textContent?.trim()
    if (name) card.setAttribute('aria-label', `Visa ${name} i fullskärm`)
  })
}

function openCardLightbox(cardEl) {
  closeCardLightbox()

  const name = cardEl.querySelector('.pirate-card__name')?.textContent?.trim() || 'Piratkort'
  const clone = cardEl.cloneNode(true)
  clone.removeAttribute('tabindex')
  clone.removeAttribute('role')
  clone.removeAttribute('aria-label')

  lightboxReturnFocus = cardEl
  lightboxEl = document.createElement('div')
  lightboxEl.className = 'pirate-card-lightbox'
  lightboxEl.setAttribute('role', 'dialog')
  lightboxEl.setAttribute('aria-modal', 'true')
  lightboxEl.setAttribute('aria-label', name)
  lightboxEl.innerHTML = `
    <button type="button" class="pirate-card-lightbox__close" aria-label="Stäng">×</button>
    <div class="pirate-card-lightbox__backdrop"></div>
    <div class="pirate-card-lightbox__card"></div>
  `
  lightboxEl.querySelector('.pirate-card-lightbox__card').appendChild(clone)
  lightboxEl.addEventListener('error', onPortraitError, true)
  lightboxEl.addEventListener('click', onLightboxClick)
  document.addEventListener('keydown', onLightboxKeydown)

  document.body.appendChild(lightboxEl)
  document.body.classList.add('pirate-card-lightbox-open')
  lightboxEl.querySelector('.pirate-card-lightbox__close').focus()
}

function closeCardLightbox() {
  if (!lightboxEl) return

  lightboxEl.removeEventListener('click', onLightboxClick)
  document.removeEventListener('keydown', onLightboxKeydown)
  lightboxEl.remove()
  lightboxEl = null
  document.body.classList.remove('pirate-card-lightbox-open')

  if (lightboxReturnFocus?.isConnected) lightboxReturnFocus.focus()
  lightboxReturnFocus = null
}

function onLightboxClick(e) {
  if (
    e.target.classList.contains('pirate-card-lightbox__backdrop') ||
    e.target.closest('.pirate-card-lightbox__close')
  ) {
    closeCardLightbox()
  }
}

function onLightboxKeydown(e) {
  if (e.key === 'Escape') closeCardLightbox()
}

