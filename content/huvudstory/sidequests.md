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
| S-01 | Jakten på älskaren | Hjärter, Blodig, Enben, Dunka. Malin leder fel. | II | jägare / bärare | beslutad |
| S-02 | Skäggtrion | Lösskägg, Rödskägg, Blåskägg, Klöver | II | rivaler / grindvakt | beslutad |
| S-03 | Krumelurpillren | Barnsben, Nykter, Rosing, Döver | II | jägare / bärare / vittne | beslutad |
| S-04 | Liggaren | Hurring, Fuling, Klöver, Prygel, Blåskägg | II | jägare / bärare / vittne | beslutad |
| S-05 | Svärdet och arvssynden | Dunka, Kosing, Nykter, Klöver | II | bärare / grindvakt / jägare | beslutad |
| S-06 | Enbens räkning | Enben, Kuling, Malin, Hurring | II–IV | jägare / antagonist / vittne | beslutad |
| S-07 | Rötäggets bevis | Rötägg, Planka, Barnsben, Nykter | II | bärare / jägare / vittne | beslutad |
| S-08 | Jakten på Plåthornet | Plåthorn, Kuling, Prygel, Rosing | II–IV | grindvakt / jägare / vittne | beslutad |
| S-09 | Blodigs hot | Blodig, Frodig, Rödskägg, Lösskägg | II–IV | jägare / bärare | beslutad |
| S-10 | Teckenspråket | Döver, Babord, Rötägg, Fuling. Hjärter är målet, enväg. | II | jägare / grindvakt / vittne | beslutad |

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
| `gustaftadaa` | | budbärare, spelledare | IV |
| `petterwallberg` | 2 | rival, jägare | II–IV |
| `linneaappert` | 1 | jägare | II |
| `ulrikahammar` | 2 | bärare, vittne | II |
| `jesperlindmarker` | 2 | jägare, vittne | II–IV |
| `louisevonbahr` | 2 | bärare, vittne | II |
| `josefinlowing` | 3 | grindvakt, jägare | II–IV |
| `navidmodiri` | 2 | jägare, vittne | II |
| `minimacklin` | 2 | jägare | II–IV |
| `ludvigvonbahr` | 2 | bärare | II |
| `amaliawahlstrom` | 2 | jägare, vittne | II–IV |
| `fabianmacklin` | 3 | jägare, vittne | II |
| `josefinansund` | 1 | bärare | II–IV |
| `johannabergman` | 3 | vittne, grindvakt | II |
| `jesperlejfjord` | 1 | jägare | II |
| `amandamungsgard` | 1 | grindvakt | II |
| `viktoransund` | 3 | grindvakt, rival, bärare | II–IV |
| `minervalowgren` | 2 | vittne, jägare | II–IV |
| `linneaekbom` | 2 | jägare, vittne | II–IV |
| `alexandrapalmquist` | 1 | grindvakt | II |
| `hampuslindblad` | 2 | rival, vittne | II |
| `edvinthungren` | 2 | bärare, vittne | II |
| `elinmartensson` | 1 | grindvakt | II–IV |

**Spridningsregel:** alla toppar får inte ligga i akt IV. Sikta på ungefär en fjärdedel i akt II, en fjärdedel vid brunchen och ritualen, resten i akt IV. Ingen av S-03 till S-10 toppar rent i akt IV: de sträcker sig som mest in i kvällens kaos (II–IV), vilket håller spridningen på rätt sida om regeln.

**Utökning 2026-08-23:** varje sidequest fick en eller två extra deltagare, enligt regeln att fler ska ha fyra eller fem inblandade, inte bara det minsta av tre. Tillägget är genomgående enkelt: en person som redan bär ett etablerat drag (skvaller mot betalning, tjuvlyssning, en gammal skuld, en rivalitet) får samma ledtråd eller bakgrundsinfo som huvuddeltagarna, oftast som enväg-vittne, sällan som ny aktiv jägare. Ingen sidequest fick ny mekanik för att rymma fler, se "Hur det spelas" i respektive avsnitt.

S-01 till S-10 är nu alla **beslutade** (2026-08-23). Gästfilerna nollställdes 2026-08-23: ingen gästtext är skriven, utskrift är pending. Sidequest-poster som redan ligger i [`fordelning.yaml`](fordelning.yaml) är tillbaka på pending. Skriv ett i taget enligt arbetsordningen i [`README.md`](README.md).

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
Status:         beslutad

Obs: Enben bär också S-06, samma måltavla (Malin) men en annan handling: här sprider hon en falsk ledtråd, i S-06 tar hon eller Kuling något ifrån henne. Dunka bär också S-05, samma fåfänga (vill se stor ut) men en annan konsekvens: här gynnar den honom, i S-05 avslöjar den honom.

## S-02: Skäggtrion

Akt:            II
Deltagare:      Kapten Lösskägg (`petterwallberg`), Kapten Rödskägg (`viktoransund`), Kapten Blåskägg (`hampuslindblad`), Kapten Klöver (`johannabergman`)
Roll i storyn:  rivaler / grindvakt (Klöver)
Kopplad till:   B-15

Vad de vill:    vara Skäggkonung. Eller åtminstone se till att de andra inte är det. Klöver vill bara ha en bra bank.
Vad står i vägen: de två andra. Blåskägg har redan krönt sig. Lösskägg samlar skägg. Rödskägg är kränkt.
Varför nu:      tre skäggnamn på samma ö. Festen. Folk som tittar.

Hur det spelas: kajen kröner den som får högst skål vid båtarna, inför folk. Fredag: de tre retas, Klöver öppnar boken. Lördag: hyllningen ska landa innan sista skålen. Lösskägg plundrar de andras skägg och sätter vunna tofsar på folk. Rödskägg mutar med Piratpulver och stannar vid båtarna. Blåskägg försvarar den krona han redan satt på sig. Klöver tar procent, choklad lika bra som mynt. Inte bärande balk. Inte en lång scen långt från kajen.
Utfall om ja:   någon kröns, eller ingen, eller alla tre. Folk har sett det. Klöver går plus oavsett utfall.
Utfall om nej:  fiendskaperna finns kvar. Huvudstoryn går.

Bygger på:      fiender 3, 18, 19. Klövers etablerade svartklubbsverksamhet i rollunderlaget.
Speglas hos:    alla tre. Klöver enväg, hon bryr sig bara om vadet.
Status:         beslutad

Obs: Klöver bär också S-04 och S-05, samma etablerade drag (vadslagning, skvaller mot betalning), inte samma mekanik.

## S-03 till S-10: bakgrund och tabeller

Beslutade 2026-08-23. Ingen gästtext skriven än. Inte i `fordelning.yaml`. Huvudstoryn går ändå i mål om någon enskild inte spelas, som alla sidequests.

Källan är gästernas eget underlag i `../roller/`, hängt på poster i `romanser.yaml` och `fiender.yaml`. Tomma rollerfiler (Planka, Fuling, Enben, Blåskägg) får ändå kort via yaml och andras föremål. Spader får ingen egen jakt: han bad om att inte få mer praktiskt ansvar, och Kosing vill uttryckligen inte stå i centrum av ett högintensivt drama.

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
| `linneaappert` | S-07 | tom rollfil. Romans 3: fick manschettknapparna hon gav bort. |
| `ulrikahammar` | S-03, S-07 | krumelurpiller, syhörna. Redan mullvad mot Nykter (annan hemlighet). |
| `jesperlindmarker` | S-04, S-06 | svart liggare, vem angav honom. Redan Prygels mullvadskontakt (annan hemlighet). |
| `louisevonbahr` | S-04, S-10 | tom rollfil. Fiende 5: planterade rykte mot Planka. Redan mullvad mot Hjärter (annan hemlighet). |
| `josefinlowing` | S-06, S-08 | familjesmycke, båtar, egen oförrätt mot Malin, bakhåll mot Rödskägg |
| `navidmodiri` | S-03, S-10 | fejkdöv, sanningsserum, workshop, nemesis Hjärter. Redan Babords mullvadskontakt (annan hemlighet). |
| `ludvigvonbahr` | S-05 | tvåeggat svärd med lögnig historia, långa kramar |
| `amaliawahlstrom` | S-01, S-06 | tom rollfil. Fiende 2 mot Malin, sannolikt viktigaste ingången till huvudstoryn |
| `fabianmacklin` | S-03, S-05, S-07 | njutningsstatyett, frieri till Barnsben. Redan Barnsbens mullvadskontakt (annan hemlighet). |
| `josefinansund` | S-09 | förbjuden kärlek med Rödskägg. Redan mullvad mot Rosing (annan hemlighet). |
| `johannabergman` | S-02, S-04, S-05 | svartklubb, kristallfyrklöver, skvaller mot choklad |
| `amandamungsgard` | S-05 | arvssyndskatt, mynt, låg intensitet, vill spela med Dunka |
| `minervalowgren` | S-04, S-08 | liten kortlek, vill krossa hornet. Redan mullvad mot Hurring (annan hemlighet). |
| `linneaekbom` | S-03, S-08 | duell, kan inte simma, talande snäcka. Redan Frodigs mullvadskontakt (annan hemlighet). |
| `alexandrapalmquist` | S-10 | sjökort, mild ordning, romans med Döver. Redan mullvad mot Döver (annan hemlighet). |
| `edvinthungren` | S-07, S-10 | vill vara snäll, enhörningsmanschetter från Planka |
| `elinmartensson` | S-08 | plåthorn, klagomur |
| `gustaftadaa` | ingen jakt | kortfusk som garnering i S-04. Inte mer ansvar. |

Sju personer bär två sidequests: `ulrikahammar`, `jesperlindmarker`, `louisevonbahr`, `navidmodiri`, `amaliawahlstrom`, `minervalowgren`, `linneaekbom`. Två bär tre: `fabianmacklin`, `johannabergman`. Alla har rollunderlag med gott om material att bära det på, och ingen av lasterna delar mekanik mellan sidequesterna: se "Obs"-raden under respektive sidequest för hur de hålls isär i gästtexten.

---

## S-03: Krumelurpillren

Akt:            II, avgörs i skymningen
Deltagare:      Kapten Barnsben (`ulrikahammar`), Kapten Nykter (`fabianmacklin`), Kapten Rosing (`linneaekbom`), Kapten Döver (`navidmodiri`)
Roll i storyn:  bärare (Barnsben) / jägare (Nykter, Rosing) / vittne (Döver, enväg)
Kopplad till:   ingen beat än. Korsar kökskanten, Nykter har maten.

Vad de vill:    Barnsben måste ta ett av sina krumelurpiller när mörkret faller, annars slutar hon vara barnslig och börjar bli stor, vilket hon fasar för. Ingen ska se. Nykter vill vara den hon litar på i skymningen och gärna den som håller burken. Rosing vill detsamma, utan att veta att Nykter redan ligger risigt nära henne av ett annat skäl.
Vad står i vägen: Barnsben bjuder bara särskilt invigda, och burken är liten och lätt att sno. Nykters uppvaktning av Barnsben är redan hans täckmantel för att hålla henne som mullvad (se mullvadstabellen ovan): han vet mer om henne än han visar, vilket gör hans intresse svårare att läsa för både Barnsben och Rosing. Rosing vågar inte fråga rakt ut vem Barnsben egentligen litar på, av rädsla för svaret.
Varför nu:      första skymningen som räknas är lördag. Fredag är off-story. Efter ritualen är det kropp, inte pussel: att gömma en burk, smyga i en klick, ta ett piller går fortfarande att spela utan logik.

Hur det spelas: Barnsben håller sin sy- och broderihörna öppen som naturlig samlingsplats. Nykter och Rosing uppvaktar henne var för sig under dagen, i hopp om att bli den hon anförtror sig åt när mörkret faller. Barnsben kan dela ut ett piller till den hon litar mest på, eller lägga ett i en drink hos någon hon tycker blivit för allvarlig och vuxen under dagen. Döver, som av gammal vana tjuvlyssnar bakom sin fejkade dövhet, hör mer av syhörnans viskningar än någon anar och vet redan vem Barnsben egentligen litar på, utan att säga något.
Utfall om ja:   någon får burken, någon ser intaget, ett piller hamnar hos fel person. Svartsjuka mellan Nykter och Rosing vid syhörnan. Döver kan, om han vill, avslöja vem Barnsben valde, eller hålla tyst och spara det.
Utfall om nej:  Barnsben tar sitt piller privat och ensam. Romanserna 4 och 5 finns kvar oförlösta.

Bygger på:      romanser 4, 5. Samma underliggande relation som mullvad 1 (Nykter–Barnsben), men en annan konsekvens av den: uppvaktningen syns här, förräderiet syns inte.
Speglas hos:    Barnsben, Nykter, Rosing. Döver enväg, han lyssnar men agerar inte.
Status:         beslutad

Obs: Nykter bär också S-05 och S-07, Barnsben bär också S-07, Döver bär också S-10. Ingen av dem delar mekanik mellan sidequesterna.

---

## S-04: Liggaren

Akt:            II
Deltagare:      Kapten Hurring (`jesperlindmarker`), Kapten Fuling (`louisevonbahr`), Kapten Klöver (`johannabergman`), Kapten Prygel (`minervalowgren`), Kapten Blåskägg (`hampuslindblad`)
Roll i storyn:  jägare (Hurring) / bärare (Fuling) / vittne (Klöver, Prygel, Blåskägg)
Kopplad till:   ingen beat än. Inte S-01. Hjärters kristallfyrklöver sitter redan hos Klöver från ett kortspel, Hjärter jagar inte den här.

Vad de vill:    Hurring vill äntligen veta vem som angav honom för många år sedan och satte honom i fängelse, och skriva en ny rad i sin svarta liggare den här helgen.
Vad står i vägen: sanningen ligger begravd. Fuling har alltid nekat att hon planterar rykten, trots att det är precis vad hon gjorde mot Planka (fiende 5, det planterade silverryktet efter en förlorad auktion). Ingen misstänker den tysta ryktesspridaren för något så allvarligt som ett angiveri. Klöver och Prygel, båda ihop med Hurring samtidigt (romanser 12 och 13, han vet, de vet inte om varandra) och sedan länge ovänner (fiende 1, en stulen vals och äran för en gemensam bordning), hjälper honom helst var för sig och tävlar om att vara den som löser gåtan, inte om att slå sig samman.
Varför nu:      alla från den tiden är samlade på samma ö för första gången, och liggaren behöver en ny sida.

Hur det spelas: Hurring förhör gamla bekanta och driver in skulder, och stämmer av deras historier mot liggaren. Klöver, som driver hemliga spelklubbar och byter skvaller mot choklad, har hört ett fragment som pekar mot "någon som är bra på rykten" men vill ha betalt för att dela det, gärna av Prygel snarare än gratis. Prygel har sin lilla kortlek och kan fuska tillbaka, och vägrar be Klöver om hjälp rakt ut. Deras gamla groll gör att de hellre motarbetar varandra än samarbetar, vilket bromsar Hurring mer än Fuling gör. Fuling ljuger eller planterar ett nytt rykte för att peka bort från sig själv, gärna mot Planka igen. Blåskägg, som redan har en obetald skuld och ett gammalt skämt liggande hos Hurring (fiende 8, IOU:er naglade i masten), bär sin egen rad i liggaren och kan lika gärna bli den Hurring vänder sin misstanke mot när Fuling nekar för övertygande.
Utfall om ja:   Hurring får bekräftelse, eller stark cirkumstantiell bevisning, att Fuling ligger bakom. En ny sida i liggaren, kanske en offentlig konfrontation. Klöver och Prygel upptäcker kanske att de delar Hurring, vilket öppnar ett helt annat drama.
Utfall om nej:  mysteriet förblir olöst, Fulings hemlighet överlever, och Hurrings paranoia om andra möjliga angivare, kanske Malin eller Blåskägg, fortsätter.

Bygger på:      fiende 5 (Fuling–Planka, hennes vana att plantera rykten). Romanser 12, 13 (Hurring–Klöver, Hurring–Prygel). Fiende 1 (Klöver–Prygel). Fiende 8 (Hurring–Blåskägg). Hurrings egen etablerade hemlighet: han vet inte vem som angav honom.
Speglas hos:    Hurring, Fuling, Klöver, Prygel, Blåskägg.
Status:         beslutad

Obs: Fuling bär redan en hemlig mullvadsrelation mot Hjärter (annan skuta, annan hemlighet). Håll de två isär i gästtexten: den här handlar om det gamla angiveriet, inte om helgens förräderi. Blåskägg bär också S-02, Klöver bär också S-02 och S-05: ingen delad mekanik.

---

## S-05: Svärdet och arvssynden

Akt:            II, gärna vid brunchens skålar
Deltagare:      Kapten Dunka (`ludvigvonbahr`), Kapten Kosing (`amandamungsgard`), Kapten Nykter (`fabianmacklin`), Kapten Klöver (`johannabergman`)
Roll i storyn:  bärare (Dunka) / grindvakt (Kosing) / jägare (Nykter) / vittne (Klöver)
Kopplad till:   ingen beat än. Låg intensitet för Kosing: ingen ring, ingen kidnappning, inget centrum.

Vad de vill:    Kosing vill lägga sin påhittade arvssyndsskatt just på Dunkas uppblåsta anor och historier. Nykter, som redan gjort Dunkas svärdhistoria till ett hamnskämt (fiende 20), vill se honom svettas en gång till, men gör det indirekt: han pekar ut det svaga stället åt Kosing istället för att själv stå i vägen för Dunka. Klöver, som redan planerat en hemlig ätupplevelse med Kosing, vill se den bli lönsam.
Vad står i vägen: Dunka vaktar sitt tveeggade svärd svartsjukt och låter aldrig någon granska det på nära håll, av skräck för att avslöjas som falsk under fasaden. Samtidigt njuter han i hemlighet av ryktet att han setts vid Malins bord (romans 24, se S-01), vilket gör honom svårare att skrämma: han känner sig redan som en stor man den här helgen.
Varför nu:      festens skålande och skryt ger den naturliga scenen, och Kosings skattebod är öppen hela helgen.

Hur det spelas: Nykter viskar åt Kosing var Dunkas svaga punkt sitter, utan att själv synas i det. Kosing riktar sin arvssyndsskatt mot Dunkas anspråk på fin börd och kräver betalt i mynt eller en berättelse. Dunka kan betala, dementera högljutt, eller dra igång svärdets "historia" en gång för mycket och snubbla på en detalj. Spricker myten svarar han med en av sina långa, envisa kramar, som tröst åt sig själv snarare än andra. Klöver lägger sin och Kosings redan planerade hemliga ätupplevelse mitt i indrivningen: den som vill undgå skatten kan istället köpa sig en plats vid bordet, choklad går lika bra som mynt.
Utfall om ja:   Dunka betalar eller förödmjukas inför båda besättningarna, Kosing kammar hem en fin skatt, Nykter njuter osedd av segern, Klöver tar sin procent.
Utfall om nej:  Dunka bluffar sig igenom, myten lever vidare, skatten förblir obetald.

Bygger på:      fiende 20 (Dunka–Nykter). Romans 19 (Kosing–Dunka), i den lågintensiva, icke-centrala form Kosing själv bett om. Kosings och Klövers gemensamma matplan, redan nämnd i båda rollunderlagen.
Speglas hos:    Dunka, Kosing, Nykter, Klöver.
Status:         beslutad

Obs: Nykter bär också S-03 och S-07, Klöver bär också S-02 och S-04, Dunka bär också S-01. Ingen delad mekanik.

---

## S-06: Enbens räkning

Akt:            II–IV
Deltagare:      Kapten Enben (`amaliawahlstrom`), Kapten Kuling (`josefinlowing`), Svarta Malin (`malintadaa`), Kapten Hurring (`jesperlindmarker`)
Roll i storyn:  jägare (Enben, Kuling) / antagonist, bärare (Malin, redan tillsatt) / vittne (Hurring)
Kopplad till:   fiende 2. Inte bärande balk mot kistan, men sannolikt vår viktigaste ingång till huvudstoryn utanför Malins egna scener.

Vad de vill:    Enben och Kuling vill båda, av olika skäl, offentligt förödmjuka eller ta tillbaka något från Malin innan helgen är slut. Enben för skålen om "fasanen som inte kan flyga" och den kapade skiffen (fiende 2). Kuling för en gammal, egen oförrätt hon aldrig släppt, en skuld hon anser att Fördärvet har rätt att kräva tillbaka. Hurring, som redan misstänker att Malin kan vara den som angav honom (se S-04), vill gärna se någon annan gräva i henne, så länge det inte är han själv som står främst.
Vad står i vägen: Malin är svår att komma åt, alltid charmig, och just nu generös värdinna på sin egen fest. Att slå till nu ser ut som otacksamhet mot en jubilar. Enben, Kuling och Hurring känner inte till varandras groll från början.
Varför nu:      det är Malins helg, hennes fest, hennes garde nere mitt i firandet och romen, den enda gången hon går att komma åt.

Hur det spelas: Enben och Kuling provocerar, retar eller försöker lura ut något av Malin var för sig: en skål som slår fel, ett föremål som "lånas tillbaka" med en giftig kommentar, en duellutmaning. Upptäcker de varandras groll, till exempel via Klövers skvaller, kan de gå samman om en större publik aktion, som att rigga en skål eller tvinga fram en pinsam utmaning inför alla. Hurring säljer en rad ur sin liggare till den av de två som betalar bäst, en gammal historia om Malin han aldrig kunnat bekräfta, som ammunition till nästa provokation.
Utfall om ja:   Malin nålas offentligt, kanske förlorar hon cryptexen kort som hämnd, en scen som sår tvivel om henne inför kvällen.
Utfall om nej:  inget landar, Malin charmar sig undan som vanligt, ingen kostnad för huvudstoryn.

Bygger på:      fiende 2 (Enben–Malin). Kulings etablerade personliga oförrätt mot Malin, i rollunderlaget, inte en formell fiendepost. Hurrings hemlighet från S-04: han vet inte vem som angav honom, och misstänker Malin.
Speglas hos:    Enben, Kuling, Malin, Hurring.
Status:         beslutad

Obs: Hurring bär också S-04, Enben bär också S-01. Ingen delad mekanik.

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
Status:         beslutad

Obs: Barnsben bär också S-03, Rötägg bär också S-10, Nykter bär också S-03 och S-05. Ingen delad mekanik med någon av dem.

---

## S-08: Jakten på Plåthornet

Akt:            II–IV, betalar sig bäst efter ritualen 15.30: ett hornstöt mitt i kvällens kaos kräver ingen logik, bara kropp och skratt
Deltagare:      Kapten Plåthorn (`elinmartensson`), Kapten Kuling (`josefinlowing`), Kapten Prygel (`minervalowgren`), Kapten Rosing (`linneaekbom`)
Roll i storyn:  grindvakt (Plåthorn) / jägare (Kuling, Prygel) / vittne (Rosing, enväg)
Kopplad till:   klagomuren på Gnället.

Vad de vill:    Prygel vill se hornet krossat en gång för alla, på allvar, för att det stör hennes stridslystna heder (fiende 24). Kuling, som redan hånat hornet i en skål (fiende 7), vill komma över det för skojs skull, kanske använda det taktiskt eller sälja det vidare.
Vad står i vägen: Plåthorn släpper aldrig hornet frivilligt. Det är hennes enda pålitliga flyktväg när det blir på allvar, och hon bär det nära sig hela tiden.
Varför nu:      den samlade festen och stridsstämningen gör hornet extra farligt att använda, och båda jägarna vet att fel tillfälle blir kaos.

Hur det spelas: Kuling och Prygel försöker, var för sig eller tillsammans, locka fram, stjäla eller lura Plåthorn att blåsa i hornet vid fel tillfälle, så att hon förlorar kontrollen över det eller avslöjas. Plåthorn försvarar sig genom att fly, muta, eller blåsa i hornet i självförsvar och sprida kaos som täckmantel. Rosing, vars viskande snäcka hör mer än hon bett om, snappar upp planerna i förbifarten och kan varna Plåthorn i utbyte mot en tjänst, eller hålla tyst för att slippa dras in i en strid hon inte kan simma ifrån.
Utfall om ja:   hornet byter händer eller krossas, ett kaosmoln av upphetsning bryter ut runt bytet, publikt och pinsamt.
Utfall om nej:  Plåthorn behåller hornet, grälet fortsätter, ingen konsekvens för huvudstoryn.

Bygger på:      fiende 7 (Kuling–Plåthorn). Fiende 24 (Prygel–Plåthorn).
Speglas hos:    Plåthorn, Kuling, Prygel. Rosing enväg, hon lyssnar men väljer själv om hon agerar.
Status:         beslutad

Obs: Prygel bär redan mullvadskontakten mot Hurring (annan hemlighet, se mullvadstabellen). Kuling bär redan grindvaktsrollen för båtarna plus S-06. Rosing bär också S-03 och mullvadskontakten mot Frodig. Inget av det delar mekanik med det här.

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
Utfall om ja:   kärleken avslöjas offentligt, skandal mellan skutorna, gammalt groll (fiende 3, fiende 18, fiende 19) blossar upp igen. Skäggtrion i S-02 får extra bränsle.
Utfall om nej:  hemligheten överlever, men Blodig har nu ett vapen hon kan använda när som helst under kvällen.

Bygger på:      fiende 4 (Blodig–Frodig). Romans 8 (Rödskägg–Frodig), med hotet redan explicit noterat i `fiender.yaml`. Matchar Rödskäggs eget rollunderlag, som uttryckligen bjuder in att den förbjudna kärleken riskerar avslöjas. Fiende 3 (Lösskägg–Rödskägg) som Lösskäggs skäl att sprida vidare.
Speglas hos:    Blodig, Frodig, Rödskägg, Lösskägg.
Status:         beslutad

Obs: Frodig bär redan mullvadsrelationen mot Rosing (annan hemlighet, se mullvadstabellen). De två uppdragen delar ingen mekanik. Blodig bär också S-01, Rödskägg och Lösskägg bär också S-02.

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
Status:         beslutad

Obs: Babord bär redan mullvadsrelationen mot samma person, Döver (annan hemlighet, se mullvadstabellen): hon är hans handlerkontakt och hans romans i samma andetag, vilket redan är sant i `forradare.yaml`. Håll teckenspråksbluffen och förräderiet isär i gästtexten. Rötägg bär också S-07, Fuling bär också S-04. Samma personer, olika relationer, ingen delad mekanik.

---

## Uppslag från befintligt material

Kopplingar i `romanser.yaml` och `fiender.yaml` som är särskilt lämpade att dras in i huvudstoryn, eftersom de redan har tryck och redan korsar skutor:

- **Barnsben som allas åtrå** (romanser 4, 5, 6 och fiender 12, 13). Fyra personer i ett nät. **S-03, beslutad**, med Rosing och Nykter som jägare och Döver som enväg-vittne. Babord hålls utanför här, se S-10.
- **Blodig och Hjärter om Malin** (romanser 17, 20 och fiende 21). Två anspråk på jubilaren. De jagar hennes hemliga älskare i hamnen. Sanningen är Karl XII, först i kistan. **S-01, beslutad.**
- **Enben mot Malin** (fiende 2). Den enda etablerade fiendskapen som går direkt mot Malin. Sannolikt vår viktigaste ingång till huvudstoryn. **S-06, beslutad.**
- **Hjärter, hemligt förälskad i Malin** (romans 17). Jagar rivalen privat, vid kökskanten. **S-01, beslutad.**
- **Rötägg som allas fiende** (fiender 6, 13, 14). Naturlig skurk i huvudstoryn. Inte tillsatt som mullvad. Adresserad via fiende 13 i **S-07** och fiende 6 i **S-10**. Mullvad väljs när questsen är färdigskrivna.
- **Frodig och Rödskägg, förbjuden kärlek** (romans 8, fiende 25). Hotet från Blodig, redan noterat i `fiender.yaml` fiende 4, adresserat i **S-09, beslutad.** Fiende 25 (Kuling–Rödskägg) fortfarande obesökt: kan bli en egen sidequest senare om vattnet ska in.
- **Hurring, Fuling, Klöver, Prygel** (romanser 12, 13, fiende 1, 5). **S-04, beslutad.**
- **Plåthorns horn mot Kuling och Prygel** (fiender 7, 24). **S-08, beslutad.**
- **Kosing och Dunka** (romans 19, låg intensitet, fiende 20 som garnering). **S-05, beslutad.**
