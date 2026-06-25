# chat-timer 💌

Track how many minutes each person takes to reply to messages. Built for two people who want to keep score (lovingly).

## Features

- **Settings** — set both names once, saved to localStorage
- **Log** — pick who was slow and enter the delay in minutes
- **Dashboard** — per-person stat cards (count, mean, std dev, max, min) + a combined histogram / normal-distribution chart with a μ±σ shaded band
- **History** — full log of every entry with instant delete

## Tech stack

| Layer | Library |
|---|---|
| UI | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 + Nunito (Google Fonts) |
| Routing | React Router v7 |
| Charts | Recharts |
| Database | Supabase (PostgreSQL) |

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run this in the **SQL Editor**:

```sql
create table response_times (
  id        bigint generated always as identity primary key,
  person    text    not null,
  minutes   integer not null,
  created_at timestamptz default now()
);
```

3. Under **Project Settings → API**, copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Publishable key** → `VITE_SUPABASE_KEY`

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Add your Supabase credentials
cp .env.example .env
# then edit .env with your real URL and key

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and go to Settings to enter both names before using the app.

## Environment variables

Create a `.env` file in the project root (never commit this file):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=sb_publishable_...
```

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` in **Vercel → Project → Settings → Environment Variables**.

### Netlify

```bash
npm run build
# drag the dist/ folder into Netlify's deploy UI
```

Or connect the repo and add the env vars in **Netlify → Site → Environment Variables**.

### Any static host

```bash
npm run build   # outputs to dist/
```

Upload the `dist/` folder. The app is fully client-side — no server required.

## Project structure

```
src/
  lib/
    supabase.js          # Supabase client initialisation
  components/
    Navbar.jsx           # Sticky top nav (all routes)
    StatCard.jsx         # Single stat display card
    CombinedChart.jsx    # Histogram + normal curve + μ±σ band
  pages/
    SettingsPage.jsx     # / — name setup
    InputPage.jsx        # /input — log a reply delay
    DashboardPage.jsx    # /dashboard — stats & chart per person
    HistoryPage.jsx      # /history — full log with delete
  App.jsx
  main.jsx
```
