# Intriger

Statiska intrig-texter. Publiceras vid deploy. Klienten visar bara inloggad gästs egna + lagets.

**Stil & dramaturgi:** läs och följ alltid [STYLE.md](STYLE.md) innan du skriver eller ändrar intrigtext.

**Romanser (källista):** [romanser.yaml](romanser.yaml), ömsesidiga (`mutual`) och envägs (`one_way`) affärer att gå igenom item-by-item.

**Fiender (källista):** [fiender.yaml](fiender.yaml).

**Huvudstoryn** designas i [`../huvudstory/`](../huvudstory/README.md) och landar här via [`../huvudstory/fordelning.yaml`](../huvudstory/fordelning.yaml). Skriv aldrig in en huvudstory-bit i en intrigfil innan den har en post där. Lösningar, hemligheter och spelledningsinfo hör inte hit: filerna i `crews/` och `guests/` publiceras till gästerna.

## Filnamn

| Typ | Sökväg | Nyckel |
|-----|--------|--------|
| Lag | `crews/{crew_id}.md` | `crews.id` i Supabase (t.ex. `1.md`) |
| Individ | `guests/{login_slug}.md` | `guests.login_slug` (t.ex. `gustaftadaa.md`) |

Gästlistan är stängd: en fil per gäst med `attending = true` i Supabase, inget mer. Gäster som tackat nej eller inte svarat får **ingen** fil, inte ens en tom stubbe, och ska inte nämnas i lagintriger, `romanser.yaml` eller `fiender.yaml`.

## Format

Valfri frontmatter (för agenten, syns inte för gästen), sedan 2–3 intriger som `##`-rubriker.
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

## Tomma filer

Saknad fil = ingen intrig-sektion i UI. Tom body / bara frontmatter = döljs också.
