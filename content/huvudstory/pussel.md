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

Konvergenspunkten och **formen på banorna** är beslutade. **Storyn i de fem questsen är beslutad 2026-08-20.** Q-1 och Q-2 har mekanikform i [`quests.md`](quests.md). Q-1:s engångsproblem och Q-5:s porträttvägg är öppna. Start, skutor, bokstäver och hint-trappa är inte låsta. Ursprung: Gustaf, [`egna.md`](egna.md). Källa: [`beslut.md`](beslut.md) 2026-08-20.

```
Q-1 --pit stop(s)--> skatt (1 eller 2 bokstäver)
Q-2 --pit stop(s)--> skatt (1 eller 2 bokstäver)
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
| Pit stops per quest | 1 eller 2 |
| Skatt i slutet | bokstaven eller bokstäverna |
| För att knäcka P-01 | den egna skutans 3 quests **och** Malins XII |

Varje quest:

1. **Start** i en namngiven spelares intrig. Inte i lagfilen. Inte som allmänt rykte.
2. **Ett eller två pit stops.** Ett pit stop kan kräva information som sitter hos en annan spelare.
3. **Skatt.** Där ligger bokstaven. Får finnas i flera exemplar om samma bokstav kommer från mer än en quest.
4. **Storyline och uppgift.** En quest är inte bara ett pussel. Den har en historia *och* en eller flera uppgifter, utmaningar eller pussel.
5. **Malins historia, inte slutet.** Storyn lär något om Svarta Malins bakgrund. Den får ljuga (unreliable narrator). Den får **inte** röja affären med Karl XII eller förräderiet. Det sitter i kistan.

Story låst 2026-08-20. Full text, får-inte-listor och skrivstöd: [`quests.md`](quests.md).

| id | Namn | Lär gästen | Sanning vs lögn |
|----|------|------------|-----------------|
| Q-1 | Första kärleken | Kurtisan, kärlek som kontrakt, skeppets namn | Inte kungen. Yrket är questens påstående. |
| Q-2 | Hur hon blev pirat | Sjörövarns rätt + namnet Svarta | Får ljuga. Inte Ran. |
| Q-3 | Korvetten | Hon prejade sin egen korvett | **Lögn.** Kreditköpet sitter i kistan. |
| Q-4 | Ön | Hur hon fick Ovanan. Hamnen är ett löfte. | Får ljuga om bytet. Inte fällan. |
| Q-5 | Skuldboken | Hon samlar andras skulder | Metoden, inte kistans hög. |

Tvärledtrådar: deltagare får i sin intrig en ledtråd som behövs vid ett pit stop i de **två** quests skutan inte har ingång till. Ledtråden är meningslös om du inte redan känner till questet. Den är till för de tre andra lagen som springer den kedjan.

Syfte, låst: tre ändor att nysta i, så skutan måste prioritera. Fem parallella kedjor, ingen flaskhals mot slutet.

Tilldelning av vilka tre quests varje skuta får, och vem som bär start respektive tvärledtråd, görs i [`fordelning.yaml`](fordelning.yaml). **Inte förrän questsen är färdigskrivna** (story plus uppgifter). Välj lag och deltagare utifrån storyn, inte tvärtom.

Parkerade idéer nedan är **kandidater till pit stop eller skatt**, inte egna graf-former.

Kontroller att köra på grafen varje gång den ändras:

- [x] Fem parallella quests, inte en linjär kedja?
- [ ] Acyklisk?
- [ ] Varje skuta har exakt tre ingångar, varje quest exakt tre skutor?
- [ ] Start sitter i en spelares intrig, inte bara i lagfilen?
- [ ] Tvärledtrådar till de två quests skutan saknar: meningslösa utan questet?
- [ ] Tre quests plus XII ger sex bokstäver, för varje skuta?
- [ ] Varje quest har både storyline och minst en uppgift? Story låst. Uppgift inte.
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

### Q-1 till Q-5

Fem parallella kedjor. **Story låst.** Mekanik TBD. Storybriefs: [`quests.md`](quests.md). Ofullständig mekanikrad betyder att questen inte får byggas.

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
| Q-1 | Första kärleken | se quests.md | | tre skutor TBD | | story + form låst. Engångsproblem öppet |
| Q-2 | Hur hon blev pirat | se quests.md | | tre skutor TBD | | story + form låst. Stugans innehåll öppet |
| Q-3 | Korvetten | se quests.md. Lögn: prejning. Sanning i kistan. | | tre skutor TBD | | story låst, mekanik öppen |
| Q-4 | Ön | se quests.md | | tre skutor TBD | | story låst, mekanik öppen |
| Q-5 | Skuldboken | se quests.md | | tre skutor TBD | | story låst. Porträttväggen är idé, inte låst |

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

Öns enda riktiga escape-rum. Slutet, mörkt, med eldstad och kamin.

- **Naturlig svårighet:** man måste ta sig dit över vatten. Ekan tar 5 personer och 2 minuter, minst två ombord. Kajaker och SUP tar 10 minuter, minst två farkoster ute. Restiden är inte tröskeln. Aldrig ensam. Skrivna överfarter går gärna via **Kapten Kuling** eller **Kapten Rödskägg**, för spel. Man får paddla utan dem.
- **Bra användning:** Q-2. Rummet är Svarta Malins ursprungliga hem. Saker från hennes historia. Ljus- och mörkerpussel, saker som blir läsbara i eldsken eller värme.
- **Hård begränsning:** stängs 13.30. Allt innehåll här måste kunna klaras av före brunchen. Ingen ensam överfart. Skelettet i skogen är inte Q-2:s skatt.

### Verkstadens förrådsrum

Byggbara rum. Andra escape-rumskandidaten, och den enda som är tillgänglig hela dagen.

- **Bra användning:** arkiv, kartrum, skattkammare, cell. Här kan vi montera lås och installationer i förväg
- **Att bestämma:** hur många rum får vi använda, och hur mycket får vi bygga om

### Skelettet i skogen

En kropp som redan finns i fiktionen.

- **Bra användning:** identitet, ursprungsbrott, något att bära hem som bevis
- **Varning:** hittas den för tidigt utan sammanhang blir den bara en kuriositet. Den behöver en ledtråd som gör den läsbar, alltså ett tecken, ett smycke, en tatuering eller ett dokument
- **Konsistens:** skelettet får inte motsäga kistan och kontraktet

### Segelbåten vid bojen (Tvåkronan)

Isolering och tröskel. Två till fyra personer, ingen kan höra dem. Båten heter Tvåkronan.

- **Bra användning:** platsen där det farligaste objektet ligger, eller där ett hemligt möte måste hållas. Parkerad idé: ett faktiskt 2-kronorsmynt som ledtråd, se nedan.
- **Varning:** kräver simning eller eka, alltså samma säkerhetsbegränsning som Södra Ovanan. Stängs 13.30. Aldrig ensam, minst två på vattnet.

### Gubben i stubben och Gumman på udden

Två spegelplatser på huvudön Ovanan, redan på plats. **Q-1.** Se [`quests.md`](quests.md).

**Gubben i stubben** (norra ändan): bänk vid en stubbe. I stubben ligger en trägubbe och en flaska sprit. Ena halvan av dagboksbladet.

**Gumman på udden** (södra ändan av huvudön, inte Södra Ovanan): bänk med en trägumma och en flaska sprit. Andra halvan.

- **Naturlig svårighet:** två platser, långt isär. Ingen ser båda halvorna utan att gå.
- **Hård begränsning:** tre skutor ska kunna läsa bladet. Halvor som plockas upp försvinner. Engångsproblem, olöst. Nodekort får inte byggas förrän det är löst.

### Klätternätet

Kroppsligt moment. Bra som prov eller som plats där något hänger utom räckhåll. Parkerad idé: ledtråd högt upp, se nedan.

---

## Parkerade idéer (2026-08-20)

Parkerade idéer nedan är **kandidater till pit stop eller skatt** i Q-1 till Q-5, inte egna graf-former. Ursprung: Gustaf, se [`egna.md`](egna.md). Utbyggnaden och varningarna är agentkommentarer, inte hans formulering. Får inte byggas förrän de sitter i ett Q-kort ovan.

### Pacing via mat och fasta tider

Vissa ledtrådar delas ut i samband med mat eller andra fasta samlingar (brunch, servering, genomgång), inte när någon råkar hitta dem. Syfte: kontrollera pacing. Huvudstoryn ska inte kunna lösas före 13.30 bara för att någon startade tidigt.

Passar: bokstäver till P-01, kartbitar, skiffernycklar. Passar inte: den sista ledtråden, som redan är låst till kaviar och rom.

### Högt hängande ledtråd

Häng en ledtråd högt på en gren, så att det tar tid och blir ett projekt att få ned den. Klätternätet är en given plats. En vanlig trädgren fungerar också.

Idén är inte nödvändigtvis att man måste klättra högt, utan att man istället måste hitta något långt som man kan använda för att få ned ledtråden. På så sätt handlar pusslet mer om att det tar tid att hitta rätt grej, än om att man måste vara bra på att klättra.

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
