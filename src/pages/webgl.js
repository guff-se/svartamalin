// Huvudsidan (/) — WebGL-port av map.js.
// Legacy SVG: /old → home.js + map.js.
// Innehållet under hero är samma som home.js men med WebGL-bakgrund.

import { mountWebglMap, unmountWebglMap } from '../components/webgl-map/index.js'
import { renderNarrative } from '../components/narrative-section.js'
import { renderCrewCollage } from '../components/crew-collage.js'
import { renderCrewIntriger } from '../components/crew-intriger.js'
import { renderMyIntriger } from '../components/my-intriger.js'
import { renderMySleeping } from '../components/my-sleeping.js'
import { bindPrintIntriger } from '../components/print-intriger.js'
import { hasGivenAnswer } from '../lib/guest.js'
import { openRsvpFlow } from '../components/rsvp-modal.js'
import { openLightbox } from '../lib/image-lightbox.js'
import { fetchPracticalMap, formatPracticalMarkdown } from '../components/practical-info.js'

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

        <section class="card-section js-print-block">
          <div class="print-anchor">
            <button type="button" class="print-intriger-btn" id="print-intriger-btn">Skriv ut</button>
            <div class="card card--intriger card--world" id="intriger-intro">Laddar…</div>
          </div>
        </section>

        <section class="card-section js-print-block" id="crew-intriger-section">
          <div class="card card--intriger card--crew-intriger card--my-crew" id="crew-intriger">Laddar…</div>
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

        <section class="card-section js-print-block" id="my-intriger-section" hidden>
          <div class="card card--intriger" id="my-intriger"></div>
        </section>

        <section class="card-section">
          <div class="card card--manifest" id="sec-manifest">
            <div id="manifest-intro">Laddar…</div>
            <div class="manifest-block">
              <figure class="manifest-img">
                <img src="/images/theatre-props-feast.webp" alt="" width="640" height="960" />
              </figure>
              <div class="manifest-body" id="manifest-friday">Laddar…</div>
            </div>
            <div class="manifest-block manifest-block--flip">
              <figure class="manifest-img">
                <img src="/images/theatre-props-betrayal.webp" alt="" width="640" height="960" />
              </figure>
              <div class="manifest-body" id="manifest-saturday">Laddar…</div>
            </div>
            <div class="manifest-block">
              <figure class="manifest-img">
                <img src="/images/theatre-props-duel.webp" alt="" width="640" height="960" />
              </figure>
              <div class="manifest-body" id="manifest-play">Laddar…</div>
            </div>
            <div class="manifest-block manifest-block--flip">
              <figure class="manifest-img">
                <img src="/images/theatre-props-treasure.webp" alt="" width="640" height="960" />
              </figure>
              <div class="manifest-body" id="manifest-prep">Laddar…</div>
            </div>
          </div>
        </section>

        <section class="card-section">
          <div class="card card--practical" id="sec-practical">
            <h2>Praktiskt</h2>
            <div class="narrative-body" id="practical-body">Laddar…</div>
            <div class="practical-layout">
              <figure class="practical-img">
                <img src="/images/maps/ovanan-siffror.jpg" alt="Ovanan" />
              </figure>
              <div class="narrative-body" id="practical-ovanan">Laddar…</div>
            </div>
            <div class="practical-sub">
              <div id="practical-mat-sova">Laddar…</div>
            </div>
            <div class="practical-sub" hidden>
              <div id="my-sleeping"></div>
            </div>
            <div class="practical-sub">
              <div id="practical-packing">Laddar…</div>
            </div>
            <div class="practical-sub">
              <div id="practical-bidra">Laddar…</div>
            </div>
          </div>
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
          <div class="card card--crew">
            <h2>De värsta kaptener som finns</h2>
            <div class="crew-collage" id="crew-collage">Laddar besättning…</div>
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
  renderNarrative(document.getElementById('manifest-intro'),    { key: 'manifest' })
  renderNarrative(document.getElementById('manifest-friday'),   { key: 'manifest_friday' })
  renderNarrative(document.getElementById('manifest-saturday'), { key: 'manifest_saturday' })
  renderNarrative(document.getElementById('manifest-play'),     { key: 'manifest_play' })
  renderNarrative(document.getElementById('manifest-prep'),     { key: 'manifest_prep' })
  renderNarrative(document.getElementById('intriger-intro'), { key: 'intriger_intro' })
  renderCrewIntriger(document.getElementById('crew-intriger'))
  renderMyIntriger(document.getElementById('my-intriger'))
  bindPrintIntriger()
  renderCrewCollage(document.getElementById('crew-collage'))
  renderNarrative(document.getElementById('practical-body'),  { key: 'practical_body' })
  renderNarrative(document.getElementById('practical-ovanan'), { key: 'ovanan' })
  renderNarrative(document.getElementById('practical-mat-sova'), { key: 'mat-sova' })
  renderMySleeping(document.getElementById('my-sleeping'))
  renderNarrative(document.getElementById('practical-packing'),  { key: 'packing' })
  renderNarrative(document.getElementById('practical-bidra'),    { key: 'bidra' })
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
      renderCrewIntriger(document.getElementById('crew-intriger'))
      renderMyIntriger(document.getElementById('my-intriger'))
    })
  })
}

async function refreshAnswerState() {
  const answered = await hasGivenAnswer()
  document.querySelectorAll('.osa-section').forEach((s) => { s.hidden = answered })
  const infoBtn = document.getElementById('info-btn')
  if (infoBtn) infoBtn.hidden = !answered
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
