// Dev-route /webgl — WebGL-port av map.js (P0: scaffold).
// Originalet (src/components/map.js) lämnas orört.

import { mountWebglMap, unmountWebglMap } from '../components/webgl-map/index.js'

export async function renderWebgl(app) {
  app.innerHTML = `
    <div class="webgl-page">
      <div id="webgl-stage"></div>
      <div id="webgl-vignette"></div>
      <div class="webgl-hero" id="webgl-hero">
        <img class="hero-portrait" src="/images/portraits/malin-tadaa.jpg" alt="Svarta Malin" />
        <h1 class="hero-title">Svarta Malin</h1>
        <p class="hero-sub">— Salmonellahavets fasa —</p>
        <img class="scroll-cue" src="/images/map/arrow-down.png" alt="" aria-hidden="true" />
      </div>
      <button id="webgl-skip" class="webgl-hud__skip">Hoppa över ↷</button>
      <div class="webgl-hud__title">WebGL</div>
    </div>
  `

  // Cleanup om användaren navigerar bort (hash/history)
  const cleanup = () => {
    unmountWebglMap()
    window.removeEventListener('beforeunload', cleanup)
  }
  window.addEventListener('beforeunload', cleanup)

  await mountWebglMap(document.getElementById('webgl-stage'))
}
