# Clarity-review: rutin

Intern. Inte gästcopy. Resultat landar i [`clarity-audit.md`](clarity-audit.md).

Syftet: varje `guests/{slug}.md` ska stå för sig själv tillsammans med läsarens lagfil. En gäst har inte andras gästfiler, inte `huvudstory/`, inte yaml. Om texten nämner något som den läsaren inte kan förstå: det är en lucka.

## Vad en granskare får

En subagent per gäst. Inget mer i kontextfönstret.

1. Den gästens `guests/{slug}.md`.
2. Den gästens lags `crews/{crew_id}.md`.
3. En roster: de fem lagnamnen och alla piratnamn + lag. Läsarens eget namn och lag är utmärkta. Rostern är känd för läsaren. Flagga inte namnen som oförklarade.

YAML mellan `---` och `{slug:…}` i rubriker syns inte för gästen. Subagenten ska ignorera dem.

## Vad en granskare inte får

Inga andra filer. Ingen `roller/`, `anteckningar/`, `copy/`, `huvudstory/`, yaml, STYLE.md, tidigare audit, andras gästfiler. Ingen worldbuilding utöver rostern. Subagenten får inte gissa från träning.

`copy/intriger_intro.md` läser en verklig gäst. Den här rundan ger den **inte**. Världsnamn som `Salmonellahavet` och `Ovanan` kommer därför ofta som gult. I rapporten: lista dem, men skilj dem från luckor i *den här* personens handling.

## Betyg

| Betyg | Betydelse |
|---|---|
| green | Läsaren kan agera på allt. Kvarvarande frågor är smak, inte blockerare. |
| yellow | Går att spela, men nämnda saker saknar förklaring. |
| red | En central handling/instruktion går inte att förstå utan att gissa. |

Output per gäst, på svenska, exakt:

```
RATING: green | yellow | red
TERMS: kommaseparerad lista, eller "none"
UNDERSTANDING: 4-8 meningar. Vem du är, vad du vill i helgen, vad som är oklart.
```

Inga omskrivningsförslag från subagenten.

## Kör om (Cursor)

Parent-agenten (den här chatten) gör jobbet. Subagenterna läser bara två filer.

1. Kör `npm run clarity-review -- --write-prompts`. Scriptet läser `guests/`, `crews/` och `roller/` och skriver en promptfil per gäst under `tmp/clarity-review/` (gitignoreras). Prompttexten ägs av [`scripts/clarity-review.js`](../../scripts/clarity-review.js). Ändra den där, inte här.
2. Spawna **en** Task-subagent per slug. `subagent_type: generalPurpose`. Prompt = innehållet i `tmp/clarity-review/{slug}.txt`. En karaktär per agent. Parallellt. Ge inte extra text i prompten.
3. Subagenten får bara använda Read på de två sökvägar som står i prompten. Inget Grep, inget Glob, inga andra filer.
4. Samla `RATING`, `TERMS`, `UNDERSTANDING` från varje agent.
5. Skriv en **ny runda** överst i [`clarity-audit.md`](clarity-audit.md). Behåll äldre rundor som arkiv. Rör inte gästtexterna i samma svep (granskning och omskrivning är två uppgifter).
6. Committa audit-filen när rundan är klar.

En gäst: `node scripts/clarity-review.js --prompt navidmodiri`.

Lista: `npm run clarity-review`.

Roster utan prompt: `node scripts/clarity-review.js --json`.

## Rapportens form

Ny runda överst, med datum och metod (vad subagenterna faktiskt fick). Sedan:

- Antal green / yellow / red.
- Rött: vad som blockerar, och en åtgärd.
- Tabell per gäst: slug, piratnamn, lag, betyg, termer.
- Mönster: verkliga luckor (fix i gästtexten) vs jakt som är tänkt att vara ofullständig vs världsnamn som copy redan täcker.

Runda 3 (2026-08-28) är mallen: gästfil + lagfil + roster. Runda 2 gav också `roller/`. Runda 1 var bara gästfil. Kör inte runda 1 eller 2 om ingen ber om det.

## Vem som ingår

Alla filer i `guests/*.md`. Det är attending-listan. Scriptet tar piratnamn och lagnamn från `roller/{slug}.md`. Saknas roller: `anteckningar/{slug}.md` för piratnamn, `crews/{id}.md` för lagnamn.

## Inte den här rutinen

- Inte att skriva om texterna. Det är ett separat pass efter audit.
- Inte att verifiera i browsern.
- Inte att läsa `huvudstory/` för att "förklara" vad agenten inte förstod.
