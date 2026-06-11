import { escapeHtml } from '../lib/escape.js'

const MAP_SRC = '/images/maps/ovanan.jpg'

export function ovananSectionHtml() {
  return `
    <h2>Ovanan</h2>
    <div class="ovanan-layout">
      <figure class="ovanan-map">
        <img
          src="${MAP_SRC}"
          alt="Handritad karta över ön Ovanan i Mälaren"
          width="1024"
          height="1536"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div class="ovanan-details">
        <p class="lead">Privat ö i Mälaren — vår bas under helgen.</p>
        <div class="ovanan-block">
          <h3>Boende</h3>
          <p>${escapeHtml('Stugor och sovplats på ön — mer information kommer.')}</p>
        </div>
        <div class="ovanan-block">
          <h3>Resurser</h3>
          <p>${escapeHtml('Kök, bastu, bryggor och gemensamma ytor — detaljer fylls i.')}</p>
        </div>
      </div>
    </div>
  `
}
