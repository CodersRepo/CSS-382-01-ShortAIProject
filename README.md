# 🎬 MoviePicker

A polished, interactive single-page web app for discovering movies based on genre, mood, runtime, and more. Built with React + Vite, optionally powered by the TMDB live database.

**Live site:** https://movie-picker-css-382.netlify.app

---

## Features

- **Multi-select genre & mood chips** — pick any combination to narrow results
- **Runtime presets** — Under 90 min, 90–120 min, 120–150 min, 150+ min
- **Year range dual sliders** — filter by release decade
- **Min rating chips** — 6+, 7+, 8+, 9+
- **Streaming platform toggles** — Netflix, Hulu, Prime, Disney+, Max
- **12-language filter** — English, Korean, French, Japanese, Spanish, German, Italian, Portuguese, Chinese, Hindi, Arabic, Russian
- **Live search** — instant debounced filtering
- **Sort** — by rating, year, runtime, or title A–Z
- **🎲 Surprise Me** — picks a random match with confetti
- **🔄 Not this one** — cycles to the next recommendation
- **♥ Favorites** — saved to localStorage, viewable in a slide-in panel
- **👁 Watched toggle** — mark movies as seen
- **Tonight's Pick** — hero card with match-score ring, full metadata, and a "why recommended" explanation
- **Match score %** — shown on every card
- **Movie detail modal** — star rating, full description, platforms, mood tags
- **Load More pagination** — browse hundreds of TMDB results
- **Dark / Light theme toggle**
- **Responsive design** — works on mobile and desktop
- **Keyboard accessible** — Enter/Space to open cards, Esc to close modals

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 |
| Build tool | Vite 6 |
| Styling | Inline CSS-in-JS (no external CSS lib) |
| Data | TMDB API v3 (live) / 25-movie mock (offline) |
| Persistence | localStorage (favorites, watched, theme) |
| Hosting | Netlify |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & run

```bash
git clone <repo-url>
cd CSS-382-01-ShortAIProject
npm install
npm run dev
```

Open http://localhost:5173 — the app works immediately with 25 demo movies.

---

## Connecting to TMDB (live database)

Get access to 500,000+ real movies in a few minutes:

1. Create a free account at https://www.themoviedb.org
2. Go to **Settings → API** and copy your **API Key (v3 auth)**
3. Create a `.env.local` file in the project root:

```env
VITE_TMDB_API_KEY=your_api_key_here
```

4. Restart the dev server (`npm run dev`)

The app detects the key automatically. A green **● TMDB** badge appears in the navbar when live mode is active.

### Adding the key to the Netlify deployment

1. Open https://app.netlify.com/projects/movie-picker-css-382
2. Go to **Site configuration → Environment variables**
3. Add `VITE_TMDB_API_KEY` with your key
4. Trigger a redeploy — the live site will now pull from TMDB

---

## Project Structure

```
src/
├── data/
│   └── movies.js          # 25-movie mock dataset + genre/mood/platform constants
├── services/
│   └── tmdb.js            # TMDB API calls, genre maps, mood inference, movie mapper
├── components/
│   ├── Navbar.jsx          # Sticky nav: title, TMDB badge, theme toggle, favorites
│   ├── Hero.jsx            # Tagline + live match count stats
│   ├── FilterPanel.jsx     # All filter controls (collapsible)
│   ├── MovieCard.jsx       # Grid card with poster, tags, fav/watched actions
│   ├── MovieModal.jsx      # Full detail modal (Esc to close)
│   ├── ResultsSection.jsx  # Tonight's Pick hero card + movie grid + Load More
│   ├── FavoritesPanel.jsx  # Slide-in favorites drawer
│   ├── ApiSetupBanner.jsx  # Setup prompt shown in demo mode
│   └── Confetti.jsx        # Particle burst on "Surprise Me"
├── App.jsx                 # Root: state, TMDB fetching, filtering logic
└── index.css               # Design tokens (dark/light), keyframe animations
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server at localhost:5173 |
| `npm run build` | Production build to `/dist` |
| `npm run preview` | Preview the production build locally |

---

## How Mood Inference Works

TMDB doesn't have a "mood" field, so moods are inferred from genre IDs:

| Mood | Mapped TMDB Genres |
|---|---|
| Feel-good | Comedy, Animation, Romance, Family, Adventure |
| Dark | Horror, Thriller, Crime, Mystery |
| Emotional | Drama, Romance, Music |
| Mind-bending | Sci-Fi, Mystery, Fantasy |
| Relaxing | Animation, Comedy, Romance, Family |
| Suspenseful | Thriller, Horror, Mystery, Crime |
| Inspirational | Drama, Action, War, History |
| Funny | Comedy, Animation |

---

## Course Context

Built for **CSS 382 — Week 1 Short AI Project** at UW.  
The `context.txt` file contains the original LLM prompt used to spec and generate this application.
