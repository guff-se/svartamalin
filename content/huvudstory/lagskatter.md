# Lagskatter

Intern text för Gustaf och agenten. Gäster läser inte detta. Tydlig prosa, ingen STYLE.md.

Parallellt spår med huvudstoryn. Gästtexten för jakten ligger i `content/intriger/crews/{id}.md`. Vem som jagar vem får **inte** stå samlat i någon gästfil.

Skatterna är **inte** Malins kista. Kistan ljuger. Lagens skatter är fysiska, festliga föremål som skutorna tar med sig. Se `content/copy/manifest_prep.md`.

---

## Mekanik

Varje skuta gömmer **en** skatt. Varje skatt eftersöks av **en** annan skuta. Jakten är en cirkel, ett steg framåt:

```
1 → 2 → 3 → 4 → 5 → 1
```

Skuta N jagar skuta N+1:s skatt. Skuta 5 jagar skuta 1:s.

| Jagar | Skuta | Deras skatt göms av | Jagas av |
|-------|-------|---------------------|----------|
| 1 | **Korvetten Kurtisanen** | Kurtisanen | 5 Gnället |
| 2 | **Fregatten Fördärvet** | Fördärvet | 1 Kurtisanen |
| 3 | **Barken Bortförklaringen** | Bortförklaringen | 2 Fördärvet |
| 4 | **Fregatten Fromheten** | Fromheten | 3 Bortförklaringen |
| 5 | **Galeonen Gnället** | Gnället | 4 Fromheten |

Kolumnen **Jagas av** är bara för oss. Gästtexten talar om vilken skuta *de* jagar, inte vem som jagar *dem*. Cirkeln läcker om båda sidorna står i samma lagfil.

Detta är **inte** samma cirkel som förrädarna. Förrädare går två steg (`1 → 3 → 5 → 2 → 4 → 1`). Se [`forradare.yaml`](forradare.yaml). En mullvad som säljer sitt lags gömställe hjälper alltså inte sin uppdragsgivare direkt. Hen måste arbeta aktivt.

Jakten startar från en **ingång**, se nästa avsnitt. Inte från ransakning.

---

## Ingång: första ledtråden

Varje skattjakt har en **ingång**. Samma logik som quest-start i [`quests.md`](quests.md): första ledtråden, inte kapitlet.

Lagen som **gömmer** skatten skickar in ingången. Vi skriver den in i lagintrigen hos lagen som **jagar** den skatten. Utan ingång blir jakten ransakning, och det är förbjudet.

```
Gömmarna ritar spåret  →  skickar in första steget till oss  →  jägarna läser det i sin lagfil
```

Resten av spåret är gömmarnas. Vi trycker det inte. Vi skriver inte in var skatten ligger. Vi skriver inte in ledtråd två.

### Vem får vad

| Roll | Skuta | I gästtext | Inte i gästtext |
|------|-------|------------|-----------------|
| **Gömmare** | den vars skatt det är | kort påminnelse att lägga ut första steget vid ankomsten, med samma fysiska substantiv som de skickade in | vem som jagar dem, cirkeln, jägarens revyformulering |
| **Jagare** | den som jagar skatten (N jagar N+1) | ingången i jaktstycket: ett konkret nästa steg | var skatten ligger, resten av spåret, vem som jagar *dem*, att det är en sluten cirkel |

Gömmarna vet redan spåret. De ritade det. Påminnelsen finns så första steget faktiskt finns i spel före lördag 10.30: ett brev på plats, eller en person på skutan som kan släppa nästa steg.

Ingången får vara **fysisk** (ett föremål, en plats) eller **social** (en namngiven person och en metod). Social ingång: personen sitter typiskt på gömmarnas skuta. Hen måste känna till nästa steg. Gömmarna får inte låsa hen ute från gömman, då dör spåret.

### Register

Verbatim är lagets formulering. Tom ruta: ingången har inte kommit in. Skriv **inte** gästtext förrän rutan är fylld.

| Skuta (gömmer) | Jagas av | Ingång, verbatim | Första steget | Lägger ut | Gästtext jagare | Gästtext gömmare |
|----------------|----------|------------------|---------------|-----------|-----------------|------------------|
| 1 Kurtisanen | 5 Gnället | Kurtisanens skatt kommer att vara lätt att hitta men svår att knäcka. För att knäcka koden behöver du en siffra var från alla kurisanens kaptener. | **Alla fem ombord** + en siffra var. Malin (`malintadaa`), Lösskägg (`petterwallberg`), Planka (`linneaappert`), Barnsben (`ulrikahammar`), Hurring (`jesperlindmarker`). Skatten är lättfunnen, koden är låset. Inte bara de fyra med Kapten i namnet. | ingen utläggning. De fem är dörren. Var och en ska veta sin siffra. Ingen stängs ute. | skriven, `crews/5.md` | påminnelse skriven, `crews/1.md` |
| 2 Fördärvet | 1 Kurtisanen | Det ligger ett brev i soffbordet i vardagsrummet | brev i soffbordet, Storstugan | Fördärvet, fredag ca 17.30 | skriven, `crews/1.md` | påminnelse skriven, `crews/2.md` |
| 3 Bortförklaringen | 2 Fördärvet | Kapten Klövers akilleshäl är högkvalitativ choklad som gör henne uppsluppen och totalt omdömeslös, oförmögen att bevara hemligheter. | **Kapten Klöver** (`johannabergman`) + högkvalitativ choklad | ingen utläggning. Klöver är dörren. Hon ska veta nästa steg. | skriven, `crews/2.md` | påminnelse skriven, `crews/3.md` |
| 4 Fromheten | 3 Bortförklaringen | | | | väntar | väntar |
| 5 Gnället | 4 Fromheten | | | | väntar | väntar |

Brevet i soffbordet är Fördärvets papper. Inte vår tryck. Inte rekvisitafil. Inte Q-4-boken, inte svärdfisken, inte dagboken. Samma rum som de tre, annan yta. Se [`platser.md`](platser.md).

Klöver sitter på Bortförklaringen. Hennes `roller/` säger redan att choklad lossar tungan (S-04: skvaller mot choklad). Ingången skärper det: högkvalitativ choklad, totalt omdöme. Önskad krock med S-04 och ätupplevelsen i S-05. Inte samma föremål som kristallfyrklövern. Jägarna (Fördärvet) tar med eller hittar chokladen. Inte vår tryck.

Kurtisanens dörrar är alla fem ombord, inklusive **Svarta Malin** (`malintadaa`). Inte bara de fyra med Kapten i namnet. Verbatimets "kurisanens" är lagets stavning, vi rättar den inte i registret. Social, fem dörrar: var och en bär en siffra till koden. Skatten göms som vanligt fredag 17.30 och ska vara lätt att hitta. Låset är jakten, inte gömmet. Koden och vilka siffror är gömmarnas. Vi trycker inte. Vi skriver inte in siffrorna. Barnsben är mullvad mot Bortförklaringen (två steg), inte mot jägarna Gnället. Sälja gömstället hjälper inte Gnället. Hennes siffra är en av fem. Malin är en av fem, inte ensam flaskhals. Play to lose om hon är upptagen. Gästtext: jägarna i `crews/5.md`, göm-påminnelse i `crews/1.md`. Inte omskriven i den här omgången.

### När en ny ingång kommer in

1. Skriv in Gustafs / lagets formulering i [`egna.md`](egna.md) **först**.
2. Fyll verbatim och fysiskt steg i tabellen ovan.
3. Kolla krock mot [`platser.md`](platser.md) och mot personens övriga spår. Ingången får sitta i ett rum som redan har quest. Den får inte vara samma föremål som en questprop. Social ingång får krocka med personens sidequests. Den får inte kräva att hen stängs ute från gömman.
4. Uppdatera `vet` i [`fordelning.yaml`](fordelning.yaml) för **jagaren** (och gömmarens påminnelse).
5. Skriv in i jagarens `content/intriger/crews/{id}.md` enligt skrivreglerna nedan. STYLE.md.
6. Skriv kort påminnelse i gömmarens lagfil. Inte jägarens formulering. Inte vem som jagar dem. Social: personen på skutan ska kunna släppa nästa steg, inte stängas ute.
7. Produktion: vem lägger, när. Inte rekvisita om lagen trycker själva. Social: ingen utläggning, notera vem som är dörren.

Ingen gästtext förrän steg 1–4 är gjorda. Samma tvåstegsordning som resten av huvudstoryn.

### Skrivregler: jagarens lagfil

Gäller jaktstycket i `content/intriger/crews/{id}.md`. Inte individfilen. Inte gömmarens fil.

1. **Bara ingången.** Verbatimets substantiv (brev, soffbord, vardagsrum) eller den namngivna personen och metoden (Klöver, choklad). Inte ledtråd två. Inte var skatten ligger. Inte hur lång kedjan är.
2. **En konkret nästa handling.** En plats, ett föremål, eller en person att bjuda. Inte "hitta den någonstans på ön".
3. **Behåll vem de jagar.** Det stod redan. Ingången läggs *till*, den ersätter inte målet.
4. **Jakten öppnar på lördagen.** De läser intrigerna före helgen. Skriv inte som om de redan öppnat brevet. Fredag är fortfarande utan jakt.
5. **Inte cirkeln.** Inte vem som jagar dem. Inte att gömmarna "skickade in" något till oss.
6. **Inte ransakning och inte spelledning mot ransakning.** Peka på spåret. Genomgången säger att man lämnar det man råkar hitta.
7. **Inte andra intriger.** Inte quests, inte mullvad, inte romanser. Stycket ska stå för sig själv.
8. Röst: [`../intriger/STYLE.md`](../intriger/STYLE.md). Piratnamn. Ingen em dash.

Testet: om stycket redan säger var skatten är, är det för långt. Stryk svaret. Lämna första steget.

Dåligt: "Fördärvet gömde skatten under bryggan. Titta i soffbordet, sen i gymmet, sen under bryggan."
Bra: "Målet är **Fregatten Fördärvet**s skatt. Börja i Storstugan: det ligger ett brev i soffbordet i vardagsrummet. Läs det. Följ det."
Bra, social: "Målet är **Barken Bortförklaringen**s skatt. Börja med **Kapten Klöver**. Högkvalitativ choklad gör henne uppsluppen och totalt omdömeslös. Bjud henne. Följ det hon släpper."

### Skrivregler: gömmarens lagfil

1. Behåll att de gömmer vid ankomsten. Kojen fredad.
2. En mening om **första steget**, med samma substantiv som de skickade in. Fysiskt: lägg ut det när skatten går ner. Socialt: personen på skutan ska veta nästa steg, inte stängas ute från gömman.
3. Inte "ni jagas av Kurtisanen". Inte "cirkeln". Inte jägarens punchlines.
4. Inte hur resten av spåret ser ut. De vet det. Vi upprepar det inte.

### Vad skutorna vet

Står i lagintrigen:

- att de har en egen skatt att gömma vid ankomsten
- vilken annan skuta de ska plundra
- första ledtråden till den jakten, när gömmarna skickat in den
- att kojjen är fredad (sovplatser är inte spel)
- gömmarna: att de ska lägga ut sitt första steg när skatten går ner, eller (social ingång) att personen på skutan ska kunna släppa nästa steg

De vet **inte**:

- vem som jagar deras skatt
- att jakten är en sluten cirkel
- att det finns en mullvad i laget
- att Malins kista är tom
- var den jagade skatten ligger, eller ledtråd två och framåt

---

## Tid och plats

| När | Vad |
|-----|-----|
| Fredag ca 17.30 | Enda gömningsfönstret. Praktisk placering, inte pussel. Första steget i spåret läggs ut i samma veva. Fredag är fortfarande utan story-mekanik. |
| Lördag 10.30 | Jakten öppnar, samtidigt som cryptexen. Spåren får krocka. |
| Lördag 13.30 | Södra Ovanan stänger. Skatt därute måste upp före dess, eller vara förlorad till brunchen. |
| Efter 15.30 | Inga nya gömmen, ingen ny jaktlogik. En redan funnen skatt får bäras, visas, stjälas tillbaka med kroppen, inte med ledtrådar. |

Gömställe: hela ön utom sovplatser och stugor. Se [`platser.md`](platser.md). Segelbåten, svärdfiskens gap, Gubben, Gumman, Södra Ovanan och verkstaden är lagliga och dramatiska. Malins kista är **inte** ett gömställe för lagskatt.

**Off-regel:** den som råkar hitta en skatt hen inte jagar lämnar den. Jakten går via gåtor och uppdrag, inte ransakning. Sägs i genomgången. Se [`spelledning.md`](spelledning.md).

---

## Register: vad, var, vem

Fylls i när lagen valt skatt och, efter fredagen, när vi vet var den ligger. Tom ruta betyder att vi inte vet än.

| Skuta | Vad skatten är | Gömd var | Gömdes av (slug) | Funnen av | När funnen | Nu hos |
|-------|----------------|----------|------------------|-----------|------------|--------|
| 1 Kurtisanen | | | | | | |
| 2 Fördärvet | | | | | | |
| 3 Bortförklaringen | | | | | | |
| 4 Fromheten | | | | | | |
| 5 Gnället | | | | | | |

Lagen tar med skatten själva. Vi dikterar inte föremålet. Krav utåt: fysiskt, gömbart, festligt, tråkigt att förlora, gärna något som förhöjer festen om det byter ägare.

---

## Utfall

Ingen poängställning. Att bära hem den jagade skatten är segern. Att förlora sin egen är skammen. Stöld tillbaka är tillåten. Drama vinner om jakt och huvudstory krockar.

En funnen skatt får användas som muta, vad, pusselnyckel eller offentlig förnedring. Den får **inte** vara enda vägen in i Malins kista. Kistan har sin egen kedja i [`kanon.md`](kanon.md).

Om ingen hittar någon skatt: helgen går ändå. Skattjakten är inte tändningen. Kasserad tändning i [`slutstriden.md`](slutstriden.md): "skatterna redovisas och någon saknas."

---

## Kollision med huvudstoryn

Tillåtet och önskvärt:

- sälja sitt lags gömställe mot en ledtråd till cryptexen
- gömma en ledtråd *i* en lagskatt (då måste skatten upp före 15.30, och bypass finnas)
- mullvaden läcker, skyddar eller stjäl enligt [`forradare.yaml`](forradare.yaml)
- en skatt används som muta i en romans eller ett fiendskap
- Bortförklaringens ingång går via **Kapten Klöver** och choklad. Krockar med S-04 (skvaller mot choklad) och S-05 (ätupplevelsen). Önskat.
- Kurtisanens ingång går via **alla fem ombord**, inklusive Malin, och en siffra var. Skatten är lättfunnen, koden är låset. Barnsben är mullvad mot Bortförklaringen, inte mot jägarna. Social jakt, inte ransakning. Önskat. Malin är en dörr bland fem, inte ensam flaskhals.

Otillåtet:

- att skattjakten måste pausas för att ett pussel ska lösas
- att en deltagare blir flaskhals för båda spåren
- att gömma lagskatt i Malins kista, i sängen, eller bakom något som kräver mobil

---

## Gästtext

| Skuta | Fil | Jagar | Ingång i jaktstycket | Status |
|-------|-----|-------|----------------------|--------|
| 1 | `content/intriger/crews/1.md` | Fördärvet | ja, Fördärvets brev | skriven. Göm-påminnelse: varje kapten ombord bär en siffra |
| 2 | `content/intriger/crews/2.md` | Bortförklaringen | ja, Klöver och choklad | skriven |
| 3 | `content/intriger/crews/3.md` | Fromheten | nej, väntar | skriven, jakt utan ingång. Göm-påminnelse: Klöver |
| 4 | `content/intriger/crews/4.md` | Gnället | nej, väntar | skriven, jakt utan ingång |
| 5 | `content/intriger/crews/5.md` | Kurtisanen | ja, kaptenernas siffror | skriven, jakt med ingång. Göm-påminnelse i `crews/1.md`: skriven |

Poster i [`fordelning.yaml`](fordelning.yaml): id 1 till 5, beat B-11. Id 1:s `vet` bär Fördärvets ingång *och* påminnelsen att varje kapten ombord bär en siffra (alla fem, inklusive Malin). Id 2:s `vet` bär påminnelsen att lägga brevet *och* Bortförklaringens ingång (Klöver, choklad). Id 3:s `vet` bär påminnelsen att Klöver är dörren. Id 5:s `vet` bär Kurtisanens ingång (kaptenernas siffror). Fromheten och Gnället som gömmare väntar fortfarande.

Hur texten skrivs: avsnittet **Ingång** ovan. STYLE.md punkt 23.

---

## Öppna frågor

- [ ] Vad är varje lags fysiska skatt? Fylls i här när de valt, eller på plats fredag.
- [ ] Ingång från Fromheten, Gnället. Skrivs in här verbatim, sedan i jagarens lagfil.
- [ ] Ska en funnen skatt visas publikt (skryt) eller gömmas om (stöld)? Lämnas till lagen. Vi tvingar ingen redovisning.
- [ ] Får en skatt bära en ledtråd till cryptexen? Nej tills en quest i [`quests.md`](quests.md) säger ja, med bypass.
