# Roller

Gästernas **eget karaktärsunderlag**, hämtat från Supabase. Intern källa för Gustaf och agenten. Publiceras aldrig. Gäster ska inte läsa de här filerna.

Karta: [`../README.md`](../README.md). STYLE.md gäller inte här. Filerna är **gästens egna ord** från formuläret. Skriv inte om dem till revy, du-form eller "tydligare" agentprosa. Nästa `npm run fetch-roller` skriver över handändringar. `src/lib/intriger.js` globbar bara `content/intriger/crews/` och `content/intriger/guests/`.

Läs dessa innan du skriver eller ändrar en gästintrig i [`../intriger/guests/`](../intriger/guests/). Läs också [`../anteckningar/{slug}.md`](../anteckningar/) för meta-anteckningar. Civilnamn får stå här (fältet Övrigt nämner ofta personer vid riktigt namn). I gästvänd intrigtext används bara piratnamn, se [`../intriger/STYLE.md`](../intriger/STYLE.md).

## Uppdatera

```bash
npm run fetch-roller
```

Skriptet (`scripts/fetch-roller.js`) hämtar live-data, **diffar varje `{login_slug}.md`** mot det som redan ligger på disk, och skriver bara om filer som faktiskt ändrats. Tomma fält betyder att deltagaren inte fyllt i något. Redigera inte gästfilerna för hand: nästa körning skriver över dem.

Bara gäster med `attending = true`. Gäster som tackat nej eller inte svarat får ingen fil; stale filer tas bort vid nästa körning.

Underlaget är input till intrigskrivningen. Intrigerna skrivs inte förrän designen i [`../huvudstory/`](../huvudstory/) är klar. Hämta om underlaget ändras. Jämför mot git, inte mot en separat ändringslogg.

## Filnamn

`{login_slug}.md`, samma nyckel som [`../intriger/guests/`](../intriger/guests/) och [`../huvudstory/cast.md`](../huvudstory/cast.md).

## Fält

DB-kolumnerna är lite missvisande döpta. Rubrikerna i md-filerna är den semantik agenten ska använda:

| Rubrik | DB-kolumn | Vad det är |
|--------|-----------|------------|
| **Karaktär** | `character_facts` | Deltagaren berättar fritt om karaktären hen vill spela. |
| **Föremål** | `character_object` | Ett föremål hen har med sig. Kan skrivas in som föremål i en **annan** deltagares intrig. |
| **Göra / inte göra** | `character_skill` | Blandning av praktiska ansvar och saker hen vill **göra** eller **inte göra** under helgen. |
| **Övrigt** | `character_play_with` | Instruktion till intrigförfattaren: personliga önskemål, t.ex. att spela med en speciell person. |

## Format

```md
---
slug: gustaftadaa
real_name: Gustaf Tadaa
pirate_name: Löjtnant Spader
crew_id: 2
crew: Fregatten Fördärvet
---

# Löjtnant Spader

Gustaf Tadaa · Fregatten Fördärvet

## Karaktär

…

## Föremål

…

## Göra / inte göra

…

## Övrigt

…
```

Tomma svar renderas som `_Tomt._`.
