import { getGuestId } from '../lib/state.js'
import { renderOvananSection } from '../components/ovanan-section.js'
import { renderPracticalInfo } from '../components/practical-info.js'
import { renderCrewCollage } from '../components/crew-collage.js'
import { renderMyCrew } from '../components/my-crew.js'

export async function renderHome(app) {
  app.innerHTML = `
    <main class="home content-overlay">
      <section class="hero">
        <img class="hero-portrait" src="/images/portraits/malin-tadaa.jpg" alt="Svarta Malin" />
        <h1 class="hero-title">Svarta Malin</h1>
        <p class="hero-sub">— Salmonellahavets fasa —</p>
        <img class="scroll-cue" src="/images/map/arrow-down.png" alt="" aria-hidden="true" width="48" height="96">
      </section>

      <section class="card-section">
        <div class="card card--crew">
          <h2>Besättningen</h2>
          <p class="lead">Pirater som hörsammat kallelsen.</p>
          <div class="crew-collage" id="crew-collage">Laddar besättning…</div>
        </div>
      </section>

      <section class="card-section">
        <div class="card card--ovanan" id="ovanan-section">Laddar…</div>
      </section>

      <section class="card-section">
        <div class="card">
          <h2>Praktiskt</h2>
          <div class="info-grid" id="info-grid">Laddar…</div>
        </div>
      </section>

      <section class="card-section">
        <div class="card my-crew-card">
          <h2>Ditt lag</h2>
          <div class="my-crew" id="my-crew">Laddar…</div>
        </div>
      </section>
    </main>
  `

  renderCrewCollage(document.getElementById('crew-collage'))
  renderOvananSection(document.getElementById('ovanan-section'))
  renderPracticalInfo(document.getElementById('info-grid'))
  renderMyCrew(document.getElementById('my-crew'), getGuestId())
}
