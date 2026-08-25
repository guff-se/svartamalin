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
| S-01 | Jakten på älskaren | Hjärter, Blodig, Enben, Dunka. Malin leder fel. | II | jägare / bärare | skriven |
| S-02 | Skäggtrion | Lösskägg, Rödskägg, Blåskägg, Klöver | II | rivaler / hetsare | beslutad |
| S-03 | Krumelurpillren | Barnsben, Nykter, Rosing, Döver, Babord | II | jägare / bärare / vittne | skriven |
| S-04 | Liggaren | Hurring, Fuling, Klöver, Prygel, Blåskägg, Spader | II | jägare / bärare / vittne | skriven |
| S-05 | Svärdet och arvssynden | Dunka, Kosing, Nykter, Klöver | II | bärare / grindvakt / jägare | skriven |
| S-06 | Enbens räkning | Enben, Kuling, Malin, Hurring | II–IV | jägare / antagonist / vittne | skriven |
| S-07 | Rötäggets bevis | Rötägg, Planka, Barnsben, Nykter | II | bärare / jägare / vittne | skriven |
| S-08 | Jakten på Plåthornet | Plåthorn, Kuling, Prygel, Rosing, Spader | II–IV | grindvakt / jägare / vittne | skriven |
| S-09 | Blodigs hot | Blodig, Frodig, Rödskägg, Lösskägg | II–IV | jägare / bärare | skriven |
| S-10 | Teckenspråket | Döver, Babord, Rötägg, Fuling. Hjärter är målet, enväg. | II | jägare / grindvakt / vittne | skriven |
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
| `josefinlowing` | 3 | grindvakt, jägare | II–IV |
| `navidmodiri` | 2 | jägare, vittne | II |
| `minimacklin` | 3 | jägare | II–IV |
| `ludvigvonbahr` | 2 | bärare | II |
| `amaliawahlstrom` | 2 | jägare, vittne | II–IV |
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
| `edvinthungren` | 3 | bärare, vittne | II–IV |
| `elinmartensson` | 2 | grindvakt | II–IV |

**Spridningsregel:** alla toppar får inte ligga i akt IV. Sikta på ungefär en fjärdedel i akt II, en fjärdedel vid brunchen och ritualen, resten i akt IV. Ingen av S-03 till S-10 toppar rent i akt IV: de sträcker sig som mest in i kvällens kaos (II–IV), vilket håller spridningen på rätt sida om regeln.

**Utökning 2026-08-23:** varje sidequest fick en eller två extra deltagare, enligt regeln att fler ska ha fyra eller fem inblandade, inte bara det minsta av tre. Tillägget är genomgående enkelt: en person som redan bär ett etablerat drag (skvaller mot betalning, tjuvlyssning, en gammal skuld, en rivalitet) får samma ledtråd eller bakgrundsinfo som huvuddeltagarna, oftast som enväg-vittne, sällan som ny aktiv jägare. Ingen sidequest fick ny mekanik för att rymma fler, se "Hur det spelas" i respektive avsnitt.

S-01 till S-12 är **beslutade**. S-12 2026-08-25. Gästtext för S-12 skriven samma kväll.

## S-01: Jakten på älskaren

Akt:            II
Deltagare:      Kapten Hjärter (`jesperlejfjord`), Kapten Blodig (`minimacklin`), Kapten Enben (`amaliawahlstrom`), Kapten Dunka (`ludvigvonbahr`). Svarta Malin (`malintadaa`) bär sanningen.
Roll i storyn:  jägare / bärare / vittne (Enben) / bärare, falsk ledtråd (Dunka)
Kopplad till:   B-13, B-42

Vad de vill:    ta reda på vem Malin gömmer. Enben vill inget hellre än att Malin ska se skyldig ut för något, vad som helst (fiende 2), och sprider gärna eget namn på ett bord. Dunka vill bli sedd som mannen som fick Svarta Malin, sant eller inte.
Vad står i vägen: hon leder fel. Rivalen ser ut att sitta vid bordet, och nu sitter han också där på riktigt: Dunka och Malin har en synlig, om än diskret, romans (romans 24) som ser ut precis som det jägarna letar efter. Sanningen är Karl XII, och den sitter i kistan.
Varför nu:      festen, närheten, att hon försvinner. Innan sista skålen.

Hur det spelas: Hjärter och Blodig jagar bland kaptenerna. Hjärter privat, vid kökskanten. Malin varken bekräftar eller förnekar ett namn i hamnen. Enben, som redan hatar Malin, plockar upp jakten i förbifarten och pekar gärna ut ett namn hon själv ogillar, utan att bry sig om det stämmer. Dunka gör jägarnas jobb åt dem: han låter sig ses vid Malins bord, låter en skål bli tvetydig, och dementerar aldrig ett rykte som får honom att verka som erövraren av jubilaren. Han vet inte att han är en avledning, han tror bara att han äntligen får den status han alltid velat ha. Flera romanser samtidigt är tillåtna och gömmer den hemliga.
Utfall om ja:   fel person utpekas, scener, svartsjuka. Enbens falska pekning gör förvirringen värre, och Dunka blir den mest övertygande fel-utpekningen av alla, eftersom han själv aldrig förnekar den. Punchlinen vid kistan blir personlig, och särskilt pinsam för Dunka.
Utfall om nej:  kistan bär det ändå. Brevet.

Bygger på:      romanser 17, 20, 22. Romans 24 (Malin–Dunka) som Dunkas skäl att vara med. Fiende 21 (Hjärter–Blodig) om den spelas. Fiende 2 (Enben–Malin) som Enbens skäl att blanda sig i.
Speglas hos:    Hjärter enväg. Malin speglar inte hans kärlek. Blodig enväg. Enben enväg, hon bryr sig inte om vem som är skyldig, bara att Malin ser dålig ut. Dunka enväg, han spelar inte jägare, han är fångsten som visar sig själv fram.
Status:         skriven

Obs: Enben bär också S-06, samma måltavla (Malin) men en annan handling: här sprider hon en falsk ledtråd, i S-06 tar hon eller Kuling något ifrån henne. Dunka bär också S-05, samma fåfänga (vill se stor ut) men en annan konsekvens: här gynnar den honom, i S-05 avslöjar den honom.

## S-02: Skäggtrion

Akt:            II
Deltagare:      Kapten Lösskägg (`petterwallberg`), Kapten Rödskägg (`viktoransund`), Kapten Blåskägg (`hampuslindblad`), Kapten Klöver (`johannabergman`)
Roll i storyn:  rivaler / hetsare (Klöver)
Kopplad till:   B-15

Vad de vill:    utropa sig till Skäggkonung, eller stoppa de andra. Lösskägg vill dessutom plundra de andras skägg, som han gör med alla kaptener som bär skägg i namnet. Klöver vill tjäna pengar på vadslagningen, och för det måste männen faktiskt slåss.
Vad står i vägen: de två andra. Ingen given regel för hur titeln vinns. Utan Klövers hets kan de tre lika gärna nöja sig med att retas.
Varför nu:      tre skäggnamn på samma fest. Folk tittar. Klöver har en bank att öppna.

Hur det spelas: Klöver hetsar de tre mot varandra. Hon öppnar vad, sprider att en av dem redan gjort anspråk, retar den lättkränkte, viskar till den andre att hans skägg är nästa. Choklad lika bra som mynt. Ju mer de slåss, desto mer rullar boken. Hon bryr sig inte om vem som blir kung, bara att det blir en kamp värd att slå vad på.

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
Status:         beslutad. Gästtext skrivs senare.

Obs: Inte bärande balk. Inte en lång scen långt från kajen. Klöver bär också S-04, S-05 och S-11. Här hetsar hon skäggkampen för bankens skull, inte samma mekanik som de andra. Blåskägg bär också S-04. Rödskägg och Lösskägg bär också S-09. Ingen delad mekanik.

## S-03 till S-10: bakgrund och tabeller

Beslutade 2026-08-23. Ingen gästtext skriven än. Inte i `fordelning.yaml`. Huvudstoryn går ändå i mål om någon enskild inte spelas, som alla sidequests.

Källan är gästernas eget underlag i `../roller/`, hängt på poster i `romanser.yaml` och `fiender.yaml`. Tomma rollerfiler (Fuling, Enben) får ändå kort via yaml och andras föremål. Blåskägg och Planka har underlag 2026-08-25. Kosing vill uttryckligen inte stå i centrum av ett högintensivt drama.

**Löjtnant Spader (`gustaftadaa`) är fullt spelbar.** Sidequests, romanser, rivaliteter som vilken gäst som helst. Två undantag, bara de: inga ledtrådar till huvudquesten, och inte mullvad eller kontakt. Se [`forradare.yaml`](forradare.yaml). Han bär S-04 (spelskuld till Hurring), S-08 (hemlig romans med Plåthorn, romans 14, som Kuling drar in honom i utan att veta om den) och S-11 (korthajbordet mot Klöver och Hjärter).

**Mullvad och sidequest är två hemligheter. Skriv dem inte som samma uppdrag**, se [`forradare.yaml`](forradare.yaml):

| Mullvad | Kontakt | Bygger på |
|---------|---------|-----------|
| Barnsben (`ulrikahammar`, skuta 1) | Nykter (`fabianmacklin`, skuta 3) | romans 5. Nykter värvade den han uppvaktar. |
| Frodig (`josefinansund`, skuta 3) | Rosing (`linneaekbom`, skuta 5) | fiende 4 |
| Babord (`alexandrapalmquist`, skuta 5) | Döver (`navidmodiri`, skuta 2) | romans 7 |
| Fuling (`louisevonbahr`, skuta 2) | Hjärter (`jesperlejfjord`, skuta 4) | romans 10 |
| Prygel (`minervalowgren`, skuta 4) | Hurring (`jesperlindmarker`, skuta 1) | romans 13 |

Nio av de sexton oberoende personerna nedan har alltså redan en hemlig relation via mullvadscirkeln. Sidequesterna nedan ger dem en **andra, publik** sak att göra, skild från förräderiet. Där paret i en sidequest råkar vara samma två som mullvad/kontakt (Barnsben–Nykter i S-03) är det explicit noterat: sidequesten bygger på samma underliggande relation (uppvaktningen) men spelar ut en annan konsekvens av den, inte förräderiet självt.

### Täckning: vem varje sidequest ger roll åt

| slug | Sidequests | Rollerobjekt som bär handlingen |
|------|-------|--------------------------------|
| `linneaappert` | S-07 | tom rollfil. Romans 3 med Rötägg. Romans 25 med Blåskägg (hjärta krossat för en skuta). |
| `ulrikahammar` | S-03, S-07 | krumelurpiller, syhörna. Scarfen mot Babord (fiende 12). Redan mullvad mot Nykter (annan hemlighet). |
| `jesperlindmarker` | S-04, S-06 | svart liggare, vem angav honom. Redan Prygels mullvadskontakt (annan hemlighet). |
| `louisevonbahr` | S-04, S-10 | tom rollfil. Fiende 5: planterade rykte mot Planka. Redan mullvad mot Hjärter (annan hemlighet). |
| `josefinlowing` | S-06, S-08, S-12 | familjesmycke, båtar, egen oförrätt mot Malin, bakhåll mot Rödskägg, namnet på klienten |
| `navidmodiri` | S-03, S-10 | fejkdöv, sanningsserum, workshop, nemesis Hjärter. Redan Babords mullvadskontakt (annan hemlighet). |
| `ludvigvonbahr` | S-05 | tvåeggat svärd med lögnig historia, långa kramar |
| `amaliawahlstrom` | S-01, S-06 | tom rollfil. Fiende 2 mot Malin, sannolikt viktigaste ingången till huvudstoryn |
| `minimacklin` | S-01, S-09, S-12 | magiskt halsband. Jakten på Malins älskare, tecknet mot Frodig, falskt klientnamn. |
| `fabianmacklin` | S-03, S-05, S-07 | njutningsstatyett, frieri till Barnsben. Redan Barnsbens mullvadskontakt (annan hemlighet). |
| `josefinansund` | S-09, S-12 | förbjuden kärlek med Rödskägg. Namn-jakt: Blodig anklagar henne för bakhållet. |
| `johannabergman` | S-02, S-04, S-05, S-11 | svartklubb, kristallfyrklöver, skvaller mot choklad, korthajbordet |
| `amandamungsgard` | S-05 | arvssyndskatt, mynt, låg intensitet, vill spela med Dunka |
| `minervalowgren` | S-04, S-08, S-11 | liten kortlek, vill krossa hornet, dealer vid korthajbordet. Redan mullvad mot Hurring (annan hemlighet). Frompiraterna ligger i lagintrigen, inte här. |
| `linneaekbom` | S-03, S-08 | duell, kan inte simma, talande snäcka. Redan Blåskäggs mullvadskontakt (annan hemlighet). |
| `alexandrapalmquist` | S-03, S-10 | sjökort, mild ordning, romans med Döver, fiende 12 mot Barnsben (scarfen). Redan mullvad mot Döver (annan hemlighet). |
| `edvinthungren` | S-07, S-10, S-12 | vill vara snäll, enhörningsmanschetter från Planka. Klient bakom bakhållet, före omvändelsen. |
| `elinmartensson` | S-08, S-11 | plåthorn, klagomur, vet hur Spader vinner när han borde förlora |
| `gustaftadaa` | S-04, S-08, S-11 | kortspelare med spelskuld till Hurring, hemlig romans med Plåthorn (romans 14), korthajbordet. Fullt spelbar. Inga huvudquest-ledtrådar, inte mullvad/kontakt. |

Nio personer bär två sidequests: `ulrikahammar`, `jesperlindmarker`, `louisevonbahr`, `navidmodiri`, `amaliawahlstrom`, `jesperlejfjord`, `linneaekbom`, `elinmartensson`, `alexandrapalmquist`. `josefinansund` bär två efter S-12. Tre bär tre sedan tidigare: `fabianmacklin`, `gustaftadaa`, `minervalowgren`. S-12 gör tre till tre: `edvinthungren`, `minimacklin`, `josefinlowing`. En bär fyra: `johannabergman`. S-11 är Klövers fjärde, medvetet, och har annan mekanik än S-02, S-04 och S-05: hon spelar, hon håller inte boken. Ingen last delar mekanik mellan sidequests, se "Obs"-raden under respektive.

---

## S-03: Krumelurpillren

Akt:            II, avgörs i skymningen
Deltagare:      Kapten Barnsben (`ulrikahammar`), Kapten Nykter (`fabianmacklin`), Kapten Rosing (`linneaekbom`), Kapten Döver (`navidmodiri`), Kapten Babord (`alexandrapalmquist`)
Roll i storyn:  bärare (Barnsben) / jägare (Nykter, Rosing, Babord) / vittne (Döver, enväg)
Kopplad till:   ingen beat än. Korsar kökskanten, Nykter har maten.

Vad de vill:    Barnsben måste ta ett av sina krumelurpiller när mörkret faller, annars slutar hon vara barnslig och börjar bli stor, vilket hon fasar för. Ingen ska se. Nykter vill vara den hon litar på i skymningen och gärna den som håller burken. Rosing vill detsamma, utan att veta att Nykter redan ligger risigt nära henne av ett annat skäl. Babord vill ta tillbaka scarfen Barnsben en gång lindade ett brev till Döver i, och fånga Barnsben om hon gör om det.
Vad står i vägen: Barnsben bjuder bara särskilt invigda, och burken är liten och lätt att sno. Nykters uppvaktning av Barnsben är redan hans täckmantel för att hålla henne som mullvad (se mullvadstabellen ovan): han vet mer om henne än han visar, vilket gör hans intresse svårare att läsa för både Barnsben och Rosing. Rosing vågar inte fråga rakt ut vem Barnsben egentligen litar på, av rädsla för svaret. Babord vet om scarfen, inte om pillren, och Döver vet inte att hon kommer till hörnan för scarfen.
Varför nu:      första skymningen som räknas är lördag. Fredag är off-story. Efter ritualen är det kropp, inte pussel: att gömma en burk, smyga i en klick, ta ett piller, eller ta tillbaka en scarf, går fortfarande att spela utan logik.

Hur det spelas: Barnsben håller sin sy- och broderihörna öppen som naturlig samlingsplats. Nykter och Rosing uppvaktar henne var för sig under dagen, i hopp om att bli den hon anförtror sig åt när mörkret faller. Barnsben kan dela ut ett piller till den hon litar mest på, eller lägga ett i en drink hos någon hon tycker blivit för allvarlig och vuxen under dagen. Döver, som av gammal vana tjuvlyssnar bakom sin fejkade dövhet, hör mer av syhörnans viskningar än någon anar och vet redan vem Barnsben egentligen litar på, utan att säga något. Babord kommer till samma hörna för scarfen: hon kan kräva den tillbaka, leta efter ett nytt brev, eller tala om för Döver vems händer som rörde hennes tyg. Hon täcker inte hans dövhet här.
Utfall om ja:   någon får burken, någon ser intaget, ett piller hamnar hos fel person. Svartsjuka mellan Nykter och Rosing vid syhörnan. Döver kan, om han vill, avslöja vem Barnsben valde, eller hålla tyst och spara det. Scarfen byter händer eller blir en scen just när Barnsben minst vill ha folk vid hörnan.
Utfall om nej:  Barnsben tar sitt piller privat och ensam. Romanserna 4 och 5 finns kvar oförlösta. Fiende 12 likaså.

Bygger på:      romanser 4, 5. Fiende 12 (Babord–Barnsben, scarfen). Samma underliggande relation som mullvad 1 (Nykter–Barnsben), men en annan konsekvens av den: uppvaktningen syns här, förräderiet syns inte.
Speglas hos:    Barnsben, Nykter, Rosing, Babord. Döver enväg, han lyssnar men agerar inte. Babord enväg mot Döver i den här biten: hon talar om scarfen för honom om hon vill, han har ingen egen S-03-text om den.
Status:         skriven

Obs: Tidigare hållen utanför, se S-10. Tillagd 2026-08-24 på Gustafs begäran, via fiende 12. S-10 är teckenspråksbluffen, S-03 är scarfen mot Barnsben, mullvaden är en tredje hemlighet. Håll isär i gästtexten. Nykter bär också S-05 och S-07, Barnsben bär också S-07, Döver och Babord bär också S-10. Ingen av dem delar mekanik mellan sidequesterna.

---

## S-04: Liggaren

Akt:            II
Deltagare:      Kapten Hurring (`jesperlindmarker`), Kapten Fuling (`louisevonbahr`), Kapten Klöver (`johannabergman`), Kapten Prygel (`minervalowgren`), Kapten Blåskägg (`hampuslindblad`), Löjtnant Spader (`gustaftadaa`)
Roll i storyn:  jägare (Hurring) / bärare (Fuling) / vittne (Klöver, Prygel, Blåskägg, Spader)
Kopplad till:   ingen beat än. Inte samma sak som S-01 (jakten på Malins hemliga älskare). Hjärters kristallfyrklöver sitter redan hos Klöver från ett kortspel. Hjärter jagar inte tillbaka amuletten här, och inte i S-11 (korthajarnas bord) heller: där är insatsen rykte, inte amuletten.

Vad de vill:    Hurring vill äntligen veta vem som angav honom för många år sedan och satte honom i fängelse, och skriva en ny rad i sin svarta liggare den här helgen.
Vad står i vägen: sanningen ligger begravd. Fuling har alltid nekat att hon planterar rykten, trots att det är precis vad hon gjorde mot Planka (fiende 5, det planterade silverryktet efter en förlorad auktion). Ingen misstänker den tysta ryktesspridaren för något så allvarligt som ett angiveri. Klöver och Prygel, båda ihop med Hurring samtidigt (romanser 12 och 13, han vet, de vet inte om varandra) och sedan länge ovänner (fiende 1, en stulen vals och äran för en gemensam bordning), hjälper honom helst var för sig och tävlar om att vara den som löser gåtan, inte om att slå sig samman.
Varför nu:      alla från den tiden är samlade på samma ö för första gången, och liggaren behöver en ny sida.

Hur det spelas: Hurring förhör gamla bekanta och driver in skulder, och stämmer av deras historier mot liggaren. Klöver, som driver hemliga spelklubbar och byter skvaller mot choklad, har hört ett fragment som pekar mot "någon som är bra på rykten" men vill ha betalt för att dela det, gärna av Prygel snarare än gratis. Prygel har sin lilla kortlek och kan fuska tillbaka, och vägrar be Klöver om hjälp rakt ut. Deras gamla groll gör att de hellre motarbetar varandra än samarbetar, vilket bromsar Hurring mer än Fuling gör. Fuling ljuger eller planterar ett nytt rykte för att peka bort från sig själv, gärna mot Planka igen. Blåskägg, som redan har en obetald skuld och ett gammalt skämt liggande hos Hurring (fiende 8, IOU:er naglade i masten), bär sin egen rad i liggaren och kan lika gärna bli den Hurring vänder sin misstanke mot när Fuling nekar för övertygande. Spader, känd kortspelare med spelskulder åt båda hållen, har en gammal spelskuld till Hurring: Hurring kräver in den mitt i utredningen, i mynt eller i ett rykte Spader kan ha snappat upp vid något av alla spelbord han suttit vid. Spader väljer själv om han betalar, eller köper sig fri med ett namn, sant eller påhittat.
Utfall om ja:   Hurring får bekräftelse, eller stark cirkumstantiell bevisning, att Fuling ligger bakom. En ny sida i liggaren, kanske en offentlig konfrontation. Klöver och Prygel upptäcker kanske att de delar Hurring, vilket öppnar ett helt annat drama. Spaders rykte kan peka åt vilket håll som helst, sant eller inte.
Utfall om nej:  mysteriet förblir olöst, Fulings hemlighet överlever, och Hurrings paranoia om andra möjliga angivare, kanske Malin eller Blåskägg, fortsätter.

Bygger på:      fiende 5 (Fuling–Planka, hennes vana att plantera rykten). Romanser 12, 13 (Hurring–Klöver, Hurring–Prygel). Fiende 1 (Klöver–Prygel). Fiende 8 (Hurring–Blåskägg). Hurrings egen etablerade hemlighet: han vet inte vem som angav honom. Spaders etablerade rykte som kortfuskare och spelskuldsatt (rollunderlag).
Speglas hos:    Hurring, Fuling, Klöver, Prygel, Blåskägg, Spader.
Status:         skriven

Obs: Håll angiveriet isär från förrädarspåret i forradare.yaml. De delar ingen mekanik. Blåskägg bär också S-02. Klöver bär också S-02, S-05 och S-11: här skvallerbank, där spelare vid bordet. Spader bär också S-08 och S-11: skulden till Hurring, romansen med Plåthorn och korthajbordet delar ingen mekanik. Prygel bär också S-08 och S-11: här liten lek mot Klöver i liggarjakten, där dealer vid hajbordet.

---

## S-05: Svärdet och arvssynden

Akt:            II, gärna vid brunchens skålar
Deltagare:      Kapten Dunka (`ludvigvonbahr`), Kapten Kosing (`amandamungsgard`), Kapten Nykter (`fabianmacklin`), Kapten Klöver (`johannabergman`)
Roll i storyn:  bärare (Dunka) / grindvakt (Kosing) / jägare (Nykter) / vittne (Klöver)
Kopplad till:   ingen beat än. Låg intensitet för Kosing: ingen ring, ingen kidnappning, inget centrum.

Vad de vill:    Kosing vill lägga sin påhittade arvssyndsskatt just på Dunkas uppblåsta anor och historier. Nykter, som redan gjort Dunkas svärdhistoria till ett hamnskämt (fiende 20), vill se honom svettas en gång till, men gör det indirekt: han pekar ut det svaga stället åt Kosing istället för att själv stå i vägen för Dunka. Klöver, som redan planerat en hemlig ätupplevelse med Kosing, vill se den bli lönsam.
Vad står i vägen: Dunka vaktar sitt tveeggade svärd svartsjukt och låter aldrig någon granska det på nära håll, av skräck för att avslöjas som falsk under fasaden. Samtidigt njuter han i hemlighet av ryktet att han setts vid Malins bord (den synliga romansen med Malin som Dunka bär i S-01, jakten på hennes älskare), vilket gör honom svårare att skrämma: han känner sig redan som en stor man den här helgen.
Varför nu:      festens skålande och skryt ger den naturliga scenen, och Kosings skattebod är öppen hela helgen.

Hur det spelas: Nykter viskar åt Kosing var Dunkas svaga punkt sitter, utan att själv synas i det. Kosing riktar sin arvssyndsskatt mot Dunkas anspråk på fin börd och kräver betalt i mynt eller en berättelse. Dunka kan betala, dementera högljutt, eller dra igång svärdets "historia" en gång för mycket och snubbla på en detalj. Spricker myten svarar han med en av sina långa, envisa kramar, som tröst åt sig själv snarare än andra. Klöver lägger sin och Kosings redan planerade hemliga ätupplevelse mitt i indrivningen: den som vill undgå skatten kan istället köpa sig en plats vid bordet, choklad går lika bra som mynt.
Utfall om ja:   Dunka betalar eller förödmjukas inför båda besättningarna, Kosing kammar hem en fin skatt, Nykter njuter osedd av segern, Klöver tar sin procent.
Utfall om nej:  Dunka bluffar sig igenom, myten lever vidare, skatten förblir obetald.

Bygger på:      fiende 20 (Dunka–Nykter). Romans 19 (Kosing–Dunka), i den lågintensiva, icke-centrala form Kosing själv bett om. Kosings och Klövers gemensamma matplan, redan nämnd i båda rollunderlagen.
Speglas hos:    Dunka, Kosing, Nykter, Klöver.
Status:         skriven

Obs: Nykter bär också S-03 och S-07, Klöver bär också S-02, S-04 och S-11, Dunka bär också S-01. Ingen delad mekanik. S-11 är bordet, inte ännu en bankbok.

---

## S-06: Enbens räkning

Akt:            II–IV
Deltagare:      Kapten Enben (`amaliawahlstrom`), Kapten Kuling (`josefinlowing`), Svarta Malin (`malintadaa`), Kapten Hurring (`jesperlindmarker`)
Roll i storyn:  jägare (Enben, Kuling) / antagonist, bärare (Malin, redan tillsatt) / vittne (Hurring)
Kopplad till:   fiende 2. Inte bärande balk mot kistan (huvudstoryns kärlekskista, öppnas vid kaviar och rom, se akter.md), men sannolikt vår viktigaste ingång till huvudstoryn utanför Malins egna scener.

Vad de vill:    Enben och Kuling vill båda, av olika skäl, offentligt förödmjuka eller ta tillbaka något från Malin innan helgen är slut. Enben är ute efter upprättelse för två saker Malin gjorde henne: en skål där Malin kallade henne "en fasa till kapten" inför alla, och en gång då Malin kapade Enbens skiff i dimman. Kuling är ute efter en gammal, egen oförrätt hon aldrig släppt, en skuld hon anser att hennes besättning Fördärvet har rätt att kräva tillbaka. Hurring, som redan misstänker att Malin kan vara den som en gång angav honom och satte honom i fängelse (hans olösta fråga från S-04, Liggaren), vill gärna se någon annan gräva i henne, så länge det inte är han själv som står främst.
Vad står i vägen: Malin är svår att komma åt, alltid charmig, och just nu generös värdinna på sin egen fest. Att slå till nu ser ut som otacksamhet mot en jubilar. Enben, Kuling och Hurring känner inte till varandras groll från början.
Varför nu:      det är Malins helg, hennes fest, hennes garde nere mitt i firandet och romen, den enda gången hon går att komma åt.

Hur det spelas: Enben och Kuling provocerar, retar eller försöker lura ut något av Malin var för sig: en skål som slår fel, ett föremål som "lånas tillbaka" med en giftig kommentar, en duellutmaning. Upptäcker de varandras groll, till exempel via Klövers skvaller, kan de gå samman om en större publik aktion, som att rigga en skål eller tvinga fram en pinsam utmaning inför alla. Hurring säljer en rad ur sin svarta liggare (boken där han samlar allt han vet om folk som kan ha svikit honom) till den av de två som betalar bäst, en gammal historia om Malin han aldrig kunnat bekräfta, som ammunition till nästa provokation.
Utfall om ja:   Malin nålas offentligt, kanske förlorar hon kort och tillfälligt cryptexen (huvudstoryns kodlås, se akter.md) som hämnd, en scen som sår tvivel om henne inför kvällen.
Utfall om nej:  inget landar, Malin charmar sig undan som vanligt, ingen kostnad för huvudstoryn.

Bygger på:      fiende 2 (Enben–Malin). Kulings etablerade personliga oförrätt mot Malin, i rollunderlaget, inte en formell fiendepost. Hurrings hemlighet från S-04 (Liggaren): han vet inte vem som angav honom, och misstänker Malin.
Speglas hos:    Enben, Kuling, Malin, Hurring.
Status:         skriven

Obs: Hurring bär också S-04 (Liggaren, samma misstanke mot Malin där han själv är den som söker svaret). Enben bär också S-01 (Jakten på älskaren, där hon sprider en falsk ledtråd om Malin snarare än att ta något ifrån henne). Ingen delad mekanik.

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

## S-08: Jakten på Plåthornet

Akt:            II–IV, betalar sig bäst efter ritualen 15.30: ett hornstöt mitt i kvällens kaos kräver ingen logik, bara kropp och skratt
Deltagare:      Kapten Plåthorn (`elinmartensson`), Kapten Kuling (`josefinlowing`), Kapten Prygel (`minervalowgren`), Kapten Rosing (`linneaekbom`), Löjtnant Spader (`gustaftadaa`)
Roll i storyn:  grindvakt (Plåthorn) / jägare (Kuling, Prygel) / vittne (Rosing, enväg) / vittne, bärare (Spader)
Kopplad till:   klagomuren på Gnället.

Vad de vill:    Prygel vill se hornet krossat en gång för alla, på allvar, för att det stör hennes stridslystna heder (fiende 24). Kuling, som redan hånat hornet i en skål (fiende 7), vill komma över det för skojs skull, kanske använda det taktiskt eller sälja det vidare. Spader vill, framför allt, skydda Plåthorn utan att avslöja att han älskar henne.
Vad står i vägen: Plåthorn släpper aldrig hornet frivilligt. Det är hennes enda pålitliga flyktväg när det blir på allvar, och hon bär det nära sig hela tiden. Kuling har fått för sig att hon behöver en listig hand för att komma åt hornet, och har fäst blicken på Spader, känd kortfuskare, utan att ana att han redan är Plåthorns hemliga romans (romans 14).
Varför nu:      den samlade festen och stridsstämningen gör hornet extra farligt att använda, och båda jägarna vet att fel tillfälle blir kaos.

Hur det spelas: Kuling och Prygel försöker, var för sig eller tillsammans, locka fram, stjäla eller lura Plåthorn att blåsa i hornet vid fel tillfälle, så att hon förlorar kontrollen över det eller avslöjas. Plåthorn försvarar sig genom att fly, muta, eller blåsa i hornet i självförsvar och sprida kaos som täckmantel. Rosing, vars viskande snäcka hör mer än hon bett om, snappar upp planerna i förbifarten och kan varna Plåthorn i utbyte mot en tjänst, eller hålla tyst för att slippa dras in i en strid hon inte kan simma ifrån. Kuling övertalar Spader att hjälpa henne komma åt hornet, med mynt eller smicker om hans rykte. Spader väljer om han spelar med på låtsas och skyddar Plåthorn i det tysta, eller varnar henne rakt ut och riskerar att avslöja sin hemliga kärlek för att göra det.
Utfall om ja:   hornet byter händer eller krossas, ett kaosmoln av upphetsning bryter ut runt bytet, publikt och pinsamt. Spaders dubbelspel kan avslöjas i samma veva som hornet.
Utfall om nej:  Plåthorn behåller hornet, grälet fortsätter, ingen konsekvens för huvudstoryn.

Bygger på:      fiende 7 (Kuling–Plåthorn). Fiende 24 (Prygel–Plåthorn). Romans 14 (Spader–Plåthorn), hemlig och mutual.
Speglas hos:    Plåthorn, Kuling, Prygel, Spader. Rosing enväg, hon lyssnar men väljer själv om hon agerar.
Status:         skriven

Obs: Prygel bär redan mullvadskontakten mot Hurring (annan hemlighet, se mullvadstabellen) plus S-04 och S-11. Kuling bär redan grindvaktsrollen för båtarna plus S-06 och S-12. Rosing bär också S-03 och en mullvadskontakt (forradare 3, omsjumpad, namnge inte a). Spader bär också S-04 och S-11: skulden till Hurring, romansen och korthajbordet delar ingen mekanik. Plåthorn bär också S-11: här hornet, där att hon vet hur han vinner. Inget av det delar mekanik med det här.

---

## S-09: Blodigs hot

Akt:            II–IV
Deltagare:      Kapten Blodig (`minimacklin`), Kapten Frodig (`josefinansund`), Kapten Rödskägg (`viktoransund`), Kapten Lösskägg (`petterwallberg`)
Roll i storyn:  jägare (Blodig, Lösskägg) / bärare (Frodig, Rödskägg)
Kopplad till:   fiende 4, där hotet redan står explicit noterat.

Vad de vill:    Blodig, redan Frodigs ärkefiende (fiende 4, stulen kapitulation mot blodstämplat storsegel), får nys om den förbjudna kärleken mellan Frodig och Rödskägg och vill använda den, dels för att hämnas den gamla oförrätten, dels för att elda på kaos. Lösskägg, redan Rödskäggs rival i skäggtrion (fiende 3), vill ha vad som helst som gör Rödskägg mindre stor inför de andra två skäggen.
Vad står i vägen: hemligheten är väl bevarad. Deras släkter och besättningar har varit fiender i generationer (romans 8), och en upptäckt vore en skandal.
Varför nu:      helgens närhet och alkohol gör folk vårdslösa. Ett hastigt ögonkast eller en smekning kan förråda dem inför fel person.

Hur det spelas: Blodig, redan känd för att slå till hårt och redan upptagen med att jaga Malins älskare (S-01), snubblar över eller aktivt nystar i ett tecken på förhållandet: ett brev, en blick, ett smeknamn. Hon konfronterar en av dem enskilt eller sprider ett rykte utan att avslöja hela sanningen än, som hot eller utpressning. Frodig och Rödskägg måste förneka högljutt, muta Blodig, eller fly tillsammans, med risk att bekräfta ryktet genom sin egen panik. Blodig kan sälja fragmentet vidare till Lösskägg, som redan letar svagheter hos Rödskägg inför skäggtrion (S-02) och gärna river upp det på fel plats vid fel tillfälle.
Utfall om ja:   kärleken avslöjas offentligt, skandal mellan skutorna, gammalt groll (fiende 3, fiende 18, fiende 19) blossar upp igen. Skäggtrion, striden om vem som är Skäggkonung (S-02), får extra bränsle.
Utfall om nej:  hemligheten överlever, men Blodig har nu ett vapen hon kan använda när som helst under kvällen.

Bygger på:      fiende 4 (Blodig–Frodig). Romans 8 (Rödskägg–Frodig), med hotet redan explicit noterat i `fiender.yaml`. Matchar Rödskäggs eget rollunderlag, som uttryckligen bjuder in att den förbjudna kärleken riskerar avslöjas. Fiende 3 (Lösskägg–Rödskägg) som Lösskäggs skäl att sprida vidare.
Speglas hos:    Blodig, Frodig, Rödskägg, Lösskägg.
Status:         skriven

Obs: Håll den förbjudna kärleken isär från förrädarspåret i forradare.yaml. De två uppdragen delar ingen mekanik. Blodig bär också S-01 och S-12: här en blick och ett smeknamn, där ett namn på en klient. Rödskägg och Lösskägg bär också S-02. Frodig bär också S-12.

---

## S-10: Teckenspråket

Akt:            II
Deltagare:      Kapten Döver (`navidmodiri`), Kapten Babord (`alexandrapalmquist`), Kapten Rötägg (`edvinthungren`), Kapten Fuling (`louisevonbahr`). Kapten Hjärter är målet, enväg, inte extra last för honom.
Roll i storyn:  jägare (Döver) / grindvakt, vittne (Babord, Rötägg, Fuling)
Kopplad till:   fiende 23. Korsar S-01 om Döver saboterar jakten på älskaren. Korsar köket, Hjärter har maten.

Vad de vill:    Döver vill sabotera sin nemesis Hjärter och samtidigt behålla sin fejkade dövhet, som han i verkligheten bara använder för att slippa strunt och tjuvlyssna ostört. Han har ett flaskat sanningsserum och vill hålla en workshop i sitt hittepå-teckenspråk. Babord, hans romans (7), älskar honom och kan täcka för honom. Rötägg vill vara snäll nu och hjälpa till, vilket är det sista Döver vill: Rötägg är gammal röta mot den "döve" från tiden före sin omvändelse (fiende 6). Fuling, hans eget skeppskamrat på Fördärvet, har länge anat att dövheten är påhitt men sagt inget, det passar henne bättre att ha en skuld att kräva in senare än att avslöja honom gratis.
Vad står i vägen: någon på ön kan riktigt teckenspråk och kan avslöja att Dövers är påhitt. Hjärter har redan sett honom reagera på ljud han "inte kan höra" och litar inte på handbabblet (fiende 23). Serumet kan hamna i fel hals. Rötägg som hjälper för mycket riskerar att avslöja mer än han vill.
Varför nu:      Hjärter lagar mat och jagar Malins älskare samtidigt: Döver kan stå vid kökskanten och "inte höra" precis där det är som mest värt att lyssna.

Hur det spelas: Döver håller sin workshop på gården som täckmantel för att tjuvlyssna brett. Serumet hamnar i en kopp nära Hjärter, eller nära den som hotar avslöja Döver. Babord översätter hans hittepå-tecken med rak min. Rötägg går på workshopen av ren vänlighet och kan råka visa, inför alla, att tecknen inte betyder något alls. Fuling säger ingenting på workshopen, men kan när som helst nämna för Döver, i förbifarten, att hon "alltid undrat" hur han klarar sig utan att höra, ett hot utan hot i orden.
Utfall om ja:   någon får bevis för att Döver hör allt. Hjärters jakt i S-01 störs eller får en falsk ledtråd, planterad av Döver. Fuling kan välja att kräva in sin tystnad som en tjänst, inte avslöja den.
Utfall om nej:  fiende 6 och 23 och romans 7 finns kvar olösta. Workshopen blir bara fest.

Bygger på:      romans 7 (Döver–Babord). Fiender 6 (Döver–Rötägg), 23 (Döver–Hjärter). Fulings etablerade vana att plantera och sitta på rykten (fiende 5) tillämpad här på sin egen skeppskamrat.
Speglas hos:    Döver, Babord, Rötägg, Fuling. Hjärter enväg, ingen ny egen jakt åt honom.
Status:         skriven

Obs: Babord bär redan mullvadsrelationen mot samma person, Döver (annan hemlighet, se mullvadstabellen): hon är hans handlerkontakt och hans romans i samma andetag, vilket redan är sant i `forradare.yaml`. Hon bär också S-03 (scarfen mot Barnsben). Håll teckenspråksbluffen, scarfen och förräderiet isär i gästtexten. Rötägg bär också S-07 och S-12, Fuling bär också S-04. Samma personer, olika relationer, ingen delad mekanik.

---

## Uppslag från befintligt material

Kopplingar i `romanser.yaml` och `fiender.yaml` som är särskilt lämpade att dras in i huvudstoryn, eftersom de redan har tryck och redan korsar skutor:

- **Barnsben som allas åtrå** (romanser 4, 5, 6 och fiender 12, 13). Fem personer i ett nät. **S-03, beslutad**, med Rosing och Nykter som jägare, Döver som enväg-vittne, Babord som jägare via fiende 12 (scarfen). S-10 förblir teckenspråket, inte scarfen.
- **Blodig och Hjärter om Malin** (romanser 17, 20 och fiende 21). Två anspråk på jubilaren. De jagar hennes hemliga älskare i hamnen. Sanningen är Karl XII, först i kistan. **S-01, beslutad.**
- **Enben mot Malin** (fiende 2). Den enda etablerade fiendskapen som går direkt mot Malin. Sannolikt vår viktigaste ingång till huvudstoryn. **S-06, beslutad.**
- **Hjärter, hemligt förälskad i Malin** (romans 17). Jagar rivalen privat, vid kökskanten. **S-01, beslutad.**
- **Rötägg som allas fiende** (fiender 6, 13, 14). Naturlig skurk i huvudstoryn. Inte tillsatt som mullvad. Adresserad via fiende 13 i **S-07**, fiende 6 i **S-10**, och som namnlös klient i **S-12** (fiende 25:s lucka). Fiende 14 förblir obesökt som motor.
- **Frodig och Rödskägg, förbjuden kärlek** (romans 8, fiende 25). Hotet från Blodig, redan noterat i `fiender.yaml` fiende 4, adresserat i **S-09, beslutad.** Fiende 25 (Kuling–Rödskägg) adresserad i **S-12, beslutad:** namnet på klienten, inte vattnet.
- **Hurring, Fuling, Klöver, Prygel** (romanser 12, 13, fiende 1, 5). **S-04, beslutad.**
- **Plåthorns horn mot Kuling och Prygel** (fiender 7, 24). **S-08, beslutad.**
- **Kosing och Dunka** (romans 19, låg intensitet, fiende 20 som garnering). **S-05, beslutad.**
- **Korthajarna Spader, Klöver, Hjärter.** Rivaliteten sitter i rollfilerna och nu i fiender 27–29. Spader palmerar, Klöver byter lek i tricket, Hjärter märker kort i köket. Insatsen är rykte, inte kristallfyrklövern. **S-11, beslutad.** Fiende 14 (Spader–Rötägg) förblir obesökt som motor.

---

## S-11: Korthajarna

Akt:            II, vid ett bord som tål kökskanten
Deltagare:      Löjtnant Spader (`gustaftadaa`), Kapten Klöver (`johannabergman`), Kapten Hjärter (`jesperlejfjord`), Kapten Prygel (`minervalowgren`), Kapten Plåthorn (`elinmartensson`)
Roll i storyn:  rivaler (Spader, Klöver, Hjärter) / grindvakt, dealer (Prygel) / vittne (Plåthorn)
Kopplad till:   ingen beat. Skild från S-02 (skäggtrions kamp om titeln) och S-04 (liggarjakten): samma personer förekommer, men annat bord, annan insats. Kökskanten på Fromheten.

Vad de vill:    sitta samma bord den här helgen och få de andra två utpekade som fuskare inför vittnen. Den som pekas ut förlorar rykte som haj. Klöver vill dessutom landa sitt episka korttrick publikt. Hjärter vill ha hemligt bus vid grytorna, nu när Katten Felix är borta. Spader vill inte bli tagen, och vill dessutom vinna tillbaka en av sina spader-ringar som Klöver vann av honom vid ett tidigare bord. Prygel vill se Klöver förlora, och ta dealerns procent. Plåthorn vill skydda Spader, eller sälja en detalj om hur han vinner, beroende på vad rummet ger.

Vad står i vägen: alla tre fuskar, på olika sätt, och var och en är säker på att det är de *andra* som fuskar. De behöver en "ärlig" dealer. Prygel hatar Klöver (fiende 1) och delar snett. Hjärter kan inte lämna köket. Plåthorn älskar Spader (romans 14) och är den enda som redan sett honom vinna när han borde förlora. Klöver bär ringen som en trofé bredvid kristallfyrklövern och släpper ingendera lätt.

Varför nu:      tre färgnamn på samma ö för första gången, tre hajars rykte i samma hamn. Fredag är off-story, retas får de. Partiet spelas lördag, när som helst det passar, ingen specifik klockslag. Även efter 15.30 fungerar ett publikt pekande, ett trick eller ett raseriutbrott vid bordet utan ny logik.

Hur det spelas: ett enda semi-publikt parti vid kökskanten, inte en jakt över ön och inte en ny svartklubb. Klöver öppnar bordet. Prygel delar, med sin lilla lek eller en vanlig lek hon kontrollerar. Anklagelser under given, inte efteråt: kasta kortet, kräva ny giv, peka, göra tricket. Hjärter spelar mellan grytor. Spader sitter med. Publiken får titta, det är så play to lift landar.

Sanningen, bara här, inte i gästtext som facit till ett pussel:

- Spader palmerar ess. Rörelsen täcks av att han pillar med spader-ringarna och halsbandet. Det är mysteriet hans rollfil lämnar olöst.
- Klöver byter lek mitt i det episka tricket. Tricket *är* fusket. Publiken ser trolleri. Hon kallar det skicklighet.
- Hjärter märker baksidor med kökssmet och kan plantera ett märkt kort mellan grytor. Det är buset, inte en razzia.

Var och en vet *sitt* fusk. Ingen av de tre får de andras metoder utskrivna. Plåthorn vet att Spader vinner när han borde förlora, inte hur Klöver eller Hjärter gör. Prygel behöver inte veta metoderna. Hon kan dela snett mot Klöver ändå.

Insatsen är rykte: vem som utpekas som fuskaren inför vittnen. Kristallfyrklövern är amulett, inte pokal och inte kortfärg, och sitter hos Klöver. Likaså en av Spaders spader-ringar, också vunnen av Klöver vid ett tidigare bord. Hjärter jagar inte fyrklövern i S-04, och inte här heller. Spader vill visst ha sin ring tillbaka, men om ringen eller fyrklövern hamnar på bordet som sidovad är det spel, inte motorn.

Rekvisita: en spelbar kortlek vid köket. Prygels lilla lek (hennes föremål). Valfritt extra ess till Spader. Ingen tryckt gåta.

Utfall om ja:   någon utpekas, sant eller falskt. Rykte knäcks eller tvättas. Klövers trick landar, eller åker dit. Prygel tar sin procent som delare oavsett, inte samma procent som i S-02: här är det given, inte vadslagningsboken. Spader kan vinna tillbaka sin ring, eller inte. Plåthorns romans kan läcka i samma veva, måste inte.
Utfall om nej:  rivaliteten finns kvar. Mysteriet hur Spader fuskar får förbli olöst, som rollfilen tillåter. Huvudstoryn går.

Bygger på:      fiender 27 (Spader–Klöver, nu även den vunna ringen), 28 (Spader–Hjärter), 29 (Klöver–Hjärter), nya. Fiende 1 (Klöver–Prygel). Romans 14 (Spader–Plåthorn), hemlig. Spaders olösta fusk. Klövers trick. Hjärters bus. Prygels lilla lek.
Speglas hos:    Spader, Klöver, Hjärter. Prygel. Plåthorn.
Status:         skriven

Obs: Klöver bär S-02, S-04, S-05 och S-11. De tre första är bank och procent. Här spelar hon, och här bär hon dessutom Hjärters kristallfyrklöver och en av Spaders spader-ringar som troféer. Håll isär i gästtexten. Prygel bär S-04 och S-08: där liten lek mot Klöver i liggarjakten respektive jakten på hornet. Här dealer vid hajbordet. Spader bär S-04 och S-08: skuld till Hurring, skydd av Plåthorn. Här sitter han och palmerar, och vill ha sin ring tillbaka från Klöver. Plåthorn bär S-08: hornet. Här vet hon om leken, inte om hornet. Hjärter bär S-01 och är envägsmål i S-10: jakten på Malins älskare och teckenspråket. Här bus vid grytorna. Rötägg är inte med. Fiende 14 förblir bakgrund. Klövers svartklubbar nämns inte som insats: det är sällskap, inte färgen, och det är Outline C som ströks.

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

Obs: Prygel valdes bort. Hon bär redan S-08 med Kuling vid samma kaj, och tre sidequests. En fjärde mot samma grindvakt hade blandat hornet och namnet. Blodig har fiende 4, fel säkerhet, och annan mekanik än S-09: här åtal, där nystande i en affär. Kuling bär S-06 och S-08: Malin respektive hornet. Här säljer hon ett årsgammalt namn. Rötägg bär S-07 och S-10: omvändelsen mot Planka, hjälpen Döver inte vill ha. Här ett skott han betalade. Frodig är inte mullvad (forradare 3 omsjumpad 2026-08-24). Håll isär från S-09 och från förrädarspåret.

Gästtext skriven 2026-08-25. Posterna 90–94 i `fordelning.yaml`.

