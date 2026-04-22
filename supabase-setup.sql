-- AL NIBRAS FINANCE: CORE DATABASE SETUP
-- Execute this entirely in your Supabase SQL Editor

-- 0. CLEANUP (Drop old tables safely)
drop table if exists public.user_badges cascade;
drop table if exists public.transactions cascade;
drop table if exists public.app_courses cascade;
drop table if exists public.profiles cascade;

----------------------------------------------------
-- 1. PROFILES TABLE (Linked to Auth)
----------------------------------------------------
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text not null,
  role text default 'child' check (role in ('parent', 'child', 'admin')),
  balance numeric default 0,
  avatar_url text,
  language text default 'en',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.profiles enable row level security;

-- Policies: Users can read and update their own profile
create policy "Users can view own profile" 
on profiles for select 
using (auth.uid() = id);

create policy "Users can update own profile" 
on profiles for update 
using (auth.uid() = id);

----------------------------------------------------
-- 2. TRANSACTIONS TABLE
----------------------------------------------------
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  amount numeric not null check (amount > 0),
  purpose text not null,
  status text default 'completed' check (status in ('pending', 'completed', 'failed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;

-- Policies: Sender and Receiver can view the transaction
create policy "Users can view their transactions" 
on transactions for select 
using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Parents can insert transactions" 
on transactions for insert 
with check (auth.uid() = sender_id);

----------------------------------------------------
-- 3. COURSES & GAMES (Global Content)
----------------------------------------------------
create table public.app_courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  thumbnail_url text,
  video_url text,
  price numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.app_courses enable row level security;

-- Everyone can view courses, only admins could edit (if role was enforced)
create policy "Anyone can view courses" 
on app_courses for select 
using (true);

----------------------------------------------------
-- 4. GAMIFICATION BADGES
----------------------------------------------------
create table public.user_badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_name text not null,
  description text,
  icon_url text,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_badges enable row level security;

create policy "Users view own badges" 
on user_badges for select 
using (auth.uid() = user_id);

----------------------------------------------------
-- 5. AUTOMATIC PROFILE CREATION TRIGGER
----------------------------------------------------
-- This automatically creates a profile with 0 balance when someone signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role, balance)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'), 
    'child', -- default role
    0        -- STRICT 0 BALANCE AS REQUESTED
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger to call the function
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

----------------------------------------------------
-- (OPTIONAL) INSERT SOME DUMMY COURSES TO START
----------------------------------------------------
insert into public.app_courses (title, description, price) values 
('Islamic Finance 101', 'Learn the basics of Halal money management.', 0),
('Savings Masterclass', 'How to save your pocket money efficiently.', 0);
