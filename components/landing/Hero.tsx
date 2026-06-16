import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const bars = [0.4, 0.7, 1, 0.55, 0.85, 0.65, 0.45];

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.14) 0%, transparent 65%)",
        }}
      />

      <div className="relative max-w-3xl">
        {/* Badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs text-[var(--text-secondary)] shadow-[var(--card-shadow)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
          </span>
          AI-powered mock interviews
        </div>

        <h1 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl">
          <span className="block text-[var(--text-primary)]">Practice smarter.</span>
          <span className="block text-amber-500">Interview better.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-[var(--text-secondary)]">
          Prept gives you real AI coaching on every answer. Speak your response,
          get scored in seconds.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/auth/signup">
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <a href="#how-it-works">See how it works</a>
          </Button>
        </div>

        {/* Waveform */}
        <div className="mt-16 flex h-16 items-end justify-center gap-1.5">
          {bars.map((h, i) => (
            <span
              key={i}
              className="w-2 origin-bottom rounded-full bg-gradient-to-t from-amber-600 to-amber-400 animate-wave"
              style={{
                height: `${h * 100}%`,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
