# Förrädare

Intern text för Gustaf och agenten. Gäster läser inte detta. Tydlig prosa, ingen STYLE.md.

Gästtext skrivs **inte** förrän mullvad och kontaktperson är namngivna här och har poster i [`fordelning.yaml`](fordelning.yaml). Texten går i `content/intriger/guests/{slug}.md`, aldrig i lagfilen. Lagkamrater ser inte varandras individintriger.

---

## Mekanik

Varje skuta har exakt **en mullvad** och exakt **en kontaktperson**. Det är två olika personer.

Mullvaden seglar med sitt hemmalag men arbetar i hemlighet för ett annat. Kontaktpersonen sitter i uppdragsgivarens lag och är **den enda** som vet att mullvaden finns och vem det är. Inte hemmalaget. Inte resten av uppdragsgivarens lag.

Kopplingen är en cirkel, två steg framåt:

```
1 → 3 → 5 → 2 → 4 → 1
```

En person på skuta 1 är mullvad för skuta 3. En person på 3 är mullvad för 5. Och så vidare.

| Hemmalag (mullvaden seglar här) | Mullvad arbetar för | Kontaktperson sitter på |
|---------------------------------|---------------------|-------------------------|
| 1 Kurtisanen | 3 Bortförklaringen | 3 Bortförklaringen |
| 3 Bortförklaringen | 5 Gnället | 5 Gnället |
| 5 Gnället | 2 Fördärvet | 2 Fördärvet |
| 2 Fördärvet | 4 Fromheten | 4 Fromheten |
| 4 Fromheten | 1 Kurtisanen | 1 Kurtisanen |

Kontroll: varje skuta förekommer exakt en gång som hemmalag och exakt en gång som uppdragsgivare. Alltså exakt en utgående mullvad och exakt en inkommande kontakt.

Detta är **inte** samma cirkel som lagskatterna. Skattjakten går ett steg (`1 → 2 → 3 → 4 → 5 → 1`). Se [`lagskatter.md`](lagskatter.md).

Följd för spelet: Kurtisanens mullvad hjälper Bortförklaringen, som jagar **Fromhetens** skatt och gömmer sin egen för **Fördärvet**. Att läcka Kurtisanens gömställe ger Bortförklaringen inget. Mullvaden måste göra ett jobb, inte bara sälja sitt lags skatt.

---

## Kunskapsmatris

För ett par, till exempel Kurtisanens mullvad som arbetar för Bortförklaringen:

| Vem | Vet att mullvaden finns | Vet vem det är |
|-----|-------------------------|----------------|
| Mullvaden själv | ja | ja |
| Kontaktpersonen på Bortförklaringen | ja | ja |
| Resten av Kurtisanen | nej | nej |
| Resten av Bortförklaringen | nej | nej |
| Övriga skutor | nej | nej |

Kontaktpersonen får i spel välja att använda uppgifterna utan att avslöja källan. Det är drama, inte läcka från oss.

---

## Tillsättning

Fylls i här först, sedan `fordelning.yaml`, sedan gästtext. Tom = inte tillsatt.

**Svarta Malin** (`malintadaa`) och **Löjtnant Spader** (`gustaftadaa`) tillsätts **inte** som mullvad. De driver runtime. Spader tillsätts heller inte som kontakt. Malin som kontakt är möjlig men stjäl utrymme från antagonisten. Default: inte hon heller.

**Kapten Kuling** (`josefinlowing`) och **Kapten Rödskägg** (`viktoransund`) tillsätts **inte** som mullvad. De har båtarna. Kontakt går, mullvad krockar med kajen.

**Kapten Nykter** (`fabianmacklin`) och **Kapten Hjärter** (`jesperlejfjord`) tillsätts **inte** som mullvad. De har maten. Kontakt går, mullvad krockar med köket.

| Hemmalag | Mullvad (slug) | Uppdragsgivare | Kontakt (slug) | Status |
|----------|----------------|----------------|----------------|--------|
| 1 Kurtisanen | | 3 Bortförklaringen | | tillsätt |
| 3 Bortförklaringen | | 5 Gnället | | tillsätt |
| 5 Gnället | | 2 Fördärvet | | tillsätt |
| 2 Fördärvet | | 4 Fromheten | | tillsätt |
| 4 Fromheten | | 1 Kurtisanen | | tillsätt |

Regler vid tillsättning:

1. Mullvad och kontakt på samma skuta är olika personer. (Kurtisanens mullvad ≠ Kurtisanens kontakt. Den senare tar emot Fromhetens mullvad.)
2. Bara `attending = true`. Se [`cast.md`](cast.md).
3. Bygg på en befintlig romans eller fiendskap när det går. Då behövs ingen ny backstory.
4. En person är antingen mullvad, kontakt, eller ingen av delarna. Inte båda.
5. Mullvaden ska ha **något att vilja** av uppdragsgivaren, inte bara "var förrädare".

När raden är fylld: två poster i `fordelning.yaml` (mullvad + kontakt), speglade, `vet_inte` satt så att resten av lagen inte får texten.

---

## Tillsättning, när

Välj par när questsen är färdigskrivna, utifrån storyn och befintliga band. Inte tvärtom. Inga kandidatlistor i den här filen förrän dess.

---

## Vad de gör i spel

Mullvaden, från fredag kväll:

1. Ta kontakt med sin kontaktperson i hemlighet. Första mötet är deras. Vi pekar inte ut klockslag i gästtext, bara att det ska ske innan brunchen.
2. Hjälpa uppdragsgivarens jakt: den skatt *de* söker, och försvaret av *deras* egen.
3. Inte avslöja uppdragsgivarens mål för sitt hemmalag.
4. Ha ett skäl att tveka. Förräderi som är gratis är inte en intrig.

Kontaktpersonen:

1. Veta namn och existens. Ingen annan på den egna skutan får det i sin intrig.
2. Ge mullvaden ett konkret uppdrag (var, vad, mot vem), inte bara "hjälp oss".
3. Få använda uppgifterna utan att bränna källan.

Första uppdraget skrivs in i bådas gästtext när personerna är tillsatta. Det ska gå att spela på tre minuter i en vrå. Segelbåten, svärdfiskens gap, Gubben och Gumman är bra mötesplatser. Se [`platser.md`](platser.md).

---

## Gästtext, när tillsatt

Två filer per par. Skrivs i `content/intriger/guests/{slug}.md` enligt STYLE.md (du-form, piratnamn). Inte i den här filen.

- Mullvaden: du arbetar för den andra skutan, din enda länk är **[kontaktens piratnamn]**. Hemmalaget vet ingenting. Vad du vill. Vad det kostar.
- Kontaktpersonen: **[mullvadens piratnamn]** på den andra skutan är din. Ingen annan ombord vet. Vad du vill att hen gör innan sista skålen.

`vet_inte` i fördelningen: cirkeln, att varje lag har både mullvad och kontakt, vem som jagar vems skatt utöver det egna lagets jakt.

Status nu: **ingen gästtext**. Väntar på tillsättning.

---

## Spelledning

Om någon frågar rakt ut om förrädare i sitt lag: play to lift, inget bekräfta. Vi outar inte. Om mullvaden aldrig tar kontakt: huvudstoryn går ändå. Sidequest, inte bärande balk.

Om kontaktpersonen bränner mullvaden publikt: det är spelet. Lördag är svek.

Cut gäller. Förräderi är fiktion. En spelare som inte vill bära svek mot sitt vänlag ska kunna cut:a rollen utan att vi ersätter med en ny mullvad mitt i helgen. Då är det paret tyst.

---

## Öppna frågor

- [ ] Tillsätt de fem paren. **Först när questsen är färdigskrivna.** Välj utifrån storyn, inte tvärtom. Blockerar all gästtext i det här spåret.
- [ ] Första konkreta uppdraget per par.
- [ ] Mötesplats per par, så inte alla fem smyger till samma boj.
