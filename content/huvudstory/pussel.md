# Lediga pusselbyggstenar

Intern text för Gustaf och agenten. Gäster läser inte detta. Tydlig prosa, ingen STYLE.md.

Den här filen är **bara oanvända byggstenar**. När en bit tillsätts en quest eller en plats: skriv en eller två meningar där den hör hemma, sedan stryk den här.

Tillsatta, inte här:

- Q-1 (halvor vid Gubben och Gumman, påse högt i klätternätet): [`quests/Q-1.md`](quests/Q-1.md)
- Q-2 (stuga, grav, tokens, inget pussel): [`quests/Q-2.md`](quests/Q-2.md)
- Q-3 (gym, vedhög, badbrygga, Caesar +13 framåt hos fyra tvärledtrådar): [`quests/Q-3.md`](quests/Q-3.md)
- Q-4 (Tomtebobarnen, kompassbild, kikare mot skylt): [`quests/Q-4.md`](quests/Q-4.md)
- Q-5 (porträttvägg, svärdfiskens mun, tre lappar): [`quests/Q-5.md`](quests/Q-5.md)
- Cryptex, kista, XII, lösenordskandidat: [`kanon.md`](kanon.md). Runtime: [`spelledning.md`](spelledning.md)
- Platser som redan har funktion: [`platser.md`](platser.md)

Story och får-inte: [`quests.md`](quests.md), per quest i [`quests/`](quests/). Graf och invarianter: [`README.md`](README.md).

---

## När en byggsten tillsätts

Kopiera in i questens **Mekanik** (eller platsraden). Fyll i. Stryk sedan posten här.

```
Typ, plats, vad spelaren gör
Vad som pekar dit
Hur de vet att det är rätt
Hint om de kör fast (riktning → objekt → metod)
Bypass
Props
```

Regler som måste hålla, även efter flytt:

1. Grafen är acyklisk. Ingen ledtråd bakom sitt eget lås.
2. Ett pussel tar max fem minuter.
3. Inga röda sillar. Ingen matematik. Ingen lång läsning.
4. Självvaliderande: spelaren vet själv att det är rätt.
5. Hint-trappa och bypass.
6. Kropp, ljus och optik framför papper och siffror.
7. Ingen brute force. Gåtor pekar. Den som råkar hitta något de inte söker lämnar det. [`spelledning.md`](spelledning.md).

---

## Lediga platser

Fysik som redan finns. Ingen quest äger dem än. Bygg inte noder som kräver en parkerad idé förrän den är tillsatt.

### Verkstadens förrådsrum

Byggbara rum. Escape-rumskandidaten. Tillgänglig hela dagen. Piratstugan är inte escape-rum (Q-2).

Bra: arkiv, kartrum, skattkammare, cell. Öppet: hur många rum, hur mycket ombyggnad.

### Segelbåten vid bojen (Tvåkronan)

Isolering. Två till fyra personer, ingen kan höra dem.

Parkerad idé: ett faktiskt 2-kronorsmynt ombord, se nedan. Samma vattenregel: stängs 13.30, aldrig ensam.

---

## Lediga idéer

Kandidater till pit stop eller skatt. Ursprung: Gustaf, [`egna.md`](egna.md). Får inte byggas förrän de sitter i en quest. Q-3:s Caesar sitter i questen. Q-4:s kikare och skylt sitter i questen. Q-5:s vägg sitter i questen.

### Pacing via mat och fasta tider

Ledtrådar vid brunch, servering eller genomgång, inte när någon råkar hitta dem. Huvudstoryn ska inte kunna lösas före 13.30 bara för att någon startade tidigt.

Passar: bokstäver, kartbitar, skiffernycklar. Passar inte: sista ledtråden (redan låst till kaviar och rom).

### Delad karta

En karta i flera fysiska delar. Alla bitar behövs för att hitta rätt plats.

Krav: minst två oberoende sätt att få ihop bitarna, plus spelledarväg. Kartan får peka mot en plats, inte mot lösenordet.

### Tvåkronan: myntet i båten

Ledtråd ombord, ett svenskt 2-kronorsmynt. Samma vattenregel som båten. Skrivna turer gärna via Kuling eller Rödskägg.

---

## Antipatterns

Skrivs ut så att bra men fel idéer kan avvisas snabbt.

- Sifferkodlås som kräver räkning
- Korsord, anagram eller ordlekar som kräver mycket text
- Röda sillar
- Pussel som kräver att exakt en namngiven person är närvarande
- Pussel som kräver mobil, QR-kod, app eller nät
- Pussel efter 15.30, med enda undantag: slå in sex redan kända bokstäver i cryptexen vid 20.00
- Simning efter 13.30
- Ensam eka, kajak, paddel eller simning
- Ett enda pussel som blockerar hela helgen
- Pussel som kräver skylten på annan ö utan bäring från kompassbilden. Q-4 äger den kedjan.
- Pussel som förutsätter att skattjakten pausas
- Ett lösenord som går att gissa från sången, ön, Malins namn eller Karl XII
- En sista ledtråd som bara bekräftar det man redan kunnat räkna ut
- En kista som göms. Den ska vara väl synlig.
- En cryptex som får hamstras. Lappen gäller.
