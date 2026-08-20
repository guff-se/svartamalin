# svartamalin.tadaa.se

Playful, one-shot RSVP-sajt för Malins 40-årsfest. Se [plan.md](plan.md) och [projektbeskrivning.md](projektbeskrivning.md).

AI agents: see [AGENTS.md](AGENTS.md) for project-specific conventions (e.g. pirate portrait card frame).

## Snabbstart

```bash
npm install
cp .env.example .env.local   # fyll i Supabase URL + anon key
npm run dev
```

Sajten körs på `http://localhost:5173`. Admin på `http://localhost:5173/admin/`.

> **Obs:** Pages Functions (`/api/unlock`, `/api/admin-unlock`) körs inte via `vite dev`. Använd `npx wrangler pages dev -- npm run dev` för att testa lösenordsflödet lokalt. Alternativt: lös upp manuellt via DevTools genom att sätta `localStorage.setItem('svartamalin:unlocked', '1')`.

## Supabase-uppsättning

1. Skapa ett Supabase-projekt.
2. Kör innehållet i [supabase/schema.sql](supabase/schema.sql) i SQL editorn.
3. Kör [supabase/seed.sql](supabase/seed.sql) för att seeda piratnamnen.
4. Kopiera projekt-URL och anon-nyckeln till `.env.local`.

Brödtext på sajten ligger **inte** i databasen. Den ligger i [`content/copy/`](content/copy/README.md) och bundlas vid build.

## Kartdata

Kartan genereras från OpenStreetMap:

```bash
npm run fetch-map
```

Skriptet hämtar:

- **Bilväg** Stockholm → Björkfjärdsvägen 28 från OSRM (verklig vägrutt)
- **Vatten-polygoner** (`natural=water`, `water=*`, `natural=bay`, `place=sea`, `natural=strait`) från Overpass
- **`place=island/islet`** för Mälaren-öar
- **`natural=coastline`** — slutna ringar = arkipelag-öar; öppna kedjor stängs medurs runt bbox till havs-polygoner (Saltsjön etc)

Variabel detaljgrad: hög upplösning runt Salmonellahavet/Ovanan (där kameran zoomar in), lägre på resten. Output `public/map-data.json` (~2-3 MB). Kör om vid behov — datat ändras sällan.

Kartan renderas i produktion via **Pixi.js** (`src/components/webgl-map/`) som läser samma `map-data.json` plus PNG-dekorationer i `public/images/map/`. Se [AGENTS.md](AGENTS.md) för modulöversikt. Jämför mot SVG-originalet på `http://localhost:5173/old`.

## Piratkort-ram (collectable card overlay)

Transparent spelkortsram (63:88) för porträttfoton genereras via OpenAI Images API. Stil enligt [aesthetic-style-guide.md](aesthetic-style-guide.md). Piratnamn läggs som HTML ovanpå — inte i bilden.

```bash
export OPENAI_API_KEY=...
npm run generate-card-overlay
```

Kurera favoriter till `images/cards-originals/pirate-card-overlay1.png` … `overlay7.png`, kör sedan `npm run optimize-card-overlays` → WebP i `public/images/cards/`. Se [AGENTS.md](AGENTS.md) för komponent-API och CSS-justering.

## Ljudtranskription (ord-tidsstämplar)

För att synka GSAP-animationer med sångtexten transkriberas `Martin Ljung - Svarta Malin.m4a` med [ElevenLabs Scribe v2](https://elevenlabs.io/docs/overview/capabilities/speech-to-text). API:et returnerar ett tidsstämpel per ord (`start` / `end` i sekunder).

Kräver en ElevenLabs API-nyckel (dev-only, ingår inte i frontend-bundle):

```bash
export ELEVENLABS_API_KEY=...   # eller lägg i .env.local (läses inte automatiskt — exportera manuellt)
node scripts/transcribe-audio.js
# valfritt: node scripts/transcribe-audio.js "path/to/annan.m4a"
```

Skriptet skriver:

| Fil | Innehåll |
|-----|----------|
| `public/data/svarta-malin-transcript.json` | Fullständigt API-svar |
| `public/data/svarta-malin-words.json` | Ordlista för animation — `words[]` med `text`, `start`, `end`, `ms` |

Exempel på ett ord:

```json
{ "i": 0, "text": "Det", "start": 9.62, "end": 9.77, "ms": 9620 }
```

Ladda i frontend och driv en timeline mot `#party-audio`:

```js
const { words } = await fetch('/data/svarta-malin-words.json').then((r) => r.json())

words.forEach(({ text, start }) => {
  tl.call(() => highlight(text), null, start)
})

audio.addEventListener('timeupdate', () => { tl.time(audio.currentTime) })
```

**Noteringar:**

- Första ordet börjar ~9,6 s in — instrumental intro före sång.
- Kör om transkriptionen om ljudfilen byts ut; committa uppdaterade JSON-filer vid behov.
- Nyckeln behövs bara vid generering, inte i produktion.

## Cloudflare Pages

Sätt följande env vars i Pages-projektets settings:

- `SUPABASE_URL` — samma som `VITE_SUPABASE_URL`
- `SUPABASE_ANON_KEY` — samma som `VITE_SUPABASE_ANON_KEY` (för inloggningsvalidering i `/api/unlock`)
- `ADMIN_PASSWORD` — separat lösen för `/admin`
- `COOKIE_SECRET` — 32+ slumpmässiga bytes, för att signera cookies

Varje gäst loggar in med ett personligt lösenord: fullständigt namn utan mellanslag, gemener (t.ex. `gustaftadaa`). Gästerna seedas via `supabase/guests_seed.sql`.

Subdomän `svartamalin.tadaa.se` konfigureras i Cloudflare DNS.

## Status

- [x] M1: Skelett, lösenordsgrind (per-gäst login_slug), Supabase-schema, audio
- [x] M2: RSVP-flöde med realtime-piratnamnsval (ja/nej + piratnamn)
- [x] M3: Huvudsida (hero + kort med kollegor/info/lag, info från DB)
- [x] M4: Animerad piratkarta som fullskärmsbakgrund — **WebGL (Pixi.js v8)** på `/`, ~68 s reveal (GSAP-timeline + wall-clock `rAF`; låten startar parallellt):
  - Stockholm-silhouette zoomar in med 3D-tilt (`PerspectiveMesh`)
  - Kameran flyger längs verklig OSRM-bilväg till hamnen
  - Båt-fas Hamn → Ovanan med skepp
  - Faror längs vägen och i Salmonellahavet (kraken, val, bläckfisk, sjöjungfru, drakar, stigmän, m.m.)
  - Slut-zoom till helheten med kompassros, Salmonellahavet-etikett
  - Legacy SVG-version finns kvar på `/old` (`map.js`)
- [x] M5: Besättningscollage med pirateCard-ram (porträtt laddas från `/images/portraits/<real_name_slug>.jpg`)
- [x] M6: Admin-vy
- [ ] M7: Polish — slutfasen porträtt, faktiska båttider, ljud-feedback
