-- Run this migration in the Supabase SQL editor to activate per-IP rate limiting.
-- (Server-side nickname filtering is already active — it runs in the API route.)

-- 1. Add ip_hash column
alter table slaps add column if not exists ip_hash text;
create index if not exists slaps_ip_created_idx on slaps (ip_hash, created_at desc);

-- 2. Clean filtered nicknames out of the leaderboard
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

-- 3. Atomic slap recording with per-IP throttle
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
