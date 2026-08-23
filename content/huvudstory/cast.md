# Cast: 24 deltagare, 5 skutor

Intern text för Gustaf och agenten. Gäster läser inte detta.

Referenstabell för story-arbetet. Källa: tabellerna `guests` och `pirate_names` i Supabase, filtrerat på `attending = true`. Alla andra rader i `guests` ignoreras. De städas inte ur seed. Uppdatera om piratnamn eller lagindelning ändras.

Verifierad mot databasen 2026-08-23. **Kalle Anka** (`pirate_names.id` 59) och **Katten Felix** (`pirate_names.id` 58) är obesatta: återbud, ingen gäst bär namnen.

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
| **Kapten Döver** | Navid Modiri | `navidmodiri` |
| **Löjtnant Spader** | Gustaf Tadaa | `gustaftadaa` |
| **Kapten Blodig** | Mini Macklin | `minimacklin` |

## Skuta 3: Barken Bortförklaringen

| Piratnamn | Riktigt namn | slug |
|-----------|--------------|------|
| **Kapten Enben** | Amalia Wahlström | `amaliawahlstrom` |
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
| **Kapten Dunka** | Ludvig von Bahr | `ludvigvonbahr` |
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

Ovanstående har uppgifter som ligger utanför den vanliga deltagarrollen. Malin har mindre utrymme för egna pussel. Spader är **fullt spelbar**: sidequests, romanser, rivaliteter som vanligt. Två undantag, bara de: inga ledtrådar till huvudquesten, och inte mullvad eller kontakt. Se [`forradare.yaml`](forradare.yaml). Båt- och matansvar är praktiskt, dokumenterat i [`../anteckningar/`](../anteckningar/). Kuling och Rödskäggs övertalningsscener är extra spel, inte ett monopol. Tillsätt inte båt- eller matansvariga som mullvad.

---

## Belastningsöversikt

Fyll i när sidequests fördelats, så ingen blir överlastad och ingen glöms bort. Uppdateras från [`fordelning.yaml`](fordelning.yaml).

| slug | Romanser | Fiender | Sidequest i huvudstory | Pusselansvar |
|------|----------|---------|------------------------|--------------|
| `malintadaa` | 0 | 2 | | |
| `gustaftadaa` | 1 | 1 | | |
| `petterwallberg` | 1 | 2 | | |
| `linneaappert` | 1 | 1 | | Q-1 (start) |
| `ulrikahammar` | 3 | 2 | | |
| `jesperlindmarker` | 2 | 1 | | |
| `louisevonbahr` | 1 | 1 | | |
| `josefinlowing` | 1 | 1 | | |
| `navidmodiri` | 2 | 2 | | |
| `minimacklin` | 1 | 2 | | |
| `ludvigvonbahr` | 1 | 1 | | |
| `amaliawahlstrom` | 0 | 1 | | |
| `fabianmacklin` | 1 | 3 | | |
| `josefinansund` | 1 | 1 | | Q-1 (start) |
| `johannabergman` | 1 | 1 | | |
| `jesperlejfjord` | 1 | 1 | | |
| `amandamungsgard` | 1 | 1 | | |
| `viktoransund` | 1 | 2 | | |
| `minervalowgren` | 1 | 1 | | |
| `linneaekbom` | 1 | 1 | | |
| `alexandrapalmquist` | 1 | 1 | | |
| `hampuslindblad` | 1 | 3 | | |
| `edvinthungren` | 1 | 3 | | |
| `elinmartensson` | 1 | 1 | | Q-1 (start) |
