"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/session/ScoreRing";
import { Separator } from "@/components/ui/separator";
import type { FeedbackResult, StarBreakdown } from "@/types";

interface FeedbackCardProps {
  feedback: FeedbackResult;
  questionType?: string;
  onNext?: () => void;
  isLast?: boolean;
  nextLoading?: boolean;
}

const STAR_LABELS: { key: keyof StarBreakdown; label: string }[] = [
  { key: "situation", label: "Situation" },
  { key: "task", label: "Task" },
  { key: "action", label: "Action" },
  { key: "result", label: "Result" },
];

function StarBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(3, value));
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-2 w-7 rounded-full ${
            i < v ? "bg-amber-500" : "bg-[var(--border)]"
          }`}
        />
      ))}
    </div>
  );
}

export function FeedbackCard({
  feedback,
  questionType,
  onNext,
  isLast,
  nextLoading,
}: FeedbackCardProps) {
  const [showModel, setShowModel] = useState(false);
  const star = feedback.star_breakdown;
  const showStar = questionType === "behavioral" && star;

  return (
    <div className="animate-fade-up rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] sm:p-8">
      {/* Score */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <ScoreRing score={feedback.score} size={120} />
        <div className="text-center sm:text-left">
          <p className="font-display text-2xl">Here&apos;s your coaching</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Scored against role-specific interview standards.
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Strengths */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-500">
          <CheckCircle2 className="h-5 w-5" />
          <h4 className="font-semibold">Strengths</h4>
        </div>
        <ul className="space-y-2">
          {feedback.strengths?.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-[var(--text-primary)]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Improvements */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2 text-orange-500">
          <AlertTriangle className="h-5 w-5" />
          <h4 className="font-semibold">Improve</h4>
        </div>
        <ul className="space-y-2">
          {feedback.improvements?.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-[var(--text-primary)]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Model answer (expandable) */}
      {feedback.model_answer && (
        <div className="mt-6">
          <button
            onClick={() => setShowModel((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-left text-sm font-medium transition-colors hover:border-amber-500/40"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              See model answer
            </span>
            {showModel ? (
              <ChevronUp className="h-4 w-4 text-[var(--text-secondary)]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[var(--text-secondary)]" />
            )}
          </button>
          {showModel && (
            <p className="animate-fade-in mt-3 rounded-lg border border-[var(--border)] bg-[var(--surface-inset)] p-4 text-sm leading-relaxed text-[var(--text-primary)]">
              {feedback.model_answer}
            </p>
          )}
        </div>
      )}

      {/* STAR breakdown */}
      {showStar && (
        <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
          <div className="mb-3 flex items-center gap-2 text-amber-500">
            <Sparkles className="h-4 w-4" />
            <h4 className="font-semibold">STAR Breakdown</h4>
          </div>
          <div className="space-y-3">
            {STAR_LABELS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <span className="w-20 text-sm text-[var(--text-secondary)]">
                  {label}
                </span>
                <StarBar value={star![key]} />
                <span className="w-8 text-right text-sm text-[var(--text-primary)]">
                  {Math.max(0, Math.min(3, star![key]))}/3
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next */}
      {onNext && (
        <div className="mt-7">
          <Button
            onClick={onNext}
            disabled={nextLoading}
            className="w-full sm:w-auto"
          >
            {nextLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </>
            ) : (
              <>
                {isLast ? "See your results" : "Next question"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
