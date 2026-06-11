-- Initial praktisk info. Admin kan redigera dessa via /admin senare.

insert into practical_info (key, value) values
  ('theme_intro', 'Temat är pirater. Mer exakt: pirater av den karibiskt-romantiserade, gärna teatraliska 1700-talsorten. Med detta menas inte de bittra, vattenskrämda äkta-pirater som plundrade engelska handelsskepp och dog av skörbjugg innan de hann fylla 35, utan deras betydligt charmigare litterära ättlingar — de med trekantshatt, krökt sabel, oförklarliga ärr och en obändig vana att tala i tre-stavelse-utrop.

Ni förväntas alltså inte vara historiskt korrekta. Ni förväntas vara övertygande på medellång distans i dålig belysning.'),
  ('theme_fits', '**Pluskonto:**
Trekantshatt (även hopvikt av pizzakartong). Ögonlapp av tvivelaktigt medicinskt syfte. En papegoja som vid närmare inspektion visar sig vara en strumpa. Ett sjökort, hopvikt i panik fem minuter innan avfärd, märkt ungefär "HÄR FINNS NÅGOT" och en orörd ruta som vagt påminner om Mälaren. Skägg, fysiskt eller mentalt. En kniv som vid eftertanke visar sig vara en bordskniv. Ramsa-svar av sorten "arr", "ay-ay" och "havet är väldigt blött i kväll, kapten".'),
  ('theme_doesnt_fit', '**Minuskonto:**
Ninjor, vampyrer, ekonomer, sushikockar och i stort sett hela Star Wars-universumet (möjligen med undantag för Han Solo i en generös, mer havsorienterad tolkning). Riktiga vapen. Riktiga svärd. Forskning. PowerPoint. Yrkesidentitet av något slag. Förklaringar av hur ett skepp egentligen seglar. Realistiska skildringar av exakt vilka sjukdomar 1700-talets sjömän led av (om ni redan känt er föranledda att läsa på, var snälla och håll det för er själva).'),
  ('ovanan_intro', 'Privat ö i Mälaren — vår bas under helgen.'),
  ('ovanan_accommodation', 'Stugor och sovplats på ön — mer information kommer.'),
  ('ovanan_resources', 'Kök, bastu, bryggor och gemensamma ytor — detaljer fylls i.'),
  ('dates', '4–6 september 2026'),
  ('boat_friday', 'Båttider för fredag kommuniceras separat.'),
  ('boat_sunday', 'Båttider för söndag kommuniceras separat.'),
  ('transport_intro', 'Båt avgår från **Björkfjärdsvägen 28**. Gemensam storbåt på fredag och söndag; övrig transport sker med liten båt och måste koordineras med arrangörerna.'),
  ('kids_policy', 'Barnfritt. Spädbarn välkomna.'),
  ('packing', 'Sängkläder, handduk, varma kläder för kvällarna, piratdräkt, ev. allergimedicin.'),
  ('teams_intro', 'Ni delas in i lag om 4–5 personer. Varje lag skapar uppdrag åt motståndarna och bygger en skatt som används under lördagens kamp.')
on conflict (key) do nothing;
