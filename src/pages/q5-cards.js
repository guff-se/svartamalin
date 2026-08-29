import { supabase } from '../lib/supabase.js'
import { portraitPath } from '../lib/portraits.js'
import { GUEST_REAL_NAMES } from '../lib/guest-real-names.js'
import { overlayForGuest } from '../lib/card-frame-assignments.js'
import { CARD_OVERLAYS, pirateCardHtml, overlayForId, frameIdFromOverlay } from '../components/pirate-card.js'
import { escapeHtml } from '../lib/escape.js'
import { Q5_WALL, Q5_CREWS, Q5_COLS, Q5_PER_PAGE } from '../lib/q5-wall.js'
import '../styles/q5-cards.css'

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

/** Mirror each row so duplex (long-edge) backs line up. */
function mirrorSheet(cards) {
  const rows = chunk(cards, Q5_COLS)
  return rows.flatMap((row) => {
    const padded = [...row]
    while (padded.length < Q5_COLS) padded.push(null)
    return padded.reverse()
  })
}

function backCardHtml({ overlaySrc, letter, pirateName }) {
  const name = escapeHtml(pirateName)
  const frameId = frameIdFromOverlay(overlaySrc)
  const letterMark = letter
    ? `<span class="q5-letter">${escapeHtml(letter)}</span>`
    : ''
  return `
    <article class="pirate-card pirate-card--frame${frameId} q5-card-back">
      <div class="pirate-card__inner">
        <div class="pirate-card__photo q5-card-back__face">${letterMark}</div>
        <img class="pirate-card__overlay" src="${escapeHtml(overlaySrc).replace(/`/g, '&#96;')}" alt="" aria-hidden="true" decoding="async" />
        <div class="pirate-card__label">
          <span class="pirate-card__name">${name}</span>
        </div>
      </div>
    </article>
  `
}

function slotHtml(cardHtml, { letter, n } = {}) {
  const badge = letter
    ? `<span class="q5-slot__badge">${escapeHtml(letter)}</span>`
    : ''
  const num = n != null ? `<span class="q5-slot__n">${n}</span>` : ''
  return `<div class="q5-slot">${num}${badge}${cardHtml}</div>`
}

function emptySlot() {
  return `<div class="q5-slot q5-slot--empty"></div>`
}

async function loadGuests() {
  const slugs = Q5_WALL.map((c) => c.slug)
  const { data, error } = await supabase
    .from('guests')
    .select('id, login_slug, real_name, pirate_name_id')
    .in('login_slug', slugs)

  if (error) console.warn('Q-5 kort: kunde inte hämta gäster', error)
  const bySlug = new Map((data ?? []).map((g) => [g.login_slug, g]))

  return Q5_WALL.map((row, i) => {
    const guest = bySlug.get(row.slug)
    const realName = guest?.real_name || GUEST_REAL_NAMES[row.slug] || row.slug
    const overlaySrc = guest
      ? overlayForGuest({ id: guest.id, pirate_name_id: guest.pirate_name_id ?? row.pirateNameId })
      : overlayForId(row.pirateNameId)
    return {
      ...row,
      n: i + 1,
      realName,
      overlaySrc,
      photoSrc: portraitPath(realName),
    }
  })
}

function sheetsHtml(pages, kind) {
  return pages.map((page, pageI) => {
    const slots = page.map((card) => {
      if (!card) return emptySlot()
      const html = kind === 'front'
        ? pirateCardHtml({
          photoSrc: card.photoSrc,
          pirateName: card.pirateName,
          overlaySrc: card.overlaySrc,
        })
        : backCardHtml(card)
      return slotHtml(html, { letter: kind === 'front' ? card.letter : '', n: card.n })
    }).join('')
    const label = kind === 'front' ? 'Framsidor' : 'Baksidor'
    return `
      <section class="q5-sheet q5-sheet--${kind}">
        <p class="q5-sheet__label">${label} ${pageI + 1}/${pages.length}</p>
        <div class="q5-sheet__grid">${slots}</div>
      </section>
    `
  }).join('')
}

function hangHtml(cards) {
  const groups = [1, 2, 3, 4, 5].map((crewId) => {
    const members = cards.filter((c) => c.crewId === crewId)
    const items = members.map((c) => {
      const letter = c.letter ? `<strong>${escapeHtml(c.letter)}</strong>` : '<span class="q5-hang__empty">tom</span>'
      return `<li>${escapeHtml(c.pirateName)} <span class="q5-hang__letter">${letter}</span></li>`
    }).join('')
    return `
      <section class="q5-hang__crew">
        <h2>${escapeHtml(Q5_CREWS[crewId])}</h2>
        <ol>${items}</ol>
      </section>
    `
  }).join('')

  return `
    <section class="q5-hang">
      <h1>Hängordning — efter skuta</h1>
      <p>Klipp ut korten, vänd bokstäverna inåt mot väggen. Gruppera per skuta. Inte sångordning.</p>
      <div class="q5-hang__grid">${groups}</div>
    </section>
  `
}

function galleryHtml(cards) {
  return cards.map((card) => {
    const html = pirateCardHtml({
      photoSrc: card.photoSrc,
      pirateName: card.pirateName,
      overlaySrc: card.overlaySrc,
    })
    return `
      <figure class="q5-gallery__item">
        ${html}
        <figcaption>
          ${card.n}. ${escapeHtml(Q5_CREWS[card.crewId])}
          ${card.letter ? ` · baksida <strong>${escapeHtml(card.letter)}</strong>` : ' · tom baksida'}
          ${card.slug === 'amaliawahlstrom' ? ' · obesatt' : ''}
        </figcaption>
      </figure>
    `
  }).join('')
}

async function waitForPrintAssets(root) {
  await document.fonts.ready
  const imgs = [...root.querySelectorAll('img')]
  await Promise.all(imgs.map((img) => (img.decode ? img.decode() : Promise.resolve()).catch(() => {})))
}

function printMode(mode) {
  const body = document.body
  const onAfter = () => {
    body.removeAttribute('data-print')
    window.removeEventListener('afterprint', onAfter)
  }
  window.addEventListener('afterprint', onAfter)
  body.setAttribute('data-print', mode)
  window.print()
}

export async function renderQ5Cards(app) {
  document.body.classList.add('q5-cards-page')
  document.body.classList.remove('locked', 'revealing')
  document.getElementById('loading-screen')?.setAttribute('hidden', '')
  document.getElementById('top-controls')?.setAttribute('hidden', '')

  app.innerHTML = `
    <main class="q5-cards">
      <p class="q5-cards__loading">Laddar 24 piratkort…</p>
    </main>
  `

  const cards = await loadGuests()
  const frontPages = chunk(cards, Q5_PER_PAGE).map((page) => {
    const padded = [...page]
    while (padded.length < Q5_PER_PAGE) padded.push(null)
    return padded
  })
  const backPages = frontPages.map((page) => mirrorSheet(page))

  const overlaysOk = cards.every((c) => CARD_OVERLAYS.includes(c.overlaySrc))

  app.innerHTML = `
    <main class="q5-cards">
      <header class="q5-cards__header q5-screen-only">
        <div>
          <h1>Q-5 piratkort</h1>
          <p class="q5-cards__hint">
            24 kort, fyra per A4 (90×126&nbsp;mm). Skriv ut framsidor i färg, vänd pappret längs långsidan, skriv ut baksidor.
            Dubbelsidigt: långsida (long-edge). Klipp längs kortkanten. Häng efter skuta, bokstäverna mot väggen.
            ${overlaysOk ? '' : 'Varning: någon ram saknas.'}
          </p>
        </div>
        <div class="q5-cards__actions">
          <button type="button" class="q5-btn" data-print="fronts">Skriv ut framsidor</button>
          <button type="button" class="q5-btn" data-print="backs">Skriv ut baksidor</button>
          <button type="button" class="q5-btn q5-btn--ghost" data-print="hang">Skriv ut hängordning</button>
        </div>
      </header>

      <p class="q5-cards__facit q5-screen-only">Facit baksidor 1–16 i sångordning: I SVÄRDFISKENS MUN</p>

      <section class="q5-gallery q5-screen-only">
        ${galleryHtml(cards)}
      </section>

      <div class="q5-print q5-print--fronts">
        ${sheetsHtml(frontPages, 'front')}
      </div>
      <div class="q5-print q5-print--backs">
        ${sheetsHtml(backPages, 'back')}
      </div>
      <div class="q5-print q5-print--hang">
        ${hangHtml(cards)}
      </div>
    </main>
  `

  const root = app.querySelector('.q5-cards')
  root.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-print]')
    if (!btn) return
    btn.disabled = true
    await waitForPrintAssets(root)
    printMode(btn.dataset.print)
    btn.disabled = false
  })

  window.addEventListener('beforeprint', () => {
    if (!document.body.getAttribute('data-print')) {
      document.body.setAttribute('data-print', 'fronts')
    }
  })
}
