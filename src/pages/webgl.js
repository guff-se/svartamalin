// Huvudsidan (/) — WebGL-port av map.js.
// Legacy SVG: /old → home.js + map.js.
// Innehållet under hero är samma som home.js men med WebGL-bakgrund.

import { mountWebglMap, unmountWebglMap } from '../components/webgl-map/index.js'
import { renderNarrative } from '../components/narrative-section.js'
import { renderCrewCollage } from '../components/crew-collage.js'
import { hasGivenAnswer } from '../lib/guest.js'
import { openRsvpFlow } from '../components/rsvp-modal.js'
import { openLightbox } from '../lib/image-lightbox.js'
import { fetchPracticalMap, formatPracticalMarkdown } from '../components/practical-info.js'
import { escapeHtml } from '../lib/escape.js'

export async function renderWebgl(app) {
  app.innerHTML = `
    <div class="webgl-page">
      <div id="webgl-stage"></div>
      <div id="webgl-vignette"></div>
      <div id="webgl-hero-tint"></div>
      <main class="home content-overlay">
        <section class="hero webgl-hero" id="webgl-hero">
          <img class="hero-portrait" src="/images/svarta-malin-hero.webp" alt="Svarta Malin" width="720" height="895" />
          <h1 class="hero-title">Svarta Malin</h1>
          <p class="hero-sub">Salmonellahavets fasa</p>
          <img class="scroll-cue" src="/images/map/arrow-down.png" alt="" aria-hidden="true" width="36" height="72" />
        </section>

        <section class="card-section">
          <div class="card card--manifest" id="sec-manifest">Laddar…</div>
        </section>

        <section class="card-section osa-section" id="osa-section-top" hidden>
          <div class="card card--osa">
            <h2>OSA</h2>
            <div class="osa-facts"></div>
            <div id="sec-osa-top">Laddar…</div>
            <div class="row osa-actions">
              <button class="osa-respond" type="button">Mönstra på</button>
            </div>
          </div>
        </section>

        <section class="card-section">
          <div class="card card--crew">
            <h2>Besättningen</h2>
            <div class="crew-collage" id="crew-collage">Laddar besättning…</div>
          </div>
        </section>

        <section class="card-section">
          <div class="card card--practical" id="sec-practical">
            <h2>Praktiskt</h2>
            <div class="practical-layout">
              <figure class="practical-img">
                <img src="/images/maps/ovanan.jpg" alt="Ovanan" />
              </figure>
              <div class="narrative-body" id="practical-body">Laddar…</div>
            </div>
            <div class="practical-sub">
              <h3>Överfart</h3>
              <div id="practical-overfart">Laddar…</div>
            </div>
            <div class="practical-sub">
              <h3>Sova</h3>
              <div id="practical-sova">Laddar…</div>
            </div>
          </div>
        </section>

        <section class="card-section">
          <div class="card card--theme" id="sec-party-type">
            <div id="party-type-body">Laddar…</div>
            <div class="practical-sub">
              <h3>Tema</h3>
              <div class="theme-layout">
                <figure class="theme-img">
                  <img src="/images/theatre-props-pile.webp" alt="" />
                </figure>
                <div id="party-theme">Laddar…</div>
              </div>
              <div class="theme-columns" id="theme-columns"></div>
            </div>
          </div>
        </section>

        <section class="card-section">
          <div class="card card--bidra" id="sec-bidra">Laddar…</div>
        </section>

        <section class="card-section">
          <div class="card" id="sec-besattningar">Laddar…</div>
        </section>

        <section class="card-section osa-section" id="osa-section" hidden>
          <div class="card card--osa">
            <h2>OSA</h2>
            <div class="osa-facts"></div>
            <div id="sec-osa">Laddar…</div>
            <div class="row osa-actions">
              <button class="osa-respond" type="button">Mönstra på</button>
            </div>
          </div>
        </section>

        <section class="card-section">
          <div class="card card--closing" id="sec-closing">Laddar…</div>
        </section>
      </main>
      <button id="webgl-skip" class="webgl-hud__skip">Hoppa över ↷</button>
    </div>
  `

  // Cleanup om användaren navigerar bort
  const cleanup = () => {
    unmountWebglMap()
    window.removeEventListener('beforeunload', cleanup)
  }
  window.addEventListener('beforeunload', cleanup)

  // Mount WebGL-bakgrunden parallellt med content (content kräver inte Pixi)
  // Behöver INTE await — kontent under hero renderas parallellt med Pixi:s
  // setup. hideLoading kallas inifrån mountWebglMap när scenen är redo.
  mountWebglMap(document.getElementById('webgl-stage'))

  // Rendera resten av sidan
  renderNarrative(document.getElementById('sec-manifest'),    { key: 'manifest' })
  renderCrewCollage(document.getElementById('crew-collage'))
  renderNarrative(document.getElementById('practical-body'),  { key: 'practical_body' })
  renderNarrative(document.getElementById('practical-overfart'), { key: 'overfart' })
  renderNarrative(document.getElementById('practical-sova'),     { key: 'sova' })
  renderNarrative(document.getElementById('party-type-body'), { title: 'Vad är detta för typ av fest?', key: 'party_type' })
  renderNarrative(document.getElementById('party-theme'),     { key: 'theme_intro' })
  renderThemeColumns(document.getElementById('theme-columns'))
  renderNarrative(document.getElementById('sec-bidra'),       { title: 'Bidra', key: 'bidra' })
  renderNarrative(document.getElementById('sec-besattningar'),{ title: 'Besättningar', key: 'besattningar' })
  renderNarrative(document.getElementById('sec-osa-top'),     { key: 'osa' })
  renderNarrative(document.getElementById('sec-osa'),         { key: 'osa' })
  renderNarrative(document.getElementById('sec-closing'),     { key: 'closing' })

  bindOvananLightbox()
  renderOsaFacts()
  await refreshAnswerState()
  document.querySelectorAll('.osa-respond').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await openRsvpFlow()
      refreshAnswerState()
    })
  })
}

async function refreshAnswerState() {
  const answered = await hasGivenAnswer()
  document.querySelectorAll('.osa-section').forEach((s) => { s.hidden = answered })
  const infoBtn = document.getElementById('info-btn')
  if (infoBtn) infoBtn.hidden = !answered
}

async function renderThemeColumns(el) {
  if (!el) return
  const { map } = await fetchPracticalMap()
  const col = (raw, variant) => {
    if (!raw) return ''
    const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean)
    const header = lines[0]
    const items = lines.slice(1)
      .filter((l) => l.startsWith('* ') || l.startsWith('- '))
      .map((l) => l.slice(2).trim())
    const headerHtml = `<h4 class="theme-col__title">${formatPracticalMarkdown(header)}</h4>`
    const list = items.length
      ? `<ul class="theme-list theme-list--${variant}">${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`
      : ''
    return `<div class="theme-col theme-col--${variant}">${headerHtml}${list}</div>`
  }
  el.innerHTML = col(map?.theme_doesnt_fit, 'minus') + col(map?.theme_fits, 'plus')
}

async function renderOsaFacts() {
  const { map } = await fetchPracticalMap()
  const facts = [
    ['Datum', map?.dates],
    ['Tid', map?.boat_friday],
    ['Plats', map?.location],
  ].filter(([, v]) => v)
  if (!facts.length) return
  const html = `
    <dl class="rsvp-facts">
      ${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${formatPracticalMarkdown(v)}</dd></div>`).join('')}
    </dl>
  `
  document.querySelectorAll('.osa-facts').forEach((el) => { el.innerHTML = html })
}

function bindOvananLightbox() {
  const fig = document.querySelector('.practical-img')
  if (!fig) return
  const img = fig.querySelector('img')
  if (!img) return
  fig.setAttribute('role', 'button')
  fig.setAttribute('tabindex', '0')
  fig.setAttribute('aria-label', 'Visa Ovanan-kartan i fullskärm')
  fig.style.cursor = 'pointer'
  const open = () => {
    const big = document.createElement('img')
    big.src = img.src
    big.alt = img.alt
    big.className = 'lightbox-image'
    openLightbox({ ariaLabel: img.alt || 'Ovanan', content: big, returnFocus: fig })
  }
  fig.addEventListener('click', open)
  fig.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() }
  })
}
