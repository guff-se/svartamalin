# Rekvisita: texter att trycka

Gästerna läser det här **på papper**, på ön. Inte på sajten. Inte i UI.

Här ligger **själva texten**. Design, spelledning, högläsning, facit och konsistens hör hemma i [`../huvudstory/`](../huvudstory/README.md), inte i filerna här.

---

## Filformat

Varje fil:

1. **YAML-frontmatter** med taggar, så det syns vilket spår filen tillhör. Använd de som gäller:
   - `quest:` `Q-1` … `Q-5`
   - `pussel:` `P-02` osv.
   - `story:` t.ex. `kista` när det inte är en quest
   - `beat:` `B-42` osv.
   - `prop:` `Q1-01`, `K-07` osv.
2. **Max 10 rader meta** totalt (frontmatter + titel + en kort rad om vad papperet är).
3. **`## Tryck`**, sedan exakt den text som ska stå på papperet.

Skriv inte högläsning, bypass, noder, laddtid eller får-inte-listor i rekvisitafilen. Agenten ska skriva papperstexten, inte beskriva den.

Röst: den fiktiva avsändaren. Inte STYLE.md. Aldrig em dash. Ingen metaregel, ingen sista vers.

---

## Register

| Fil | Taggar | Vad | Var |
|-----|--------|-----|-----|
| [`karl-xii-karleksbrev.md`](karl-xii-karleksbrev.md) | `kista`, `B-42`, `K-07` | Kärleksbrev från Karl XII | Malins kista |
| [`malin-dagboksblad-fore.md`](malin-dagboksblad-fore.md) | `Q-1`, `P-02`, `Q1-01` | Dagboksblad före förräderiet | Gubben och Gumman |
| [`malin-dagboksblad-efter.md`](malin-dagboksblad-efter.md) | `Q-1`, `P-03`, `Q1-04` | Dagboksblad efter hämnden | Klätternätet |
