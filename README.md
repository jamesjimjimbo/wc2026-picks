# World Cup 2026 Picks Tracker ⚽

A web app for friends to predict FIFA World Cup 2026 match winners and compete for points. Supports multiple leagues — send different invite codes to different friend groups, everyone uses the same site.


## How It Works

- **72 group stage matches** across 12 groups. Everyone wagers 1pt per match automatically.
- **If you're right**, you earn points equal to the closing decimal odds (e.g., pick an underdog at 4.50 → earn 4.50 pts).
- **Picks lock at kickoff** for each individual match.
- **Shared picks, separate leaderboards**: you make picks once, but each league has its own standings.
- **Leagues**: You (admin) create leagues and hand out invite codes. Friends enter the code after signing up.

## Step-by-Step: Getting the Site Live

### Step 1: Get the code on GitHub

1. Go to [github.com/new](https://github.com/new) and create a new **private** repo (e.g. `wc2026-picks`)
2. On your computer, unzip this project and run:

```bash
cd wc2026-picks
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wc2026-picks.git
git push -u origin main
```

### Step 2: Set up Supabase (free)

1. Go to [supabase.com](https://supabase.com) and sign up / log in
2. Click **New Project** — pick a name, set a database password, choose a region close to your users
3. Wait ~2 minutes for it to spin up
4. Go to **SQL Editor** (left sidebar) → click **New query**
5. Paste the entire contents of `supabase-schema.sql` into the editor
6. Click **Run** — you should see "Success. No rows returned" for each statement
7. Go to **Authentication → Providers → Email** and toggle OFF **"Confirm email"** (so friends can sign up instantly without checking email)
8. Go to **Settings → API** (under Configuration) — copy:
   - **Project URL** (looks like `https://abc123.supabase.co`)
   - **anon public** key (the long one starting with `eyJ...`)

### Step 3: Deploy to Vercel (free)

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click **Add New → Project**
3. Import your `wc2026-picks` repo from GitHub
4. Before clicking Deploy, expand **Environment Variables** and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

5. Click **Deploy** — takes about 60 seconds
6. You'll get a URL like `wc2026-picks.vercel.app` — that's your live site!

### Step 4: (Optional) Custom domain

1. In Vercel → your project → **Settings → Domains**
2. Add your domain (e.g. `picks.yourdomain.com`)
3. Update your DNS as Vercel instructs (usually a CNAME record)

### Step 5: Make yourself admin

1. Go to your live site and **sign up** with your email
2. Go back to Supabase → **SQL Editor** → run:

```sql
UPDATE public.profiles SET is_admin = true WHERE display_name = 'YOUR_NAME';
```

(Use whatever display name you entered at signup)

### Step 6: Create your first league

1. Log in to the site → go to the **⚙️ Admin** tab
2. Click the **Leagues** sub-tab
3. Type a league name (e.g. "Kieve Boys") and optionally a custom invite code (e.g. `KIEVE26`)
4. Click **Create League**
5. Text the invite code to your friends

### Step 7: Tell your friends

Send them a message like:

> "Go to [your-site-url], sign up, and enter code **KIEVE26** when it asks. Pick your winners before each match kicks off!"

That's it. They sign up, enter the code, and start picking.

---

## Admin Tasks During the Tournament

As admin, you'll enter results and odds via the Admin tab:

- **Before each match**: Enter the odds (home / draw / away decimal odds). You can get these from any betting site ~30 min before kickoff.
- **After each match**: Click the winning result button (home team / draw / away team). The leaderboard updates automatically.

## Project Structure

```
src/
  app/
    layout.js            # Root layout
    page.js              # Main page (auth → league gate → app)
    globals.css          # Tailwind + custom styles
  components/
    AuthProvider.js      # Auth context
    AuthForm.js          # Login / signup form
    JoinLeague.js        # Invite code entry screen
    Header.js            # Header with league switcher + alerts
    MatchCard.js         # Individual match pick card
    PicksView.js         # Browse-by-group picks
    LeaderboardView.js   # League-scoped standings
    ResultsView.js       # Completed matches
    AdminView.js         # Admin: results/odds + league management
  data/
    matches.js           # All 72 group stage matches + helpers
  lib/
    supabase-browser.js  # Supabase browser client
    supabase-server.js   # Supabase server client
supabase-schema.sql      # Database schema — run in Supabase SQL Editor
```


## Tech Stack

- **Next.js 14** (React, deployed on Vercel)
- **Supabase** (PostgreSQL database + Auth, free tier)
- **Tailwind CSS** (styling)
