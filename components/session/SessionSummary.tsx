"use client";

import {
  Trophy,
  RotateCcw,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/session/ScoreRing";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import { scoreColor } from "@/lib/utils";

interface SummaryResponse {
  question_number: number;
  question_type?: string;
  score?: number;
}

interface SessionSummaryProps {
  averageScore: number;
  responses: SummaryResponse[];
  strengths: string[];
  improvements: string[];
  onPracticeAgain: () => void;
  onDashboard: () => void;
}

function typeVariant(t?: string): BadgeProps["variant"] {
  if (t === "behavioral") return "behavioral";
  if (t === "technical") return "technical";
  if (t === "situational") return "situational";
  return "neutral";
}

export function SessionSummary({
  averageScore,
  responses,
  strengths,
  improvements,
  onPracticeAgain,
  onDashboard,
}: SessionSummaryProps) {
  return (
    <div className="animate-fade-up mx-auto max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] sm:p-10">
      <div className="text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
          <Trophy className="h-7 w-7" />
        </div>
        <h2 className="font-display text-3xl">Session complete</h2>
        <p className="mt-1 text-[var(--text-secondary)]">
          Here&apos;s how you did overall.
        </p>

        <div className="mt-6 flex flex-col items-center gap-2">
          <ScoreRing score={averageScore} size={150} />
          <p className="text-sm text-[var(--text-secondary)]">
            {averageScore.toFixed(1)} out of 10 average
          </p>
        </div>
      </div>

      {/* Question breakdown */}
      <div className="mt-9">
        <h3 className="mb-4 font-display text-xl">Question breakdown</h3>
        <div className="space-y-3">
          {responses.map((r) => {
            const score = r.score ?? 0;
            return (
              <div key={r.question_number} className="flex items-center gap-3">
                <span className="w-7 shrink-0 text-sm text-[var(--text-secondary)]">
                  Q{r.question_number}
                </span>
                <Badge variant={typeVariant(r.question_type)}>
                  {r.question_type ?? "—"}
                </Badge>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(score / 10) * 100}%`,
                      backgroundColor: scoreColor(score),
                    }}
                  />
                </div>
                <span className="w-9 shrink-0 text-right text-sm font-medium">
                  {score % 1 === 0 ? score : score.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths + improvements */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-2 text-emerald-500">
            <CheckCircle2 className="h-5 w-5" />
            <h4 className="font-semibold">Top strengths</h4>
          </div>
          <ul className="space-y-2">
            {strengths.length ? (
              strengths.map((s, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm text-[var(--text-primary)]"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {s}
                </li>
              ))
            ) : (
              <li className="text-sm text-[var(--text-secondary)]">
                Keep practicing!
              </li>
            )}
          </ul>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 text-orange-500">
            <AlertTriangle className="h-5 w-5" />
            <h4 className="font-semibold">Key improvements</h4>
          </div>
          <ul className="space-y-2">
            {improvements.length ? (
              improvements.map((s, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm text-[var(--text-primary)]"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  {s}
                </li>
              ))
            ) : (
              <li className="text-sm text-[var(--text-secondary)]">
                No notes — great work!
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onPracticeAgain} className="flex-1">
          <RotateCcw className="h-4 w-4" />
          Practice again
        </Button>
        <Button onClick={onDashboard} variant="secondary" className="flex-1">
          <LayoutDashboard className="h-4 w-4" />
          Go to dashboard
        </Button>
      </div>
    </div>
  );
}
