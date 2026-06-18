-- Admin-UI: redigera och ta bort lag (crews).
-- Idempotent.

drop policy if exists "crews_update" on crews;
create policy "crews_update" on crews
  for update using (true) with check (true);

drop policy if exists "crews_delete" on crews;
create policy "crews_delete" on crews
  for delete using (true);
