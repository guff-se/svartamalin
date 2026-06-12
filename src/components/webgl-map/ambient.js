// Ambient-tweens — körs när reveal-timeline är klar. Spegel av animate() i
// map.js men targetar Pixi DisplayObjects.
//
// KRITISKT: Pixi sprite.scale är base-värdet som motsvarar "rätt storlek"
// (sätts av s.width = N i scene.js, ger scale.x = N/texture.width).
// Att GSAP-tweena scale.x → 1.04 absolut skulle bli scale.x = 1.04 vilket
// är texture-native × 1.04 (typ 1000+ px) → enormt. Måste tween till
// baseScale * faktor.

import { gsap } from 'gsap'

function pulse(sprite, factor, duration) {
  if (!sprite) return
  const bs = sprite._baseScale || { x: 1, y: 1 }
  gsap.to(sprite.scale, {
    x: bs.x * factor,
    y: bs.y * factor,
    duration,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })
}

export function startAmbient(scene) {
  const { sprites } = scene

  // Pulser (skala * faktor relativt baseScale)
  pulse(sprites.kraken,  1.04, 2.6)
  pulse(sprites.octopus, 1.05, 2.8)
  pulse(sprites.skull,   1.08, 2.0)
  for (let i = 0; i < 3; i++) {
    const v = sprites[`village${i + 1}`]
    if (v) pulse(v, 1.03, 3 + i * 0.4)
  }

  // Translate-tweens (inte scale)
  if (sprites.whale1)
    gsap.to(sprites.whale1, { y: sprites.whale1.y + 4, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  if (sprites.decorShip)
    gsap.to(sprites.decorShip, { y: sprites.decorShip.y + 3, rotation: 0.035, duration: 3.6, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  if (sprites.storm)
    gsap.to(sprites.storm, { x: sprites.storm.x + 20, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  if (sprites.robbers)
    gsap.to(sprites.robbers, { y: sprites.robbers.y - 2, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  for (const key of ['dragon0', 'dragon1']) {
    const d = sprites[key]
    if (d) gsap.to(d, { y: d.y - 3, duration: 1.8 + Math.random() * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }

  // Rotation-tweens (radianer i Pixi)
  if (sprites.mermaid)
    gsap.to(sprites.mermaid, { rotation: 0.05, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  if (sprites.seaMonster)
    gsap.to(sprites.seaMonster, { rotation: 0.07, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  if (sprites.wagon)
    gsap.to(sprites.wagon, { rotation: 0.026, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  for (const key of ['tree1', 'tree2']) {
    const t = sprites[key]
    if (!t) continue
    gsap.to(t, { rotation: 0.026, duration: 2.4 + Math.random() * 0.6, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }
  // pirate-ogre svajar inte som ett träd; egen subtil rörelse
  if (sprites.pirateOgre)
    gsap.to(sprites.pirateOgre, { y: sprites.pirateOgre.y + 2, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' })
}
