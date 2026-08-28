# Agent documentation — Svarta Malin

Project-specific notes for AI agents working in this repo.

## Git-vana

Repo:t är under git. **Committa regelbundet, utan att vänta på att användaren ber om det.** Det finns ingen extern backup — commits är enda sättet att rulla tillbaka när en "förbättring" tar bort något användaren ville behålla.

Den här sektionen **överstyr** generella agentregler av typen "commita bara när användaren ber om det". I det här repot commitar du själv.

Riktlinjer:
- Commita efter varje slutförd uppgift. För kod: när `npm run build` är grön. För innehåll (markdown, yaml, copy): när filerna är färdiga — vänta inte på build.
- Vänta inte tills slutet av sessionen. Lämna inte working tree dirty när du är klar.
- En commit per logisk ändring. Slå inte ihop "fixa stockholm-pos + ändra zoom + ta bort röd prick" i en commit — gör tre. Undantag: användaren säger uttryckligen "commit all" / "commita allt".
- Commit-meddelanden på svenska, korta och beskrivande (samma ton som projektet i övrigt).
- Inkludera `Co-Authored-By: Claude <noreply@anthropic.com>` i fotern.
- Commita inte `.env`, `.env.local` eller andra secrets.
- `git push` bara när användaren ber om det.

## Supabase — access och migrationer

Du har direktåtkomst till Supabase via creds i `.env.local`. **Vänta inte på användaren — kör mot databasen själv** när det behövs (seed, data-fix, migrationer).

**Tre nivåer av access (kolla `.env.local` för vad som finns):**

1. **`VITE_SUPABASE_ANON_KEY`** — alltid där. Räcker för rad-läs/skriv på tabeller med öppna RLS-policies (t.ex. `guests`). Via PostgREST:
   ```bash
   set -a; source .env.local; set +a
   curl -s -X PATCH "${VITE_SUPABASE_URL}/rest/v1/guests?login_slug=eq.gustaftadaa" \
     -H "apikey: ${VITE_SUPABASE_ANON_KEY}" \
     -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
     -H "Content-Type: application/json" \
     -H "Prefer: return=minimal" \
     -d '{"food_notes":"vegetarisk"}'
   ```

2. **`SUPABASE_SERVICE_ROLE_KEY`** (om den finns i `.env.local`) — bypass:ar RLS, kan läsa/skriva ALLA tabeller men kan fortfarande INTE köra DDL via PostgREST. Skickas i samma `apikey`/`Authorization`-headers.

3. **DDL (CREATE/ALTER/DROP)** — kräver Postgres-direktanslutning eller Management API. Två vägar:
   - **Postgres connection-string** (`DATABASE_URL=postgresql://...` i `.env.local`) → kör direkt med `psql` eller `node-postgres`:
     ```bash
     psql "$DATABASE_URL" -c "alter table guests add column food_notes text;"
     ```
   - **Management API** (`SUPABASE_ACCESS_TOKEN=sbp_...` + `SUPABASE_PROJECT_REF=xxx` i `.env.local`):
     ```bash
     curl -s -X POST "https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/database/query" \
       -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
       -H "Content-Type: application/json" \
       -d '{"query":"alter table guests add column if not exists food_notes text"}'
     ```

**Om en DDL-migration behövs och creds (3) saknas** — säg det rakt ut och be användaren lägga in `SUPABASE_ACCESS_TOKEN` + `SUPABASE_PROJECT_REF` eller `DATABASE_URL` i `.env.local`. Pinga inte med "kör detta SQL själv" — det är ditt jobb när access finns.

**Migrationer dokumenteras** alltid i `supabase/migrations/*.sql` (idempotent: `add column if not exists`, `create policy if not exists`) så historiken finns även när du kört den via API.

## Architectural conventions

- **Authentication**: per-guest login via `login_slug` (gemener-version av riktigt namn utan mellanslag). Validering via `validate_guest_login()`-RPC i Supabase. Klienten sätter `guest_id` i `localStorage`. Inget öppet registreringsformulär — gäster seedas i förväg via `supabase/guests_seed.sql`.
- **Cloudflare Pages Functions** för `/api/unlock` och `/api/admin-unlock`. Använder `SUPABASE_URL`/`SUPABASE_ANON_KEY` env-vars (separat från Vite-prefixed motsvarigheter).
- **Map animation** är **inte** scroll-driven. Produktionsversionen (`/`) renderas med **Pixi.js v8 (WebGL)** i `src/components/webgl-map/`, monteras via `src/pages/webgl.js`. Reveal körs som en pausad GSAP-timeline (`reveal-timeline.js`) driven av wall-clock `requestAnimationFrame` (~68 s). Låten startar parallellt via `startShowAudio()` men timelinen synkas inte mot `audio.currentTime`. Legacy-SVG på `/old` (`src/components/map.js` + `src/pages/home.js`) är **frusen referens** — se avsnittet nedan.
- **Shared utilities** ligger i `src/lib/`:
  - `escape.js` — HTML-escape (importera från komponenter som skriver innerHTML)
  - `loading.js` — show/hide load-screen
  - `state.js` — guest-id i localStorage, session-helpers
  - `audio.js` — show-audio management, autoplay-fallback
  - `supabase.js` — klient-konfig
- **Map data**: `public/map-data.json` (genereras via `npm run fetch-map`). Variabel detaljgrad — hög runt Ovanan/Salmonellahavet, lägre på resten.

## Innehåll (`content/`) — två publiker

Karta: [`content/README.md`](content/README.md).

**Gästtext, intriger (följ [`content/intriger/STYLE.md`](content/intriger/STYLE.md)):** `content/intriger/crews/*.md` och `content/intriger/guests/*.md`. Bundlas till inloggad gäst.

**Gästtext, sajtens brödtext:** [`content/copy/`](content/copy/README.md). All brödtext på webbsidan. Inte STYLE.md. Inte Supabase. Bundlas vid build via `import.meta.glob` i `practical-info.js`. Inga story-hemligheter. Nämn inte att festen är sexpositiv. Det sägs på plats.

**Intern text:** `huvudstory/`, `anteckningar/`, yaml-källistor, README. Gäster ska inte läsa det. Högsta prioritet är att en framtida agent förstår filen. Tydligt, inte poetiskt. Ingen revyröst, ingen du-form till deltagaren. Civilnamn och slug är tillåtna.

**Roller:** [`content/roller/`](content/roller/) är bara spegling av Supabase. Rör aldrig gästfilerna. Inga handanteckningar. Uppdatera med `npm run fetch-roller`. Meta hör hemma i [`content/anteckningar/`](content/anteckningar/).

## Intriger (lajv) — skrivregler

Intriger är statiska markdown-filer under `content/intriger/crews/` och `content/intriger/guests/` (inte Supabase). Se filformat i `content/intriger/README.md`. STYLE.md gäller bara de filerna, inte yaml-källistor eller intern designtext.

**Gästlistan är stängd — bara gäster med `attending = true` hanteras.** Skapa aldrig `guests/{login_slug}.md` för någon som tackat nej eller aldrig svarat, inte ens en tom stubbe. De ska inte heller dyka upp i lagintriger, `romanser.yaml`, `fiender.yaml` eller huvudstoryn. De ligger kvar i `guests`-tabellen och i `GUEST_REAL_NAMES` (portrait-paths), men existerar inte i lajvet. Hämta listan innan du skriver intrigtext:

```bash
set -a; source .env.local; set +a
curl -s "${VITE_SUPABASE_URL}/rest/v1/guests?select=login_slug,real_name,crew_id&attending=is.true&order=login_slug" \
  -H "apikey: ${VITE_SUPABASE_ANON_KEY}" -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}"
```

**När du skriver eller ändrar intrigtext:** läs personens [`content/roller/{slug}.md`](content/roller/) och [`content/anteckningar/{slug}.md`](content/anteckningar/), och följ **alltid** [`content/intriger/STYLE.md`](content/intriger/STYLE.md). Kortfattat:

- Röst: Povel Ramel / klassisk svensk revy — finurligt, ordvitsar, allitteration, rim; överdrivet och bombastiskt; mottagaren är hjälten i sin berättelse (du-form). **Alltid piratnamn** — aldrig civilnamn i intrigtext. Gärna eko från `svartamalin-sångtext.txt` (alla piratnamn kommer därifrån; sista versen = slutstriden — spoila den inte).
- Sexpositiv fest. Explicit språk och grövre sexuella referenser är tillåtna. Register: lust och sex ("bunden och tagen"), inte romankärlek ("framtid tillsammans"). Ingen male gaze. Står inte på sajten; sägs i genomgången på plats.
- Metaregel (får **inte** stå i intrigerna): alla dödas av Svarta Malin; hon återvänder som Ran. Spelarna vet det; intrigerna spoilar det inte men leder dramaturgiskt ditåt.
- Helgens båge styr undertonen: fredag överdåd → lördag svek → lördag kväll förlisning/slagsmål → natt Rans salar.
- Lag: `crews/{crew_id}.md`. Individ: `guests/{login_slug}.md`. Spegla tvåvägsrelationer; markera envägs i frontmatter.
- Vad vet karaktären? De läser bara egen `guests/`-fil, egen `crews/`-fil och `content/copy/`. Referera inte till andras intriger eller sidequests de inte är med i, om det inte lyfts in i *deras* text.
- Inte Fredag/Lördag som standardavslut. Schema längst ner bara om tidpunkten är själva saken. Annars: vilja, hinder, helgen. Inte spelledning om när de ska spela.
- Han/hon/hen: slå upp `real_name` i `content/anteckningar/{slug}.md`. Piratnamn styr inte kön. Okänd person: hen, eller skriv om utan pronomen. Anta inte att kaptener är män.
- **Skatt är två engelska ord.** Treasure: lagskatt, klenod, kistans loot. Tax: piratskatt, arvssyndsskatt. Gästtext får båda. Intern text märker vilken: [`content/huvudstory/skatt.md`](content/huvudstory/skatt.md). Jämför inte Malins treasure med Kosings tax.

## Huvudstory (lajvets övergripande berättelse)

Designarbetet för helgens huvudstory ligger i **[`content/huvudstory/`](content/huvudstory/README.md)**. Det är intern text för Gustaf och agenten: lösningar, hemligheter och spelledning. **Publiceras aldrig.** Skriv så att en framtida agent förstår utan att gissa. Ingen revyröst. `src/lib/intriger.js` globbar bara `content/intriger/{crews,guests}/*.md`. Lägg inga lösningar i gästfilerna.

Arbetsordningen är tvåstegs och får inte kortslutas:

1. **Designa** i `content/huvudstory/` (premiss, kanon, akter, pussel, sidequests). Rak teknisk prosa, ingen revyröst.
2. **Distribuera** via `content/huvudstory/fordelning.yaml`, som är bryggan till gästtexten. Först när en story-bit har en post där skrivs text i `content/intriger/guests/{slug}.md` eller `crews/{id}.md` enligt `STYLE.md`, varefter status sätts till `done`.

Läs `content/huvudstory/README.md` för filkarta, invarianter och definition of done, [`content/huvudstory/skatt.md`](content/huvudstory/skatt.md) för treasure vs tax, samt `content/huvudstory/RESEARCH.md` för de designprinciper (lajvintriger, escape rooms, säkerhetsmekanik) som besluten vilar på.

## Innehållstexter (`content/copy`)

Sajtens brödtext skrivs i [`content/copy/{key}.md`](content/copy/README.md). **Inte** i Supabase. Gästerna läser den. STYLE.md gäller inte där. Vite globbar filerna i `src/components/practical-info.js`. En md-ändring syns efter build/deploy. Hårdkoda inte brödtext i komponenter. Nämn inte sexpositivitet, play space eller att sex är tillåtet.

**Mönster i koden:**

- `src/components/practical-info.js` — `fetchPracticalMap()` returnerar globbade md-filer, `formatPracticalMarkdown()` (minimal markdown: `**fet**`, länkar, radbrytningar).
- `src/components/narrative-section.js` — `renderNarrative(el, { key })` hämtar samma karta.

**När du lägger till ny copy:** skapa `{key}.md` i `content/copy/` och anropa `renderNarrative` med den nyckeln. Hårdkoda inte placeholder-strängar i JSX/HTML.

## WebGL-karta (`src/components/webgl-map/`) — enda källan för kartändringar

Alla kartrelaterade uppgifter (positioner, reveal-timing, kamera, dekorationer, ambient) ska göras **här**. Detta är produktionen som gäster ser på `/`.

| Fil | Roll |
|-----|------|
| `index.js` | `mountWebglMap()` / `unmountWebglMap()` — Pixi `Application`, resize, reveal-loop |
| `scene.js` | Bygger statisk scen från `map-data.json` + dekorations-PNG:er |
| `camera.js` | Zoom/pan/rotation |
| `tilt-stage.js` | 3D-tilt via `PerspectiveMesh` + `RenderTexture` (renderar `scene.root` per frame) |
| `reveal-timeline.js` | GSAP reveal (~68 s) mot Pixi `DisplayObject`s |
| `ambient.js` | Loopande tweens efter reveal |
| `routes.js` | Bil- och båtrutter med marching-ants |
| `projection.js` / `decor-positions.js` | Lat/lon → scenkoordinater; **`decor-positions.js` (`DECOR_LL`, `DECOR_SIZE`) är sanningen för dekorationspositioner** |

CSS för overlay/scroll-lås: `src/styles/webgl.css` (`body.webgl-revealing` / `webgl-revealed`).

## Legacy-karta (`/old`) — rör inte. Aldrig.

`src/components/map.js`, `src/pages/home.js` och tillhörande SVG-CSS (`src/styles/map.css` m.m.) är historisk referens. **Sluta uppdatera dessa filer.**

**Gör inte:**

- Ändra positioner, reveal-timing, kamerabeteende eller layout i legacy.
- "Hålla legacy synkad med /webgl" — gör det inte ens om strukturen skulle hamna ur sync.
- Uppdatera home.js när du tar bort/byter namn på komponenter den importerar. Om /old slutar bygga: **låt det vara**. Det är OK att /old är trasigt — vi fokuserar bara på /.
- Refaktorera, fixa eller förbättra legacy-kartan.

**Enda undantag:** Om användaren uttryckligen säger "fixa /old" eller pekar direkt på `map.js`/`home.js` — då får du röra dem.

**Om en delad komponent som /old använder försvinner:** lämna `home.js` med trasig import. Det är inte ditt ansvar att hålla /old kompilerbar.

## Reveal-timing

Inline `reveal()`-anrop i `reveal-timeline.js`. Legacy har motsvarande konfig i `map.js` — ignorera den om inget annat sägs.

## Performance-fällor — WebGL (lärt ut hård väg)

- **Lägg inte `scene.root` direkt på `app.stage`.** `TiltStage` renderar världen till en `RenderTexture` och visar den via `PerspectiveMesh` — annars försvinner 3D-tilt.
- **Använd inte `resizeTo` på iOS.** Adresslistans kollaps triggar resize → canvas rebuild → flicker. Manuell debounced resize i `index.js` istället.
- **Tweena sprite-skala relativt `_baseScale`.** `s.width = N` sätter `scale` till texture-native storlek. GSAP `scale.x → 1.04` blir gigantisk — multiplicera alltid med `sprite._baseScale` (se `ambient.js` och `reveal-timeline.js`).
- **Kameran uppdateras via `camera.apply()`** efter GSAP `onUpdate` — inte direkt på container-transform utanför `Camera`.
- **Visuell kvalitet > frame rate.** Sajten får vara tung; rör inte effekter/ambient-tweens "för perfens skull" utan att fråga.

## Performance-fällor — legacy SVG (`/old`, referens only)

Behålls oförändrad för fallback/jämförelse. Agents redigerar inte dessa filer. Referens om legacy beteende behövs — se `src/components/map.js`:

- Zoom via `viewBox` per frame; rotation via inner `<g class="map-rotor">`.
- Ingen CSS `filter: drop-shadow()` på kartelement — bakas in i PNG eller via SVG `<feDropShadow>`.
- Slå ihop många små polygoner till en path; undvik oanvända `<defs>`-filter.
- GSAP-tweens vs `setAttribute('transform')` — välj en strategi per element.

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

- `src/components/crew-collage.js` — Besättningen grid på huvudsidan (`webgl.js` / `home.js`).

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

Pass a different frame: `pirateCardHtml({ overlaySrc: '/images/cards/pirate-card-overlay3.webp', … })`. Crew collage and RSVP preview pick frames via `overlayForGuest()` / locked assignments in `card-frame-assignments.js`. Each frame gets a `pirate-card--frameN` class; per-frame photo inset and name position live only in `pirate-card.css` (layout block between markers). Tune via `/framefix` or auto-detect after new frames: `npm run detect-card-frame-layouts`.

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
