"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import { ScoreRing } from "@/components/session/ScoreRing";
import { createClient } from "@/lib/supabase/client";
import { cn, formatRelativeDate } from "@/lib/utils";
import type { InterviewType, Response, Session } from "@/types";

const FILTERS: { value: "all" | InterviewType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "behavioral", label: "Behavioral" },
  { value: "technical", label: "Technical" },
  { value: "mixed", label: "Mixed" },
];

const difficultyLabel: Record<string, string> = {
  entry: "Entry",
  mid: "Mid",
  senior: "Senior",
};

function typeVariant(t: string): BadgeProps["variant"] {
  if (t === "behavioral") return "behavioral";
  if (t === "technical") return "technical";
  if (t === "mixed") return "mixed";
  return "neutral";
}

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [responsesBySession, setResponsesBySession] = useState<
    Record<string, Response[]>
  >({});
  const [filter, setFilter] = useState<"all" | InterviewType>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: sess } = await supabase
        .from("sessions")
        .select("*")
        .order("created_at", { ascending: false });
      setSessions((sess as Session[]) ?? []);

      const { data: resp } = await supabase
        .from("responses")
        .select("*")
        .order("question_number", { ascending: true });

      const grouped: Record<string, Response[]> = {};
      for (const r of (resp as Response[]) ?? []) {
        (grouped[r.session_id] ??= []).push(r);
      }
      setResponsesBySession(grouped);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? sessions
        : sessions.filter((s) => s.interview_type === filter),
    [sessions, filter]
  );

  const completed = sessions.filter(
    (s) => s.status === "completed" && s.total_score != null
  );
  const avgScore =
    completed.length > 0
      ? completed.reduce((sum, s) => sum + Number(s.total_score), 0) /
        completed.length
      : null;
  const questionsAnswered = Object.values(responsesBySession).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="font-display text-4xl tracking-tight">
          Your Practice History
        </h1>

        {/* aggregate stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: "Sessions", value: sessions.length },
            {
              label: "Avg Score",
              value: avgScore != null ? avgScore.toFixed(1) : "—",
            },
            { label: "Questions", value: questionsAnswered },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-[#2A2A3C] bg-[#13131A] p-4 text-center"
            >
              <p className="font-display text-2xl">{s.value}</p>
              <p className="text-xs text-[#9492A4]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* filter tabs */}
        <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm transition",
                filter === f.value
                  ? "border-amber-500 bg-amber-500/10 text-amber-300"
                  : "border-[#2A2A3C] text-[#9492A4] hover:text-[#F1F0EE]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* list */}
        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-amber-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#2A2A3C] bg-[#13131A] p-10 text-center">
              <p className="font-display text-xl">No sessions yet.</p>
              <Link
                href="/session/new"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:underline"
              >
                Start your first practice
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            filtered.map((s) => {
              const isOpen = expanded === s.id;
              const responses = responsesBySession[s.id] ?? [];
              const score =
                s.total_score != null ? Number(s.total_score) : null;
              return (
                <div
                  key={s.id}
                  className="overflow-hidden rounded-xl border border-[#2A2A3C] bg-[#13131A]"
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : s.id)}
                    className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-[#1C1C27]/40"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-xl">{s.role}</span>
                        <Badge variant={typeVariant(s.interview_type)}>
                          {s.interview_type}
                        </Badge>
                        <Badge variant="neutral">
                          {difficultyLabel[s.difficulty] ?? s.difficulty}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-[#9492A4]">
                        {formatRelativeDate(s.created_at)} ·{" "}
                        {s.status === "completed"
                          ? `${responses.length} answered`
                          : "In progress"}
                      </p>
                    </div>

                    {score != null ? (
                      <ScoreRing score={score} size={56} stroke={5} label="" />
                    ) : (
                      <Link
                        href={`/session/${s.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-sm font-medium text-amber-400 hover:underline"
                      >
                        Resume
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}

                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-[#9492A4] transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="animate-fade-in border-t border-[#2A2A3C] p-5">
                      {responses.length === 0 ? (
                        <p className="text-sm text-[#9492A4]">
                          No answered questions in this session yet.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {responses.map((r) => (
                            <div
                              key={r.id}
                              className="rounded-lg border border-[#2A2A3C] bg-[#0F0F16] p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-medium text-[#F1F0EE]">
                                  Q{r.question_number}. {r.question}
                                </p>
                                {r.score != null && (
                                  <Badge variant="default">
                                    {Number(r.score).toFixed(1)}
                                  </Badge>
                                )}
                              </div>
                              {(r.strengths?.length ||
                                r.improvements?.length) && (
                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                  {r.strengths?.length ? (
                                    <div>
                                      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Strengths
                                      </p>
                                      <ul className="space-y-1 text-xs text-[#C9C8D3]">
                                        {r.strengths.map((x, i) => (
                                          <li key={i}>• {x}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  ) : null}
                                  {r.improvements?.length ? (
                                    <div>
                                      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-orange-400">
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                        Improve
                                      </p>
                                      <ul className="space-y-1 text-xs text-[#C9C8D3]">
                                        {r.improvements.map((x, i) => (
                                          <li key={i}>• {x}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  ) : null}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
