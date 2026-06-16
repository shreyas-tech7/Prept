# Prept — AI Interview Coach

> Practice smarter. Interview better.

Built for **Sparks Summer Challenge 2026** (AI & Automation theme).

Prept turns your browser into an interview coaching session. Pick a role, answer
questions **out loud**, and get an AI score with specific, actionable coaching
within seconds — for free.

---

## Problem

Most job seekers practice interviews by reading sample questions — but never
actually speaking answers aloud. When they get to a real interview, they freeze,
ramble, or forget to structure their thoughts. There's no affordable,
always-available tool that coaches you on **how** you answer, not just what you
should know.

## Solution

Prept turns your browser into an interview coaching session. Speak your answers
naturally. Get an AI score and specific coaching within seconds. Practice as many
times as you need, for free.

## Features

- 🎙 Real-time voice-to-text via the Web Speech API (with a typing fallback)
- 🤖 AI evaluation using Claude (score, strengths, improvements, model answer)
- ⭐ STAR method breakdown for behavioral questions
- 📊 Session history and progress tracking
- 🎯 6 role categories, 3 difficulty levels, 3 interview types
- 💼 Paste a job description for tailored questions
- ✨ **Guest demo** — try a sample question on the landing page, no sign-up

## Tech Stack

| Layer        | Tool                                        |
| ------------ | ------------------------------------------- |
| Framework    | Next.js 14 (App Router)                     |
| Styling      | Tailwind CSS + hand-rolled shadcn-style UI  |
| Auth + DB    | Supabase (`@supabase/ssr`, Postgres, RLS)   |
| AI           | Anthropic Claude (`claude-haiku-4-5-20251001`) |
| Voice        | Web Speech API (browser-native, zero cost)  |
| Deployment   | Vercel                                      |
| Fonts        | DM Serif Display (headings) + DM Sans (body)|

No paid third-party services — everything runs on free tiers.

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier)
- An Anthropic API key (free credits on signup)

### Installation

```bash
git clone https://github.com/your-username/prept
cd prept
npm install
cp .env.example .env.local
# Fill in your environment variables (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The app ships with **placeholder** env values in `.env.local` so it builds and
> the landing page + guest demo work immediately. Add real keys to enable auth,
> persistence, and live AI question generation/evaluation.

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
```

- **Supabase** values: Dashboard → Project Settings → API.
- **Anthropic** key: https://console.anthropic.com/settings/keys.

### Database Setup

1. Open your Supabase project's SQL editor.
2. Run the schema from [`supabase/schema.sql`](supabase/schema.sql).
3. Row Level Security policies are included in that file (users only ever see
   their own sessions and responses).

### Deployment

1. Push to GitHub.
2. Import the repo into Vercel.
3. Add the four environment variables in the Vercel dashboard.
4. Deploy.

## How It Works

1. **Choose your role** — pick a job title or paste a job description.
2. **Answer out loud** — the Web Speech API transcribes your spoken answer live.
3. **Get coached** — your answer is sent to a Next.js API route, scored by Claude
   against role-specific standards, and returned with strengths, improvements, a
   model answer, and (for behavioral questions) a STAR breakdown.

Questions are generated **progressively** — the next one is only created when you
click "Next question," and previously asked questions are passed back to the model
so it never repeats itself.

## Project Structure

```
prept/
├── app/
│   ├── globals.css                # Design tokens + fonts
│   ├── layout.tsx                 # Root layout, metadata, toast provider
│   ├── page.tsx                   # Landing page (+ guest demo)
│   ├── auth/login | signup/       # Supabase email/password auth
│   ├── dashboard/                 # Stats + recent sessions
│   ├── session/new/               # 3-step setup wizard
│   ├── session/[id]/              # Active interview (the core experience)
│   ├── history/                   # Past sessions with inline Q&A breakdown
│   └── api/
│       ├── generate-question/     # Claude → next question
│       ├── evaluate-answer/       # Claude → score + feedback (saved to DB)
│       └── end-session/           # Computes average, marks complete
├── components/
│   ├── ui/                        # button, card, badge, toast, dialog, …
│   ├── layout/                    # Navbar, Footer
│   ├── landing/                   # Hero, HowItWorks, Features, Demo, CTA
│   ├── session/                   # VoiceRecorder, QuestionCard, FeedbackCard,
│   │                              # ScoreRing, SessionSummary
│   └── dashboard/                 # StatCard, RecentSessions
├── lib/
│   ├── supabase/{client,server}.ts
│   ├── anthropic.ts               # Lazy Claude client + JSON parsing
│   └── prompts.ts                 # All AI prompts in one place
├── types/index.ts
├── middleware.ts                  # Protects /dashboard, /session, /history
└── supabase/schema.sql
```

## Security Notes

- `ANTHROPIC_API_KEY` is **only** ever read server-side inside `/app/api/*`
  routes — it is never exposed to the browser.
- All database access is gated by Supabase Row Level Security.
- Model JSON output is parsed defensively (markdown fences stripped, wrapped in
  try/catch).

## Future Roadmap

- AI-generated personalized study plans based on weak areas
- Video recording with body language and eye contact tips
- Industry-specific question banks (finance, healthcare, engineering)
- Peer mock interview matching
- LinkedIn integration to auto-fill role context
- Team plans for bootcamps and career centers
- Mobile app (React Native)

## References

- Anthropic Claude API: https://docs.anthropic.com
- Supabase Docs: https://supabase.com/docs
- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- STAR Interview Method: https://www.themuse.com/advice/star-interview-method
