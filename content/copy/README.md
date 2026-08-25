# Copy

All **brödtext på webbsidan**. Gästerna läser det här. Det är inte intern dokumentation och inte intrig.

STYLE.md gäller **inte** här. Intriger har revyröst. Copy är sajtens röst: Malin talar till gästerna på sidan, plus praktisk info (båt, packning, boende). Skriv för den som ska på festen, inte för agenten.

Inga story-hemligheter, inga lösningar, inga civilnamn på deltagare. Piratnamn när personer nämns.

Skriv **inte** att festen är sexpositiv, att sex är tillåtet, eller att det finns eller saknas play space. Det sägs på plats, i den praktiska genomgången. Se [`../huvudstory/spelledning.md`](../huvudstory/spelledning.md). Explicit språk hör hemma i intrigerna, inte här.

Karta: [`../README.md`](../README.md).

## Publicering

Vite globbar `content/copy/*.md` i `src/components/practical-info.js` (`import.meta.glob`, raw). Nyckel = filnamn utan `.md`. En ändring här följer med nästa `npm run build` / deploy.

**Inte Supabase.** Tabellen `practical_info` används inte av sajten. Redigera md-filerna, inte databasen.

Hårdkoda inte brödtext i komponenter. Underrubriker i Praktiskt (`### Överfart`, `### Sova` osv.) ligger i md-filerna, inte i HTML. Undantag: dynamiska rubriker som »Din sovplats«.

## Filnamn

`{key}.md`. Exempel: `boat_friday.md` → nyckeln `boat_friday`, som `renderNarrative(..., { key: 'boat_friday' })`.

**Världs-ingång:** [`intriger_intro.md`](intriger_intro.md) är huvudstoryns gemensamma ram (år 1702, kapare och pirater, Svarta Malin) men publiceras som copy. Den visas först när intrigerna presenteras, i `src/components/my-crew.js`. Inte STYLE.md. Inte affären med kungen. Kanon: [`../huvudstory/kanon.md`](../huvudstory/kanon.md).

Markdown som sajten förstår: `##`/`###`/`####`-rubriker, `**fet**`, `[länk](https://…)`, radbrytningar.
