-- PokerClock Pro — schéma Supabase
-- RLS désactivée volontairement (cohérent avec tes autres apps : protection au niveau app)

create table if not exists tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date date not null,
  buy_in numeric not null default 0,
  rebuy_amount numeric default 0,
  addon_amount numeric default 0,
  starting_stack integer not null default 10000,
  status text not null default 'draft', -- draft | running | paused | finished
  current_level_index integer default 0,
  level_started_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists blind_levels (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references tournaments(id) on delete cascade,
  position integer not null, -- ordre du niveau
  small_blind integer not null,
  big_blind integer not null,
  ante integer default 0,
  duration_minutes integer not null default 20,
  is_break boolean default false,
  break_label text
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  club_member_id text, -- lien vers ton système de membres existant
  created_at timestamptz default now()
);

create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references tournaments(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  seat_number integer,
  table_number integer,
  buy_in_paid boolean default true,
  rebuys integer default 0,
  addons integer default 0,
  stack integer,
  registered_at timestamptz default now()
);

create table if not exists eliminations (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references tournaments(id) on delete cascade,
  registration_id uuid references registrations(id) on delete cascade,
  finish_position integer not null,
  eliminated_at timestamptz default now(),
  eliminated_by uuid references registrations(id) -- optionnel, pour bounties
);

create table if not exists payouts (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references tournaments(id) on delete cascade,
  position integer not null,
  percentage numeric not null, -- % du prizepool
  amount numeric -- calculé une fois le prizepool final connu
);

create table if not exists club_settings (
  id uuid primary key default gen_random_uuid(),
  club_name text default '19PokerClub',
  theme jsonb default '{}'::jsonb, -- couleurs, fond, layout des panneaux
  sheets_webhook_url text, -- endpoint Google Apps Script pour sync Sheets
  updated_at timestamptz default now()
);

-- Index utiles
create index if not exists idx_blind_levels_tournament on blind_levels(tournament_id, position);
create index if not exists idx_registrations_tournament on registrations(tournament_id);
create index if not exists idx_eliminations_tournament on eliminations(tournament_id);
