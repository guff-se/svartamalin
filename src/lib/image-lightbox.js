let lightboxEl = null
let lightboxReturnFocus = null
/** @type {{ hasPrev: boolean, hasNext: boolean, step: (delta: -1 | 1) => LightboxState | null } | null} */
let lightboxNavigation = null
/** @type {((el: HTMLElement) => void) | undefined} */
let lightboxOnMount = undefined

/**
 * @typedef {{ ariaLabel: string, content: Node, returnFocus?: HTMLElement, navigation?: { hasPrev: boolean, hasNext: boolean, step: (delta: -1 | 1) => LightboxState | null } }} LightboxState
 */

/**
 * @param {LightboxState & { onMount?: (el: HTMLElement) => void }} opts
 */
export function openLightbox({ ariaLabel, content, returnFocus, navigation, onMount }) {
  closeLightbox()

  lightboxReturnFocus = returnFocus ?? null
  lightboxNavigation = navigation ?? null
  lightboxOnMount = onMount

  lightboxEl = document.createElement('div')
  lightboxEl.className = 'pirate-card-lightbox'
  lightboxEl.setAttribute('role', 'dialog')
  lightboxEl.setAttribute('aria-modal', 'true')
  lightboxEl.innerHTML = `
    <button type="button" class="pirate-card-lightbox__close" aria-label="Stäng">×</button>
    ${navigation ? `
      <button type="button" class="pirate-card-lightbox__nav pirate-card-lightbox__nav--prev" aria-label="Föregående">‹</button>
      <button type="button" class="pirate-card-lightbox__nav pirate-card-lightbox__nav--next" aria-label="Nästa">›</button>
    ` : ''}
    <div class="pirate-card-lightbox__backdrop"></div>
    <div class="pirate-card-lightbox__card"></div>
  `
  lightboxEl.addEventListener('click', onLightboxClick)
  document.addEventListener('keydown', onLightboxKeydown)

  applyLightboxState({ ariaLabel, content, returnFocus, navigation })
  mountLightbox()
}

function mountLightbox() {
  if (!lightboxEl) return
  if (lightboxOnMount) lightboxOnMount(lightboxEl)
  document.body.appendChild(lightboxEl)
  document.body.classList.add('pirate-card-lightbox-open')
  lightboxEl.querySelector('.pirate-card-lightbox__close').focus()
}

/**
 * @param {LightboxState} state
 */
function applyLightboxState({ ariaLabel, content, returnFocus, navigation }) {
  if (!lightboxEl) return

  lightboxReturnFocus = returnFocus ?? lightboxReturnFocus
  lightboxNavigation = navigation ?? null
  lightboxEl.setAttribute('aria-label', ariaLabel)

  const cardSlot = lightboxEl.querySelector('.pirate-card-lightbox__card')
  cardSlot.replaceChildren(content)

  const prevBtn = lightboxEl.querySelector('.pirate-card-lightbox__nav--prev')
  const nextBtn = lightboxEl.querySelector('.pirate-card-lightbox__nav--next')
  if (prevBtn) {
    prevBtn.disabled = !navigation?.hasPrev
    prevBtn.hidden = !navigation
  }
  if (nextBtn) {
    nextBtn.disabled = !navigation?.hasNext
    nextBtn.hidden = !navigation
  }
}

function stepLightbox(delta) {
  if (!lightboxNavigation || !lightboxEl) return
  if (delta === -1 && !lightboxNavigation.hasPrev) return
  if (delta === 1 && !lightboxNavigation.hasNext) return

  const next = lightboxNavigation.step(delta)
  if (!next) return

  applyLightboxState(next)
}

export function closeLightbox() {
  if (!lightboxEl) return

  lightboxEl.removeEventListener('click', onLightboxClick)
  document.removeEventListener('keydown', onLightboxKeydown)
  lightboxEl.remove()
  lightboxEl = null
  lightboxNavigation = null
  lightboxOnMount = undefined
  document.body.classList.remove('pirate-card-lightbox-open')

  if (lightboxReturnFocus?.isConnected) lightboxReturnFocus.focus()
  lightboxReturnFocus = null
}

function onLightboxClick(e) {
  if (e.target.closest('.pirate-card-lightbox__nav--prev')) {
    e.preventDefault()
    stepLightbox(-1)
    return
  }
  if (e.target.closest('.pirate-card-lightbox__nav--next')) {
    e.preventDefault()
    stepLightbox(1)
    return
  }
  if (
    e.target.classList.contains('pirate-card-lightbox__backdrop') ||
    e.target.closest('.pirate-card-lightbox__close')
  ) {
    closeLightbox()
  }
}

function onLightboxKeydown(e) {
  if (e.key === 'Escape') {
    closeLightbox()
    return
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    stepLightbox(-1)
    return
  }
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    stepLightbox(1)
  }
}

/**
 * @param {HTMLElement} container
 * @param {{ selector: string, getAriaLabel: (trigger: HTMLElement) => string, getContent: (trigger: HTMLElement) => Node, getNavigation?: (trigger: HTMLElement, container: HTMLElement) => LightboxState['navigation'], onOpen?: (lightbox: HTMLElement) => void }} opts
 */
export function bindLightboxTriggers(container, { selector, getAriaLabel, getContent, getNavigation, onOpen }) {
  if (container.dataset.lightboxBound) return
  container.dataset.lightboxBound = '1'

  const openFrom = (trigger) => {
    openLightbox({
      ariaLabel: getAriaLabel(trigger),
      content: getContent(trigger),
      returnFocus: trigger,
      navigation: getNavigation?.(trigger, container),
      onMount: onOpen,
    })
  }

  container.addEventListener('click', (e) => {
    const trigger = e.target.closest(selector)
    if (!trigger || !container.contains(trigger)) return
    openFrom(trigger)
  })

  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    const trigger = e.target.closest(selector)
    if (!trigger || !container.contains(trigger)) return
    e.preventDefault()
    openFrom(trigger)
  })
}
