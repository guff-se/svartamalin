-- Sovplatser på Ovanan. Idempotent: matchar på real_name och skriver över.
-- Kräver kolumnerna från migrations/add-sleeping-spot.sql.

update guests g
set sleeping_room = s.room,
    sleeping_bed  = s.bed
from (values
  ('Jesper Lindmarker',   'Norra Toppstugan', 'Dubbelsäng'),
  ('Josefin Löwing',      'Norra Toppstugan', 'Dubbelsäng'),
  ('Minerva Löwgren',     'Norra Toppstugan', 'Madrass'),
  ('Ulrika Hammar',       'Norra Toppstugan', 'Enkelsäng'),
  ('Petter Wallberg',     'Södra Toppstugan', 'Dubbelsäng'),
  ('Elin Mårtensson',     'Södra Toppstugan', 'Dubbelsäng'),
  ('Navid Modiri',        'Södra Toppstugan', 'Enkelsäng'),
  ('Ludvig von Bahr',     'Södra Toppstugan', 'Madrass'),
  ('Linnea Ekbom',        'Familjerummet',    'Dubbelsäng'),
  ('Louise von Bahr',     'Familjerummet',    'Dubbelsäng'),
  ('Amalia Wahlström',    'Familjerummet',    'Våningssäng'),
  ('Johanna Bergman',     'Familjerummet',    'Våningssäng'),
  ('Hampus Lindblad',     'Sälenrummet',      'Dubbelsäng'),
  ('Linnea Appert',       'Sälenrummet',      'Dubbelsäng'),
  ('Alexandra Palmquist', 'Sälenrummet',      'Enkelsäng'),
  ('Fabian Macklin',      'Loftet',           'Dubbelsäng'),
  ('Mini Macklin',        'Loftet',           'Dubbelsäng'),
  ('Amanda Mungsgård',    'Loftet',           'Enkelsäng'),
  ('Gustaf Tadaa',        'Sviten',           'Dubbelsäng'),
  ('Malin Tadaa',         'Sviten',           'Dubbelsäng'),
  ('Jesper Lejfjord',     'TV-rummet',        'Bäddsoffa'),
  ('Elina Melakoski',     'TV-rummet',        'Bäddsoffa'),
  ('Josefin Ansund',      'Bollen',           'Dubbelsäng'),
  ('Viktor Ansund',       'Bollen',           'Dubbelsäng'),
  ('Chris Kummelstedt',   'Bollen',           'Våningssäng'),
  ('Edvin Thungren',      'Bollen',           'Våningssäng')
) as s(name, room, bed)
where lower(g.real_name) = lower(s.name);
