# content/

Två slags gästtext på skärm, en på papper, och intern text. Blanda inte ihop dem.

Gäster läser:

- **Intriger** i `intriger/crews/` och `intriger/guests/` (inloggad, per person/lag). En gäst ser **bara** sin egen gästfil och sin lagfil, plus copy. Inte andras. Gemensam världs-ingång först: [`copy/intriger_intro.md`](copy/intriger_intro.md).
- **Sajtcopy** i `copy/` (all brödtext på webbsidan)
- **Rekvisita** i `rekvisita/` (på papper, på ön, inte på sajten)

Allt annat under `content/` läses av Gustaf och av framtida agenter. Ingen gäst ska se det.

---

## Gästtext

| Vad | Var | Röst |
|-----|-----|------|
| Lagintriger | [`intriger/crews/{id}.md`](intriger/crews/) | [`intriger/STYLE.md`](intriger/STYLE.md) |
| Individintriger | [`intriger/guests/{slug}.md`](intriger/guests/) | samma |
| Gemensam världs-ingång | [`copy/intriger_intro.md`](copy/intriger_intro.md) | Piratrevy, ni-form. Visas först när intrigerna presenteras. |
| Sajtens brödtext | [`copy/{key}.md`](copy/README.md) | Sajtrösten. **Inte** STYLE.md. |
| Tryckt rekvisita | [`rekvisita/`](rekvisita/README.md) | Den fiktiva avsändaren. **Inte** STYLE.md. Inte på sajten. YAML-taggar, max 10 rader meta, sedan `## Tryck`. |

`src/lib/intriger.js` globbar `crews/*.md` och `guests/*.md`. `src/components/practical-info.js` globbar `copy/*.md`. Båda bundlas vid build. Copy ligger **inte** i Supabase. `rekvisita/` globbas inte.

STYLE.md gäller **bara** intrigfilerna. Skriv aldrig revyintriger i `copy/`, `rekvisita/`, `huvudstory/` eller någon annanstans "för att det ska kännas som lajvet".

Format och gästlista för intriger: [`intriger/README.md`](intriger/README.md).

---

## Intern text (Gustaf + agent)

Högsta prioritet: **en framtida agent ska kunna läsa filen och förstå den**. Tydligt före vackert. Säg vad som är sant, vem som vet vad, vad som händer om ingen fattar. Civilnamn och `login_slug` är tillåtna. Piratnamn skrivs som `Kapten Enben (amaliawahlstrom)` när båda behövs.

Skriv inte som om gästen läser. Ingen revyröst, ingen du-form till deltagaren, inga punchlines.

| Vad | Var | Publiceras |
|-----|-----|-----------|
| Huvudstory, pussel, spelledning | [`huvudstory/`](huvudstory/README.md) | Nej |
| Tryckt rekvisita (källtext) | [`rekvisita/`](rekvisita/README.md) | Nej på sajten. Ja på papper, på ön. |
| Gästens eget karaktärsunderlag | [`roller/`](roller/README.md) | Nej |
| Meta-anteckningar per person | [`anteckningar/`](anteckningar/README.md) | Nej |
| Romanser, fiender, förrädare (källistor) | [`intriger/romanser.yaml`](intriger/romanser.yaml), [`intriger/fiender.yaml`](intriger/fiender.yaml), [`huvudstory/forradare.yaml`](huvudstory/forradare.yaml) | Nej |

Gäller överallt i `content/`:

- **Aldrig em dash.** Komma, kolon eller punkt.
- **Inga lösningar i gästfilerna.** Hemligheter, facit och spelledning stannar i `huvudstory/`. Det gäller intrigfiler och `copy/`. Rekvisita i kistan får bära sanningen, det är därför den ligger där.
- **Sexpositiv fest, inte på sajten.** Alla är vana vid sexpositiva rum. Inget play space: sex överallt, när som helst. Sägs i genomgången på plats. Får inte stå i `copy/`. Intriger och rekvisita får vara explicita. Register och exempel: [`intriger/STYLE.md`](intriger/STYLE.md).

---

## Arbetsordning (intriger)

1. Designa i `huvudstory/` (rak prosa).
2. Fördela i `huvudstory/fordelning.yaml`.
3. Först då skriv gästtext i `intriger/crews/` eller `intriger/guests/` enligt STYLE.md.
