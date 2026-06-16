import { Briefcase, Mic, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Briefcase,
    label: "Choose your role",
    body: "Pick a job title or paste a job description for tailored questions.",
  },
  {
    icon: Mic,
    label: "Answer out loud",
    body: "Speak your answer naturally, just like a real interview.",
  },
  {
    icon: Sparkles,
    label: "Get coached",
    body: "Receive a score and specific feedback in seconds.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <div className="mb-14 text-center">
        <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
          How it works
        </h2>
        <p className="mt-3 text-[var(--text-secondary)]">
          From cold to confident in three steps.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={step.label}
            className="group relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--card-shadow)] transition-all hover:border-amber-500/40"
          >
            {/* Step number — large background numeral */}
            <span
              className="absolute right-5 top-4 select-none font-display text-6xl leading-none text-[var(--border)] transition-colors group-hover:text-amber-500/20"
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <step.icon className="h-6 w-6" />
            </div>
            <h3 className="relative font-display text-2xl">{step.label}</h3>
            <p className="relative mt-2 text-[var(--text-secondary)]">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
