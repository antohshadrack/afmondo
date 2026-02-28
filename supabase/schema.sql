-- ============================================================
-- Afmondo Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────────
-- PROFILES (extends Supabase auth.users)
-- ──────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  avatar_url  text,
  role        text not null default 'customer', -- 'customer' | 'admin'
  created_at  timestamptz default now()
);

-- Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ──────────────────────────────────────────────
-- CATEGORIES
-- ──────────────────────────────────────────────
create table if not exists public.categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  parent_id   uuid references public.categories(id),
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- ──────────────────────────────────────────────
-- PRODUCTS
-- ──────────────────────────────────────────────
create table if not exists public.products (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  slug            text not null unique,
  description     text,
  price           numeric(12, 0) not null,
  original_price  numeric(12, 0),
  discount        int generated always as (
    case
      when original_price is not null and original_price > price
      then round(((original_price - price) / original_price) * 100)
      else null
    end
  ) stored,
  brand           text,
  category_id     uuid references public.categories(id),
  images          text[] default '{}',   -- array of image URLs
  is_active       boolean default true,
  is_featured     boolean default false,
  is_flash_sale   boolean default false,
  flash_sale_ends timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ──────────────────────────────────────────────
-- INVENTORY
-- ──────────────────────────────────────────────
create table if not exists public.inventory (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references public.products(id) on delete cascade,
  quantity    int not null default 0,
  low_stock_threshold int default 5,
  updated_at  timestamptz default now(),
  unique(product_id)
);

-- ──────────────────────────────────────────────
-- ORDERS
-- ──────────────────────────────────────────────
create type public.order_status as enum (
  'pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled', 'refunded'
);

create table if not exists public.orders (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id),
  status          public.order_status default 'pending',
  total           numeric(12, 0) not null,
  delivery_fee    numeric(12, 0) default 0,
  notes           text,
  -- Delivery address
  delivery_name   text,
  delivery_phone  text,
  delivery_city   text,
  delivery_address text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ──────────────────────────────────────────────
-- ORDER ITEMS
-- ──────────────────────────────────────────────
create table if not exists public.order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid not null references public.products(id),
  name        text not null,   -- snapshot at time of order
  image       text,
  price       numeric(12, 0) not null,
  quantity    int not null default 1
);

-- ──────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────────

-- Profiles: users can only read/update their own profile
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Products: public read, admin write
alter table public.products enable row level security;
create policy "Anyone can read active products" on public.products
  for select using (is_active = true);
create policy "Admins can manage products" on public.products
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Categories: public read, admin write
alter table public.categories enable row level security;
create policy "Anyone can read categories" on public.categories
  for select using (true);
create policy "Admins can manage categories" on public.categories
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Inventory: public read, admin write
alter table public.inventory enable row level security;
create policy "Anyone can read inventory" on public.inventory
  for select using (true);
create policy "Admins can manage inventory" on public.inventory
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Orders: users see own orders, admins see all
alter table public.orders enable row level security;
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);
create policy "Users can create orders" on public.orders
  for insert with check (auth.uid() = user_id);
create policy "Admins can manage all orders" on public.orders
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

alter table public.order_items enable row level security;
create policy "Users can view own order items" on public.order_items
  for select using (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );
create policy "Admins can manage order items" on public.order_items
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ──────────────────────────────────────────────
-- SEED: Default categories
-- ──────────────────────────────────────────────
insert into public.categories (name, slug, sort_order) values
  ('Vehicles', 'vehicles', 1),
  ('Electronics', 'electronics', 2),
  ('Furniture', 'furniture', 3),
  ('Appliances', 'appliances', 4),
  ('Industrial Machinery', 'machinery', 5),
  ('Special Deals', 'deals', 6)
on conflict (slug) do nothing;
