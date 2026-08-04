-- Fält för gästens egna karaktärsunderlag ("Din karaktär" på huvudsidan).
-- Används som råmaterial när intriger skrivs.
-- Kör i Supabase SQL editor en gång.

alter table guests add column if not exists character_facts text;      -- fakta om sig själv
alter table guests add column if not exists character_object text;     -- speciellt objekt hen tar med
alter table guests add column if not exists character_skill text;      -- färdighet / aktivitet under festen
alter table guests add column if not exists character_play_with text;  -- person hen vill spela mot
