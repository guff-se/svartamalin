-- Sovplatser: vilket rum och vilken bädd varje gäst har på Ovanan.
-- Idempotent — kan köras om.

alter table guests add column if not exists sleeping_room text;
alter table guests add column if not exists sleeping_bed text;

comment on column guests.sleeping_room is 'Rum på Ovanan, t.ex. "Norra Toppstugan"';
comment on column guests.sleeping_bed is 'Bäddtyp, t.ex. "Dubbelsäng", "Madrass"';
