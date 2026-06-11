// Dev-route /webgl — WebGL-port av map.js (P0: scaffold).
// Originalet (src/components/map.js) lämnas orört.

import { mountWebglMap, unmountWebglMap } from '../components/webgl-map/index.js'

export async function renderWebgl(app) {
  app.innerHTML = `
    <div class="webgl-page">
      <div id="webgl-stage"></div>
      <div class="webgl-hud">
        <div class="webgl-hud__title">Svarta Malin — WebGL</div>
        <button id="webgl-skip" class="webgl-hud__skip">Hoppa över ↷</button>
      </div>
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
