-- Lägger till food_notes-kolumn på guests för allergier/mat-preferenser.
-- Befintliga notes-kolumnen återanvänds som "övrig info".
-- Kör i Supabase SQL editor en gång.

alter table guests add column if not exists food_notes text;
