// Legacy /old-sida. Använder samma content-sektioner som /webgl men med
// SVG-bakgrunden från map.js.
import { getGuestId } from '../lib/state.js'
import { renderNarrative } from '../components/narrative-section.js'
import { renderCrewCollage } from '../components/crew-collage.js'
import { renderMyCrew } from '../components/my-crew.js'

export async function renderHome(app) {
  app.innerHTML = `
    <main class="home content-overlay">
      <section class="hero">
        <img class="hero-portrait" src="/images/svarta-malin-hero.webp" alt="Svarta Malin" width="720" height="895" />
        <h1 class="hero-title">Svarta Malin</h1>
        <p class="hero-sub">Salmonellahavets fasa</p>
        <img class="scroll-cue" src="/images/map/arrow-down.png" alt="" aria-hidden="true" width="36" height="72">
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
          <figure class="practical-banner">
            <img src="/images/maps/ovanan.jpg" alt="Ovanan" />
          </figure>
          <h2>Praktiskt</h2>
          <div class="narrative-body" id="practical-body">Laddar…</div>
        </div>
      </section>

      <section class="card-section"><div class="card" id="sec-overfart">Laddar…</div></section>
      <section class="card-section"><div class="card" id="sec-party-type">Laddar…</div></section>
      <section class="card-section"><div class="card" id="sec-sova">Laddar…</div></section>
      <section class="card-section"><div class="card card--theme" id="sec-theme">Laddar…</div></section>
      <section class="card-section"><div class="card card--bidra" id="sec-bidra">Laddar…</div></section>
      <section class="card-section"><div class="card" id="sec-besattningar">Laddar…</div></section>
      <section class="card-section"><div class="card card--osa" id="sec-osa">Laddar…</div></section>

      <section class="card-section">
        <div class="card my-crew-card">
          <h2>Ditt lag</h2>
          <div class="my-crew" id="my-crew">Laddar…</div>
        </div>
      </section>

      <section class="card-section"><div class="card card--closing" id="sec-closing">Laddar…</div></section>
    </main>
  `

  renderCrewCollage(document.getElementById('crew-collage'))
  renderNarrative(document.getElementById('practical-body'),   { key: 'practical_body' })
  renderNarrative(document.getElementById('sec-overfart'),     { title: 'Överfart', key: 'overfart' })
  renderNarrative(document.getElementById('sec-party-type'),   { title: 'Vad är detta för typ av fest?', key: 'party_type' })
  renderNarrative(document.getElementById('sec-sova'),         { title: 'Sova', key: 'sova' })
  renderNarrative(document.getElementById('sec-theme'),        { title: 'Tema', key: 'theme_intro' })
  renderNarrative(document.getElementById('sec-bidra'),        { title: 'Bidra', key: 'bidra' })
  renderNarrative(document.getElementById('sec-besattningar'), { title: 'Besättningar', key: 'besattningar' })
  renderNarrative(document.getElementById('sec-osa'),          { title: 'OSA', key: 'osa' })
  renderNarrative(document.getElementById('sec-closing'),      { key: 'closing' })
  renderMyCrew(document.getElementById('my-crew'), getGuestId())
}
