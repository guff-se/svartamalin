# Pussel och escape-mekanik

Regler och checklistor kommer från [`RESEARCH.md`](RESEARCH.md) del 2. Läs den innan du lägger till en nod här.

Grundregler, kort:

1. Grafen är **acyklisk**. Ingen ledtråd bakom sitt eget lås.
2. **Två eller tre parallella banor**, aldrig en linjär kedja.
3. Ett pussel tar **max fem minuter**.
4. **Inga röda sillar.** Ingen matematik. Ingen lång läsning.
5. Varje pussel är **självvaliderande**: spelaren vet själv att det är rätt.
6. Varje pussel har en **hint-trappa i fyra steg** och en **bypass**.
7. Kropp, ljus och optik framför papper och siffror.

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

Rita grafen här som ASCII eller mermaid när noderna finns. Kontrollera formen: diamanter, inte en lång kedja.

```
[ingen graf än]
```

Kontroller att köra på grafen varje gång den ändras:

- [ ] Acyklisk?
- [ ] Minst fem ingångsnoder, alltså en per skuta?
- [ ] Minst två parallella banor hela vägen till konvergenspunkten?
- [ ] Ingen nod med fler än två beroenden nedströms som saknar bypass?
- [ ] Är typerna varierade, alltså inte fem kodlås i rad?
- [ ] Är den linjära sträckan i slutet lätt?

---

## Noder

Inga ännu.

---

## Öns färdiga mekaniker

Fysiska förutsättningar vi redan har och som pussel bör byggas kring. Detta är öns starkaste tillgång, eftersom mekaniken är verklig och inte påhittad.

### Kikaren mot skylten på annan ö

En optisk envägsledtråd. En person åt gången ser något ingen annan ser samtidigt.

- **Naturlig svårighet:** man måste veta **var** man ska sikta, alltså en bäring, ett riktmärke eller ett klockslag när solen står rätt
- **Naturlig konsekvens:** informationen måste bäras vidare muntligt eller ritas av, och felkopiering blir en del av spelet
- **Att bestämma:** vad står på skylten, hur får man bäringen, och vad händer om vädret är dåligt

### Svärdfiskens gap

Ett offentligt gömställe i genomfartsrummet.

- **Naturlig svårighet:** ingen tittar in i ett gap. Ledtråden måste peka på fisken utan att säga fisken
- **Bra användning:** dead drop mellan två personer som inte får ses tillsammans. Brev som byts under helgen
- **Dålig användning:** att gömma det viktigaste objektet där. För trafikerat, hittas antingen direkt eller aldrig

### Piratstugan på Södra Ovanan

Öns enda riktiga escape-rum. Slutet, mörkt, med eldstad och kamin.

- **Naturlig svårighet:** man måste ta sig dit över vatten, och antalet platser i ekan begränsar gruppen
- **Bra användning:** ljus- och mörkerpussel, saker som blir läsbara i eldsken eller värme, ett rum som ska förstås som en frånvarande persons hem
- **Hård begränsning:** stängs 13.30. Allt innehåll här måste kunna klaras av före brunchen

### Verkstadens förrådsrum

Byggbara rum. Andra escape-rumskandidaten, och den enda som är tillgänglig hela dagen.

- **Bra användning:** arkiv, kartrum, skattkammare, cell. Här kan vi montera lås och installationer i förväg
- **Att bestämma:** hur många rum får vi använda, och hur mycket får vi bygga om

### Skelettet i skogen

En kropp som redan finns i fiktionen.

- **Bra användning:** identitet, ursprungsbrott, något att bära hem som bevis
- **Varning:** hittas den för tidigt utan sammanhang blir den bara en kuriositet. Den behöver en ledtråd som gör den läsbar, alltså ett tecken, ett smycke, en tatuering eller ett dokument

### Segelbåten vid bojen

Isolering och tröskel. Två till fyra personer, ingen kan höra dem.

- **Bra användning:** platsen där det farligaste objektet ligger, eller där ett hemligt möte måste hållas
- **Varning:** kräver simning eller eka, alltså samma säkerhetsbegränsning som Södra Ovanan. Stängs 13.30

### Gubben i stubben och ljugarbänken

Vårt hintsystem, inbakat i fiktionen.

- **Mekanik:** gubben svarar på frågor. Han ljuger ibland. Spelarna måste tolka
- **Fördel:** vi kan mata in vilken hint som helst utan att bryta fiktionen, och vi kan skruva svårighetsgraden i realtid
- **Att bestämma:** vem bemannar honom, hur vet gästerna att han finns, och vad kostar ett svar
- **Regel:** gubben får ljuga men aldrig blockera. Om ett lag kommer tillbaka en andra gång ska svaret vara sant

### Klätternätet

Kroppsligt moment. Bra som prov eller som plats där något hänger utom räckhåll.

---

## Antipattern-lista

Saker vi bestämt att vi inte gör. Skrivs ut så att bra men fel idéer kan avvisas snabbt.

- Sifferkodlås som kräver räkning
- Korsord, anagram eller ordlekar som kräver att man läser mycket text
- Röda sillar och villospår
- Pussel som kräver att exakt en namngiven person är närvarande
- Pussel som kräver mobil, QR-kod, app eller nätuppkoppling
- Pussel efter 15.30
- Något som kräver simning efter 13.30
- Ett enda pussel som blockerar hela helgens framdrift
