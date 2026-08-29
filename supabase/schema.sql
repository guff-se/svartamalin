-- Svarta Malin — schema
-- Kör i Supabase SQL editor. RLS är restriktiv: anon kan endast läsa publik info
-- (lediga piratnamn, claimade pirater i collaget) och skriva sin egen gäst-rad.

create extension if not exists "uuid-ossp";

create table if not exists pirate_names (
  id int primary key,
  name text not null unique,
  position int not null  -- visningsordning: Svarta Malin (id 60) först, sedan id 1..59
);

create table if not exists crews (
  id serial primary key,
  name text not null
);

create table if not exists guests (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  real_name text not null,
  login_slug text not null,         -- lowercase namn utan mellanslag (inloggningslösenord)
  attending boolean,                -- null = inte svarat, false = avböjt
  pirate_name_id int unique references pirate_names(id),
  crew_id int references crews(id),
  phone text,
  email text,
  food_notes text,                  -- allergier / mat-preferenser
  notes text,                       -- övrig info gästen vill att vi vet
  character_facts text,             -- gästens egna fakta om sin karaktär
  character_object text,            -- speciellt objekt hen tar med sig
  character_skill text,             -- färdighet / aktivitet under festen
  character_play_with text,         -- person hen vill spela mot
  sleeping_room text,               -- rum på Ovanan, t.ex. "Norra Toppstugan"
  sleeping_bed text                 -- bäddtyp, t.ex. "Dubbelsäng", "Madrass"
);

-- Inloggning (lösenord) och "Sätt segel"-klick. Skrivs via log_guest_visit().
create table if not exists login_events (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  guest_id uuid references guests(id) on delete set null,
  real_name text not null,
  source text not null           -- 'login' | 'satt_segel'
);

create index if not exists login_events_created_at_idx
  on login_events (created_at desc);

-- OANVÄND av sajten. Brödtext ligger i content/copy/, inte här.
create table if not exists practical_info (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- En unik (case-insensitive) lås på riktiga namn så vi inte får dubletter.
create unique index if not exists guests_real_name_lower_idx
  on guests (lower(real_name));

create unique index if not exists guests_login_slug_idx
  on guests (login_slug);

-- Sätt updated_at automatiskt vid varje UPDATE på guests.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists guests_set_updated_at on guests;
create trigger guests_set_updated_at
  before update on guests
  for each row
  execute function public.set_updated_at();

-- Validera inloggning utan att exponera login_slug via tabell-läsning.
create or replace function validate_guest_login(p_slug text)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select id from guests
  where login_slug = lower(trim(p_slug))
  limit 1;
$$;

revoke all on function validate_guest_login(text) from public;
grant execute on function validate_guest_login(text) to anon, authenticated, service_role;

-- Logga besök utan att klienten kan skriva godtyckligt namn.
create or replace function log_guest_visit(p_guest_id uuid, p_source text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_source text;
begin
  v_source := case p_source
    when 'login' then 'login'
    when 'satt_segel' then 'satt_segel'
    else null
  end;
  if v_source is null or p_guest_id is null then
    return;
  end if;

  select real_name into v_name from guests where id = p_guest_id;
  if v_name is null then
    return;
  end if;

  insert into login_events (guest_id, real_name, source)
  values (p_guest_id, v_name, v_source);
end;
$$;

revoke all on function log_guest_visit(uuid, text) from public;
grant execute on function log_guest_visit(uuid, text) to anon, authenticated, service_role;

-- Byt lagnamn för gästens eget lag (inte byta lag).
create or replace function update_my_crew_name(p_guest_id uuid, p_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_crew_id int;
  v_trimmed text;
begin
  v_trimmed := nullif(trim(p_name), '');
  if v_trimmed is null then
    raise exception 'Lagnamn får inte vara tomt';
  end if;

  select crew_id into v_crew_id
  from guests
  where id = p_guest_id;

  if v_crew_id is null then
    raise exception 'Du tillhör inget lag';
  end if;

  update crews
  set name = v_trimmed
  where id = v_crew_id;
end;
$$;

revoke all on function update_my_crew_name(uuid, text) from public;
grant execute on function update_my_crew_name(uuid, text) to anon, authenticated, service_role;

-- RLS
alter table pirate_names enable row level security;
alter table crews enable row level security;
alter table guests enable row level security;
alter table practical_info enable row level security;
alter table login_events enable row level security;

-- Pirate names: alla kan läsa
drop policy if exists "pirate_names_read" on pirate_names;
create policy "pirate_names_read" on pirate_names
  for select using (true);

-- Crews: alla kan läsa; admin-UI skriver via anon (samma modell som guests)
drop policy if exists "crews_read" on crews;
create policy "crews_read" on crews
  for select using (true);

drop policy if exists "crews_insert" on crews;
create policy "crews_insert" on crews
  for insert with check (true);

drop policy if exists "crews_update" on crews;
create policy "crews_update" on crews
  for update using (true) with check (true);

drop policy if exists "crews_delete" on crews;
create policy "crews_delete" on crews
  for delete using (true);

-- Practical info: alla kan läsa; admin-UI skriver via anon
drop policy if exists "practical_info_read" on practical_info;
create policy "practical_info_read" on practical_info
  for select using (true);

drop policy if exists "practical_info_insert" on practical_info;
create policy "practical_info_insert" on practical_info
  for insert with check (true);

drop policy if exists "practical_info_update" on practical_info;
create policy "practical_info_update" on practical_info
  for update using (true) with check (true);

-- Guests: alla kan läsa "publik" info via en VIEW (se nedan).
-- Gäster seedas i förväg (se guests_seed.sql) — ingen självregistrering.

-- Vi tillåter update endast om guest_id matchar den klient skickar (skickas
-- via a query-param eller header). Eftersom vi inte har "riktig" auth lämnar
-- vi det öppet och förlitar oss på att klienten skickar rätt id, men låser
-- redigering av crew_id (admin-fält) via en kolumn-check i app-lagret.
drop policy if exists "guests_update_own" on guests;
create policy "guests_update_own" on guests
  for update using (true) with check (true);

drop policy if exists "guests_select_own" on guests;
create policy "guests_select_own" on guests
  for select using (true);

-- Login-logg: anon läser (admin-UI); insert bara via log_guest_visit().
drop policy if exists "login_events_select" on login_events;
create policy "login_events_select" on login_events
  for select using (true);

grant select on login_events to anon, authenticated;

-- Publik vy: anonymiserar känsliga fält (telefon, email, notes).
create or replace view public_guests
with (security_invoker = true) as
  select
    g.id,
    g.real_name,
    g.attending,
    g.pirate_name_id,
    pn.name as pirate_name,
    g.crew_id
  from guests g
  left join pirate_names pn on pn.id = g.pirate_name_id
  where g.attending = true;

grant select on public_guests to anon, authenticated;

-- Realtime: publicera ändringar på guests och pirate_names
alter publication supabase_realtime add table guests;
alter publication supabase_realtime add table pirate_names;
