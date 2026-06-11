// Ambient-tweens — körs när reveal-timeline är klar. Spegel av animate() i
// map.js men targetar Pixi DisplayObjects istället för CSS-selektorer.

import { gsap } from 'gsap'

export function startAmbient(scene) {
  const { sprites, ourShip } = scene

  // Vi behöver behålla ursprungsskala på sprites för "+= 1.04" + yoyo att
  // funka. Pixi GSAP-tweens på .scale.x/.scale.y är OK.

  // Marching-ants körs redan via app.ticker i index.js — inget att lägga till.

  // Kraken-puls
  if (sprites.kraken) {
    gsap.to(sprites.kraken.scale, { x: 1.04, y: 1.04, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }

  // Val-drift (sakta upp-ner)
  if (sprites.whale1) {
    gsap.to(sprites.whale1, { y: sprites.whale1.y + 4, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }

  // Sjöjungfru gungar lite
  if (sprites.mermaid) {
    gsap.to(sprites.mermaid, { rotation: 0.05, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }

  // Träd-svaj
  for (const key of ['tree1', 'tree2', 'tree3']) {
    const t = sprites[key]
    if (!t) continue
    const dur = 2.4 + Math.random() * 0.6
    gsap.to(t, { rotation: 0.026, duration: dur, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }

  // By-puls
  for (let i = 0; i < 3; i++) {
    const key = `village${i + 1}`
    const v = sprites[key]
    if (!v) continue
    gsap.to(v.scale, { x: 1.03, y: 1.03, duration: 3 + i * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.5 })
  }

  // Sjömonster snurrar långsamt
  if (sprites.seaMonster) {
    gsap.to(sprites.seaMonster, { rotation: 0.07, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }

  // Bläckfisk pulserar
  if (sprites.octopus) {
    gsap.to(sprites.octopus.scale, { x: 1.05, y: 1.05, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }

  // Skull-zoom — hotfull puls
  if (sprites.skull) {
    gsap.to(sprites.skull.scale, { x: 1.08, y: 1.08, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }

  // Dekor-skepp guppar
  if (sprites.decorShip) {
    gsap.to(sprites.decorShip, { y: sprites.decorShip.y + 3, rotation: 0.035, duration: 3.6, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }

  // Stormmoln driftar sakta
  if (sprites.storm) {
    gsap.to(sprites.storm, { x: sprites.storm.x + 20, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }

  // Vagn rullar (liten gunga)
  if (sprites.wagon) {
    gsap.to(sprites.wagon, { rotation: 0.026, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }

  // Rövare lurar
  if (sprites.robbers) {
    gsap.to(sprites.robbers, { y: sprites.robbers.y - 2, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }

  // Drake-vingar fladdrar
  for (const key of ['dragon0', 'dragon1']) {
    const d = sprites[key]
    if (!d) continue
    gsap.to(d, { y: d.y - 3, duration: 1.8 + Math.random() * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }
}
