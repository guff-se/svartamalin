# Skatt: två ord

Intern text för Gustaf och agenten. Gäster läser inte detta. Tydlig prosa, ingen STYLE.md.

Svenska **skatt** är två engelska ord. Agenter blandar ihop dem. Gäster gör det inte.

| Märkning i den här mappen | Engelska | Vad det är här |
|--------------------------|----------|----------------|
| **skatt (treasure)** | treasure | Gömt föremål, klenod, byte, kistans påstådda innehåll, questfynd |
| **skatt (tax)** | tax | Avgift som tas ut, indrivning, piratskatt, arvssyndsskatt, avlat som blankar boken |

**I gästtext** (`content/intriger/crews/`, `content/intriger/guests/`, `content/copy/`): skriv **skatt**. Inte avgift, taxa, klenod, kollekt som ersättningsord. Svenskar ser skillnaden i meningen.

**I intern text** (den här mappen, `anteckningar/`, yaml-kommentarer, README): skriv alltid `skatt (treasure)` eller `skatt (tax)` vid varje omnämnande. Fil som bara handlar om det ena (till exempel [`lagskatter.md`](lagskatter.md)) får en filrubrik att allt omarkerat är treasure, och måste märka varje tax-rad.

Rör inte `content/roller/`. Spegling av Supabase.

---

## Inventering

### skatt (treasure)

- **Lagskatter.** Varje skuta gömmer ett fysiskt föremål. Cirkel 1→2→3→4→5→1. [`lagskatter.md`](lagskatter.md).
- **Malins kista.** Hamnen tror att där ligger skatt (treasure). Där ligger ingen. Kanon: [`kanon.md`](kanon.md).
- **Questfynd.** Q-3 under badbryggan, tokens, dressing i kistan. Inte lagskatt.
- **Kosings föremål** i `roller/amandamungsgard.md` ("en skatt med mynt och sedlar"): lådan hon fyller när hon driver in skatt (tax). Föremålet är treasure. Innehållet är indriven tax.

### skatt (tax)

- **Fromhetens piratskatt.** Plattform i `crews/4.md`: skatt efter bärkraft, avlat blankar den. Metod: omfördela, inte stjäla.
- **Kosings arvssyndsskatt.** S-05. En skatt (tax) på dem som kommer från överklassen, riktad mot Kapten Dunka (`ludvigvonbahr`). Betalas i mynt eller berättelse. [`sidequests.md`](sidequests.md).
- **Avlat.** Den som ber får sin skatt (tax) blankad. Inte samma sak som att lämna tillbaka en lagskatt (treasure).

### Fällor (här blandade agenten ihop dem)

1. **Fiende 17, Malin–Kosing.** Före 2026-08-28: Malin skålade att Kosings arvssyndsskatt (tax) var "söt men tvåa" efter Malins egen skatt (treasure). Det är två olika saker och går inte att rangordna. **Ny oförrätt:** Malin skålade att jubileet inte betalar skatt (tax). Hon kallade arvssyndsskatten (tax) en kyrkkollekt under piratflagg. Kosing driver in skatt (tax) på Kurtisanen som tyst svar. Inte en jämförelse med Malins treasure. [`../intriger/fiender.yaml`](../intriger/fiender.yaml) #17.
2. **Fromheten jagar Gnället.** Fromheten tar ut piratskatt (tax) som metod. Föremålet de ska *hitta* är galeonens skatt (treasure). I gästtext får båda heta skatt. Här: metod = tax, byte = treasure.
3. **Barken jagar Fromheten.** "Ta deras skatt" i `crews/3.md` är Fromhetens lagskatt (treasure) bakom helgonfanan. Inte piratskatten (tax). "Val utan skatt" i samma stycke: valet utan lagskatten (treasure).
4. **Q-3 "skatt under badbryggan".** Questfynd (treasure), inte en lagskatt (treasure) och inte tax.

`skeppskatt` hos Kapten Blodig (`minimacklin`) är katmynta. Varken tax eller treasure.

### Fromheten har båda i samma filer

Det är den vanliga fällan.

| Yta | skatt (tax) | skatt (treasure) |
|-----|-------------|-----------------|
| `crews/4.md` första `##` | aldrig betalat skatt, blankad i räkenskaperna, "Skatt är inne" | "var ni gömt er skatt" |
| `crews/4.md` jaktstycket | metod: ta ut piratskatt | målet: Gnällets lagskatt. "Ta den." |
| `crews/3.md` jaktstycket | Fromhetens retorik (omfördela) | målet: Fromhetens lagskatt bakom helgonfanan |
| Hjärter (`jesperlejfjord.md`) | avlat blankar skatt | dörr: nästa ledtråd till Fromhetens skatt |
| Kosing (`amandamungsgard.md`) | arvssyndsskatt mot Dunka och mot Kurtisanen | Fromhetens lagskatt sitter i lagfilen, inte här |

Jaktens skäl "Frompirater tar ut piratskatt. Ta den." betyder: de ramar in stölden som tax. Föremålet de tar är treasure. Två steg, inte ett.

---

## Test innan du skriver intern text

1. Kan meningen byta *skatt* mot *gömt föremål* utan att bli fel? Då är det skatt (treasure).
2. Kan den byta mot *avgift* utan att bli fel? Då är det skatt (tax).
3. Om båda passar, eller ingen: du har blandat ihop dem. Skriv om och märk.
4. Gästtext: skriv **skatt** ändå. Byt inte in klenod, taxa eller avgift.
