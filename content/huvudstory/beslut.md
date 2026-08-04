# Beslut och öppna frågor

Två listor. Beslut som är tagna, och frågor som blockerar arbetet. Ett beslut som inte står här gäller inte, eftersom vi kommer glömma att vi tog det.

---

## Beslutslogg

| Datum | Beslut | Konsekvens | Var det står nu |
|-------|--------|------------|-----------------|
| 2026-08-04 | Huvudstoryn utvecklas i `content/huvudstory/`, skilt från publicerad gästtext | Designmaterialet bundlas inte i klienten och kan innehålla lösningar | [`README.md`](README.md) |
| 2026-08-04 | Story-bitar distribueras till intrigfiler via [`fordelning.yaml`](fordelning.yaml) | Ingen gästtext skrivs innan story-biten är beslutad | [`README.md`](README.md) |
| 2026-08-04 | Inga pussel efter 15.30. Vatten och höjd stängs | Allt escape-innehåll måste klaras före brunchen | [`spelledning.md`](spelledning.md) |
| 2026-08-04 | Fyra säkerhetsverktyg: cut, largo, lookdown, OK-check | Lärs ut fredag och repeteras tre gånger under lördagen | [`spelledning.md`](spelledning.md) |
| 2026-08-04 | Gubben i stubben är hintsystemet | Kräver bemanning eller förberedelse, samt ett skäl i kanon till att han ljuger | [`pussel.md`](pussel.md), [`kanon.md`](kanon.md) |

---

## Blockerande frågor

Måste besvaras innan nästa steg kan tas. Sorterade efter hur mycket de blockerar.

### 1. Vem är skelettet på Södra Ovanan?

Blockerar: premiss, kanon, hela akt II, det mesta av pusselgrafen.

Detta är det enskilt mest avgörande valet. En identitet på skelettet ger oss automatiskt en bakgrund, ett brott, ett motiv och en anledning att alla är på ön.

Riktningar att välja mellan:

- En kapten ur sångens lista som Malin plundrat, och som ingen sett sedan dess
- Malins föregångare, alltså den som var Salmonellahavets fasa före henne
- Någon som är i familj med en deltagare, alltså en av de närvarande har en oavslutad sak
- Malin själv, alltså hon dog en gång och det som festar med oss är något annat. Detta rimmar starkt med att hon återvänder som Ran, men riskerar att spoila metaregeln för tidigt

### 2. Vad är huvudstoryns centrala sanning?

Blockerar: reveal-planen, sidequests, allt som ska skrivas in i intrigfilerna.

Se kraven i [`premiss.md`](premiss.md) punkt 3.

### 3. Är Malin huvudstoryns arkitekt eller dess offer?

Blockerar: vad Malin ska spela på lördagen, och hur mycket runtime hon kan bära.

- Om arkitekt: hon vet allt, driver spelet och kan användas som spelledarverktyg fritt
- Om offer: hon upptäcker saker samtidigt som gästerna, vilket ger starkare spel för henne men mindre kontroll för oss

### 4. Vilken form har den gemensamma tävlingsaktiviteten på förmiddagen?

Blockerar: tidsplanen för akt II, props och bygg.

Kraven står i [`akter.md`](akter.md).

### 5. Vad är transitionen 10.30?

Blockerar: alibi-designen, alltså hur bra folk kommer in i roll. Se [`tidslinje.md`](tidslinje.md) och [`RESEARCH.md`](RESEARCH.md) 1.8.

### 6. Vad är ritualen i fiktionen?

Blockerar: akt III, koreografin, och vad slutstriden kan bryta.

Se [`ritual.md`](ritual.md).

---

## Icke-blockerande frågor

Kan besvaras senare, men får inte glömmas.

- [ ] Vet gästerna att det finns en huvudstory innan helgen?
- [ ] Får huvudstoryn kollidera med lagens skattjakt, eller löper de parallellt?
- [ ] Är bastu och onsen öppna efter ritualen?
- [ ] Vem bemannar Gubben i stubben, och hur många timmar?
- [ ] Hur många ekor och flottar finns, och hur många turer per timme klarar de?
- [ ] Vad står på skylten på den andra ön, och behövs tillstånd?
- [ ] Krävs det ett förbesök, och när i så fall?
- [ ] Hur kommuniceras play to lift till gästerna? Skärpning av `content/copy/manifest_play.md`?
- [ ] Ska säkerhetsverktygen finnas i gästkommunikationen på sajten, inte bara sägas på ön?
- [ ] Har de sex deltagarna utan crew i Supabase, alltså de som inte är med, städats bort ur seed-datan?
