alter table public.hospitals        enable row level security;
alter table public.patient_records  enable row level security;
alter table public.audit_logs       enable row level security;
alter table public.admin_users      enable row level security;

create policy "hospitals_select_own" on public.hospitals for select
using ( auth.uid() = user_id );

create policy "hospitals_select_admin" on public.hospitals for select
using ( exists (select 1 from public.admin_users a where a.user_id = auth.uid()) );

create policy "hospitals_insert_self" on public.hospitals for insert
with check ( auth.uid() = user_id and is_verified = false );

create policy "hospitals_update_admin" on public.hospitals for update
using ( exists (select 1 from public.admin_users a where a.user_id = auth.uid()) )
with check ( exists (select 1 from public.admin_users a where a.user_id = auth.uid()) );

create policy "patient_records_select_verified" on public.patient_records for select
using ( exists (select 1 from public.hospitals h where h.user_id = auth.uid() and h.is_verified = true) );

create policy "patient_records_insert_own_verified" on public.patient_records for insert
with check ( exists (select 1 from public.hospitals h where h.user_id = auth.uid() and h.hospital_id = patient_records.hospital_id and h.is_verified = true) );

create policy "patient_records_update_own" on public.patient_records for update
using ( exists (select 1 from public.hospitals h where h.user_id = auth.uid() and h.hospital_id = patient_records.hospital_id and h.is_verified = true) )
with check ( exists (select 1 from public.hospitals h where h.user_id = auth.uid() and h.hospital_id = patient_records.hospital_id and h.is_verified = true) );

create policy "audit_logs_select_own" on public.audit_logs for select
using ( exists (select 1 from public.hospitals h where h.user_id = auth.uid() and h.hospital_id = audit_logs.hospital_id) );

create policy "audit_logs_select_admin" on public.audit_logs for select
using ( exists (select 1 from public.admin_users a where a.user_id = auth.uid()) );

create policy "admin_users_select_self" on public.admin_users for select
using ( auth.uid() = user_id );

create or replace function public.search_patient_by_nin(p_nin text)
returns table (
  record_id uuid,
  hospital_id uuid,
  hospital_name varchar,
  nin varchar,
  first_name varchar,
  last_name varchar,
  date_of_birth date,
  blood_type varchar,
  allergies text,
  chronic_conditions text,
  current_medications text,
  previous_surgeries text,
  created_at timestamp,
  updated_at timestamp
)
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_hospital_id uuid;
begin
  select h.hospital_id into caller_hospital_id
  from public.hospitals h
  where h.user_id = auth.uid() and h.is_verified = true;

  if caller_hospital_id is null then
    raise exception 'Only verified hospitals can search records.';
  end if;

  insert into public.audit_logs (hospital_id, searched_nin)
  values (caller_hospital_id, p_nin);

  return query
  select
    pr.record_id, pr.hospital_id, h.name as hospital_name, pr.nin,
    pr.first_name, pr.last_name, pr.date_of_birth, pr.blood_type,
    pr.allergies, pr.chronic_conditions, pr.current_medications,
    pr.previous_surgeries, pr.created_at, pr.updated_at
  from public.patient_records pr
  join public.hospitals h on h.hospital_id = pr.hospital_id
  where pr.nin = p_nin;
end;
$$;

grant execute on function public.search_patient_by_nin(text) to authenticated;
