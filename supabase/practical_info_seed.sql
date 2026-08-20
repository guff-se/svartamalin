-- Initial copy. OANVÄND: sajten läser inte den här tabellen.
-- Brödtext ligger i content/copy/{key}.md och bundlas vid build.

insert into practical_info (key, value) values
  ('theme_intro', 'Temat är pirater. Mer exakt: pirater av den karibiskt-romantiserade, gärna teatraliska 1700-talsorten. Med detta menas inte de bittra, vattenskrämda äkta-pirater som plundrade engelska handelsskepp och dog av skörbjugg innan de hann fylla 35, utan deras betydligt charmigare litterära ättlingar, de med trekantshatt, krökt sabel, oförklarliga ärr och en obändig vana att tala i tre-stavelse-utrop.

Ni förväntas alltså inte vara historiskt korrekta. Ni förväntas vara övertygande på medellång distans i dålig belysning.'),
  ('ovanan_intro', 'Privat ö i Mälaren, vår bas under helgen.'),
  ('ovanan_accommodation', 'Stugor och sovplats på ön, mer information kommer.'),
  ('ovanan_resources', 'Kök, bastu, bryggor och gemensamma ytor, detaljer fylls i.'),
  ('dates', '4–6 september 2026'),
  ('boat_friday', 'Båttider för fredag kommuniceras separat.'),
  ('boat_sunday', 'Båttider för söndag kommuniceras separat.'),
  ('transport_intro', 'Båt avgår från **Björkfjärdsvägen 28**. Gemensam storbåt på fredag och söndag; övrig transport sker med liten båt och måste koordineras med arrangörerna.'),
  ('kids_policy', 'Barnfritt. Spädbarn välkomna.'),
  ('packing', 'Sängkläder, handduk, varma kläder för kvällarna, piratdräkt, ev. allergimedicin.'),
  ('teams_intro', 'Ni delas in i lag om 4–5 personer. Varje lag skapar uppdrag åt motståndarna och bygger en skatt som används under lördagens kamp.'),
  ('manifest', '**Skepp ohoj landkrabbor!**
Tiden är kommen.

Efter fyrtio år till havs har jag, **Svarta Malin**, bestämt mig för att utmana mina ärkefiender till en sista batalj, ett sista slag om vem som bestämmer över Salmonellahavet. Ni är inbjudna. Inte som åskådare. Som motståndare, allierade, förrädare och festprissar i samma kostym.

Helgen är en berättelse vi skriver tillsammans.'),
  ('manifest_friday', '### Fredag: Överdåd

Vi samlas för fest och firande! Ni ser er om kring och förstår att den här helgen kommer inte sluta lyckligt. Men än talar ingen högt om vad som väntar. Vi ler mot våra fiender och dricker deras vin. Det är den sista natten innan allt brinner, så skåla, skryt och hänge er åt dekadensen.'),
  ('manifest_saturday', '### Lördag: Svek

Ytan spricker. Förräderi, hämd och rena rövartåg. Skatter stjäls, romanser inleder och avslutas. Hämnd avkrävs. Under lördagsdagen

### Lördag: Till havs

### Lördag kväll: Förlisning

Svarta Malin fyller år och bjuder på kaviar och rom. Sen bryter helvetet ut! Här gäller en helig regel: blir du nedslagen av någon annan än **Svarta Malin**, res dig upp och fighta igen. Bara ett möte med Salmonellahavets fasa själv kan sänka dig för gott. Så spar din sista andhämtning till den som förtjänar den.'),
  ('manifest_play', '### Hur vi leker

Försök inte spela någon konstig karaktär som gör det svårt för dig. Var dig själv, bara en aning piratigare.

Det är okej att inte vara i karaktär hela tiden. Men när någon annan tar ett initiativ: häng på. Oavsett: se helgen som en inbjudan att prata om det som händer på plats, istället för det som händer därhemma.

Och sist: **play to lose**. Att låta dig bli lurad, att misslyckas spektakulärt eller klanta dig framför sina vänner leder oftast till roligare spel än när du försöker vinna. Målet är inte segern. Målet är ett episkt jävla drama.'),
  ('manifest_prep', '### Förberedelser

Klä er som pirater. Teaterkostym, syslöjd och Sjörövarfabbe framför historisk korrekthet.

Varje skuta ska ha med sig en **skatt**: något fysiskt, gömbart och festligt, som ni absolut inte får förlora. Den hör till spelet, och till plundringen.

Prata ihop er med laget innan helgen. Hitta på egna initiativ, påhitt och överraskningar som bidrar till dramat. Ju mer ni bygger vidare på temat, desto mer har Salmonellahavet att jubla över.

Frågor? Kontakta Gustaf.')
on conflict (key) do nothing;
