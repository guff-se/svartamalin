# Sidequests

Intern text för Gustaf och agenten. Gäster läser inte detta. Tydlig prosa, ingen STYLE.md.

Sidospår i huvudstoryn som bara rör vissa deltagare. Skiljer sig från de individuella intrigerna i `../intriger/guests/` på ett sätt: **sidequests är kopplade till huvudstoryn**, romanser och fiendskaper är inte.

En sidequest är kort. En sak att göra, en person att göra den med eller mot, ett skäl att det sker under helgen.

---

## Sidequest-mall

```
## S-nn: Namn

Akt:            I / II / III / IV
Deltagare:      Piratnamn (slug), ...
Roll i storyn:  bärare / jägare / grindvakt / vittne
Kopplad till:   B-nn i akter.md, Q-n i quests/Q-n.md

Vad de vill:    
Vad står i vägen:
Varför nu:      

Hur det spelas: konkret, alltså vad personen faktiskt gör på ön
Utfall om ja:   
Utfall om nej:  

Bygger på:      befintlig romans eller fiendskap, med id ur romanser.yaml / fiender.yaml
Speglas hos:    slugs som behöver motsvarande text
Status:         idé / beslutad / skriven
```

---

## Register

| id | Namn | Deltagare | Akt | Roll | Status |
|----|------|-----------|-----|------|--------|
| S-01 | Jakten på älskaren | Hjärter, Blodig. Malin leder fel. | II | jägare / bärare | skriven |
| S-02 | Skäggtrion | Lösskägg, Rödskägg, Blåskägg, Klöver | II | rivaler / hetsare | skriven |
| S-03 | Krumelurpillren | Barnsben, Nykter, Rosing, Babord | II | jägare / bärare | skriven |
| S-04 | Liggaren | Hurring, Fuling, Klöver, Prygel, Blåskägg, Spader | II | jägare / bärare / vittne | skriven |
| S-05 | Arvssyndsskatten | Kosing, Kuling, Rötägg, Nykter, Klöver | II | grindvakt / bärare / vittne | skriven |
| S-06 | Räkningen mot Malin | Kuling, Plåthorn, Malin, Hurring | II–IV | jägare / antagonist / vittne | skriven |
| S-07 | Rötäggets bevis | Rötägg, Planka, Barnsben, Nykter | II | bärare / jägare / vittne | skriven |
| S-08 | Jakten på kåthornet | Plåthorn, Kuling, Prygel, Rosing, Spader | II–IV | grindvakt / jägare / vittne | skriven |
| S-09 | Blodigs hot | Blodig, Frodig, Rödskägg, Lösskägg | II–IV | jägare / bärare | skriven |
| S-10 | Saknade Döver | Babord, Barnsben, Rötägg, Fuling. Hjärter bär sanningen, enväg. Döver är saknad NPC. | II | jägare / bärare / vittne | skriven |
| S-11 | Korthajarna | Spader, Klöver, Hjärter, Prygel, Plåthorn | II | rivaler / grindvakt / vittne | skriven |
| S-12 | Klienten på Paradisets ö | Frodig, Rötägg, Kuling, Blodig. Rödskägg enväg. | II–IV | jägare / bärare / grindvakt | skriven |

---

## Designregler för sidequests

1. **Bygg på det som redan finns.** Varje sidequest bör hänga på en befintlig romans eller fiendskap. Då blir den trovärdig direkt och behöver ingen ny bakgrund.
2. **Vilja utan förmåga, förmåga utan vilja.** Den som vill något ska behöva någon annans hjälp för att kunna. Det är motorn i lördagens sveksstämning.
3. **Minst tre inblandade**, i linje med `STYLE.md`. Två personer blir en duell, tre blir drama.
4. **Aldrig kritisk för huvudstoryn.** Om en sidequest inte spelas ska huvudstoryn ändå gå i mål. Sidequests är krydda, inte bärande balk.
5. **Korsa lagen.** En sidequest som bara går inom ett lag missar poängen. Låt den dra folk över skutgränser.
6. **Ge en handling, inte en känsla.** "Var svartsjuk" går inte att spela. "Ta reda på vad hon lade i fiskens gap innan hon hinner tillbaka" går att spela.
7. **Vet mottagaren att det är en sidequest?** Nej. Det ska stå i deras intrigfil som vilken intrig som helst.
8. **Gästtexten står för sig själv.** Spelaren har inte läst den här filen. Varje oförrätt, föremål och rykte som behövs för att spela ska berättas i *deras* `guests/`-stycke, i klartext, inte som intern jargong.
9. **Inte Fredag/Lördag som standardavslut.** Gästtexten ska inte sluta med ett schema (`Fredag: …` / `Lördag: …`) om tidpunkten inte är själva saken. Vilja, hinder, varför helgen. Låt gästen välja när. Se STYLE.md.

## Balansräkning

Fylls i så att ingen får för många och ingen får noll. Målet från [`premiss.md`](premiss.md): var och en har minst en roll i huvudstoryn.

| slug | Antal sidequests | Roll i huvudstoryn | Akt där personen toppar |
|------|------------------|--------------------|-------------------------|
| `malintadaa` | 2 | antagonist, bärare | IV |
| `gustaftadaa` | 3 | budbärare, spelledare | IV |
| `petterwallberg` | 2 | rival, jägare | II–IV |
| `linneaappert` | 1 | jägare | II |
| `ulrikahammar` | 2 | bärare, vittne | II |
| `jesperlindmarker` | 2 | jägare, vittne | II–IV |
| `louisevonbahr` | 2 | bärare, vittne | II |
| `josefinlowing` | 4 | grindvakt, jägare | II–IV |
| `navidmodiri` | 0 | saknad NPC (S-10), attending=false 2026-09-03 | — |
| `minimacklin` | 3 | jägare | II–IV |
| `fabianmacklin` | 3 | jägare, vittne | II |
| `josefinansund` | 2 | bärare, jägare | II–IV |
| `johannabergman` | 4 | vittne, grindvakt | II |
| `jesperlejfjord` | 2 | jägare | II |
| `amandamungsgard` | 1 | grindvakt | II |
| `viktoransund` | 3 | grindvakt, rival, bärare | II–IV |
| `minervalowgren` | 3 | vittne, jägare | II–IV |
| `linneaekbom` | 2 | jägare, vittne | II–IV |
| `alexandrapalmquist` | 2 | grindvakt, jägare | II |
| `hampuslindblad` | 2 | rival, vittne | II |
| `edvinthungren` | 4 | bärare, vittne | II–IV |
| `elinmartensson` | 3 | grindvakt, jägare | II–IV |

**Spridningsregel:** alla toppar får inte ligga i akt IV. Sikta på ungefär en fjärdedel i akt II, en fjärdedel vid brunchen och ritualen, resten i akt IV. Ingen av S-03 till S-10 toppar rent i akt IV: de sträcker sig som mest in i kvällens kaos (II–IV), vilket håller spridningen på rätt sida om regeln.

**Utökning 2026-08-23:** varje sidequest fick en eller två extra deltagare, enligt regeln att fler ska ha fyra eller fem inblandade, inte bara det minsta av tre. Tillägget är genomgående enkelt: en person som redan bär ett etablerat drag (skvaller mot betalning, tjuvlyssning, en gammal skuld, en rivalitet) får samma ledtråd eller bakgrundsinfo som huvuddeltagarna, oftast som enväg-vittne, sällan som ny aktiv jägare. Ingen sidequest fick ny mekanik för att rymma fler, se "Hur det spelas" i respektive avsnitt.

S-01 till S-12 är **beslutade**. S-12 2026-08-25. Gästtext för S-12 skriven samma kväll.

## S-01: Jakten på älskaren

Akt:            II
Deltagare:      Kapten Hjärter (`jesperlejfjord`), Kapten Blodig (`minimacklin`). Svarta Malin (`malintadaa`) bär sanningen.
Roll i storyn:  jägare / bärare
Kopplad till:   B-13, B-42

Vad de vill:    ta reda på vem Malin gömmer.
Vad står i vägen: hon leder fel. Hamnen tror att den hemliga sitter vid faten. Sanningen är Karl XII, och den sitter i kistan.
Varför nu:      festen, närheten, att hon försvinner. Innan sista skålen.

Hur det spelas: Hjärter och Blodig jagar bland kaptenerna. Hjärter privat, vid kökskanten. Malin varken bekräftar eller förnekar ett namn i hamnen. Hon får ta någon i ljuset om stunden kräver det. Ingen planterad avledning: Kapten Dunka (`ludvigvonbahr`) struken 2026-09-01 (återbud). Flera romanser samtidigt är tillåtna och gömmer den hemliga.
Utfall om ja:   fel person utpekas, scener, svartsjuka. Punchlinen vid kistan bär ändå Karl XII.
Utfall om nej:  kistan bär det ändå. Brevet.

Bygger på:      romanser 17, 20, 22. Romans 24 (Malin–Dunka) struken 2026-09-01. Fiende 21 (Hjärter–Blodig) om den spelas.
Speglas hos:    Hjärter enväg. Malin speglar inte hans kärlek. Blodig tvåvägs på historien (tidiga år, sveket), hennes oläkta sug tyngre.
Status:         skriven

Obs: Enbens vittnespekning struken 2026-08-27 (återbud). Dunka som avledning struken 2026-09-01 (återbud). Lagskatt: Hjärter är Fromhetens dörr (smicker). Gnällets dörr är minst tre ombord plus stormraden. Hjärter seglar på Fromheten som jagar Gnället, men jakten går mot galeonen, inte mot en ensam kapten. Inte samma uppdrag. Malin-affären är inte jaktens hävstång.

## S-02: Skäggtrion

Akt:            II
Deltagare:      Kapten Lösskägg (`petterwallberg`), Kapten Rödskägg (`viktoransund`), Kapten Blåskägg (`hampuslindblad`), Kapten Klöver (`johannabergman`)
Roll i storyn:  rivaler / hetsare (Klöver)
Kopplad till:   B-15

Vad de vill:    utropa sig till Skäggens Konung, eller stoppa de andra. Lösskägg vill dessutom plundra de andras skägg, som han gör med alla kaptener som bär skägg i namnet. Klöver vill tjäna pengar på vadslagningen, och för det måste männen faktiskt slåss.
Vad står i vägen: de två andra. Ingen given regel för hur titeln vinns. Utan Klövers hets kan de tre lika gärna nöja sig med att retas.
Varför nu:      tre skäggnamn på samma fest. Folk tittar. Klöver har en bank att öppna.

Hur det spelas: Klöver hetsar de tre mot varandra. Hon öppnar vad, sprider att en av dem redan gjort anspråk, retar Rödskägg (lättkränkt), viskar till Lösskägg (samlaren) att hans nästa skägg ligger löst, säger till Blåskägg att färgen inte räcker. Choklad lika bra som mynt. Ju mer de slåss, desto mer rullar boken. Hon bryr sig inte om vem som blir kung, bara att det blir en kamp värd att slå vad på.

De tre listar själva ut hur man blir kung. Den ön behandlar som kung är kung. Gästtexten ger tre exempel, inte en meny: förnedra motståndarna, utlysa en skäggturnering, eller raka av motståndet. Andra sätt räknas om kajen ser det.

Lösskägg samlar skägg. Han har fyra i en låda, skurna av kaptener han besegrat medan de ännu andades. Han sätter dem på folk, pekar ut vem som ska förföras, backar och tittar. Det bruna bär spindelförbannelse. Det gråa, det vita och det blonda ger förförelsekraft så länge han pekar. Stjäl någon ett skägg fungerar det för tjuven, och då har hen Lösskägg efter sig. Han håller tal, skålar och dansar på bord.

Rödskägg är stolt och lättkränkt. En förolämpning blir snabbt ett drama om vem som är Salmonellahavets störste kapten. Han gör nästan vad som helst för att inte se rädd ut. Han har en väska Piratpulver: mutor, handel, stöld, utpressning.

Blåskägg har blånat skägg av psilocybin på Galápagos. Han bär en påse kraniumpulver som sanningsserum vid insufflering, och ett don med trollrök mot dimma. Han kan tvinga fram ett erkännande, utropa sig, eller ta de andras grepp.

Klöver tar vad och ser till att det finns något att vadslå om. Hon är den som sätter igång, inte en åskådare.

Rekvisita: Lösskäggs låda, Rödskäggs pulver, Blåskäggs kraniumpåse och dimdon. Inget mer.

Utfall om ja:   någon utropas, eller ingen, eller alla tre. Folk har sett hur. Klöver går plus, för att hon hetsade fram en kamp.
Utfall om nej:  de tre retas vidare utan att utropa någon. Huvudstoryn går.

Bygger på:      Lösskäggs underlag (lådan, förförarskäggen, plundra skäggnamn). Rödskäggs stolthet och Piratpulver. Blåskäggs blåa skägg, kraniumpulver, dimdon. Klövers svartklubb.
Speglas hos:    de tre, och Klöver. Hon hetsar, de tre får veta att hon tar vad.
Status:         skriven.

Obs: Inte bärande balk. Inte en lång scen långt från kajen. Klöver bär också S-04, S-05 och S-11. Här hetsar hon skäggkampen för bankens skull, inte samma mekanik som de andra. Blåskägg bär också S-04. Rödskägg och Lösskägg bär också S-09. Ingen delad mekanik.

## S-03 till S-10: bakgrund och tabeller

Beslutade 2026-08-23. Ingen gästtext skriven än. Inte i `fordelning.yaml`. Huvudstoryn går ändå i mål om någon enskild inte spelas, som alla sidequests.

Källan är gästernas eget underlag i `../roller/`, hängt på poster i `romanser.yaml` och `fiender.yaml`. Tomma rollerfiler (Fuling) får ändå kort via yaml och andras föremål. Blåskägg och Planka har underlag 2026-08-25. Kosing vill uttryckligen inte stå i centrum av ett högintensivt drama.

**Löjtnant Spader (`gustaftadaa`) är fullt spelbar.** Sidequests, romanser, rivaliteter som vilken gäst som helst. Inte mullvad eller kontakt. Se [`forradare.yaml`](forradare.yaml). **Undantag 2026-09-03:** han bär Q-3-start och Q-5-tvärledtråd. Han bär S-04 (spelskuld till Hurring), S-08 (hemlig romans med Plåthorn, romans 14, som Kuling drar in honom i utan att veta om den) och S-11 (korthajbordet mot Klöver och Hjärter).

**Mullvad och sidequest är två hemligheter. Skriv dem inte som samma uppdrag**, se [`forradare.yaml`](forradare.yaml):

| Mullvad | Kontakt | Bygger på |
|---------|---------|-----------|
| Barnsben (`ulrikahammar`, skuta 1) | Nykter (`fabianmacklin`, skuta 3) | romans 5. Nykter värvade den han uppvaktar. |
| Frodig (`josefinansund`, skuta 3) | Rosing (`linneaekbom`, skuta 5) | fiende 4 |
| Babord (`alexandrapalmquist`, skuta 5) | Kuling (`josefinlowing`, skuta 2) | litade på Kuling + fly från Gnällets gnäll (tidigare romans 7 / Döver, omsprungen 2026-09-03) |
| Fuling (`louisevonbahr`, skuta 2) | Hjärter (`jesperlejfjord`, skuta 4) | romans 10 |
| Prygel (`minervalowgren`, skuta 4) | Hurring (`jesperlindmarker`, skuta 1) | romans 13 |

Nio av de sexton oberoende personerna nedan har alltså redan en hemlig relation via mullvadscirkeln. Sidequesterna nedan ger dem en **andra, publik** sak att göra, skild från förräderiet. Där paret i en sidequest råkar vara samma två som mullvad/kontakt (Barnsben–Nykter i S-03) är det explicit noterat: sidequesten bygger på samma underliggande relation (uppvaktningen) men spelar ut en annan konsekvens av den, inte förräderiet självt.

### Täckning: vem varje sidequest ger roll åt

| slug | Sidequests | Rollerobjekt som bär handlingen |
|------|-------|--------------------------------|
| `linneaappert` | S-07 | tom rollfil. Romans 3 med Rötägg. Romans 25 med Blåskägg (hjärta krossat för en skuta). Fiende 5: oljan, Fuling kastade sig på Rosing som skrattade. |
| `ulrikahammar` | S-03, S-07 | krumelurpiller, syhörna. Scarfen mot Babord (fiende 12). Redan mullvad mot Nykter (annan hemlighet). |
| `jesperlindmarker` | S-04, S-06 | svart liggare, vem angav honom. Redan Prygels mullvadskontakt (annan hemlighet). |
| `louisevonbahr` | S-04, S-10 | tom rollfil. Fiende 5: oljan, kastade sig på Rosing som skrattade. S-04: hon angav Hurring, nekar. Redan mullvad mot Hjärter (annan hemlighet). S-10: skulden mot Döver värdelös när han är saknad. |
| `josefinlowing` | S-05, S-06, S-08, S-12 | familjesmycke, båtar, aristokrati, egen oförrätt mot Malin, bakhåll mot Rödskägg, namnet på klienten. Kontakt för Babords mullvad (forradare 5, 2026-09-03). |
| `navidmodiri` | — | saknad NPC. S-10 handlar om honom. attending=false 2026-09-03. |
| `minimacklin` | S-01, S-09, S-12 | magiskt halsband. Jakten på Malins älskare, tecknet mot Frodig, falskt klientnamn. |
| `fabianmacklin` | S-03, S-05, S-07 | njutningsstatyett, frieri till Barnsben, släktens rike. Redan Barnsbens mullvadskontakt (annan hemlighet). |
| `josefinansund` | S-09, S-12 | förbjuden kärlek med Rödskägg. Namn-jakt: Blodig anklagar henne för bakhållet. |
| `johannabergman` | S-02, S-04, S-05, S-11 | svartklubb, kristallfyrklöver, skvaller mot choklad, korthajbordet |
| `amandamungsgard` | S-05 | arvssyndsskatt (tax), mynt, låg intensitet. Dunka struken 2026-09-01. |
| `minervalowgren` | S-04, S-08, S-11 | liten kortlek, vill krossa kåthornet, dealer vid korthajbordet. Redan mullvad mot Hurring (annan hemlighet). Frompiraterna ligger i lagintrigen, inte här. |
| `linneaekbom` | S-03, S-08 | duell, kan inte simma, talande snäcka. Fiende 5: vittne, Fuling kastade sig på henne vid skålen, hon skrattade. Redan Blåskäggs mullvadskontakt (annan hemlighet). |
| `alexandrapalmquist` | S-03, S-10 | sjökort (Mälaren, hennes föremål), mild ordning, romans med saknade Döver, fiende 12 mot Barnsben (brevet i scarfen, dåtid). Mullvad mot Kuling (forradare 5, 2026-09-03). |
| `edvinthungren` | S-05, S-07, S-10, S-12 | vill vara snäll, ärvt skepp, enhörningsmanschetter från Planka. Klient bakom bakhållet, före omvändelsen. S-10: gottgörelse mot Döver som aldrig landar. |
| `elinmartensson` | S-06, S-08, S-11 | kåthorn, klagomur, ensam om att veta att Spader har en lek med bara spaderess. Fiende 2 mot Malin (skålen och jollen), flyttad från Enben 2026-08-27. |
| `gustaftadaa` | S-04, S-08, S-11 | kortspelare med spelskuld till Hurring, hemlig romans med Plåthorn (romans 14), korthajbordet. Fullt spelbar. Inga huvudquest-ledtrådar, inte mullvad/kontakt. |

Nio personer bär två sidequests: `ulrikahammar`, `jesperlindmarker`, `louisevonbahr`, `jesperlejfjord`, `linneaekbom`, `alexandrapalmquist`. `josefinansund` bär två efter S-12. Tre bär tre sedan tidigare: `fabianmacklin`, `gustaftadaa`, `minervalowgren`. S-12 gör tre till tre: `edvinthungren`, `minimacklin`, `josefinlowing`. `elinmartensson` bär tre efter att fiende 2 flyttades till henne (S-06, S-08, S-11). En bär fyra: `johannabergman`. S-11 är Klövers fjärde, medvetet, och har annan mekanik än S-02, S-04 och S-05: hon spelar, hon håller inte boken. `navidmodiri` (Döver) attending=false 2026-09-03: S-10 handlar om honom som saknad NPC, inte som spelare. Ingen last delar mekanik mellan sidequests, se "Obs"-raden under respektive.

---

## S-03: Krumelurpillren

Akt:            II, avgörs i skymningen
Deltagare:      Kapten Barnsben (`ulrikahammar`), Kapten Nykter (`fabianmacklin`), Kapten Rosing (`linneaekbom`), Kapten Babord (`alexandrapalmquist`)
Roll i storyn:  bärare (Barnsben) / jägare (Nykter, Rosing, Babord)
Kopplad till:   ingen beat än. Korsar kökskanten, Nykter har maten.

Vad de vill:    Barnsben måste ta ett av sina krumelurpiller när mörkret faller, annars slutar hon vara barnslig och börjar bli stor, vilket hon fasar för. Ingen ska se. Nykter vill vara den hon litar på i skymningen och gärna den som håller burken. Rosing vill detsamma, utan att veta att Nykter redan ligger risigt nära henne av ett annat skäl. Babord vill ha upprättelse för att Barnsben en gång lindade ett brev till Döver i hennes scarf, och fånga Barnsben om hon gör om det. Ingen fysisk scarf. Oförrätten är dåtid. Döver är saknad (S-10): Babord kan kräva ursäkt nu när mannen brevet gällde inte syns.
Vad står i vägen: Barnsben bjuder bara särskilt invigda, och burken är liten och lätt att sno. Nykters uppvaktning av Barnsben är redan hans täckmantel för att hålla henne som mullvad (se mullvadstabellen ovan): han vet mer om henne än han visar, vilket gör hans intresse svårare att läsa för både Barnsben och Rosing. Rosing vågar inte fråga rakt ut vem Barnsben egentligen litar på, av rädsla för svaret. Babord vet om brevet i scarfen, inte om pillren. Ingen tjuvlyssnare vid hörnan: Döver är borta (S-10, 2026-09-03).
Varför nu:      första skymningen som räknas är lördag. Fredag är off-story. Efter ritualen är det kropp, inte pussel: att gömma en burk, smyga i en klick, ta ett piller, eller kräva en ursäkt vid hörnan, går fortfarande att spela utan logik.

Hur det spelas: Barnsben håller sin sy- och broderihörna öppen som naturlig samlingsplats. Nykter och Rosing uppvaktar henne var för sig under dagen, i hopp om att bli den hon anförtror sig åt när mörkret faller. Barnsben kan dela ut ett piller till den hon litar mest på, eller lägga ett i en drink hos någon hon tycker blivit för allvarlig och vuxen under dagen. Babord kommer till samma hörna för oförrätten: hon kan kräva en ursäkt högt, fånga ett nytt brev, eller tala om att mannen brevet gällde är saknad och att Barnsben ändå stulit det som var hennes. Ingen scarf byter händer.
Utfall om ja:   någon får burken, någon ser intaget, ett piller hamnar hos fel person. Svartsjuka mellan Nykter och Rosing vid syhörnan. En scen om det stulna tyget, eller ett nytt brev som fångas, just när Barnsben minst vill ha folk vid hörnan.
Utfall om nej:  Barnsben tar sitt piller privat och ensam. Romanserna 4 och 5 finns kvar oförlösta. Fiende 12 likaså.

Bygger på:      romanser 4, 5. Fiende 12 (Babord–Barnsben, brevet i scarfen, dåtid). Samma underliggande relation som mullvad 1 (Nykter–Barnsben), men en annan konsekvens av den: uppvaktningen syns här, förräderiet syns inte.
Speglas hos:    Barnsben, Nykter, Rosing, Babord.
Status:         skriven

Obs: Tidigare hållen utanför, se S-10. Tillagd 2026-08-24 på Gustafs begäran, via fiende 12. Dövers enväg-vittne (tjuvlyssning vid hörnan) struken 2026-09-03 (återbud, saknad NPC). S-10 är jakten på vad som hänt med Döver, S-03 är upprättelsen mot Barnsben, mullvaden är en tredje hemlighet. Håll isär i gästtexten. Ingen fysisk scarf, ingen SL-prop. Nykter bär också S-05 och S-07, Barnsben bär också S-07, Babord bär också S-10. Ingen av dem delar mekanik mellan sidequesterna.

---

## S-04: Liggaren

Akt:            II
Deltagare:      Kapten Hurring (`jesperlindmarker`), Kapten Fuling (`louisevonbahr`), Kapten Klöver (`johannabergman`), Kapten Prygel (`minervalowgren`), Kapten Blåskägg (`hampuslindblad`), Löjtnant Spader (`gustaftadaa`)
Roll i storyn:  jägare (Hurring) / bärare (Fuling) / vittne (Klöver, Prygel, Blåskägg, Spader)
Kopplad till:   ingen beat än. Inte samma sak som S-01 (jakten på Malins hemliga älskare). Hjärters kristallfyrklöver sitter redan hos Klöver från ett kortspel. Hjärter jagar inte tillbaka amuletten här, och inte i S-11 (korthajarnas bord) heller: där är insatsen rykte, inte amuletten.

Vad de vill:    Hurring vill äntligen veta vem som angav honom för många år sedan och satte honom i fängelse, och skriva en ny rad i sin svarta liggare den här helgen.
Vad står i vägen: sanningen ligger begravd. Fuling har alltid nekat. Klöver vet att det var Fuling (öron från hemliga spelklubbar) och säljer namnet, gärna till Prygel hellre än gratis till Hurring. Prygel vet att Klöver har ett namn, inte vilket. Klöver och Prygel, båda ihop med Hurring samtidigt (romanser 12 och 13, han vet, de vet inte om varandra) och sedan länge ovänner (fiende 1, en stulen vals och äran för en gemensam bordning), hjälper honom helst var för sig och tävlar om att vara den som löser gåtan, inte om att slå sig samman.
Varför nu:      alla från den tiden är samlade på samma ö för första gången, och liggaren behöver en ny sida.

Hur det spelas: Hurring förhör gamla bekanta och driver in skulder, och stämmer av deras historier mot liggaren. Fuling seglade i samma vatten då och har alltid nekat: han kan titta på henne utan att veta. Klöver säljer namnet Fuling mot choklad eller mynt, gärna till Prygel. Prygel har sin lilla kortlek och kan fuska tillbaka, och vägrar be Klöver om hjälp rakt ut. Deras gamla groll gör att de hellre motarbetar varandra än samarbetar, vilket bromsar Hurring mer än Fuling gör. Fuling nekar. Hon pekar inte bort mot Planka och blandar inte in skålen. Blåskägg, som redan har en obetald skuld och ett gammalt skämt liggande hos Hurring (fiende 8, IOU:er naglade i masten), bär sin egen rad i liggaren och kan lika gärna bli den Hurring vänder sin misstanke mot när Fuling nekar för övertygande. Spader, känd kortspelare med spelskulder åt båda hållen, har en gammal spelskuld till Hurring: Hurring kräver in den mitt i utredningen, i mynt eller i ett rykte Spader kan ha snappat upp vid något av alla spelbord han suttit vid. Spader väljer själv om han betalar, eller köper sig fri med ett namn, sant eller påhittat.
Utfall om ja:   Hurring får bekräftelse, eller stark cirkumstantiell bevisning, att Fuling ligger bakom. En ny sida i liggaren, kanske en offentlig konfrontation. Klöver och Prygel upptäcker kanske att de delar Hurring, vilket öppnar ett helt annat drama. Spaders rykte kan peka åt vilket håll som helst, sant eller inte.
Utfall om nej:  mysteriet förblir olöst, Fulings hemlighet överlever, och Hurrings paranoia om andra möjliga angivare, kanske Malin eller Blåskägg, fortsätter.

Bygger på:      Fulings angiveri (hon nekar, han vet inte). Romanser 12, 13 (Hurring–Klöver, Hurring–Prygel). Fiende 1 (Klöver–Prygel). Fiende 8 (Hurring–Blåskägg). Spaders etablerade rykte som kortfuskare och spelskuldsatt (rollunderlag). Inte fiende 5.
Speglas hos:    Hurring, Fuling, Klöver, Prygel, Blåskägg, Spader.
Status:         skriven

Obs: Håll angiveriet isär från fiende 5 (oljan, kastet mot Rosing) och från förrädarspåret i forradare.yaml. De tre delar ingen mekanik. Klöver säljer namnet, inte skålen. Blåskägg bär också S-02. Klöver bär också S-02, S-05 och S-11: här skvallerbank, där spelare vid bordet. Spader bär också S-08 och S-11: skulden till Hurring, romansen med Plåthorn och korthajbordet delar ingen mekanik. Prygel bär också S-08 och S-11: här liten lek mot Klöver i liggarjakten, där dealer vid hajbordet.

---

## Fiende 5: Oljan och skrattet (inte S-04)

Inte en sidequest. Mutual fiendskap Fuling–Planka. Rosing är vittne, den Fuling kastade sig på.

Akt:            II, gärna vid honnörsbordet
Deltagare:      Kapten Fuling (`louisevonbahr`), Kapten Planka (`linneaappert`), Kapten Rosing (`linneaekbom`)
Roll i storyn:  jägare (Fuling vill åt flaskan) / bärare (Planka har oljan) / vittne (Rosing)
Kopplad till:   ingen beat. Inte S-04. Inte Klövers försäljning av angiveriet.

Vad de vill:    Fuling vill åt Plankas flaska och hälla oljan på henne vid honnörsbordet, så hamnen ser vem som tål sin egen medicin. Planka vill göra om insmörjningen vid samma bord. Rosing vill behålla sista skrattet och inte bli den Fuling landar på igen.
Vad står i vägen: Vid förra kaptensskålen smorde Planka in Fuling med sirenolja. Okontrollerad lust. Fuling kastade sig på Rosing. Rosing skrattade. Kajen såg. Fuling skyller Planka, inte Rosing. Ingen feber. Ingen täckhistoria.
Varför nu:      honnörsbordet den här helgen, bordet där kaptenerna sitter först och skålar först. Flaskan sitter fortfarande i Plankas koja.

Hur det spelas: Planka smörjer in Fuling igen, gärna siktad mot Rosing. Fuling jagar flaskan. Rosing kan dra sig undan eller stå kvar och skratta. Inte en ledtråd till vem som angav Hurring.
Utfall om ja:   oljan på Planka, eller Fuling mot Rosing igen, eller båda.
Utfall om nej:  fiendskapet finns kvar olöst.

Bygger på:      fiende 5. Plankas sirenolja (rollunderlag). Inte S-04.
Speglas hos:    Fuling, Planka. Rosing minns kastet med Fuling (tvåvägs minne), men är inte part i yaml-fiendskapet.
Status:         skriven

Obs: Ordet feber förekommer inte. Klöver får inte den här scenen. Hurring får den inte som tell för angiveriet.

---

## S-05: Arvssyndsskatten

Akt:            II, gärna vid brunchens skålar
Deltagare:      Kapten Kosing (`amandamungsgard`), Kapten Kuling (`josefinlowing`), Kapten Rötägg (`edvinthungren`), Kapten Nykter (`fabianmacklin`), Kapten Klöver (`johannabergman`)
Roll i storyn:  grindvakt (Kosing) / bärare (Kuling, Rötägg, Nykter) / vittne (Klöver)
Kopplad till:   ingen beat än. Låg intensitet för Kosing: ingen ring, ingen kidnappning, inget centrum.

Vad de vill:    Kosing vill lägga sin påhittade arvssyndsskatt (tax) på dem som kommer från överklassen. Tre namn i `roller/`: Kuling föddes in i Salmonellahavets aristokrati och bär släktens smycke. Rötägg ärvde ett skepp som ung. Nykter kommer från ett släkte som ägde ett rike (han plundrade och mördade det; Kosing känner till släkten, inte morden). Klöver vill se den hemliga ätupplevelsen bli lönsam.
Vad står i vägen: de tre kan betala, dementera, eller berätta precis så mycket att kajen hör varifrån de kommer. Nykter kan peka Kosing mot Kuling och Rötägg så ingen frågar vad som hände med riket.
Varför nu:      festens skålande och skryt ger den naturliga scenen, och Kosing tar upp skatt (tax) hela helgen.

Hur det spelas: Kosing kräver betalt i mynt eller en berättelse. Kuling kan dölja smycket. Rötägg kan berätta om skeppet han ärvde. Nykter betalar tyst, dementerar, eller styr boken mot de andra två. Klöver lägger sin och Kosings redan planerade hemliga ätupplevelse mitt i indrivningen: den som vill undgå skatten (tax) kan istället köpa sig en plats vid bordet, choklad går lika bra som mynt.
Utfall om ja:   någon betalar eller knäböjer för avlat, Kosing kammar hem indriven skatt (tax), Klöver tar sin procent.
Utfall om nej:  de tre bluffar sig igenom, skatten (tax) förblir obetald mot överklassen. Kurtisanen-spåret (fiende 17) lever ändå.

Bygger på:      Kuling, Rötägg och Nykter i `roller/`. Inte romans 19 (struken 2026-09-01). Inte fiende 20 (struken). Kosings och Klövers gemensamma matplan, redan nämnd i båda rollunderlagen.
Speglas hos:    Kosing, Kuling, Rötägg, Nykter, Klöver.
Status:         skriven

Obs: Dunka (`ludvigvonbahr`) var bärare till 2026-09-01, återbud. Svärdsmyt och hamnskämt strukna. Nykter bär också S-03 och S-07, Klöver bär också S-02, S-04 och S-11, Kuling bär också S-06, S-08 och S-12, Rötägg bär också S-07, S-10 och S-12. Ingen delad mekanik. S-11 är bordet, inte ännu en bankbok. Lagskatt (treasure): Gnällets ingång går inte via överklass (minst tre ombord plus stormraden). S-05 är bara arvssyndsskatten (tax). Inte samma uppdrag. Fiende 17 (Kosing mot Malin) är en annan oförrätt om samma skatt (tax): Malin kallade den tiggeri och kyrkkollekt, se [`../intriger/fiender.yaml`](../intriger/fiender.yaml) och [`skatt.md`](skatt.md).

---

## S-06: Räkningen mot Malin

Akt:            II–IV
Deltagare:      Kapten Kuling (`josefinlowing`), Kapten Plåthorn (`elinmartensson`), Svarta Malin (`malintadaa`), Kapten Hurring (`jesperlindmarker`)
Roll i storyn:  jägare (Kuling; Plåthorn oberoende) / antagonist, bärare (Malin, redan tillsatt) / vittne (Hurring)
Kopplad till:   fiende 2. Inte bärande balk mot kistan (huvudstoryns kärlekskista, öppnas vid kaviar och rom, se akter.md), men sannolikt vår viktigaste ingång till huvudstoryn utanför Malins egna scener.

Vad de vill:    Kuling och Plåthorn vill båda, av olika skäl, offentligt förödmjuka eller ta tillbaka något från Malin innan helgen är slut. De vet inte om varandra i gästtexten. Plåthorn är ute efter upprättelse för två saker Malin gjorde henne: en skål där Malin kallade henne "en fasa till kapten" inför alla, och en gång då Malin kapade hennes jolle i dimman (fiende 2, flyttad från Enben 2026-08-27). Kuling är ute efter en gammal, egen oförrätt hon aldrig släppt, en skuld hon anser att hennes besättning Fördärvet har rätt att kräva tillbaka. Hurring, som redan misstänker att Malin kan vara den som en gång angav honom och satte honom i fängelse (hans olösta fråga från S-04, Liggaren), säljer sin osäkra rad bara till Kuling.
Vad står i vägen: Malin är svår att komma åt, alltid charmig, och just nu generös värdinna på sin egen fest. Att slå till nu ser ut som otacksamhet mot en jubilar. Plåthorn, Kuling och Hurring känner inte till varandras groll från början.
Varför nu:      det är Malins helg, hennes fest, hennes garde nere mitt i firandet och romen, den enda gången hon går att komma åt.

Hur det spelas: Kuling och Plåthorn provocerar, retar eller försöker lura ut något av Malin var för sig: en skål som slår fel, ett föremål som "lånas tillbaka" med en giftig kommentar, en duellutmaning. Upptäcker de varandras groll i spel, till exempel via Klövers skvaller, kan de gå samman. Gästtexten uppmanar dem inte att leta. Hurring säljer en rad ur sin svarta liggare till Kuling mot mynt eller en framtida tjänst. Raden, aldrig bekräftad, säger att Malin tog last från en skuta som litade på henne, döpte om stölden till rättvis delning, och att skutan aldrig såg ett mynt tillbaka. Kuling kan använda den som vittne till Fördärvets egen fordran.
Utfall om ja:   Malin nålas offentligt, kanske förlorar hon kort och tillfälligt cryptexen (huvudstoryns kodlås, se akter.md) som hämnd, en scen som sår tvivel om henne inför kvällen.
Utfall om nej:  inget landar, Malin charmar sig undan som vanligt, ingen kostnad för huvudstoryn.

Bygger på:      fiende 2 (Plåthorn–Malin). Kulings etablerade personliga oförrätt mot Malin, i rollunderlaget, inte en formell fiendepost. Hurrings hemlighet från S-04 (Liggaren): han vet inte vem som angav honom, och misstänker Malin.
Speglas hos:    Plåthorn, Kuling, Malin, Hurring.
Status:         skriven

Obs: Hurring bär också S-04 (Liggaren, samma misstanke mot Malin där han själv är den som söker svaret). Plåthorn bär också S-08 och S-11. Ingen delad mekanik. Enben (`amaliawahlstrom`) bar jakten till 2026-08-27, återbud.

---

## S-07: Rötäggets bevis

Akt:            II
Deltagare:      Kapten Rötägg (`edvinthungren`), Kapten Planka (`linneaappert`), Kapten Barnsben (`ulrikahammar`), Kapten Nykter (`fabianmacklin`)
Roll i storyn:  bärare (Rötägg) / jägare (Planka) / vittne, grindvakt (Barnsben, Nykter)
Kopplad till:   fiende 13.

Vad de vill:    Rötägg vill bevisa för Planka, som han älskar och fick sina manschettknappar av (romans 3), att han verkligen ändrat sig sedan tiden han förlorade sitt eget skepp genom att vara rutten mot besättningen. Planka vill veta om kärleken vilar på sanning.
Vad står i vägen: Barnsben minns fortfarande parfymspratten som saboterade hennes uppvaktning av Döver (fiende 13) och tror inte på Rötäggs omvändelse. Frågar Planka rakt ut riskerar hon att få höra hela historien om vem Rötägg var förr. Nykter, som håller Barnsben nära sig av egna skäl (se mullvadstabellen), känner till samma gamla historia från henne och kan lika gärna vara den Planka frågar, med sitt eget pris för att svara ärligt.
Varför nu:      alla gamla bekanta är på samma ö, och romens frikostighet gör att gammalt groll lättare kommer upp till ytan.

Hur det spelas: Planka söker upp Barnsben, gärna vid sy- och broderihörnan, för att höra vad hon vet om Rötägg. Barnsben kan välja att släppa taget om gammal röta som en gest, eller hålla fast vid den och sabotera relationen igen, medveten eller ej om att det är precis vad hon en gång anklagade honom för. Rötägg kan försöka blidka Barnsben i förväg med en gest, till exempel en massage eller sabrerad bubbel, innan Planka hinner fråga. Hittar Planka inte Barnsben kan hon lika gärna fråga Nykter, som ger ett svar färgat av sitt eget nöje av att se andra desperata.
Utfall om ja:   Barnsben förlåter, äkta eller spelat, och Rötägg och Plankas kärlek stärks.
Utfall om nej:  Barnsben eller Nykter berättar sanningen, Planka får tvivel, ett osäkert kärleksdrama fortsätter in i kvällen.

Bygger på:      romans 3 (Planka–Rötägg). Fiende 13 (Barnsben–Rötägg).
Speglas hos:    Rötägg, Planka, Barnsben, Nykter.
Status:         skriven

Obs: Barnsben bär också S-03, Rötägg bär också S-10 och S-12, Nykter bär också S-03 och S-05. Ingen delad mekanik med någon av dem. S-12 är namnet på ett bakhåll, inte omvändelsen mot Planka.

---

## S-08: Jakten på kåthornet

Akt:            II–IV, betalar sig bäst efter ritualen 15.30: ett kåthornsstöt mitt i kvällens kaos kräver ingen logik, bara kropp och skratt
Deltagare:      Kapten Plåthorn (`elinmartensson`), Kapten Kuling (`josefinlowing`), Kapten Prygel (`minervalowgren`), Kapten Rosing (`linneaekbom`), Löjtnant Spader (`gustaftadaa`)
Roll i storyn:  grindvakt (Plåthorn) / jägare (Kuling, Prygel) / vittne (Rosing, enväg) / vittne, bärare (Spader)
Kopplad till:   klagomuren på Gnället.

Föremål:        kåthorn. Blås i det och alla pirater i närheten går i kåttrans, så våldsam att de mitt i striden tvingas sniffa i fiendens nacke. Striden stannar. Plåthorn smiter.

Vad de vill:    Prygel vill se kåthornet krossat en gång för alla, på allvar, för att det stör hennes stridslystna heder (fiende 24). Kuling, som redan hånat kåthornet i en skål (fiende 7: Plåthorn blåste, kallade det varning, sålde Kulings bakhåll bakom en tunna; Kuling togs med näsan i nacken på den hon skulle ha stuckit), vill komma över det för skojs skull, kanske använda det taktiskt eller sälja det vidare. Spader vill, framför allt, skydda Plåthorn utan att avslöja att han älskar henne.
Vad står i vägen: Plåthorn släpper aldrig kåthornet frivilligt. Det är hennes enda pålitliga flyktväg när det blir på allvar, och hon bär det nära sig hela tiden. Kuling har fått för sig att hon behöver en listig hand för att komma åt kåthornet, och har fäst blicken på Spader, känd kortfuskare, utan att ana att han redan är Plåthorns hemliga romans (romans 14).
Varför nu:      den samlade festen och stridsstämningen gör kåthornet extra farligt att använda, och båda jägarna vet att fel tillfälle blir kaos.

Hur det spelas: Kuling och Prygel försöker, var för sig eller tillsammans, locka fram, stjäla eller lura Plåthorn att blåsa i kåthornet vid fel tillfälle, så att hon förlorar kontrollen över det eller avslöjas. Plåthorn försvarar sig genom att fly, muta, eller blåsa i kåthornet i självförsvar och sprida kaos som täckmantel. Rosing, vars viskande snäcka hör mer än hon bett om, snappar upp planerna i förbifarten och kan varna Plåthorn i utbyte mot en tjänst, eller hålla tyst för att slippa dras in i en strid hon inte kan simma ifrån. Kuling övertalar Spader att hjälpa henne komma åt kåthornet, med mynt eller smicker om hans rykte. Spader väljer om han spelar med på låtsas och skyddar Plåthorn i det tysta, eller varnar henne rakt ut och riskerar att avslöja sin hemliga kärlek för att göra det.
Utfall om ja:   kåthornet byter händer eller krossas, ett kaosmoln av upphetsning bryter ut runt bytet, publikt och pinsamt. Spaders dubbelspel kan avslöjas i samma veva som kåthornet.
Utfall om nej:  Plåthorn behåller kåthornet, grälet fortsätter, ingen konsekvens för huvudstoryn.

Bygger på:      fiende 7 (Kuling–Plåthorn). Fiende 24 (Prygel–Plåthorn). Romans 14 (Spader–Plåthorn), hemlig och mutual.
Speglas hos:    Plåthorn, Kuling, Prygel, Spader. Rosing enväg, hon lyssnar men väljer själv om hon agerar.
Status:         skriven

Obs: Prygel bär redan mullvadskontakten mot Hurring (annan hemlighet, se mullvadstabellen) plus S-04 och S-11. Kuling bär redan grindvaktsrollen för båtarna plus S-06 och S-12. Rosing bär också S-03 och en mullvadskontakt (forradare 3, omsjumpad, namnge inte a). Spader bär också S-04 och S-11: skulden till Hurring, romansen och korthajbordet delar ingen mekanik. Plåthorn bär också S-11: här kåthornet, där att hon ensam vet om leken med bara spaderess. Inget av det delar mekanik med det här.

---

## S-09: Blodigs hot

Akt:            II–IV
Deltagare:      Kapten Blodig (`minimacklin`), Kapten Frodig (`josefinansund`), Kapten Rödskägg (`viktoransund`), Kapten Lösskägg (`petterwallberg`)
Roll i storyn:  jägare (Blodig, Lösskägg) / bärare (Frodig, Rödskägg)
Kopplad till:   fiende 4, där hotet redan står explicit noterat.

Vad de vill:    Blodig, redan Frodigs ärkefiende (fiende 4: stulet byte efter Blodigs prejning, blodig hand i Frodigs storsegel), får nys om den förbjudna kärleken mellan Frodig och Rödskägg och vill använda den, dels för att hämnas den gamla oförrätten, dels för att elda på kaos. Lösskägg, redan Rödskäggs rival i skäggtrion (fiende 3), vill ha vad som helst som gör Rödskägg mindre stor inför de andra två skäggen.
Vad står i vägen: hemligheten är väl bevarad. Deras släkter och besättningar har varit fiender i generationer (romans 8), och en upptäckt vore en skandal.
Varför nu:      helgens närhet och alkohol gör folk vårdslösa. Ett hastigt ögonkast eller en smekning kan förråda dem inför fel person.

Hur det spelas: Blodig, redan känd för att slå till hårt och redan upptagen med att jaga Malins älskare (S-01), snubblar över eller aktivt nystar i ett tecken på förhållandet: ett brev, en blick, ett smeknamn. Hon konfronterar en av dem enskilt eller sprider ett rykte utan att avslöja hela sanningen än, som hot eller utpressning. Frodig och Rödskägg måste förneka högljutt, muta Blodig, eller fly tillsammans, med risk att bekräfta ryktet genom sin egen panik. Blodig kan sälja fragmentet vidare till Lösskägg, som redan letar svagheter hos Rödskägg inför striden om Skäggens Konung (S-02) och gärna river upp det på fel plats vid fel tillfälle.
Utfall om ja:   kärleken avslöjas offentligt, skandal mellan skutorna, gammalt groll (fiende 3, fiende 18, fiende 19) blossar upp igen. Skäggtrion, striden om vem som är Skäggens Konung (S-02), får extra bränsle.
Utfall om nej:  hemligheten överlever, men Blodig har nu ett vapen hon kan använda när som helst under kvällen.

Bygger på:      fiende 4 (Blodig–Frodig). Romans 8 (Rödskägg–Frodig), med hotet redan explicit noterat i `fiender.yaml`. Matchar Rödskäggs eget rollunderlag, som uttryckligen bjuder in att den förbjudna kärleken riskerar avslöjas. Fiende 3 (Lösskägg–Rödskägg) som Lösskäggs skäl att sprida vidare.
Speglas hos:    Blodig, Frodig, Rödskägg, Lösskägg.
Status:         skriven

Obs: Håll den förbjudna kärleken isär från förrädarspåret i forradare.yaml. De två uppdragen delar ingen mekanik. Blodig bär också S-01 och S-12: här en blick och ett smeknamn, där ett namn på en klient. Rödskägg och Lösskägg bär också S-02. Frodig bär också S-12.

---

## S-10: Saknade Döver

Akt:            II
Deltagare:      Kapten Babord (`alexandrapalmquist`), Kapten Barnsben (`ulrikahammar`), Kapten Rötägg (`edvinthungren`), Kapten Fuling (`louisevonbahr`). Kapten Hjärter (`jesperlejfjord`) bär sanningen, enväg. Kapten Döver (`navidmodiri`) är saknad NPC, ingen gästfil.
Roll i storyn:  jägare (Babord, Barnsben) / vittne (Rötägg, Fuling) / bärare (Hjärter, enväg)
Kopplad till:   fiende 23. Korsar S-01: Hjärter jagar Malins älskare medan han täcker sitt eget brott. Korsar köket, Hjärter har maten.

Vad de vill:    Kajen vet att Kapten Döver skulle ha seglat med Fördärvet. Han kom inte. Ingen förklaring. Babord kom för mannen hon översatte tecken åt och vill ha tillbaka (romans 7): hon letar. Barnsben har aldrig släppt sin envägsåtrå (romans 6): hon letar också, och kan krocka med Babord om vem som har rätt att fråga. Rötägg ville gottgöra ruttna tunnor (fiende 6) vid en workshop som aldrig blir av: han hjälper till att leta, och kan peka fel. Fuling anade att dövheten var påhitt och sparade det som skuld: skulden är värdelös, men misstanken kan säljas, eller tigas för Hjärter som redan är hennes mullvadskontakt.
Vad står i vägen: Ingen kropp på ön. Ingen workshop. Ingen flaska serum i spel. Sanningen sitter bara hos Hjärter: han dödade Döver före ankomsten. Motivet: Döver tjuvlyssnade vid grytorna, hörde om Hjärters hemliga kärlek till Malin och jakten på hennes älskare, och hotade att avslöja det för henne så att romansen förstördes (fiende 23, romans 17). Hjärter lämnar knappast köket. Nykter (fiende 11) hatar fortfarande mannen som sålde frieriet i tavernan: naturlig röd sill, inget facit.
Varför nu:      Första gången alla från den tiden är samlade, och stolen där Döver skulle sitta står tom.

Hur det spelas: Fråga runt. Tom workshop-plats på gården. Tom koja. Hjärter vid grytorna som inte lämnar dem. Babord och Barnsben kan krocka om vem som har rätt att leta. Fuling kan kräva betalt för vad hon *anade*, eller hålla tyst för Hjärter. Hjärter ljuger, styr bort, eller mutar Fuling (hon jobbar redan för honom). Ingen ny prop. Serumflaskan och workshopen nämns som det som *inte* händer.
Utfall om ja:   någon landar nära köket. Scener, inte avslöjad huvudstory. Hjärters jakt i S-01 störs eller får en falsk ledtråd han själv planterar.
Utfall om nej:  Döver förblir borta. Romans 6 och 7 och fiende 6, 11, 23 finns kvar olösta. Huvudstoryn går.

Bygger på:      romans 6 (Barnsben→Döver, enväg), romans 7 (Babord–Döver, mutual, objektet saknat). Fiender 6 (Döver–Rötägg), 23 (Döver–Hjärter). Fulings vana att spara en skuld. Inte fiende 5, inte S-04.
Speglas hos:    Babord, Barnsben, Rötägg, Fuling, Hjärter. Döver ingen gästfil.
Status:         skriven

Obs: Omsprungen 2026-09-03: Navid Modiri (`navidmodiri`) återbud. Döver stannar i fiktionen som saknad, inte struken som Enben/Dunka. Tidigare S-10 var teckenspråksbluffen med workshop och serum. Den mekaniken är bakgrund, inte något att göra. Babord bär redan mullvaden mot Kuling (forradare 5, omsprungen samma dag från Döver): hon är jägare här och mullvad i samma andetag, håll isär i gästtexten. Hon bär också S-03 (upprättelsen mot Barnsben). Rötägg bär också S-07 och S-12, Fuling bär också S-04, Hjärter bär S-01 och S-11. Samma personer, olika relationer, ingen delad mekanik. Inte bärande balk.

---

## Uppslag från befintligt material

Kopplingar i `romanser.yaml` och `fiender.yaml` som är särskilt lämpade att dras in i huvudstoryn, eftersom de redan har tryck och redan korsar skutor:

- **Barnsben som allas åtrå** (romanser 4, 5, 6 och fiender 12, 13). Fem personer i ett nät. **S-03, beslutad**, med Rosing och Nykter som jägare, Babord som jägare via fiende 12 (brevet i scarfen, dåtid, ingen fysisk scarf). Dövers enväg-vittne struket 2026-09-03. **S-10** är jakten på saknade Döver, inte scarfen.
- **Blodig och Hjärter om Malin** (romanser 17, 20 och fiende 21). Två anspråk på jubilaren. De jagar hennes hemliga älskare i hamnen. Sanningen är Karl XII, först i kistan. **S-01, beslutad.**
- **Plåthorn mot Malin** (fiende 2). Den enda etablerade fiendskapen som går direkt mot Malin. Flyttad från Enben 2026-08-27. Sannolikt vår viktigaste ingång till huvudstoryn. **S-06, beslutad.**
- **Hjärter, hemligt förälskad i Malin** (romans 17). Jagar rivalen privat, vid kökskanten. **S-01, beslutad.**
- **Rötägg som allas fiende** (fiender 6, 13, 14). Naturlig skurk i huvudstoryn. Inte tillsatt som mullvad. Adresserad via fiende 13 i **S-07**, fiende 6 i **S-10** (gottgörelse mot saknade Döver), och som namnlös klient i **S-12** (fiende 25:s lucka). Fiende 14 förblir obesökt som motor.
- **Frodig och Rödskägg, förbjuden kärlek** (romans 8, fiende 25). Hotet från Blodig, redan noterat i `fiender.yaml` fiende 4, adresserat i **S-09, beslutad.** Fiende 25 (Kuling–Rödskägg) adresserad i **S-12, beslutad:** namnet på klienten, inte vattnet.
- **Hurring, Fuling, Klöver, Prygel** (romanser 12, 13, fiende 1, 5). **S-04, beslutad.**
- **Plåthorns kåthorn mot Kuling och Prygel** (fiender 7, 24). **S-08, beslutad.**
- **Kosings arvssyndsskatt** (tax mot Kuling, Rötägg, Nykter; romans 19 och fiende 20 strukna 2026-09-01). **S-05, beslutad.**
- **Korthajarna Spader, Klöver, Hjärter.** Rivaliteten sitter i rollfilerna och nu i fiender 27–29. Spader palmerar, Klöver byter lek i tricket, Hjärter märker kort i köket. Insatsen är rykte, inte kristallfyrklövern. **S-11, beslutad.** Fiende 14 (Spader–Rötägg) förblir obesökt som motor.

---

## S-11: Korthajarna

Akt:            II, vid ett bord som tål kökskanten
Deltagare:      Löjtnant Spader (`gustaftadaa`), Kapten Klöver (`johannabergman`), Kapten Hjärter (`jesperlejfjord`), Kapten Prygel (`minervalowgren`), Kapten Plåthorn (`elinmartensson`)
Roll i storyn:  rivaler (Spader, Klöver, Hjärter) / grindvakt, dealer (Prygel) / vittne (Plåthorn)
Kopplad till:   ingen beat. Skild från S-02 (skäggtrions kamp om titeln) och S-04 (liggarjakten): samma personer förekommer, men annat bord, annan insats. Kökskanten på Fromheten.

Vad de vill:    sitta samma bord den här helgen och få de andra två utpekade som fuskare inför vittnen. Den som pekas ut förlorar rykte som haj. Klöver vill dessutom landa sitt episka korttrick publikt. Hjärter vill ha hemligt bus vid grytorna, nu när Katten Felix är borta. Spader vill inte bli tagen, och vill dessutom vinna tillbaka sin ring med spader som Klöver vann av honom vid ett tidigare bord. Prygel vill se Klöver förlora, och ta dealerns procent. Plåthorn vill skydda Spader, eller sälja det hon ensam vet: att han vinner när han borde förlora, och att hans största hemlighet är en hel lek med bara spaderess.

Vad står i vägen: alla tre fuskar, på olika sätt, och var och en är säker på att det är de *andra* som fuskar. De behöver en "ärlig" dealer. Prygel hatar Klöver (fiende 1) och delar snett. Hjärter kan inte lämna köket. Plåthorn älskar Spader (romans 14) och är den enda som vet om hans lek med bara spaderess. Klöver bär ringen som en trofé bredvid kristallfyrklövern och släpper ingendera lätt. Halsbandet sitter på Plåthorn, inte på Klöver och inte på Spader.

Varför nu:      tre färgnamn på samma ö för första gången, tre hajars rykte i samma hamn. Fredag är off-story, retas får de. Partiet spelas lördag, när som helst det passar, ingen specifik klockslag. Även efter 15.30 fungerar ett publikt pekande, ett trick eller ett raseriutbrott vid bordet utan ny logik.

Hur det spelas: ett enda semi-publikt parti vid kökskanten, inte en jakt över ön och inte en ny svartklubb. Klöver öppnar bordet. Prygel delar, med sin lilla lek eller en vanlig lek hon kontrollerar. Anklagelser under given, inte efteråt: kasta kortet, kräva ny giv, peka, göra tricket. Hjärter spelar mellan grytor. Spader sitter med. Publiken får titta, det är så play to lift landar.

Sanningen, bara här, inte i gästtext som facit till ett pussel:

- Spader palmerar ess. Förr täcktes rörelsen av att han pillar med ringen och halsbandet. Ringen sitter på Klöver (vunnen trofé, utdelad före spelet). Halsbandet sitter på Plåthorn (romans 14, utdelat före spelet). Han palmerar utan den täckningen. Hans största hemlighet, som bara Plåthorn känner, är en hel lek med bara spaderess. Det är källan till essen, och mysteriet hans rollfil lämnar olöst för alla andra.
- Klöver byter lek mitt i det episka tricket. Tricket *är* fusket. Publiken ser trolleri. Hon kallar det skicklighet.
- Hjärter märker baksidor med kökssmet och kan plantera ett märkt kort mellan grytor. Det är buset, inte en razzia.

Var och en vet *sitt* fusk. Ingen av de tre får de andras metoder utskrivna. Plåthorn vet att Spader vinner när han borde förlora, och hon är den enda som vet om leken med bara spaderess. Inte hur Klöver eller Hjärter gör. Prygel behöver inte veta metoderna. Hon kan dela snett mot Klöver ändå.

Insatsen är rykte: vem som utpekas som fuskaren inför vittnen. Kristallfyrklövern är amulett, inte pokal och inte kortfärg, och sitter hos Klöver. Likaså Spaders ring med spader, vunnen av Klöver vid ett tidigare bord, utdelad till henne före spelet. Halsbandet i spader sitter hos Plåthorn, romanstoken, inte vid bordet. Hjärter jagar inte fyrklövern i S-04, och inte här heller. Spader vill visst ha sin ring tillbaka, men om ringen eller fyrklövern hamnar på bordet som sidovad är det spel, inte motorn.

Rekvisita: en spelbar kortlek vid köket. Prygels lilla lek (hennes föremål). Valfritt extra ess till Spader. Leken med bara spaderess är kunskap och romanshemlighet, inte SL-rekvisita. Gustaf tar med om den ska synas. Spaders ring och halsband: Gustaf tar med, delas ut före spelet (ringen till Klöver, halsbandet till Plåthorn). Ingen tryckt gåta.

Utfall om ja:   någon utpekas, sant eller falskt. Rykte knäcks eller tvättas. Klövers trick landar, eller åker dit. Prygel tar sin procent som delare oavsett, inte samma procent som i S-02: här är det given, inte vadslagningsboken. Spader kan vinna tillbaka sin ring, eller inte. Plåthorns romans kan läcka i samma veva, måste inte.
Utfall om nej:  rivaliteten finns kvar. Mysteriet hur Spader fuskar får förbli olöst, som rollfilen tillåter. Huvudstoryn går.

Bygger på:      fiender 27 (Spader–Klöver, nu även den vunna ringen), 28 (Spader–Hjärter), 29 (Klöver–Hjärter), nya. Fiende 1 (Klöver–Prygel). Romans 14 (Spader–Plåthorn), hemlig. Spaders olösta fusk. Klövers trick. Hjärters bus. Prygels lilla lek.
Speglas hos:    Spader, Klöver, Hjärter. Prygel. Plåthorn.
Status:         skriven

Obs: Klöver bär S-02, S-04, S-05 och S-11. De tre första är bank och procent. Här spelar hon, och här bär hon dessutom Hjärters kristallfyrklöver och Spaders ring med spader som troféer. Inte halsbandet. Håll isär i gästtexten. Prygel bär S-04 och S-08: där liten lek mot Klöver i liggarjakten respektive jakten på kåthornet. Här dealer vid hajbordet. Spader bär S-04 och S-08: skuld till Hurring, skydd av Plåthorn. Här sitter han och palmerar utan smycken, och vill ha sin ring tillbaka från Klöver. Han bär också Q-3-start (2026-09-03, Dövers återbud). Plåthorn bär S-08: kåthornet. Här vet hon om leken med bara spaderess, inte om kåthornet. Hon bär hans halsband, inte ringen, och vet inte att Klöver har ringen. Hjärter bär S-01 och är sanningens bärare i S-10 (saknade Döver): jakten på Malins älskare och mordet. Här bus vid grytorna. Rötägg är inte med. Fiende 14 förblir bakgrund. Klövers svartklubbar nämns inte som insats: det är sällskap, inte färgen, och det är Outline C som ströks.

Ord: kortfärgen heter klöver. Klubb är sällskap. Fyrklöver är växten och amuletten. Inga vitsar som blandar dem.

Gästtext skriven 2026-08-23. Posterna 69–73 i `fordelning.yaml` markerade done, liksom fiender 27–29.

---

## S-12: Klienten på Paradisets ö

Akt:            II–IV
Deltagare:      Kapten Frodig (`josefinansund`), Kapten Rötägg (`edvinthungren`), Kapten Kuling (`josefinlowing`), Kapten Blodig (`minimacklin`). Kapten Rödskägg (`viktoransund`) enväg.
Roll i storyn:  jägare (Frodig) / bärare (Rötägg) / grindvakt (Kuling) / jägare, falsk ledtråd (Blodig) / vittne (Rödskägg, enväg)
Kopplad till:   fiende 25. Kajen, där Kuling och Rödskägg redan delar båtarna.

Vad de vill:    Frodig vill ha det riktiga namnet på den som betalade bakhållet, innan Blodig får Rödskägg att tro att det var hon. Rötägg vill att namnet stannar i Kulings mun, eller att han själv får bekänna som bevis på att han ändrat sig. Kuling vill ha betalt för namnet, inte ge det till sin egen skuta gratis. Blodig vill att namnet ska vara Frodig, högt, nu.
Vad står i vägen: sanningen sitter bara i två munnar. Kuling nämnde aldrig klienten för Fördärvet. Blodig har fyllt i Frodig själv, för att pulversläkter är lätta att hata och för att fiende 4 redan sitter där. Rötägg kan låta lögnen stå. Frodig vet att det inte var hon, men har inget papper.
Varför nu:      alla från den tiden är på samma ö. Rödskägg och Kuling står vid samma rep hela helgen. Ett namn sagt vid kajen landar.

Hur det spelas: ingen ny prop. Inget kontrakt, ingen kula, ingen lapp. Rödskäggs pulverväska är redan hans rollföremål, den stulna lasten är bakgrund, inte något Kuling bär. Namnet finns i Kulings mun. Frodig kommer till kajen och kräver det. Rötägg kommer för tystnad eller för en bekännelse på sina villkor. Blodig säger Frodigs namn till Rödskägg och till den som lyssnar, utan att fråga Kuling först. Kuling säljer, tiger, rättar Blodig, eller pekar. Efter 15.30 fungerar fortfarande ett namn, en anklagelse, en värja, en bekännelse.

Sanningen, bara här, inte i Frodigs eller Blodigs gästtext:

Rötägg betalade, före omvändelsen, för att Kuling skulle skjuta Rödskägg i ryggen på Paradisets ö och lyfta pulver. Han stod inte bakom geväret. Kuling vet. Rötägg vet. Ingen annan får det i förhandstexten.

Utfall om ja:   namnet kommer ut, sant eller falskt. Frodig drar värja mot Blodig, eller mot Rötägg. Rödskägg får veta att han knullat kvinnan som anklagas för att ha köpt hans död, eller att den snälla mannen på Gnället betalade. Kuling tar sin procent.
Utfall om nej:  Blodigs lögn är det som fastnar, eller inget namn alls. Fiende 25 och romans 8 finns kvar. Huvudstoryn går.

Bygger på:      fiende 25 (Kuling–Rödskägg, klienten utan namn). Fiende 4 (Blodig–Frodig). Romans 8 (Frodig–Rödskägg). Rötäggs etablerade röta före omvändelsen. Frodigs släktfejd om Piratpulver, redan i hennes rollfil.
Speglas hos:    Frodig, Rötägg, Kuling, Blodig. Rödskägg enväg: han får Blodigs anklagelse, inte facit.
Status:         skriven

Objekt:         inga nya. Rödskäggs väska med Piratpulver (hans rollfil) får pekas på som det som blev kvar. Kulings familjesmycke är inte betalning och inte ledtråd. Blodigs halsband likaså. Rötäggets manschettknappar hör till S-07, inte hit.

Obs: Prygel valdes bort. Hon bär redan S-08 med Kuling vid samma kaj, och tre sidequests. En fjärde mot samma grindvakt hade blandat kåthornet och namnet. Blodig har fiende 4, fel säkerhet, och annan mekanik än S-09: här åtal, där nystande i en affär. Kuling bär S-06 och S-08: Malin respektive kåthornet. Här säljer hon ett årsgammalt namn. Rötägg bär S-07 och S-10: omvändelsen mot Planka, gottgörelsen mot saknade Döver. Här ett skott han betalade. Frodig är inte mullvad (forradare 3 omsjumpad 2026-08-24). Håll isär från S-09 och från förrädarspåret.

Gästtext skriven 2026-08-25. Posterna 90–94 i `fordelning.yaml`.

