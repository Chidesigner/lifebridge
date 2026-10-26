-- LifeBridge: hardening part 2. Run once in the Supabase SQL Editor, after hardening.sql.

-- 1. NIN, hospital and record id can never change after upload;
--    updated_at is set by the server, not the browser.
create or replace function public.protect_record_identity()
returns trigger language plpgsql as $$
begin
  if new.nin is distinct from old.nin
     or new.hospital_id is distinct from old.hospital_id
     or new.record_id is distinct from old.record_id then
    raise exception 'NIN, hospital and record id cannot be changed.';
  end if;
  new.updated_at := now();
  return new;
end; $$;

drop trigger if exists patient_records_protect on public.patient_records;
create trigger patient_records_protect
before update on public.patient_records
for each row execute function public.protect_record_identity();