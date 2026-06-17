// Huvudsidan (/) — WebGL-port av map.js.
// Legacy SVG: /old → home.js + map.js.
// Innehållet under hero är samma som home.js men med WebGL-bakgrund.

import { mountWebglMap, unmountWebglMap } from '../components/webgl-map/index.js'
import { renderNarrative } from '../components/narrative-section.js'
import { renderCrewCollage } from '../components/crew-collage.js'
import { hasGivenAnswer } from '../lib/guest.js'
import { openRsvpFlow } from '../components/rsvp-modal.js'
import { openLightbox } from '../lib/image-lightbox.js'

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
            <div id="sec-osa-top">Laddar…</div>
            <div class="row osa-actions">
              <button class="osa-respond" type="button">Lämna besked</button>
            </div>
          </div>
        </section>

        <section class="card-section">
          <div class="card card--crew">
            <h2>Besättningen</h2>
            <p class="lead">Pirater som hörsammat kallelsen.</p>
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
          </div>
        </section>

        <section class="card-section">
          <div class="card" id="sec-overfart">Laddar…</div>
        </section>

        <section class="card-section">
          <div class="card" id="sec-party-type">Laddar…</div>
        </section>

        <section class="card-section">
          <div class="card" id="sec-sova">Laddar…</div>
        </section>

        <section class="card-section">
          <div class="card card--theme" id="sec-theme">Laddar…</div>
        </section>

        <section class="card-section">
          <div class="card card--bidra" id="sec-bidra">Laddar…</div>
        </section>

        <section class="card-section">
          <div class="card" id="sec-besattningar">Laddar…</div>
        </section>

        <section class="card-section osa-section" id="osa-section" hidden>
          <div class="card card--osa">
            <div id="sec-osa">Laddar…</div>
            <div class="row osa-actions">
              <button class="osa-respond" type="button">Lämna besked</button>
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
  renderNarrative(document.getElementById('sec-overfart'),    { title: 'Överfart', key: 'overfart' })
  renderNarrative(document.getElementById('sec-party-type'),  { title: 'Vad är detta för typ av fest?', key: 'party_type' })
  renderNarrative(document.getElementById('sec-sova'),        { title: 'Sova', key: 'sova' })
  renderNarrative(document.getElementById('sec-theme'),       { title: 'Tema', key: 'theme_intro' })
  renderNarrative(document.getElementById('sec-bidra'),       { title: 'Bidra', key: 'bidra' })
  renderNarrative(document.getElementById('sec-besattningar'),{ title: 'Besättningar', key: 'besattningar' })
  renderNarrative(document.getElementById('sec-osa-top'),     { title: 'OSA', key: 'osa' })
  renderNarrative(document.getElementById('sec-osa'),         { title: 'OSA', key: 'osa' })
  renderNarrative(document.getElementById('sec-closing'),     { key: 'closing' })

  bindOvananLightbox()
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
