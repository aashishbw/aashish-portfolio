-- AU Studio media storage: admin-only uploads, public website image URLs.
-- Does not change existing buckets or delete files.
begin;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('portfolio-media','portfolio-media',true,10485760,
  array['image/png','image/jpeg','image/webp','application/pdf'])
on conflict(id) do nothing;
do $$ begin
  if not exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='AU Studio administrators upload portfolio media') then
    create policy "AU Studio administrators upload portfolio media"
    on storage.objects for insert to authenticated
    with check(bucket_id='portfolio-media' and exists(
      select 1 from public.admin_users a where a.user_id=(select auth.uid())
    ));
  end if;
end $$;
commit;
select id,public,file_size_limit,allowed_mime_types
from storage.buckets where id='portfolio-media';
