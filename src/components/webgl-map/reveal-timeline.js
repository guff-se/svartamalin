// Reveal-timeline för WebGL-versionen. Port av runReveal() i map.js,
// men targetar Pixi DisplayObjects istället för DOM-element.
//
// Timing ska speglas manuellt om map.js ändras — se AGENTS.md § Reveal-timing.

import { gsap } from 'gsap'

const VIEW_W = 1600

// Hjälpare: hitta point längs en polyline vid given arc-längd
function sampleAt(poly, cumLen, target) {
  if (target <= 0) return [poly[0][0], poly[0][1]]
  const total = cumLen[cumLen.length - 1]
  if (target >= total) return [poly[poly.length - 1][0], poly[poly.length - 1][1]]
  // Linjär sökning (drivPath ~880 punkter, boatPath 120 — snabbt nog)
  for (let i = 1; i < cumLen.length; i++) {
    if (cumLen[i] >= target) {
      const t = (target - cumLen[i - 1]) / (cumLen[i] - cumLen[i - 1])
      return [
        poly[i - 1][0] + (poly[i][0] - poly[i - 1][0]) * t,
        poly[i - 1][1] + (poly[i][1] - poly[i - 1][1]) * t,
      ]
    }
  }
  return [poly[poly.length - 1][0], poly[poly.length - 1][1]]
}

function cumLengths(poly) {
  const out = new Float32Array(poly.length)
  let acc = 0
  for (let i = 1; i < poly.length; i++) {
    acc += Math.hypot(poly[i][0] - poly[i-1][0], poly[i][1] - poly[i-1][1])
    out[i] = acc
  }
  return out
}

function tangentAt(poly, cumLen, len) {
  // Returnera vinkel i grader (atan2 av nästa-minus-föregående punkt)
  const total = cumLen[cumLen.length - 1]
  const a = sampleAt(poly, cumLen, Math.max(0, len - 0.5))
  const b = sampleAt(poly, cumLen, Math.min(total, len + 0.5))
  return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI
}

function normAngle(a) {
  while (a > 180) a -= 360
  while (a < -180) a += 360
  return a
}

/**
 * Bygg en paused GSAP-timeline för reveal-animationen.
 * @param {object} scene från buildScene()
 * @param {Camera} camera
 * @param {TiltStage} tiltStage
 */
export function buildRevealTimeline(scene, camera, tiltStage) {
  const { sprites, journey, routes, harborMarker, ourShip, ovananMap, xMarks, seaLabel } = scene
  const { sx, sy, hx, hy, ox, oy, camDrivePoly, boatPoly } = journey
  const viewH = scene.proj.viewH

  // Mobil-detektion (används för tilt-dämpning + utzoomad-mult)
  const isMobile = window.matchMedia('(max-width: 720px), (max-aspect-ratio: 3/4)').matches
  // 20% mer utzoomad på mobil — cam.w/h-multiplier på alla zoom-värden
  const M = isMobile ? 1.2 : 1.0

  // Aspect-ratio för inzoom
  const ASPECT = VIEW_W / viewH
  const ZOOM_W = VIEW_W * 0.56 * M
  const ZOOM_H = ZOOM_W / ASPECT

  // Slutposition — något västerut från originalet 17.765, 10% mer utzoomad,
  // lite söderut (lägre lat = längre ner på skärmen).
  const [endFx, endFy] = scene.proj.project([17.8, 59.280])
  const END_ZOOM = 0.865 * 1.1 * M

  // Cumulativa längder för path-sampling (smooth Catmull-Rom path, inte
  // den jagged OSRM-polylinen — annars rycker kameran vid varje hörn)
  const driveCum = cumLengths(camDrivePoly)
  const driveTotal = driveCum[driveCum.length - 1]
  const boatCum = cumLengths(boatPoly)
  const boatTotal = boatCum[boatCum.length - 1]

  // Camera helpers
  const rotFromTangent = (deg) => -90 - deg
  const ROAD_FOLLOW = 0.5
  const blendRot = (deg) => normAngle(rotFromTangent(deg)) * ROAD_FOLLOW

  // Mobil-tilt
  const tiltTarget = isMobile ? 22 : 50

  // Initial state: dölj alla decorations som ska reveal:as, sätt cam på Stockholm
  const allRevealable = [
    sprites.wagon, sprites.pirateOgre, sprites.tree1, sprites.tree2,
    sprites.village1, sprites.village2, sprites.village3,
    sprites.globen, sprites.robbers, sprites.skull,
    sprites.dragon0, sprites.dragon1,
    sprites.kraken, sprites.octopus, sprites.mermaid,
    sprites.seaMonster, sprites.whale1, sprites.decorShip,
    sprites.storm, sprites.compass,
    sprites.stockholm,
    harborMarker, ourShip,
  ]
  // Initial state: dölj och krymp till 0.3 * baseScale (inte 0.3 av texture-
  // native, som skulle vara fel storlek).
  for (const s of allRevealable) {
    if (!s) continue
    const bs = s._baseScale || { x: 1, y: 1 }
    s.alpha = 0
    s.scale.set(bs.x * 0.3, bs.y * 0.3)
  }
  // Stockholm börjar på 0.5 av baseScale
  {
    const bs = sprites.stockholm._baseScale
    sprites.stockholm.alpha = 0
    sprites.stockholm.scale.set(bs.x * 0.5, bs.y * 0.5)
  }
  // Södertälje synlig från start vid full base-scale
  sprites.sodertalje.alpha = 1
  sprites.sodertalje.scale.set(sprites.sodertalje._baseScale.x, sprites.sodertalje._baseScale.y)

  // Routes start dolda (progress=0)
  routes.drive.progress = 0
  routes.drive.solid = true   // under draw-in: solid linje
  routes.boat.progress = 0
  routes.boat.solid = true

  // Kamera startposition: zoomad på Stockholm
  camera.cx = sx; camera.cy = sy
  camera.w = ZOOM_W; camera.h = ZOOM_H
  camera.rot = 0; camera.tilt = 0
  camera.apply()
  tiltStage.setTilt(0)

  const onCamUpdate = () => {
    camera.apply()
    tiltStage.setTilt(camera.tilt)
  }

  const rotMix = { v: 0 }
  const driveStartTangent = tangentAt(camDrivePoly, driveCum, 0)

  const tl = gsap.timeline({ paused: true })

  // 0–3s: Stockholm fade-in + scale till baseScale
  {
    const bs = sprites.stockholm._baseScale
    tl.fromTo(sprites.stockholm, { alpha: 0 },
      { alpha: 1, duration: 1.2, ease: 'back.out(2)' }, 0.2)
    tl.fromTo(sprites.stockholm.scale,
      { x: bs.x * 0.5, y: bs.y * 0.5 },
      { x: bs.x, y: bs.y, duration: 1.2, ease: 'back.out(2)' }, 0.2)
  }

  tl.to(camera, { tilt: tiltTarget, duration: 4, ease: 'power2.inOut', onUpdate: onCamUpdate }, 1)

  const driveProgress = { p: 0 }
  tl.to(rotMix, {
    v: 1,
    duration: 4,
    ease: 'power2.inOut',
    onUpdate() {
      if (driveProgress.p === 0) {
        camera.rot = blendRot(driveStartTangent) * rotMix.v
        onCamUpdate()
      }
    },
  }, 1)

  // 3–28s: drive route draw-in + kamera följer (25s, var 29s)
  tl.to(routes.drive, { progress: 1, duration: 25, ease: 'power2.inOut' }, 3)
  tl.call(() => { routes.drive.solid = false }, null, 28)

  tl.to(driveProgress, {
    p: 1,
    duration: 25,
    ease: 'power2.inOut',
    onUpdate() {
      const len = driveProgress.p * driveTotal
      const [x, y] = sampleAt(camDrivePoly, driveCum, len)
      camera.cx = x; camera.cy = y
      camera.rot = blendRot(tangentAt(camDrivePoly, driveCum, len)) * rotMix.v
      onCamUpdate()
    },
  }, 3)

  // Drive reveals
  const reveal = (sprite, t, dur, fromScale, fadeTarget = 1, ease = 'back.out(2)') => {
    if (!sprite) return
    const bs = sprite._baseScale || { x: 1, y: 1 }
    tl.fromTo(sprite, { alpha: 0 }, { alpha: fadeTarget, duration: dur, ease }, t)
    tl.fromTo(sprite.scale,
      { x: bs.x * fromScale, y: bs.y * fromScale },
      { x: bs.x, y: bs.y, duration: dur, ease }, t)
  }

  // Drive reveals — skalade proportionellt mot ny 25s-duration (var 29s).
  // new_t = 3 + (orig_t - 3) × 25/29
  reveal(sprites.wagon,     3.9,  0.7, 0.3)
  reveal(sprites.globen,    9.9,  0.9, 0.3)
  reveal(sprites.tree1,    11.6,  0.6, 0.4)
  reveal(sprites.dragon0,  11.6,  0.7, 0.3, 0.85)
  reveal(sprites.pirateOgre,13.3, 0.6, 0.4)
  reveal(sprites.village1, 14.2,  0.9, 0.3)
  reveal(sprites.skull,    15.5,  0.7, 0.3)
  reveal(sprites.robbers,  17.7,  0.8, 0.3)
  reveal(sprites.tree2,    19.4,  0.6, 0.4)
  reveal(sprites.dragon1,  23.7,  0.7, 0.3, 0.85)
  reveal(sprites.decorShip,24.5,  0.9, 0.5, 1, 'power2.out')

  // 28–31s: hamn inzoom + tilt-down (shiftad −4s från originalet 32)
  tl.to(camera, { w: ZOOM_W * 0.6, h: ZOOM_H * 0.6, duration: 3, ease: 'power2.inOut', onUpdate: onCamUpdate }, 28)
  tl.to(camera, { rot: 0, duration: 3.5, ease: 'power3.inOut', onUpdate: onCamUpdate }, 28)
  tl.to(camera, { tilt: 0, duration: 3.5, ease: 'power3.inOut', onUpdate: onCamUpdate }, 28)

  reveal(harborMarker,       29.5, 1.2, 0.4)
  reveal(sprites.seaMonster, 29,   0.9, 0.3)
  reveal(sprites.whale1,     31,   0.9, 0.3)
  reveal(sprites.village2,   21.1, 0.9, 0.3)
  reveal(sprites.village3,   22.8, 0.9, 0.3)

  // 34–49s: båtrutt + skepp följer (15s, var 19s; start −4s)
  tl.to(routes.boat, { progress: 1, duration: 15, ease: 'power2.inOut' }, 34)
  tl.call(() => { routes.boat.solid = false }, null, 49)

  reveal(ourShip, 33, 0.8, 0.5)

  tl.to(camera, { w: ZOOM_W * 0.42, h: ZOOM_H * 0.42, duration: 2, ease: 'power2.inOut', onUpdate: onCamUpdate }, 33)

  const boatProgress = { p: 0 }
  tl.to(boatProgress, {
    p: 0.99,
    duration: 15,
    ease: 'power2.inOut',
    onUpdate() {
      const len = boatProgress.p * boatTotal
      const [px, py] = sampleAt(boatPoly, boatCum, len)
      camera.cx = px; camera.cy = py
      const prev = sampleAt(boatPoly, boatCum, Math.max(0, len - 4))
      const ang = Math.atan2(py - prev[1], px - prev[0]) * 180 / Math.PI + 180
      ourShip.x = px
      ourShip.y = py
      ourShip.rotation = (ang * Math.PI) / 180
      onCamUpdate()
    },
  }, 34)

  // Sjökreatur under båtfasen — skalade mot 15s-duration (var 19s).
  // new_t = 34 + (orig_t - 38) × 15/19
  reveal(sprites.mermaid, 33.8, 0.9, 0.3)
  reveal(sprites.kraken,  41.1, 1,   0.2)
  reveal(sprites.octopus, 47.2, 1,   0.2)

  // 49–57s: ovanan-sekvens efter båtens ankomst (t=49)
  tl.to(camera, {
    cx: ox, cy: oy,
    w: 30 * M, h: (30 / ASPECT) * M,
    duration: 3,
    ease: 'power2.inOut',
    onUpdate: onCamUpdate,
  }, 49)
  tl.fromTo(ovananMap, { alpha: 0 }, { alpha: 1, duration: 1.5, ease: 'power2.out' }, 51)
  tl.fromTo(xMarks, { alpha: 0 }, { alpha: 1, duration: 1, ease: 'back.out(2)' }, 54)
  tl.fromTo(xMarks.scale,
    { x: xMarks._baseScale.x * 0.3, y: xMarks._baseScale.y * 0.3 },
    { x: xMarks._baseScale.x, y: xMarks._baseScale.y, duration: 1, ease: 'back.out(2)' }, 54)

  // 58–63s: zooma ut till helheten
  tl.to(camera, {
    cx: endFx,
    cy: endFy,
    w: VIEW_W * END_ZOOM,
    h: viewH * END_ZOOM,
    duration: 5,
    ease: 'power2.inOut',
    onUpdate: onCamUpdate,
  }, 58)
  tl.to(ovananMap, { alpha: 0, duration: 3, ease: 'power2.in' }, 58)
  tl.to(xMarks,    { alpha: 0, duration: 3, ease: 'power2.in' }, 58)
  reveal(sprites.compass, 60, 1.5, 0.3)
  reveal(sprites.storm,   61, 1.5, 0.5, 1, 'power2.out')

  return tl
}
