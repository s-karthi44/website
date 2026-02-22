# 🎂 BirthdayDrop — Product Requirements Document

**Version:** v1.0
**Tech Stack:** React 18 (Vite) + Supabase + Framer Motion
**Status:** Draft — Ready for Development
**Date:** February 2026

---

## 1. Product Overview

BirthdayDrop is a personalized, interactive birthday webpage created by one person (the **Sender**) for another (the **Receiver**). Friends' wishes are stored in a database and displayed as sealed envelopes in a beautiful mail-inbox UI. The Sender's own special wish is **locked behind a progressive reveal** — it unlocks only after the Receiver has opened every single friend's envelope, creating a moment of anticipation and delight.

> **Note:** Wishes are not entered in v1.0. The database schema and integration are complete, and wish content will be added in a later phase via an admin interface or direct DB insert.

### 1.1 Objectives

- Create a deeply personal, memorable birthday experience that feels crafted, not generic.
- Implement a progressive envelope-opening mechanic tied to live database state.
- Build a scalable Supabase backend so wishes, pages, and sessions can be managed over time.
- Lock the Sender's special wish until all friend wishes are opened — building excitement.
- Include gamification tasks and mood filters that encourage full engagement with the page.

### 1.2 User Roles

| Role | Who | Responsibility |
|------|-----|----------------|
| **Sender** | Person who creates the page | Sets up the birthday page, owns the special locked wish, manages content via DB |
| **Receiver** | The birthday person | Opens the shared link, explores and opens envelopes, unlocks the sender's wish |
| **Friends** | People whose wishes appear | Their messages are stored in DB and rendered as envelope cards on the page |

---

## 2. Database Schema (Supabase / PostgreSQL)

All data is stored in Supabase. Three tables manage the full application state. Wishes are not entered during v1.0 setup — the schema is ready and rows will be inserted in a later phase.

### Table 1 — `birthday_pages`

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| `id` | uuid | PRIMARY KEY | Auto-generated unique identifier |
| `slug` | text | UNIQUE, NOT NULL | URL-safe identifier — e.g. `priya-bday-2025` |
| `receiver_name` | text | NOT NULL | Birthday person's name shown on the page |
| `sender_name` | text | NOT NULL | Sender's name shown in hero and on locked envelope |
| `created_at` | timestamptz | DEFAULT now() | Timestamp of page creation |
| `is_active` | boolean | DEFAULT true | Inactive pages redirect to a friendly 404 |

### Table 2 — `wishes`

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| `id` | uuid | PRIMARY KEY | Unique wish identifier |
| `page_id` | uuid | FK → birthday_pages.id | Links wish to a specific birthday page |
| `from_name` | text | NOT NULL | Name shown on envelope front. Use `???` for mystery wishes |
| `message` | text | NOT NULL | Full wish message shown inside the opened card |
| `tag` | text | NOT NULL | Mood tag: `heartfelt` \| `funny` \| `inspirational` \| `sweet` |
| `color` | text | NOT NULL | Hex accent color for the card — e.g. `#E8A0A0` |
| `emoji` | text | NOT NULL | Decorative emoji on envelope and inside the card |
| `is_sender` | boolean | DEFAULT false | `true` = this is the locked sender wish. One per page only. |
| `is_mystery` | boolean | DEFAULT false | `true` = sender name hidden until card is opened |
| `display_order` | int | NOT NULL | Sort order. Sender wish should be `99` or highest. |
| `created_at` | timestamptz | DEFAULT now() | Timestamp of wish creation |

### Table 3 — `page_sessions`

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| `id` | uuid | PRIMARY KEY | Unique session identifier |
| `page_id` | uuid | FK → birthday_pages.id | Links session to a specific birthday page |
| `session_key` | text | NOT NULL | Anonymous UUID stored in receiver's localStorage |
| `opened_wish_ids` | uuid[] | DEFAULT `'{}'` | Array of wish IDs the receiver has already opened |
| `all_opened` | boolean | DEFAULT false | Set to `true` when every non-sender wish has been opened |
| `created_at` | timestamptz | DEFAULT now() | Timestamp of first visit |

> **Security:** RLS must be enabled on all three tables. The anon key may read `birthday_pages` and `wishes`, and may read/write `page_sessions` only with a matching `session_key`. Admin inserts are done via service key or Supabase dashboard.

---

## 3. Feature Specifications

### 3.1 Hero Section

- Receiver's name in large Playfair Display italic with a gold animated underline that draws in on load.
- Subtitle: *"A surprise from [Sender] 💌"* in Caveat handwritten font.
- Animated background layer: floating emojis (balloons, stars, confetti) rise from the bottom on page load.
- Staggered fade-in of all hero elements with 100ms offsets.

---

### 3.2 Friend Envelope Grid

- Masonry / 3-column responsive grid with staggered card drop-in animation on load.
- Each envelope shows: sender name (Caveat font), mood tag badge, decorative emoji, wax-seal aesthetic.
- On hover: envelope lifts with box-shadow depth effect.
- On click: envelope flap opens via CSS 3D perspective transform, inner wish card slides out.
- Opened envelopes remain open visually and are tracked in `page_sessions`.
- On reload, already-opened envelopes are restored from session state.

---

### 3.3 Wish Card (Inside Envelope)

- Unique accent color per card (stored in DB), large decorative emoji, message in Caveat font, sender name at bottom.
- Mystery wishes (`is_mystery = true`) show `???` on the envelope front — real name revealed only when opened.
- Cards support multi-line messages with readable typography and appropriate padding.

---

### 3.4 Filter Bar

- Sticky filter row with mood pills: **All · Heartfelt ❤️ · Funny 😂 · Inspirational ✨ · Sweet 🍬**
- Filtering triggers smooth fade + scale transition.
- Active filter pill highlighted in brand gold.
- Filter state is local — no DB write needed.

---

### 3.5 Progress Bar

- Sticky top bar: *"You've opened X of Y wishes — [Sender]'s message is waiting! 💌"*
- Animated fill updates in real time as envelopes are opened.
- When `all_opened = true`: bar turns gold with sparkle animation and text changes to *"Unlock [Sender]'s message now! 🎉"*

---

### 3.6 Sender's Special Envelope ⭐ Key Feature

The emotional centrepiece of the product. Visually distinct from friend envelopes with two database-driven states.

#### Locked State
- Rendered in warm gold with wax seal icon and ribbon decoration.
- Label: *"From [Sender] — Open Last 💛"*
- Pulsing lock icon overlays the envelope center.
- Progress counter: *"Open all wishes to unlock • X / Y opened"*
- Clicking while locked triggers a shake animation + tooltip: *"Open all your friends' wishes first!"*
- `pointer-events: none` — visually and functionally disabled.

#### Unlock Trigger
- When the last friend envelope is opened, app writes `all_opened = true` to `page_sessions`.
- Unlock animation sequence fires immediately:
  1. 2s glow pulse
  2. Ribbon unties (CSS keyframe)
  3. Lock icon disappears with spin-out
  4. Envelope shakes excitedly
  5. Confetti burst fires
  6. Envelope becomes clickable with golden shimmer hover

#### Unlocked / Open State
- Opens a **full-screen overlay modal** — not an inline card like friend wishes.
- Premium styling: larger font, gold border, subtle background texture.
- Reserved section at the bottom: *"More surprises coming soon... this is just the beginning 🎁"* — placeholder for v1.1.
- Dismissible via X button or Escape key.

> **DB Note:** Sender wish stored in `wishes` with `is_sender = true`. Fetched separately on unlock, not included in the main grid render.

---

### 3.7 Mini Tasks Panel (Gamification)

Collapsible panel at bottom-right (desktop) / bottom drawer (mobile) with 4 tasks.

| # | Task | Completion Condition | Reward |
|---|------|----------------------|--------|
| 1 | 🎁 Open your first wish | Any envelope opened | Confetti burst |
| 2 | 😂 Find a funny wish | Open a `funny` tagged wish | Celebration toast |
| 3 | 🔍 Solve the mystery | Open a `is_mystery` wish | Name reveal with sparkle |
| 4 | 🎉 Open ALL wishes | `all_opened = true` | Sender envelope unlocks + fireworks |

- Each completed task gets a green checkmark + strike-through with a small confetti burst.
- All 4 tasks complete → full-page fireworks animation + brief *"You did it!"* overlay.

---

## 4. Tech Stack

| Layer | Choice | Purpose |
|-------|--------|---------|
| Framework | React 18 (Vite) | Fast dev, component-based UI |
| Styling | Tailwind CSS + Custom CSS | Utility classes + bespoke animations |
| Database | Supabase (PostgreSQL) | Backend, realtime, auth, RLS |
| State | React Context + useReducer | Global session + UI state |
| Routing | React Router v6 | Dynamic `/:slug` route per page |
| Animations | Framer Motion | Envelope open, unlock sequence, transitions |
| Fonts | Google Fonts | Playfair Display, Caveat, DM Sans |
| Hosting | Vercel / Netlify | Static deploy + env variable support |

---

## 5. Routes & Data Flow

### 5.1 Routes

| Route | Description |
|-------|-------------|
| `GET /:slug` | Main birthday experience page |
| `GET /not-found` | Fallback for invalid slugs |

### 5.2 Page Load Flow

1. React Router extracts `:slug` from URL.
2. Query `birthday_pages WHERE slug = :slug` → if no result, redirect to `/not-found`.
3. Fetch all `wishes WHERE page_id = id AND is_sender = false` ordered by `display_order`.
4. Get or create `page_sessions` row for this page + `session_key` from localStorage.
5. Restore `opened_wish_ids` from session → mark those envelopes as already open in UI state.
6. If `all_opened = true` in session → render sender envelope in unlocked state immediately.
7. Render full page: hero, filter bar, progress bar, envelope grid, task panel, sender envelope.

### 5.3 Envelope Open Flow

1. Receiver clicks a friend envelope → open animation plays.
2. Append wish `id` to `opened_wish_ids` in `page_sessions` via Supabase update.
3. Check: are all non-sender wish IDs now in `opened_wish_ids`?
4. If yes → set `all_opened = true` → trigger unlock animation on sender envelope.

### 5.4 Sender Envelope Open Flow

1. Receiver clicks the unlocked sender envelope.
2. Query `wishes WHERE page_id = id AND is_sender = true`.
3. Full-screen modal opens with sender card content.

---

## 6. Component Architecture

```
App
  └── Router
        ├── BirthdayPage  (/:slug)
        │     ├── HeroSection
        │     ├── ProgressBar
        │     ├── FilterBar
        │     ├── EnvelopeGrid
        │     │     └── EnvelopeCard  (× N friends)
        │     │           └── WishCard
        │     ├── SenderEnvelope
        │     │     └── SenderModal  (full-screen)
        │     │           └── SenderWishCard
        │     ├── TaskPanel
        │     │     └── TaskItem  (× 4)
        │     └── ConfettiOverlay
        └── NotFoundPage  (/not-found)
```

---

## 7. Design System

### 7.1 Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Navy | `#1F3264` | Brand, headings, UI chrome |
| Gold | `#D4A853` | Sender envelope, accents, progress bar |
| Coral | `#E8745A` | Heartfelt tag, warm accents |
| Sage | `#5A8F6A` | Funny tag, success states |
| Lilac | `#7B62A3` | Inspirational tag |
| Sky | `#8AB4D4` | Sweet tag, cool accents |

### 7.2 Typography

| Font | Usage |
|------|-------|
| Playfair Display | Hero title (Receiver's name) — large, italic, serif |
| Caveat | Wish messages, envelope names — handwritten feel |
| DM Sans | Body copy, labels, UI elements — clean, readable |

### 7.3 Key Animations

| Animation | Description |
|-----------|-------------|
| Page load | Staggered fade-down of hero elements (100ms offsets) |
| Envelope entrance | Cards drop in from above with spring easing, 80ms stagger |
| Envelope open | CSS 3D perspective flip — flap lifts, card slides out |
| Unlock sequence | Glow → ribbon untie → lock spin-out → envelope shake |
| Task complete | Confetti burst at task item + green checkmark scale-in |
| Filter transition | AnimatePresence fade+scale on entering/exiting cards |
| All tasks done | Full-page fireworks (canvas particle system) |

---

## 8. V1.1 Roadmap — Sender's Special Box Extensions

The sender's wish card has a reserved placeholder at the bottom for these upcoming additions.

| # | Feature | Description |
|---|---------|-------------|
| 1 | 🎵 Voice Note | Sender records or uploads a short audio message. Plays inside the modal. |
| 2 | 📸 Photo Gallery | A collage of shared photos appears at the bottom of the sender card. |
| 3 | 🎁 Gift Reveal | Gift card image or custom present reveal animation inside the modal. |
| 4 | 🎬 Video Message | Embed a short video (YouTube/Loom) directly into the sender's card. |
| 5 | 🔗 Memory Link | Link to a shared Google Photos album or memory board. |
| 6 | ✏️ Admin Panel | Simple UI for the sender to add/edit wishes without direct DB access. |

---

## 9. Acceptance Criteria

### 9.1 Database
- All three tables created in Supabase with correct column types and constraints.
- RLS enabled. Anon key reads `birthday_pages` and `wishes`. Reads/writes `page_sessions` only with matching `session_key`.
- A demo `birthday_pages` row exists with a test slug (e.g. `demo`). `wishes` table is empty — no content required for v1.0.

### 9.2 Page Load
- Valid slug renders hero with correct `receiver_name` and `sender_name` from DB.
- Invalid slug redirects to `/not-found`.
- Session is created or restored from localStorage on every load.

### 9.3 Envelope Grid
- Empty `wishes` table shows friendly empty state: *"Wishes are on their way! 💌"*
- When wishes exist, each non-sender wish renders as a closed envelope.
- Clicking an envelope opens it and the opened state persists on reload.

### 9.4 Sender Envelope Lock / Unlock
- Sender envelope renders locked on first visit.
- Clicking locked envelope shows shake + tooltip — does not open.
- When last friend envelope is opened, `all_opened = true` is set in DB and unlock animation fires within 500ms.
- Clicking unlocked sender envelope opens full-screen modal with sender wish content.

### 9.5 Gamification
- Task 1 (open first wish) completes and shows confetti on first envelope open.
- Task 4 (open all) completes simultaneously with sender envelope unlock.
- All task states persist across reloads via session.

---

## 10. Open Questions

- Should the page be public (anyone with the link) or require a simple PIN for the Receiver?
- How will the Sender add wishes — direct Supabase dashboard, or a lightweight `/admin` form page?
- Should multiple sessions (Receiver on two devices) merge `opened_wish_ids` or stay independent?
- Is there a preferred URL format — custom domain or Vercel subdomain (e.g. `priya.birthdaydrop.com`)?
- Should confetti/fireworks be disableable for users with `prefers-reduced-motion`?

---

*BirthdayDrop PRD v1.0 — Internal Use Only*
