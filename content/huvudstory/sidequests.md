# Sidequests

Intern text för Gustaf och agenten. Gäster läser inte detta. Tydlig prosa, ingen STYLE.md.

Sidospår i huvudstoryn som bara rör vissa deltagare. Skiljer sig från de individuella intrigerna i `../intriger/guests/` på ett sätt: **sidequests är kopplade till huvudstoryn**, romanser och fiendskaper är inte.

En sidequest är kort. En sak att göra, en person att göra den med eller mot, ett skäl att det sker under helgen.

---

## Sidequest-mall

```
## S-nn: Namn

Akt:            I / II / III / IV
Deltagare:      Piratnamn (slug), ...
Roll i storyn:  bärare / jägare / grindvakt / vittne
Kopplad till:   B-nn i akter.md, Q-n i quests.md

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
| S-01 | Jakten på älskaren | Hjärter, Felix, Blodig. Malin leder fel. | II | jägare / bärare | beslutad |
| S-02 | Skäggtrion | Lösskägg, Rödskägg, Blåskägg | II | rivaler | beslutad |

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
| `malintadaa` | 1 | antagonist, bärare | IV |
| `gustaftadaa` | | budbärare, spelledare | IV |
| `petterwallberg` | 1 | rival | II |
| `linneaappert` | | | |
| `ulrikahammar` | | | |
| `jesperlindmarker` | | | |
| `louisevonbahr` | | | |
| `josefinlowing` | 1 | grindvakt | II |
| `navidmodiri` | | | |
| `minimacklin` | 1 | jägare | II |
| `ludvigvonbahr` | | | |
| `amaliawahlstrom` | | | |
| `fabianmacklin` | | | |
| `josefinansund` | | | |
| `johannabergman` | | | |
| `jesperlejfjord` | 1 | jägare | II |
| `amandamungsgard` | | | |
| `viktoransund` | 2 | grindvakt, rival | II |
| `elinamelakoski` | 1 | jägare | II |
| `minervalowgren` | | | |
| `linneaekbom` | | | |
| `alexandrapalmquist` | | | |
| `hampuslindblad` | 1 | rival | II |
| `edvinthungren` | | | |
| `elinmartensson` | | | |

**Spridningsregel:** alla toppar får inte ligga i akt IV. Sikta på ungefär en fjärdedel i akt II, en fjärdedel vid brunchen och ritualen, resten i akt IV.

## S-01: Jakten på älskaren

Akt:            II
Deltagare:      Kapten Hjärter (`jesperlejfjord`), Katten Felix (`elinamelakoski`), Kapten Blodig (`minimacklin`). Svarta Malin (`malintadaa`) bär sanningen.
Roll i storyn:  jägare / bärare
Kopplad till:   B-13, B-42

Vad de vill:    ta reda på vem Malin gömmer
Vad står i vägen: hon leder fel. Rivalen ser ut att sitta vid bordet. Sanningen är Karl XII, och den sitter i kistan.
Varför nu:      festen, närheten, att hon försvinner. Innan sista skålen.

Hur det spelas: de tre jagar bland kaptenerna. Felix bara privat, med Hjärter. Malin varken bekräftar eller förnekar ett namn i hamnen. Flera romanser samtidigt är tillåtna och gömmer den hemliga.
Utfall om ja:   fel person utpekas, scener, svartsjuka. Punchlinen vid kistan blir personlig.
Utfall om nej:  kistan bär det ändå. Miniatyren och kontraktets sista rad.

Bygger på:      romanser 17, 18, 20, 22. Fiende 21 (Hjärter–Blodig) om den spelas.
Speglas hos:    Hjärter och Felix speglar jakten. Malin speglar inte deras kärlek. Blodig enväg.
Status:         beslutad

## S-02: Skäggtrion

Akt:            II
Deltagare:      Kapten Lösskägg (`petterwallberg`), Kapten Rödskägg (`viktoransund`), Kapten Blåskägg (`hampuslindblad`)
Roll i storyn:  rivaler
Kopplad till:   B-15

Vad de vill:    vara Skäggkonung. Eller åtminstone se till att de andra inte är det.
Vad står i vägen: de två andra. Blåskägg har redan krönt sig. Lösskägg samlar skägg. Rödskägg är kränkt.
Varför nu:      tre skäggnamn på samma ö. Festen. Folk som tittar.

Hur det spelas: TBD. Skriv en kul, publik intrig senare. Inte bärande balk. Inte en lång scen långt från kajen: Rödskägg har båtarna.
Utfall om ja:   någon kröns, eller ingen, eller alla tre. Folk har sett det.
Utfall om nej:  fiendskaperna finns kvar. Huvudstoryn går.

Bygger på:      fiender 3, 18, 19
Speglas hos:    alla tre
Status:         beslutad

## Uppslag från befintligt material

Kopplingar i `romanser.yaml` och `fiender.yaml` som är särskilt lämpade att dras in i huvudstoryn, eftersom de redan har tryck och redan korsar skutor:

- **Barnsben som allas åtrå** (romanser 4, 5, 6 och fiender 12, 13). Fyra personer i ett nät.
- **Blodig, Hjärter och Felix om Malin** (romanser 17, 18, 20 och fiende 21). Tre anspråk på jubilaren. De jagar hennes hemliga älskare i hamnen. Sanningen är Karl XII, först i kistan. **S-01, beslutad. Gästtext inte skriven.**
- **Enben mot Malin** (fiende 2). Den enda etablerade fiendskapen som går direkt mot Malin. Sannolikt vår viktigaste ingång till huvudstoryn.
- **Hjärter och Felix, båda hemligt förälskade i Malin** (romanser 17, 18). De vet om varandra. Två vittnen som vill henne väl och därför kan bära obekväm sanning. De jagar rivalen tillsammans, Felix bara privat. **S-01, beslutad. Gästtext inte skriven.**
- **Rötägg som allas fiende** (fiender 6, 13, 14). Naturlig skurk i huvudstoryn. Inte tillsatt som mullvad. Mullvad väljs när questsen är färdigskrivna.
