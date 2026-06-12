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

  // Slutposition — projicera samma lat/lon som map.js raderna 152-154.
  // (endFxBase = project([17.765, 59.308]), sen +5% skift höger.)
  const [endFxBase, endFy] = scene.proj.project([17.765, 59.308])
  const endFx = endFxBase + VIEW_W * 0.865 * 0.05

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

  // 3–32s: drive route draw-in + kamera följer
  tl.to(routes.drive, { progress: 1, duration: 29, ease: 'power2.inOut' }, 3)
  tl.call(() => { routes.drive.solid = false }, null, 32)

  tl.to(driveProgress, {
    p: 1,
    duration: 29,
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

  reveal(sprites.wagon,    4,    0.7, 0.3)
  reveal(sprites.tree1,   13,    0.6, 0.4)
  reveal(sprites.globen,  11,    0.9, 0.3)
  reveal(sprites.dragon0, 13,    0.7, 0.3, 0.85)
  reveal(sprites.pirateOgre, 15, 0.6, 0.4)
  reveal(sprites.village1,16,    0.9, 0.3)
  reveal(sprites.skull,   17.5,  0.7, 0.3)
  reveal(sprites.robbers, 20,    0.8, 0.3)
  reveal(sprites.tree2,   22,    0.6, 0.4)
  reveal(sprites.dragon1, 27,    0.7, 0.3, 0.85)
  reveal(sprites.decorShip, 28,  0.9, 0.5, 1, 'power2.out')

  // 32–35s: hamn inzoom + tilt-down
  tl.to(camera, { w: ZOOM_W * 0.6, h: ZOOM_H * 0.6, duration: 3, ease: 'power2.inOut', onUpdate: onCamUpdate }, 32)
  tl.to(camera, { rot: 0, duration: 3.5, ease: 'power3.inOut', onUpdate: onCamUpdate }, 32)
  tl.to(camera, { tilt: 0, duration: 3.5, ease: 'power3.inOut', onUpdate: onCamUpdate }, 32)

  reveal(harborMarker,     33.5, 1.2, 0.4)
  reveal(sprites.seaMonster, 33, 0.9, 0.3)
  reveal(sprites.whale1,    35,  0.9, 0.3)
  reveal(sprites.village2,  24,  0.9, 0.3)
  reveal(sprites.village3,  26,  0.9, 0.3)

  // 38–57s: båtrutt + skepp följer
  tl.to(routes.boat, { progress: 1, duration: 19, ease: 'power2.inOut' }, 38)
  tl.call(() => { routes.boat.solid = false }, null, 57)

  reveal(ourShip, 37, 0.8, 0.5)

  tl.to(camera, { w: ZOOM_W * 0.42, h: ZOOM_H * 0.42, duration: 2, ease: 'power2.inOut', onUpdate: onCamUpdate }, 37)

  const boatProgress = { p: 0 }
  tl.to(boatProgress, {
    p: 0.99,
    duration: 19,
    ease: 'power2.inOut',
    onUpdate() {
      const len = boatProgress.p * boatTotal
      const [px, py] = sampleAt(boatPoly, boatCum, len)
      camera.cx = px; camera.cy = py
      // Skeppet följer båt-pathen med samma vinkel-tangent + 180° flipp
      const prev = sampleAt(boatPoly, boatCum, Math.max(0, len - 4))
      const ang = Math.atan2(py - prev[1], px - prev[0]) * 180 / Math.PI + 180
      ourShip.x = px
      ourShip.y = py
      ourShip.rotation = (ang * Math.PI) / 180
      onCamUpdate()
    },
  }, 38)

  // Sjökreatur under båtfasen
  reveal(sprites.mermaid, 39, 0.9, 0.3)
  reveal(sprites.kraken,  47, 1,   0.2)
  reveal(sprites.octopus, 56, 1,   0.2)

  // 58–66s: ovanan-sekvens efter att skeppet anlänt vid Ovanan (t=57.5)
  // a) Zooma in på ön + fadea in ovanan.jpg-overlay
  // b) Zooma vidare så ovanan.jpg fyller skärmen
  // c) Fadea in x-marks-the-spot på husen
  // d) Hold några sekunder, sen slut-zoom (nedan)
  tl.to(camera, {
    cx: ox, cy: oy,
    w: 30 * M, h: (30 / ASPECT) * M,  // zoom in på ön (ön är liten — ~10 world-units)
    duration: 2.5,
    ease: 'power2.inOut',
    onUpdate: onCamUpdate,
  }, 58)
  tl.fromTo(ovananMap, { alpha: 0 }, { alpha: 1, duration: 1.5, ease: 'power2.out' }, 59)
  // Zooma till ovanan.jpg (7.5 world-units bred) fyller hela skärmen
  tl.to(camera, {
    cx: ox, cy: oy,
    w: 7.5 * M, h: 7.5 * M / ASPECT,
    duration: 2,
    ease: 'power2.inOut',
    onUpdate: onCamUpdate,
  }, 61)
  tl.fromTo(xMarks, { alpha: 0 }, { alpha: 1, duration: 1, ease: 'back.out(2)' }, 63)
  tl.fromTo(xMarks.scale,
    { x: xMarks._baseScale.x * 0.3, y: xMarks._baseScale.y * 0.3 },
    { x: xMarks._baseScale.x, y: xMarks._baseScale.y, duration: 1, ease: 'back.out(2)' }, 63)

  // 67–72s: zooma ut till helheten (shiftad +6s från originalet 61)
  tl.to(camera, {
    cx: endFx,
    cy: endFy,
    w: VIEW_W * 0.865 * M,
    h: viewH * 0.865 * M,
    duration: 5,
    ease: 'power2.inOut',
    onUpdate: onCamUpdate,
  }, 67)
  // Fadea ut ovanan-overlay under zoom-ut så det inte ser konstigt ut långt borta
  tl.to(ovananMap, { alpha: 0, duration: 3, ease: 'power2.in' }, 67)
  tl.to(xMarks,    { alpha: 0, duration: 3, ease: 'power2.in' }, 67)
  reveal(sprites.compass, 69, 1.5, 0.3)
  reveal(sprites.storm,   70, 1.5, 0.5, 1, 'power2.out')

  return tl
}
