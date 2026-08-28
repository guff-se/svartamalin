# Clarity-review: rutin

Intern. Inte gästcopy. Resultat landar i [`clarity-audit.md`](clarity-audit.md).

Syftet: varje `guests/{slug}.md` ska stå för sig själv tillsammans med läsarens lagfil och världs-ingången. En gäst har inte andras gästfiler, inte `huvudstory/`, inte yaml. Om texten nämner något som den läsaren inte kan förstå: det är en lucka.

Två sorters luckor, den andra är värre. En tredje fångar samma slags lucka i grammatiken:

1. **Oförklarad mention.** Ett föremål, en plats, en mekanik namnges som om läsaren redan visste vad det är (`krumelurpillret`).
2. **Tom kunskap.** Texten säger att *du* redan vet, har sett, har hört eller har valt en specifik sak, men säger aldrig vad saken är. Typiskt: "Du vet redan … vem hon egentligen väljer" utan att namnge valet. Läsaren kan inte spela "jag vet X" när X saknas. Sök i brödtexten efter `du vet`, `du vet redan`, `du känner till`, `du har sett`, `bara du vet`, `du är den enda som vet`, `du har hört`. Fråga: kan jag, bara från de tre filerna, säga *vad* det är jag vet? Om nej: tom kunskap. Inte `du vet inte` / `du anar inte` (det är avsiktlig okunskap). Inte kunskap som samma stycke just har sagt. Inte lagskatternas dörrar (lagen byggde dem). Om texten sen säger åt läsaren att agera på faktumet (säga, tiga, använda, välja): **rött**.
3. **Bestämd form utan intro.** Första nämnandet av en sak i bestämd form (`skålen`, `jollen`) som om läsaren redan visste vilken. Typiskt med relativsats: `jollen du kapade i dimman`, `skålen där du kallade henne…`. Flagga även då, när det är första gången saken nämns. Inte: festen, hamnen, ön, kajen, gymmet, Storstugan, lagskattdörrar, kroppsdelar, eller något som redan presenterats som `en X` / `ett X`. Scriptet listar kandidater via `--scan` (bestämd form + där/som/du/hon/han) och stoppar in dem i prompten. Auditorn avgör.

Verifierat 2026-08-28 mot `malintadaa` ("Skålen hon aldrig glömde"): `skålen`, `jollen`.

## Vad en granskare får

En subagent per gäst. Inget mer i kontextfönstret.

1. Den gästens `guests/{slug}.md`.
2. Den gästens lags `crews/{crew_id}.md`.
3. [`../copy/intriger_intro.md`](../copy/intriger_intro.md) (världs-ingången, samma för alla).
4. En roster: de fem lagnamnen och alla piratnamn + lag. Läsarens eget namn och lag är utmärkta. Rostern är känd för läsaren. Flagga inte namnen som oförklarade.

YAML mellan `---` och `{slug:…}` i rubriker syns inte för gästen. Subagenten ska ignorera dem.

### Undantag (flagga inte)

- **Gubben i stubben / Gumman på udden.** Ledtrådar som går att lista ut från namnen. Ingen ytterligare förklaring.
- **Dörrar till lagskatter.** Lagen byggde dem själva och vet hur de ska hanteras. Det som står i intrigerna (siffra till kod, nästa ledtråd, akilleshäl, första steget mot en annan skutas skatt) är en påminnelse, inte en ny mekanik. Malins låsta kista är inte en lagskatt.
- **Salmonellahavet, Ovanan.** Kända ord.
- **Gymmet, Storstugan.** Byggnader på ön. Inga förklaringar.
- **Svarta Malins hemliga älskare.** Identiteten är en hemlighet `malintadaa` redan bär. Namnet ska inte stå i gästtext. Flagga inte att älskaren är namnlös, varken hos Malin eller hos den som jagar namnet. **Kapten Dunka** som synlig avledning är avsiktlig.

## Vad en granskare inte får

Inga andra filer. Ingen `roller/`, `anteckningar/`, övrig `copy/`, `huvudstory/`, yaml, STYLE.md, tidigare audit, andras gästfiler. Ingen worldbuilding utöver rostern, introt och undantagen. Subagenten får inte gissa från träning.

## Betyg

| Betyg | Betydelse |
|---|---|
| green | Läsaren kan agera på allt. Kvarvarande frågor är smak, inte blockerare. |
| yellow | Går att spela, men nämnda saker saknar förklaring. |
| red | En central handling/instruktion går inte att förstå utan att gissa. Tom kunskap som läsaren ska agera på är rött. |

Output per gäst, på svenska, exakt:

```
RATING: green | yellow | red
TERMS: kommaseparerad lista (oförklarade mentions, tom kunskap, bestämd form utan intro), eller "none"
EMPTY-KNOWLEDGE: varje påstående där texten säger att du redan vet något utan att säga vad, eller "none"
UNDERSTANDING: 4-8 meningar. Vem du är, vad du vill i helgen, vad som är oklart.
```

Inga omskrivningsförslag från subagenten.

## Kör om (Cursor)

Parent-agenten (den här chatten) gör jobbet. Subagenterna läser bara tre filer.

1. Kör `npm run clarity-review -- --write-prompts`. Scriptet läser `guests/`, `crews/` och `roller/` och skriver en promptfil per gäst under `tmp/clarity-review/` (gitignoreras). Prompttexten ägs av [`scripts/clarity-review.js`](../../scripts/clarity-review.js). Ändra den där, inte här.
2. Spawna **en** Task-subagent per slug. `subagent_type: generalPurpose`. Prompt = innehållet i `tmp/clarity-review/{slug}.txt`. En karaktär per agent. Parallellt. Ge inte extra text i prompten.
3. Subagenten får bara använda Read på de tre sökvägar som står i prompten. Inget Grep, inget Glob, inga andra filer.
4. Samla `RATING`, `TERMS`, `UNDERSTANDING` från varje agent.
5. Skriv en **ny runda** överst i [`clarity-audit.md`](clarity-audit.md). Behåll äldre rundor som arkiv. Rör inte gästtexterna i samma svep (granskning och omskrivning är två uppgifter).
6. Committa audit-filen när rundan är klar.

En gäst: `node scripts/clarity-review.js --prompt malintadaa`.

Bestämd form (heuristik): `node scripts/clarity-review.js --scan malintadaa`.

Lista: `npm run clarity-review`.

Roster utan prompt: `node scripts/clarity-review.js --json`.

## Rapportens form

Ny runda överst, med datum och metod (vad subagenterna faktiskt fick). Sedan:

- Antal green / yellow / red.
- Rött: vad som blockerar, och en åtgärd.
- Tabell per gäst: slug, piratnamn, lag, betyg, termer, tom kunskap.
- Mönster: tom kunskap (du-vet utan innehåll) vs oförklarade mentions vs jakt som är tänkt att vara ofullständig (Malins kista). Flagga inte undantagen.

Aktuell mall: gästfil + lagfil + `intriger_intro.md` + roster + undantagen. Äldre rundor (1-3) är arkiv. Kör inte dem om ingen ber om det.

## Vem som ingår

Alla filer i `guests/*.md`. Det är attending-listan. Scriptet tar piratnamn och lagnamn från `roller/{slug}.md`. Saknas roller: `anteckningar/{slug}.md` för piratnamn, `crews/{id}.md` för lagnamn.

## Inte den här rutinen

- Inte att skriva om texterna. Det är ett separat pass efter audit.
- Inte att verifiera i browsern.
- Inte att läsa `huvudstory/` för att "förklara" vad agenten inte förstod.
