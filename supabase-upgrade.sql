-- Run once in Supabase SQL Editor. Existing site_content and admin_users remain unchanged.
create table if not exists public.portfolio_posts(id uuid primary key default gen_random_uuid(),slug text unique not null,title text not null,summary text not null default '',body text not null,published boolean not null default false,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
alter table public.portfolio_posts enable row level security;
drop policy if exists "Public reads published posts" on public.portfolio_posts;
create policy "Public reads published posts" on public.portfolio_posts for select to anon using(published=true);
drop policy if exists "Admin reads posts" on public.portfolio_posts;
create policy "Admin reads posts" on public.portfolio_posts for select to authenticated using(exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
drop policy if exists "Admin creates posts" on public.portfolio_posts;
create policy "Admin creates posts" on public.portfolio_posts for insert to authenticated with check(exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
drop policy if exists "Admin edits posts" on public.portfolio_posts;
create policy "Admin edits posts" on public.portfolio_posts for update to authenticated using(exists(select 1 from public.admin_users a where a.user_id=auth.uid())) with check(exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
drop policy if exists "Admin deletes posts" on public.portfolio_posts;
create policy "Admin deletes posts" on public.portfolio_posts for delete to authenticated using(exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create table if not exists public.portfolio_pageviews(path text not null,view_day date not null default current_date,views bigint not null default 0,primary key(path,view_day));
alter table public.portfolio_pageviews enable row level security;
drop policy if exists "Admins read pageviews" on public.portfolio_pageviews;
create policy "Admins read pageviews" on public.portfolio_pageviews for select to authenticated using(exists(select 1 from public.admin_users a where a.user_id=auth.uid()));
create or replace function public.record_portfolio_view(page_path text) returns void language plpgsql security definer set search_path=public as $$ begin if page_path !~ '^/[a-zA-Z0-9/_-]{0,100}$' or page_path like '/admin%' then return; end if; insert into public.portfolio_pageviews(path,view_day,views) values(page_path,current_date,1) on conflict(path,view_day) do update set views=portfolio_pageviews.views+1; end $$;
revoke all on function public.record_portfolio_view(text) from public;
grant execute on function public.record_portfolio_view(text) to anon,authenticated;
-- Create a PUBLIC Storage bucket named portfolio-media in Supabase Storage if it does not already exist.
-- The original supabase-setup.sql includes upload/read policies for this bucket.
