-- waitlist: anonymous email capture from the landing page.
-- feedback:  signed-in user messages, tied to auth.users.
--
-- Both have RLS enabled but expose only the minimal write surface.
-- The anon key can insert and nothing else. Reads happen via the
-- service-role key on the server (admin views) — the anon client
-- cannot read either table back, even rows it just wrote.

-- ---------------------------------------------------------------------------
-- waitlist
-- ---------------------------------------------------------------------------
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  user_agent text,
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_email_lower_uidx
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

create policy "waitlist_insert_anyone"
  on public.waitlist for insert
  with check (true);
-- No select / update / delete policies => anon can only insert.

-- ---------------------------------------------------------------------------
-- feedback
-- ---------------------------------------------------------------------------
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null check (char_length(message) between 1 and 5000),
  page text,
  created_at timestamptz not null default now()
);

create index if not exists feedback_created_at_idx
  on public.feedback (created_at desc);

alter table public.feedback enable row level security;

create policy "feedback_insert_own"
  on public.feedback for insert
  with check (auth.uid() = user_id);
-- Submitter can write but cannot read back. Admin views go through
-- the service-role key on the server.
