"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mic, Loader2, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/session/QuestionCard";
import { VoiceRecorder } from "@/components/session/VoiceRecorder";
import { FeedbackCard } from "@/components/session/FeedbackCard";
import { SessionSummary } from "@/components/session/SessionSummary";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import type { FeedbackResult, GeneratedQuestion, Session } from "@/types";

type Phase = "loading" | "answer" | "feedback" | "complete" | "error" | "notfound";

interface AnsweredItem {
  question_number: number;
  question: string;
  question_type?: string;
  score: number;
  feedback: FeedbackResult;
}

function dedupe(items: string[], max: number) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const it of items) {
    const key = it.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(it);
    if (out.length >= max) break;
  }
  return out;
}

export default function SessionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const sessionId = params.id;

  const [session, setSession] = useState<Session | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [current, setCurrent] = useState<GeneratedQuestion | null>(null);
  const [answered, setAnswered] = useState<AnsweredItem[]>([]);
  const [activeFeedback, setActiveFeedback] = useState<FeedbackResult | null>(null);
  const [averageScore, setAverageScore] = useState(0);
  const initialized = useRef(false);

  const generateQuestion = useCallback(
    async (sess: Session, previous: string[]) => {
      setPhase("loading");
      try {
        const res = await fetch("/api/generate-question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: sess.role,
            interviewType: sess.interview_type,
            difficulty: sess.difficulty,
            jobDescription: sess.job_description,
            previousQuestions: previous,
          }),
        });
        if (!res.ok) throw new Error("generation failed");
        const data: GeneratedQuestion = await res.json();
        if (!data?.question) throw new Error("empty question");
        setCurrent(data);
        setActiveFeedback(null);
        setPhase("answer");
      } catch {
        setPhase("error");
        toast({
          variant: "error",
          title: "Couldn't generate a question",
          description: "Check your connection or API key, then retry.",
        });
      }
    },
    [toast]
  );

  // ---- Load session + any existing responses, then generate next question ----
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      const supabase = createClient();
      const { data: sess, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (error || !sess) {
        setPhase("notfound");
        return;
      }
      setSession(sess as Session);

      const { data: existing } = await supabase
        .from("responses")
        .select("*")
        .eq("session_id", sessionId)
        .order("question_number", { ascending: true });

      const prior: AnsweredItem[] = (existing ?? []).map((r) => ({
        question_number: r.question_number,
        question: r.question,
        question_type: r.question_type ?? undefined,
        score: Number(r.score ?? 0),
        feedback: {
          score: Number(r.score ?? 0),
          strengths: r.strengths ?? [],
          improvements: r.improvements ?? [],
          model_answer: r.model_answer ?? "",
          star_breakdown: r.star_breakdown ?? null,
        },
      }));
      setAnswered(prior);

      if (prior.length >= (sess as Session).question_count) {
        finishSession(sess as Session, prior);
        return;
      }
      generateQuestion(sess as Session, prior.map((p) => p.question));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const handleSubmitAnswer = useCallback(
    async (answer: string) => {
      if (!session || !current) return;
      const questionNumber = answered.length + 1;
      try {
        const res = await fetch("/api/evaluate-answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: session.role,
            question: current.question,
            questionType: current.question_type,
            difficulty: session.difficulty,
            answer,
            sessionId,
            questionNumber,
          }),
        });
        if (!res.ok) throw new Error("evaluation failed");
        const feedback: FeedbackResult = await res.json();

        setAnswered((prev) => [
          ...prev,
          {
            question_number: questionNumber,
            question: current.question,
            question_type: current.question_type,
            score: feedback.score,
            feedback,
          },
        ]);
        setActiveFeedback(feedback);
        setPhase("feedback");
      } catch {
        toast({
          variant: "error",
          title: "Couldn't score that answer",
          description: "Your answer wasn't saved — please try again.",
        });
        throw new Error("evaluation failed");
      }
    },
    [session, current, answered.length, sessionId, toast]
  );

  function finishSession(sess: Session, items: AnsweredItem[]) {
    const avg =
      items.length > 0
        ? items.reduce((s, i) => s + (i.score || 0), 0) / items.length
        : 0;
    setAverageScore(Math.round(avg * 10) / 10);
    setPhase("complete");
    // best-effort persistence
    fetch("/api/end-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sess.id }),
    }).catch(() => {});
  }

  function handleNext() {
    if (!session) return;
    if (answered.length >= session.question_count) {
      finishSession(session, answered);
    } else {
      generateQuestion(
        session,
        answered.map((a) => a.question)
      );
    }
  }

  const questionNumber = answered.length + 1;
  const isLast = !!session && questionNumber >= session.question_count;

  // ---------- Render ----------
  if (phase === "notfound") {
    return (
      <CenteredShell>
        <h1 className="font-display text-3xl">Session not found</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          This session doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </CenteredShell>
    );
  }

  if (phase === "complete" && session) {
    return (
      <div className="flex min-h-screen flex-col">
        <SessionHeader sessionId={sessionId} />
        <main className="flex-1 px-4 py-10 sm:px-6">
          <SessionSummary
            averageScore={averageScore}
            responses={answered.map((a) => ({
              question_number: a.question_number,
              question_type: a.question_type,
              score: a.score,
            }))}
            strengths={dedupe(
              answered.flatMap((a) => a.feedback.strengths ?? []),
              4
            )}
            improvements={dedupe(
              answered.flatMap((a) => a.feedback.improvements ?? []),
              4
            )}
            onPracticeAgain={() => router.push("/session/new")}
            onDashboard={() => router.push("/dashboard")}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SessionHeader sessionId={sessionId} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[38fr_62fr]">
          {/* Left panel */}
          <div>
            {session && current ? (
              <QuestionCard
                role={session.role}
                interviewType={session.interview_type}
                difficulty={session.difficulty}
                questionNumber={questionNumber}
                totalQuestions={session.question_count}
                question={current.question}
                questionType={current.question_type}
                tip={current.tip}
              />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
            {phase === "loading" && (
              <div className="flex min-h-[340px] flex-col items-center justify-center gap-4 text-center">
                <Loader2 className="h-9 w-9 animate-spin text-amber-400" />
                <p className="font-display text-xl">
                  Preparing your next question…
                </p>
              </div>
            )}

            {phase === "error" && (
              <div className="flex min-h-[340px] flex-col items-center justify-center gap-4 text-center">
                <p className="font-display text-xl">Something went wrong</p>
                <p className="max-w-xs text-sm text-[var(--text-secondary)]">
                  We couldn&apos;t generate a question. This usually means the
                  Anthropic API key isn&apos;t set.
                </p>
                <Button
                  onClick={() =>
                    session &&
                    generateQuestion(
                      session,
                      answered.map((a) => a.question)
                    )
                  }
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
              </div>
            )}

            {phase === "answer" && current && (
              <VoiceRecorder onSubmit={handleSubmitAnswer} />
            )}

            {phase === "feedback" && activeFeedback && (
              <FeedbackCard
                feedback={activeFeedback}
                questionType={current?.question_type}
                onNext={handleNext}
                isLast={isLast}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SessionHeader({ sessionId }: { sessionId: string }) {
  void sessionId;
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] backdrop-blur-md" style={{ backgroundColor: "var(--nav-bg)" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-black">
            <Mic className="h-4 w-4" />
          </span>
          <span className="font-display text-xl">Prept</span>
        </Link>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <X className="h-4 w-4" />
            Exit session
          </Link>
        </Button>
      </div>
    </header>
  );
}

function CenteredShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SessionHeader sessionId="" />
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        {children}
      </main>
    </div>
  );
}
