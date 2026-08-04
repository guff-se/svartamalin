# Sidequests

Sidospår i huvudstoryn som bara rör vissa deltagare. Skiljer sig från de individuella intrigerna i `../intriger/guests/` på ett sätt: **sidequests är kopplade till huvudstoryn**, romanser och fiendskaper är inte.

En sidequest är kort. En sak att göra, en person att göra den med eller mot, ett skäl att det sker under helgen.

---

## Sidequest-mall

```
## S-nn: Namn

Akt:            I / II / III / IV
Deltagare:      Piratnamn (slug), ...
Roll i storyn:  bärare / jägare / grindvakt / vittne
Kopplad till:   B-nn i akter.md, P-nn i pussel.md

Vad de vill:    
Vad står i vägen:
Varför nu:      

Hur det spelas: konkret, alltså vad personen faktiskt gör på ön
Utfall om ja:   
Utfall om nej:  

Bygger på:      befintlig romans eller fiendskap, med id ur romanser.yaml / fiender.yaml
Speglas hos:    slugs som behöver motsvarande text
Status:         idé / beslutad / skriven
```

---

## Register

| id | Namn | Deltagare | Akt | Roll | Status |
|----|------|-----------|-----|------|--------|
| | | | | | |

---

## Designregler för sidequests

1. **Bygg på det som redan finns.** Varje sidequest bör hänga på en befintlig romans eller fiendskap. Då blir den trovärdig direkt och behöver ingen ny bakgrund.
2. **Vilja utan förmåga, förmåga utan vilja.** Den som vill något ska behöva någon annans hjälp för att kunna. Det är motorn i lördagens sveksstämning.
3. **Minst tre inblandade**, i linje med `STYLE.md`. Två personer blir en duell, tre blir drama.
4. **Aldrig kritisk för huvudstoryn.** Om en sidequest inte spelas ska huvudstoryn ändå gå i mål. Sidequests är krydda, inte bärande balk.
5. **Korsa lagen.** En sidequest som bara går inom ett lag missar poängen. Låt den dra folk över skutgränser.
6. **Ge en handling, inte en känsla.** "Var svartsjuk" går inte att spela. "Ta reda på vad hon lade i fiskens gap innan hon hinner tillbaka" går att spela.
7. **Vet mottagaren att det är en sidequest?** Nej. Det ska stå i deras intrigfil som vilken intrig som helst.

## Balansräkning

Fylls i så att ingen får för många och ingen får noll. Målet från [`premiss.md`](premiss.md): var och en har minst en roll i huvudstoryn.

| slug | Antal sidequests | Roll i huvudstoryn | Akt där personen toppar |
|------|------------------|--------------------|-------------------------|
| `malintadaa` | | antagonist | IV |
| `gustaftadaa` | | budbärare, spelledare | IV |
| `petterwallberg` | | | |
| `linneaappert` | | | |
| `ulrikahammar` | | | |
| `jesperlindmarker` | | | |
| `louisevonbahr` | | | |
| `josefinlowing` | | | |
| `navidmodiri` | | | |
| `minimacklin` | | | |
| `ludvigvonbahr` | | | |
| `amaliawahlstrom` | | | |
| `fabianmacklin` | | | |
| `josefinansund` | | | |
| `johannabergman` | | | |
| `jesperlejfjord` | | | |
| `amandamungsgard` | | | |
| `viktoransund` | | | |
| `elinamelakoski` | | | |
| `minervalowgren` | | | |
| `chriskummelstedt` | | | |
| `linneaekbom` | | | |
| `alexandrapalmquist` | | | |
| `hampuslindblad` | | | |
| `edvinthungren` | | | |
| `elinmartensson` | | | |

**Spridningsregel:** alla toppar får inte ligga i akt IV. Sikta på ungefär en fjärdedel i akt II, en fjärdedel vid brunchen och ritualen, resten i akt IV.

## Uppslag från befintligt material

Kopplingar i `romanser.yaml` och `fiender.yaml` som är särskilt lämpade att dras in i huvudstoryn, eftersom de redan har tryck och redan korsar skutor:

- **Skäggtrion**, alltså Lösskägg, Rödskägg och Blåskägg (fiender 3, 18, 19). Tre skutor, en pågående kröningsstrid, färdig för ett publikt prov.
- **Kalle Anka som allas problem** (romanser 1, 15, 16 och fiender 9, 15, 16). Sex personer knutna till en person. Perfekt bärare av något han inte förstår värdet av.
- **Barnsben som allas åtrå** (romanser 4, 5, 6 och fiender 12, 13). Fyra personer i ett nät. Bra grindvakt, eftersom folk gör tjänster för henne.
- **Enben mot Malin** (fiende 2). Den enda etablerade fiendskapen som går direkt mot Malin. Sannolikt vår viktigaste ingång till huvudstoryn.
- **Hjärter och Felix, båda hemligt förälskade i Malin** (romanser 17, 18). De vet om varandra. Två vittnen som vill henne väl och därför kan bära obekväm sanning.
- **Rötägg som allas fiende** (fiender 6, 13, 14). Naturlig skurk i huvudstoryn, någon man kan tro på som förrädare.
