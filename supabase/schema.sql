-- Slap-o-Meter schema. Run in Supabase SQL editor.

-- Global counter: single row, atomic increments.
create table if not exists slap_counter (
  id int primary key default 1 check (id = 1),
  total bigint not null default 0,
  updated_at timestamptz not null default now()
);
insert into slap_counter (id, total) values (1, 0) on conflict do nothing;

-- Individual slaps: one row per slap event, for leaderboard + rate limiting.
create table if not exists slaps (
  id bigint generated always as identity primary key,
  nickname text,
  created_at timestamptz not null default now()
);
create index if not exists slaps_created_idx on slaps (created_at desc);

-- Atomic counter increment.
create or replace function increment_slaps()
returns bigint
language sql
security definer
as $$
  update slap_counter set total = total + 1, updated_at = now() where id = 1 returning total;
$$;
grant execute on function increment_slaps() to anon;

-- Leaderboard view: top nicknames by slap count.
create or replace view slap_leaderboard as
select nickname, count(*) as slaps
from slaps
where nickname is not null and nickname <> ''
group by nickname
order by slaps desc
limit 50;

-- Anonymous clients may only increment and read.
revoke all on slap_counter from anon;
grant select, update on slap_counter to anon;
revoke all on slaps from anon;
grant insert on slaps to anon;
grant select on slap_leaderboard to anon;
