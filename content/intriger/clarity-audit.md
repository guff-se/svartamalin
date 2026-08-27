# Klarhetsgranskning — gästintriger (guests/*.md)

Intern granskning, inte gästcopy. Se `content/intriger/README.md` för format.

Kördes i två omgångar med olika mängd kontext given till granskningsagenterna. Runda 2 är den relevanta bilden av vad en verklig gäst faktiskt förstår — runda 1 stod kvar som referens för hur illa det ser ut helt isolerat.

## Runda 2 — med lagintrig, roster och egen roll (aktuell bild)

**Metod:** 24 isolerade agenter, en per gäst. Varje agent fick:
1. sin egen `guests/{slug}.md` (gästrenderad, som runda 1),
2. sitt eget lags `crews/{crew_id}.md` (gästrenderad — lagkamrater läser samma text, se README: "Lagfil → alla i laget"),
3. sin egen `roller/{slug}.md` (karaktärsunderlaget gästen själv fyllde i — inte publicerat, men känt av gästen om sig själv),
4. en roster med alla 5 lagnamn och alla 24 deltagares piratnamn + lag, med läsarens eget namn/lag utmärkt, och instruktionen att detta är kända medgäster på festen.

Ingen annan fil, ingen worldbuilding utöver detta. Samma uppdrag som runda 1: kan läsaren nu förstå vem de är, vilka de nämnda personerna är, vad som förväntas, vad som står på spel?

### Resultat

| Betyg | Antal | Runda 1 → Runda 2 |
|---|---|---|
| 🟢 Grönt | 20 | 0 → 20 |
| 🟡 Gult | 3 | 23 → 3 |
| 🔴 Rött | 1 | 1 → 1 (oförändrat) |

De flesta oklarheter från runda 1 — skutnamn, kaptensnamn, "vem är jag själv" — löstes helt av rostern och lagintrigen. De tre kvarvarande gula och det röda betyget är riktiga innehållsluckor, inte artefakter av isolerad läsning.

### 🔴 Rött: malintadaa (oförändrat från runda 1)

**Kvarstående problem:** Textens centrala instruktion — dölj identiteten på din enda riktiga älskare ("honom", "den munnen") från hamnen, medan Kapten Dunka används som synlig avledning — går fortfarande inte att agera på. Älskaren namnges aldrig, varken i gästtexten, lagintrigen, den egna rollen eller rostern. Allt annat i filen löser sig fint med den nya kontexten (Dunka/Plåthorn/Kuling/Kosing identifieras via rostern, lagintrigens skattjakt matchar hennes roll som värdinna/kapten).

**Åtgärd:** Antingen namnge älskaren någonstans läsaren har tillgång till, eller skriv om avsnittet så att det går att spela utan ett namn (t.ex. tydliggör att identiteten är okänd även för spelaren och ska improviseras/väljas fritt på plats).

### 🟡 Gult (3 st)

| Gäst | Kvarstående oklara termer | Kommentar |
|---|---|---|
| linneaappert | `Gubben i stubben`; `Gumman på udden` | Två gömställen för det rivna brevet om Malins ungdomskärlek. Läses troligen som fysiska landmärken på festplatsen (agenten gissar det), men ingen av de tre filerna eller rostern bekräftar var de är. |
| linneaekbom | `krumelurburk`; `skymningens piller` | Kapten Barnsbens (ulrikahammar) personliga föremål, nämnt i andra gästers filer utan förklaring — förklaringen finns bara i Barnsbens *egen* fil, som linneaekbom inte har tillgång till. |
| navidmodiri | `krumelurpillret` | Samma rotorsak som ovan: ett Barnsben-föremål refererat i en annan gästs text utan att den förklarande källan (Barnsbens egen fil) är tillgänglig för den läsaren. |

**Mönster i de kvarvarande gula:** Två av tre är samma sak — Kapten Barnsbens (`ulrikahammar`) piller/burk är en personlig detalj som *hennes egen* fil förklarar fint, men som läcker in oförklarad i andra gästers texter (linneaekbom, navidmodiri) eftersom de bara har tillgång till sin egen fil, inte Barnsbens. Det tredje (`Gubben i stubben`/`Gumman på udden`) är sannolikt löst av att vara fysiska platser på riktiga festplatsen — inte ett textproblem agenten kan verifiera.

### Rekommendation efter runda 2

Grundstrukturen (gästtext + lagintrig + gästens egen kunskap om festen och sig själv) fungerar överlag mycket bra — 20 av 24 filer är fullt begripliga med bara det en verklig gäst redan har. Två uppgifter kvarstår:

1. **`malintadaa`:** lös den namnlösa älskaren (se ovan) — enda genuina blockeraren.
2. **Barnsbens piller/burk:** när ett föremål/detalj hos en person nämns i *någon annans* fil (t.ex. "krumelurpillret" hos Barnsben, refererat hos linneaekbom och navidmodiri), lägg in en rad förklaring där det nämns första gången — förlita dig inte på att läsaren känner till en annan gästs egen fil.

---

## Runda 1 — helt isolerad läsning (arkiverad, se runda 2 för aktuell bild)

**Metod:** 24 isolerade agenter, en per gäst. Varje agent fick ENDAST den renderade brödtexten för sin egen `guests/{slug}.md` (frontmatter och `{slug:...}`-taggar bortstrippade) — inga andra filer, ingen worldbuilding-kontext. Uppdraget: kan en förstagångsläsare med noll annan kontext förstå vad som pågår?

### Resultat i korthet

| Betyg | Antal | Gäster |
|---|---|---|
| 🟢 Grönt | 0 | — |
| 🟡 Gult | 23 | alla utom malintadaa |
| 🔴 Rött | 1 | malintadaa |

**Slutsats i efterhand:** det totala avsaknaden av grönt i runda 1 var mest en artefakt av att inte ge läsaren den kontext en verklig gäst faktiskt har (sin egen bakgrund, sitt lags text, vetskap om vilka andra gäster är). Runda 2 bekräftar att skriv-kvaliteten i sig är god — problemen var nästan uteslutande "vem är vem", inte otydlig dramaturgi.

### Återkommande problem i runda 1 (löstes i runda 2 av roster + lagintrig + egen roll)

1. Skutnamn slängda oförklarade (`Fregatten Fördärvet` m.fl.) — löst av rostern.
2. Kaptener utan roll/relation — löst av rostern.
3. Återkommande rekvisita/mekanik (`svarta liggare`, `sexmagick`, `arvssyndsskatt`, `Piratpulver`, `Skäggens Konung`) — löst av lagintrig + egen roll i de flesta fall.
4. Platsnamn utan geografi (`Storstugan`, `Paradisets ö`, `Galápagos`) — löst av lagintrig/egen roll i de flesta fall; `Gubben i stubben`/`Gumman på udden` kvarstår som osäkra (se runda 2).
5. Läsarens eget piratnamn saknades ofta i själva gästtexten — löst av rostern.

Fullständig gult-lista per gäst från runda 1 (för spårbarhet) finns i git-historiken för denna fil.
