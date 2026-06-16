import Link from "next/link";
import { Mic } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#2A2A3C] bg-[#09090E]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-black">
            <Mic className="h-3.5 w-3.5" />
          </span>
          <span className="font-display text-lg">Prept</span>
          <span className="ml-2 text-sm text-[#9492A4]">
            Practice smarter. Interview better.
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#9492A4]">
          <Link href="/auth/signup" className="transition hover:text-[#F1F0EE]">
            Get started
          </Link>
          <a
            href="https://docs.anthropic.com"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-[#F1F0EE]"
          >
            Built with Claude
          </a>
          <span className="text-[#5b5a6b]">
            Sparks Summer Challenge 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
