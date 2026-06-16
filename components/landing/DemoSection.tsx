"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Send, Loader2, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FeedbackCard } from "@/components/session/FeedbackCard";
import type { FeedbackResult } from "@/types";

const DEMO_QUESTION =
  "Tell me about a time you faced a tight deadline and how you handled it.";

function mockEvaluate(answer: string): FeedbackResult {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wc = words.length;
  const hasNumbers = /\d/.test(answer);
  const mentionsResult = /(result|outcome|impact|improved|increased|reduced|delivered|shipped|won|saved)/i.test(
    answer
  );
  const mentionsAction = /(i (led|built|created|organized|decided|coordinated|prioritized|negotiated|implemented))/i.test(
    answer
  );

  let score = 3;
  if (wc >= 25) score += 2;
  if (wc >= 60) score += 1;
  if (hasNumbers) score += 1.5;
  if (mentionsResult) score += 1.5;
  if (mentionsAction) score += 1;
  score = Math.max(1, Math.min(10, Math.round(score * 2) / 2));

  const strengths: string[] = [];
  if (wc >= 25) strengths.push("You gave enough context to follow the story.");
  if (mentionsAction)
    strengths.push("You clearly described the actions you personally took.");
  if (hasNumbers)
    strengths.push("You quantified part of your answer, which adds credibility.");
  if (strengths.length === 0)
    strengths.push("You stayed on topic and answered the question directly.");

  const improvements: string[] = [];
  if (!mentionsResult)
    improvements.push("End with a concrete result — what changed because of you?");
  if (!hasNumbers)
    improvements.push("Add a number or metric to make the impact tangible.");
  if (wc < 40)
    improvements.push("Expand the middle — walk through the specific steps you took.");
  if (improvements.length === 0)
    improvements.push("Tighten the opening so you reach the action faster.");

  return {
    score,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    model_answer:
      "A strong answer would set the scene briefly (the deadline, the stakes), then focus most of the time on what YOU did: how you triaged the work, what you cut, who you aligned, and the trade-offs you made. It would close with a measurable result — shipped two days early, zero critical bugs, or a stakeholder quote — so the interviewer remembers the impact, not just the effort.",
    star_breakdown: {
      situation: wc >= 20 ? 2 : 1,
      task: mentionsAction ? 2 : 1,
      action: mentionsAction ? 3 : wc >= 40 ? 2 : 1,
      result: mentionsResult ? 3 : hasNumbers ? 2 : 1,
    },
  };
}

export function DemoSection() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);

  async function run() {
    if (!answer.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setFeedback(mockEvaluate(answer));
    setLoading(false);
  }

  function reset() {
    setFeedback(null);
    setAnswer("");
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-500">
          <Sparkles className="h-3.5 w-3.5" />
          Try it now — no sign-up
        </div>
        <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
          Try a sample question
        </h2>
        <p className="mt-3 text-[var(--text-secondary)]">
          Type a quick answer and see exactly the kind of coaching Prept gives.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="behavioral">behavioral</Badge>
          <span className="text-xs text-[var(--text-secondary)]">Sample · Product Manager</span>
        </div>
        <p className="font-display text-2xl leading-snug">{DEMO_QUESTION}</p>

        {!feedback ? (
          <div className="mt-6 space-y-4">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type a short answer here (a few sentences is enough)…"
              className="min-h-[140px]"
              disabled={loading}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)]">
                {answer.trim() ? answer.trim().split(/\s+/).length : 0} words
              </span>
              <Button onClick={run} disabled={loading || !answer.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Coaching…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Get feedback
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <FeedbackCard feedback={feedback} questionType="behavioral" />
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button variant="secondary" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
                Try another answer
              </Button>
              <Button asChild>
                <Link href="/auth/signup">
                  Practice for real
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
