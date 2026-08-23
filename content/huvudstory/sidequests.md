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
Kopplad till:   B-nn i akter.md, Q-n i quests.md

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
| S-01 | Jakten på älskaren | Hjärter, Felix, Blodig. Malin leder fel. | II | jägare / bärare | beslutad |
| S-02 | Skäggtrion | Lösskägg, Rödskägg, Blåskägg | II | rivaler | beslutad |
| S-03 | Krumelurpillren | Barnsben, Nykter, Rosing | II / IV | jägare / bärare | idé |
| S-04 | Liggaren | Hurring, Klöver, Prygel | II | jägare / vittne | idé |
| S-05 | Kajhemligheten | Frodig, Fuling, Kuling. Rödskägg är hemligheten. | II | grindvakt / vittne | idé |
| S-06 | Teckenspråket | Döver, Babord, Rötägg. Hjärter är målet, enväg. | II | jägare / grindvakt | idé |
| S-07 | Hornet | Plåthorn, Prygel, Rosing | II | jägare / bärare | idé |
| S-08 | Fasanen | Enben, Planka, Hurring | II | jägare / vittne | idé |
| S-09 | Arvssyndskatten | Kosing, Dunka, Klöver | II | jägare / grindvakt | idé |

---

## Designregler för sidequests

1. **Bygg på det som redan finns.** Varje sidequest bör hänga på en befintlig romans eller fiendskap. Då blir den trovärdig direkt och behöver ingen ny bakgrund.
2. **Vilja utan förmåga, förmåga utan vilja.** Den som vill något ska behöva någon annans hjälp för att kunna. Det är motorn i lördagens sveksstämning.
3. **Minst tre inblandade**, i linje med `STYLE.md`. Två personer blir en duell, tre blir drama.
4. **Aldrig kritisk för huvudstoryn.** Om en sidequest inte spelas ska huvudstoryn ändå gå i mål. Sidequests är krydda, inte bärande balk.
5. **Korsa lagen.** En sidequest som bara går inom ett lag missar poängen. Låt den dra folk över skutgränser.
6. **Ge en handling, inte en känsla.** "Var svartsjuk" går inte att spela. "Ta reda på vad hon lade i fiskens gap innan hon hinner tillbaka" går att spela.
7. **Vet mottagaren att det är en sidequest?** Nej. Det ska stå i deras intrigfil som vilken intrig som helst.

## Balansräkning

Fylls i så att ingen får för många och ingen får noll. Målet från [`premiss.md`](premiss.md): var och en har minst en roll i huvudstoryn.

| slug | Antal sidequests | Roll i huvudstoryn | Akt där personen toppar |
|------|------------------|--------------------|-------------------------|
| `malintadaa` | 1 | antagonist, bärare | IV |
| `gustaftadaa` | | budbärare, spelledare | IV |
| `petterwallberg` | 1 | rival | II |
| `linneaappert` | | | |
| `ulrikahammar` | | | |
| `jesperlindmarker` | | | |
| `louisevonbahr` | | | |
| `josefinlowing` | 1 | grindvakt | II |
| `navidmodiri` | | | |
| `minimacklin` | 1 | jägare | II |
| `ludvigvonbahr` | | | |
| `amaliawahlstrom` | | | |
| `fabianmacklin` | | | |
| `josefinansund` | | | |
| `johannabergman` | | | |
| `jesperlejfjord` | 1 | jägare | II |
| `amandamungsgard` | | | |
| `viktoransund` | 2 | grindvakt, rival | II |
| `elinamelakoski` | 1 | jägare | II |
| `minervalowgren` | | | |
| `linneaekbom` | | | |
| `alexandrapalmquist` | | | |
| `hampuslindblad` | 1 | rival | II |
| `edvinthungren` | | | |
| `elinmartensson` | | | |

**Spridningsregel:** alla toppar får inte ligga i akt IV. Sikta på ungefär en fjärdedel i akt II, en fjärdedel vid brunchen och ritualen, resten i akt IV.

Tabellen räknar bara **beslutade** sidequests. Idéerna S-03 till S-09 är täckning, inte last. Om de tas: se täckningstabellen under idéerna. Tunga dubletter att välja bort: Rosing i både S-03 och S-07, Prygel i både S-04 och S-07, Hurring i både S-04 och S-08, Klöver i både S-04 och S-09, Kuling redan grindvakt för båtarna plus S-05.

## S-01: Jakten på älskaren

Akt:            II
Deltagare:      Kapten Hjärter (`jesperlejfjord`), Katten Felix (`elinamelakoski`), Kapten Blodig (`minimacklin`). Svarta Malin (`malintadaa`) bär sanningen.
Roll i storyn:  jägare / bärare
Kopplad till:   B-13, B-42

Vad de vill:    ta reda på vem Malin gömmer
Vad står i vägen: hon leder fel. Rivalen ser ut att sitta vid bordet. Sanningen är Karl XII, och den sitter i kistan.
Varför nu:      festen, närheten, att hon försvinner. Innan sista skålen.

Hur det spelas: de tre jagar bland kaptenerna. Felix bara privat, med Hjärter. Malin varken bekräftar eller förnekar ett namn i hamnen. Flera romanser samtidigt är tillåtna och gömmer den hemliga.
Utfall om ja:   fel person utpekas, scener, svartsjuka. Punchlinen vid kistan blir personlig.
Utfall om nej:  kistan bär det ändå. Miniatyren och kontraktets sista rad.

Bygger på:      romanser 17, 18, 20, 22. Fiende 21 (Hjärter–Blodig) om den spelas.
Speglas hos:    Hjärter och Felix speglar jakten. Malin speglar inte deras kärlek. Blodig enväg.
Status:         beslutad

## S-02: Skäggtrion

Akt:            II
Deltagare:      Kapten Lösskägg (`petterwallberg`), Kapten Rödskägg (`viktoransund`), Kapten Blåskägg (`hampuslindblad`)
Roll i storyn:  rivaler
Kopplad till:   B-15

Vad de vill:    vara Skäggkonung. Eller åtminstone se till att de andra inte är det.
Vad står i vägen: de två andra. Blåskägg har redan krönt sig. Lösskägg samlar skägg. Rödskägg är kränkt.
Varför nu:      tre skäggnamn på samma ö. Festen. Folk som tittar.

Hur det spelas: TBD. Skriv en kul, publik intrig senare. Inte bärande balk. Inte en lång scen långt från kajen: Rödskägg har båtarna.
Utfall om ja:   någon kröns, eller ingen, eller alla tre. Folk har sett det.
Utfall om nej:  fiendskaperna finns kvar. Huvudstoryn går.

Bygger på:      fiender 3, 18, 19
Speglas hos:    alla tre
Status:         beslutad

## Idéer från `content/roller/`

Förslag, inte beslut. Ingen gästtext. Inte i `fordelning.yaml`. Huvudstoryn går om ingen av dem spelas.

Källan är gästernas eget underlag i `../roller/`, hängt på poster i `romanser.yaml` och `fiender.yaml`. Tomma rollerfiler (Planka, Fuling, Enben, Blåskägg) får ändå kort via yaml och andras föremål. Spader får ingen egen jakt: han bad om att inte få mer praktiskt ansvar. Kortfusket är garnering i S-04.

Mullvad och sidequest är två hemligheter. Skriv dem inte som samma uppdrag. Barnsben är mullvad mot Nykter, Frodig mot Rosing, Babord mot Döver, Prygel mot Hurring, Fuling mot Hjärter.

### Täckning om idéerna tas

| slug | Idéer | Rollerobjekt som bär handlingen |
|------|-------|--------------------------------|
| `linneaappert` | S-08 | tom rollfil. På Kurtisanen, kan lyssna vid Malins bord. Romans 3. |
| `ulrikahammar` | S-03 | krumelurpiller, syhörna |
| `jesperlindmarker` | S-04, S-08 | svart liggare, vem angav honom |
| `louisevonbahr` | S-05 | tom rollfil. Romans 10, kan sälja eller begrava ryktet |
| `josefinlowing` | S-05 | familjesmycke, båtar, bakhåll mot Rödskägg |
| `navidmodiri` | S-06 | fejkdöv, sanningsserum, workshop, nemesis Hjärter |
| `ludvigvonbahr` | S-09 | tvåeggat svärd med lögnig historia, långa kramar |
| `amaliawahlstrom` | S-08 | tom rollfil. Fiende 2 mot Malin |
| `fabianmacklin` | S-03 | njutningsstatyett, frieri till Barnsben |
| `josefinansund` | S-05 | förbjuden kärlek med Rödskägg |
| `johannabergman` | S-04, S-09 | svartklubb, kristallfyrklöver, skvaller mot choklad |
| `amandamungsgard` | S-09 | arvssyndskatt, mynt, låg intensitet, vill spela med Dunka |
| `minervalowgren` | S-04, S-07 | liten kortlek, vill krossa hornet |
| `linneaekbom` | S-03, S-07 | duell, kan inte simma, talande snäcka |
| `alexandrapalmquist` | S-06 | sjökort, romans med Döver, scarf-oförrätt |
| `edvinthungren` | S-06 | vill vara snäll, enhörningsmanschetter från Planka |
| `elinmartensson` | S-07 | plåthorn, klagomur |
| `gustaftadaa` | ingen jakt | kortfusk som garnering i S-04. Inte mer ansvar. |

---

## S-03: Krumelurpillren

Akt:            II, avgörs i skymningen mot IV
Deltagare:      Kapten Barnsben (`ulrikahammar`), Kapten Nykter (`fabianmacklin`), Kapten Rosing (`linneaekbom`)
Roll i storyn:  jägare / bärare
Kopplad till:   ingen beat än. Korsar kökskanten (Nykter har maten). Inte Q-2.

Vad de vill:    Barnsben måste ta ett piller när mörkret faller, annars växer hon. Ingen ska se. Nykter vill vara den hon litar på i skymningen, och gärna den som håller burken. Rosing vill detsamma, och vill dessutom utmana någon på duell om saken blir publik.
Vad står i vägen: de två andra. Burken är liten och kan stjälas. Döver har redan tjuvlyssnat på Nykters frieri (fiende 11). Babord hatar Barnsben för breven i scarfen (fiende 12) och kan sno pillren som hämnd, men hon är inte deltagare här: det är kollision med S-06.
Varför nu:      första skymningen som räknas är lördag. Fredag är off-story. Efter ritualen är det kropp, inte pussel: att gömma en burk, smyga i en klick, ta ett piller.

Hur det spelas: Barnsben sätter en syhörna. Nykter och Rosing uppvaktar. En av dem försöker få burken. Barnsben kan släppa ett piller i en drink hos den som blivit för vuxen. Själva intaget sker när det mörknar, inte vid Gubben i stubben.
Utfall om ja:   någon har burken, någon har sett intaget, någon har fått ett piller i sig. Svartsjuka vid syhörnan. Duellen kan bli av, eller inte.
Utfall om nej:  Barnsben tar pillret privat. Romanserna 4 och 5 och fiende 10 finns kvar.

Bygger på:      romanser 4, 5. Fiende 10. Inte mullvad 1: det är ett annat uppdrag mot Nykter.
Speglas hos:    alla tre. Döver enväg om han råkar höra. Inte Barnsben mot Döver (romans 6) i den här jakten.
Status:         idé

Last: Rosing också i S-07. Om hon bara får en: behåll S-03, byt tredje i S-07.

---

## S-04: Liggaren

Akt:            II
Deltagare:      Kapten Hurring (`jesperlindmarker`), Kapten Klöver (`johannabergman`), Kapten Prygel (`minervalowgren`)
Roll i storyn:  jägare / vittne
Kopplad till:   ingen beat än. Inte S-01. Hjärters kristallfyrklöver sitter redan hos Klöver, Hjärter jagar inte den.

Vad de vill:    Hurring vill veta vem som angav honom och sätta nya skulder i liggaren. Klöver vill läsa liggaren och sälja skvaller mot choklad. Prygel vill vara den Hurring är lojal mot, och straffa Klöver för den stulna valsen.
Vad står i vägen: liggaren får stjälas, läsas, skrivas i. En del rader är sanna, en del är lögner Hurring glömt. Klöver och Prygel älskar båda Hurring (romanser 12, 13) och hatar varandra (fiende 1). Blåskägg har redan naglat IOU:er i masten (fiende 8): han är inte deltagare, men en rad i boken kan peka dit.
Varför nu:      alla tre sitter vid samma fest. Liggaren är på personen. Svartklubben kan slås upp mellan jakterna.

Hur det spelas: någon tar boken. Någon lägger i en rad. Klöver håller ett kortbord och lossar tungan mot choklad. Prygel har en liten kortlek och kan fuska tillbaka. Spaders kortfusk är garnering: den som jagar metoden kan fråga honom, han får inte ett eget uppdrag.
Utfall om ja:   ett namn pekas ut som angivare. Det får inte vara Malin som facit. Flera versioner av samma skuld cirkulerar.
Utfall om nej:  liggaren stannar hos Hurring. Fiende 1 och romanserna finns kvar.

Bygger på:      romanser 12, 13. Fiender 1, 8. Inte mullvad 4: Prygel mot Hurring är ett annat uppdrag.
Speglas hos:    alla tre. Spader enväg om fusket kommer upp.
Status:         idé

Last: Hurring också i S-08, Prygel också i S-07, Klöver också i S-09.

---

## S-05: Kajhemligheten

Akt:            II, före 13.30 om vattnet behövs
Deltagare:      Kapten Frodig (`josefinansund`), Kapten Fuling (`louisevonbahr`), Kapten Kuling (`josefinlowing`). Kapten Rödskägg (`viktoransund`) är hemligheten, inte ny jägare.
Roll i storyn:  grindvakt / vittne
Kopplad till:   B-14. Korsar S-02 om Fuling säljer ryktet till Blåskägg.

Vad de vill:    Frodig vill träffa Rödskägg utan att släkterna får veta. Hon behöver kaj, båt eller alibi. Kuling har båtarna och sköt Rödskägg i ryggen för ett år sedan: hon ser kajen. Fuling kan begrava mötet eller sälja det, särskilt till Blåskägg som hon har romans med.
Vad står i vägen: Rödskägg är redan i S-02 och har båtarna. Ge honom inte en ny jakt. Blodig hatar Frodig (fiende 4) och kan nysta, men hon är redan i S-01: kollision, inte fjärde jägare. Piratpulver i Rödskäggs väska kan köpa tystnad eller mod, utan egen quest.
Varför nu:      tre skutor på samma ö. Kajen är publik. Överfart stänger 13.30.

Hur det spelas: Frodig ber om eka, kajak eller ett alibi på land. Kuling vägrar, mutas, eller följer med och ser. Fuling får höra och väljer. Scenen hålls vid kajen, inte långt inne i skogen. Aldrig ensam på vattnet.
Utfall om ja:   mötet syns, eller ryktet går, eller alibit håller till kistan. S-02 kan få bränsle.
Utfall om nej:  romans 8 och fiende 25 finns kvar. Ingen måste ut på vattnet.

Bygger på:      romans 8, 10. Fiende 25. Inte mullvad 3: Frodig mot Rosing är ett annat uppdrag.
Speglas hos:    Frodig och Kuling. Fuling. Rödskägg speglar mötet, inte en ny jakt.
Status:         idé

Last: Kuling har redan båtarna. En scen vid kajen, inte en lång kedja.

---

## S-06: Teckenspråket

Akt:            II
Deltagare:      Kapten Döver (`navidmodiri`), Kapten Babord (`alexandrapalmquist`), Kapten Rötägg (`edvinthungren`). Kapten Hjärter är målet enväg, inte extra last.
Roll i storyn:  jägare / grindvakt
Kopplad till:   fiende 23. Korsar S-01 om Döver saboterar jakten på älskaren. Korsar köket.

Vad de vill:    Döver vill sabotera Hjärter och behålla fejkdövheten. Han har sanningsserum och vill hålla en workshop i hittepå-tecken. Babord älskar honom och kan täcka. Rötägg vill vara snäll nu och hjälpa till, vilket är det sista Döver vill: Rötägg är gammal röta mot den "döve" (fiende 6).
Vad står i vägen: någon på ön kan riktigt teckenspråk och kan avslöja honom. Hjärter har redan sett honom reagera på ljud. Serumet i fel hals. Rötägg som hjälper för mycket.
Varför nu:      Hjärter lagar mat och jagar Malins älskare. Döver kan stå vid kökskanten och "inte höra".

Hur det spelas: workshop på gården som täckmantel. Serum i en kopp nära Hjärter eller nära den som ska avslöja Döver. Babord översätter hittepå. Rötägg går på workshopen för att vara vänlig och kan råka visa att tecknen är strunt. Hjärter får inte en ny egen jakt: han är måltavla.
Utfall om ja:   någon tror Döver är döv, eller någon har bevis för motsatsen. Hjärters jakt i S-01 störs eller får en falsk ledtråd.
Utfall om nej:  fiende 6 och 23 och romans 7 finns kvar. Workshopen blir bara fest.

Bygger på:      romans 7. Fiender 6, 23. Inte mullvad 5: Babord mot Döver är ett annat uppdrag.
Speglas hos:    alla tre. Hjärter enväg.
Status:         idé

---

## S-07: Hornet

Akt:            II, gärna publik strid eller brunchskål
Deltagare:      Kapten Plåthorn (`elinmartensson`), Kapten Prygel (`minervalowgren`), Kapten Rosing (`linneaekbom`)
Roll i storyn:  jägare / bärare
Kopplad till:   klagomuren på Gnället. Inte vattnet som duellplats: Rosing kan inte simma, och aldrig ensam.

Vad de vill:    Plåthorn vill ha hornet kvar som flyktväg när det blir närkamp. Prygel vill se det krossat. Rosing vill ha en duell med ära, och hornet skulle förstöra den, eller bli hennes utväg om duellen går snett.
Vad står i vägen: hornet är på personen. Ryktet är känt. Kuling hatar också Plåthorn (fiende 7) och kan dyka upp vid en skål, men hon är redan grindvakt plus S-05: inte fjärde jägare.
Varför nu:      första publika slagsmålet eller skålen. Klagomuren ger en naturlig publik.

Hur det spelas: någon utmanar. Hornet åker fram, eller någon försöker sno det före. Prygel går för att krossa. Rosing väljer: ära utan horn, eller horn och flykt. Duellen är eyegazing, rom, eller dramatisk entré, inte simning.
Utfall om ja:   hornet krossas, stjäls, eller blåses. En skål urartar. Folk har sett det.
Utfall om nej:  fiende 24 finns kvar. Plåthorn smiter på annat sätt.

Bygger på:      fiende 24. Rosing vill duellera enligt rollfilen. Inte romans 14: Spader speglar inte, han har nog.
Speglas hos:    alla tre.
Status:         idé

Last: Rosing också i S-03, Prygel också i S-04. Om bara en var: behåll Prygel här (hornet är hennes underlag), byt Rosing mot den som utmanar på klagomuren.

---

## S-08: Fasanen

Akt:            II
Deltagare:      Kapten Enben (`amaliawahlstrom`), Kapten Planka (`linneaappert`), Kapten Hurring (`jesperlindmarker`)
Roll i storyn:  jägare / vittne
Kopplad till:   fiende 2. Inte bärande balk mot kistan. Inte S-01: de jagar inte älskaren.

Vad de vill:    Enben vill ha ett publikt recant av skålen om fasanen som inte kan flyga, eller bevis för att Malin kapade hennes skiff. Planka sitter på Kurtisanen och kan lyssna vid Malins bord. Hurring misstänker redan att Malin angav honom, och sitter på liggaren.
Vad står i vägen: Malin bekräftar eller förnekar inte. S-01 ska fortfarande kunna gissa fel om älskaren. Kosing har också en lågintensiv oförrätt mot Malin (fiende 17) men vill inte stå i centrum: hon är inte deltagare här. Kuling har Malin som största oförrätt i rollfilen, men hon är redan båtar plus S-05.
Varför nu:      festen, skålarna, att Enben och Malin är i samma hamn.

Hur det spelas: Enben samlar vittnesmål. Planka tar en mening från Kurtisanens kaj. Hurring byter en rad i liggaren mot ett namn eller en skiff-historia. Ingen ny logik, inget pussel. Inte peka ut kungen.
Utfall om ja:   en skål, ett rykte, en rad i boken. Malin ser skyldig ut för något som inte är kontraktet.
Utfall om nej:  fiende 2 finns kvar. Kistan bär förräderiet ändå.

Bygger på:      fiende 2. Plankas tomma rollfil plus romans 3 som inte används här. Hurring från S-04-objektet.
Speglas hos:    Enben och Hurring. Planka. Malin speglar inte: hon leder fel eller tiger, samma gest som i S-01.
Status:         idé

Last: Hurring också i S-04. Om bara en: behåll S-04, byt Hurring här mot Fuling (säljer rykte, redan i S-05) eller stryk S-08. Enben ska ändå ha *någon* roll mot Malin när gästtexten skrivs. Det kan vara huvudstory, inte sidequest.

---

## S-09: Arvssyndskatten

Akt:            II, gärna när folk äter
Deltagare:      Kapten Kosing (`amandamungsgard`), Kapten Dunka (`ludvigvonbahr`), Kapten Klöver (`johannabergman`)
Roll i storyn:  jägare / grindvakt
Kopplad till:   ingen beat än. Låg intensitet för Kosing. Inte kidnappning, inte publik rättegång, inte Mini.

Vad de vill:    Kosing vill införa arvssyndskatt och spela med Dunka. Dunka vill se stor ut med det tvåeggade svärdet och inte bli avslöjad som bluff. Klöver vill ha choklad och skvaller, och Kosing har redan planerat en hemlig ätupplevelse med henne.
Vad står i vägen: Nykter gjorde Dunkas svärdhistoria till hamnskämt (fiende 20). Han är inte deltagare: han kan skratta från kökskanten som kollision med S-03. Dunkas kramar är "indrivning". Kosings skatt av mynt är kassan.
Varför nu:      folk har fickor, skålar och skuld. Brunch och kvällsmat ger naturliga stopp.

Hur det spelas: Kosing sätter taxan i en mening. Dunka går runt med svärd och kräv. Klöver släpper namn mot choklad eller tar betalt för att *inte* berätta svärdlögnen. Den hemliga ätupplevelsen är droppen där kassan räknas, inte en scen mitt på gården.
Utfall om ja:   någon har betalat, någon har vägrat, svärdet har avkrävts en historia. Kosing har inte stått i en ring med hela ön.
Utfall om nej:  romans 19 och fiende 20 finns kvar.

Bygger på:      romans 19. Fiende 20 som kollision. Kosings och Klövers gemensamma matplan i rollfilen.
Speglas hos:    alla tre. Nykter enväg om svärdet kommer upp.
Status:         idé

Last: Klöver också i S-04. Om bara en: behåll S-04, byt Klöver här mot Nykter (då får Nykter S-03 plus S-09).

---

## Uppslag från befintligt material

Kopplingar i `romanser.yaml` och `fiender.yaml` som är särskilt lämpade att dras in i huvudstoryn, eftersom de redan har tryck och redan korsar skutor:

- **Barnsben som allas åtrå** (romanser 4, 5, 6 och fiender 12, 13). Fyra personer i ett nät. **S-03, idé.** Döver och Babord är kollision, inte fjärde jägare.
- **Blodig, Hjärter och Felix om Malin** (romanser 17, 18, 20 och fiende 21). Tre anspråk på jubilaren. De jagar hennes hemliga älskare i hamnen. Sanningen är Karl XII, först i kistan. **S-01, beslutad. Gästtext inte skriven.**
- **Enben mot Malin** (fiende 2). Den enda etablerade fiendskapen som går direkt mot Malin. Sannolikt vår viktigaste ingång till huvudstoryn. **S-08, idé.** Inte bärande balk. Kan bli huvudstory-roll istället för sidequest.
- **Hjärter och Felix, båda hemligt förälskade i Malin** (romanser 17, 18). De vet om varandra. Två vittnen som vill henne väl och därför kan bära obekväm sanning. De jagar rivalen tillsammans, Felix bara privat. **S-01, beslutad. Gästtext inte skriven.**
- **Rötägg som allas fiende** (fiender 6, 13, 14). Naturlig skurk i huvudstoryn. Inte tillsatt som mullvad. I S-06 är han den som vill vara snäll och därför är farlig för Döver. Mullvad väljs när questsen är färdigskrivna.
- **Frodig och Rödskägg, förbjuden kärlek** (romans 8, fiende 25). **S-05, idé.** Rödskägg får inte ny jakt.
- **Hurring, Klöver, Prygel** (romanser 12, 13, fiende 1). **S-04, idé.**
- **Plåthorns horn mot Prygel** (fiende 24). **S-07, idé.**
- **Kosing och Dunka** (romans 19, låg intensitet). **S-09, idé.**
