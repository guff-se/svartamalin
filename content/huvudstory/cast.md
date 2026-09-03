# Cast: 21 deltagare, 5 skutor

Intern text för Gustaf och agenten. Gäster läser inte detta.

Referenstabell för story-arbetet. Källa: tabellerna `guests` och `pirate_names` i Supabase, filtrerat på `attending = true`. Alla andra rader i `guests` ignoreras. De städas inte ur seed. Uppdatera om piratnamn eller lagindelning ändras.

Verifierad mot databasen 2026-09-03. **Kalle Anka** (`pirate_names.id` 59) och **Katten Felix** (`pirate_names.id` 58) är obesatta sedan tidigare. **Kapten Enben** (`pirate_names.id` 1) obesatt 2026-08-27: Amalia Wahlström (`amaliawahlstrom`) återbud. **Kapten Dunka** (`pirate_names.id` 55) obesatt 2026-09-01: Ludvig von Bahr (`ludvigvonbahr`) återbud. **Kapten Döver** (`navidmodiri`) attending=false 2026-09-03 men **saknad NPC** i fiktionen (S-10): porträttet hänger kvar på Q-5-väggen. Hänger inte som spelare. Bokstäverna oförändrade.

I gästtext används **bara** piratnamnet. I arbetsdokument här skriver vi `Piratnamn (slug)`.

## Skuta 1: Korvetten Kurtisanen

| Piratnamn | Riktigt namn | slug |
|-----------|--------------|------|
| **Svarta Malin** | Malin Tadaa | `malintadaa` |
| **Kapten Lösskägg** | Petter Wallberg | `petterwallberg` |
| **Kapten Planka** | Linnea Appert | `linneaappert` |
| **Kapten Barnsben** | Ulrika Hammar | `ulrikahammar` |
| **Kapten Hurring** | Jesper Lindmarker | `jesperlindmarker` |

## Skuta 2: Fregatten Fördärvet

| Piratnamn | Riktigt namn | slug |
|-----------|--------------|------|
| **Kapten Fuling** | Louise von Bahr | `louisevonbahr` |
| **Kapten Kuling** | Josefin Löwing | `josefinlowing` |
| **Löjtnant Spader** | Gustaf Tadaa | `gustaftadaa` |
| **Kapten Blodig** | Mini Macklin | `minimacklin` |

**Saknad NPC:** **Kapten Döver** (Navid Modiri, `navidmodiri`). Skulle ha seglat med Fördärvet. S-10. Ingen gästfil.

## Skuta 3: Barken Bortförklaringen

| Piratnamn | Riktigt namn | slug |
|-----------|--------------|------|
| **Kapten Nykter** | Fabian Macklin | `fabianmacklin` |
| **Kapten Frodig** | Josefin Ansund | `josefinansund` |
| **Kapten Klöver** | Johanna Bergman | `johannabergman` |
| **Kapten Blåskägg** | Hampus Lindblad | `hampuslindblad` |

## Skuta 4: Fregatten Fromheten

| Piratnamn | Riktigt namn | slug |
|-----------|--------------|------|
| **Kapten Hjärter** | Jesper Lejfjord | `jesperlejfjord` |
| **Kapten Kosing** | Amanda Mungsgård | `amandamungsgard` |
| **Kapten Rödskägg** | Viktor Ansund | `viktoransund` |
| **Kapten Prygel** | Minerva Löwgren | `minervalowgren` |

## Skuta 5: Galeonen Gnället

| Piratnamn | Riktigt namn | slug |
|-----------|--------------|------|
| **Kapten Rosing** | Linnea Ekbom | `linneaekbom` |
| **Kapten Babord** | Alexandra Palmquist | `alexandrapalmquist` |
| **Kapten Rötägg** | Edvin Thungren | `edvinthungren` |
| **Kapten Plåthorn** | Elin Mårtensson | `elinmartensson` |

---

## Särställningar i berättelsen

| Roll | Vem | Funktion |
|------|-----|----------|
| Antagonist och jubilar | **Svarta Malin** (`malintadaa`) | Osårbar. Dödar alla i finalen. Återvänder som Ran. |
| Rans budbärare | **Löjtnant Spader** (`gustaftadaa`) | Delar ut slöjor bland de döda, sjunger *Så länge skutan kan gå*. Är i praktiken även spelledare. |
| Båtarna | **Kapten Kuling** (`josefinlowing`), **Kapten Rödskägg** (`viktoransund`) | Vattenansvariga. Skrivna sjöintriger går gärna via att övertala dem. Man får åka ut utan dem. Aldrig ensam. |
| Maten | **Kapten Nykter** (`fabianmacklin`), **Kapten Hjärter** (`jesperlejfjord`) | Köksansvariga. Brunch 14.00, mat framme från 17.00. |

Ovanstående har uppgifter som ligger utanför den vanliga deltagarrollen. Malin har mindre utrymme för egna pussel. Spader är **fullt spelbar**: sidequests, romanser, rivaliteter som vanligt. Undantag: inte mullvad, inte kontakt. **Undantag 2026-09-03:** han bär Q-3-start efter Dövers återbud. Se [`forradare.yaml`](forradare.yaml). Båt- och matansvar är praktiskt, dokumenterat i [`../anteckningar/`](../anteckningar/). Kuling och Rödskäggs övertalningsscener är extra spel, inte ett monopol. Tillsätt inte båt- eller matansvariga som mullvad. Kuling får vara kontakt (forradare 5).

---

## Belastningsöversikt

Fyll i när sidequests fördelats, så ingen blir överlastad och ingen glöms bort. Pusselansvar speglar [`fordelning.yaml`](fordelning.yaml) och questfilerna, inte omvänd riktning. Q-4: skuta 1, 4, 5. Start: `jesperlindmarker`, `jesperlejfjord`, `elinmartensson`. Ingen tvärledtråd.

| slug | Romanser | Fiender | Sidequest i huvudstory | Pusselansvar |
|------|----------|---------|------------------------|--------------|
| `malintadaa` | 0 | 2 | | |
| `gustaftadaa` | 1 | 1 | | Q-3 (start, undantag 2026-09-03) |
| `petterwallberg` | 2 | 2 | | Q-5 (start), Q-3 (tvärledtråd) |
| `linneaappert` | 1 | 1 | | Q-1 (start), Q-3 (tvärledtråd) |
| `ulrikahammar` | 3 | 2 | | |
| `jesperlindmarker` | 2 | 1 | | Q-4 (start) |
| `louisevonbahr` | 2 | 1 | | |
| `josefinlowing` | 1 | 1 | | Q-1 (start), forradare 5 (kontakt) |
| `minimacklin` | 1 | 2 | | Q-2 (start), Q-5 (tvärledtråd) |
| `fabianmacklin` | 1 | 2 | | Q-5 (start) |
| `josefinansund` | 1 | 1 | | Q-1 (start), Q-3 (tvärledtråd) |
| `johannabergman` | 1 | 1 | | Q-2 (start) |
| `jesperlejfjord` | 1 | 1 | | Q-4 (start) |
| `amandamungsgard` | 0 | 1 | | Q-2 (start) |
| `viktoransund` | 1 | 2 | | Q-3 (start), Q-5 (tvärledtråd) |
| `minervalowgren` | 1 | 1 | | |
| `linneaekbom` | 1 | 1 | | Q-3 (start) |
| `alexandrapalmquist` | 3 | 1 | | |
| `hampuslindblad` | 3 | 3 | | |
| `edvinthungren` | 1 | 3 | | Q-5 (start) |
| `elinmartensson` | 1 | 3 | | Q-4 (start) |
