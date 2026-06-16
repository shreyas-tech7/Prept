import { Mic, Zap, BookOpen, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice-first practice",
    body: "No typing needed. Speak like you would in a real interview.",
  },
  {
    icon: Zap,
    title: "Instant AI scoring",
    body: "Every answer scored 1–10 with specific, actionable feedback.",
  },
  {
    icon: BookOpen,
    title: "STAR method coaching",
    body: "Behavioral questions get broken down by Situation, Task, Action, Result.",
  },
  {
    icon: TrendingUp,
    title: "Track your progress",
    body: "See your scores improve over time across sessions.",
  },
];

const stats = ["5 interview types", "Real-time feedback", "Free to start"];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--card-shadow)] transition-all hover:border-amber-500/40"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition-colors group-hover:bg-amber-500/15">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-2xl">{f.title}</h3>
            <p className="mt-2 text-[var(--text-secondary)]">{f.body}</p>
          </div>
        ))}
      </div>

      {/* Social proof bar */}
      <div className="mt-12 flex flex-col items-center justify-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-6 shadow-[var(--card-shadow)] sm:flex-row sm:gap-12">
        {stats.map((s) => (
          <div key={s} className="flex items-center gap-2 text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="text-[var(--text-primary)]">{s}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
