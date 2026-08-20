-- Automatisk updated_at på guests. Befintliga rader får now().
-- Idempotent — kan köras om.

alter table guests
  add column if not exists updated_at timestamptz;

update guests
  set updated_at = now();

alter table guests
  alter column updated_at set default now();

alter table guests
  alter column updated_at set not null;

comment on column guests.updated_at is 'Sätts automatiskt vid varje UPDATE.';

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
