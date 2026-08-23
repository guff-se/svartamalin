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
| S-03 | Barnsben som allas åtrå | Barnsben, Rosing, Nykter, Döver, Babord | II | bärare / jägare / grindvakt / vittne | idé |
| S-04 | Vem angav Hurring | Hurring, Fuling, Klöver, Prygel | II | jägare / bärare / vittne | idé |
| S-05 | Svärdet och arvssynden | Dunka, Nykter, Kosing | II | bärare / jägare / grindvakt | idé |
| S-06 | Enbens räkning | Enben, Kuling, Malin | II–IV | jägare / antagonist | idé |
| S-07 | Rötäggets bevis | Rötägg, Planka, Barnsben | II | bärare / jägare / vittne | idé |
| S-08 | Jakten på Plåthornet | Plåthorn, Kuling, Prygel | II–IV | grindvakt / jägare | idé |
| S-09 | Blodigs hot | Blodig, Frodig, Rödskägg | II–IV | jägare / bärare | idé |

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
| `malintadaa` | 2 | antagonist, bärare | IV |
| `gustaftadaa` | | budbärare, spelledare | IV |
| `petterwallberg` | 1 | rival | II |
| `linneaappert` | 1 | bärare | II |
| `ulrikahammar` | 2 | bärare, jägare | II |
| `jesperlindmarker` | 1 | jägare | II |
| `louisevonbahr` | 1 | bärare | II |
| `josefinlowing` | 3 | grindvakt, jägare | II |
| `navidmodiri` | 1 | bärare, grindvakt | II |
| `minimacklin` | 2 | jägare | II |
| `ludvigvonbahr` | 1 | bärare | II |
| `amaliawahlstrom` | 1 | jägare | II |
| `fabianmacklin` | 2 | jägare | II |
| `josefinansund` | 1 | bärare | II–IV |
| `johannabergman` | 1 | vittne | II |
| `jesperlejfjord` | 1 | jägare | II |
| `amandamungsgard` | 1 | grindvakt | II |
| `viktoransund` | 3 | grindvakt, rival, bärare | II |
| `elinamelakoski` | 1 | jägare | II |
| `minervalowgren` | 2 | vittne, jägare | II |
| `linneaekbom` | 1 | jägare | II |
| `alexandrapalmquist` | 1 | vittne | II |
| `hampuslindblad` | 1 | rival | II |
| `edvinthungren` | 1 | bärare | II |
| `elinmartensson` | 1 | grindvakt | II–IV |

**Spridningsregel:** alla toppar får inte ligga i akt IV. Sikta på ungefär en fjärdedel i akt II, en fjärdedel vid brunchen och ritualen, resten i akt IV.

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

## S-03: Barnsben som allas åtrå

Akt:            II
Deltagare:      Kapten Barnsben (`ulrikahammar`), Kapten Rosing (`linneaekbom`), Kapten Nykter (`fabianmacklin`), Kapten Döver (`navidmodiri`), Kapten Babord (`alexandrapalmquist`)
Roll i storyn:  bärare (Barnsben) / jägare (Rosing, Nykter) / grindvakt (Döver) / vittne (Babord)
Kopplad till:   TBD, ingen beat i akter.md ännu

Vad de vill:    Barnsben vill att Döver ska se henne. Rosing och Nykter vill, var för sig och utan att veta om varandra, ha Barnsben. Babord vill bli av med ett rykte hon aldrig bad om.
Vad står i vägen: Döver är upptagen av att låtsas döv och tjuvlyssna på sin nemesis Hjärter, och märker inte Barnsben på det sätt hon vill. Rosing vågar inte använda sin viskande snäcka på Barnsben, av rädsla för vad den avslöjar om henne själv. Nykter tar hellre en dans i trots än frågar på allvar. Babords scarf användes för att smuggla ett brev till Döver utan hennes lov, och ryktet om det följer henne fortfarande.
Varför nu:      alla gamla bekanta är på samma ö för första gången på länge, festen gör folk vårdslösa, och Barnsbens sy- och broderihörna blir en plats där alla ändå hamnar förr eller senare.

Hur det spelas: Barnsben håller sin sy- och broderihörna öppen, vilket ger alla fyra andra ett naturligt skäl att sätta sig ner och prata. Rosing kan använda snäckan nära Barnsben för att höra vad hon egentligen tänker, på risk att avslöja sina egna känslor. Nykter retas och stjäl uppmärksamhet snarare än att fråga rakt ut. Döver låtsas inte höra något av det som sägs, men hör allt. Babord konfronterar Barnsben om scarfen och kräver en offentlig ursäkt, särskilt känsligt eftersom Babord själv är ihop med Spader och inte vill dras in i mer intrigmakeri.
Utfall om ja:   någon av trådarna löper ut: Rosing vågar erkänna, eller Döver tappar masken och avslöjar att han hört allt, eller Babord får sin ursäkt. Vilken som helst är en publik, pinsam scen.
Utfall om nej:  det olyckliga nätet förblir olyckligt. Ingen konsekvens för huvudstoryn.

Bygger på:      romanser 4, 5, 6. fiender 12, 13.
Speglas hos:    Barnsben, Rosing, Nykter, Döver, Babord.
Status:         idé

## S-04: Vem angav Hurring

Akt:            II
Deltagare:      Kapten Hurring (`jesperlindmarker`), Kapten Fuling (`louisevonbahr`), Kapten Klöver (`johannabergman`), Kapten Prygel (`minervalowgren`)
Roll i storyn:  jägare (Hurring) / bärare (Fuling) / vittne (Klöver, Prygel)
Kopplad till:   TBD, ingen beat i akter.md ännu

Vad de vill:    Hurring vill äntligen veta vem som angav honom för många år sedan och satte honom i fängelse.
Vad står i vägen: sanningen ligger begravd. Fuling har alltid nekat till att plantera rykten, trots att det är precis vad hon gjorde mot Planka (fiende 5). Ingen misstänker den tysta ryktesspridaren för något så allvarligt.
Varför nu:      alla från den tiden är samlade på samma ö för första gången, och Hurrings svarta liggare behöver en ny sida, en som han tänker skriva i just den här helgen.

Hur det spelas: Hurring förhör och driver in gamla skulder, och stämmer av folks historier mot sin liggare. Klöver, som driver hemliga spelklubbar och byter skvaller mot choklad, har hört ett fragment som pekar mot "någon som är bra på rykten", men vill ha betalt för att dela det. Prygel, just nu Hurrings kärlek, hamnar i kläm mellan att hjälpa honom och att skydda vem det än visar sig vara. Fuling ljuger eller planterar ett nytt rykte för att peka bort från sig själv, gärna mot Planka igen.
Utfall om ja:   Hurring får bekräftelse, eller stark cirkumstantiell bevisning, att Fuling ligger bakom. Ny sida i liggaren, kanske en offentlig konfrontation.
Utfall om nej:  mysteriet förblir olöst. Fulings hemlighet överlever. Hurrings paranoia om andra, kanske Malin, fortsätter.

Bygger på:      fiende 5 (Fuling–Planka, hennes vana att plantera rykten). Hurrings egen etablerade hemlighet: han vet inte vem som angav honom.
Speglas hos:    Hurring, Fuling, Klöver, Prygel.
Status:         idé

## S-05: Svärdet och arvssynden

Akt:            II
Deltagare:      Kapten Dunka (`ludvigvonbahr`), Kapten Nykter (`fabianmacklin`), Kapten Kosing (`amandamungsgard`)
Roll i storyn:  bärare (Dunka) / jägare (Nykter) / grindvakt (Kosing)
Kopplad till:   TBD, ingen beat i akter.md ännu

Vad de vill:    Kosing vill lägga sin påhittade arvssyndsskatt på Dunkas uppblåsta historier och anor. Nykter vill, en gång till, sticka hål på Dunkas ego inför andra.
Vad står i vägen: Dunka vaktar sitt tveeggade svärd svartsjukt och låter aldrig någon granska det på nära håll. Han är livrädd för att avslöjas som falsk.
Varför nu:      festens skålande och skryt ger den perfekta scenen, och Kosings skattebod är öppen hela helgen.

Hur det spelas: Kosing riktar sin arvssyndsskatt specifikt mot Dunka och kräver betalt för hans anspråk på fin börd. Nykter retar fram svärdets "historia" högt inför andra, i hopp om att Dunka snubblar på en detalj eller att någon känner igen den. Om Dunka betalar eller historien rämnar spricker hans självbild inför båda besättningarna, vilket kan trigga hans signaturkramar som tröst.
Utfall om ja:   Dunka förödmjukas offentligt, Kosing kammar hem en fin skatt, Nykter njuter av segern.
Utfall om nej:  Dunka bluffar sig igenom, myten lever vidare, skatten obetald.

Bygger på:      fiende 20 (Dunka–Nykter). Romans 19 (Kosing–Dunka), i den lågintensiva, icke-centrala form Kosing bett om.
Speglas hos:    Dunka, Nykter, Kosing.
Status:         idé

## S-06: Enbens räkning

Akt:            II–IV
Deltagare:      Kapten Enben (`amaliawahlstrom`), Kapten Kuling (`josefinlowing`), Svarta Malin (`malintadaa`)
Roll i storyn:  jägare (Enben, Kuling) / antagonist, bärare (Malin, redan tillsatt)
Kopplad till:   TBD, ingen beat i akter.md ännu

Vad de vill:    Enben och Kuling vill båda, av olika skäl, offentligt förödmjuka eller ta tillbaka något från Malin innan helgen är slut. Enben för skålen om "fasanen som inte kan flyga" och den kapade skiffen. Kuling för en gammal skuld hon aldrig släppt, en Fördärvet enligt henne har rätt att kräva tillbaka.
Vad står i vägen: Malin är svår att komma åt, alltid charmig, och just nu generös värdinna på sin egen fest. Att slå till nu ser passande ut mot en fiende, men riskabelt mot en jubilar. Enben och Kuling känner inte till varandras groll från början.
Varför nu:      det är Malins helg, hennes fest, hennes garde nere mitt i firandet och romen, den enda gång hon går att komma åt.

Hur det spelas: Enben och Kuling provocerar, retar eller försöker lura ut något av Malin var för sig, en skål som slår fel, ett föremål som "lånas tillbaka" med en giftig kommentar, en duellutmaning. Upptäcker de varandras groll, till exempel via Klövers skvaller, kan de gå samman om en större publik aktion, till exempel att rigga en skål eller tvinga fram en pinsam utmaning inför alla. Kan krocka med cryptexen: att sno den ur Malins ficka som hämnd.
Utfall om ja:   Malin nålas offentligt, kanske förlorar hon cryptexen kort som ett practical joke/hämnd, en scen som sår tvivel om henne inför kvällen.
Utfall om nej:  inget landar, Malin charmar sig undan som vanligt, ingen kostnad för huvudstoryn.

Bygger på:      fiende 2 (Enben–Malin). Kulings etablerade personliga oförrätt mot Malin, i rollunderlaget, inte en formell fiendepost.
Speglas hos:    Enben, Kuling, Malin.
Status:         idé

## S-07: Rötäggets bevis

Akt:            II
Deltagare:      Kapten Rötägg (`edvinthungren`), Kapten Planka (`linneaappert`), Kapten Barnsben (`ulrikahammar`)
Roll i storyn:  bärare (Rötägg) / jägare (Planka) / vittne, grindvakt (Barnsben)
Kopplad till:   TBD, ingen beat i akter.md ännu

Vad de vill:    Rötägg vill bevisa för Planka, som han älskar och fick sina manschettknappar av, att han verkligen ändrat sig. Planka vill veta om kärleken vilar på sanning.
Vad står i vägen: Barnsben minns fortfarande parfymspratten som saboterade hennes uppvaktning av Döver (fiende 13) och tror inte på Rötäggs omvändelse. Frågar Planka rakt ut riskerar hon att få höra hela sanningen om vem Rötägg var förr.
Varför nu:      alla gamla bekanta är på samma ö, och romens frikostighet gör att gammalt groll lättare kommer upp till ytan.

Hur det spelas: Planka söker upp Barnsben, gärna vid sy- och broderihörnan, för att höra vad hon vet om Rötägg. Barnsben kan välja att släppa taget om gammal röta som en gest, eller hålla fast vid den och sabotera relationen igen, medveten eller ej om att det är precis vad hon en gång anklagade honom för. Rötägg kan försöka blidka Barnsben i förväg med en gest, till exempel en massage eller sabrerad bubbel, innan Planka hinner fråga.
Utfall om ja:   Barnsben förlåter, äkta eller spelat, och Rötägg och Plankas kärlek stärks.
Utfall om nej:  Barnsben berättar sanningen, Planka får tvivel, ett osäkert kärleksdrama fortsätter in i kvällen.

Bygger på:      romans 3 (Planka–Rötägg). Fiende 13 (Barnsben–Rötägg).
Speglas hos:    Rötägg, Planka, Barnsben.
Status:         idé

## S-08: Jakten på Plåthornet

Akt:            II–IV
Deltagare:      Kapten Plåthorn (`elinmartensson`), Kapten Kuling (`josefinlowing`), Kapten Prygel (`minervalowgren`)
Roll i storyn:  grindvakt (Plåthorn) / jägare (Kuling, Prygel)
Kopplad till:   TBD, ingen beat i akter.md ännu

Vad de vill:    Prygel vill se hornet krossat en gång för alla, på allvar, för att det stör hennes stridslystna heder. Kuling vill komma över det för skojs skull, efter att redan ha hånat det i en skål, kanske använda det taktiskt eller sälja det vidare.
Vad står i vägen: Plåthorn släpper aldrig hornet frivilligt. Det är hennes enda pålitliga flyktväg när det blir på allvar, och hon bär det nära sig hela tiden.
Varför nu:      den samlade festen och stridsstämningen gör hornet extra farligt att använda, och båda jägarna vet att fel tillfälle blir kaos.

Hur det spelas: Kuling och Prygel försöker, var för sig eller tillsammans, locka fram, stjäla eller lura Plåthorn att blåsa i hornet vid fel tillfälle, så att hon förlorar kontrollen över det eller avslöjas. Plåthorn försvarar sig genom att fly, muta, eller blåsa i hornet i självförsvar och sprida kaos som täckmantel. Betalar sig bäst efter ritualen 15.30: ett hornstöt mitt i kvällens kaos kräver ingen logik, bara kropp och skratt.
Utfall om ja:   hornet byter händer eller krossas, ett kaosmoln av upphetsning bryter ut runt bytet, publikt och pinsamt.
Utfall om nej:  Plåthorn behåller hornet, grälet fortsätter, ingen konsekvens för huvudstoryn.

Bygger på:      fiende 7 (Kuling–Plåthorn). Fiende 24 (Prygel–Plåthorn).
Speglas hos:    Plåthorn, Kuling, Prygel.
Status:         idé

## S-09: Blodigs hot

Akt:            II–IV
Deltagare:      Kapten Blodig (`minimacklin`), Kapten Frodig (`josefinansund`), Kapten Rödskägg (`viktoransund`)
Roll i storyn:  jägare (Blodig) / bärare (Frodig, Rödskägg)
Kopplad till:   TBD, ingen beat i akter.md ännu

Vad de vill:    Blodig, redan Frodigs ärkefiende, får nys om den förbjudna kärleken mellan Frodig och Rödskägg och vill använda den, dels för att hämnas den gamla oförrätten, dels för att elda på kaos.
Vad står i vägen: hemligheten är väl bevarad. Deras släkter och besättningar har varit fiender i generationer, och en upptäckt vore en skandal.
Varför nu:      helgens närhet och alkohol gör folk vårdslösa, ett hastigt ögonkast eller en smekning kan förråda dem inför fel person.

Hur det spelas: Blodig, redan känd för att slå till hårt och redan upptagen med att jaga Malins älskare (S-01), snubblar över eller aktivt nystar i ett tecken på förhållandet, ett brev, en blick, ett smeknamn. Hon konfronterar en av dem enskilt eller sprider ett rykte utan att avslöja hela sanningen än, som hot eller utpressning. Frodig och Rödskägg måste förneka högljutt, muta Blodig, eller fly tillsammans, med risk att bekräfta ryktet genom sin egen panik.
Utfall om ja:   kärleken avslöjas offentligt, skandal mellan skutorna, gammalt groll (fiende 3, fiende 4) blossar upp igen.
Utfall om nej:  hemligheten överlever, men Blodig har nu ett vapen hon kan använda när som helst under kvällen.

Bygger på:      fiende 4 (Blodig–Frodig). Romans 8 (Rödskägg–Frodig), med explicit koppling redan noterad i `fiender.yaml`.
Speglas hos:    Blodig, Frodig, Rödskägg.
Status:         idé

## Uppslag från befintligt material

Kopplingar i `romanser.yaml` och `fiender.yaml` som är särskilt lämpade att dras in i huvudstoryn, eftersom de redan har tryck och redan korsar skutor:

- **Barnsben som allas åtrå** (romanser 4, 5, 6 och fiender 12, 13). Fyra personer i ett nät. **S-03, idé.**
- **Blodig, Hjärter och Felix om Malin** (romanser 17, 18, 20 och fiende 21). Tre anspråk på jubilaren. De jagar hennes hemliga älskare i hamnen. Sanningen är Karl XII, först i kistan. **S-01, beslutad. Gästtext inte skriven.**
- **Enben mot Malin** (fiende 2). Den enda etablerade fiendskapen som går direkt mot Malin. Sannolikt vår viktigaste ingång till huvudstoryn. **S-06, idé.**
- **Hjärter och Felix, båda hemligt förälskade i Malin** (romanser 17, 18). De vet om varandra. Två vittnen som vill henne väl och därför kan bära obekväm sanning. De jagar rivalen tillsammans, Felix bara privat. **S-01, beslutad. Gästtext inte skriven.**
- **Rötägg som allas fiende** (fiender 6, 13, 14). Naturlig skurk i huvudstoryn. Inte tillsatt som mullvad. Mullvad väljs när questsen är färdigskrivna. Delvis adresserad i **S-07** via fiende 13.
