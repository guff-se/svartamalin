# Huvudstory: arbetsyta

Här utvecklas **huvudstoryn** för lajvet på Ovanan 4 till 6 september 2026. Detta är arbetsmaterial för Gustaf och agenten. Ingen gäst ska läsa det.

Karta för hela `content/`: [`../README.md`](../README.md).

**Röst:** tydlig teknisk prosa. Högsta prioritet är att en framtida agent förstår filen. Ingen revyröst, ingen du-form till deltagaren, inga punchlines. STYLE.md gäller inte här. Varje fil i den här mappen inleds med samma intern-rad så det syns även om agenten öppnar bara en fil.

Publicerad gästtext: `content/intriger/crews/*.md`, `content/intriger/guests/*.md`, och sajtens brödtext i [`../copy/`](../copy/README.md). Tryckt rekvisita i [`../rekvisita/`](../rekvisita/README.md) läses på papper, inte på sajten. Allt annat under `content/` är internt.

| Vad | Var | Publiceras |
|-----|-----|-----------|
| Individuella och lagintriger | `content/intriger/{guests,crews}/*.md` | Ja, i UI per inloggad gäst |
| Gemensam världs-ingång | [`../copy/intriger_intro.md`](../copy/intriger_intro.md) | Ja, först när intrigerna visas |
| Sajtens brödtext | [`../copy/`](../copy/README.md) (bundlas vid build) | Ja |
| Tryckt rekvisita | [`../rekvisita/`](../rekvisita/README.md) | Ja på papper. Nej på sajten |
| Gästens eget underlag | `content/roller/` | Nej |
| Meta-anteckningar per person | `content/anteckningar/` | Nej |
| **Huvudstory, pussel, spelledning** | **`content/huvudstory/` (här)** | **Nej** |

`src/lib/intriger.js` globbar bara `content/intriger/crews/*.md` och `content/intriger/guests/*.md`, så filerna här bundlas inte in i klienten. De innehåller alla lösningar och all metainformation, och ska så förbli.

---

## Läsordning

1. [`premiss.md`](premiss.md) vad storyn handlar om, tema och den centrala hemligheten
2. [`kanon.md`](kanon.md) världens fakta som allt annat måste vara konsistent med. Publicerad ram: [`../copy/intriger_intro.md`](../copy/intriger_intro.md)
3. [`platser.md`](platser.md) Ovanans resurser och vilken dramaturgisk funktion varje plats har
4. [`tidslinje.md`](tidslinje.md) körschema fredag 17.15 (ankomst Ovanan) till söndag 14.00, beat för beat
5. [`akter.md`](akter.md) huvudstoryn i akter och beats, med reveal-plan och backup
6. [`sidequests.md`](sidequests.md) sidospår som bara rör vissa deltagare
7. [`quests.md`](quests.md) gemensamma regler och hur ingångstext skrivs. En fil per quest under [`quests/`](quests/). Låst story. Tillsatt mekanik sitter i questens fil.
8. [`lagskatter.md`](lagskatter.md) varje skuta gömmer en skatt (treasure), en annan skuta jagar den. Ingång: första ledtråden, inskickad av gömmarna, skriven in hos jägarna. Ord: [`skatt.md`](skatt.md) (treasure mot tax).
9. [`forradare.yaml`](forradare.yaml) mullvad och kontaktperson per skuta
10. [`pussel.md`](pussel.md) lediga pusselbyggstenar. När en bit tillsätts flyttas den till questens fil eller platsen och stryks här. Story: [`quests.md`](quests.md)
11. [`ritual.md`](ritual.md) lördag 15.30, ritualen
12. [`slutstriden.md`](slutstriden.md) lördag ca 20.00, finalen
13. [`genomgang.md`](genomgang.md) vad som sägs i de praktiska genomgångarna
14. [`spelledning.md`](spelledning.md) runtime: klockslag under spelet, hint, bypass, cryptex, Malin i roll, efter 15.30
15. [`produktion.md`](produktion.md) props, inköp, bygg, deadlines
16. [`fordelning.yaml`](fordelning.yaml) vilken deltagare som får vilken story-bit, med skrivstatus
17. [`beslut.md`](beslut.md) beslutslogg och öppna frågor
18. [`egna.md`](egna.md) checklista: saker Gustaf sagt själv, skilt från agentpåhitt
19. [`cast.md`](cast.md) referenstabell: slug, riktigt namn, piratnamn, skuta
20. [`RESEARCH.md`](RESEARCH.md) destillerad best practice för lajvintriger och escape rooms

---

## Arbetsflöde: från idé till gästtext

Storyn skrivs i två steg, och stegen får inte blandas.

**Steg 1: designa (i detta arbetsrum)**

Utveckla premiss, akter, pussel, queststories och sidequests här. Skriv rakt och tekniskt så att en framtida agent förstår utan att gissa. Ingen revyröst. Här ska det stå exakt vad lösningen är, vem som vet vad och vad som händer om ingen fattar. Queststories: [`quests.md`](quests.md) plus [`quests/`](quests/).

När Gustaf ger en idé eller ett krav: skriv in det i [`egna.md`](egna.md) med hans formulering **innan** det utvecklas i de andra filerna. Agentpåhitt får inte hamna där.

**Steg 2: distribuera (till `content/intriger/`)**

När en story-bit är beslutad läggs den in i [`fordelning.yaml`](fordelning.yaml) med mottagare och status `pending`. Först då skrivs gästtext i `content/intriger/guests/{slug}.md` eller `content/intriger/crews/{id}.md`, enligt [`../intriger/STYLE.md`](../intriger/STYLE.md), och status sätts till `done`.

Regeln är: **ingen gästtext skrivs innan story-biten finns beslutad här.** Annars uppstår motsägelser mellan filer som ingen upptäcker förrän på ön.

Mottagare får bara vara gäster med `attending = true` i Supabase. Gästlistan är stängd: den som tackat nej eller inte svarat ska inte tilldelas story-bitar, roller eller pusselnycklar, och får ingen fil i `content/intriger/guests/`.

---

## Invarianter

Fasta ramar. Ändras bara genom ett medvetet beslut som loggas i [`beslut.md`](beslut.md).

1. **24 deltagare, 5 skutor.** Ingen story-bit får kräva att fler än 24 personer finns eller att en skuta har fler än 5 medlemmar. Se [`cast.md`](cast.md).
2. **Malin är osårbar och dödar alla.** Slutet är låst: alla dödas av Svarta Malin, hon återvänder som Ran. Detta får aldrig stå i gästtext.
3. **Fredag är off-story.** Överdåd, ingen huvudstory-mekanik, inga pussel. Spelet startar på riktigt lördag förmiddag.
4. **Ritualen 15.30 är obligatorisk pivot.** Huvudstoryn måste ha ett skäl att alla samlas då, och ritualen ska förändra spelets premiss efteråt.
5. **Allt efter 15.30 måste fungera i påverkat tillstånd.** Inga pussel, ingen läsning av långa texter, ingen räkning eller logik efter ritualen. Bara kropp, bild, sång, känsla och rörelse. Se [`spelledning.md`](spelledning.md). Undantag vid 20.00: slå in sex redan kända bokstäver i cryptexen, och höra kärleksbrevet läsas högt. Ingen ny logik, ingen lång text.
6. **Play to lose gäller före all pusselmekanik.** Om ett pussel och ett drama krockar vinner dramat. Ingen deltagare får bli en flaskhals som stoppar helgen.
7. **Ingen deltagare får sakna uppgift när gästtexten är skriven.** Var och en ska ha minst en sak i huvudstoryn att vilja, veta eller bära. Kontrolleras mot [`fordelning.yaml`](fordelning.yaml) i den omgången, inte under designfasen.
8. **Alla existerande intriger är kanon.** Huvudstoryn får bygga på romanser och fiendskaper i `romanser.yaml` och `fiender.yaml`, men inte motsäga dem.
9. **Ingen story-bit får kräva mobil, nätuppkoppling eller att någon läser en skärm.** Fysiska props, skyltar, sång och prat.
10. **Sista versen i sången är finalen.** Slutstriden ska eka den, aldrig citera utgången i förväg.
11. **Allt pågår samtidigt och får kollidera.** Huvudstory, skattjakt, romanser och fiendskaper är inte isolerade spår. En skatt kan vara en pusselnyckel. Ett svek kan vara att sälja lagets skatt mot en ledtråd.
12. **Gästerna vet att det finns en huvudstory innan helgen.** De vet inte vad den är. Frön får stå i intrigfiler och i gästcopy. Fredag är fortfarande utan mekanik.
13. **Kistan öppnas vid kaviar och rom.** Cryptexens lösenord går inte att kläcka utan Malins berlock (`4X`, `5I`, `6I`), som hon sätter på under peak kl. 17.00. Cryptexen kommer in vid lunchen 14.00: Malin har den med sig. All ledtrådssamling av `1H`, `2K`, `3H` sker före 15.30. Öppnandet vid 20.00 är ceremoni. I kistan finns brev mellan Malin och kungen, plus minnen och skatter, plus en orderlapp: konfrontera Malin efter kaviar och rom. Tändningens innehåll är kärleksbrevet från Karl XII. Brevet är kontraktet och kärleksakten. Lappen är ordern att flyga på henne efter serveringen. Trycktext: [`../rekvisita/kista-karleksbrev.md`](../rekvisita/kista-karleksbrev.md), [`../rekvisita/kista-konfrontera.md`](../rekvisita/kista-konfrontera.md).
14. **Aldrig ensam på vattnet.** Off-regel, hela helgen. Ingen eka, kajak, paddel eller bad utan sällskap. Ingen story-bit, intrig eller pussel får kräva att någon åker ut eller badar själv.
15. **Båtarna sköts av Kuling och Rödskägg.** Kapten Kuling (`josefinlowing`) och Kapten Rödskägg (`viktoransund`) har hand om eka, kajak och paddel. En *skriven* intrig som kräver sjöfärd går primärt genom att övertala en av dem att ge sig ut, för spel och interaktion. Man **får** åka ut utan dem. Off-regeln är bara: aldrig ensam.
16. **Låt saker som hittas av misstag få vara.** Off-regel, sägs i genomgången. Gäster löser gåtor och uppdrag, inte brute force. Ingen story-bit, skatt eller pussel får kräva att ön ransakas. Den som råkar hitta något de inte söker lämnar det. Se [`genomgang.md`](genomgang.md).
17. **Fem parallella quests.** Inte en linjär kedja. Varje skuta har ingång till tre. Varje quest har tre skutor. Start i en spelares intrig. **Starten är första ledtråden, inte kapitlet.** Normalt ett eller två pit stops. **Q-2 är undantag: inga pit stops, inget pussel.** Skatt med cryptex-token. Tre quests ger `1H`, `2K`, `3H`. Malins berlock ger `4X`, `5I`, `6I`. Tillsammans: `HKHXII`. Varje quest har både storyline och uppgift. Q-2:s uppgift är att åka till stugan, läsa minnena, ta en token `1H`, och följa namnbladet till Ottos grav (`2K`). Storyn lär något om Malins historia och får ljuga. Den får inte röja affären eller förräderiet med Karl XII. Stories och tillsatt mekanik: [`quests.md`](quests.md), per quest i [`quests/`](quests/). Lediga byggstenar: [`pussel.md`](pussel.md).
18. **Sexpositiv fest, inte på sajten.** Alla deltagare är vana vid sexpositiva rum. Inget avgränsat play space: sex tillåtet överallt och när som helst. Sägs i genomgången. Får inte stå i `../copy/`. Intriger och rekvisita får vara explicita. Register: lust och sex, inte romankärlek. Se [`../intriger/STYLE.md`](../intriger/STYLE.md) och [`genomgang.md`](genomgang.md).
19. **Korvetten Kurtisanens quest-trådar är hemliga för Malin.** Hon är skutans egen kapten. En quest-start (Q-1 till Q-5) som ges till en av hennes skutkamrater (`petterwallberg`, `linneaappert`, `ulrikahammar`, `jesperlindmarker`, inte henne själv) ska instruera att uppdraget löses utan att Malin ser eller anar det, eftersom hon delar koj, köl och vardag med dem hela helgen. Se [`quests.md`](quests.md) regel 8.

---

## Definition of done, per story-bit

En story-bit är klar när allt nedan är sant:

- [ ] Den har en plats i [`akter.md`](akter.md) med ungefärlig klocktid
- [ ] Den har en fysisk plats på ön i [`platser.md`](platser.md)
- [ ] Den har namngivna deltagare, inte "några gäster"
- [ ] Den har en tydlig **vilja**, ett **hinder** och ett skäl att det avgörs **nu**
- [ ] Om den innehåller ett pussel: mekaniken sitter i questen eller på platsen (lösning, ledtråd, hint, bypass). Inte som fri nod i [`pussel.md`](pussel.md)
- [ ] Om den innehåller en hemlighet: minst två personer kan avslöja den, och det finns en backup om ingen gör det
- [ ] Props och bygg är listade i [`produktion.md`](produktion.md) med ansvarig
- [ ] Den finns i [`fordelning.yaml`](fordelning.yaml) med mottagare och status
- [ ] Gästtexten är skriven enligt `STYLE.md` och status är `done`

---

## Tonregler även här

De här filerna läses av Gustaf och agenten, inte av gäster. Högsta prioritet: tydlighet. Säg vad som är sant. Namnge personer med `Kapten Klöver (johannabergman)` så både piratnamn och slug syns.

- **Aldrig em dash.** Komma, kolon eller punkt istället.
- **Ingen STYLE.md här.** Revyröst, du-form och punchlines hör hemma i `content/intriger/crews/` och `content/intriger/guests/` efter att biten finns i `fordelning.yaml`.
- **skatt (treasure) och skatt (tax) är två ord.** Märk alltid vilken. Gästtext skriver bara "skatt". Ordlista: [`skatt.md`](skatt.md).
