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
2. **Max 10 rader meta** totalt (frontmatter + titel + en kort rad om vad papperet är).
3. **`## Tryck`**, sedan exakt den text som ska stå på papperet.

Skriv inte högläsning, bypass, noder, laddtid eller får-inte-listor i rekvisitafilen. Agenten ska skriva papperstexten, inte beskriva den.

Röst: den fiktiva avsändaren. Inte STYLE.md. Aldrig em dash. Ingen metaregel, ingen sista vers. Explicit språk är tillåtet när det passar avsändaren. Samma sexpositiva register som intrigerna: lust och sex, inte pryd romankärlek.

**Filnamn:** `{spår}-{typ}-{n}-{funktion}.md`. Quest först, sen vad papperet är, sen ordning, sen funktion. Exempel: `Q2-dagbok-1-namnet.md`. Saker som inte är en quest: `kista-karleksbrev.md`.

---

## Register

| Fil | Taggar | Vad | Var |
|-----|--------|-----|-----|
| [`kista-karleksbrev.md`](kista-karleksbrev.md) | `kista`, `B-42`, `K-07` | Kärleksbrev från Karl XII | Malins kista |
| [`Q1-dagbok-1-fore.md`](Q1-dagbok-1-fore.md) | `Q-1`, `Q1-01` | Dagboksblad före förräderiet | Gubben och Gumman |
| [`Q1-dagbok-1-baksida.md`](Q1-dagbok-1-baksida.md) | `Q-1`, `Q1-01` | Vägvisning, baksida av samma blad | Gubben och Gumman |
| [`Q1-dagbok-2-efter.md`](Q1-dagbok-2-efter.md) | `Q-1`, `Q1-04` | Dagboksblad efter hämnden | Klätternätet |
| [`Q2-dagbok-1-namnet.md`](Q2-dagbok-1-namnet.md) | `Q-2`, `B-17`, `Q2-07` | Uppbrottet, namnet Svarta, pekar mot Ottos grav | Piratstugan |
| [`Q2-dagbok-2-handlingen.md`](Q2-dagbok-2-handlingen.md) | `Q-2`, `B-17`, `Q2-08` | Bygget och rätten att preja | Piratstugan |
| [`Q2-dagbok-3-tillflykten.md`](Q2-dagbok-3-tillflykten.md) | `Q-2`, `B-17`, `Q2-09` | Tillflykten, nutid | Piratstugan |
