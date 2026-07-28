-- Initial praktisk info. Admin kan redigera dessa via /admin senare.

insert into practical_info (key, value) values
  ('theme_intro', 'Temat är pirater. Mer exakt: pirater av den karibiskt-romantiserade, gärna teatraliska 1700-talsorten. Med detta menas inte de bittra, vattenskrämda äkta-pirater som plundrade engelska handelsskepp och dog av skörbjugg innan de hann fylla 35, utan deras betydligt charmigare litterära ättlingar — de med trekantshatt, krökt sabel, oförklarliga ärr och en obändig vana att tala i tre-stavelse-utrop.

Ni förväntas alltså inte vara historiskt korrekta. Ni förväntas vara övertygande på medellång distans i dålig belysning.'),
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
