"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Layers,
  Star,
  MessageSquareText,
  Trophy,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentSessions } from "@/components/dashboard/RecentSessions";
import { createClient } from "@/lib/supabase/client";
import type { Session } from "@/types";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("there");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const displayName =
          (user.user_metadata?.name as string | undefined) ||
          user.email?.split("@")[0] ||
          "there";
        setName(displayName);
      }

      const { data: sess } = await supabase
        .from("sessions")
        .select("*")
        .order("created_at", { ascending: false });
      setSessions((sess as Session[]) ?? []);

      const { count } = await supabase
        .from("responses")
        .select("*", { count: "exact", head: true });
      setQuestionsAnswered(count ?? 0);

      setLoading(false);
    })();
  }, []);

  const completed = sessions.filter(
    (s) => s.status === "completed" && s.total_score != null
  );
  const avgScore =
    completed.length > 0
      ? completed.reduce((sum, s) => sum + Number(s.total_score), 0) /
        completed.length
      : null;
  const bestScore =
    completed.length > 0
      ? Math.max(...completed.map((s) => Number(s.total_score)))
      : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-4xl capitalize tracking-tight">
            {greeting()}, {name}.
          </h1>
          <p className="mt-1 text-[var(--text-secondary)]">
            Ready for your next practice session?
          </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-amber-400" />
          </div>
        ) : (
          <>
            {/* stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="Total Sessions"
                value={sessions.length}
                icon={Layers}
              />
              <StatCard
                label="Average Score"
                value={avgScore != null ? `${avgScore.toFixed(1)}/10` : "—"}
                icon={Star}
              />
              <StatCard
                label="Questions Answered"
                value={questionsAnswered}
                icon={MessageSquareText}
              />
              <StatCard
                label="Best Score"
                value={bestScore != null ? `${bestScore.toFixed(1)}/10` : "—"}
                icon={Trophy}
              />
            </div>

            {/* primary CTA */}
            <Link
              href="/session/new"
              className="group mt-6 flex items-center justify-between gap-4 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 to-amber-500/5 px-6 py-6 transition hover:border-amber-500/60"
            >
              <div>
                <p className="font-display text-2xl">Start New Session</p>
                <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                  Pick a role, answer out loud, get coached instantly.
                </p>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500 text-black transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>

            {/* recent */}
            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-2xl">Recent sessions</h2>
                {sessions.length > 5 && (
                  <Link
                    href="/history"
                    className="text-sm text-amber-400 hover:underline"
                  >
                    View all
                  </Link>
                )}
              </div>
              <RecentSessions sessions={sessions.slice(0, 5)} />
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
