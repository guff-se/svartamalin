# Rekvisita: texter att trycka

Gästerna läser det här **på papper**, på ön. Inte på sajten. Inte i UI.

Här ligger **själva texten**. Design, spelledning, högläsning, facit och konsistens hör hemma i [`../huvudstory/`](../huvudstory/README.md), inte i filerna här.

---

## Filformat

Varje fil:

1. **YAML-frontmatter** med taggar, så det syns vilket spår filen tillhör. Använd de som gäller:
   - `quest:` `Q-1` … `Q-5`
   - `story:` t.ex. `kista` när det inte är en quest
   - `beat:` `B-42` osv.
   - `prop:` `Q1-01`, `K-07` osv.
   - `dagbok:` `1` … `8` när papperet är ett utrivet blad ur Malins dagbok. Talet **Blad N** är första raden under `## Tryck`. Inte på vägvisningsbaksidor. Kronologi: [`../huvudstory/quests.md`](../huvudstory/quests.md).
2. **Max 10 rader meta** totalt (frontmatter + titel + en kort rad om vad papperet är).
3. **`## Tryck`**, sedan exakt den text som ska stå på papperet.

Skriv inte högläsning, bypass, noder, laddtid eller får-inte-listor i rekvisitafilen. Agenten ska skriva papperstexten, inte beskriva den.

Röst: den fiktiva avsändaren. Inte STYLE.md. Aldrig em dash. Ingen metaregel, ingen sista vers. Explicit språk är tillåtet när det passar avsändaren. Samma sexpositiva register som intrigerna: lust och sex, inte pryd romankärlek.

**Filnamn:** `{spår}-{typ}-{n}-{funktion}.md`. Quest först, sen vad papperet är, sen ordning, sen funktion. Exempel: `Q2-dagbok-1-namnet.md`. Saker som inte är en quest: `kista-karleksbrev.md`.

---

## Register

| Fil | Taggar | Vad | Var |
|-----|--------|-----|-----|
| [`kista-karleksbrev.md`](kista-karleksbrev.md) | `kista`, `B-42`, `K-07` | Kärleksbrev från Karl XII. Enda plot-relevanta i kistan. | Malins kista |
| [`kista-dressing-1-natt.md`](kista-dressing-1-natt.md) | `kista`, `B-42`, `K-06` | Lapp från kungen. Dressing. | Malins kista |
| [`kista-dressing-2-rummet.md`](kista-dressing-2-rummet.md) | `kista`, `B-42`, `K-06` | Lapp från kungen. Dressing. | Malins kista |
| [`Q1-dagbok-1-fore.md`](Q1-dagbok-1-fore.md) | `Q-1`, `Q1-01`, blad 1 | Dagboksblad före förräderiet | Gubben och Gumman |
| [`Q1-dagbok-1-baksida.md`](Q1-dagbok-1-baksida.md) | `Q-1`, `Q1-01`, blad 1 | Vägvisning, baksida av samma blad. Inte bladnummer. | Gubben och Gumman |
| [`Q1-dagbok-2-efter.md`](Q1-dagbok-2-efter.md) | `Q-1`, `Q1-04`, blad 4 | Dagboksblad efter hämnden | Klätternätet |
| [`Q2-dagbok-1-namnet.md`](Q2-dagbok-1-namnet.md) | `Q-2`, `B-17`, `Q2-07`, blad 2 | Uppbrottet, namnet Svarta, pekar mot Ottos grav | Piratstugan |
| [`Q2-dagbok-2-handlingen.md`](Q2-dagbok-2-handlingen.md) | `Q-2`, `B-17`, `Q2-08`, blad 3 | Bygget och rätten att preja | Piratstugan |
| [`Q2-dagbok-3-tillflykten.md`](Q2-dagbok-3-tillflykten.md) | `Q-2`, `B-17`, `Q2-09`, blad 8 | Tillflykten, nutid | Piratstugan |
| [`Q3-dagbok-1-ombord.md`](Q3-dagbok-1-ombord.md) | `Q-3`, `B-19`, `Q3-01`, blad 5 I | Ombord på egen korvett. Fastsatt. Pekar mot vedhögen. Inte skiffernyckeln. | Gymmet |
| [`Q3-dagbok-2-prejningen.md`](Q3-dagbok-2-prejningen.md) | `Q-3`, `B-19`, `Q3-02`, blad 5 II | Gömd lagfart i klartext. Fastsatt. Sista raden Caesar +13. Inte prejning. | Vedhögen bakom bastun |
| [`Q3-agarbevis.md`](Q3-agarbevis.md) | `Q-3`, `B-19`, `Q3-03` | Malin till Malin. Piraternas lagar. Tas. | Under badbryggan |
| [`Q4-dagbok-1-hamnen.md`](Q4-dagbok-1-hamnen.md) | `Q-4`, `B-20`, `Q4-02`, blad 6 | Hon får Ovanan. Byte och löfte. Fastsatt i *Tomtebobarnen*. | Hyllan i Storstugan |
| [`Q4-kompass.md`](Q4-kompass.md) | `Q-4`, `B-20`, `Q4-03` | Tryckt kompassbild. Nålen är sann bäring. Sikta genom glaset. Fastsatt. Inte dagbok. | I *Tomtebobarnen* |
| [`Q5-dagbok-1-skulderna.md`](Q5-dagbok-1-skulderna.md) | `Q-5`, `B-18`, `Q5-03`, blad 7 | Hon håller havet med mäns skulder. Kistan. | Svärdfiskens mun |
| [`kista-skuldbrev.md`](kista-skuldbrev.md) | `kista`, `Q-5`, `B-42`, `K-10` | Tre skuldbrev, ett per manlig Q-5-start. Namn vid tillsättning. | Malins kista |
