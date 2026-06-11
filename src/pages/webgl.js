// Huvudsidan (/) — WebGL-port av map.js.
// Legacy SVG: /old → home.js + map.js.
// Innehållet under hero är samma som home.js men med WebGL-bakgrund.

import { getGuestId } from '../lib/state.js'
import { mountWebglMap, unmountWebglMap } from '../components/webgl-map/index.js'
import { renderOvananSection } from '../components/ovanan-section.js'
import { renderPracticalInfo } from '../components/practical-info.js'
import { renderThemeSection } from '../components/theme-section.js'
import { renderCrewCollage } from '../components/crew-collage.js'
import { renderMyCrew } from '../components/my-crew.js'

export async function renderWebgl(app) {
  app.innerHTML = `
    <div class="webgl-page">
      <div id="webgl-stage"></div>
      <div id="webgl-vignette"></div>
      <div id="webgl-hero-tint"></div>
      <main class="home content-overlay">
        <section class="hero webgl-hero" id="webgl-hero">
          <img class="hero-portrait" src="/images/portraits/malin-tadaa.jpg" alt="Svarta Malin" />
          <h1 class="hero-title">Svarta Malin</h1>
          <p class="hero-sub">— Salmonellahavets fasa —</p>
          <img class="scroll-cue" src="/images/map/arrow-down.png" alt="" aria-hidden="true" />
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
          <div class="card card--theme" id="theme-section">Laddar…</div>
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
      <button id="webgl-skip" class="webgl-hud__skip">Hoppa över ↷</button>
      <div class="webgl-hud__title">WebGL</div>
    </div>
  `

  // Cleanup om användaren navigerar bort
  const cleanup = () => {
    unmountWebglMap()
    window.removeEventListener('beforeunload', cleanup)
  }
  window.addEventListener('beforeunload', cleanup)

  // Mount WebGL-bakgrunden parallellt med content (content kräver inte Pixi)
  mountWebglMap(document.getElementById('webgl-stage'))

  // Rendera resten av sidan (samma som home.js)
  renderCrewCollage(document.getElementById('crew-collage'))
  renderOvananSection(document.getElementById('ovanan-section'))
  renderThemeSection(document.getElementById('theme-section'))
  renderPracticalInfo(document.getElementById('info-grid'))
  renderMyCrew(document.getElementById('my-crew'), getGuestId())
}
