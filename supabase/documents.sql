-- LifeBridge: hospital certificate uploads
-- Run this once in the Supabase SQL Editor.

-- 1. Remember where each hospital's documents are stored
alter table public.hospitals
  add column if not exists cac_document_path text,
  add column if not exists license_document_path text;

-- 2. A PRIVATE storage bucket (no public links), max 5 MB, PDF/JPG/PNG only
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('hospital-documents', 'hospital-documents', false, 5242880,
        array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

-- 3. Rules: a hospital can only touch the folder named after its own user id
create policy "documents_insert_own" on storage.objects for insert to authenticated
with check ( bucket_id = 'hospital-documents' and (storage.foldername(name))[1] = auth.uid()::text );

create policy "documents_update_own" on storage.objects for update to authenticated
using ( bucket_id = 'hospital-documents' and (storage.foldername(name))[1] = auth.uid()::text )
with check ( bucket_id = 'hospital-documents' and (storage.foldername(name))[1] = auth.uid()::text );

create policy "documents_select_own" on storage.objects for select to authenticated
using ( bucket_id = 'hospital-documents' and (storage.foldername(name))[1] = auth.uid()::text );

-- 4. The admin can read every hospital's documents
create policy "documents_select_admin" on storage.objects for select to authenticated
using ( bucket_id = 'hospital-documents'
        and exists (select 1 from public.admin_users a where a.user_id = auth.uid()) );
