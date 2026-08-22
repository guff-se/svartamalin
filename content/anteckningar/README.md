# Anteckningar

Arrangörens och agentens **meta-anteckningar** per deltagare. Intern text för Gustaf och agenten. Publiceras aldrig. Gäster ska inte läsa de här filerna.

Karta: [`../README.md`](../README.md). STYLE.md gäller inte här. Högsta prioritet: en framtida agent ska förstå filen. Tydligt, inte poetiskt. Ingen revyröst, ingen du-form till deltagaren.

`src/lib/intriger.js` globbar bara `content/intriger/crews/` och `content/intriger/guests/`.

Tre filer per gäst, tre källor:

| Vad | Var | Vem skriver | Publiceras |
|-----|-----|-------------|------------|
| Gästens eget underlag | [`../roller/{slug}.md`](../roller/) | Gästen, via `npm run fetch-roller` | Nej |
| Färdiga intriger | [`../intriger/guests/{slug}.md`](../intriger/guests/) | Arrangör/agent, enligt STYLE.md | Ja |
| **Meta-anteckningar** | **`{slug}.md` här** | Arrangör och agent, för hand | **Nej** |

Läs både `roller/` och den här filen innan du skriver eller ändrar en gästintrig. Skriv det som inte hör hemma i underlaget (gästens röst) och inte i intrigerna (gästens ögon): praktiskt ansvar, designbeslut, saker att undvika.

Civilnamn får stå här. I gästvänd intrigtext används bara piratnamn.

## Filnamn

`{login_slug}.md`, samma nyckel som `roller/` och `intriger/guests/`. En fil per gäst med `attending = true`. Skapa inte filer för den som tackat nej.

Redigera för hand. `fetch-roller` rör inte den här mappen.

## Format

```md
---
slug: josefinlowing
pirate_name: Kapten Kuling
real_name: Josefin Löwing
---

# Kapten Kuling

Fria anteckningar. Korta. Ett faktum per rad duger. Skriv `Piratnamn (slug)` när du nämner någon. Tom body betyder att det inte finns extra meta, inte att filen saknas.
```

Tom body är okej. Då finns filen, men inget att läsa.

## Praktiska ansvar (snabböversikt)

| Ansvar | Vem |
|--------|-----|
| Spelledning | **Löjtnant Spader** (`gustaftadaa`). Inte mullvad, inte kontakt. |
| Båtar | **Kapten Kuling** (`josefinlowing`), **Kapten Rödskägg** (`viktoransund`). Inte mullvad. |
| Mat | **Kapten Nykter** (`fabianmacklin`), **Kapten Hjärter** (`jesperlejfjord`). Inte mullvad. |
| Jagar Malins hemliga älskare | **Kapten Hjärter**, **Katten Felix** (`elinamelakoski`), **Kapten Blodig** (`minimacklin`) |
| Skäggtrion | **Kapten Lösskägg** (`petterwallberg`), **Kapten Rödskägg**, **Kapten Blåskägg** (`hampuslindblad`). Beslutad, intrigtext TBD. |

Nykter vakt vid ritualen är TBD. Förrädare per skuta: [`../huvudstory/forradare.yaml`](../huvudstory/forradare.yaml). Skriv inte gästtext som låser dem förrän status är done.

## Uppslag, inte tillsatt

Korta flaggor i personfilerna, inte beslut:

| Uppslag | Vem |
|---------|-----|
| Enben mot Malin | **Kapten Enben** (`amaliawahlstrom`) |
| Rötägg som skurk | **Kapten Rötägg** (`edvinthungren`) |
