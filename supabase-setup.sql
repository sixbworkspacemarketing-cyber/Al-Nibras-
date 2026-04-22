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
  email text,
  role text default 'child' check (role in ('parent', 'child', 'admin')),
  mobile_number text,
  cnic text,
  balance numeric default 0,
  avatar_url text,
  language text default 'en',
  parent_pin text,
  last_active_at timestamp with time zone default timezone('utc'::text, now()),
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

create policy "Admins can view all profiles"
on profiles for select
using (
  exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  )
);

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
-- 3. COURSES & LMS
----------------------------------------------------
create table public.app_courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  thumbnail_url text,
  video_url text,
  category text,
  price numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.app_videos (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.app_courses(id) on delete cascade,
  title text not null,
  video_url text not null, -- Links (YouTube/Vimeo)
  duration text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.app_books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text,
  url text not null,
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content_type text not null, -- 'video', 'course', 'book'
  content_id uuid not null,
  completed boolean default false,
  completed_at timestamp with time zone,
  last_accessed_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.app_courses enable row level security;
alter table public.app_videos enable row level security;
alter table public.app_books enable row level security;
alter table public.user_progress enable row level security;

-- Select policies
create policy "Anyone can view courses" on app_courses for select using (true);
create policy "Anyone can view videos" on app_videos for select using (true);
create policy "Anyone can view books" on app_books for select using (true);
create policy "Users view own progress" on user_progress for select using (auth.uid() = user_id);

----------------------------------------------------
-- 4. GAMIFICATION BADGES
----------------------------------------------------
create table public.app_badges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  icon text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.user_badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_id uuid references public.app_badges(id) on delete cascade,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.app_badges enable row level security;
alter table public.user_badges enable row level security;

create policy "Anyone can view badges" on app_badges for select using (true);
create policy "Users view own badges" on user_badges for select using (auth.uid() = user_id);

----------------------------------------------------
-- 5. TRACKING & ANALYTICS
----------------------------------------------------
create table public.site_stats (
  id date primary key default current_date,
  visits_count integer default 0,
  unique_visitors integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  ip_address text,
  action text not null,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.site_stats enable row level security;
alter table public.audit_logs enable row level security;

-- Only admins can see stats and logs
create policy "Admins view stats" on site_stats for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins view logs" on audit_logs for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create table public.app_links (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  url text not null,
  category text default 'general', -- 'social', 'support', 'education'
  icon text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.app_links enable row level security;
create policy "Anyone can view active links" on app_links for select using (is_active = true);
create policy "Admins can manage links" on app_links for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

----------------------------------------------------
-- 7. AUTOMATIC PROFILE CREATION TRIGGER
----------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role, mobile_number, cnic, balance)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'), 
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'child'),
    new.raw_user_meta_data->>'mobile_number',
    new.raw_user_meta_data->>'cnic',
    0
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger to call the function
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

