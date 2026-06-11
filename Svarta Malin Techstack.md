# svartamalin.tadaa.se — Tech Stack

## Hosting & Deploy

**Cloudflare Pages** — deploy från GitHub, subdomain `svartamalin.tadaa.se` konfigureras i befintligt Cloudflare-konto.

Cloudflare Pages Functions hanterar lösenordsskyddet: en enkel middleware som kontrollerar en delad kod mot en cookie. Basic och hackbart, men tillräckligt.

## Frontend

**Vanilla JS + Vite** — ingen framework. Lätt, snabbt, full kontroll över animationer.

**Pixi.js v8 (WebGL)** för den animerade sjökartan på huvudsidan — kameraflygning, 3D-tilt via `PerspectiveMesh`, dekorations-sprites och ruttanimation. Legacy SVG-version (`map.js`) finns på `/old`.

**GSAP** för animationer: kart-reveal, ambient-tweens, piratporträtt, övergångar. Teatraliska och tunga effekter.

## Databas & Realtid

**Supabase** — hanterar:

- RSVP-registreringar
- Piratnamnsval med realtidsuppdatering via Supabase Realtime (tagna namn stryks från listan live för alla inloggade gäster)

## Adminvy

En lösenordsskyddad `/admin`-route (separat kod) eller Supabase-dashboarden direkt, för att se anmälningar och namnval.

## Lösenordsskydd

En enda delad kod för alla gäster. Kontrolleras via Cloudflare Pages Function och lagras som cookie i webbläsaren.

## Öppna punkter

- [ ] Supabase-projekt skapas och schema definieras (guests, pirate_names)
- [ ] Piratnamn från låten Svarta Malin sammanställs
- [ ] GitHub-repo skapas och kopplas till Cloudflare Pages
- [ ] Subdomain `svartamalin.tadaa.se` konfigureras i Cloudflare DNS
