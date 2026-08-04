# Best practice: lajvintriger och escape rooms

Destillerat underlag för designarbetet. Varje avsnitt slutar med **Vad det betyder för oss**, alltså den konkreta konsekvensen för Ovanan.

---

# Del 1: Lajvdesign och intriger

## 1.1 Spelbarhet slår bakgrund

Den mest konsekventa slutsatsen i nordisk lajpdesign är att **relationer och drivkrafter** ger spel, medan långa bakgrundshistorier inte gör det. Ett kort papper med tre skarpa relationer producerar mer spel än fem sidor livshistoria.

Rekommenderad uppsättning per karaktär (Kaisa Kangas m.fl., *Plot and Character Design*, Knutepunkt 2019):

1. **Huvudintrig** som personen själv driver
2. **Spegelkontakt**, alltså någon vars intrig är kopplad till din
3. **Inkluderande eller positiv kontakt**, någon som drar in dig i spel när du hamnar utanför
4. **Konflikt eller dilemma**
5. **Överraskning**, något som kommer utifrån och som du inte kan planera för

Balansera **aktiva** intriger, alltså sådana du själv sätter igång, mot **passiva**, alltså sådana som drabbar dig.

**Vad det betyder för oss:** vår befintliga struktur täcker 1, 2 och 4 väl genom `romanser.yaml` och `fiender.yaml`. Huvudstoryn ska framför allt leverera **3 och 5**: den positiva kontakten som drar in folk som hamnat utanför, och överraskningen utifrån. Det är precis vad en huvudstory med sidequests är bra på.

## 1.2 Varför nu

En intrig utan tidspress spelas aldrig. Standardrådet är att bygga in ett skäl att det måste avgöras **nu**, under just den här helgen, samt att skapa triggers och hooks som gör intrigen dramatisk.

**Vad det betyder för oss:** vi har det redan i STYLE.md som krav tre. För huvudstoryn behövs samma sak per akt, inte bara per intrig. Varje akt måste ha en deadline i fiktionen. Brunchen 14.00, ritualen 15.30 och festen 20.00 är naturliga deadlines att hänga fiktion på.

## 1.3 Hemligheter behöver flera bärare

Om en hemlighet bara finns hos en person avslöjas den ofta aldrig. Standardrådet: se till att **tillräckligt många karaktärer känner andras hemligheter**, och att de har en motivation att blanda sig i. Gör en plan för hur varje hemlighet avslöjas, plus en backup, plus en backup för backupen.

**Vad det betyder för oss:** för varje kritisk story-information ska vi lista minst **två oberoende vägar** till den, plus en spelledarväg. Detta blir en obligatorisk kolumn i [`akter.md`](akter.md). Vi har dessutom en gratis mekanism i Gubben i stubben som kan mata in information som "rykte" utan att vi behöver bryta fiktionen.

## 1.4 Trianglar, inte dueller

Tvåpersonskonflikter blir platta. Rådet är att lägga till personer så att trianglar, vittnen, budbärare och rivaler om samma byte uppstår. Notera dock att ren triangeldramatik är utnött i sig, så bygg **kedjor och nät** av intriger snarare än isolerade trianglar.

**Vad det betyder för oss:** samma regel som STYLE.md redan har om minst tre inblandade. För huvudstoryn: undvik "laget löser pusslet mot spelledaren". Bygg istället så att lag A behöver något som lag B har och lag C vill förhindra.

## 1.5 Play to lose och play to lift

*Play to lose* betyder att spelaren letar efter tillfällen att låta sin karaktär förlora, eftersom nederlag ger bättre drama. Karaktären försöker fortfarande vinna. *Play to lift* är komplementet: ansvaret för ditt drama ligger också hos medspelarna, som ska lyfta dig och ge dig dina segrar. Utan lift blir lose bara deprimerande.

*Ensemble play* beskriver samma sak strukturellt: en **solo** är initiativet att sätta ton eller riktning, och en solo får sin kraft av **ackompanjemang**. Om ingen bekräftar mordet på kungen så hände det inte.

**Vad det betyder för oss:** vår manifesttext säger redan play to lose. Vi bör lägga till **play to lift** explicit i gästkommunikationen, alltså instruktionen att hänga på andras initiativ och ge folk deras segrar. Det finns delvis i `manifest_play.md` men kan skärpas. För designen: varje pussel måste ha ett sätt att lyftas kollektivt. Om ett lag löser något ska de kunna göra det **inför** andra så att triumfen är social.

## 1.6 River rafting: tidig intensitet

En pacing-modell (från *Anatomy of Larp Thoughts*, Knutpunkt 2025) med tre principer:

1. Karaktärer och miljö som är **omedelbart spelbara**, alltså många och komplexa relationer, inte mycket lore
2. **Få men tydliga mekaniker** som spelarna får öva i workshop
3. **Tidig intensitet.** Starta med spänt innehåll och mycket designad struktur i början

Poängen: du kan bara ge meningsfull övergripande struktur **tidigt**. I slutet driver deltagarna sig själva, och då blir designad struktur irrelevant eller i värsta fall i vägen. Motsatsen, alltså att bygga upp mot "the Big Plot" i slutet, är en känd fälla.

**Vad det betyder för oss:** detta är den viktigaste enskilda insikten för vår helg. Slutstriden 20.00 är redan given och kräver ingen uppbyggd mekanik. Vår designenergi ska ligga på **lördag 10.30 till 14.00**. Om förmiddagen brinner så sköter sig kvällen. Lägg alltså inte det mest komplicerade pusslet sist.

## 1.7 Workshop före spel

Workshoppens huvudfunktion är att göra deltagarna till ett kollektiv som kan skapa scener för varandra. Den ska också kalibrera relationer, öva mekaniker och sätta spelstil. Konkret rekommendation: låt par och grupper med förskrivna relationer få några minuter att prata igenom vad relationen innebär och var deras gränser går, särskilt för romantiska relationer. Låt folk **öva på att vara elaka** om lajvet kräver elakhet, annars kommer bra intriger aldrig igång.

**Vad det betyder för oss:** vi har ingen formell workshop, men vi har fredagen. Fredag kväll **är** vår workshop, fast förklädd till fest. Två saker bör designas in medvetet:

- Ett tillfälle där personer med romans eller fiendskap får prata ihop sig kort, i eller ur roll
- Transitionen 10.30 på lördagen som en minimal workshop, alltså tre minuter övning i att vara sin pirat plus en påminnelse om säkerhetssignaler

## 1.8 Alibi och det ritualiserade insteget

*Alibi* är den sociala överenskommelse som gör att du kan göra saker i roll som du inte skulle göra som dig själv. Alibi stärks av kostym, av tydliga mekaniker, av att gruppen behandlar din roll som legitim, och framför allt av att **in- och utsteget i den magiska cirkeln ritualiseras** i tid och rum. Motsatsen till alibi är tvekan och rädsla.

Aura, alltså kollektiv legitimering, kräver också pacing: om allas karaktärsberättelser toppar samtidigt blir det kakofoni där ingen är intresserad av någon annans storhet. Ge var och en sina 15 minuter i rampljuset.

**Vad det betyder för oss:** vi har ett svagt insteg som det ser ut nu, eftersom fredagen glider in i roll utan markering och lördagen börjar med frukost off live. Transitionen 10.30 är därför inte en trivialitet utan **själva alibi-generatorn**. Utsteget behöver också markeras: Spaders slöjor och sång gör det redan, men söndagens de-roling bör finnas.

Konsekvens för fördelningen av rampljus: se [`fordelning.yaml`](fordelning.yaml), där varje deltagares topp ska taggas med vilken akt den ligger i, så att vi kan sprida dem.

## 1.9 Säkerhet och kalibrering

Etablerade verktyg, alla enkla nog att lära ut i en mening var:

| Verktyg | Gest eller ord | Betydelse |
|---------|----------------|-----------|
| **OK-check** | Handen visar OK-tecknet, ögonkontakt | "Är du okej?" Svar: tummen upp betyder okej, tummen ner eller vaggande hand betyder inte okej, och då bryter man roll och hjälper |
| **Lookdown** | Handen som solskydd över ögonen, backa och gå | Jag lämnar scenen, av vilket skäl som helst. Inga frågor, inga konsekvenser. Fungerar även för att kliva in obemärkt |
| **Cut** | Ordet "cut" | Allt spel stannar omedelbart. Ingen frågar varför |
| **Largo** eller **brake** | Ordet "largo" | Sänk intensiteten ett steg, alla tar ett steg tillbaka som bekräftelse. Spelet fortsätter |

Lookdown är minst störande för andras spel och därför bäst som förstahandsverktyg. Cut ska vara okränkbart.

**Vad det betyder för oss:** vi har 26 vänner, alkohol, nakenhet, bad, en fysisk slutstrid och LSD. Det är inte ett sammanhang där vi kan hoppa över detta. Rekommendation: lär ut **exakt tre** verktyg, alltså cut, largo och lookdown, plus OK-checken. Fler blir ihågkomna av ingen. De ska nämnas fredag kväll och repeteras i transitionen 10.30. Detaljerad plan i [`spelledning.md`](spelledning.md).

## 1.10 Ritualscener som fungerar

Från nordisk praktik kring improviserade lajvritualer:

- Bestäm **vad ritualen handlar om** innan den börjar, och gör det tydligt för deltagarna så de kan reagera i roll
- Ritualen behöver en **ledare** som är övertydlig med när cirkeln skapas och bryts, och vad olika händelser betyder, alltså "om hon faller till golvet har vi misslyckats"
- Deltagarna har både rätt och skyldighet att bidra med ljud, rörelse och idéer
- **Kollektiv vokalisering och synkron rörelse** är den mest tillgängliga tekniken, eftersom den inte kräver träning. En drone, en klapprytm, en flock som rör sig tillsammans
- Improviserade grupper rör sig alltid mot högre och högre intensitet. Ledaren behöver därför tydliga tecken för att **sänka** volym och **avsluta** sekvenser, annars tar det aldrig slut
- Bryt cirkeln explicit i slutet

**Vad det betyder för oss:** ritualen 15.30 ska ledas av en namngiven person med förberedda handtecken, ha en deklarerad innebörd i fiktionen, och bygga på sång och rörelse snarare än text. Se [`ritual.md`](ritual.md). Eftersom den sammanfaller med LSD-intag behöver den vara **kortare och enklare** än vad som känns nödvändigt.

## 1.11 Att fördela hemlig information

Från megagame-design, som löser exakt vårt problem, alltså många deltagare och ofullständig information:

- Centralisera inte kunskap. Gör spelarna **beroende av varandra**: den som vill veta något har inte förmågan att ta reda på det, och den som har förmågan har egna mål
- Ge folk **konkret formulerade** förmågor och uppdrag. Vaga uppmaningar ignoreras i ett stökigt spel
- En spelare eller ett lag ska aldrig känna att det inte fanns något de kunde ha gjort för att förhindra sin undergång. Om något läcker, låt det läcka som en **brödsmulespår** som offret kan följa
- Sätt ett kort namn på varje handling eller förmåga så att spelare kan referera till dem
- Ta bort allt som inte används. Dödvikt i regler och roller är värre än för lite innehåll

**Vad det betyder för oss:** designprincipen blir "**vilja utan förmåga, förmåga utan vilja**". Den som vill komma åt skelettet på Södra Ovanan ska inte vara den som kan köra ekan. Den som kan tolka skylten i kikaren ska inte vara den som vet var man ska sikta. Detta skapar handel, tjänster och svek automatiskt, alltså exakt lördagens tema.

---

# Del 2: Escape room-design

## 2.1 Pusselberoendegrafen

Grundverktyget är **puzzle dependency chart** (Ron Gilbert), alltså en riktad acyklisk graf över vad som låser upp vad. Det är inte ett flödesschema: det visar logiska beroenden, inte spelarens väg.

Regler:

- Grafen måste vara **acyklisk**. Ingen ledtråd eller nyckel får ligga bakom det pussel den låser upp
- Designa **baklänges** från slutmålet: vad krävs för finalen, vad krävs för det, och så vidare
- Formen du vill se är en kedja av **diamanter**: ett löst pussel öppnar två eller tre nya, som sedan konvergerar till en lösning som öppnar nya
- Undvik långa enkelspår. Om pussel sju kräver sex som kräver fem, så stannar hela sessionen när fem fastnar. Sikta på **två eller tre parallella banor** som konvergerar vid ett slutlås
- Om en sträcka måste vara linjär, gör de pusslen **lätta**
- Sätt chokepoints bara vid stora berättelsesteg

Enkätdata från branschen (Nicholson 2015, 175 anläggningar): 45 procent använder path-based struktur med parallella sekvenser, 37 procent rent sekventiell.

**Vad det betyder för oss:** vi har fem lag och en ö, inte ett rum och fyra personer. Vår graf måste ha minst **fem ingångar**, alltså en per skuta, som konvergerar. Att rita grafen är obligatoriskt innan något pussel byggs. Mall och notation i [`pussel.md`](pussel.md).

## 2.2 Ledtrådsregler

Från *13 Rules for Escape Room Puzzle Design* och kursmaterial i escape room-design:

| Regel | Innebörd |
|-------|----------|
| **Cluea allt** | Varje okänt moment ska ha en ledtråd. Spelaren ska aldrig behöva gissa vilken sorts svar som söks |
| **Ett svar** | Ett pussel har exakt en lösning |
| **Självvaliderande** | Spelaren ska själv veta att svaret är rätt. Ett lås som öppnas, en bild som blir hel, ett ord som blir läsbart |
| **Tydlig koppling** | Ledtråd och pussel ska höra ihop synligt, genom tema, färg, plats, ljus eller sammanhang. Inte genom att vi märker dem A och B |
| **Aha ska hålla** | Korrelationen ska vara logisk för spelaren, inte bara i designerns huvud. Frågan att ställa: varför skulle någon lösa det så här, och pekar alla ledtrådar dit? |
| **Max fem minuter** | Ett enskilt pussel bör inte ta längre. Annars dela upp det |
| **Inga röda sillar** | Spelarna är förvirrade redan. Vilseledning är inte svårighet, det är grymhet |
| **Återanvänd inte ledtrådar** | Varje ledtråd används exakt en gång, annars uppstår tvetydighet |
| **Ingen utomstående kunskap** | Logik och enkel matematik kan antas. Inget annat. Ge ledtråd för allt utöver det |
| **Följ dina egna mönster** | Om två pussel ser likadana ut ska de lösas likadant |

Vanligaste pusseltyper i verkliga rum: söka fysiska föremål 78 procent, lagkommunikation 58 procent, ljus 54 procent, räkning 53 procent, lägga märke till något uppenbart 49 procent, symbolsubstitution med nyckel 47 procent, använda något på ett oväntat sätt 47 procent.

Vanligaste klagomålen från entusiaster: för mycket sökande, för många röda sillar, logiska hopp, dålig cluing, för mycket matematik, pussel som tar för lång tid.

**Vad det betyder för oss:** tre saker att vakta särskilt.

1. **Ingen matematik.** Vår publik är berusad, i kostym och delvis påverkad. Räkning och kodlås med siffror är dåliga val.
2. **Sökande är billigt men blir tråkigt.** Svärdfiskens gap är ett fantastiskt gömställe, men "leta överallt" som mekanik håller i tio minuter, inte tre timmar.
3. **Ljus, kikare, mörker och kropp** är våra starka kort. Piratstugan har kamin och eldstad, alltså mörker och eldsken. Kikaren är en optisk mekanik. Onsen och klätternätet är kroppsliga. Bygg på dessa istället för på papper och siffror.

## 2.3 Hintsystem

Ge hints. Alltid. Rekommendationen är en **trappa** i flera steg, som erbjuds efter några minuters stiltje på det aktiva pusslet, och att hintsystemet är en del av rummets fiktion. Notera vilka pussel som konsekvent kräver de djupaste hintarna och skriv om eller stryk dem.

**Vad det betyder för oss:** vi har en färdig fiktiv hint-maskin i **Gubben i stubben**, som sitter på en ljugarbänk. En orakelgestalt som ljuger är den perfekta hint-mekanismen, eftersom den kan ge både sanning och halvsanning utan att bryta fiktionen, och eftersom spelarna själva måste tolka. Det kräver att någon bemannar eller förbereder gubben. Se [`spelledning.md`](spelledning.md).

Hint-trappa vi använder, fyra steg, obligatorisk för varje pussel i [`pussel.md`](pussel.md):

1. **Riktning:** "Har ni tittat i vardagsrummet?"
2. **Objekt:** "Fisken har ett gap."
3. **Metod:** "Något ligger i gapet, och det ska hållas mot ljuset."
4. **Lösning:** spelledaren ger svaret och spelet går vidare.

## 2.4 Lås- och pusseltyper

Beskriv varje lås med typ, så att variationen går att kontrollera i grafen:

- **Kodlås:** siffror, bokstäver, symboler. Ledtråden måste ange både ordning och alfabet
- **Nyckellås:** fysisk nyckel med unik form. Återanvänd aldrig samma nyckelform som villospår
- **Sekvenslås:** tryck, vrid, ordna. Ge hörbar eller synlig bekräftelse per steg
- **Logiklås:** koppla, komplettera en krets, blanda i rätt proportion. Lär ut regeln på en övningspanel först
- **Metalås:** kräver output från två olika banor. Passar bäst som final

**Vad det betyder för oss:** vår final ska vara ett **metalås** som kräver bidrag från flera skutor samtidigt, eftersom det tvingar fram förhandling och därmed svek. Det är den enda konvergenspunkten vi behöver, och den bör ligga strax före brunchen så att förhandlingen kan fortsätta vid bordet.

## 2.5 Tillgänglighet och testning

- Koda aldrig information med **bara** färg. Kombinera färg med form
- Playtesta och observera var folk tvekar. Justera synlighet, inte svårighet
- Var beredd att stryka noder som inte fungerar

**Vad det betyder för oss:** vi kan inte playtesta med 26 personer i förväg, så vi kompenserar med generositet: allt lite enklare än det känns nödvändigt, och en spelledare som får ge bort svar utan att skämmas. Det vi **kan** testa i förväg är kikaren mot skylten och tändstickor eller lampor i piratstugan. Det bör göras på ett förbesök.

---

# Del 3: Syntes, tio designregler för Ovanan

1. **Förmiddagen är produktionen, kvällen sköter sig själv.** Lägg energin på 10.30 till 14.00.
2. **Vilja utan förmåga, förmåga utan vilja.** Splittra alltid önskan och kapacitet mellan olika personer eller skutor.
3. **Två oberoende vägar till varje kritisk information**, plus en spelledarväg.
4. **Två eller tre parallella banor**, aldrig en linjär kedja. Ingen ska vänta på någon annan.
5. **Kropp, ljus och optik framför papper och siffror.** Ingen matematik, ingen lång läsning.
6. **Ett pussel, max fem minuter.** Längre saker delas upp.
7. **Inga röda sillar.** Förvirringen är gratis, vi behöver den inte.
8. **Gubben i stubben är hintsystemet.** Fyra steg i trappan, oraklet får ljuga men aldrig blockera.
9. **Efter 15.30 finns inga pussel.** Bara kropp, sång, bild och känsla.
10. **Dramat vinner alltid över mekaniken.** Om någon vill göra något vansinnigt och roligt så låt pusslet gå sönder.

---

## Källor

**Lajv**

- Kaisa Kangas m.fl., *Plot and Character Design*, Knutepunkt 2019: [nordiclarp.org](https://www.nordiclarp.org/wp-content/uploads/2019/02/Plot-and-character-design_KP-2019.pdf)
- *Anatomy of Larp Thoughts*, Knutpunkt 2025, avsnittet om River Rafting design: [nordiclarp.org](https://www.nordiclarp.org/wiki/images/3/34/KP25_PDF_-_small_single_pages.pdf)
- Simon Brind, *Play to Lift, not Just to Lose*: [nordiclarp.org](https://www.nordiclarp.org/2018/02/21/play-lift-not-just-lose/)
- *Ensemble Play*: [nordiclarp.org](https://www.nordiclarp.org/2020/05/11/ensemble-play/)
- *Creating Aura*: [nordiclarp.org](https://www.nordiclarp.org/2021/09/13/creating-aura/)
- *Alibi*, Nordic Larp Wiki: [nordiclarp.org](https://www.nordiclarp.org/wiki/Alibi)
- Johanna Koljonen, *Larp Safety Design Fundamentals*: [jarps.net](https://jarps.net/journal/article/view/16/23)
- Maury Brown och Sarah Lynne Bowman, *Safety and Calibration Design Tools and Their Uses*: [nordiclarp.org](https://www.nordiclarp.org/2018/01/24/safety-calibration-design-tools-uses/)
- *Group Improvisation of Larp Rituals*: [nordiclarp.org](https://www.nordiclarp.org/2018/02/27/group-improvisation-larp-rituals/)
- Emily Care Boss, *Notes on Ritual Improv*: [larpwright.efatland.com](https://larpwright.efatland.com/?p=600)
- Lizzie Stark, *How to Plan a Basic Pre-Larp Workshop*: [leavingmundania.com](https://leavingmundania.com/2013/11/21/plan-basic-pre-larp-workshop/)

**Escape rooms och hemlig information**

- Ron Gilbert, *Puzzle Dependency Charts*: [grumpygamer.com](https://grumpygamer.com/puzzle_dependency_charts/)
- Scott Nicholson, *Peeking Behind the Locked Door*, 2015: [scottnicholson.com](https://scottnicholson.com/pubs/erfacwhite.pdf)
- Scott Nicholson, *The State of Escape*: [scottnicholson.com](https://scottnicholson.com/pubs/stateofescape.pdf)
- *13 Rules for Escape Room Puzzle Design*, the Codex: [thecodex.ca](https://thecodex.ca/13-rules-for-escape-room-puzzle-design/)
- *Designing escape rooms*, kursmaterial CVUT: [courses.fit.cvut.cz](https://courses.fit.cvut.cz/NI-ESC/lectures/files/esc-room-design.pdf)
- Wiemker m.fl., *Escape Room Games*: [thecodex.ca](https://thecodex.ca/wp-content/uploads/2016/08/00511Wiemker-et-al-Paper-Escape-Room-Games.pdf)
- *Controlling the Narrative, thoughts on the Plot Control role*, Megagame Assembly: [megagameassembly.com](https://www.megagameassembly.com/blog/controlling-the-narrative-some-thoughts-on-the-plot-control-role)
