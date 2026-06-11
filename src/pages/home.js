import { getGuestId } from '../lib/state.js'
import { renderPracticalInfo } from '../components/practical-info.js'
import { renderCrewCollage } from '../components/crew-collage.js'
import { renderMyCrew } from '../components/my-crew.js'

export async function renderHome(app) {
  app.innerHTML = `
    <main class="home content-overlay">
      <section class="hero">
        <h1 class="hero-title">Svarta Malin</h1>
        <p class="hero-sub">— Salmonellahavets fasa —</p>
        <div class="scroll-cue">↓</div>
      </section>

      <section class="card-section">
        <div class="card">
          <h2>Besättningen</h2>
          <p class="lead">Pirater som hörsammat kallelsen.</p>
          <div class="crew-collage" id="crew-collage">Laddar besättning…</div>
        </div>
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
  renderPracticalInfo(document.getElementById('info-grid'))
  renderMyCrew(document.getElementById('my-crew'), getGuestId())
}
