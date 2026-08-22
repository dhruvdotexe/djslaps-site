-- Fan art gallery schema. Run in Supabase SQL editor.

-- Submissions: pending until approved via the admin page.
create table if not exists fan_art (
  id bigint generated always as identity primary key,
  artist_name text not null default 'anonymous',
  storage_path text not null unique,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);
create index if not exists fan_art_status_idx on fan_art (status, created_at desc);

-- Public gallery reads approved art only.
create or replace view fan_art_gallery as
select id, artist_name, storage_path, created_at
from fan_art
where status = 'approved'
order by created_at desc;

-- Anonymous visitors may submit and read the approved gallery.
revoke all on fan_art from anon;
grant insert on fan_art to anon;
grant select on fan_art_gallery to anon;

-- Storage bucket for images. Public read, service-role write only
-- (uploads go through our API route which validates size/type).
insert into storage.buckets (id, name, public)
values ('fan-art', 'fan-art', true)
on conflict (id) do nothing;
