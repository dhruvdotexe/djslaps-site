-- Migration: DJSLAPS message on fan art + approved-arts management.
-- Run in Supabase SQL editor.

alter table fan_art add column if not exists dj_message text;

-- Gallery now exposes the message too.
create or replace view fan_art_gallery as
select id, artist_name, storage_path, dj_message, created_at
from fan_art
where status = 'approved'
order by created_at desc;
