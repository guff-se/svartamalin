# Skatt: två betydelser

Intern text för Gustaf och agenten. Gäster läser inte detta. Tydlig prosa, ingen STYLE.md.

Svenskans **skatt** är två engelska ord. Agenter blandar ihop dem. Gästtext får använda båda. Intern text ska alltid märka vilken.

| Svenska i gästtext | Engelska | Vad det är | Inte |
|--------------------|----------|------------|------|
| **lagskatt**, klenod, gömma, föremålet lagen tar med | treasure | Fysiskt festföremål. En per skuta. Göms fredag, jagas lördag. | Inte en avgift. Inte Malins kista. Inte Kosings mynt. |
| **piratskatt**, **arvssyndsskatt**, taxa, avgift, kolekt | tax | Fromhetens påhittade avgift. Betalas i mynt eller berättelse. Avlat blankar den. | Inte lagens gömda föremål. Inte kistans innehåll. |

I den här mappen, i `anteckningar/`, i yaml-kommentarer och i `fordelning.yaml`: skriv `(treasure)` eller `(tax)` när ordet *skatt* står, eller använd de disambiguerande namnen ovan. Gissa inte från sammanhanget. Fromheten har **båda**.

Gästtext (`intriger/`, `copy/`): båda orden får heta skatt. Kontexten måste bära. Jämför aldrig Malins treasure med Kosings tax. Det var buggen i fiende 17 (struken 2026-08-28).

---

## Register: vad som är vad

### Treasure

- **Lagskatterna.** Fem föremål. Cirkel ett steg. Fil: [`lagskatter.md`](lagskatter.md).
- **Malins kista.** Hamnen tror att där ligger hennes skatt (treasure). Kistan är tom på loot. Brev och dressing. Kanon: [`kanon.md`](kanon.md).
- **Quest-skatter.** Ägarbevis, tokens, dagboksgömmen. Fysiska. Inte avgift.
- **Kosings föremål i `roller/`**, "En skatt med mynt och sedlar": mynten hon *samlar in* via tax. Fysiskt kassaskrin. **Inte** Fromhetens lagskatt (treasure). Inte samma föremål som galeonens gömma.

### Tax

- **Piratskatt.** Frompiraternas plattform i `crews/4.md`: avgift efter bärkraft, omfördelning, avlat. Slogan "Skatt är inne" = tax är inne, inte "göm klenoden".
- **Arvssyndsskatt.** Kapten Kosing (`amandamungsgard`). S-05. Avgift på dem som kommer från överklassen. Primärt mål: Kapten Dunka. Hämnd mot Malin: taxan följer Kurtisanens namn. Inte en tävling mot Malins loot.
- **Avlat.** Knäböj, be, piratskatten (tax) blankas i boken. Inte att lagskatten (treasure) lämnas tillbaka.

### Fromheten har båda i samma filer

Det är den vanliga fällan.

| Yta | Tax | Treasure |
|-----|-----|----------|
| `crews/4.md` första `##` | piratskatt, aldrig betalat, blankad i räkenskaperna, "Skatt är inne" | "var ni gömt er klenod" |
| `crews/4.md` jaktstycket | metod: ta ut piratskatt (tax) på det gömda | målet: Gnällets lagskatt (treasure) |
| `crews/3.md` jaktstycket | Fromhetens retorik (omfördela) | målet: Fromhetens lagskatt (treasure), "gömd klenod" |
| Hjärter (`jesperlejfjord.md`) | avlat blankar piratskatt (tax) | dörr: nästa ledtråd till Fromhetens gömda skatt (treasure) |
| Kosing (`amandamungsgard.md`) | arvssyndsskatt (tax) mot Dunka och mot Kurtisanen | Fromhetens lagskatt sitter i lagfilen, inte här |

Jaktens skäl "Frompirater tar ut piratskatt, ta den" betyder: de *ramar in stölden* som tax. Föremålet de tar är treasure. Två steg, inte ett.

---

## Fiende 17 (Kosing → Malin)

**Inte:** Malin jämförde Kosings tax med sin egen treasure och satte taxen på andraplats. Treasure och tax är inte samma tävling.

**Är:** Malin avfärdade arvssyndsskatten (tax) i en skål, kallade den tiggeri med psalm (kolekt, inte kaptens rätt), och vägrade betala. Kosing sa inget. Hämnd: taxan (tax) följer dem i Kurtisanen som skryter om att stå Malin nära. Låg intensitet, ingen scen.

---

## Test innan du skriver

1. Kan meningen byta ut *skatt* mot *klenod* utan att bli fel? Då är det treasure.
2. Kan den byta mot *avgift* eller *taxa* utan att bli fel? Då är det tax.
3. Om båda passar, eller ingen: du har blandat ihop dem. Skriv om.
4. Intern fil utan `(treasure)` / `(tax)` / disambiguerande namn: lägg till märkningen.
