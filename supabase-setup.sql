-- Run in Supabase SQL Editor. Only the listed administrator can publish.
-- Step 1: Create your user in Authentication > Users, then copy its UUID.
-- Step 2: Replace the placeholder UUID below BEFORE running this script.
create table if not exists public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.site_content (id text primary key, content jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());
insert into public.site_content (id,content) values ('main','{}'::jsonb) on conflict(id) do nothing;
alter table public.admin_users enable row level security;
alter table public.site_content enable row level security;
create policy "Admins can read own membership" on public.admin_users for select to authenticated using (user_id=auth.uid());
create policy "Public can read published site content" on public.site_content for select to anon, authenticated using (id='main');
create policy "Only admins may update site content" on public.site_content for update to authenticated using (exists(select 1 from public.admin_users a where a.user_id=auth.uid())) with check (id='main' and exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
-- IMPORTANT: Replace this UUID with your actual auth user UUID:
-- insert into public.admin_users(user_id) values ('00000000-0000-0000-0000-000000000000');
-- Media: create a PUBLIC bucket named portfolio-media in Storage first.
create policy "Admins upload portfolio media" on storage.objects for insert to authenticated with check (bucket_id='portfolio-media' and exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create policy "Public read portfolio media" on storage.objects for select to anon,authenticated using (bucket_id='portfolio-media');
