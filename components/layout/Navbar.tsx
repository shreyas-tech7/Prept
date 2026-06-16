"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  LogOut,
  LayoutDashboard,
  History as HistoryIcon,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/ThemeProvider";

export function Navbar() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className="sticky top-0 z-40 border-b border-[var(--border)] backdrop-blur-md"
      style={{ backgroundColor: "var(--nav-bg)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-black">
            <Mic className="h-4 w-4" />
          </span>
          <span className="font-display text-xl tracking-tight">Prept</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {authed ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/history">
                  <HistoryIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Start free</Link>
              </Button>
            </>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:border-amber-500/40 hover:text-[var(--text-primary)]"
          >
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
