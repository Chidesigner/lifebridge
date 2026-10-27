# LifeBridge

A web-based cross-facility health information platform for Nigeria,
built as a final year BSc Computer Science project (University of
Nigeria, Nsukka). Case study scoped to Nsukka, Enugu State.

## The problem

Nigerian hospitals operate as information silos. When a patient is
treated at one hospital and later has an emergency at another, the
second hospital has no access to what the first knows: allergies,
blood type, medications, prior diagnoses. LifeBridge solves this by
giving verified, government-accredited hospitals a shared platform to
upload and search patient records using the patient's National
Identification Number (NIN) as the universal identifier.

Patients never log in — this is a hospital-to-hospital tool only.

## Architecture

```
React (Vite) frontend  ──────►  Supabase
                                 ├─ PostgreSQL database
                                 ├─ Row Level Security policies
                                 ├─ Auth (email/password)
                                 └─ One Postgres function that
                                    searches + logs the audit
                                    trail atomically
```

There is deliberately no separate backend server. Every access rule
(who can see what, who can approve a hospital, who can search) is
enforced at the database level via Postgres Row Level Security, not
duplicated in application code. See `supabase/rls.sql` for the full,
readable set of rules.

## Tech stack

- **Frontend:** React 19, Vite 7, React Router v6, Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL, Auth, Row Level Security)
- **Icons:** lucide-react

## Project structure

```
lifebridge/
├── frontend/           React + Vite + Tailwind app
│   └── src/
│       ├── pages/            Route-level pages (public, hospital, admin)
│       ├── components/       Shared UI (nav bars, form fields, etc.)
│       ├── context/           AuthContext — who's logged in, what role
│       └── lib/               Supabase client, validators
└── supabase/
    ├── schema.sql      All table definitions
    └── rls.sql         All Row Level Security policies + the search function
```

## Local setup

1. Create a Supabase project.
2. In the Supabase SQL Editor, run these files from the `supabase` folder, in this order:
   `schema.sql`, `rls.sql`, `documents.sql`, `add-remarks.sql`, `hardening.sql`, `hardening-2.sql`.
3. In Supabase → Authentication → Providers → Email, turn **off** "Confirm email."
4. `cd frontend && npm install`
5. Copy `.env.example` to `.env.local` and fill in your Supabase Project URL and anon key.
6. `npm run dev`

## Core workflow

1. A hospital registers (CAC number, MDCN number, email/password).
2. The System Administrator reviews and approves it.
3. A verified hospital uploads patient records, tagged with their NIN.
4. Any verified hospital can search a NIN and see every hospital's
   records for that patient — and every search is automatically
   logged, atomically, by the same database function that performs it.
