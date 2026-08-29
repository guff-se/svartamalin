# Lagskatter

Intern text för Gustaf och agenten. Gäster läser inte detta. Tydlig prosa, ingen STYLE.md.

**Ord:** I den här filen är **skatt** alltid **skatt (treasure)** om inte `(tax)` står utskrivet. Lagens gömda föremål är skatt (treasure). Fromhetens piratskatt och Kosings arvssyndsskatt är skatt (tax). Ordlista: [`skatt.md`](skatt.md).

Parallellt spår med huvudstoryn. Gästtexten för jakten ligger i `content/intriger/crews/{id}.md`. Vem som jagar vem får **inte** stå samlat i någon gästfil.

Skatterna (treasure) är **inte** Malins kista. Kistan ljuger. Lagens skatter (treasure) är fysiska, festliga föremål som skutorna tar med sig. Se `content/copy/manifest_prep.md`.

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

Jakten startar från en **ingång**, se avsnittet Ingång. Inte från ransakning. **Varför** de jagar sitter i nästa avsnitt. Ingången är första steget, inte skälet.

---

## Varför de jagar

Första `##` i varje `crews/{id}.md` är oförrätt mot Malin plus kistan. Den får stå. Jaktstycket (andra `##`) är ett annat spår. Det får **inte** återberätta den jagade skutans första stycke.

Fällan: de fyra skutorna utan eget material har bara Malin-relationen som lagporträtt. Om jägaren beskriver målet med den texten blir jakten "Malin prejade dem, ta deras skatt" i stället för en konflikt mellan två skutor. Fromheten är undantaget: de skrev Frompiraterna, valet, omfördelning. Därför håller jakten mot dem. De andra behöver skäl som sitter i **skutans metod**, inte i hennes oförrätt mot dem.

### Skutornas metod (utan Malin)

Hur skutan tar. Det jägaren får använda när de beskriver *målet*. Inte vad hon gjorde mot dem.

| Skuta | Metod | Inte (det sitter i deras första `##`) |
|-------|-------|----------------------------------------|
| 1 Kurtisanen | Bordet. Ler, häller upp, behåller det bästa. Tar genom gästfrihet. | Att de är hennes skuta, att festen är deras för att hon skryter, att de bär in faten åt henne. |
| 2 Fördärvet | Värjan och aptiten. Bordar, ruinerar, slukar. Synden är frosseri. | Att de bordade samma skepp som hon, att hon tog lasten, "fördärv delas ojämnt", att de har en fordran på henne. |
| 3 Bortförklaringen | Munnen. En ursäkt för allt, en last de inte erkänt. Prata i stället för att betala. | De tre prejningarna (dimman, drevet, vinden), att hon sa att deras enda last är undanflykter. |
| 4 Fromheten | Böckerna. Frompiraterna: rena händer, rakt kors, blanka siffror. Stjäl inte, omfördelar. Val, piratskatt (tax), avlat. | "Mina frommaste rivaler", att valet är metoden mot *henne*. (Valet och Frompiraterna får användas. Hennes hån och hennes hamn får inte.) |
| 5 Gnället | Ljudet. Gnäller om heder, om andras last, om att ingen lyssnar. Vill tas på allvar. | Att hon bjöd in dem som orkester, att oväsendet är de, att gnället ska sönder hennes storhet. |

Jägaren får låta **sin egen** metod färga stycket. Kurtisanen tar vid bordet, Fördärvet bordar, Fromheten tar ut skatt (tax). Det är deras fil. Det de inte får göra är att sätta den jagades Malin-stycke som målbeskrivning.

### De fem skälen

Ingångarna oförändrade. Bara varför.

| Jagar | Mål | Skäl | Inte |
|-------|-----|------|------|
| 1 Kurtisanen | 2 Fördärvet | Värja och frosseri vid kurtisanbord. De ruinerar, slukar och kallar det rätt. Vid bordet tar värdinnan. Deras skatt är det de klamrar vid när magen redan är full. Ta den så frossarna sitter som gäster, inte som bordsgrannar med eget fat. | Fordran på Malin. Gemensam bordning. Hon tog deras last. |
| 2 Fördärvet | 3 Bortförklaringen | Bordning mot munväder. De har en ursäkt för allt och en last de aldrig erkänt. Prata är inte betalning. Ta skatten så förklaringarna tar slut. | De tre prejningarna. Hennes citat om undanflykter. Att ni betalar för *hennes* nöje. |
| 3 Bortförklaringen | 4 Fromheten | Ursäkt mot helgonfana. Frompiraterna stjäl inte, de omfördelar, de utlyser val. Omfördela då deras skatt. En from gömma är bara en till bortförklaring barken inte köper. | Valet mitt i *hennes* hamn. Att Fromheten tröttnat på *henne*. |
| 4 Fromheten | 5 Gnället | Blank bok mot oljud. De gnäller om heder och andras last, och sitter på en skatt (treasure) de inte fört in. Frompirater tar ut piratskatt (tax) som metod. Föremålet de tar är galeonens skatt (treasure), inte en avgift. Minst tre av galeonen plus smicker om skeppen (ingången) är hur jakten börjar, inte varför: skälet är obokförd last bakom gnäll, inte stormen i sig. | Inbjudna som orkester. Att hon kallade dem oväsen. |
| 5 Gnället | 1 Kurtisanen | Gnäll mot leende. De häller upp och behåller det bästa under duken. De kallar det gästfrihet. Gnället kallar det gömma. Ta skatten (treasure). Ett leende med kodlås är värre än ett ärligt gnäll. | Att de bär in faten åt henne. Att hamnen är *hennes*. Värdinnan som Malin. Varje kaviar en örfil från henne. |

### Test innan gästtext

1. Stryk varje mening om målet som fortfarande fungerar om skutan byts ut mot Malin. Om stycket kollapsar: fel skäl.
2. Om målbeskrivningen kan klistras in i den jagades första `##` utan att skava: du har stulit deras Malin-oförrätt. Skriv om.
3. Frompiraterna, valet, omfördelning får stå när Fromheten är **mål**. "Malins hamn" och hennes hån får inte.

Ingången läggs till efter skälet. Den ersätter inte skälet.

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
| **Gömmare** | den vars skatt det är | Social dörr: kort intrig i **den personens** `guests/`. Inte i lagfilen. Inte gömma-instruktion. | vem som jagar dem, cirkeln, jägarens revyformulering, att de ska gömma |
| **Jagare** | den som jagar skatten (N jagar N+1) | skatten de ska hitta, **varför** (skuta mot skuta, se Varför de jagar), plus ingången: ett konkret nästa steg | var skatten ligger, resten av spåret, vem som jagar *dem*, att det är en sluten cirkel, skatten de själva gömmer, den jagades Malin-oförrätt |

Gömmarna vet redan spåret. De ritade det. Påminnelsen finns så första steget faktiskt finns i spel före lördag 10.30: ett brev på plats, eller en person på skutan som kan släppa nästa steg.

Ingången får vara **fysisk** (ett föremål, en plats) eller **social** (en namngiven person och en metod, eller flera ombord på en gång). Social ingång: personen eller personerna sitter typiskt på gömmarnas skuta. De måste känna till nästa steg. Gömmarna får inte låsa dem ute från gömman, då dör spåret.

### Register

Verbatim är lagets formulering. Tom ruta: ingången har inte kommit in. Skriv **inte** gästtext förrän rutan är fylld.

| Skuta (gömmer) | Jagas av | Ingång, verbatim | Första steget | Lägger ut | Gästtext jagare | Gästtext gömmare |
|----------------|----------|------------------|---------------|-----------|-----------------|------------------|
| 1 Kurtisanen | 5 Gnället | Kurtisanens skatt kommer att vara lätt att hitta men svår att knäcka. För att knäcka koden behöver du en siffra var från alla kurisanens kaptener. | **Alla fem ombord** + en siffra var. Malin (`malintadaa`), Lösskägg (`petterwallberg`), Planka (`linneaappert`), Barnsben (`ulrikahammar`), Hurring (`jesperlindmarker`). Skatten är lättfunnen, koden är låset. Inte bara de fyra med Kapten i namnet. | ingen utläggning. De fem är dörren. Var och en ska veta sin siffra. Ingen stängs ute. | skriven, `crews/5.md` | skriven, de fem `guests/` |
| 2 Fördärvet | 1 Kurtisanen | Det ligger ett brev i soffbordet i vardagsrummet | brev i soffbordet, Storstugan | Fördärvet, fredag ca 17.30 | skriven, `crews/1.md` | ingen i lagfilen. De ritade spåret. |
| 3 Bortförklaringen | 2 Fördärvet | Kapten Klövers akilleshäl är högkvalitativ choklad som gör henne uppsluppen och totalt omdömeslös, oförmögen att bevara hemligheter. | **Kapten Klöver** (`johannabergman`) + högkvalitativ choklad | ingen utläggning. Klöver är dörren. Hon ska veta nästa steg. | skriven, `crews/2.md` | skriven, `guests/johannabergman.md` |
| 4 Fromheten | 3 Bortförklaringen | Kapten Hjärter är svag för smicker, så att om man fjäskar för honom så läcker han hemlighter direkt. | **Kapten Hjärter** (`jesperlejfjord`) + smicker/fjäsk. Köket. | ingen utläggning. Hjärter är dörren. Han ska veta nästa steg. | skriven, `crews/3.md` | skriven, `guests/jesperlejfjord.md` |
| 5 Gnället | 4 Fromheten | Vi har hört legenden om era magnifika skepp, är det sant att ni är de enda som överlevde stormen den natten? (minst tre av galeonen samlade, insmickrande) | **Minst tre av Galeonen Gnället** + raden om skeppen och stormen | ingen utläggning. De fem är dörren tillsammans. Minst tre. Var och en ska veta nästa steg. Ingen stängs ute. | skriven, `crews/4.md` | skriven, de fem `guests/` på Gnället |

Brevet i soffbordet är Fördärvets papper. Inte vår tryck. Inte rekvisitafil. Inte Q-4-boken, inte svärdfisken, inte dagboken. Samma rum som de tre, annan yta. Se [`platser.md`](platser.md).

Klöver sitter på Bortförklaringen. Hennes `roller/` säger redan att choklad lossar tungan (S-04: skvaller mot choklad). Ingången skärper det: högkvalitativ choklad, totalt omdöme. Önskad krock med S-04 och ätupplevelsen i S-05. Inte samma föremål som kristallfyrklövern. Jägarna (Fördärvet) tar med eller hittar chokladen. Inte vår tryck. Gästtext: jägarna i `crews/2.md`. Dörren i `guests/johannabergman.md`. Inte i barkens lagfil.

Kurtisanens dörrar är alla fem ombord, inklusive **Svarta Malin** (`malintadaa`). Inte bara de fyra med Kapten i namnet. Verbatimets "kurisanens" är lagets stavning, vi rättar den inte i registret. Social, fem dörrar: var och en bär en siffra till koden. Skatten göms som vanligt fredag 17.30 och ska vara lätt att hitta. Låset är jakten, inte gömmet. Koden och vilka siffror är gömmarnas. Vi trycker inte. Vi skriver inte in siffrorna. Barnsben är mullvad mot Bortförklaringen (två steg), inte mot jägarna Gnället. Sälja gömstället hjälper inte Gnället. Hennes siffra är en av fem. Malin är en av fem, inte ensam flaskhals. Play to lose om hon är upptagen. Gästtext: jägarna i `crews/5.md`. Dörren i de fem `guests/`. Inte i `crews/1.md`.

Hjärter sitter på Fromheten. Köket. Matansvar med Nykter. Verbatimets "hemlighter" är Gustafs stavning, vi rättar den inte i registret. Social: fjäsk lossar tungan, han läcker nästa steg. Inte ransakning. Inte samma föremål som kristallfyrklövern (den sitter hos Klöver). Krockar med S-01 (älskarjakten, privat vid grytorna), S-11 (korthajbordet vid kökskanten) och att han är Fulings mullvadskontakt. Önskat: jägarna (Bortförklaringen) hittar honom där han ändå står. Klöver sitter hos jägarna och spelar redan mot honom i S-11. Hon är inte enda vägen. Vilken som helst ombord på barken kan fjäska. Inte låsa honom ute från gömman. Play to lose om maten tar honom. Q-4 har två andra starter. Gästtext: jägarna i `crews/3.md`. Dörren i `guests/jesperlejfjord.md`. Inte i `crews/4.md`.

Galeonen Gnället är dörren tillsammans. Minst tre ombord samtidigt. Verbatim: "Vi har hört legenden om era magnifika skepp, är det sant att ni är de enda som överlevde stormen den natten?" Insmickrande. Stormen och de förlorade skeppen är galeonens ursprung, redan i flera `roller/` (Plåthorn, Babord, Rosing). Inte ett föremål. Inte ransakning. Inte samma sak som Dunkas svärd (det sitter kvar i S-05 som påhittad historia, inte som jaktens hävstång). Inte Malin-affären. Jägarna (Fromheten) samlar tre och säger raden. Vilken som helst ombord på Fromheten kan göra det. Ingen utläggning. Inte vår tryck. Inte låsa någon ute från gömman. Play to lose om de släpper när tre står där och raden sägs. Q-3, Q-4 och Q-5 har starter på galeonen: de tre kan vara bland de tre. Gästtext: jägarna i `crews/4.md`. Dörren i de fem `guests/` på Gnället. Inte i `crews/5.md`.

### När en ny ingång kommer in

1. Skriv in Gustafs / lagets formulering i [`egna.md`](egna.md) **först**.
2. Fyll verbatim och fysiskt steg i tabellen ovan.
3. Kolla krock mot [`platser.md`](platser.md) och mot personens övriga spår. Ingången får sitta i ett rum som redan har quest. Den får inte vara samma föremål som en questprop. Social ingång får krocka med personens sidequests. Den får inte kräva att hen stängs ute från gömman.
4. Uppdatera `vet` i [`fordelning.yaml`](fordelning.yaml) för **jagaren** (och gömmarens påminnelse).
5. Skriv in i jagarens `content/intriger/crews/{id}.md` enligt skrivreglerna nedan. STYLE.md.
6. Social dörr: skriv kort intrig i **den personens** `guests/{slug}.md`. Inte i lagfilen. Inte jägarens formulering. Inte vem som jagar dem. Inte gömma-instruktion i jaktstycket.
7. Produktion: vem lägger, när. Inte i [`produktion.md`](produktion.md):s propslista. Inte rekvisitafil om lagen trycker själva. Social: ingen utläggning, notera vem som är dörren.

Ingen gästtext förrän steg 1–4 är gjorda. Samma tvåstegsordning som resten av huvudstoryn.

### Skrivregler: jagarens lagfil

Gäller jaktstycket i `content/intriger/crews/{id}.md`. Inte individfilen. Inte gömmarens fil.

1. **Bara ingången.** Verbatimets substantiv (brev, soffbord, vardagsrum), den namngivna personen och metoden (Klöver, choklad), eller minst tre ombord plus en rad. Inte ledtråd två. Inte var skatten ligger. Inte hur lång kedjan är.
2. **En konkret nästa handling.** En plats, ett föremål, en person att bjuda, eller minst tre samlade plus en rad. Inte "hitta den någonstans på ön".
3. **Behåll vem de jagar.** Det stod redan. Ingången läggs *till*, den ersätter inte målet.
4. **Inte off-game om när jakten öppnar.** Skriv inte "spelet", "lördagen", eller att de ska vänta. För karaktären är jakten blodigt allvar. De läser intrigerna före helgen: skriv inte som om de redan öppnat brevet. Fredag utan jakt sägs i genomgången, inte i intrigtext.
5. **Inte cirkeln.** Inte vem som jagar dem. Inte att gömmarna "skickade in" något till oss.
6. **Inte ransakning och inte spelledning mot ransakning.** Peka på spåret. Genomgången säger att man lämnar det man råkar hitta.
7. **Inte andra intriger.** Inte quests, inte mullvad, inte romanser. Stycket ska stå för sig själv.
8. Röst: [`../intriger/STYLE.md`](../intriger/STYLE.md). Piratnamn. Ingen em dash.
9. **Skuta mot skuta, inte mot Malin.** Skälet är den jagade skutans metod (tabellen **Varför de jagar**). Inte deras första `##`. Jägarens egen metod får färga. Målets Malin-oförrätt får inte. Frompiraterna får användas när Fromheten är mål.

Testet: om stycket redan säger var skatten är, är det för långt. Stryk svaret. Lämna första steget. Andra testet: om målet fortfarande är hon, är skälet fel. Skriv om från tabellen.

Dåligt: "Fördärvet gömde skatten under bryggan. Titta i soffbordet, sen i gymmet, sen under bryggan."
Dåligt, skäl: "De bordade samma skepp som Svarta Malin, hon tog lasten, ni tar fordran." Det är deras första `##`, inte ett skäl att jaga skutan.
Bra, skäl: "Fördärvet tar med värja. Vid ert bord tar ni. Deras skatt är det de klamrar vid när glasen är fyllda. Ta den."
Bra, ingång: "Börja i Storstugan: det ligger ett brev i soffbordet i vardagsrummet. Läs det. Följ det."
Bra, social: "Börja med **Kapten Klöver**. Högkvalitativ choklad gör henne uppsluppen och totalt omdömeslös. Bjud henne. Följ det hon släpper."
Bra, social: "Börja med **Kapten Hjärter**. Smicker lossar tungan. Fjäska. Följ det han släpper."
Bra, social: "Samla minst tre av **Galeonen Gnället**. När ni står där, säg insmickrande: \"Vi har hört legenden om era magnifika skepp, är det sant att ni är de enda som överlevde stormen den natten?\" Följ det de släpper."

### Skrivregler: gömmarens dörr

Inte en egen `##` i lagfilen. Inte hela skutan.

**Social dörr:** kort intrig i `content/intriger/guests/{slug}.md` för **den personen**. Om hen utpressas, fjäskas, bjuds, eller om minst tre ombord samlas och smickras: släpp nästa ledtråd till skutans skatt. Inte vem som jagar. Inte ledtråd två. Inte jägarens punchlines till resten av laget. Play to lose.

Bra: "Om minst tre av **Galeonen Gnället** står samlade och någon säger insmickrande att de hört legenden om era magnifika skepp och frågar om ni är de enda som överlevde stormen den natten: släpp nästa ledtråd till galeonens skatt."
Dåligt: "Fromheten kommer fjäska. De jagar er skatt. Låt hela galeonen veta att Fromheten är jägarna."

**Fysisk dörr:** inte i jaktstycket. Gömmarna ritade spåret. Gömma vid ankomsten och koja fredad sägs i genomgången, inte i intrigtext.

Lagfilens jaktstycke bär bara skatten de ska *hitta*, plus ingången. Inte skatten de gömmer.

### Vad skutorna vet

Står i lagintrigen:

- vilken annan skuta de ska plundra
- första ledtråden till den jakten, när gömmarna skickat in den

Står i den personens gästfil, om hen är social dörr:

- att hen släpper nästa ledtråd om hen utpressas, fjäskas eller bjuds

De vet **inte** via intrigtext:

- att de ska gömma vid ankomsten (sägs i genomgången)
- att kojjen är fredad (sägs i genomgången)
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

**Off-regel:** den som råkar hitta en skatt hen inte jagar lämnar den. Jakten går via gåtor och uppdrag, inte ransakning. Sägs i genomgången. Se [`genomgang.md`](genomgang.md).

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
- Fromhetens ingång går via **Kapten Hjärter** och smicker. Krockar med S-01 (älskarjakten vid grytorna) och S-11 (korthajbordet). Önskat. Köket är platsen, inte en flaskhals för cryptexen.
- Gnällets ingång går via **minst tre ombord** och smicker om de förlorade skeppen och stormen. Krockar med galeonens ursprung (Plåthorn pratar gärna om sitt skepp). Önskat. Inte Dunkas svärd. Inte S-05. Inte Malin-affären.

Otillåtet:

- att skattjakten måste pausas för att ett pussel ska lösas
- att en deltagare blir flaskhals för båda spåren
- att gömma lagskatt i Malins kista, i sängen, eller bakom något som kräver mobil

---

## Gästtext

| Skuta | Fil | Jagar | Ingång i jaktstycket | Status |
|-------|-----|-------|----------------------|--------|
| 1 | `content/intriger/crews/1.md` | Fördärvet | ja, Fördärvets brev | skriven. Fysisk dörr, ingen i `guests/`. |
| 2 | `content/intriger/crews/2.md` | Bortförklaringen | ja, Klöver och choklad | skriven. Dörr: `guests/johannabergman.md` |
| 3 | `content/intriger/crews/3.md` | Fromheten | ja, Hjärter och smicker | skriven. Dörr: `guests/jesperlejfjord.md` |
| 4 | `content/intriger/crews/4.md` | Gnället | ja, minst tre och stormraden | skriven. Dörr: de fem `guests/` på Gnället |
| 5 | `content/intriger/crews/5.md` | Kurtisanen | ja, kaptenernas siffror | skriven. Dörr: de fem `guests/` (en siffra var) |

Poster i [`fordelning.yaml`](fordelning.yaml): id 1 till 5, beat B-11, jägarna. Bara skatten de ska hitta, plus ingången. Social dörr: id 100 Gnällets fem (minst tre + stormraden), 101 Hjärter, 102 Klöver, 103 kurtisanernas fem siffror. Inte gömma i lagfilen.

Hur texten skrivs: avsnitten **Varför de jagar** och **Ingång** ovan. STYLE.md punkt 23.

---

## Öppna frågor

- [ ] Vad är varje lags fysiska skatt? Fylls i här när de valt, eller på plats fredag.
- [x] Ingång från Fromheten, Gnället. Verbatim i registret. Gästtext skriven: jägarna i `crews/3.md` och `crews/4.md`. Dörr: Hjärter i `guests/jesperlejfjord.md`. Gnället: minst tre ombord + stormraden, de fem `guests/`. Dunkas svärd struket 2026-08-28.
- [ ] Ska en funnen skatt visas publikt (skryt) eller gömmas om (stöld)? Lämnas till lagen. Vi tvingar ingen redovisning.
- [ ] Får en skatt bära en ledtråd till cryptexen? Nej tills en quest i [`quests.md`](quests.md) säger ja, med bypass.
