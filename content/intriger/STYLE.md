# Stilprinciper för intriger

**Gäller bara** `crews/*.md` och `guests/*.md`. Skriv dem enligt den här filen.

Gäller **inte** sajtcopy i [`../copy/`](../copy/README.md) (gästerna läser den på webbsidan, men den har sajtens röst, inte intrigrevy). Gäller inte heller `huvudstory/`, `roller/`, `anteckningar/`, yaml-källistor eller README: intern text för Gustaf och agenten, tydlig, inte poetisk. Karta: [`../README.md`](../README.md).

**Obligatorisk läsning** innan någon gästintrig skrivs eller ändras.

Tekniskt filformat: se [README.md](README.md). Varje `##`-rubrik ska ha `{slug:login_slug}` för personen mini-porträttet visar.

Läs också, för den person du skriver till: [`../roller/{slug}.md`](../roller/) (gästens underlag, spegling av Supabase, rör inte) och [`../anteckningar/{slug}.md`](../anteckningar/) (arrangörens meta-anteckningar). Skriv inte tillbaka revy in i de filerna. Anteckna aldrig i `roller/`.

**Vad vet karaktären?** Deltagaren läser bara sin egen `guests/`-fil, sin skutas `crews/`-fil och sajtens [`../copy/`](../copy/). Allt annat är osynligt. Skriv aldrig som om de läst en annan spelares intrig, en sidequest de inte är med i, eller intern design. Se avsnittet nedan.

---

## Röst & stil

Skriv som **klassisk svensk revy à la Povel Ramel**:

- Finurligt, lekfullt, teatralt, aldrig torrt, aldrig modern “neutral” prosa.
- Gärna **ordvitsar**, **allitteration**, **rim** och rytmiska meningar (utan att tvinga rim överallt).
- **Överdrivet och bombastiskt.** Stora känslor, stora skulder, stora ambitioner. Inga små vardagskonflikter.

- Tilltala mottagaren i **du-form**. Varje person ska känna att **de är hjälten** i historien, även när de är skurkar, förrädare eller stackars lurade. Deras intrig är deras scen.
- **Alltid piratnamn.** Deltagare omnämns **bara** med sitt piratnamn (`**Kapten Blod**`, `**Svarta Malin**`, …), aldrig civilnamn, smeknamn eller login_slug i brödtexten.
- **Han / hon / hen.** Kaptener är inte män som default. Piratnamn styr inte kön (`Katten Felix`, `Kapten Blåskägg`, `Kapten Dunka`). Slå upp `real_name` i [`../anteckningar/{slug}.md`](../anteckningar/). Skriv han/hon efter civilnamnet. Okänd person (hemlig älskare, "någon i hamnen"): **hen**, eller skriv om utan pronomen. "Ta upp jakten tillsammans" slår "Jaga honom tillsammans" när läsaren inte vet könet. Tilltala inte mottagaren som man ("stolte") om du inte vet; "stolta" går för alla.
- Korta texter (några meningar till ett kort stycke per `##`-intrig). Hellre en skarp punchline än en lång utredning.
- **Aldrig em dash (—).** Det ser AI-skrivet ut och låter konstigt på svenska. Använd komma, kolon, punkt eller omskrivning istället.
- **Klöver, klubb, fyrklöver är tre olika ord.** Kortfärgen (eng. Clubs) heter **klöver**. **Klubb** är ett sällskap, till exempel svartklubb. **Fyrklöver** är växten med fyra blad, en tur-amulett. Den har inget med kortspel att göra. Kapten Klöver heter efter färgen. Kristallfyrklövern hon bar från Hjärter är amuletten, inte färgen. Inga ordvitsar som blandar dem.
- **Fasa och fasan är olika ord.** **Fasa** (en fasa, bestämd form **fasan**) betyder skräck/skräckinjagande väsen: "Svarta Malin är dess fasa" (sångcitat, [`../huvudstory/kanon.md`](../huvudstory/kanon.md)), "en fasa till kapten" (idiomatiskt: urdålig kapten). **Fasan** (en fasan, bestämd form **fasanen**) är fågeln pheasant. Formen **"fasanen"** (med extra -en) är alltid fågeln, aldrig skräcken, och ska inte förekomma i skräck-sammanhang. Blanda inte ihop dem: ingen ska "kallas fasanen som inte kan flyga" (fågelbild av misstag) när avsikten är skräck/skam, det heter i så fall "en fasa till kapten" eller liknande. Inga flyg-, fjäder- eller näbbmetaforer när ordet syftar på skräck.
- **Skatt kan betyda två saker** Agenten har en tendens att blanda ihop skatt (treasure) och skatt (tax) och behöver hålla isär dessa internt. I `crews/` / `guests/` skriv **skatt** för både treasure och tax. Hitta inte på avgift, taxa eller klenod för att slippa ordet. Intern text skriver alltid `skatt (treasure)` och `skatt (tax)`: [`../huvudstory/skatt.md`](../huvudstory/skatt.md).

### Sexpositiv fest

Festen är sexpositiv. Den bjuds inte in som sådan, men alla deltagare är vana vid sexpositiva rum. Det är inget konstigt bland dem. Inget avgränsat play space: sex är tillåtet överallt och när som helst. Det står **inte** på webbsidan. Det sägs i den praktiska genomgången på plats, se [`../huvudstory/spelledning.md`](../huvudstory/spelledning.md).

Konsekvens för intrigtext:

- Explicit språk och grövre sexuella referenser är **tillåtna**. Kuk, fitta, knulla, suga, binda, ta: orden får användas när de tjänar revyn och lusten.
- Registret är **lust och sex**, inte romankärlek. "Du vill bli bunden och tagen" slår "Du drömmer om en framtid tillsammans". "Du vill smaka svärdet" slår "Hen skall göra dig till drottning". Han/hon bara när civilnamnet gör könet känt.
- **Undantag, romans #26–28:** dyrkan av jubilaren (Lösskägg, Blåskägg, Fuling mot Malin). Inte sex, inte blygsel, inte star struck. Initiativ att smickra och ta hand om henne. Speglas inte. Skriv inte om dem till lust.
- Primärt för en kvinnlig och jämnställd publik. Ingen male gaze. Mottagaren är subjektet: hen vill, tar, suger, rids, blir tagen för att hen vill det.
- Sexuell erövring är en giltig drivkraft. Att *måste* ligga med någon för att vinna uppdraget är det inte.

### Sångtexten som källa

Alla deltagares piratnamn kommer från [`svartamalin-sångtext.txt`](../../svartamalin-sångtext.txt) (Povel Ramel). Intriger får **gärna** referera till ord, bilder och händelser ur sången, prejning, plundring, Salmonellahavet, kaviar och rom, värjor och krut, listor på kaptener, osv., så länge det stannar i karaktärernas värld och inte spoilar metaregeln.

`prejudikat` i sången är vitsen att sjörövare alltid har prejat, och därför har rätt att röva vidare. Ordet rättfärdigar prejningen, det är inte ett redskap man prejar *med*. Skriv "hänvisar till prejudikat" eller "rättfärdigar med prejudikat", aldrig "plundrar med prejudikat". Inte heller generell juridik, tvåvägsrättvisa, ursprungshistoria eller fysiskt bevis. Överanvänd inte ordet.

Den sista versen (från “När jag nyss fyllde år…”) är **slutstriden**: kollegorna kommer för att hylla Malin, det blir slagsmål, och hon lämnar dem i en hög. Det är samma ögonblick som lördag kvälls förlisning / metaregeln, använd det som undertext och eko i språket, men skriv det **inte ut** som fakta i intrigerna.

### Ja / nej

| Gör | Undvik |
|-----|--------|
| “Du, stolta sjörövare, har en hemlighet som skulle få Salmonellahavet att skälva.” | “Du har information om en annan gäst.” |
| `**Kapten Blodig**` / `**Kapten Träben**` | Civilnamn (“Gustaf”, “Malin Tadaa”) i intrigtext |
| Eko från sången: preja, plundra, jubileum, kaviar och rom, valplats | Spoila versen om att alla “låg kvar i en hög” |
| Lust, åtrå, sexuell dragning. Sexuell erövring. | Att man måste lyckas ligga med någon för att vinna. |
| "Du vill smaka svärdet", "Du vill bli bunden och tagen" | "Han skall göra dig till drottning", "Du drömmer om en framtid tillsammans" |
| Han/hon efter civilnamn. Hen eller omskrivning när personen är okänd för läsaren. | "Jaga honom" om en älskare vars kön läsaren inte känner. "Hans svärd" om en kapten som är kvinna. |
| Rivalitet, skuld, hemlig kärlek, stöld, ed, arv, svek, i revykostym | Byråkratisk ton, HR-språk, ironisk distans som tar udden ur spelet |
| Övertala **Kapten Kuling** eller **Kapten Rödskägg** att ge sig ut (när sjöfärd ska bli en scen) | En sjöfärd som *måste* gå via dem. Folk får paddla utan dem. |
| Låt laget kännas som ett teatersällskap med gemensam mission | Platta “gör poäng i tävlingen”-uppdrag utan karaktär |
| Bara det *den här* personen kan veta. Lyft in begrepp i *den här* filen, eller stryk dem. | “Knulla Skäggens Konung” till någon som inte är i skäggtrion |

---

## Metaregel (får ALDRIG stå i intrigerna)

I slutet dödas alla deltagare av **Svarta Malin**. Därefter återvänder hon som **Ran**, och festen fortsätter i dödsriket. I sångtexten är det sista versens jubileumsfest som urartar till slagsmål (“här är listan på dom som låg kvar i en hög”).

- Alla spelare **vet** detta i verkligheten.
- Intriger får **inte** spoila, citera eller avslöja detta slut (varken metaregeln eller den sista versens utgång).
- Intriger ska ändå **leda ditåt**: bygga fiendskap, lojalitet, skuld, girighet och “sista natten”-stämning så att helgens dramaturgi känns oundviklig i efterhand.

Skriv som om världen fortfarande tror på seger, skatt och överlevnad, medan undertexten är överdåd före undergången.

---

## Festens dramaturgi (styr undertonen)

Intriger ska passa in i helgens båge. De behöver inte nämna dagarna uttryckligen, men relationer och uppdrag ska kunna **explodera** i rätt fas.

### Helgen är TVÅ kvällar, inte en

Lajvet pågår från **fredag middag** till **lördag kväll**. Det betyder:

| Fas | När |
|-----|-----|
| Överdåd | fredag middag och **fredag kväll** (kväll ett) |
| Svek | lördag dag |
| Förlisning | **lördag kväll** (kväll två), där allt får sitt utlopp |
| Rans salar | natten efter lördag kväll, efterspelet |

Fredag kväll är festen och fasaden. Lördag kväll är uppgörelsen. En intrig som ska avgöras i strid, hämnd eller skandal hör hemma på **kväll två**, inte på kväll ett.

### Tidsuttryck: så skriver du deadline

Skriv aldrig så att helgen låter som en enda kväll. Ett ensamt "i kväll" eller "innan morgonen" landar hos gästen som fredag kväll, och då förbrukas intrigen ett dygn för tidigt.

| Gör | Undvik |
|-----|--------|
| "innan helgen är över", "innan sista skålen", "innan ni lämnar Ovanan" | "innan morgonen", "innan natten är över" |
| "första kvällen ler ni, andra kvällen kräver ni betalt" | "i kväll" (utan att säga vilken) |
| "innan sista skålen", "innan ni lämnar Ovanan" | Formuleringar som antyder att allt hinner och måste ske vid ett enda bord |

Vill du ändå ha brådskan i texten: namnge kvällen ("**andra kvällen**", "lördagens sista skål") eller sätt deadline vid helgens slut. Att en intrig *börjar* redan fredag är utmärkt, men den ska ha luft nog att bära genom lördagen.

### Inte spelledning om när de ska spela

Avsluta **inte** varje gäststycke med `Fredag: …` / `Lördag: …`. Det är spelledning om hur och när de ska spela. Standard: vilja, hinder, varför det måste avgöras under helgen. Låt gästen välja när.

OK **bara när tidpunkten är själva saken**: ett piller som måste tas i skymningen, ett vad som öppnar vid kajen. Då står tiden i brödtexten som fakta, inte som ett schema längst ner.

### Fredag middag och kväll: Överdåd (kväll ett)
Ostindiefararen är hemma. Ingen talar om vad som väntar. Vi ler mot våra fiender och dricker deras vin. Kvällen innan allt brinner.

→ Intriger får gärna ge skäl att **skåla med fienden**, dölja hat bakom artighet, eller bära på något som ska **sås nu och skördas i morgon**. Låt fredagen ställa frågan, inte besvara den.

### Lördag dag: Svek
Ytan spricker. Spelet är lagtävling, men man kan köpa fördelar och sälja ut sitt lag. Förräderi är tillåtet. Det är spelet.

→ Ge hemliga **erbjudanden, skulder, lojalitetskonflikter** och skäl att tveka mellan laget och dig själv.

### Lördag kväll: Förlisning (kväll två, helgens slut)
Alla slåss med alla. Nedslagen av annan än Malin → res dig och fighta igen. Bara Malin dödar permanent. Malin vinner. Gustaf (Rans budbärare) delar ut slöjor bland de döda och sjunger *Så länge skutan kan gå*. Speglar sista versen i sången (jubileum → värjor och krut → hög av kaptener).

→ Bygg rivaliteter och hedersfrågor som **måste få sitt utlopp**. Nämn inte dödsregeln, Malins oövervinnerlighet eller versens utgång i texten.

### Natt: Rans salar
Malin återvänder som Ran. Alla är döda. Alla är fria. Festen i dödsriket börjar.

→ Intriger speglar **inte** detta läge. Det är efterspelet, inte uppdraget.

---

## Skutorna (lagen)

Varje deltagare tillhör **en skuta**. Lagnamnet **är** skutanamnet, använd det i intrigtext när lag/skepp omnämns (inte “lag 3” eller civila teamnamn).

| `crew_id` | Skuta |
|-----------|--------|
| 1 | **Korvetten Kurtisanen** |
| 2 | **Fregatten Fördärvet** |
| 3 | **Barken Bortförklaringen** |
| 4 | **Fregatten Fromheten** |
| 5 | **Galeonen Gnället** |

Lagintriger: `crews/{crew_id}.md`. Källa: tabellen `crews` i Supabase (kan byta namn via spelet, synka hit om namnen ändras).

---

## Vad en intrig är

En intrig är en liten berättelse, backstory, drivkraft eller fakta som **binder** en person/grupp till en annan person/grupp, eller ger ett uppdrag/relation med dramatisk udd.

- **Lagintriger** (`crews/{id}.md`): första stycket är oförrätt mot Malin plus generell varför till huvudjakten (låst kista, ta reda på hennes berättelse tillsammans). Andra stycket är lagskattjakten: skatten de ska *hitta*, med ingång. Skälet är den jagade skutan som skuta, inte deras oförrätt mot Malin. Inte skatten de ska gömma. Social dörr (personen som släpper nästa steg) skrivs **inte** i lagfilen, bara i den personens `guests/`.
- **Individuella** (`guests/{login_slug}.md`): personliga band, hemligheter, envägsfixationer, privata uppdrag.

### Kortaste formen

I sin kortaste form ger en intrig spelaren tre saker:

1. **Något att vilja** (skatt, kärlek, hämnd, ära, en hemlighet, en plats i historien).
2. **Någon som står i vägen** (rival, älskare, lagkamrat, fiende, Malin, en skuld).
3. **En anledning att det måste avgöras under helgen** (innan sista skålen, innan skutorna skiljs åt, innan någon annan prejar först). Se tidsuttrycken nedan: helgen är två kvällar, så undvik "innan morgonen".

Saknas något av de tre: skriv om tills alla tre syns i texten.

De flesta intriger mår bra av att **minst tre personer** är involverade (mottagaren + två andra). Tvåpersonsdueller blir lätt platta; en tredje skapar triangel, vittne, budbärare, rival om samma byte, eller den som måste luras/övertygas. Envägsfixationer och rena tvåvägsspeglingar får förekomma, men sikta på tre när dramatiken tillåter.

### Koherens

- Tvåvägsrelationer speglas i båda filerna (A↔B).
- Envägs (hemlig kärlek, dold agenda): speglas **inte**; notera i frontmatter.
- Håll världen internkonsistent: samma stöld, samma ed, samma skuld ska inte motsäga sig mellan filer.

### Lag vs individ

- Lagkamrater ser **inte** varandras individuella intriger, skriv individuellt så det tål att vara hemligt inom laget (svek, hemlig kärlek till lagkamrat, osv. är tillåtna och dramaturgiskt välkomna).
- Laguppdrag ska kunna spelas **tillsammans** utan att kräva att alla läst samma individhemlighet.
- Se **Vad karaktären vet** nedan. Det gäller också mellan lagkamrater, och mellan personer som har romans.

---

## Vad karaktären vet

En deltagare kan **bara** läsa tre saker på skärmen:

1. Sin egen fil: `guests/{login_slug}.md`
2. Sin skutas fil: `crews/{crew_id}.md`
3. Sajtens brödtext: [`../copy/`](../copy/), inklusive världs-ingången [`../copy/intriger_intro.md`](../copy/intriger_intro.md) (år 1702, Karl XII är kung, pirater och kapare). De har läst den innan de kommer till sin egen intrig.

De ser inte andra gästers filer, inte andra skutors lagfiler, inte `huvudstory/`, inte yaml-källistor, inte `anteckningar/`, och inte någon annans `roller/`. Sidequests, beats och andras hemligheter **existerar inte** för dem förrän de står i *deras* läsbara text.

### Hård regel: texten måste stå för sig själv

Spelaren har **inte** läst `sidequests.md`, `fiender.yaml`, `romanser.yaml`, andras `roller/` eller andras gästfiler. De har sin egen gästfil, sin lagfil, sajtcopy och det de själva skrev i `roller/{sin slug}.md`.

**Efter varje stycke:** läs det högt och fråga: *går den här texten att förstå utan någon ytterligare fil?* Om nej: lyft in förklaringen i samma stycke, eller stryk.

Förbjudet: intern jargong och halva historier.

| Dåligt (kräver annan fil) | Bra (står själv) |
|---------------------------|------------------|
| "skäggtrion" | "Ni tre bär skägg i namnet, och kajen har inte utropat någon till Skäggens Konung än." |
| "burken och skymningen" | "När mörkret faller måste **Kapten Barnsben** svälja ett piller ur en liten burk, annars slutar hon vara barn och blir stor. Det fasar hon för." |
| "ni vet båda vad som sitter i ditt ansikte" | Säg vad som sitter där, i den här filen. |

Egen `roller/`-fil får räknas som känd, men använd inte designer-smeknamn som inte står där. `fiender.yaml` och `sidequests.md` är **inte** kända. Om karaktären skulle minnas en oförrätt måste *spelaren* få oförrätten berättad i gästtexten.

Rekvisita i [`../rekvisita/`](../rekvisita/) läses på papper på ön, om de får lappen i handen. Det är inte förhandskunskap. Skriv inte intrigtext som om de redan läst en prop.

**Testet, varje mening:** vad vet karaktären? Om svaret är "det står i en annan fil", "det står i S-nn som de inte är med i" eller "det står i intern design" får meningen inte stå.

### Vad som räknas som känt

Utan att det upprepas i just den här meningen får du räkna med:

- Piratnamn och skutor. De är offentliga (sången, sajten, festen).
- Mottagarens *egen* `roller/{slug}.md`. De skrev underlaget, de minns det. Tom roller-fil = inget extra.
- Övriga `##`-stycken i *samma* gästfil, plus lagfilen, plus copy.
- För huvudstory-bitar: fältet `vet` i *deras* post i [`../huvudstory/fordelning.yaml`](../huvudstory/fordelning.yaml). Fältet `vet_inte` får inte läcka in. **Quest-start:** `vet` är första ledtråden, inte kapitlet. Skriv inte in "Vad de ska ha lärt sig när questen är klar" från questens fil under [`../huvudstory/quests/`](../huvudstory/quests/). Hur ingångstext skrivs: [`../huvudstory/quests.md`](../huvudstory/quests.md). **Lagskatt-ingång:** `vet` är första ledtråden till den jagade skatten, inskickad av gömmarna. Inte var skatten ligger. Hur den vävs in: [`../huvudstory/lagskatter.md`](../huvudstory/lagskatter.md) Ingång.

### Vad som inte är känt

- Andra spelares individuella intriger. Även lagkamrater. Även den de har romans eller fiendskap med.
- Sidequests de inte är listade i. En speglad romans ger **inte** automatiskt den andras sidequest, objekt eller titel.
- Begrepp, titlar, föremål och händelser som bara finns i intern design (`sidequests.md`, `akter.md`, yaml, någon annans gästfil).
- Att något *blir* publikt på ön. Intrigtexten är förhandstext. Skriv inte som om de redan sett en scen som utspelar sig under helgen.

### Lyft in, eller referera inte

Hittar du en vass bild i en annan fil: antingen **lyfter du in** det mottagaren behöver veta, i *den här* texten, och **bara** om de *ska* veta det (de är med i spåret, eller `fordelning.yaml` säger `vet`), eller så **skriver du om** så bilden inte krävs.

Exempel: **Kapten Fuling** har romans med **Kapten Blåskägg**. Hon är inte i skäggtrion (S-02). "Knulla Skäggens Konung tills hamnen glömmer titeln" förutsätter en titelkamp hon inte bär. Skriv romansen som lust efter Blåskägg, utan trion. Låt Blåskäggs egen fil bära Skäggens Konung.

Samma fälla: "kung över tre skägg", "liggaren" som namngivet objekt, "Karl XII", ett piller, ett svärd, ett horn. Om *den här* personen inte bär spåret: använd inte spårets ordförråd. En kroppsdel i namnet (skägg, ben, horn) är inte samma sak som spårets titel. **Undantag:** ordet "kistan" i första stycket i `crews/` är den gemensamma ingången till huvudjakten. Alla på skutan bär det. Inte i gästfilen, om personen inte bär ett spår som redan nämner den.

Tvåvägs spegling speglar **relationen**, inte den andras övriga liv. A vet att B är hens romans. A vet inte vad B har i sina andra `##`-stycken, om det inte också står i A:s fil.

---

## Checklista innan du sparar

1. Låter det som revy/Ramel, inte som instruktionsmanual?
2. Känner mottagaren sig som hjälte (eller stolt skurk) i sin egen berättelse?
3. Finns vilja + hinder + varför det måste avgöras *nu*?
4. Är minst tre personer involverade (eller finns skäl till färre)?
5. Omnämns alla deltagare **bara** med piratnamn (inga civilnamn)?
6. Spoilar texten Malin/Ran-slutet eller sista versens utgång? → stryk.
7. Kan det mata fredagens leenden, lördagens svek eller lördagskvällens kaos?
8. Låter deadlinen som en enda kväll ("i kväll", "innan morgonen")? → skriv om, helgen är två kvällar.
9. Finns (gärna) eko från `svartamalin-sångtext.txt`, utan att spoila?
10. Är speglade intriger uppdaterade (eller enväg markerad i frontmatter)?
11. Finns em dash (—)? → stryk och skriv om med komma, kolon eller punkt.
12. Kräver texten att någon åker eka, kajak, paddel eller badar ensam? → stryk. Off-regel: aldrig ensam på vattnet.
13. Kräver texten en sjöfärd som ska bli en scen? Primär väg: övertala **Kapten Kuling** eller **Kapten Rödskägg** att ge sig ut. Skriv inte att de *måste*. Folk får åka ut utan dem.
14. Uppmanar texten till ransakning, att vända ön, eller att ta något man råkar hitta? → stryk. Off-regel: lös gåtor och uppdrag, låt saker som hittas av misstag få vara.
15. Är språket prydligt eller framtid-tillsammans kring sex och romans? → skriv om. Lust, explicithet och "bunden och tagen" är rätt register. Male gaze är det inte.
16. **Står texten för sig själv?** Läs stycket som om du bara har den här filen. Kräver någon mening `sidequests.md`, yaml, någon annans roller eller någon annans gästfil? → berätta händelsen i den här filen, eller stryk. "skäggtrion" och "burken och skymningen" är förbjudna som oförklarade.
17. Refererar texten till en sidequest, ett objekt eller en titel från ett spår personen inte är med i? → stryk. Speglad romans räcker inte.
18. Stämmer han/hon med civilnamnet i `anteckningar/`? Okänd person: hen, eller skriv om utan pronomen. Anta inte att kaptener är män.
19. Slutar stycket med `Fredag:` / `Lördag:` utan att tidpunkten är själva saken? → stryk schemat. Vilja, hinder, helgen. Inte spelledning om när de ska spela.
20. Blandas klöver (kortfärg), klubb (sällskap) och fyrklöver (växt/amulett)? → stryk vitsen. Färgen heter klöver. Fyrklöver har inget med kortspel att göra.
21. Är det en **quest-start** (Q-1 till Q-5)? Då bara första ledtråden, inte kapitlet. Inte andra intriger eller relationer i samma stycke. Uppmana att ta laget till hjälp. Om stycket redan svarar på vad gästen ska ha lärt sig när questen är klar: stryk svaret. Se [`../huvudstory/quests.md`](../huvudstory/quests.md) Ingångstext.
22. **Ordning i `guests/`:** 1. mullvadsintrig, 2. questintriger (start före tvärledtråd), 3. kontaktpersonintrig, 4. övriga. Mullvad och kontakt är olika personer. Saknas en typ: hoppa över den. **Förrädarstycket ska bära drivkraften.** Läsaren ska förstå varför mullvaden säljer skutan utan att ha läst en senare romans eller sidosektion. Kontaktpersonens stycke ska säga samma varför. Är drivkraften en romans: gör den tydlig redan här, lustregister (undantag: Prygel/Hurring, tonårskärlek).
23. Är det en **lagskatt-ingång** i `crews/`? Då bara första ledtråden, inskickad av gömmarna, skriven in hos jägarna. Inte var skatten ligger. Inte resten av spåret. Inte cirkeln. Inte vem som jagar dem. Inte "spelet", inte att jakten väntar till lördagen. Inte skatten de själva ska gömma. Fysisk (plats, föremål) eller social (namngiven person och metod, eller minst tre ombord plus en rad). **Social dörr:** kort intrig i **den personens** `guests/`, inte i lagfilen. Om hen utpressas, fjäskas, bjuds, eller om minst tre ombord samlas och smickras: släpp nästa ledtråd. Inte vem som jagar. Inte ledtråd två. **Skälet:** den jagade skutan som skuta (hur de tar), inte deras oförrätt mot Malin. Jägarens egen metod får färga. Lagskatt är skatt (treasure) i intern text. Fromhetens piratskatt är skatt (tax). Se [`../huvudstory/lagskatter.md`](../huvudstory/lagskatter.md) Varför de jagar, [`../huvudstory/skatt.md`](../huvudstory/skatt.md), och avsnittet Ingång.
24. Är det **första stycket i `crews/`**? Då generell varför till huvudjakten: hon har en låst kista, ta reda på hennes berättelse tillsammans, den som känner historien kommer åt kistan. Behåll oförrätt och punchline. Inte första ledtråden. Inte plats. Inte cryptex. Inte "öppna". Inte att kistan är tom. Inte att några redan har ett spår. Kurtisanen: bakom hennes rygg, skrivet för de fyra andra. Malin är spelledning. Se [`../huvudstory/quests.md`](../huvudstory/quests.md) Lagfilens första stycke.
