# Intriger

Statiska intrig-texter. Publiceras vid deploy. Klienten visar bara inloggad gästs egna + lagets.

Karta för hela `content/`: [`../README.md`](../README.md).

**Gästtext, följ [STYLE.md](STYLE.md):** `crews/*.md` och `guests/*.md`. Inget annat visat för deltagarna. Explicit språk OK. Register: lust och sex, inte romankärlek.

**Intern text, tydlig prosa:** den här README:n, STYLE.md, [romanser.yaml](romanser.yaml), [fiender.yaml](fiender.yaml) och [`../huvudstory/forradare.yaml`](../huvudstory/forradare.yaml). Yaml-filerna är källistor för agenten, inte gästcopy.

**Klarhetsgranskning:** varje gästfil ska stå för sig själv med sin lagfil och `copy/intriger_intro.md`. Rutin: [`clarity-review.md`](clarity-review.md). Senaste resultatet: [`clarity-audit.md`](clarity-audit.md). Kör om: `npm run clarity-review -- --write-prompts`, sedan en isolerad subagent per gäst.

**Karaktärsunderlag** från gästerna ligger i [`../roller/`](../roller/README.md) (`npm run fetch-roller`). Spegling av Supabase, rör inte. **Meta-anteckningar** (praktiskt ansvar, designbeslut) ligger i [`../anteckningar/`](../anteckningar/README.md). Läs båda innan du skriver deras intrig. Skriv inte revy tillbaka in i dem.

**Huvudstoryn** designas i [`../huvudstory/`](../huvudstory/README.md) och landar här via [`../huvudstory/fordelning.yaml`](../huvudstory/fordelning.yaml). Skriv aldrig in en huvudstory-bit i en intrigfil innan den har en post där. Lösningar, hemligheter och spelledningsinfo hör inte hit: filerna i `crews/` och `guests/` publiceras till gästerna.

Parallella spår som också designas där, inte här:

- Lagskatter: [`../huvudstory/lagskatter.md`](../huvudstory/lagskatter.md). Jakten står i `crews/`: skatten (treasure) de ska hitta, plus ingången. Inte skatten (treasure) de gömmer. Social dörr: kort intrig i **den personens** `guests/`. Cirkeln och vem som jagas står inte i gästtext. Ord: [`../huvudstory/skatt.md`](../huvudstory/skatt.md).
- Huvudjakt, generell varför: första `##` i `crews/`. Hon har en låst kista. Ta reda på hennes berättelse tillsammans. Första ledtråden sitter i gäststarten, inte här.
- Förrädare: [`../huvudstory/forradare.yaml`](../huvudstory/forradare.yaml). Mullvad och kontakt skrivs i `guests/` när status är done. Aldrig i lagfilen.

## Filnamn

| Typ | Sökväg | Nyckel |
|-----|--------|--------|
| Lag | `crews/{crew_id}.md` | `crews.id` i Supabase (t.ex. `1.md`) |
| Individ | `guests/{login_slug}.md` | `guests.login_slug` (t.ex. `gustaftadaa.md`) |

Gästlistan är stängd: en fil per gäst med `attending = true` i Supabase, inget mer. Gäster som tackat nej eller inte svarat får **ingen** fil, inte ens en tom stubbe, och ska inte nämnas i lagintriger, `romanser.yaml` eller `fiender.yaml`.

## Format

Valfri frontmatter (för agenten, syns inte för gästen), sedan 2–3 intriger som `##`-rubriker.
**Ordning i `guests/`:** 1. mullvadsintrig om personen är mullvad, 2. questintriger (start före tvärledtråd), 3. kontaktpersonintrig om personen är kontakt, 4. övriga. En person är mullvad, kontakt eller ingen av delarna, aldrig båda.
Varje rubrik annoteras med `{slug:login_slug}` för personen intrigens porträtt ska visa (syns inte i UI):

```md
---
mirrors:
  - slug: annanperson
    note: barndomskamrater (tvåvägs)
related: [annanperson, tredjeslug]
---

## Barndomskamrat med Kapten Blod {slug:annanperson}

Du och **Kapten Blod** växte upp i samma gränd …

## Hemligt uppdrag {slug:tredjeslug}

Innan gryningen ska ni …
```

- `{slug:…}` = `guests.login_slug` för den person intrigens mini-porträtt gäller. Parsas bort från rubriken i UI.
- Brödtext: `**fet**` och radbrytningar (samma som övrig sajt-copy).
- Envägsintriger (t.ex. hemlig kärlek): ingen spegel hos mottagaren; notera gärna i frontmatter.
- Tvåvägsrelationer: skriv motsvarande text i båda filerna och länka med `mirrors`.

## Synlighet

- Lagfil → alla i laget (`crew_id`).
- Gästfil → endast den gästen.
- Lagkamrater ser **inte** varandras individuella intriger.
- Sajtens [`../copy/`](../copy/) läser alla. Världs-ingången [`../copy/intriger_intro.md`](../copy/intriger_intro.md) visas **först** när intrigerna presenteras. Inget mer på skärmen (andras gästfiler, andra lagfiler, `huvudstory/`, yaml: osynligt).
- Skrivregeln: karaktären vet bara det som står i de tre. Se [STYLE.md](STYLE.md) ("Vad karaktären vet"). Lyft in det de *ska* veta, eller referera inte.
- Inte Fredag/Lördag som standardavslut. Se STYLE.md. Tid i texten bara när tidpunkten är själva saken.

## Tomma filer

Saknad fil = ingen intrig-sektion i UI. Tom body / bara frontmatter = döljs också.
