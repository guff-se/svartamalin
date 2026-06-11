-- Initial praktisk info. Admin kan redigera dessa via /admin senare.

insert into practical_info (key, value) values
  ('location', 'Ovanan — privat ö i Mälaren.'),
  ('dates', '4–6 september 2026'),
  ('boat_friday', 'Båttider för fredag kommuniceras separat.'),
  ('boat_sunday', 'Båttider för söndag kommuniceras separat.'),
  ('transport_intro', 'Båt avgår från **Björkfjärdsvägen 28**. Gemensam storbåt på fredag och söndag; övrig transport sker med liten båt och måste koordineras med arrangörerna.'),
  ('kids_policy', 'Barnfritt. Spädbarn välkomna.'),
  ('packing', 'Sängkläder, handduk, varma kläder för kvällarna, piratdräkt, ev. allergimedicin.'),
  ('teams_intro', 'Ni delas in i lag om 4–5 personer. Varje lag skapar uppdrag åt motståndarna och bygger en skatt som används under lördagens kamp.')
on conflict (key) do nothing;
