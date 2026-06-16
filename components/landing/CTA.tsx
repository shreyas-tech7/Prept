import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] px-6 py-16 text-center shadow-[var(--card-shadow)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(245,158,11,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative">
          <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
            Ready to ace your next interview?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--text-secondary)]">
            Create a free account and run your first mock interview in under a
            minute.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
