import Link from "next/link";
import { Mic } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-black">
            <Mic className="h-3.5 w-3.5" />
          </span>
          <span className="font-display text-lg">Prept</span>
          <span className="ml-1 text-sm text-[var(--text-secondary)]">
            Practice smarter. Interview better.
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-[var(--text-secondary)]">
          <Link
            href="/auth/signup"
            className="transition-colors hover:text-[var(--text-primary)]"
          >
            Get started
          </Link>
          <span className="text-[var(--text-tertiary)]">
            Sparks Summer Challenge 2026
          </span>
          <span className="text-[var(--text-tertiary)]">
            © 2026 Prept
          </span>
        </div>
      </div>
    </footer>
  );
}
