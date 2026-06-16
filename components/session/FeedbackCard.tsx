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
            i < v ? "bg-amber-500" : "bg-[#2A2A3C]"
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
    <div className="animate-fade-up rounded-xl border border-[#2A2A3C] bg-[#13131A] p-6 sm:p-8">
      {/* Score */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <ScoreRing score={feedback.score} size={120} />
        <div className="text-center sm:text-left">
          <p className="font-display text-2xl">Here&apos;s your coaching</p>
          <p className="mt-1 text-sm text-[#9492A4]">
            Scored against role-specific interview standards.
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Strengths */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />
          <h4 className="font-semibold">Strengths</h4>
        </div>
        <ul className="space-y-2">
          {feedback.strengths?.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-[#D6D5DE]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Improvements */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2 text-orange-400">
          <AlertTriangle className="h-5 w-5" />
          <h4 className="font-semibold">Improve</h4>
        </div>
        <ul className="space-y-2">
          {feedback.improvements?.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-[#D6D5DE]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
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
            className="flex w-full items-center justify-between rounded-lg border border-[#2A2A3C] bg-[#1C1C27] px-4 py-3 text-left text-sm font-medium transition hover:border-amber-500/40"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              See model answer
            </span>
            {showModel ? (
              <ChevronUp className="h-4 w-4 text-[#9492A4]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#9492A4]" />
            )}
          </button>
          {showModel && (
            <p className="animate-fade-in mt-3 rounded-lg border border-[#2A2A3C] bg-[#0F0F16] p-4 text-sm leading-relaxed text-[#C9C8D3]">
              {feedback.model_answer}
            </p>
          )}
        </div>
      )}

      {/* STAR breakdown */}
      {showStar && (
        <div className="mt-6 rounded-lg border border-[#2A2A3C] bg-[#1C1C27] p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-amber-400">⭐</span>
            <h4 className="font-semibold">STAR Breakdown</h4>
          </div>
          <div className="space-y-3">
            {STAR_LABELS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <span className="w-20 text-sm text-[#9492A4]">{label}</span>
                <StarBar value={star![key]} />
                <span className="w-8 text-right text-sm text-[#D6D5DE]">
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
          <Button onClick={onNext} disabled={nextLoading} className="w-full sm:w-auto">
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
