# Intriger

Statiska intrig-texter. Publiceras vid deploy. Klienten visar bara inloggad gästs egna + lagets.

## Filnamn

| Typ | Sökväg | Nyckel |
|-----|--------|--------|
| Lag | `crews/{crew_id}.md` | `crews.id` i Supabase (t.ex. `1.md`) |
| Individ | `guests/{login_slug}.md` | `guests.login_slug` (t.ex. `gustaftadaa.md`) |

## Format

Valfri frontmatter (för agenten — syns inte för gästen), sedan 2–3 intriger som `##`-rubriker:

```md
---
mirrors:
  - slug: annanperson
    note: barndomskamrater (tvåvägs)
related: [annanperson, tredjeslug]
---

## Barndomskamrat med Kapten Blod

Du och **Kapten Blod** växte upp i samma gränd …

## Hemligt uppdrag

Innan gryningen ska ni …
```

- Brödtext: `**fet**` och radbrytningar (samma som övrig sajt-copy).
- Envägsintriger (t.ex. hemlig kärlek): ingen spegel hos mottagaren; notera gärna i frontmatter.
- Tvåvägsrelationer: skriv motsvarande text i båda filerna och länka med `mirrors`.

## Synlighet

- Lagfil → alla i laget (`crew_id`).
- Gästfil → endast den gästen.
- Lagkamrater ser **inte** varandras individuella intriger.

## Tomma filer

Saknad fil = ingen intrig-sektion i UI. Tom body / bara frontmatter = döljs också.
