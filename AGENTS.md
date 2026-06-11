# Agent documentation — Svarta Malin

Project-specific notes for AI agents working in this repo.

## Git-vana

Repo:t är under git. **Committa regelbundet** — efter varje avgränsad förändring som builder grönt. Det finns ingen extern backup, så commits är enda sättet att kunna rulla tillbaka när en "förbättring" visar sig ta bort effekter användaren ville behålla.

Riktlinjer:
- Commita efter varje slutförd uppgift som passerar `npm run build`. Vänta inte tills slutet av sessionen.
- En commit per logisk ändring. Slå inte ihop "fixa stockholm-pos + ändra zoom + ta bort röd prick" i en commit — gör tre.
- Commit-meddelanden på svenska, korta och beskrivande (samma ton som projektet i övrigt).
- Inkludera `Co-Authored-By: Claude <noreply@anthropic.com>` i fotern.

## Architectural conventions

- **Authentication**: per-guest login via `login_slug` (gemener-version av riktigt namn utan mellanslag). Validering via `validate_guest_login()`-RPC i Supabase. Klienten sätter `guest_id` i `localStorage`. Inget öppet registreringsformulär — gäster seedas i förväg via `supabase/guests_seed.sql`.
- **Cloudflare Pages Functions** för `/api/unlock` och `/api/admin-unlock`. Använder `SUPABASE_URL`/`SUPABASE_ANON_KEY` env-vars (separat från Vite-prefixed motsvarigheter).
- **Map animation** är **inte** scroll-driven. Den körs som en GSAP-timeline synkad mot låten via `audio.currentTime` — se `src/components/map.js`. Reveal är ~68 s.
- **Shared utilities** ligger i `src/lib/`:
  - `escape.js` — HTML-escape (importera från komponenter som skriver innerHTML)
  - `loading.js` — show/hide load-screen
  - `state.js` — guest-id i localStorage, session-helpers
  - `audio.js` — show-audio management, autoplay-fallback
  - `supabase.js` — klient-konfig
- **Map data**: `public/map-data.json` (genereras via `npm run fetch-map`). Variabel detaljgrad — hög runt Ovanan/Salmonellahavet, lägre på resten.

## Reveal-config i map.js

Reveal-tidsstämplar för dekorationer är samlade i konfig-arrayer (`driveReveals`, `harborReveals`, `boatReveals`, `endReveals`) — justera där snarare än att leta upp enskilda `tl.fromTo`-anrop.

## Performance-fällor (lärt ut hård väg)

- **Zoom drivs av `viewBox` per frame, inte av en inner-`<g>`-skalning.** Med viewBox-attribut-ändring invaliderar browsern SVG-painten → text ritas om vektor-skarpt på den nya storleken. Inner-`<g>` `scale` kan se sig själv som en deep-mutation som inte alltid retriggrar SVG-paint i en 3D-compositorlayer.
- **3D-tilt funkar tillsammans med viewBox-per-frame.** `perspective` på `#map-bg` + `rotateX` på SVG-elementet är OK — det är inte i sig orsaken till pixelering.
- **CSS `filter` på map-decorationer skapade rasteriseringsproblem.** Drop-shadows via `filter: drop-shadow()` på `.kraken`, `.whale` etc. skapade en CSS filter-graf + stacking-context som påverkade hur SVG-text renderades i 3D-layern. Använd inte CSS `filter` på map-element. Cast shadows ska antingen bakas in i PNG:erna, eller läggas på via SVG `<feDropShadow>`-primitiver applicerade direkt på elementen.
- **Rotation kan inte uttryckas i viewBox** — körs via inner `<g class="map-rotor">`. OK eftersom ren rotation inte triggar samma artefakter som scale.
- **Slå ihop många små polygoner** till en samlad path (set `d` till alla concatenerade strängar). 1000+ separata `<path>`-element är dyrt.
- **Undvik dyra filter** (`feTurbulence` etc.) i `<defs>` även om de inte används — vissa browsers kompilerar ändå.
- **GSAP-tweens direkt på SVG-element vs setAttribute('transform')** krockar — välj en strategi per element.
- **Visuell kvalitet > frame rate.** Användaren har explicit sagt att sajten får vara tung. Default till hög kvalitet; rör inte effekter/ambient-tweens "för perfens skull" utan att fråga.

---

## Collectable pirate portrait card frame

Vintage playing-card-style **PNG overlay** (AI-generated) for pirate portrait photos (collectable cards, crew collage, future collection UI).

### Design intent

- **Ratio:** `63:88` (standard playing card proportions).
- **Mostly transparent:** the frame is a decorative edge + bottom name plaque; the centre is empty so the portrait photo shows through.
- **Dynamic text:** pirate names are rendered as **HTML** on top of the overlay, not baked into the PNG. When regenerating the frame, the bottom cartouche must stay **blank** (no sample text).
- **Aesthetic:** vintage cigarette-card / chromolithograph — sepia, gold trim, skull crest, theatrical pirate romanticism. Prompts follow [aesthetic-style-guide.md](aesthetic-style-guide.md).

### Architecture (three layers)

```
┌─────────────────────────────┐
│  .pirate-card__overlay      │  ← AI-generated PNG frame (top), pointer-events: none
│  ┌───────────────────────┐  │
│  │ .pirate-card__photo   │  │  ← Portrait JPG, sepia filter
│  └───────────────────────┘  │
│  .pirate-card__label        │  ← Pirate name (+ optional real first name), HTML
└─────────────────────────────┘
```

Stacking order (bottom → top): photo → PNG overlay → text label.

### File inventory

| File | Role |
|------|------|
| `public/images/cards/pirate-card-overlay1.webp` … `pirate-card-overlay7.webp` | Web delivery overlays (756×1056 WebP, transparent). Listed in `CARD_OVERLAYS` in `pirate-card.js`. |
| `images/cards-originals/pirate-card-overlay1.png` … `overlay7.png` | Full-res source PNGs. Run `npm run optimize-card-overlays` after curating new frames. |
| `scripts/generate-card-overlay.js` | Regeneration script — outputs `pirate-card-overlay-NN.png` naming; rename/curate into `overlay1`…`7`, then optimize. |
| `scripts/generate-card-overlay.js` | Regeneration script — **use this** to create/redo overlays. |
| `src/components/pirate-card.js` | `pirateCardHtml()` — builds card markup. |
| `src/styles/pirate-card.css` | Layout, photo inset, label position, sepia on photo. |
| `index.html` | Imports `pirate-card.css`. |

### Regenerating the overlay (OpenAI / Codex)

Requires `OPENAI_API_KEY` in the environment (same as map asset generation).

```bash
npm run generate-card-overlay              # all 10 variants
node scripts/generate-card-overlay.js 3  # single variant
```

The script calls the OpenAI Images API (`gpt-image-1`, `1024×1536`, `background: transparent`). Prompt is in `scripts/generate-card-overlay.js` — includes the full Svarta Malin style block from [aesthetic-style-guide.md](aesthetic-style-guide.md) plus an `IMPERFECT` block (wobbly lines, off-register colour, not ruler-straight). Frames must be **thin** (2–4% edge trim) with a blank bottom label only.

**After regenerating:** visually check alignment in the browser. If the transparent window or bottom plaque shifted, tune `.pirate-card__photo` inset and `.pirate-card__label` position in `pirate-card.css`.

**Do not** hand-author an SVG replacement unless the user explicitly asks — the intended workflow is AI-generated PNG via the script above.

### Using the component

```js
import { pirateCardHtml } from './components/pirate-card.js'

el.innerHTML = pirateCardHtml({
  photoSrc: '/images/portraits/12.jpg',  // optional
  pirateName: 'Svarta Malin',            // required — shown in bottom cartouche
  realName: 'Malin',                       // optional — italic sub-label (first name only)
  placeholder: false,                      // true = skip photo, show 🏴‍☠️ placeholder
})
```

**Portrait paths:** `/public/images/portraits/<pirate_name_id>.jpg` where `pirate_name_id` comes from Supabase `pirate_names.id`.

### Current consumers

- `src/components/crew-collage.js` — Besättningen grid on the home page.

### CSS ↔ overlay alignment

Photo inset must clear the frame border and bottom plaque:

```css
.pirate-card__photo {
  inset: 2.5% 2.5% 16% 2.5%;  /* thin frame — tune per variant after regen */
}
.pirate-card__label {
  left: 8%; right: 8%; bottom: 3.5%;
}
```

Pass a different frame: `pirateCardHtml({ overlaySrc: '/images/cards/pirate-card-overlay3.webp', … })`. Crew collage and RSVP preview pick frames via `overlayForId(pirate_name_id)` for stable variety across the seven overlays. Each frame gets a `pirate-card--frameN` class with per-frame photo inset and name-cartouche position in `pirate-card.css` (coordinates in `src/lib/card-frame-layouts.js`). Re-detect after new frames: `npm run detect-card-frame-layouts`.

### Rules when editing

**Do:**

- Regenerate frame via `scripts/generate-card-overlay.js` when the border style should change.
- Keep pirate names as HTML in `.pirate-card__label`.
- Keep `aspect-ratio: 63 / 88` on `.pirate-card__inner`.

**Do not:**

- Bake pirate names into the generated PNG.
- Replace with a full opaque card image — breaks photo-through-centre pattern.
- Remove `pointer-events: none` from the overlay.

### Placeholder behaviour

When portraits are not yet generated, pass `placeholder: true` or omit `photoSrc` to show the gradient + 🏴‍☠️ fallback inside the photo window.

### Related docs

- [aesthetic-style-guide.md](aesthetic-style-guide.md) — style prompts for overlay and portrait generation
- [plan.md](plan.md) §4 — 60 vintage portraits to produce
- [assets-prompts.md](assets-prompts.md) — map decorations (`scripts/generate-map-assets.js`, different amateur-cartographer style)

---

## Song sync (word timestamps)

Pre-generated word-level timestamps for `Martin Ljung - Svarta Malin.m4a` live in `public/data/svarta-malin-words.json`. Use `words[].start` / `words[].ms` to cue GSAP against `#party-audio`.

To regenerate: `ELEVENLABS_API_KEY=... node scripts/transcribe-audio.js` — see [README.md](README.md) § Ljudtranskription.
