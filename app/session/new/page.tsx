"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  MessageSquare,
  Code2,
  Shuffle,
  ChevronDown,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Difficulty, InterviewType } from "@/types";

const ROLES = [
  "Product Manager",
  "Software Engineer",
  "Data Analyst",
  "UX Designer",
  "Marketing Manager",
  "Data Scientist",
];

const TYPES: {
  value: InterviewType;
  title: string;
  body: string;
  icon: typeof MessageSquare;
}[] = [
  {
    value: "behavioral",
    title: "Behavioral",
    body: '"Tell me about a time..." questions using the STAR method.',
    icon: MessageSquare,
  },
  {
    value: "technical",
    title: "Technical",
    body: "Role-specific knowledge and scenario questions.",
    icon: Code2,
  },
  {
    value: "mixed",
    title: "Mixed",
    body: "A balanced combination of both styles.",
    icon: Shuffle,
  },
];

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
];

const COUNTS = [3, 5, 10];

export default function NewSessionPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [showJD, setShowJD] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [interviewType, setInterviewType] = useState<InterviewType | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("mid");
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);

  function next() {
    if (step === 1 && !role.trim()) {
      toast({
        variant: "error",
        title: "Add a role",
        description: "Tell us what role you're preparing for.",
      });
      return;
    }
    if (step === 2 && !interviewType) {
      toast({ variant: "error", title: "Pick an interview type" });
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  }

  async function startInterview() {
    if (!interviewType) return;
    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login?redirect=/session/new");
      return;
    }

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        user_id: user.id,
        role: role.trim(),
        job_description: jobDescription.trim() || null,
        interview_type: interviewType,
        difficulty,
        question_count: questionCount,
      })
      .select()
      .single();

    if (error || !data) {
      setLoading(false);
      toast({
        variant: "error",
        title: "Couldn't start session",
        description: error?.message ?? "Please try again.",
      });
      return;
    }

    router.push(`/session/${data.id}`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        {/* Progress */}
        <div className="mb-10">
          <div className="mb-2 flex items-center justify-between text-sm text-[var(--text-secondary)]">
            <span>Step {step} of 3</span>
            <span>
              {step === 1 ? "Role" : step === 2 ? "Interview type" : "Settings"}
            </span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  s <= step ? "bg-amber-500" : "bg-[var(--surface-2)]"
                )}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Role */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="font-display text-3xl">
              What role are you preparing for?
            </h2>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Product Manager, Software Engineer"
              className="h-12 text-base"
              autoFocus
            />
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                    role === r
                      ? "border-amber-500 bg-amber-500/10 text-amber-500"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:border-amber-500/40 hover:text-[var(--text-primary)]"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>

            <div>
              <button
                onClick={() => setShowJD((v) => !v)}
                className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    showJD && "rotate-180"
                  )}
                />
                Or paste a job description for tailored questions
              </button>
              {showJD && (
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here…"
                  className="mt-3 min-h-[140px]"
                />
              )}
            </div>
          </div>
        )}

        {/* Step 2: Interview type */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="font-display text-3xl">What type of interview?</h2>
            <div className="grid gap-4">
              {TYPES.map((t) => {
                const active = interviewType === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setInterviewType(t.value)}
                    className={cn(
                      "flex items-start gap-4 rounded-xl border p-5 text-left transition-colors",
                      active
                        ? "border-amber-500 bg-amber-500/5"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-amber-500/40"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
                        active
                          ? "bg-amber-500 text-black"
                          : "bg-[var(--surface-2)] text-[var(--text-secondary)]"
                      )}
                    >
                      <t.icon className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <p className="font-display text-xl">{t.title}</p>
                      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                        {t.body}
                      </p>
                    </div>
                    {active && <Check className="h-5 w-5 text-amber-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Settings */}
        {step === 3 && (
          <div className="animate-fade-in space-y-8">
            <h2 className="font-display text-3xl">Final settings</h2>

            <div>
              <p className="mb-3 text-sm text-[var(--text-secondary)]">Difficulty</p>
              <div className="grid grid-cols-3 gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className={cn(
                      "rounded-md py-2.5 text-sm font-medium transition-colors",
                      difficulty === d.value
                        ? "bg-amber-500 text-black"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm text-[var(--text-secondary)]">
                Number of questions
              </p>
              <div className="grid grid-cols-3 gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1">
                {COUNTS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setQuestionCount(c)}
                    className={cn(
                      "rounded-md py-2.5 text-sm font-medium transition-colors",
                      questionCount === c
                        ? "bg-amber-500 text-black"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)]">
              You&apos;ll practice{" "}
              <span className="text-[var(--text-primary)]">{questionCount}</span>{" "}
              <span className="text-[var(--text-primary)]">{interviewType}</span>{" "}
              questions for a{" "}
              <span className="text-[var(--text-primary)]">{role || "—"}</span> role.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          {step > 1 ? (
            <Button
              variant="secondary"
              onClick={() => setStep((s) => s - 1)}
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <Button onClick={next}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={startInterview} disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Starting…
                </>
              ) : (
                <>
                  Start Interview
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
