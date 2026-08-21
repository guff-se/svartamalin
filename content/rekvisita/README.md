# Rekvisita: texter att trycka

Gästerna läser det här **på papper**, på ön. Inte på sajten. Inte i UI. Filerna globbas inte av `src/lib/intriger.js` och inte av `practical-info.js`.

Det här är inte [`huvudstory/`](../huvudstory/README.md). Designen av vad papperet *gör* i spelet ligger där. Här ligger **själva texten** som ska stå på rekvisitan.

Karta för hela `content/`: [`../README.md`](../README.md).

---

## Vad som hör hit

Brev, kontrakt, dagboksblad, lappar, skuldbrev, skyltar och allt annat som skrivs ut eller handskrives och sedan används som prop.

Inte:

- Intrigtext till inloggad gäst (`../intriger/`)
- Sajtens brödtext (`../copy/`)
- Spelledning, facit, kanon (`../huvudstory/`)

---

## Röst

Varje tryckt text talar med **den fiktiva avsändarens röst**. Inte STYLE.md (ingen revy, ingen du-form till deltagaren). Inte intern agentprosa.

Karl XII skriver som kung. Malin skriver som Malin. En IOU skriver som den som är skyldig.

Aldrig em dash. Komma, kolon eller punkt.

Ingen tryckt text får spoila metaregeln (alla dör, Malin blir Ran) eller sista versens utgång.

---

## Filformat

Varje fil har två lager, i den ordningen:

1. **Intern ram.** Vad prop:en är, var den ligger, när den läses, hur lång högläsning, konsistens mot kanon. Tydlig prosa för en framtida agent.
2. **Tryck.** Exakt den text som ska stå på papperet. Inget mer. Det avsnittet kopieras till tryck eller handskrift.

Lägg inte facit, bypass eller spelledning i Tryck-avsnittet.

---

## Register

| Fil | Prop | Var | Status |
|-----|------|-----|--------|
| [`karl-xii-karleksbrev.md`](karl-xii-karleksbrev.md) | K-07. Kärleksbrev från Karl XII, som också är kontraktet | Malins kista, öppnas ca 20.00 | utkast |
