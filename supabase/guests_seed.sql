-- Seed guests from guests.txt
-- login_slug = lowercase full name without spaces (e.g. Gustaf Tadaa → gustaftadaa)
-- Idempotent: upsert on login_slug.

insert into guests (real_name, login_slug) values
  ('Malin Tadaa', 'malintadaa'),
  ('Gustaf Tadaa', 'gustaftadaa'),
  ('Jesper Lejfjord', 'jesperlejfjord'),
  ('Elina Melakoski', 'elinamelakoski'),
  ('Li Tadaa', 'litadaa'),
  ('Adam Heindorf', 'adamheindorf'),
  ('Louise von Bahr', 'louisevonbahr'),
  ('Mattis Norrvidd', 'mattisnorrvidd'),
  ('Evelina Andersson', 'evelinaandersson'),
  ('Amanda Mungsgård', 'amandamungsgård'),
  ('Viktor Ansund', 'viktoransund'),
  ('Josefine Ansund', 'josefineansund'),
  ('Johanna Bergman', 'johannabergman'),
  ('Erik Bergman', 'erikbergman'),
  ('Jesper Lindmarker', 'jesperlindmarker'),
  ('Josefin Löwing', 'josefinlöwing'),
  ('Navid Modiri', 'navidmodiri'),
  ('Linnea Appert', 'linneaappert'),
  ('Hampus Lindblad', 'hampuslindblad'),
  ('Linnea Ekbom', 'linneaekbom'),
  ('Gustav Lund', 'gustavlund'),
  ('Amalia Wahlström', 'amaliawahlström'),
  ('Fabian Macklin', 'fabianmacklin'),
  ('Mini Macklin', 'minimacklin'),
  ('Petter Wallberg', 'petterwallberg'),
  ('Elin Mårtensson', 'elinmårtensson'),
  ('Ludvig von Bahr', 'ludvigvonbahr'),
  ('Minerva Löwgren', 'minervalöwgren'),
  ('Alexandra Palmquist', 'alexandrapalmquist'),
  ('Olle Bjerkås', 'ollebjerkås'),
  ('Ulrika Hammar', 'ulrikahammar')
on conflict (login_slug) do update set real_name = excluded.real_name;
