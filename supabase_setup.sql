-- ============================================================
-- BirthdayDrop — Supabase Database Setup
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ── Enable UUID extension (usually already enabled) ───────
create extension if not exists "uuid-ossp";


-- ── Table 1: birthday_pages ───────────────────────────────
create table if not exists birthday_pages (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,
  receiver_name text not null,
  sender_name   text not null,
  created_at    timestamptz default now(),
  is_active     boolean default true
);

-- ── Table 2: wishes ───────────────────────────────────────
create table if not exists wishes (
  id            uuid primary key default uuid_generate_v4(),
  page_id       uuid references birthday_pages(id) on delete cascade not null,
  from_name     text not null,
  message       text not null,
  tag           text not null check (tag in ('heartfelt','funny','inspirational','sweet')),
  color         text not null default '#D4A853',
  emoji         text not null default '💌',
  is_sender     boolean default false,
  is_mystery    boolean default false,
  display_order int  not null default 1,
  created_at    timestamptz default now()
);

-- ── Table 3: page_sessions ────────────────────────────────
create table if not exists page_sessions (
  id              uuid primary key default uuid_generate_v4(),
  page_id         uuid references birthday_pages(id) on delete cascade not null,
  session_key     text not null,
  opened_wish_ids uuid[] default '{}',
  all_opened      boolean default false,
  created_at      timestamptz default now(),
  unique (page_id, session_key)
);


-- ── Row Level Security ────────────────────────────────────

alter table birthday_pages  enable row level security;
alter table wishes           enable row level security;
alter table page_sessions    enable row level security;

-- birthday_pages: anon can read active pages
create policy "Public can read active pages"
  on birthday_pages for select
  using (is_active = true);

-- wishes: anon can read wishes
create policy "Public can read wishes"
  on wishes for select
  using (true);

-- page_sessions: anon can insert and update their own session (by session_key)
create policy "Anyone can create a session"
  on page_sessions for insert
  with check (true);

create policy "Session owner can read their session"
  on page_sessions for select
  using (true);

create policy "Session owner can update their session"
  on page_sessions for update
  using (true);


-- ── Demo data ─────────────────────────────────────────────
-- A demo birthday page. Replace with real data as needed.
insert into birthday_pages (slug, receiver_name, sender_name)
values ('demo', 'Priya', 'Rohan')
on conflict (slug) do nothing;

-- Example friend wishes (uncomment and edit to add real wishes)
-- with demo_page as (select id from birthday_pages where slug = 'demo')
-- insert into wishes (page_id, from_name, message, tag, color, emoji, display_order)
-- select id, 'Aisha',   'Wishing you the most magical birthday ever! You deserve all the joy in the world. 🌟', 'heartfelt',     '#E8A0A0', '🌟', 1 from demo_page union all
-- select id, 'Karan',   'May your day be as bright as your smile! Happy birthday! 😊', 'sweet',         '#A0D4E8', '🎈', 2 from demo_page union all
-- select id, '???',     'From someone who thinks you''re absolutely amazing — figure out who! 😏', 'funny', '#C8E6A0', '🔍', 3 from demo_page union all  -- is_mystery = true
-- select id, 'Meera',   'You inspire everyone around you. Keep shining! ✨', 'inspirational', '#C0A8E8', '✨', 4 from demo_page;
-- 
-- Sender wish (is_sender = true, display_order = 99):
-- with demo_page as (select id from birthday_pages where slug = 'demo')
-- insert into wishes (page_id, from_name, message, tag, color, emoji, is_sender, display_order)
-- select id, 'Rohan', 'Happy Birthday Priya! You mean the world to me. Every day with you is a gift. Here''s to many more adventures! 💛', 'heartfelt', '#FFD700', '💛', true, 99 from demo_page;
