# Huvudstory: arbetsyta

Här utvecklas **huvudstoryn** för lajvet på Ovanan 4 till 6 september 2026. Detta är arbetsmaterial för arrangörerna, inte gästvänd text.

Publicerad gästtext bor i två andra ställen och ska aldrig blandas in här:

| Vad | Var | Publiceras |
|-----|-----|-----------|
| Individuella och lagintriger | `content/intriger/{guests,crews}/*.md` | Ja, i UI per inloggad gäst |
| Praktisk copy | `practical_info` i Supabase (seed i `supabase/practical_info_seed.sql`) | Ja |
| **Huvudstory, pussel, spelledning** | **`content/huvudstory/` (här)** | **Nej** |

`src/lib/intriger.js` globbar bara `content/intriger/crews/*.md` och `content/intriger/guests/*.md`, så filerna här bundlas inte in i klienten. De innehåller alla lösningar och all metainformation, och ska så förbli.

---

## Läsordning

1. [`premiss.md`](premiss.md) vad storyn handlar om, tema och den centrala hemligheten
2. [`kanon.md`](kanon.md) världens fakta som allt annat måste vara konsistent med
3. [`platser.md`](platser.md) Ovanans resurser och vilken dramaturgisk funktion varje plats har
4. [`tidslinje.md`](tidslinje.md) körschema fredag 17.00 till söndag 14.00, beat för beat
5. [`akter.md`](akter.md) huvudstoryn i akter och beats, med reveal-plan och backup
6. [`sidequests.md`](sidequests.md) sidospår som bara rör vissa deltagare
7. [`pussel.md`](pussel.md) escape-room-mekaniken, pusselkedjor och ledtrådsdesign
8. [`ritual.md`](ritual.md) lördag 15.30, ritualen
9. [`slutstriden.md`](slutstriden.md) lördag ca 20.00, finalen
10. [`spelledning.md`](spelledning.md) runtime: signaler, säkerhet, nödbromsar, vem gör vad
11. [`produktion.md`](produktion.md) props, inköp, bygg, deadlines
12. [`fordelning.yaml`](fordelning.yaml) vilken deltagare som får vilken story-bit, med skrivstatus
13. [`beslut.md`](beslut.md) beslutslogg och öppna frågor
14. [`cast.md`](cast.md) referenstabell: slug, riktigt namn, piratnamn, skuta
15. [`RESEARCH.md`](RESEARCH.md) destillerad best practice för lajvintriger och escape rooms

---

## Arbetsflöde: från idé till gästtext

Storyn skrivs i två steg, och stegen får inte blandas.

**Steg 1: designa (i detta arbetsrum)**

Utveckla premiss, akter, pussel och sidequests här. Skriv rakt, tydligt och tekniskt. Ingen revyröst. Här ska det stå exakt vad lösningen är, vem som vet vad och vad som händer om ingen fattar.

**Steg 2: distribuera (till `content/intriger/`)**

När en story-bit är beslutad läggs den in i [`fordelning.yaml`](fordelning.yaml) med mottagare och status `pending`. Först då skrivs gästtext i `content/intriger/guests/{slug}.md` eller `content/intriger/crews/{id}.md`, enligt [`../intriger/STYLE.md`](../intriger/STYLE.md), och status sätts till `done`.

Regeln är: **ingen gästtext skrivs innan story-biten finns beslutad här.** Annars uppstår motsägelser mellan filer som ingen upptäcker förrän på ön.

Mottagare får bara vara gäster med `attending = true` i Supabase. Gästlistan är stängd — den som tackat nej eller inte svarat ska inte tilldelas story-bitar, roller eller pusselnycklar, och får ingen fil i `content/intriger/guests/`.

---

## Invarianter

Fasta ramar. Ändras bara genom ett medvetet beslut som loggas i [`beslut.md`](beslut.md).

1. **26 deltagare, 5 skutor.** Ingen story-bit får kräva att fler än 26 personer finns eller att en skuta har fler än 6 medlemmar. Se [`cast.md`](cast.md).
2. **Malin är osårbar och dödar alla.** Slutet är låst: alla dödas av Svarta Malin, hon återvänder som Ran. Detta får aldrig stå i gästtext.
3. **Fredag är off-story.** Överdåd, ingen huvudstory-mekanik, inga pussel. Spelet startar på riktigt lördag förmiddag.
4. **Ritualen 15.30 är obligatorisk pivot.** Huvudstoryn måste ha ett skäl att alla samlas då, och ritualen ska förändra spelets premiss efteråt.
5. **Allt efter 15.30 måste fungera i påverkat tillstånd.** Inga pussel, ingen läsning av långa texter, ingen räkning eller logik efter ritualen. Bara kropp, bild, sång, känsla och rörelse. Se [`spelledning.md`](spelledning.md).
6. **Play to lose gäller före all pusselmekanik.** Om ett pussel och ett drama krockar vinner dramat. Ingen deltagare får bli en flaskhals som stoppar helgen.
7. **Ingen deltagare får sakna uppgift.** Var och en ska ha minst en sak i huvudstoryn att vilja, veta eller bära. Kontrolleras mot [`fordelning.yaml`](fordelning.yaml).
8. **Alla existerande intriger är kanon.** Huvudstoryn får bygga på romanser och fiendskaper i `romanser.yaml` och `fiender.yaml`, men inte motsäga dem.
9. **Ingen story-bit får kräva mobil, nätuppkoppling eller att någon läser en skärm.** Fysiska props, skyltar, sång och prat.
10. **Sista versen i sången är finalen.** Slutstriden ska eka den, aldrig citera utgången i förväg.

---

## Definition of done, per story-bit

En story-bit är klar när allt nedan är sant:

- [ ] Den har en plats i [`akter.md`](akter.md) med ungefärlig klocktid
- [ ] Den har en fysisk plats på ön i [`platser.md`](platser.md)
- [ ] Den har namngivna deltagare, inte "några gäster"
- [ ] Den har en tydlig **vilja**, ett **hinder** och ett skäl att det avgörs **nu**
- [ ] Om den innehåller ett pussel: pusslet finns som nod i [`pussel.md`](pussel.md) med lösning, ledtråd, hint-trappa och bypass
- [ ] Om den innehåller en hemlighet: minst två personer kan avslöja den, och det finns en backup om ingen gör det
- [ ] Props och bygg är listade i [`produktion.md`](produktion.md) med ansvarig
- [ ] Den finns i [`fordelning.yaml`](fordelning.yaml) med mottagare och status
- [ ] Gästtexten är skriven enligt `STYLE.md` och status är `done`

---

## Tonregler även här

Arbetsdokumenten får vara torra och tydliga. Men två saker gäller överallt i repot:

- **Aldrig em dash.** Komma, kolon eller punkt istället.
- **Piratnamn i allt som ska bli gästtext.** I arbetsdokumenten är det praktiskt att skriva `Kapten Enben (amaliawahlstrom)` så vi vet vem vi menar.
