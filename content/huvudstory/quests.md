# Queststories

Intern text för Gustaf och agenten. Gäster läser inte detta. Tydlig prosa, ingen STYLE.md.

De fem questsen är kapitel i Malins legend. De är inte slutstoryn. Ingen av dem behöver vara sann. Efter kistan ska de fem *kännas* som samma kvinna.

Använd den här filen för gemensamma regler och för hur ingångstext skrivs i `content/intriger/`. Själva kapitlet, mekaniken och props sitter per quest:

| id | Fil |
|----|-----|
| Q-1 | [`quests/Q-1.md`](quests/Q-1.md) Första kärleken |
| Q-2 | [`quests/Q-2.md`](quests/Q-2.md) Hur hon blev pirat |
| Q-3 | [`quests/Q-3.md`](quests/Q-3.md) Korvetten |
| Q-4 | [`quests/Q-4.md`](quests/Q-4.md) Havet |
| Q-5 | [`quests/Q-5.md`](quests/Q-5.md) Skuldboken |

**Cirkulerande version** är rykte-fakta gästerna får *genom questen*, inte färdig STYLE.md-prosa. **Starten** får bara den del som står under **Cirkulerande version, start** på questens egen fil. Resten sitter i props, pit stops och skatten. **Sanning enligt kanon** är vad som faktiskt gäller. Blandas de två är filen trasig.

Status: **story låst 2026-08-20. Q-1 relåst 2026-08-22. Q-2 relåst 2026-08-23. Q-3 form låst och tillsatt 2026-08-24. Q-4 form låst 2026-08-24, tillsatt och gästtext skriven 2026-08-25. Q-5 form låst 2026-08-23, tillsatt och gästtext skriven 2026-08-24.** Mekanik: Q-1 har form och är engångsquest. Q-2 har form utan pussel och utan pit stops. Q-3 har form: gym, vedhög, badbrygga. Q-4 har form: *Tomtebobarnen*, kikaren, skylt på annan ö. Q-5 har form. Lediga pusselbyggstenar: [`pussel.md`](pussel.md). När en byggsten tillsätts en quest flyttas den till questens fil och stryks där.

**Tillsätt inte här.** Vilken skuta som har vilken quest, vem som bär start, vem som bär tvärledtråd, och vem som är mullvad: det väljs i [`fordelning.yaml`](fordelning.yaml) och [`forradare.yaml`](forradare.yaml) **när questsen är färdigskrivna** (story plus uppgifter). Inte tvärtom. En start per gäst. Inte till mullvad, inte till Malin, inte till Spader. Se regel 11-13.

---

## Gemensamma regler

Gäller alla fem. Bryt dem inte i gästtext, props eller pit-stop-copy.

1. Storyn handlar om Svarta Malins dåtid.
2. Berättaren får ljuga. Gästerna får den cirkulerande versionen **genom questen**, inte i första ledtråden. Om sanningen skiljer sig sitter den i questens fil och i kistan.
3. Får inte nämna Karl XII, kungen, affären, sängen med makten, eller att festen är en fälla. **Undantag för världen, inte för questen:** att Karl XII är kung år 1702 står i [`../copy/intriger_intro.md`](../copy/intriger_intro.md) och är kanon. Queststories, startintriger, props och pit stops får fortfarande inte nämna affären, sängen eller fällan.
4. Får inte citera sista versen som framtid. Får inte spoila metaregeln (alla dör, Malin blir Ran).
5. Gästtext: piratnamn, du-form, [`../intriger/STYLE.md`](../intriger/STYLE.md). "Ton i gästtext" under skrivstöd är en instruktion till agenten, inte text att klistra in.
6. En quest lär gästerna **en sak** om Malin. Skriv inte in de andra fyra kapitlen i samma intrig.
7. Mekanik som är låst eller parkerad per quest står under **Mekanik** på questens fil. Bygg inte noder som motsäger den. Q-2 har inget pussel.
8. **Korvetten Kurtisanens egna quest-trådar spelas bakom Malins rygg.** Malin är skuta 1:s egen kapten. En quest-start till en medlem av **Korvetten Kurtisanen** (`malintadaa` undantagen, hon bär aldrig sin egen jakt) ska instruera att uppdraget måste lösas utan att Malin ser eller anar det. Hon delar koj, köl och vardag med dem hela helgen: att gräva i hennes förflutna är farligare för en Kurtisan än för någon annan skutas medlem. Skriv in det som en konkret risk i gästtexten (hon kan komma runt hörnet när som helst), inte som en spelledningsvarning.
9. **Löjtnant Spader (`gustaftadaa`) får varken start eller tvärledtråd.** Han är fullt spelbar i övrigt. Han ska inte sitta och lösa huvudquesten. Se också regel 13.
10. **En dagbok, utrivna blad.** Malins dagbok står synlig i Storstugan. De flesta sidorna är utrivna. De utrivna bladen är det gästerna hittar i questsen. Kronologisk ordning står i tabellen nedan. Den är inte samma som hittordningen. Skriv inte in bokens plats som ett sökuppdrag i gästtext. Boken är dressing: den som råkar öppna den ser stubbar, inte kapitel.
11. **Max en ingång per gäst.** En `login_slug` bär start till högst en quest. Inte två. Tvärledtråd räknas inte som ingång: samma person får bära start i en quest och tvärledtråd i en annan. Kontrollera [`fordelning.yaml`](fordelning.yaml) innan en ny start skrivs.
12. **Förrädare får inte ingång.** Bara mullvaden (`a` i [`forradare.yaml`](forradare.yaml)). Kontaktpersonen (`b`) får start. Tvärledtråd till en mullvad är tillåten, det är inte ingång.
13. **Svarta Malin och Löjtnant Spader får inte ingång.** Inte `malintadaa`, inte `gustaftadaa`. Malin bär aldrig sin egen jakt (regel 8). Spader får inte heller tvärledtråd (regel 9).

---

## Cryptex-tokens

Lösenord: `HKHXII`. Antaget 2026-08-25, [`kanon.md`](kanon.md). Varje token är siffra plus bokstav. Siffran är positionen i lösenordet. Inte bara bokstaven.

De tre första delas ut i questen. De tre sista sitter på Malins berlock och syns först 20.00. Tre quests per skuta räcker till `HKH`. Inte till `XII`.

| Position | Token | Var | Antal | Tas |
|----------|-------|-----|-------|-----|
| 1 | `1H` | Q-2 skrinet i piratstugan | 3 | ja, en per quest-lag |
| 1 | `1H` | Q-4 skylten på annan ö | 1 | nej. Tre skutor läser. |
| 2 | `2K` | Q-2 skelettet i skogen | 3 | ja, en per quest-lag |
| 2 | `2K` | Q-5 svärdfiskens mun | 3 | ja. Troligen one-off: första laget tar. |
| 3 | `3H` | Q-1 påsen i klätternätet | 1 | ja. Engångs. |
| 3 | `3H` | Q-3 under badbryggan | 1 | ja. Engångs. |
| 4 | `4X` | Malins berlock | 1 | nej. Syns 20.00. |
| 5 | `5I` | Malins berlock | 1 | nej. Syns 20.00. |
| 6 | `6I` | Malins berlock | 1 | nej. Syns 20.00. |

Tryck: [`../rekvisita/Q1-cryptex-3H.md`](../rekvisita/Q1-cryptex-3H.md), [`../rekvisita/Q2-cryptex-1H.md`](../rekvisita/Q2-cryptex-1H.md), [`../rekvisita/Q2-cryptex-2K.md`](../rekvisita/Q2-cryptex-2K.md), [`../rekvisita/Q3-cryptex-3H.md`](../rekvisita/Q3-cryptex-3H.md), [`../rekvisita/Q4-cryptex-1H.md`](../rekvisita/Q4-cryptex-1H.md), [`../rekvisita/Q5-cryptex-2K.md`](../rekvisita/Q5-cryptex-2K.md). Berlocken är smycke, inte papper: [`produktion.md`](produktion.md) K-09.

Skriv inte ut token-texten i gästintrig. Inte i starten. Inte som facit.

---

## Dagboken

En fysisk bok i **Storstugan**. Synlig. Inte ett gömme. Inte en karta till bladen. Off-regel: den som inte söker något i boken lämnar den.

De utrivna bladen bär kapitlen. Cryptex-tokens, kompassbilder och vägvisning på baksidor är inte dagbok. Q-4: blad 1 i *Tomtebobarnen*, fastsatt. Ung, före kärleken, före sveket. Kapitlet är ett dagboksblad, inte en proklamation eller en ed som bär storyn. Kompassbilden och skylten (`1H`) är inte dagbok. Q-3: två fysiska blad av blad 6, samma natt, läsordning I–II. Ägarbeviset under badbryggan är inte dagbok. Tokens: se tabellen ovan.

Talet **Blad N** ska stå på papperet, så den som samlar flera kan lägga dem i tidsordning. Inte i questordning. Inte som lösenord.

| Blad | Liv | Quest | Prop | Hittas |
|------|-----|-------|------|--------|
| 1 | Ung. Drömmer om havet och friheten. | [Q-4](quests/Q-4.md) | Q4-02 | *Tomtebobarnen*, hyllan i Storstugan. Stannar. |
| 2 | Första kärleken, före förräderiet | [Q-1](quests/Q-1.md) | Q1-01 | Gubben och Gumman, itu |
| 3 | Förrådd. Tar namnet Svarta. Ska begrava Otto. | [Q-2](quests/Q-2.md) | Q2-07 | Piratstugan. Stannar. |
| 4 | Bygget. Rätten att preja. | [Q-2](quests/Q-2.md) | Q2-08 | Piratstugan. Stannar. |
| 5 | Hämnden klar. Otto begraven. Skutan döpt. | [Q-1](quests/Q-1.md) | Q1-04 | Klätternätet |
| 6 | Hon "tar" korvetten. Lögnen. Samma natt, två blad, I–II. | [Q-3](quests/Q-3.md) | Q3-01, Q3-02 | Gymmet (I, stannar), vedhögen (II, stannar) |
| 7 | Skulderna. Hon håller havet. | [Q-5](quests/Q-5.md) | Q5-03 | Svärdfiskens mun |
| 8 | Nutid. Tillflykten. En stor plan. | [Q-2](quests/Q-2.md) | Q2-09 | Piratstugan. Stannar. |

Hittordning är en annan sak. Q-4 ger blad 1 i *Tomtebobarnen*. Q-1 ger blad 2, sedan blad 5. Q-2 ger blad 3, 4 och 8 i samma rum, utan krav på ordning. Q-3 ger blad 6 I, sedan II. Ägarbeviset är inte blad. Q-5 ger blad 7. En gäst som bara springer en quest ska ändå förstå sitt kapitel. Kronologin är för den som får flera blad i handen.

Boken i Storstugan: pärm, titel, utrivna stubbar. Inga kvarvarande kapitel. Ingen innehållsförteckning som pekar mot gömmen. Inga namn på kungen.

---

## Ingångstext i `content/intriger/`

Gäller startstycket i `content/intriger/guests/{slug}.md`. Inte lagfilen. Inte tvärledtråd (den har egen regel längst ner). Skriv först när questen är färdig och personen är tillsatt i [`fordelning.yaml`](fordelning.yaml). Mottagaren måste klara regel 11-13: högst en start, inte mullvad, inte Malin, inte Spader. Kontaktperson i [`forradare.yaml`](forradare.yaml) får start. Röst enligt [`../intriger/STYLE.md`](../intriger/STYLE.md). Innehåll enligt questens fält **Cirkulerande version, start**.

Starten är **första ledtråden**, inte kapitlet. Gästen ska vilja veta mer och veta vart hen går. Hen ska inte redan ha lärt sig det questen är till för att lära. Testet: om starten redan svarar på fältet "Vad de ska ha lärt sig när questen är klar", är den för lång. Stryk svaret. Lämna frågan, ett rykte, och nästa handling.

Tre hårda regler, utöver listan nedan:

1. **Avslöja inte storyn i första ingången.** Bara fältet **Cirkulerande version, start**. Inte senare blad, inte kapitlet, inte "Vad de ska ha lärt sig när questen är klar". Inte cryptexen. Inte nästa gömme efter det första. Inte boken i Storstugan som sökuppdrag.
2. **Blanda inte in andra intriger eller relationer.** Stycket ska stå för sig själv. Koppla det inte till mottagarens romanser, fiendskaper, sidequests eller övriga `##`-stycken i samma fil. Skälet att gå sitter i questen (ryktet, tävlingen, nyfikenheten på Malin), inte i att hen också gömmer en kärlek eller har ett gammalt groll. Undantag: regel 8 för Kurtisanen. Det är questregel, inte personlig intrig.
3. **Uppmuntra mottagaren att ta sitt lag till hjälp.** Questen är lagets, inte ett solouppdrag. Skriv uttryckligen att hen ska ta med sin skuta. Inte spelledning om när. Inte att hen måste gå ensam.

Övrigt:

- Ge **en** första ledtråd ur den cirkulerande versionen: ett rykte, en fråga, ett namn på ett föremål. Berätta den ledtråden som om den vore sann.
- Peka mot nästa konkreta handling: en plats, ett föremål, två uddar. Inte "ta reda på sanningen om Malin".
- Kapitlet sitter i props, pit stops och skatten. Inte i starten.
- Skriv inte ut fältet "Får inte" som varning till gästen.
- Är mottagaren från **Korvetten Kurtisanen**: lägg till regel 8 ovan som en risk i berättelsen, inte som en instruktion till spelaren. Hen tar skutan till hjälp, men inte Malin.

Dåligt: "Du gömmer själv en förbjuden kärlek. Malin var kurtisan och hämnades. Gå till uddarna."
Bra: "Det ryktas att Malin skrev om sin första kärlek. Bladet ligger itu, en halva vid Gubben i stubben, en vid Gumman på udden. Ta din skuta. Hämta båda innan en annan skuta gör det."

Mönster, redan skrivna:

- Q-1: ett rivet dagboksblad om hennes första kärlek, två uddar. Inte kurtisanen, inte hämnden, inte Ottos namn, inte att skutan är döpt efter yrket.
- Q-2: ryktet om huset hon byggde. Inte hur hon blev pirat. Kapitlet sitter i stugan.
- Q-3: hon vilar aldrig, bladet sitter i gymmet. Inte prejningen, inte att skutan är tagen. Tvärledtråd: tretton steg framåt, inte var bladen sitter.
- Q-4: *Tomtebobarnen* var hennes favoritbok som barn, hyllan i Storstugan. Inte havet. Inte friheten. Inte kikaren. Inte kompassen.
- Q-5: du är skyldig henne, hon för logg. Inte var loggen sitter.

När du skriver **tvärledtråd** till en skuta som inte har ingången: ledtråden ska vara meningslös om mottagaren inte redan känner till questet. **Q-2 får ingen tvärledtråd.** Samma tre hårda regler: inte kapitlet, inte mottagarens övriga relationer, uppmana att ta laget om tråden ska spelas.

---

## Register

| id | Namn | Vad gästen ska ha lärt sig | Sanning vs lögn |
|----|------|----------------------------|-----------------|
| [Q-1](quests/Q-1.md) | Första kärleken | Malin var kurtisan. Sängen är underrättelse och hämnd. Skutan är döpt efter yrket. | Yrket är kanon. Första personen är Greve Otto von Pälspung, inte kungen. Hon är fortfarande kurtisan: det sitter bakom kulisserna. |
| [Q-2](quests/Q-2.md) | Hur hon blev pirat | Hon tog namnet Svarta ur sorgen. Hon byggde själv. Hon begravde von Pälspung i skogen. Stugan är tillflykten. | Stugan och graven är kanon. Planen i tillflyktsbladet är kungen, osagt. |
| [Q-3](quests/Q-3.md) | Korvetten | Hon prejade sin egen korvett. | **Lögn.** Sanningen: kungen satte den på hennes namn som belöning. Sitter i kistan. |
| [Q-4](quests/Q-4.md) | Havet | Som ung drömde hon om Salmonellahavet och om frihet. Hon tittade. Kikaren är den blicken. | Längtan får vara sann. Före Otto. Före sveket. Hur hon fick ön sitter inte här. Får inte säga att kajen är en fälla. |
| [Q-5](quests/Q-5.md) | Skuldboken | Hon samlar andras skulder. Lojalitet går att skriva upp. | Metoden är sann nog. Kistan bär inte hennes arkiv. |

---

## Tillsättning: skuta × quest

Snapshot av [`fordelning.yaml`](fordelning.yaml). Ändra där, sedan här. Fet = ingång (start). Kursiv = tvärledtråd. Streck = varken start eller tvärledtråd.

| Skuta | Q-1 Första kärleken | Q-2 Pirat | Q-3 Korvetten | Q-4 Havet | Q-5 Skuldboken |
|-------|---------------------|-----------|---------------|-----------|----------------|
| 1 Korvetten Kurtisanen | **Planka** | — | *tvär: Lösskägg, Planka* | **Hurring** | **Lösskägg** |
| 2 Fregatten Fördärvet | **Kuling** | **Blodig** | **Döver** | — | *tvär: Blodig* |
| 3 Barken Bortförklaringen | **Frodig** | **Enben** | *tvär: Enben, Frodig* | — | **Nykter** |
| 4 Fregatten Fromheten | — | **Kosing** | **Rödskägg** | **Hjärter** | *tvär: Rödskägg* |
| 5 Galeonen Gnället | — | — | **Rosing** | **Plåthorn** | **Dunka** |

Per quest, tre starter:

| Quest | Skutor | Start |
|-------|--------|-------|
| Q-1 | 1, 2, 3 | Planka (`linneaappert`), Kuling (`josefinlowing`), Frodig (`josefinansund`) |
| Q-2 | 2, 3, 4 | Blodig (`minimacklin`), Enben (`amaliawahlstrom`), Kosing (`amandamungsgard`) |
| Q-3 | 2, 4, 5 | Döver (`navidmodiri`), Rödskägg (`viktoransund`), Rosing (`linneaekbom`) |
| Q-4 | 1, 4, 5 | Hurring (`jesperlindmarker`), Hjärter (`jesperlejfjord`), Plåthorn (`elinmartensson`) |
| Q-5 | 1, 3, 5 | Lösskägg (`petterwallberg`), Nykter (`fabianmacklin`), Dunka (`ludvigvonbahr`) |

Tvärledtråd: Q-3 Caesar till skuta 1 och 3. Q-5 porträttväggen till skuta 2 och 4. Q-1 och Q-4 har ingen. Q-2 får ingen.

---

## Efter kistan, för den som skriver tändningen

När locket går upp ska de fem kapitlen omtolkas utan ny logik. Skriv inte omtolkningen i gästtext före 20.00.

| Quest | Omtolkning |
|-------|------------|
| [Q-1](quests/Q-1.md) | Samma recept. Ny kund. Kunden i kistan är kungen. |
| [Q-2](quests/Q-2.md) | Planen i tillflykten var att vila. Priset var de andra. |
| [Q-3](quests/Q-3.md) | Prejningen var kungens gåva. |
| [Q-4](quests/Q-4.md) | Längtan till havet var sann, redan som ung. Därför samlade hon dem vid vattnet. |
| [Q-5](quests/Q-5.md) | Ni har sett hur hon håller havet. Tre skuldbrev ligger kvar. Brevet visar att hon ville sluta. |

---

## Strykta teman

Använd inte som sjätte quest, och inte som ersättning utan nytt beslut.

Hur hon blev fasan. Den som försvann. Den första festen. Hur hon tog sjörövarns rätt, som eget kapitel (ligger i [Q-2](quests/Q-2.md) och [Q-3](quests/Q-3.md)). Hur hon fick ön (låg i Q-4 till 2026-08-24). Tången. Andelen. Läraren. Varför hon alltid går.
