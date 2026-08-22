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

---

## Vad skutorna vet

Står i lagintrigen:

- att de har en egen skatt att gömma vid ankomsten
- vilken annan skuta de ska plundra
- att kojjen är fredad (sovplatser är inte spel)

De vet **inte**:

- vem som jagar deras skatt
- att jakten är en sluten cirkel
- att det finns en mullvad i laget
- att Malins kista är tom

---

## Tid och plats

| När | Vad |
|-----|-----|
| Fredag ca 17.30 | Enda gömningsfönstret. Praktisk placering, inte pussel. Fredag är fortfarande utan story-mekanik. |
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

En funnen skatt får användas som muta, vad, pusselnyckel eller offentlig förnedring. Den får **inte** vara enda vägen in i Malins kista. Kistan har sin egen kedja i [`pussel.md`](pussel.md).

Om ingen hittar någon skatt: helgen går ändå. Skattjakten är inte tändningen. Kasserad tändning i [`slutstriden.md`](slutstriden.md): "skatterna redovisas och någon saknas."

---

## Kollision med huvudstoryn

Tillåtet och önskvärt:

- sälja sitt lags gömställe mot en ledtråd till cryptexen
- gömma en ledtråd *i* en lagskatt (då måste skatten upp före 15.30, och bypass finnas)
- mullvaden läcker, skyddar eller stjäl enligt [`forradare.yaml`](forradare.yaml)
- en skatt används som muta i en romans eller ett fiendskap

Otillåtet:

- att skattjakten måste pausas för att ett pussel ska lösas
- att en deltagare blir flaskhals för båda spåren
- att gömma lagskatt i Malins kista, i sängen, eller bakom något som kräver mobil

---

## Gästtext

| Skuta | Fil | Jagar | Status |
|-------|-----|-------|--------|
| 1 | `content/intriger/crews/1.md` | Fördärvet | skriven |
| 2 | `content/intriger/crews/2.md` | Bortförklaringen | skriven |
| 3 | `content/intriger/crews/3.md` | Fromheten | skriven |
| 4 | `content/intriger/crews/4.md` | Gnället | skriven |
| 5 | `content/intriger/crews/5.md` | Kurtisanen | skriven |

Poster i [`fordelning.yaml`](fordelning.yaml): id 1 till 5, beat B-11.

---

## Öppna frågor

- [ ] Vad är varje lags fysiska skatt? Fylls i här när de valt, eller på plats fredag.
- [ ] Ska en funnen skatt visas publikt (skryt) eller gömmas om (stöld)? Lämnas till lagen. Vi tvingar ingen redovisning.
- [ ] Får en skatt bära en ledtråd till cryptexen? Nej tills en pusselnod i [`pussel.md`](pussel.md) säger ja, med bypass.
