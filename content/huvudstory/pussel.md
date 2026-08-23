# Pussel och escape-mekanik

Intern text för Gustaf och agenten. Gäster läser inte detta. Tydlig prosa, ingen STYLE.md. Lösningar och bypass hör hemma här, aldrig i gästfilerna.

Regler och checklistor kommer från [`RESEARCH.md`](RESEARCH.md) del 2. Läs den innan du lägger till en nod här.

Grundregler, kort:

1. Grafen är **acyklisk**. Ingen ledtråd bakom sitt eget lås.
2. **Fem parallella quests**, aldrig en linjär kedja mot slutet. Beslutat 2026-08-20. RESEARCH sa två eller tre banor. Fem är medvetet: tre per skuta, tre skutor per quest, så lagen måste prioritera och kön vid en enda kedja försvinner.
3. Ett pussel tar **max fem minuter**.
4. **Inga röda sillar.** Ingen matematik. Ingen lång läsning.
5. Varje pussel är **självvaliderande**: spelaren vet själv att det är rätt.
6. Varje pussel har en **hint-trappa i fyra steg** och en **bypass**.
7. Kropp, ljus och optik framför papper och siffror.
8. **Ingen brute force.** Gåtor och uppdrag pekar. Ett sök-pussel har en ledtråd som säger var. Den som råkar hitta något de inte söker lämnar det. Off-regel, sägs i genomgången. Se [`spelledning.md`](spelledning.md).

---

## Nodmall

Ett kort per pussel. Kopiera och fyll i. Ofullständigt kort betyder att pusslet inte får byggas.

```
## P-nn: Namn

Typ:            kod / nyckel / sekvens / logik / meta / sök / optik / kropp
Plats:          
Låser upp:      P-nn, eller vilken beat i akter.md
Kräver:         P-nn, eller ingenting (ingångsnod)
Tid:            uppskattad minuter
Målgrupp:       hela ön / en skuta / namngivna personer

Lösning:        exakt vad spelaren måste göra

Ledtråd:        vad som pekar dit, och var den ledtråden finns
Självvalidering: hur spelaren vet att det är rätt

Hint 1 riktning:
Hint 2 objekt:
Hint 3 metod:
Hint 4 lösning:

Bypass:         hur spelet går vidare om pusslet aldrig löses
Props:          
Testat:         nej / ja, datum
```

---

## Pusselgraf

Konvergenspunkten och **formen på banorna** är beslutade. **Storyn i de fem questsen är beslutad 2026-08-20. Q-1 relåst 2026-08-22. Q-2 relåst 2026-08-23.** Q-1 har mekanikform (engångs) i [`quests.md`](quests.md). Q-2 har form utan pussel och utan pit stops. Q-5:s porträttvägg är öppen. Start, skutor, bokstäver är inte låsta. Ursprung: Gustaf, [`egna.md`](egna.md). Källa: [`beslut.md`](beslut.md).

```
Q-1 --pit stop(s)--> skatt (1 eller 2 bokstäver)
Q-2 (ingen pit stop) --> skatt i stugan, skatt vid graven
Q-3 --pit stop(s)--> skatt (1 eller 2 bokstäver)   }  varje skuta har ingång till 3 av 5
Q-4 --pit stop(s)--> skatt (1 eller 2 bokstäver)
Q-5 --pit stop(s)--> skatt (1 eller 2 bokstäver)
        \
         +--> P-01 Cryptex --nyckel--> kistan öppnas --> kontraktet (tändning)
        /
Malins XII (20.00, obligatorisk, kan inte hoppas över)
```

Hård formregel för P-01: **lösenordet går inte att kläcka utan XII.** Tre lösta quests plus XII räcker. Questen före 15.30 ger bokstäver, inte helheten. De får inte bilda ett gissningsbart ord utan XII. XII är nödvändig, inte bekräftande.

### Queststruktur

Fem separata kedjor. Inte en lång kedja som alla står i kö till.

| Regel | Tal |
|-------|-----|
| Quests | 5 |
| Ingångar per skuta | 3, i spelares intrigfiler |
| Skutor per quest | 3 |
| Pit stops per quest | 1 eller 2. **Q-2: 0.** |
| Skatt i slutet | bokstaven eller bokstäverna |
| För att knäcka P-01 | den egna skutans 3 quests **och** Malins XII |

Varje quest:

1. **Start** i en namngiven spelares intrig. Inte i lagfilen. Inte som allmänt rykte. Q-2: tre identiska starter, en person per av de tre skutorna.
2. **Ett eller två pit stops**, utom **Q-2: noll.** Ett pit stop kan kräva information som sitter hos en annan spelare.
3. **Skatt.** Där ligger bokstaven. Får finnas i flera exemplar om samma bokstav kommer från mer än en quest. Q-2: två ledtrådar, tre tokens av varje, en per lag per gömme.
4. **Storyline och uppgift.** En quest är inte bara ett pussel. Den har en historia *och* en eller flera uppgifter, utmaningar eller pussel. Q-2:s uppgift är överfart, minnen, token i stugan, token vid graven. Inget pussel.
5. **Malins historia, inte slutet.** Storyn lär något om Svarta Malins bakgrund. Den får ljuga (unreliable narrator). Den får **inte** röja affären med Karl XII eller förräderiet. Det sitter i kistan.

Story låst 2026-08-20. Full text, får-inte-listor och skrivstöd: [`quests.md`](quests.md).

| id | Namn | Lär gästen | Sanning vs lögn |
|----|------|------------|-----------------|
| Q-1 | Första kärleken | Kurtisan, sängen som underrättelse, skeppets namn | Yrket är kanon. Inte kungen. Hon är fortfarande kurtisan: bakom kulisserna. |
| Q-2 | Hur hon blev pirat | Sjörövarns rätt + namnet Svarta + Ottos grav | Får ljuga. Inte Ran. |
| Q-3 | Korvetten | Hon prejade sin egen korvett | **Lögn.** Kreditköpet sitter i kistan. |
| Q-4 | Ön | Hur hon fick Ovanan. Hamnen är ett löfte. | Får ljuga om bytet. Inte fällan. |
| Q-5 | Skuldboken | Hon samlar andras skulder | Metoden, inte kistans hög. |

Tvärledtrådar: deltagare får i sin intrig en ledtråd som behövs vid ett pit stop i de **två** quests skutan inte har ingång till. Ledtråden är meningslös om du inte redan känner till questet. Den är till för de tre andra lagen som springer den kedjan. **Q-2 har ingen tvärledtråd.** De tre startintrigerna är den enda skrivna pekaren mot stugan.

Syfte, låst: tre ändor att nysta i, så skutan måste prioritera. Fem parallella kedjor, ingen flaskhals mot slutet.

Tilldelning av vilka tre quests varje skuta får, och vem som bär start respektive tvärledtråd, görs i [`fordelning.yaml`](fordelning.yaml). **Inte förrän questsen är färdigskrivna** (story plus uppgifter). Välj lag och deltagare utifrån storyn, inte tvärtom.

Parkerade idéer nedan är **kandidater till pit stop eller skatt**, inte egna graf-former.

Kontroller att köra på grafen varje gång den ändras:

- [x] Fem parallella quests, inte en linjär kedja?
- [ ] Acyklisk?
- [ ] Varje skuta har exakt tre ingångar, varje quest exakt tre skutor?
- [ ] Start sitter i en spelares intrig, inte bara i lagfilen?
- [ ] Tvärledtrådar till de två quests skutan saknar: meningslösa utan questet? Q-2: ingen tvärledtråd, avsiktligt.
- [ ] Tre quests plus XII ger sex bokstäver, för varje skuta?
- [ ] Varje quest har både storyline och minst en uppgift? Q-1 ja. Q-2 ja (överfart, minnen, två tokens, inget pussel). Övriga story låst, uppgift inte.
- [x] Queststoryn lär något om Malins historia, och spoilar inte Karl XII eller förräderiet? Ja. Se [`quests.md`](quests.md).
- [ ] Ingen nod med fler än två beroenden nedströms som saknar bypass?
- [ ] Är typerna varierade, alltså inte fem kodlås i rad?
- [x] Är den linjära sträckan i slutet lätt? Ja, avsiktligt: slå in sex kända bokstäver vid festen.

#### Bokstäver mot lösenord

Kandidat fortfarande `HKHXII`. Då ger questen `1H`, `2K`, `3H` och Malin ger `XII`. Sex ringar.

Agentkommentar, inte Gustafs tabell: tre quests måste räcka till `H+K+H` för **varje** skuta. Fem quests och tre bokstavsplatser går inte ihop om varje quest ger exakt en unik bokstav. Några quests måste ge två bokstäver, eller samma positionsmarkering i flera exemplar, så att varje skutas tre quests täcker `1H`, `2K` och `3H`. Lås inte bokstavstilldelningen förrän mekaniken i Q-1 till Q-5 finns.

Spänning mot invariant 6: en start i **en** spelares intrig är en flaskhals för den skutan. Spelet som helhet klarar det, tre andra lag springer samma quest. Inom skutan är det avsiktligt: tre trådar, en kan bli liggande. Pit-stop-info som **alla tre** lagen behöver: minst två bärare, plus spelledarväg. Se definition of done i [`README.md`](README.md).

Spänning mot sången och beslut 2026-08-18: sången säger att hon prejat sin egen korvett. Beslutet säger att Kurtisanen är köpt på kredit, inte prejad. **Q-3 är den opålitliga versionen.** Sanningen (kredit, skulder, kungen) sitter i kistan. Låst 2026-08-20. Se [`quests.md`](quests.md).

---

## Noder

### P-01: Cryptexen

Typ:            kod / meta
Plats:          cirkulerar, ingen fast plats
Låser upp:      nyckeln till kistan, beat B-41
Kräver:         tre av fem quests (bokstäver) **och** Malins XII vid kaviar och rom
Tid:            att slå in koden: under en minut. Questen: lördag förmiddag.
Målgrupp:       hela ön

Lösning:        sex bokstäver. Kandidat: `HKHXII`. Tre quests ger `H`, `K`, `H`. Malin ger `XII`.

Ledtråd:        questskatterna, positionsmarkering typ `1H` `2K` `3H`, i flera exemplar. Hård regel: gåtan går inte att lista ut utan XII, som syns på Malin när hon serverar kaviar och rom lördag ca 20.00.
Självvalidering: cryptexen öppnas. Nyckeln ligger i.

Hint 1 riktning: TBD, när lösenordet finns
Hint 2 objekt:
Hint 3 metod:
Hint 4 lösning:

Bypass:         spelledning har reservnyckel. Om kistan fortfarande är stängd 20.45 tvingas den upp, av Malin eller Spader, i roll. Spelet får inte stanna på ett lås.
Props:          cryptex med sex bokstavsringar, rymmer en nyckel; lapp "Denna tappas lätt bort"; nyckel; reservnyckel hos spelledning
Testat:         nej

#### Meta-regel på lappen

Text på lappen, fäst på cryptexen: **Denna tappas lätt bort.**

Betydelse, som spelarna förväntas följa: den som hittar cryptexen kommer snart att förlora den. Slagsmål, vadslagning, stöld eller slarv. Cryptexen är ett cirkulerande föremål, inte ett byte att gömma.

Runtime: se [`spelledning.md`](spelledning.md). Om någon hamstrar den: play to lose vinner. Andra tar den, eller Malin "lånar" den.

#### Vad som inte får vara lösenordet

Så att vi inte råkar designa en gåta som går att gissa före 20.00:

- Inte MALINS, SKATT, PIRAT, KUNGEN, KISTAN, KARLXII, eller något annat ord från sången, ön, Malins namn eller kontraktets parter
- Inte ett anagram av synliga saker på ön
- Inte ett ord som sitter ihop om man bara har fem av sex bokstäver
- Inte en sista ledtråd som bara säger "ni hade rätt"

### P-02: Dagboksbladets två halvor

Typ:            sök
Plats:          Gubben i stubben (vänster halva), Gumman på udden (höger halva)
Låser upp:      P-03
Kräver:         Q-1-start i en spelares intrig (tre skutor TBD)
Tid:            5 till 15 minuter att gå mellan uddarna. Själva läsningen under en minut.
Målgrupp:       tre skutor, tävling

Lösning:        hämta båda halvorna, håll ihop dem vertikalt, läs framsidan, vänd. Framsidan är dagbok. Baksidan är vägvisning till klätternätet.

Ledtråd:        starten säger att något är delat på två uddar, eller pekar mot Gubben och Gumman. Halvorna ligger vid trädocka och flaska, inte löst på bänken.
Självvalidering: de två bitarna passar. Framsidan blir läsbar. Baksidan pekar vidare.

Hint 1 riktning: det ni söker sitter inte på en udde. Det sitter på två.
Hint 2 objekt: Gubben i stubben har den ena. Gumman på udden har den andra. Titta vid dockan och flaskan.
Hint 3 metod: bladet är rivet på höjden. Håll ihop kanterna. Läs båda sidor.
Hint 4 lösning: vänster halva hos Gubben, höger hos Gumman. Framsidan är dagbok. Baksidan säger klätternätet.

Bypass:         om halvorna är borta: fråga vem som satt vid bänkarna i förmiddag. Om de är förlorade: Spader har avskrift av framsida och baksida, inte cryptex-lappen, inte det andra bladet. Kedjan går vidare till P-03.
Props:          Q1-01, två halvblad, dubbelsidiga. Tryck: [`../rekvisita/Q1-dagbok-1-fore.md`](../rekvisita/Q1-dagbok-1-fore.md), [`../rekvisita/Q1-dagbok-1-baksida.md`](../rekvisita/Q1-dagbok-1-baksida.md). Avskrift hos spelledning.
Testat:         nej

Engångs: halvorna tas. Första laget bär dem. Andra lag avskriver, stjäl eller byter. Trädockor och flaskor stannar.

### P-03: Blad två och cryptex-lappen

Typ:            sök / kropp
Plats:          klätternätet, högt i nätet
Låser upp:      en cryptex-bokstav till P-01
Kräver:         P-02 (baksidan säger var)
Tid:            några minuter att få ned. Inte ett klätterprov. Hitta något långt eller klättra kort.
Målgrupp:       tre skutor, tävling

Lösning:        hämta påsen högt i klätternätet. I den ligger det andra dagboksutdraget (efter hämnden) och cryptex-lappen.

Ledtråd:        baksidan av det rivna bladet. Ingen annan pekare. Den som råkar se påsen och inte söker den lämnar den.
Självvalidering: ett helt andra blad om hämnden, plus lappen.

Hint 1 riktning: inte vid bänkarna. Vänd på det ni just läste.
Hint 2 objekt: klätternätet. Titta högt, inte i gräset.
Hint 3 metod: få ned påsen. En stång, en åra, eller klättra. Det ska ta en stund, inte kräva en atlet.
Hint 4 lösning: påse knuten högt i nätet. Andra bladet och lappen i påsen.

Bypass:         om påsen är tagen: jaga den som tog den. Lappen får stjälas, bytas, avskrivas. Om den är förlorad på riktigt: spelledning har reservlapp och avskrift av andra bladet. Om ingen når P-03 före brunchen: Spader ger Q-1-starten en riktning mot nätet, inte mot kungen.
Props:          Q1-03 cryptex-lapp, Q1-04 andra bladet, påse. Tryck: [`../rekvisita/Q1-dagbok-2-efter.md`](../rekvisita/Q1-dagbok-2-efter.md). Reservlapp hos spelledning.
Testat:         nej

Engångs: påsen tas. Tre skutor tävlar. Förlorarna får lappen socialt.

### Q-1 till Q-5

Fem parallella kedjor. **Story låst. Q-1 mekanik låst som engångs. Q-2 mekanik låst utan pussel.** Q-3 till Q-5: ofullständig mekanikrad betyder att questen inte får byggas. Storybriefs: [`quests.md`](quests.md).

Mall för mekanik, fylls när pit stops låses:

```
## Q-n: Namn

Story:          se quests.md. Inte här.
Uppgifter:      en eller flera. Pit stops och skatt räknas.
Bokstav:        1 eller 2 tecken, positionsmarkering
Ingångar:       tre skutor
Start:          slug, i den personens intrig
Pit stop 1:     vad, var, vems info om det krävs
Pit stop 2:     (valfri)
Tvärledtråd:    vilka slugs i de två skutor som inte har ingången. Meningslös utan questet.
Skatt:          var bokstaven ligger
Bypass:         
Props:          
Testat:         nej
```

| id | Namn | Story | Bokstav | Ingångar | Start | Status |
|----|------|-------|---------|----------|-------|--------|
| Q-1 | Första kärleken | se quests.md | | tre skutor TBD | | story + form + engångs låst. P-02, P-03. Bokstav och start öppna |
| Q-2 | Hur hon blev pirat | se quests.md | | tre skutor TBD | | story + form låst 2026-08-23. Inga pit stops. Ingen pusselnod. Stuga och grav låsta. Två ledtrådar. Bokstäver och start öppna |
| Q-3 | Korvetten | se quests.md. Lögn: prejning. Sanning i kistan. | | tre skutor TBD | | story låst, mekanik öppen |
| Q-4 | Ön | se quests.md | | tre skutor TBD | | story låst, mekanik öppen |
| Q-5 | Skuldboken | se quests.md | | tre skutor TBD | | story låst. Porträttväggen är idé, inte låst |

#### Q-1: Första kärleken

Story:          se quests.md. Inte här.
Uppgifter:      P-02 två halvor av första bladet, P-03 påsen med andra bladet och lappen.
Bokstav:        TBD
Ingångar:       tre skutor TBD
Start:          slug TBD, i den personens intrig. Inte Hjärter, Felix, Blodig.
Pit stop 1:     P-02, Gubben och Gumman. Ingen andras info krävs.
Pit stop 2:     (ingen)
Tvärledtråd:    TBD när skutorna tillsätts. Meningslös utan questet. Kandidat: att något är rivet norr och söder.
Skatt:          P-03, påsen i klätternätet, andra bladet och cryptex-lappen.
Bypass:         se P-02 och P-03.
Props:          Q1-01, Q1-03, Q1-04. Avskrift och reservlapp hos spelledning.
Testat:         nej

#### Q-2: Hur hon blev pirat

Story:          se quests.md. Inte här.
Uppgifter:      åk till piratstugan, läs de tre bladen, ta en token ur skrinet, följ namnbladet till graven, ta en token där. Inga pit stops. Inget pussel. Ingen nod.
Bokstav:        TBD. Två olika bokstäver, tre exemplar av varje.
Ingångar:       tre skutor TBD
Start:          tre slugs TBD, en person per av de tre skutorna. Samma rykte om huset. Inte Malin. Inte bara Kuling eller Rödskägg.
Pit stop 1:     ingen
Pit stop 2:     ingen
Tvärledtråd:    ingen. Starten är enda skrivna pekaren mot stugan. Namnbladet i stugan är pekaren mot graven.
Skatt:          Q2-01 i skrinet. Q2-10 vid graven. Tre tokens av varje. Skylt: Endast en per lag.
Bypass:         om ingen åker ut: Spader ger starten riktning mot södra ön. Reservtokens hos spelledning bara om tokens är borta från ön. Den som råkar gå in utan Q-2 lämnar skrinet och tokens vid graven.
Props:          Q2-01 till Q2-10. Tryck: Q2-07, Q2-08, Q2-09.
Testat:         nej

---

## Öns färdiga mekaniker

Fysiska förutsättningar vi redan har och som pussel bör byggas kring. Detta är öns starkaste tillgång, eftersom mekaniken är verklig och inte påhittad.

### Malins kista

Ny, beslutad 2026-08-18. Inte en färdig mekanik på ön, utan den vi sätter dit. Konvergenspunkten.

- **Naturlig svårighet:** alla ser den, ingen kommer in. Den är ett offentligt lås.
- **Bra användning:** fredagens frö (synlig, orörd), lördagens jakt (nyckeln cirkulerar), kvällens tändning (innehållet)
- **Dålig användning:** att gömma kistan. Den ska vara väl synlig.
- **Hård begränsning:** får inte kunna öppnas före kaviar och rom. Lösenordet bär den begränsningen, inte vakter.
- **Plats:** TBD. Se [`platser.md`](platser.md).

### Kikaren mot skylten på annan ö

En optisk envägsledtråd, **om** vi bygger den. Skylten är en parkerad idé, inte beslutad. Kikaren finns oavsett och kan användas till annat.

- **Naturlig svårighet:** man måste veta **var** man ska sikta, alltså en bäring, ett riktmärke eller ett klockslag när solen står rätt
- **Naturlig konsekvens:** informationen måste bäras vidare muntligt eller ritas av, och felkopiering blir en del av spelet
- **Villkor:** om vi kör skylten måste den planeras, tillståndsprövas och installeras före helgen. Bygg inga noder som kräver den förrän beslutet är taget.

### Svärdfiskens gap

Ett offentligt gömställe i genomfartsrummet.

- **Naturlig svårighet:** ingen tittar in i ett gap. Ledtråden måste peka på fisken utan att säga fisken
- **Bra användning:** dead drop mellan två personer som inte får ses tillsammans. Brev som byts under helgen
- **Dålig användning:** att gömma det viktigaste objektet där. För trafikerat, hittas antingen direkt eller aldrig. Cryptexen ska inte ligga här som hemvist: den ska cirkulera.

### Piratstugan på Södra Ovanan

Slutet rum med eld. **Inte ett escape-rum i Q-2.** Möblerad som Malins tillflykt.

- **Naturlig svårighet:** man måste ta sig dit över vatten. Ekan tar 5 personer och 2 minuter, minst två ombord. Kajaker och SUP tar 10 minuter, minst två farkoster ute. Restiden är inte tröskeln. Aldrig ensam. Skrivna överfarter går gärna via **Kapten Kuling** eller **Kapten Rödskägg**, för spel. Man får paddla utan dem. Den enda skrivna pekaren dit är Q-2:s tre startintriger.
- **Bra användning:** Q-2. Rummet är huset hon byggde efter att hon flyttade hemifrån. Små minnen som berättar hur hon blev pirat. Namnbladet pekar mot Ottos grav i skogen. Skrin med tokens, en per lag. Se [`quests.md`](quests.md).
- **Dålig användning:** ljus- och mörkerpussel, värmelås, numrerade stationer, något som måste lösas för att skrinet ska synas.
- **Hård begränsning:** stängs 13.30. Allt innehåll här måste kunna klaras av före brunchen. Ingen ensam överfart. Ingen annan quest, sajtcopy eller tvärledtråd får peka mot stugan.

### Verkstadens förrådsrum

Byggbara rum. Escape-rumskandidaten, och den enda som är tillgänglig hela dagen. Piratstugan är inte escape-rum.

- **Bra användning:** arkiv, kartrum, skattkammare, cell. Här kan vi montera lås och installationer i förväg
- **Att bestämma:** hur många rum får vi använda, och hur mycket får vi bygga om

### Skelettet i skogen

Ottos grav. Q-2:s andra gömme. Namnbladet i stugan är pekaren.

- **Bra användning:** andra cryptex-ledtråden, tre tokens, en per lag. Samma skylt som skrinet.
- **Varning:** hittas den utan namnbladet är det bara ett skelett. Off-regeln: den som inte söker Q-2 lämnar tokens.
- **Konsistens:** Otto är död. Han är inte kungen. Han är inte en gäst. Graven förklarar inte kistan.

### Segelbåten vid bojen (Tvåkronan)

Isolering och tröskel. Två till fyra personer, ingen kan höra dem. Båten heter Tvåkronan.

- **Bra användning:** platsen där det farligaste objektet ligger, eller där ett hemligt möte måste hållas. Parkerad idé: ett faktiskt 2-kronorsmynt som ledtråd, se nedan.
- **Varning:** kräver simning eller eka, alltså samma säkerhetsbegränsning som Södra Ovanan. Stängs 13.30. Aldrig ensam, minst två på vattnet.

### Gubben i stubben och Gumman på udden

Två spegelplatser på huvudön Ovanan, redan på plats. **Q-1, P-02.** Se [`quests.md`](quests.md).

**Gubben i stubben** (norra ändan): bänk vid en stubbe. I stubben ligger en trägubbe och en flaska sprit. Vänster halva av dagboksbladet, i flaskan eller under dockan, i vaxduk.

**Gumman på udden** (södra ändan av huvudön, inte Södra Ovanan): bänk med en trägumma och en flaska sprit. Höger halva, samma gömma.

- **Naturlig svårighet:** två platser, långt isär. Ingen ser båda halvorna utan att gå. Vertikalt rivet: ingen halva är läsbar ensam.
- **Engångs, låst 2026-08-22:** halvorna tas. Tre skutor tävlar. Förlorarna får texten genom stöld, byte eller avskrift. Dockor och flaskor stannar.

### Klätternätet

Kroppsligt moment. **Q-1, P-03.** Påsen med blad två och cryptex-lappen sitter högt i nätet. Inte ett klätterprov: det ska ta tid att få ned, med stång eller kort klättring. Parkerad idé "högt hängande ledtråd" används här. Se nedan.

- **Naturlig svårighet:** man måste veta att man ska titta i nätet. Bladet från P-02 pekar. Den som råkar se påsen lämnar den.
- **Engångs:** påsen tas. Cryptex-lappen cirkulerar därefter.

---

## Parkerade idéer (2026-08-20)

Parkerade idéer nedan är **kandidater till pit stop eller skatt** i Q-1 till Q-5, inte egna graf-former. Ursprung: Gustaf, se [`egna.md`](egna.md). Utbyggnaden och varningarna är agentkommentarer, inte hans formulering. Får inte byggas förrän de sitter i ett Q-kort ovan.

### Pacing via mat och fasta tider

Vissa ledtrådar delas ut i samband med mat eller andra fasta samlingar (brunch, servering, genomgång), inte när någon råkar hitta dem. Syfte: kontrollera pacing. Huvudstoryn ska inte kunna lösas före 13.30 bara för att någon startade tidigt.

Passar: bokstäver till P-01, kartbitar, skiffernycklar. Passar inte: den sista ledtråden, som redan är låst till kaviar och rom.

### Högt hängande ledtråd

Används av **Q-1 / P-03**: påsen sitter högt i klätternätet. Inte ett klätterprov. Det ska ta tid att hitta något långt, eller klättra kort, och få ned påsen.

Idén är inte nödvändigtvis att man måste klättra högt, utan att man istället måste hitta något långt som man kan använda för att få ned ledtråden. På så sätt handlar pusslet mer om att det tar tid att hitta rätt grej, än om att man måste vara bra på att klättra.

Övriga grenar på ön är fortfarande lediga om en annan quest behöver samma gest.

### Delad karta

En karta i flera fysiska delar. Alla bitar behövs för att hitta rätt plats. Klassisk parallell bana: varje skuta eller spår bär en bit.

Krav om den används: minst två oberoende sätt att få ihop bitarna, plus spelledarväg. Kartan får peka mot en plats, inte mot lösenordet. Lösenordet ska fortfarande vara olösligt utan Malins sista ledtråd.

### Tvåkronan: myntet i båten

Segelbåten vid bojen heter **Tvåkronan**. En ledtråd kan ligga ombord, och ledtråden kan vara ett faktiskt svenskt 2-kronorsmynt.

Krav om den används: samma vattenregel som resten av båten. Stängs 13.30. Aldrig ensam. Skrivna turer dit går gärna via Kuling eller Rödskägg.

### Ledtråd planterad hos en karaktär

Vissa ledtrådar sitter inte i ett gömställe utan hos en person. Någon annan måste få dem att berätta. Det är grindvakt-rollen i [`premiss.md`](premiss.md).

Krav om den används: minst två personer kan avslöja samma sak (invariant i [`README.md`](README.md)). Inte ett pussel som kräver att exakt en namngiven person är närvarande. Bypass om bäraren är tyst, full eller borta.

### Caesarskiffer eller liknande

En ledtråd lämnas ut på ett ställe, oläsbar utan skiffernyckeln. Nyckeln finns på en annan plats eller hos en annan person.

Spänning mot grundreglerna: "ingen matematik" och "kropp, ljus och optik framför papper och siffror". Caesar är papper. Om den används: mycket kort meddelande, nyckeln är ett fysiskt föremål eller en muntlig fras, inte en uträkning. Inte efter 15.30.

### Halsband XII och lösenord HKHXII

Sista ledtråden är beslutad 2026-08-20. Lösenordets övriga bokstäver är fortfarande kandidat.

**Sista ledtråden:** Svarta Malins halsband, som hon sätter på till slutfesten, bär **XII**. Referens till affären med Karl XII. Läses när hon serverar kaviar och rom. Inte ett djur.

**Lösenord:** kandidat `HKHXII` (Hans Kungliga Höghet XII). Sex tecken, passar cryptexen. Inte antaget.

**Utdelning före 15.30:** lappar med positionsmarkering, `1H`, `2K`, `3H`, `4X`, `5I`, `6I`. Får finnas i flera exemplar. Helheten går inte att slå in förrän XII syns på Malin.

Spänningar som måste lösas om `HKHXII` antas:

- Antipattern: lösenordet får inte gå att gissa från Karl XII. `HKHXII` är just det. Försvaret i förslaget: utan XII är `HKH` inte ett ord, och XII syns först 20.00. Risken: någon som redan rumlar om kungen gissar resten.
- Antipattern: inte ett ord som sitter ihop om man har fem av sex bokstäver. Positionsmarkeringarna måste alltså inte läcka `X` och `I` före festen. Bara `H` och `K` före 20.00. `XII` är Malins.
- Malin vet inte att kistan öppnas, och ger inte sista ledtråden medvetet. Halsbandet måste kunna läsas av andra utan att hon förklarar det.

### Porträttväggen: sångordning

Kandidat till **Q-5:s sista steg**. Inte låst. Se [`quests.md`](quests.md).

På en prominent plats: bilder på alla 25 pirater, uppsatta efter skuta. Bokstav på baksidan. Sorteras de i den ordning namnen nämns i sångtexten bildar baksidorna en mening, en ledtråd. Koppling till skuldboken: listan på "de värsta kaptener som finns".

Gustaf: bara en grupp kan lösa Q-5 om väggen är unik, såvida inte porträtten passas vidare.

Fakta om namnordningen, om förslaget antas. Första gången varje närvarande namn nämns, hela sången:

1. Enben, 2. Blodig, 3. Frodig, 4. Babord, 5. Kuling, 6. Fuling, 7. Nykter, 8. Svarta Malin, 9. Barnsben, 10. Döver, 11. Hjärter, 12. Spader, 13. Klöver, 14. Blåskägg, 15. Rödskägg, 16. Rötägg, 17. Lösskägg, 18. Hurring, 19. Kosing, 20. Rosing, 21. Plåthorn, 22. Prygel, 23. Dunka, 24. Planka, 25. Felix.

Vers 1 och 2 innehåller bara åtta av de 25. Resten dyker upp först i sista versen, som är slutstriden och inte får spoilas i förväg. Att sortera rätt kräver alltså sista versen, eller en utskriven namnlista som inte är sången.

Spänningar:

- Antipattern: ingen lång läsning. 25 namn mot en sångtext är en läsuppgift. Behöver en fysisk sångtext eller en kortare nyckel på plats, eftersom ingen story-bit får kräva mobil.
- Sista versen är finalen. En utskriven fulltext på väggen spoilar den. En nyckel som bara listar de 25 i rätt ordning spoilar pusslet.
- Startordningen efter skuta är bra: väggen är meningsfull redan innan någon rör den. Folk kan ta ned sin egen bild. Bypass om väggen är raserad.
- Meningen på baksidan får inte vara lösenordet. Den får vara en ledtråd till en plats, en person eller en bokstav. Inte gissningsbar från sången ensam.
- Plats TBD. Vardagsrummet är kandidat: alla ser den, hög trafik.

---

## Antipattern-lista

Saker vi bestämt att vi inte gör. Skrivs ut så att bra men fel idéer kan avvisas snabbt.

- Sifferkodlås som kräver räkning
- Korsord, anagram eller ordlekar som kräver att man läser mycket text
- Röda sillar och villospår
- Pussel som kräver att exakt en namngiven person är närvarande
- Pussel som kräver mobil, QR-kod, app eller nätuppkoppling
- Pussel efter 15.30, med enda undantag: att slå in sex redan kända bokstäver i cryptexen vid 20.00
- Något som kräver simning efter 13.30
- Något som kräver att en person åker eka, kajak, paddel eller simmar ensam
- Ett enda pussel som blockerar hela helgens framdrift
- Pussel som kräver skylten på annan ö, så länge den idén är parkerad
- Pussel som förutsätter att skattjakten pausas. De pågår samtidigt och får krocka.
- Ett lösenord som går att gissa från sången, ön, Malins namn eller Karl XII
- En sista ledtråd som bara bekräftar det man redan kunnat räkna ut
- En kista som göms. Den ska vara väl synlig.
- En cryptex som får hamstras. Lappen gäller.
