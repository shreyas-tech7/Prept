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
        <p className="mt-3 text-[#9492A4]">
          From cold to confident in three steps.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.label}
            className="rounded-xl border border-[#2A2A3C] bg-[#13131A] p-7"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <step.icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl">{step.label}</h3>
            <p className="mt-2 text-[#9492A4]">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
