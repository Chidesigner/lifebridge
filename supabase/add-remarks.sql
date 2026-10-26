-- LifeBridge: add a Remarks / summary field. Run once in the Supabase SQL Editor,
-- BEFORE using the updated app files.

alter table public.patient_records add column if not exists remarks text;

alter table public.patient_records
  add constraint patient_remarks_length check (coalesce(length(remarks), 0) <= 2000);

-- Recreate the search function so it also returns remarks.
drop function if exists public.search_patient_by_nin(text);
create function public.search_patient_by_nin(p_nin text)
returns table (
  record_id uuid, hospital_id uuid, hospital_name varchar, nin varchar,
  first_name varchar, last_name varchar, date_of_birth date, blood_type varchar,
  allergies text, chronic_conditions text, current_medications text,
  previous_surgeries text, remarks text, created_at timestamptz, updated_at timestamptz )
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
         pr.current_medications, pr.previous_surgeries, pr.remarks, pr.created_at, pr.updated_at
  from public.patient_records pr join public.hospitals h on h.hospital_id = pr.hospital_id
  where pr.nin = p_nin;
end; $$;

revoke execute on function public.search_patient_by_nin(text) from public, anon;
grant  execute on function public.search_patient_by_nin(text) to authenticated;