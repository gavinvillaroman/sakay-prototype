-- =============================================================================
-- Sakay — initial schema
-- Two-sided car-sharing marketplace (Philippines). Turo-style: vehicle rentals
-- with optional driver. This migration is idempotent — safe to re-run.
-- =============================================================================

-- Required extension for gen_random_uuid()
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Helper: generic updated_at trigger function
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- profiles — 1:1 with auth.users; the public "user profile"
-- =============================================================================
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text,
  full_name       text,
  phone           text,
  photo_url       text,
  is_host         boolean not null default false,
  is_black_member boolean not null default false,
  city            text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.profiles is 'Public-facing user profile, 1:1 with auth.users.';

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- =============================================================================
-- hosts — a profile that has chosen to host vehicles
-- =============================================================================
create table if not exists public.hosts (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null unique references public.profiles(id) on delete cascade,
  display_name  text not null,
  bio           text,
  superhost     boolean not null default false,
  response_rate int not null default 100,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.hosts is 'A profile that lists vehicles; display_name may differ from profile name (e.g. "Shotcorner Corporation").';

drop trigger if exists trg_hosts_updated_at on public.hosts;
create trigger trg_hosts_updated_at
  before update on public.hosts
  for each row execute function public.set_updated_at();

-- =============================================================================
-- vehicles — a listed vehicle
-- =============================================================================
create table if not exists public.vehicles (
  id                  uuid primary key default gen_random_uuid(),
  host_id             uuid not null references public.hosts(id) on delete cascade,
  make                text not null,
  model               text not null,
  year                int not null,
  category            text not null check (category in ('sedan','suv','van','motorcycle','other')),
  price_per_day_cents int not null,
  location            text,
  features            text[] not null default '{}',
  instant_book        boolean not null default false,
  driver_option       text not null default 'self-drive' check (driver_option in ('with-driver','self-drive','both')),
  region_tag          text,
  active              boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.vehicles is 'A listed vehicle. Price stored in centavos (peso x 100) to avoid float math.';

create index if not exists idx_vehicles_host_id on public.vehicles(host_id);
create index if not exists idx_vehicles_active on public.vehicles(active) where active = true;
create index if not exists idx_vehicles_category on public.vehicles(category);

drop trigger if exists trg_vehicles_updated_at on public.vehicles;
create trigger trg_vehicles_updated_at
  before update on public.vehicles
  for each row execute function public.set_updated_at();

-- =============================================================================
-- vehicle_photos — one vehicle has many photos
-- =============================================================================
create table if not exists public.vehicle_photos (
  id         uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  url        text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.vehicle_photos is 'Photos attached to a vehicle listing, ordered by sort_order.';

create index if not exists idx_vehicle_photos_vehicle_id on public.vehicle_photos(vehicle_id, sort_order);

-- =============================================================================
-- bookings — a renter reserves a vehicle for a date range
-- =============================================================================
create table if not exists public.bookings (
  id            uuid primary key default gen_random_uuid(),
  vehicle_id    uuid not null references public.vehicles(id),
  renter_id     uuid not null references public.profiles(id),
  start_date    date not null,
  end_date      date not null,
  total_cents   int not null,
  status        text not null default 'pending' check (status in ('pending','confirmed','active','completed','canceled')),
  driver_option text check (driver_option in ('with-driver','self-drive')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (end_date >= start_date)
);

comment on table public.bookings is 'A reservation of a vehicle by a renter for a date range.';

create index if not exists idx_bookings_renter_start on public.bookings(renter_id, start_date desc);
create index if not exists idx_bookings_vehicle_start on public.bookings(vehicle_id, start_date);

drop trigger if exists trg_bookings_updated_at on public.bookings;
create trigger trg_bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- =============================================================================
-- reviews — one review per completed booking
-- =============================================================================
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null unique references public.bookings(id) on delete cascade,
  vehicle_id  uuid not null references public.vehicles(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id),
  rating      int not null check (rating between 1 and 5),
  text        text,
  created_at  timestamptz not null default now()
);

comment on table public.reviews is 'One review per booking, written by the renter after completion.';

create index if not exists idx_reviews_vehicle_id on public.reviews(vehicle_id);

-- =============================================================================
-- sakay_black_members — premium membership
-- =============================================================================
create table if not exists public.sakay_black_members (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id),
  started_at timestamptz not null default now(),
  ends_at    timestamptz,
  status     text not null default 'active'
);

comment on table public.sakay_black_members is 'Sakay Black premium membership records. Managed by service role.';

-- =============================================================================
-- Trigger: auto-create profile row on new auth.users insert
-- =============================================================================
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- =============================================================================
-- View: vehicles_with_host — convenient join for the browse page
-- =============================================================================
create or replace view public.vehicles_with_host as
select
  v.id,
  v.host_id,
  v.make,
  v.model,
  v.year,
  v.category,
  v.price_per_day_cents,
  v.location,
  v.features,
  v.instant_book,
  v.driver_option,
  v.region_tag,
  v.active,
  v.created_at,
  v.updated_at,
  h.display_name      as host_display_name,
  h.superhost         as host_superhost,
  h.response_rate     as host_response_rate,
  p.id                as host_profile_id,
  p.photo_url         as host_photo_url,
  p.full_name         as host_full_name
from public.vehicles v
join public.hosts h    on h.id = v.host_id
join public.profiles p on p.id = h.profile_id;

comment on view public.vehicles_with_host is 'Vehicle rows pre-joined with host + host profile fields; convenient for browse/search.';

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.profiles            enable row level security;
alter table public.hosts               enable row level security;
alter table public.vehicles            enable row level security;
alter table public.vehicle_photos      enable row level security;
alter table public.bookings            enable row level security;
alter table public.reviews             enable row level security;
alter table public.sakay_black_members enable row level security;

-- ---- profiles --------------------------------------------------------------
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Inserts are handled by the auth trigger (security definer), so no insert
-- policy is needed for regular clients.

-- ---- hosts -----------------------------------------------------------------
drop policy if exists "hosts_select_all" on public.hosts;
create policy "hosts_select_all" on public.hosts
  for select using (true);

drop policy if exists "hosts_insert_own" on public.hosts;
create policy "hosts_insert_own" on public.hosts
  for insert with check (profile_id = auth.uid());

drop policy if exists "hosts_update_own" on public.hosts;
create policy "hosts_update_own" on public.hosts
  for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "hosts_delete_own" on public.hosts;
create policy "hosts_delete_own" on public.hosts
  for delete using (profile_id = auth.uid());

-- ---- vehicles --------------------------------------------------------------
drop policy if exists "vehicles_select_active" on public.vehicles;
create policy "vehicles_select_active" on public.vehicles
  for select using (
    active = true
    or exists (
      select 1 from public.hosts h
      where h.id = vehicles.host_id and h.profile_id = auth.uid()
    )
  );

drop policy if exists "vehicles_insert_own" on public.vehicles;
create policy "vehicles_insert_own" on public.vehicles
  for insert with check (
    exists (
      select 1 from public.hosts h
      where h.id = vehicles.host_id and h.profile_id = auth.uid()
    )
  );

drop policy if exists "vehicles_update_own" on public.vehicles;
create policy "vehicles_update_own" on public.vehicles
  for update using (
    exists (
      select 1 from public.hosts h
      where h.id = vehicles.host_id and h.profile_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.hosts h
      where h.id = vehicles.host_id and h.profile_id = auth.uid()
    )
  );

drop policy if exists "vehicles_delete_own" on public.vehicles;
create policy "vehicles_delete_own" on public.vehicles
  for delete using (
    exists (
      select 1 from public.hosts h
      where h.id = vehicles.host_id and h.profile_id = auth.uid()
    )
  );

-- ---- vehicle_photos --------------------------------------------------------
drop policy if exists "vehicle_photos_select_all" on public.vehicle_photos;
create policy "vehicle_photos_select_all" on public.vehicle_photos
  for select using (true);

drop policy if exists "vehicle_photos_insert_own" on public.vehicle_photos;
create policy "vehicle_photos_insert_own" on public.vehicle_photos
  for insert with check (
    exists (
      select 1
      from public.vehicles v
      join public.hosts h on h.id = v.host_id
      where v.id = vehicle_photos.vehicle_id and h.profile_id = auth.uid()
    )
  );

drop policy if exists "vehicle_photos_update_own" on public.vehicle_photos;
create policy "vehicle_photos_update_own" on public.vehicle_photos
  for update using (
    exists (
      select 1
      from public.vehicles v
      join public.hosts h on h.id = v.host_id
      where v.id = vehicle_photos.vehicle_id and h.profile_id = auth.uid()
    )
  );

drop policy if exists "vehicle_photos_delete_own" on public.vehicle_photos;
create policy "vehicle_photos_delete_own" on public.vehicle_photos
  for delete using (
    exists (
      select 1
      from public.vehicles v
      join public.hosts h on h.id = v.host_id
      where v.id = vehicle_photos.vehicle_id and h.profile_id = auth.uid()
    )
  );

-- ---- bookings --------------------------------------------------------------
drop policy if exists "bookings_select_own" on public.bookings;
create policy "bookings_select_own" on public.bookings
  for select using (
    renter_id = auth.uid()
    or exists (
      select 1
      from public.vehicles v
      join public.hosts h on h.id = v.host_id
      where v.id = bookings.vehicle_id and h.profile_id = auth.uid()
    )
  );

drop policy if exists "bookings_insert_own" on public.bookings;
create policy "bookings_insert_own" on public.bookings
  for insert with check (renter_id = auth.uid());

drop policy if exists "bookings_update_own" on public.bookings;
create policy "bookings_update_own" on public.bookings
  for update using (
    renter_id = auth.uid()
    or exists (
      select 1
      from public.vehicles v
      join public.hosts h on h.id = v.host_id
      where v.id = bookings.vehicle_id and h.profile_id = auth.uid()
    )
  );

-- ---- reviews ---------------------------------------------------------------
drop policy if exists "reviews_select_all" on public.reviews;
create policy "reviews_select_all" on public.reviews
  for select using (true);

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own" on public.reviews
  for insert with check (
    reviewer_id = auth.uid()
    and exists (
      select 1 from public.bookings b
      where b.id = reviews.booking_id
        and b.renter_id = auth.uid()
        and b.status = 'completed'
    )
  );

-- ---- sakay_black_members ---------------------------------------------------
-- Only the member themselves can read; writes are service-role only (no
-- insert/update policy means anon/authenticated cannot write; service_role
-- bypasses RLS).
drop policy if exists "black_select_own" on public.sakay_black_members;
create policy "black_select_own" on public.sakay_black_members
  for select using (profile_id = auth.uid());

-- =============================================================================
-- Reload PostgREST schema cache (Supabase REST won't see new tables otherwise)
-- =============================================================================
notify pgrst, 'reload schema';
