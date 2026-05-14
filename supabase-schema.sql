-- WC2026 Picks Tracker — Supabase Schema (Multi-League)
-- Run this in your Supabase SQL Editor

-- 1. Profiles table (extends Supabase Auth users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  created_at timestamptz default now(),
  is_admin boolean default false
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Player'));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Leagues table
create table if not exists public.leagues (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  invite_code text not null unique,
  created_by uuid references auth.users not null,
  created_at timestamptz default now()
);

alter table public.leagues enable row level security;

create policy "Leagues viewable by members or admin"
  on public.leagues for select using (
    exists (
      select 1 from public.league_members
      where league_members.league_id = leagues.id
      and league_members.user_id = auth.uid()
    )
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Only admins can create leagues"
  on public.leagues for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Only admins can update leagues"
  on public.leagues for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Only admins can delete leagues"
  on public.leagues for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );


-- 3. League members table
create table if not exists public.league_members (
  id uuid default gen_random_uuid() primary key,
  league_id uuid references public.leagues on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  joined_at timestamptz default now(),
  unique(league_id, user_id)
);

alter table public.league_members enable row level security;

create policy "Members can view co-members"
  on public.league_members for select using (
    exists (
      select 1 from public.league_members lm
      where lm.league_id = league_members.league_id
      and lm.user_id = auth.uid()
    )
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Users can join leagues (insert themselves)"
  on public.league_members for insert with check (
    auth.uid() = user_id
  );

create policy "Only admins can remove members"
  on public.league_members for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );


-- 4. Function to join a league by invite code
create or replace function public.join_league_by_code(code text)
returns json as $$
declare
  found_league public.leagues%rowtype;
begin
  select * into found_league from public.leagues where invite_code = upper(trim(code));
  if found_league.id is null then
    raise exception 'Invalid invite code';
  end if;
  insert into public.league_members (league_id, user_id)
  values (found_league.id, auth.uid())
  on conflict (league_id, user_id) do nothing;
  return json_build_object('league_id', found_league.id, 'league_name', found_league.name);
end;
$$ language plpgsql security definer;


-- 5. Match results table (global)
create table if not exists public.match_results (
  match_id text primary key,
  result text not null check (result in ('home', 'draw', 'away')),
  home_score integer,
  away_score integer,
  entered_at timestamptz default now(),
  entered_by uuid references auth.users
);

alter table public.match_results enable row level security;

create policy "Results viewable by everyone"
  on public.match_results for select using (true);

create policy "Only admins can insert results"
  on public.match_results for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Only admins can update results"
  on public.match_results for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );


-- 6. Match odds table (global)
create table if not exists public.match_odds (
  match_id text primary key,
  home_odds numeric(6,2) not null default 0,
  draw_odds numeric(6,2) not null default 0,
  away_odds numeric(6,2) not null default 0,
  source text default 'manual',
  updated_at timestamptz default now()
);

alter table public.match_odds enable row level security;

create policy "Odds viewable by everyone"
  on public.match_odds for select using (true);

create policy "Only admins can manage odds"
  on public.match_odds for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );


-- 7. User picks table (global — shared across all leagues)
create table if not exists public.picks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  match_id text not null,
  pick text not null check (pick in ('home', 'draw', 'away')),
  wager numeric(8,2) default 1.0,
  is_knockout boolean default false,
  picked_at timestamptz default now(),
  unique(user_id, match_id)
);

alter table public.picks enable row level security;

create policy "Users can view all picks"
  on public.picks for select using (true);

create policy "Users can insert own picks"
  on public.picks for insert with check (auth.uid() = user_id);

create policy "Users can update own picks"
  on public.picks for update using (auth.uid() = user_id);

create policy "Users can delete own picks"
  on public.picks for delete using (auth.uid() = user_id);


-- 8. Knockout matches table
create table if not exists public.knockout_matches (
  match_id text primary key,
  round text not null,
  date text,
  kickoff timestamptz,
  home text,
  away text,
  venue text,
  source_description text,
  created_at timestamptz default now()
);

alter table public.knockout_matches enable row level security;

create policy "Knockout matches viewable by everyone"
  on public.knockout_matches for select using (true);

create policy "Only admins can manage knockout matches"
  on public.knockout_matches for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );


-- 9. Leaderboard view (global — frontend filters by league membership)
create or replace view public.leaderboard as
select
  p.user_id,
  pr.display_name,
  count(case when p.pick = mr.result then 1 end) as correct_picks,
  count(mr.result) as decided_matches,
  count(p.id) as total_picks,
  coalesce(sum(
    case when p.pick = mr.result then
      case p.pick
        when 'home' then p.wager * coalesce(mo.home_odds, 1)
        when 'draw' then p.wager * coalesce(mo.draw_odds, 1)
        when 'away' then p.wager * coalesce(mo.away_odds, 1)
      end
    else 0
    end
  ), 0) as points
from public.picks p
join public.profiles pr on pr.id = p.user_id
left join public.match_results mr on mr.match_id = p.match_id
left join public.match_odds mo on mo.match_id = p.match_id
group by p.user_id, pr.display_name;


-- 10. Indexes
create index if not exists idx_picks_user_match on public.picks(user_id, match_id);
create index if not exists idx_picks_match on public.picks(match_id);
create index if not exists idx_league_members_user on public.league_members(user_id);
create index if not exists idx_league_members_league on public.league_members(league_id);
create index if not exists idx_leagues_invite_code on public.leagues(invite_code);
