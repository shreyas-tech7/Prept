# Graph Report - .  (2026-06-15)

## Corpus Check
- Corpus is ~20,980 words - fits in a single context window. You may not need a graph.

## Summary
- 250 nodes · 441 edges · 20 communities (11 shown, 9 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Auth & Root Layout|Auth & Root Layout]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Session Components & Utils|Session Components & Utils]]
- [[_COMMUNITY_Dashboard & History UI|Dashboard & History UI]]
- [[_COMMUNITY_Landing Page Sections|Landing Page Sections]]
- [[_COMMUNITY_Middleware & Data Model|Middleware & Data Model]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_API Routes & AI Integration|API Routes & AI Integration]]
- [[_COMMUNITY_Feedback & Scoring UI|Feedback & Scoring UI]]
- [[_COMMUNITY_Graphify Skill Docs|Graphify Skill Docs]]
- [[_COMMUNITY_Card UI Primitives|Card UI Primitives]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Tailwind Config|Tailwind Config]]
- [[_COMMUNITY_Launch Configuration|Launch Configuration]]
- [[_COMMUNITY_Claude Code Settings|Claude Code Settings]]
- [[_COMMUNITY_Local Permissions|Local Permissions]]
- [[_COMMUNITY_Next.js Configuration Node|Next.js Configuration Node]]
- [[_COMMUNITY_Package Manifest Node|Package Manifest Node]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 16 edges
2. `compilerOptions` - 15 edges
3. `Button` - 11 edges
4. `Session` - 10 edges
5. `Graphify Build Pipeline (SKILL.md)` - 10 edges
6. `useToast()` - 9 edges
7. `createClient()` - 9 edges
8. `FeedbackResult` - 9 edges
9. `Badge()` - 8 edges
10. `ScoreRing()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `SpeechRecognition` --semantically_similar_to--> `Web Speech API (browser-native voice recognition)`  [INFERRED] [semantically similar]
  types/speech.d.ts → README.md
- `StarBreakdown` --conceptually_related_to--> `STAR Interview Method`  [INFERRED]
  types/index.ts → README.md
- `colorFor()` --semantically_similar_to--> `scoreColor()`  [INFERRED] [semantically similar]
  components/session/ScoreRing.tsx → lib/utils.ts
- `Prept AI Interview Coach (project overview)` --references--> `sessions Table (interview practice runs)`  [INFERRED]
  README.md → supabase/schema.sql
- `Prept Design Tokens (dark theme, DM fonts, animations)` --conceptually_related_to--> `Prept AI Interview Coach (project overview)`  [INFERRED]
  tailwind.config.ts → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Interview Session API Lifecycle (generate → evaluate → end)** — generate_question_route, evaluate_answer_route, end_session_route [INFERRED 0.95]
- **Landing Page Section Composition** — landing_hero, landing_features, landing_demosection, landing_cta [EXTRACTED 1.00]
- **Dashboard Data Aggregation and Display** — dashboard_page, dashboard_statcard, dashboard_recentsessions [EXTRACTED 1.00]
- **Interview Q&A Session Cycle** — session_questioncard_questioncard, session_voicerecorder_voicerecorder, session_feedbackcard_feedbackcard [INFERRED 0.95]
- **AI Evaluation Pipeline** — lib_anthropic_getanthropic, lib_prompts_buildevaluationprompt, lib_anthropic_parsemodelejson [INFERRED 0.95]
- **Score Color Mapping System (with duplication)** — session_scorering_colorfor, lib_utils_scorecolor, session_scorering_scorering [INFERRED 0.85]
- **Prept Core Data Model (DB Schema + TypeScript Types)** — supabase_schema_sessions, supabase_schema_responses, types_index_session, types_index_response [INFERRED 0.95]
- **Auth and Access Control Flow (middleware + RLS)** — middleware_middleware, middleware_protected_routes, supabase_schema_rls [INFERRED 0.85]
- **STAR Method Interview Evaluation Feature** — types_index_starbreakdown, types_index_feedbackresult, readme_star_method [INFERRED 0.85]

## Communities (20 total, 9 thin omitted)

### Community 0 - "Auth & Root Layout"
Cohesion: 0.07
Nodes (28): metadata, AuthForm(), AuthFormProps, AnsweredItem, dedupe(), Phase, SessionPage(), COUNTS (+20 more)

### Community 1 - "Package Dependencies"
Cohesion: 0.06
Nodes (31): dependencies, @anthropic-ai/sdk, class-variance-authority, clsx, lucide-react, next, @radix-ui/react-dialog, @radix-ui/react-slot (+23 more)

### Community 2 - "Session Components & Utils"
Cohesion: 0.12
Nodes (21): RecentSessions(), cn(), formatRelativeDate(), scoreColor(), difficultyLabel, QuestionCard(), QuestionCardProps, typeVariant() (+13 more)

### Community 3 - "Dashboard & History UI"
Cohesion: 0.15
Nodes (17): DashboardPage(), greeting(), StatCard(), StatCardProps, difficultyLabel, FILTERS, Footer(), Navbar() (+9 more)

### Community 4 - "Landing Page Sections"
Cohesion: 0.15
Nodes (11): CTA(), DemoSection(), Features, stats, bars, Hero(), HowItWorks(), steps (+3 more)

### Community 5 - "Middleware & Data Model"
Cohesion: 0.12
Nodes (17): config, middleware(), protectedRoutes, Prept AI Interview Coach (project overview), STAR Interview Method, Web Speech API (browser-native voice recognition), responses Table (per-question answers), Row Level Security Policies (user-scoped access) (+9 more)

### Community 6 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "API Routes & AI Integration"
Cohesion: 0.28
Nodes (11): Best-Effort DB Persistence: Never Block Feedback on DB Error, POST(), POST(), POST(), getAnthropic(), MODEL (claude-haiku-4-5), parseModelJson, parseModelJson() (+3 more)

### Community 8 - "Feedback & Scoring UI"
Cohesion: 0.22
Nodes (9): FeedbackCard(), FeedbackCardProps, STAR_LABELS, colorFor(), ScoreRing(), ScoreRingProps, SessionSummary(), Separator (+1 more)

### Community 9 - "Graphify Skill Docs"
Cohesion: 0.18
Nodes (11): Graphify Skill Trigger Rule (.claude/CLAUDE.md), Graphify Knowledge Graph Rules (project CLAUDE.md), Graphify Build Pipeline (SKILL.md), Add URL and Watch Mode Reference, Extra Export Formats and Benchmark Reference, Extraction Subagent Prompt Specification, GitHub Clone and Cross-Repo Merge Reference, Commit Hook and CLAUDE.md Integration Reference (+3 more)

### Community 10 - "Card UI Primitives"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

## Knowledge Gaps
- **113 isolated node(s):** `extends`, `FILTERS`, `difficultyLabel`, `metadata`, `Phase` (+108 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Session` connect `Dashboard & History UI` to `Auth & Root Layout`, `Session Components & Utils`, `Middleware & Data Model`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `sessions Table (interview practice runs)` connect `Middleware & Data Model` to `Dashboard & History UI`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Session` (e.g. with `protectedRoutes (Protected Route List)` and `sessions Table (interview practice runs)`) actually correct?**
  _`Session` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `extends`, `FILTERS`, `difficultyLabel` to the rest of the system?**
  _114 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth & Root Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.0708245243128964 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `Session Components & Utils` be split into smaller, more focused modules?**
  _Cohesion score 0.1206896551724138 - nodes in this community are weakly interconnected._