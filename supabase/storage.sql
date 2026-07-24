-- Storage setup
insert into storage.buckets (id, name, public)
values 
  ('blog-images', 'blog-images', true),
  ('lead-magnets', 'lead-magnets', true)
on conflict (id) do nothing;

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id in ('blog-images', 'lead-magnets') );

create policy "Auth Insert"
  on storage.objects for insert
  with check ( bucket_id in ('blog-images', 'lead-magnets') and auth.role() = 'authenticated' );

create policy "Auth Update"
  on storage.objects for update
  using ( bucket_id in ('blog-images', 'lead-magnets') and auth.role() = 'authenticated' );

create policy "Auth Delete"
  on storage.objects for delete
  using ( bucket_id in ('blog-images', 'lead-magnets') and auth.role() = 'authenticated' );
