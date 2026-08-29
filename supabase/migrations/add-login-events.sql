-- Loggar inloggning (lösenord) och "Sätt segel"-klick.
-- Skrivs via RPC log_guest_visit (security definer) så namnet slås upp
-- från guests och inte kan förfalskas via PostgREST-insert.
-- Idempotent — kan köras om.

create table if not exists login_events (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  guest_id uuid references guests(id) on delete set null,
  real_name text not null,
  source text not null
);

create index if not exists login_events_created_at_idx
  on login_events (created_at desc);

comment on table login_events is 'Inloggning (lösenord) och Sätt segel-klick.';
comment on column login_events.source is 'login = lösenordsinloggning; satt_segel = återvändande splash';

alter table login_events enable row level security;

drop policy if exists "login_events_select" on login_events;
create policy "login_events_select" on login_events
  for select using (true);

grant select on login_events to anon, authenticated;

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
