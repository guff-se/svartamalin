# Klarhetsgranskning — gästintriger (guests/*.md)

Intern granskning, inte gästcopy. Se `content/intriger/README.md` för format. **Att köra om:** [`clarity-review.md`](clarity-review.md).

Kördes i fyra omgångar. **Runda 4 är den relevanta bilden:** gästfil + lagfil + `intriger_intro.md` + roster + undantag. Äldre rundor är arkiv.

## Runda 4 — gästfil + lag + intro + undantag (aktuell bild)

**Datum:** 2026-08-28.

**Metod:** 23 isolerade agenter, en per gäst. Varje agent fick:
1. sin egen `guests/{slug}.md` (YAML och `{slug:…}` osynliga),
2. sitt eget lags `crews/{crew_id}.md`,
3. `content/copy/intriger_intro.md`,
4. roster med lagnamn och piratnamn, eget namn/lag utmärkt.

Undantag i prompten (flagga inte): Gubben i stubben / Gumman på udden; dörrar till lagskatter; Salmonellahavet och Ovanan. Extra check: tom kunskap (`du vet` utan innehåll).

### Resultat

| Betyg | Antal | Runda 3 → Runda 4 |
|---|---|---|
| 🟢 Grönt | 2 | 0 → 2 |
| 🟡 Gult | 16 | 22 → 16 |
| 🔴 Rött | 5 | 1 → 5 |

Fler röda än runda 3 eftersom tom kunskap som läsaren ska agera på nu är rött, inte gult. Undantagen tog bort Gubben/Gumman, Ovanan, Salmonellahavet och lagskattdörrarna från termlistorna.

### 🔴 Rött (5)

| Gäst | Tom kunskap som blockerar | Åtgärd |
|---|---|---|
| malintadaa | «Du har redan den enda älskare som räknas» utan namn. Dunka är avledning. | Namnge, eller skriv att spelaren väljer/improviserar. |
| navidmodiri | «Du vet redan … vem hon egentligen väljer» (Barnsben). Säg eller spara. | Skriv vem hon väljer, i *hans* fil. |
| linneaekbom | Snäckan har hört vad Nykter «egentligen fick höra», men inte vad. Avslöja eller spara. | Skriv vad som sades (eller att det var tystnad). |
| fabianmacklin | «Du vet vad Barnsben vet» om Rötägg, utan innehållet. Plus Dunkas svaga punkt att viska till Kosing, utan var den sitter. | Lyft in vad Barnsben minns, och att svärdet är kopian/svaga punkten. |
| jesperlindmarker | Sälj «en gammal, aldrig bekräftad historia om Svarta Malin» i liggaren, utan vad raden säger. | Skriv en mening om vad raden påstår, eller att Kuling köper osäkerheten. |

### Per gäst

| Slug | Piratnamn | Lag | Betyg | Termer | Tom kunskap |
|---|---|---|---|---|---|
| josefinlowing | Kapten Kuling | Fördärvet | 🟢 | none | none |
| ulrikahammar | Kapten Barnsben | Kurtisanen | 🟢 | Dövers workshop (smak) | none |
| alexandrapalmquist | Kapten Babord | Gnället | 🟡 | Dövers workshop; gården; Barnsbens brev/plan | none |
| amandamungsgard | Kapten Kosing | Fromheten | 🟡 | avlatsbrev | none |
| edvinthungren | Kapten Rötägg | Gnället | 🟡 | Paradisets ö; din workshop | none |
| elinmartensson | Kapten Plåthorn | Gnället | 🟡 | Storstugan | none |
| gustaftadaa | Löjtnant Spader | Fördärvet | 🟡 | Plåthorns plåthorn; stulen vals | none |
| hampuslindblad | Kapten Blåskägg | Bortförklaringen | 🟡 | dörren bakom medvetandet | none |
| jesperlejfjord | Kapten Hjärter | Fromheten | 🟡 | Storstugan; Katten Felix | none |
| johannabergman | Kapten Klöver | Bortförklaringen | 🟡 | samlaren; den lättkränkte | none |
| josefinansund | Kapten Frodig | Bortförklaringen | 🟡 | Paradisets ö | none |
| linneaappert | Kapten Planka | Kurtisanen | 🟡 | sirenerna; silverryktet; vem du var innan Planka; honnörsbordet; dörren bakom medvetandet | none |
| louisevonbahr | Kapten Fuling | Fördärvet | 🟡 | silverrykte | none |
| ludvigvonbahr | Kapten Dunka | Gnället | 🟡 | svärdets påhittade historia | historien du berättar om och om igen (innehållet saknas) |
| minervalowgren | Kapten Prygel | Fromheten | 🟡 | hans kapten | none |
| minimacklin | Kapten Blodig | Fördärvet | 🟡 | Piratpulver; Paradisets ö | none |
| petterwallberg | Kapten Lösskägg | Kurtisanen | 🟡 | jubilaren; de fyra skäggens historier | historier du kan utantill, utan innehåll |
| viktoransund | Kapten Rödskägg | Fromheten | 🟡 | gymmet; Paradisets ö | none |
| malintadaa | Svarta Malin | Kurtisanen | 🔴 | den hemliga älskaren; Kulings last | älskarens namn |
| navidmodiri | Kapten Döver | Fördärvet | 🔴 | krumelurpillret; jubilarens älskare; rötan mot Rötägg | vem Barnsben väljer |
| linneaekbom | Kapten Rosing | Gnället | 🔴 | gymmet; krumelurburk; skymningens piller; Skäggens Konung | vad Nykter egentligen fick höra |
| fabianmacklin | Kapten Nykter | Bortförklaringen | 🔴 | Dunkas svärdshistoria | vad Barnsben vet om Rötägg; var Dunkas svaga punkt sitter |
| jesperlindmarker | Kapten Hurring | Kurtisanen | 🔴 | piratval | liggarraden om Malin |

### Mönster

**Tom kunskap (fix i den personens fil):**
1. Malins namnlösa älskare.
2. Barnsbens val, läckt till Döver utan innehållet.
3. Vad Nykter hörde, läckt till Rosing via snäckan.
4. Vad Barnsben vet om Rötägg, och Dunkas svaga punkt, hos Nykter.
5. Hurrings liggarrad om Malin.

**Oförklarade mentions som fortfarande är värda en rad** (inte undantag, inte kistan):
- `krumelurburk` / skymningens piller hos Rosing (förklaras hos Barnsben, inte hos henne).
- Silveryktets *innehåll* hos Fuling och Planka.
- `dörren bakom medvetandet` (Blåskägg, Planka).
- `Piratpulver` (Blodig).
- `Paradisets ö`, `Storstugan`, `gymmet`, `gården`, `honnörsbordet` som fysiska platser.
- `avlatsbrev` hos Fromheten.
- Skäggvadet: vem som är samlaren vs den lättkränkte (Klöver).
- Dunkas påhittade svärdshistoria (han ska kunna köra igång den).

**Inte buggar:** Malins låsta kista / «den som känner historien». Lagskattdörrar. Gubben/Gumman. Salmonellahavet, Ovanan.

### Rekommendation

Skriv de fem röda tom-kunskap-luckorna först. Därefter en rad där ett föremål från *någon annans* fil nämns (krumelurpiller, plåthorn, silverykte). Platser som någon ska gå till (`Storstugan`, `gymmet`) kan vara landmärken på plats.

---

## Runda 3 — gästfil + lagintrig + roster (arkiverad)


**Datum:** 2026-08-28.

**Metod:** 23 isolerade agenter, en per gäst. Varje agent fick:
1. sin egen `guests/{slug}.md` (YAML och `{slug:…}` räknas som osynliga för gästen),
2. sitt eget lags `crews/{crew_id}.md`,
3. en roster med de 5 lagnamnen och alla 23 piratnamn + lag, med läsarens eget namn och lag utmärkt, och instruktionen att detta är kända medgäster.

Ingen `roller/`-fil, ingen `copy/`, ingen worldbuilding utöver rostern. Agenterna fick inte läsa några andra filer. Uppdraget: kan läsaren förstå vad som pågår, och vilka begrepp/föremål/händelser nämns som om läsaren redan visste?

### Resultat

| Betyg | Antal | Runda 2 → Runda 3 |
|---|---|---|
| 🟢 Grönt | 0 | 20 → 0 |
| 🟡 Gult | 22 | 3 → 22 |
| 🔴 Rött | 1 | 1 → 1 (`malintadaa`, oförändrat) |

Noll grönt beror till stor del på att den här rundan **inte** ger `roller/` eller sajtens brödtext. Många gula flaggor är världsnamn (`Salmonellahavet`, `Ovanan`, `jubilaren`) som `content/copy/intriger_intro.md` redan täcker för en verklig gäst. De är med i tabellen för spårbarhet, men är inte samma sorts lucka som ett oförklarat föremål i *den här* personens handling.

### 🔴 Rött: malintadaa

**Kvarstående blockerare:** Textens centrala instruktion — dölj identiteten på din enda riktiga älskare ("honom", "den munnen") från hamnen, medan Kapten Dunka används som synlig avledning — går inte att agera på. Älskaren namnges aldrig, varken i gästtexten, lagintrigen eller rostern.

Övriga flaggor hos Malin (arvssyndsskatt, kod/siffra, kista, Fördärvets fat) är samma mönster som hos resten av Kurtisanen, inte unika för henne. Det som gör betyget rött är den namnlösa älskaren.

**Åtgärd:** Antingen namnge älskaren någonstans läsaren har tillgång till, eller skriv om avsnittet så att det går att spela utan ett namn (t.ex. att identiteten är okänd även för spelaren och ska väljas/improviseras på plats).

### Per gäst

| Slug | Piratnamn | Lag | Betyg | Termer som behöver förklaring |
|---|---|---|---|---|
| malintadaa | Svarta Malin | Kurtisanen | 🔴 | den hemliga älskaren; arvssyndsskatt; Korvetten Kurtisanens kod; siffran; skatten; kistan; Salmonellahavet; Ovanan; skiffen i dimman; Kapten Kulings last; Fördärvets fat |
| navidmodiri | Kapten Döver | Fördärvet | 🟡 | krumelurpillret; vem Kapten Barnsben väljer; jubilarens hemliga älskare; sanningsserum |
| alexandrapalmquist | Kapten Babord | Gnället | 🟡 | Dövers workshop; Malins kista; historien; Barnsbens brev |
| jesperlindmarker | Kapten Hurring | Kurtisanen | 🟡 | piratval; koden; siffran; kistan; skatten; Ovanan; Salmonellahavet |
| edvinthungren | Kapten Rötägg | Gnället | 🟡 | din workshop; Paradisets ö; Salmonellahavet; Svarta Malins kista |
| josefinlowing | Kapten Kuling | Fördärvet | 🟡 | Gubben i stubben; Gumman på udden |
| elinmartensson | Kapten Plåthorn | Gnället | 🟡 | Storstugan; kistan; klenoden |
| linneaappert | Kapten Planka | Kurtisanen | 🟡 | Gubben i stubben; Gumman på udden; Ovanan; kistan; skatten; koden; siffran; oljan från sirenerna; honnörsbordet; Fördärvets fat; silverryktet |
| viktoransund | Kapten Rödskägg | Fromheten | 🟡 | gymmet; bladet; loggen; Malins kista; valsedlar; avlatsbrev; Gnällets gömda föremål; Ovanan |
| ulrikahammar | Kapten Barnsben | Kurtisanen | 🟡 | Ovanan; Salmonellahavet; Korvetten Kurtisanens kod; siffran; workshop |
| minervalowgren | Kapten Prygel | Fromheten | 🟡 | föremålet (Gnällets skatt); din lilla kortlek; avlatsbrev |
| johannabergman | Kapten Klöver | Bortförklaringen | 🟡 | Salmonellahavet; Barken Bortförklaringens skatt; nästa ledtråd; den lättkränkte; samlaren |
| gustaftadaa | Löjtnant Spader | Fördärvet | 🟡 | Plåthorns plåthorn; Salmonellahavet; hur historien ger åtkomst till kistan |
| amandamungsgard | Kapten Kosing | Fromheten | 🟡 | Ovanan; den öde ön; Malins kista; avlatsbrev; jubilaren; Gnällets föremål |
| jesperlejfjord | Kapten Hjärter | Fromheten | 🟡 | Storstugan; Ovanan; Katten Felix; angivelsen mot Kapten Hurring; Hurrings liggare; avlatsbrev; valsedlar; Fregatten Fromhetens skatt; ledtrådar till skatten; Malins låsta kista; Gnällets föremål |
| hampuslindblad | Kapten Blåskägg | Bortförklaringen | 🟡 | dörren bakom medvetandet; Salmonellahavets fasa; dimman |
| josefinansund | Kapten Frodig | Bortförklaringen | 🟡 | Gubben i stubben; Gumman på udden; Salmonellahavets fasa; helgonfana; klenod |
| ludvigvonbahr | Kapten Dunka | Gnället | 🟡 | Galeonen Gnällets skatt; nästa ledtråd |
| minimacklin | Kapten Blodig | Fördärvet | 🟡 | Piratpulver; kapitulationen; Storstugan; Paradisets ö; den öde ön; kistan |
| petterwallberg | Kapten Lösskägg | Kurtisanen | 🟡 | Ovanan; Salmonellahavet; jubilaren; koden (din siffra) |
| louisevonbahr | Kapten Fuling | Fördärvet | 🟡 | silverrykte; Salmonellahavet |
| fabianmacklin | Kapten Nykter | Bortförklaringen | 🟡 | Salmonellahavets fasa; helgonfana; klenod; Fromhetens val; arvssyndsskatt; Dunkas svärdshistoria; Dunkas svaga punkt; vad Barnsben vet om Rötägg |
| linneaekbom | Kapten Rosing | Gnället | 🟡 | snäckan; Skäggens Konung; skymningens piller; krumelurburk; vad snäckan hörde om Nykters kväll; plåthornet |

### Mönster — verkliga luckor (fix i gästtexten)

Saker som nämns som om läsaren redan visste, och som behövs för att spela *den* personens handling. Inte löst av rostern.

1. **Namnlös älskare (`malintadaa`).** Enda röda. Se ovan.
2. **Barnsbens piller/burk läcker oförklarat till andra.** `ulrikahammar` förklarar krumelurburken och skymningens piller fint i *sin* fil. `navidmodiri` får `krumelurpillret` utan förklaring; `linneaekbom` får `krumelurburk` + `skymningens piller` utan förklaring. Döver sägs dessutom redan veta vem Barnsben väljer, men valet står inte i hans text.
3. **Gubben i stubben / Gumman på udden.** `linneaappert`, `josefinlowing`, `josefinansund` ska söka halvor där. Ingen av de tre filerna (eller lagfilen) säger vad platserna är. Sannolikt fysiska landmärken på festplatsen — då räcker en rad i texten ("stubben vid …", "udden mot …") eller att de syns på kartan.
4. **Silveryktets innehåll.** `louisevonbahr` sådde det och ska kunna plantera om det; `linneaappert` ska tysta det. Ingen av filerna säger vad ryktet påstår om vem Planka var innan hon blev Planka.
5. **Egen lagskatt + "nästa ledtråd".** Social dörr: den jagade ska släppa en ledtråd under press. `ludvigvonbahr`, `johannabergman` och `jesperlejfjord` får instruktionen men inte vad skatten är eller vilken ledtråd de bär. De kan spela "jag släpper något" bara om de har något att släppa — antingen en konkret ledtråd i *deras* text, eller ett tydligt "du vet inte vad de är ute efter, improvisera en lös tunga".
6. **Rosings snäcka.** `linneaekbom` behandlar snäckan som redan ägd och redan hörd (`vad Nykter egentligen fick höra`). Varken vad snäckan är eller vad den hörde står i hennes fil.
7. **Kurtisanens siffra.** Alla fem på Kurtisanen (`malintadaa`, `jesperlindmarker`, `ulrikahammar`, `linneaappert`, `petterwallberg`) får "du bär en siffra … en av fem" utan siffran. Om siffran är rekvisita på plats: säg det. Om den ska sitta i texten: skriv den.

### Mönster — jakt som är tänkt att vara ofullständig

Inte buggar, men agenterna flaggade dem konsekvent:

- **Malins låsta kista / "den som känner historien".** Alla fem lag får samma öppning. Ingen ska veta *hur* kistan öppnas i förväg. Det är huvudjakten.
- **Motståndarlagets skatt** (Fördärvets fat, Bortförklaringens byte, Fromhetens klenod/helgonfana, Gnällets föremål, Kurtisanens klenod). Ingången står i lagfilen; själva föremålet ska hittas. En halv mening om *sorten* (fat, kodlås, fana, …) räcker oftast — flera lagfiler har redan det.
- **Piratval / valsedlar / avlatsbrev** hos Fromheten. Plattformen är tydlig; rekvisitan nämns som om den redan fanns i handen.

### Mönster — världsnamn som copy redan täcker

Flaggades av många agenter eftersom den här rundan inte gav `content/copy/`. En verklig gäst ser `intriger_intro.md` först. Räkna inte dessa som textfel i `guests/` om copy ligger kvar:

`Salmonellahavet`, `Ovanan`, `jubilaren` (Malins fest).

Platser som *inte* står i introt och som någon faktiskt ska gå till: `Storstugan`, `gymmet`, `Paradisets ö`, `den öde ön`, `honnörsbordet`. Antingen landmärken på plats, eller en rad mer i den text som skickar dit.

### Rekommendation efter runda 3

Gäst + lag + roster räcker för *vem man är och vad man vill*. Det som fortfarande kräver skrivning:

1. **`malintadaa`:** namnge eller släpp den hemliga älskaren.
2. **Lyft in en rad** där ett föremål/detalj från *någon annans* fil nämns i din: krumelurpiller, plåthorn, Dövers workshop, silveryktets innehåll, snäckan.
3. **Gömmor och siffror:** Gubben/Gumman, Kurtisanens siffra, "nästa ledtråd" till egen skatt — antingen konkret i texten, eller ett uttryckligt "det här får du på plats".
4. **Inte:** förklara Malins kista, motståndarens skatt, eller världsnamn som redan står i copy.

---

## Runda 2 — med lagintrig, roster och egen roll (arkiverad)

**Metod:** 24 isolerade agenter, en per gäst. Varje agent fick gästfil, lagfil, `roller/{slug}.md`, och roster.

### Resultat då

| Betyg | Antal | Runda 1 → Runda 2 |
|---|---|---|
| 🟢 Grönt | 20 | 0 → 20 |
| 🟡 Gult | 3 | 23 → 3 |
| 🔴 Rött | 1 | 1 → 1 (oförändrat) |

Gult då: `linneaappert` (Gubben i stubben, Gumman på udden); `linneaekbom` (krumelurburk, skymningens piller); `navidmodiri` (krumelurpillret). Rött: `malintadaa` (namnlös älskare). De tre gula och det röda är samma luckor som runda 3 fortfarande visar — `roller/` löste "vem är jag", inte de här referenserna.

---

## Runda 1 — helt isolerad läsning (arkiverad)

**Metod:** bara renderad brödtext för egen `guests/{slug}.md`. Ingen lagfil, ingen roster, ingen roll.

| Betyg | Antal | Gäster |
|---|---|---|
| 🟢 Grönt | 0 | — |
| 🟡 Gult | 23 | alla utom malintadaa |
| 🔴 Rött | 1 | malintadaa |

Noll grönt var mest artefakt av att inte ge läsaren lag, namnlista eller egen bakgrund. Skutnamn och kaptener utan roster såg ut som luckor; runda 2 visade att de inte var det.
