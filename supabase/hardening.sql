-- LifeBridge: security hardening. Run once in the Supabase SQL Editor.

-- 1. CLOSE THE AUDIT BYPASS ---------------------------------------------
-- Before: any verified hospital could read EVERY patient record directly,
-- without a search (and so without an audit entry).
-- After: a hospital can read only its OWN records directly. Reading other
-- hospitals' records is possible ONLY through search_patient_by_nin(),
-- which writes the audit log first.
drop policy if exists "patient_records_select_verified" on public.patient_records;

create policy "patient_records_select_own" on public.patient_records for select
using ( exists (
  select 1 from public.hospitals h
  where h.user_id = auth.uid()
    and h.hospital_id = patient_records.hospital_id
    and h.is_verified = true
));

-- 3. VALIDATE DATA IN THE DATABASE, NOT ONLY IN THE BROWSER --------------
alter table public.patient_records
  add constraint patient_nin_format  check (nin ~ '^[0-9]{11}$'),
  add constraint patient_text_length check (
    coalesce(length(allergies), 0)           <= 2000 and
    coalesce(length(chronic_conditions), 0)  <= 2000 and
    coalesce(length(current_medications), 0) <= 2000 and
    coalesce(length(previous_surgeries), 0)  <= 2000 );

alter table public.audit_logs
  add constraint audit_nin_format check (searched_nin ~ '^[0-9]{11}$');

-- Make the search function reject malformed input too
drop function if exists public.search_patient_by_nin(text);
create function public.search_patient_by_nin(p_nin text)
returns table (
  record_id uuid, hospital_id uuid, hospital_name varchar, nin varchar,
  first_name varchar, last_name varchar, date_of_birth date, blood_type varchar,
  allergies text, chronic_conditions text, current_medications text,
  previous_surgeries text, created_at timestamptz, updated_at timestamptz )
language plpgsql security definer set search_path = public as $$
declare caller_hospital_id uuid;
begin
  select h.hospital_id into caller_hospital_id
  from public.hospitals h where h.user_id = auth.uid() and h.is_verified = true;
  if caller_hospital_id is null then
    raise exception 'Only verified hospitals can search records.';
  end if;
  if p_nin is null or p_nin !~ '^[0-9]{11}$' then
    raise exception 'NIN must be exactly 11 digits.';
  end if;
  insert into public.audit_logs (hospital_id, searched_nin) values (caller_hospital_id, p_nin);
  return query
  select pr.record_id, pr.hospital_id, h.name, pr.nin, pr.first_name, pr.last_name,
         pr.date_of_birth, pr.blood_type, pr.allergies, pr.chronic_conditions,
         pr.current_medications, pr.previous_surgeries, pr.created_at, pr.updated_at
  from public.patient_records pr join public.hospitals h on h.hospital_id = pr.hospital_id
  where pr.nin = p_nin;
end; $$;

-- 4. TIMES WITH A TIME ZONE ----------------------------------------------
-- "timestamp" has no zone, so browsers in Nigeria showed times one hour off.
alter table public.hospitals       alter column created_at  type timestamptz using created_at  at time zone 'UTC';
alter table public.patient_records alter column created_at  type timestamptz using created_at  at time zone 'UTC';
alter table public.patient_records alter column updated_at  type timestamptz using updated_at  at time zone 'UTC';
alter table public.audit_logs      alter column search_time type timestamptz using search_time at time zone 'UTC';
alter table public.admin_users     alter column created_at  type timestamptz using created_at  at time zone 'UTC';

-- 5. A HOSPITAL CANNOT SWAP ITS CERTIFICATES AFTER BEING APPROVED --------
drop policy if exists "documents_update_own" on storage.objects;

-- 2. ONLY LOGGED-IN USERS MAY CALL THE SEARCH FUNCTION (run after the function exists)
revoke execute on function public.search_patient_by_nin(text) from public, anon;
grant  execute on function public.search_patient_by_nin(text) to authenticated;
