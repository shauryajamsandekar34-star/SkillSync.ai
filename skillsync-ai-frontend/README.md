# SkillSync AI — Frontend

Next.js (App Router) frontend for an AI interview coach: resume analysis,
text-based mock interview practice, and a progress dashboard.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. The app runs entirely on mock data out of the
box — no backend required to develop or demo the UI.

## How this connects to the backend

`lib/api.js` is the only file that talks to the network. Every page imports
functions from it (`uploadResume`, `getInterviewQuestion`,
`submitInterviewAnswer`, `getDashboardStats`) instead of calling `fetch()`
directly. As long as `NEXT_PUBLIC_API_BASE_URL` is unset, those functions
return realistic mock data from `lib/mockData.js` with a short artificial
delay, so every page already works end-to-end.

When your teammate's backend has endpoints ready:

1. Share `API_CONTRACT.md` with them — it's the exact request/response
   shape each endpoint needs to match.
2. Copy `.env.local.example` to `.env.local` and set
   `NEXT_PUBLIC_API_BASE_URL` to the backend's URL.
3. Restart `npm run dev`. No page code changes — `lib/api.js` switches
   from mocks to real `fetch()` calls automatically.

You don't need all four endpoints at once — bring them online one at a
time and that one page will start hitting the real API while the rest
keep running on mocks (this only requires a small tweak in `lib/api.js`
to flip individual endpoints rather than the whole base URL, if you want
to integrate incrementally).

## Project structure

```
app/
  page.js              landing page
  resume/page.js        resume upload & analysis
  interview/page.js     mock interview Q&A
  dashboard/page.js     progress dashboard
components/             shared UI (NavBar, ScriptLine, ScoreBadge, Card)
lib/
  api.js                 the only place that calls the network
  mockData.js            mock responses, mirrors the API contract
API_CONTRACT.md          the request/response contract for the backend
```

## Design notes

Visual language is a "rehearsal room before a performance": a dark stage
hero on the landing page, and a paper-toned working surface for the actual
tool. The signature component is `ScriptLine` — interview Q&A and feedback
render like a numbered rehearsal script with "Coach" and "You" turns,
reused across the interview and feedback views so the whole product reads
as one continuous script.

Fonts: Fraunces (display), Inter (body), IBM Plex Mono (cue numbers,
scores, technical labels) — all loaded via `next/font/google`, no extra
setup needed.
