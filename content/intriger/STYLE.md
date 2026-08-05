# Stilprinciper för intriger

**Obligatorisk läsning** innan någon intrig skrivs eller ändras. Dessa regler gäller alltid för agenten.

Tekniskt filformat: se [README.md](README.md). Varje `##`-rubrik ska ha `{slug:login_slug}` för personen mini-porträttet visar.

---

## Röst & stil

Skriv som **klassisk svensk revy à la Povel Ramel**:

- Finurligt, lekfullt, teatralt, aldrig torrt, aldrig modern “neutral” prosa.
- Gärna **ordvitsar**, **allitteration**, **rim** och rytmiska meningar (utan att tvinga rim överallt).
- **Överdrivet och bombastiskt.** Stora känslor, stora skulder, stora ambitioner. Inga små vardagskonflikter.
- Tilltala mottagaren i **du-form**. Varje person ska känna att **de är hjälten** i historien, även när de är skurkar, förrädare eller stackars lurade. Deras intrig är deras scen.
- **Alltid piratnamn.** Deltagare omnämns **bara** med sitt piratnamn (`**Kapten Blod**`, `**Svarta Malin**`, …), aldrig civilnamn, smeknamn eller login_slug i brödtexten.
- Korta texter (några meningar till ett kort stycke per `##`-intrig). Hellre en skarp punchline än en lång utredning.
- **Aldrig em dash (—).** Det ser AI-skrivet ut och låter konstigt på svenska. Använd komma, kolon, punkt eller omskrivning istället.

### Sångtexten som källa

Alla deltagares piratnamn kommer från [`svartamalin-sångtext.txt`](../../svartamalin-sångtext.txt) (Povel Ramel). Intriger får **gärna** referera till ord, bilder och händelser ur sången, prejning, plundring, Salmonellahavet, kaviar och rom, värjor och krut, listor på kaptener, osv., så länge det stannar i karaktärernas värld och inte spoilar metaregeln.

Den sista versen (från “När jag nyss fyllde år…”) är **slutstriden**: kollegorna kommer för att hylla Malin, det blir slagsmål, och hon lämnar dem i en hög. Det är samma ögonblick som lördag kvälls förlisning / metaregeln, använd det som undertext och eko i språket, men skriv det **inte ut** som fakta i intrigerna.

### Ja / nej

| Gör | Undvik |
|-----|--------|
| “Du, stolte sjörövare, har en hemlighet som skulle få Salmonellahavet att skälva.” | “Du har information om en annan gäst.” |
| `**Kapten Blodig**` / `**Kapten Träben**` | Civilnamn (“Gustaf”, “Malin Tadaa”) i intrigtext |
| Eko från sången: preja, plundra, jubileum, kaviar och rom, valplats | Spoila versen om att alla “låg kvar i en hög” |
| Rivalitet, skuld, hemlig kärlek, stöld, ed, arv, svek, i revykostym | Byråkratisk ton, HR-språk, ironisk distans som tar udden ur spelet |
| Låt laget kännas som ett teatersällskap med gemensam mission | Platta “gör poäng i tävlingen”-uppdrag utan karaktär |

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

### Fredag: Överdåd
Ostindiefararen är hemma. Ingen talar om vad som väntar. Vi ler mot våra fiender och dricker deras vin. Den sista natten innan allt brinner.

→ Intriger får gärna ge skäl att **skåla med fienden**, dölja hat bakom artighet, eller bära på något som måste ske “innan morgonen”.

### Lördag dag: Svek
Ytan spricker. Spelet är lagtävling, men man kan köpa fördelar och sälja ut sitt lag. Förräderi är tillåtet. Det är spelet.

→ Ge hemliga **erbjudanden, skulder, lojalitetskonflikter** och skäl att tveka mellan laget och dig själv.

### Lördag kväll: Förlisning
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

- **Lagintriger** (`crews/{id}.md`): gemensamma uppdrag + hur laget/skutan står mot andra skutor.
- **Individuella** (`guests/{login_slug}.md`): personliga band, hemligheter, envägsfixationer, privata uppdrag.

### Kortaste formen

I sin kortaste form ger en intrig spelaren tre saker:

1. **Något att vilja** (skatt, kärlek, hämnd, ära, en hemlighet, en plats i historien).
2. **Någon som står i vägen** (rival, älskare, lagkamrat, fiende, Malin, en skuld).
3. **En anledning att det måste avgöras nu** (helgen, skålen i kväll, innan morgonen, innan någon annan prejar först).

Saknas något av de tre: skriv om tills alla tre syns i texten.

De flesta intriger mår bra av att **minst tre personer** är involverade (mottagaren + två andra). Tvåpersonsdueller blir lätt platta; en tredje skapar triangel, vittne, budbärare, rival om samma byte, eller den som måste luras/övertygas. Envägsfixationer och rena tvåvägsspeglingar får förekomma, men sikta på tre när dramatiken tillåter.

### Koherens

- Tvåvägsrelationer speglas i båda filerna (A↔B).
- Envägs (hemlig kärlek, dold agenda): speglas **inte**; notera i frontmatter.
- Håll världen internkonsistent: samma stöld, samma ed, samma skuld ska inte motsäga sig mellan filer.

### Lag vs individ

- Lagkamrater ser **inte** varandras individuella intriger, skriv individuellt så det tål att vara hemligt inom laget (svek, hemlig kärlek till lagkamrat, osv. är tillåtna och dramaturgiskt välkomna).
- Laguppdrag ska kunna spelas **tillsammans** utan att kräva att alla läst samma individhemlighet.

---

## Checklista innan du sparar

1. Låter det som revy/Ramel, inte som instruktionsmanual?
2. Känner mottagaren sig som hjälte (eller stolt skurk) i sin egen berättelse?
3. Finns vilja + hinder + varför det måste avgöras *nu*?
4. Är minst tre personer involverade (eller finns skäl till färre)?
5. Omnämns alla deltagare **bara** med piratnamn (inga civilnamn)?
6. Spoilar texten Malin/Ran-slutet eller sista versens utgång? → stryk.
7. Kan det mata fredagens leenden, lördagens svek eller kvällens kaos?
8. Finns (gärna) eko från `svartamalin-sångtext.txt`, utan att spoila?
9. Är speglade intriger uppdaterade (eller enväg markerad i frontmatter)?
10. Finns em dash (—)? → stryk och skriv om med komma, kolon eller punkt.
