-- Migration: per-IP rate limiting + nickname moderation. Run in Supabase SQL editor.

alter table slaps add column if not exists ip_hash text;
create index if not exists slaps_ip_created_idx on slaps (ip_hash, created_at desc);

-- Replace the leaderboard view to hide unmoderated nicknames.
create or replace view slap_leaderboard as
select nickname, count(*) as slaps
from slaps
where nickname is not null
  and nickname <> ''
  and nickname not ilike any (array[
    '%cuck%', '%fuck%', '%shit%', '%bitch%', '%bastard%',
    '%nigg%', '%rape%', '%slut%', '%dick%', '%porn%',
    '%penis%', '%vagina%', '%sex%', '%nude%', '%kill%'
  ])
group by nickname
order by slaps desc
limit 50;

-- Server-side moderation function: records a slap only if this IP hasn't
-- slapped within the last second and the nickname passes the filter.
create or replace function record_slap(p_ip_hash text, p_nickname text)
returns bigint
language plpgsql
security definer
as $$
declare
  new_total bigint;
begin
  if exists (
    select 1 from slaps
    where ip_hash = p_ip_hash
      and created_at > now() - interval '1 second'
  ) then
    raise exception 'RATE_LIMITED' using errcode = 'P0001';
  end if;

  insert into slaps (nickname, ip_hash) values (p_nickname, p_ip_hash);

  update slap_counter
  set total = total + 1, updated_at = now()
  where id = 1
  returning total into new_total;

  return new_total;
end;
$$;

grant execute on function record_slap(text, text) to anon;
