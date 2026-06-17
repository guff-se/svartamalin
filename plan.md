# svartamalin.tadaa.se — Byggplan

En interaktiv, teatralisk RSVP-sida för Malins 40-årsfest (Svarta Malin — Salmonellahavets fasa). One-shot, ~30 gäster.

---

## 1. Stack (bekräftad)

- **Hosting:** Cloudflare Pages + Pages Functions (lösenordsgrind)
- **Frontend:** Vanilla JS + Vite, Pixi.js v8 (WebGL-karta), GSAP för animationer
- **DB/Realtid:** Supabase (Postgres + Realtime)
- **Domän:** `svartamalin.tadaa.se` via befintligt Cloudflare-konto

---

## 2. Datamodell (Supabase)

```sql
-- guests
id uuid pk
created_at timestamptz
real_name text                -- ifyllt vid RSVP
attending boolean             -- null = inte svarat, false = avböjt, true = kommer
pirate_name_id int references pirate_names(id) unique  -- null tills valt
crew_id int references crews(id)  -- null tills admin tilldelat
phone text                    -- valfritt, för crew-kontakt
email text                    -- valfritt

-- pirate_names (seedas en gång från piratnamn.txt, 60 st)
id int pk
name text unique
claimed_by uuid references guests(id) null  -- denormaliserat för snabb realtime

-- crews
id int pk
name text                     -- t.ex. "Babords lag"

-- practical_info (key/value så admin kan redigera utan deploy)
key text pk                   -- "boat_friday", "boat_sunday", "packing", ...
value text                    -- markdown
updated_at timestamptz
```

**RLS-policys:**
- Anonym läsning av `pirate_names`, `practical_info`, och aggregerade gästdata (förnamn + piratnamn) — men inte telefon/email för andra crews.
- Skriv endast via Edge Functions / authenticated session (vi sätter en signerad guest-cookie efter lösenord + RSVP).

---

## 3. Flöden

### A. Inloggning (Cloudflare Pages Function)
1. `/` → om ingen `party_pass`-cookie, visa lösenordsformulär. Under fältet: liten textrad **"🔊 Ljud rekommenderas"**.
2. POST `/api/unlock` → jämför mot env-variabel, sätt HTTP-only cookie (signerad, 90 dagar).
3. Vid lyckad upplåsning: musiken (`Martin Ljung - Svarta Malin.m4a`) startar automatiskt. Synlig mute-toggle i hörnet på alla efterföljande vyer; tillståndet sparas i `localStorage`.
4. Misslyckat lösen → teatraliskt "Avvisad!"-svar med shake-animation.

**Browser autoplay-not:** ljud får bara autospelas efter en user gesture. Eftersom upplåsningen *är* en klick/submit räknas det — vi triggar `audio.play()` i samma event handler som POST:en, inte efter `await fetch`.

### B. RSVP-onboarding (när unlocked men ingen guest_id i cookie)
1. **Namn** — fritt textfält. Skapar `guests`-rad, sätter `guest_id`-cookie.
2. **Kommer du?** — Ja / Nej.
   - Nej → "Vi kommer sakna dig"-vy med möjlighet att ändra sig. End.
   - Ja → fortsätt.
3. **Välj piratnamn** — lista från `pirate_names` där `claimed_by IS NULL`.
   - Supabase Realtime: när någon annan claimar live, fadear det namnet ut ur listan med GSAP.
   - Klick → optimistisk claim, server-side check att namnet fortfarande är ledigt (unique constraint). Vid race: "Någon hann före — välj ett annat."
4. → Huvudsidan.

### C. Huvudsidan (registrerad gäst)
Single-page, sektioner i ordning (scroll efter reveal):

1. **Hero / kartan** — illustrerad sjökarta som fullskärmsbakgrund (WebGL/Pixi). Vid sidladdning körs en ~68 s **reveal** (GSAP-timeline, wall-clock `rAF`):
   - Stockholm zoomar in med 3D-tilt, kameran följer OSRM-bilväg → hamn → båtrutt till Ovanan.
   - Dekorationer och faror fades in längs resan; rutter ritas med marching-ants.
   - Efter reveal (eller "Hoppa över") scrollar användaren till innehållssektionerna.
   - Legacy SVG-version på `/old` för jämförelse.
2. **Besättningen** — collage av alla pirater som anmält sig.
   - Ett förgenererat vintageporträtt per piratnamn (60 st, sepia/tintype).
   - Endast claimed namn renderas. Realtime: nya pirater dyker upp med fade-in.
   - Klick → större vy med piratnamn + förnamn.
3. **Praktisk info** — sektioner som läses från `practical_info`-tabellen:
   - Plats & datum
   - Båttider (TBD — admin fyller i)
   - Vad att packa
   - Barnpolicy
   - Lagsystem & skatter (kort förklaring)
4. **Ditt lag** — om `crew_id` är null: "Lagen seglas fortfarande ihop…" med animerad rep-knop. När admin tilldelat: visa lagets medlemmar (förnamn + piratnamn + kontakt).

### D. Admin (`/admin`)
Separat lösenord (annan env-var).
- Tabell över alla gäster: namn, status, piratnamn, lag.
- Dropdown per gäst för crew-tilldelning → skriver `crew_id`.
- Redigera `practical_info` (textareas, markdown-preview).
- (Supabase Studio räcker som backup för allt övrigt.)

---

## 4. Tillgångar som måste produceras

| Vad | Antal | Anteckning |
|---|---|---|
| Vintageporträtt per piratnamn | 60 | Genereras med prompten i [aesthetic-style-guide.md](aesthetic-style-guide.md). Stilkonsekvens: lås palett + textur. |
| Sjökarta (illustrerad) | 1 × `map-data.json` + PNG-dekorationer | OSM-baserad karta + AI-genererade kartsymboler i `public/images/map/`. Renderas i WebGL (Pixi); legacy SVG på `/old`. |
| Parallaxlager | — | Ersatt av kameraflygning + 3D-tilt i WebGL-versionen. |
| Ljudslinga | 1 | [Martin Ljung - Svarta Malin.m4a](Martin%20Ljung%20-%20Svarta%20Malin.m4a) — finns redan. Startar automatiskt vid lyckad upplåsning, looping, med synlig mute-toggle. |
| Favicon + OG-bild | 1+1 | Dödskalle-hatten som logotyp. |

---

## 5. Milstolpar

**M1 — Skelett (1–2 dagar)**
- Vite-projekt, Cloudflare Pages-deploy, subdomän aktiv.
- Pages Function för lösenordsgrind + cookie.
- Supabase-projekt, schema, seed av piratnamn (60 från [piratnamn.txt](piratnamn.txt)).

**M2 — RSVP-flöde (2–3 dagar)**
- Namn → ja/nej → piratnamnsval.
- Realtime-uppdatering av claimade namn.
- Race-säker claim (unique constraint).

**M3 — Huvudsida statisk (2–3 dagar)**
- Layout med alla sektioner, dummy-innehåll.
- Praktisk info läses från Supabase.
- "Ditt lag"-tomstate.

**M4 — Karta + animationer (3–4 dagar)** ✓
- WebGL-karta (Pixi.js): reveal-timeline, kameraflygning, 3D-tilt, dekorations-sprites.
- Legacy SVG (`map.js`) kvar på `/old`.

**M5 — Besättningscollage (1–2 dagar, parallellt med porträttgenerering)**
- Grid med realtime-uppdatering.
- Klick → modal med större porträtt.

**M6 — Admin-vy (1 dag)**
- Gästtabell, crew-tilldelning, info-redigering.

**M7 — Polish + innehåll (löpande)**
- 60 porträtt genereras och laddas in.
- Faktiska båttider, packlista, programdetaljer.
- Ljud, micro-interactions, fel-states.

---

## 6. Risker / öppna frågor

- **60 stilkonsekventa porträtt** är den största produktionsuppgiften. Bör startas tidigt och parallellt med kod.
- **Mobil-prestanda** för WebGL + GSAP — testa tidigt på iPhone (debounced resize, ingen `resizeTo`). Fallback: `/old` (SVG) eller skip-knapp.
**Cookie + Pages Function** för shared password: enkelt men inte krypto. OK för en privat fest.
- **Avböjt-gäster** — får de se huvudsidan om de loggar in igen? Förslag: ja, men utan "Ditt lag" och utan att vara med i collaget. Ändra-sig-knapp finns.

---

## 7. Filstruktur (förslag)

```
/
├── src/
│   ├── main.js                  # entry
│   ├── pages/
│   │   ├── rsvp.js              # onboarding-flöde
│   │   ├── webgl.js             # huvudsidan (produktion, WebGL-bakgrund)
│   │   ├── home.js              # legacy huvudsida (/old, SVG-bakgrund)
│   │   └── admin.js
│   ├── components/
│   │   ├── webgl-map/           # Pixi.js-karta (produktion)
│   │   ├── map.js               # legacy SVG-karta (/old)
│   │   ├── crew-collage.js
│   │   ├── pirate-name-picker.js
│   │   └── practical-info.js
│   ├── lib/
│   │   ├── supabase.js
│   │   └── auth.js              # guest cookie / state
│   └── styles/
├── functions/
│   ├── api/
│   │   ├── unlock.js            # password check
│   │   └── admin-unlock.js
│   └── _middleware.js           # gate everything but /unlock
├── public/
│   ├── images/portraits/        # 60 st
│   ├── images/map/
│   └── audio/
└── supabase/
    ├── schema.sql
    └── seed.sql                 # piratnamn.txt → INSERTs
```
