# Copy

All **brödtext på webbsidan**. Gästerna läser det här. Det är inte intern dokumentation och inte intrig.

STYLE.md gäller **inte** här. Intriger har revyröst. Copy är sajtens röst: Malin talar till gästerna på sidan, plus praktisk info (båt, packning, boende). Skriv för den som ska på festen, inte för agenten.

Inga story-hemligheter, inga lösningar, inga civilnamn på deltagare. Piratnamn när personer nämns.

Karta: [`../README.md`](../README.md).

## Publicering

Vite globbar `content/copy/*.md` i `src/components/practical-info.js` (`import.meta.glob`, raw). Nyckel = filnamn utan `.md`. En ändring här följer med nästa `npm run build` / deploy.

**Inte Supabase.** Tabellen `practical_info` används inte av sajten. Redigera md-filerna, inte databasen.

Hårdkoda inte brödtext i komponenter. Rubriker i UI (t.ex. "Boende") får ligga i koden.

## Filnamn

`{key}.md`. Exempel: `boat_friday.md` → nyckeln `boat_friday`, som `renderNarrative(..., { key: 'boat_friday' })`.

Markdown som sajten förstår: `**fet**`, `[länk](https://…)`, radbrytningar.
