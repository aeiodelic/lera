-- Supabase bootstrap: schema, RLS, and starter seed
-- Run in Supabase SQL Editor or via `supabase db push`

begin;

-- Extensions
create extension if not exists "pgcrypto";

-- Utility: update timestamp trigger fn
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists set_timestamp_profiles on public.profiles;
create trigger set_timestamp_profiles before update on public.profiles
  for each row execute function public.set_updated_at();

-- Events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null default 'funding' check (status in ('draft','funding','scheduled','completed','canceled')),
  location text,
  event_date date,
  deadline_date date,
  target numeric(12,2) not null default 0,
  raised numeric(12,2) not null default 0,        -- denormalized for UI, update from backend/payment webhook later
  tickets_cap integer not null default 0,
  quorum integer not null default 0,
  tags text[] not null default '{}',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_created_by()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.created_by is null then
    new.created_by = auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists set_created_by_events on public.events;
create trigger set_created_by_events before insert on public.events
  for each row execute function public.set_created_by();

drop trigger if exists set_timestamp_events on public.events;
create trigger set_timestamp_events before update on public.events
  for each row execute function public.set_updated_at();

-- Artists and event mapping
create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.event_artists (
  event_id uuid not null references public.events(id) on delete cascade,
  artist_id uuid not null references public.artists(id) on delete cascade,
  primary key (event_id, artist_id)
);

-- Pricing tiers per event
create table if not exists public.pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  tier text not null,
  price numeric(10,2) not null,
  total integer not null,
  created_at timestamptz not null default now()
);
create index if not exists pricing_tiers_event_id_idx on public.pricing_tiers(event_id);

-- Tickets purchased by users
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  tier text not null,
  price numeric(10,2) not null,
  status text not null default 'valid' check (status in ('valid','consumed','refunded','canceled')),
  pass_code text unique,
  purchased_at timestamptz not null default now()
);
create index if not exists tickets_event_id_idx on public.tickets(event_id);
create index if not exists tickets_user_id_idx on public.tickets(user_id);

-- Votes (offchain snapshot integration can sync here)
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  artist_id uuid not null references public.artists(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  weight integer not null default 1,
  created_at timestamptz not null default now()
);
create unique index if not exists uniq_vote_per_user_artist_event
  on public.votes(event_id, artist_id, user_id);

-- Treasury (optional but useful for UI)
create table if not exists public.treasury_entries (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  direction text not null check (direction in ('in','out')),
  amount numeric(12,2) not null,
  memo text,
  created_at timestamptz not null default now()
);
create index if not exists treasury_entries_event_id_idx on public.treasury_entries(event_id);

-- Storage bucket for passes (private)
do $$
begin
  if not exists(select 1 from storage.buckets where id = 'passes') then
    insert into storage.buckets (id, name, public) values ('passes', 'passes', false);
  end if;
end $$;

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.artists enable row level security;
alter table public.event_artists enable row level security;
alter table public.pricing_tiers enable row level security;
alter table public.tickets enable row level security;
alter table public.votes enable row level security;
alter table public.treasury_entries enable row level security;

-- Profiles policies
create policy if not exists "Public profiles read"
  on public.profiles for select
  using (true);

create policy if not exists "Users manage own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Events policies
create policy if not exists "Public events read"
  on public.events for select
  using (true);

create policy if not exists "Create event (authenticated)"
  on public.events for insert to authenticated
  with check (created_by = auth.uid());

create policy if not exists "Owner can update event"
  on public.events for update to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

-- Artists policies
create policy if not exists "Public artists read"
  on public.artists for select
  using (true);

create policy if not exists "Auth manage artists"
  on public.artists for insert to authenticated
  with check (true);

create policy if not exists "Auth update artists"
  on public.artists for update to authenticated
  using (true) with check (true);

-- Event-Artists policies
create policy if not exists "Public event_artists read"
  on public.event_artists for select
  using (true);

create policy if not exists "Auth manage event_artists"
  on public.event_artists for insert to authenticated
  with check (true);

-- Pricing tiers policies
create policy if not exists "Public tiers read"
  on public.pricing_tiers for select
  using (true);

create policy if not exists "Auth manage tiers"
  on public.pricing_tiers for insert to authenticated
  with check (true);

create policy if not exists "Auth update tiers"
  on public.pricing_tiers for update to authenticated
  using (true) with check (true);

-- Tickets policies (owner-only visibility)
create policy if not exists "Owner reads own tickets"
  on public.tickets for select to authenticated
  using (user_id = auth.uid());

create policy if not exists "Owner creates tickets"
  on public.tickets for insert to authenticated
  with check (user_id = auth.uid());

create policy if not exists "Owner updates own tickets"
  on public.tickets for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Votes policies
create policy if not exists "Public votes read"
  on public.votes for select
  using (true);

create policy if not exists "Owner casts votes"
  on public.votes for insert to authenticated
  with check (user_id = auth.uid());

-- Treasury policies
create policy if not exists "Public treasury read"
  on public.treasury_entries for select
  using (true);
-- No public inserts/updates for treasury; handle via service role/server

-- Seed (optional): one event, tiers, artists
-- Replace values as needed
do $$
declare
  ev_id uuid;
  a1 uuid;
  a2 uuid;
  a3 uuid;
begin
  insert into public.events (title, status, location, event_date, deadline_date, target, raised, tickets_cap, quorum, tags)
  values ('LAcra Genesis #0', 'funding', 'Santa Marta / Tayrona area', date '2026-03-15', date '2025-11-30', 20000, 7680, 1000, 35, array['Open-air','Transparent budget','Decentralized'])
  returning id into ev_id;

  insert into public.pricing_tiers (event_id, tier, price, total)
  values
    (ev_id, 'Early Bird', 18, 200),
    (ev_id, 'Standard', 25, 600),
    (ev_id, 'Late', 35, 200);

  insert into public.artists (name) values ('Kindzadza') returning id into a1;
  insert into public.artists (name) values ('Ajja') returning id into a2;
  insert into public.artists (name) values ('Earthling') returning id into a3;
  insert into public.event_artists(event_id, artist_id) values (ev_id, a1), (ev_id, a2), (ev_id, a3);
end $$;

commit;

