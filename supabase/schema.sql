create extension if not exists pgcrypto;

create table public.hospitals (
  hospital_id    uuid primary key default gen_random_uuid(),
  user_id        uuid not null unique references auth.users(id) on delete cascade,
  name           varchar(200) not null,
  cac_number     varchar(50) not null unique,
  mdcn_number    varchar(50) not null unique,
  state          varchar(50) not null,
  contact_email  varchar(150) not null unique,
  is_verified    boolean not null default false,
  created_at     timestamp not null default now()
);

create table public.patient_records (
  record_id            uuid primary key default gen_random_uuid(),
  hospital_id          uuid not null references public.hospitals(hospital_id) on delete restrict,
  nin                  varchar(20) not null,
  first_name           varchar(100) not null,
  last_name            varchar(100) not null,
  date_of_birth        date,
  blood_type           varchar(5),
  allergies            text,
  chronic_conditions   text,
  current_medications  text,
  previous_surgeries   text,
  created_at           timestamp not null default now(),
  updated_at           timestamp not null default now()
);

create index idx_patient_records_nin on public.patient_records (nin);

create table public.audit_logs (
  log_id        uuid primary key default gen_random_uuid(),
  hospital_id   uuid not null references public.hospitals(hospital_id) on delete cascade,
  searched_nin  varchar(20) not null,
  search_time   timestamp not null default now(),
  ip_address    varchar(50)
);

create table public.admin_users (
  admin_id    uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  email       varchar(150) not null unique,
  created_at  timestamp not null default now()
);
