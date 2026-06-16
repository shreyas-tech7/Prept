const features = [
  {
    emoji: "🎙",
    title: "Voice-first practice",
    body: "No typing needed. Speak like you would in a real interview.",
  },
  {
    emoji: "🎯",
    title: "Instant AI scoring",
    body: "Every answer scored 1–10 with specific feedback.",
  },
  {
    emoji: "⭐",
    title: "STAR method coaching",
    body: "Behavioral questions get broken down by Situation, Task, Action, Result.",
  },
  {
    emoji: "📈",
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
            className="group rounded-xl border border-[#2A2A3C] bg-[#13131A] p-7 transition-colors hover:border-amber-500/30"
          >
            <div className="text-3xl">{f.emoji}</div>
            <h3 className="mt-4 font-display text-2xl">{f.title}</h3>
            <p className="mt-2 text-[#9492A4]">{f.body}</p>
          </div>
        ))}
      </div>

      {/* social proof bar */}
      <div className="mt-12 flex flex-col items-center justify-center gap-4 rounded-xl border border-[#2A2A3C] bg-[#13131A] px-6 py-6 sm:flex-row sm:gap-12">
        {stats.map((s) => (
          <div key={s} className="flex items-center gap-2 text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="text-[#F1F0EE]">{s}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
