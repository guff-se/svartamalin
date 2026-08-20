# content/

Två slags gästtext, och intern text. Blanda inte ihop dem.

Gäster läser:

- **Intriger** i `intriger/crews/` och `intriger/guests/` (inloggad, per person/lag)
- **Sajtcopy** i `copy/` (all brödtext på webbsidan)

Allt annat under `content/` läses av Gustaf och av framtida agenter. Ingen gäst ska se det.

---

## Gästtext

| Vad | Var | Röst |
|-----|-----|------|
| Lagintriger | [`intriger/crews/{id}.md`](intriger/crews/) | [`intriger/STYLE.md`](intriger/STYLE.md) |
| Individintriger | [`intriger/guests/{slug}.md`](intriger/guests/) | samma |
| Sajtens brödtext | [`copy/{key}.md`](copy/README.md) | Sajtrösten. **Inte** STYLE.md. |

`src/lib/intriger.js` globbar `crews/*.md` och `guests/*.md`. `src/components/practical-info.js` globbar `copy/*.md`. Båda bundlas vid build. Copy ligger **inte** i Supabase.

STYLE.md gäller **bara** intrigfilerna. Skriv aldrig revyintriger i `copy/`, `huvudstory/` eller någon annanstans "för att det ska kännas som lajvet".

Format och gästlista för intriger: [`intriger/README.md`](intriger/README.md).

---

## Intern text (Gustaf + agent)

Högsta prioritet: **en framtida agent ska kunna läsa filen och förstå den**. Tydligt före vackert. Säg vad som är sant, vem som vet vad, vad som händer om ingen fattar. Civilnamn och `login_slug` är tillåtna. Piratnamn skrivs som `Kapten Enben (amaliawahlstrom)` när båda behövs.

Skriv inte som om gästen läser. Ingen revyröst, ingen du-form till deltagaren, inga punchlines.

| Vad | Var | Publiceras |
|-----|-----|-----------|
| Huvudstory, pussel, spelledning | [`huvudstory/`](huvudstory/README.md) | Nej |
| Gästens eget karaktärsunderlag | [`roller/`](roller/README.md) | Nej |
| Meta-anteckningar per person | [`anteckningar/`](anteckningar/README.md) | Nej |
| Romanser och fiender (källistor) | [`intriger/romanser.yaml`](intriger/romanser.yaml), [`intriger/fiender.yaml`](intriger/fiender.yaml) | Nej |

Gäller överallt i `content/`:

- **Aldrig em dash.** Komma, kolon eller punkt.
- **Inga lösningar i gästfilerna.** Hemligheter, facit och spelledning stannar i `huvudstory/`. Det gäller både intrigfiler och `copy/`.

---

## Arbetsordning (intriger)

1. Designa i `huvudstory/` (rak prosa).
2. Fördela i `huvudstory/fordelning.yaml`.
3. Först då skriv gästtext i `intriger/crews/` eller `intriger/guests/` enligt STYLE.md.
