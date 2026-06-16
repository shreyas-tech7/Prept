import { Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { BadgeProps } from "@/components/ui/badge";

interface QuestionCardProps {
  role: string;
  interviewType: string;
  difficulty: string;
  questionNumber: number;
  totalQuestions: number;
  question: string;
  questionType?: string;
  tip?: string;
}

const difficultyLabel: Record<string, string> = {
  entry: "Entry level",
  mid: "Mid level",
  senior: "Senior level",
};

function typeVariant(t?: string): BadgeProps["variant"] {
  if (t === "behavioral") return "behavioral";
  if (t === "technical") return "technical";
  if (t === "situational") return "situational";
  if (t === "mixed") return "mixed";
  return "neutral";
}

export function QuestionCard({
  role,
  interviewType,
  difficulty,
  questionNumber,
  totalQuestions,
  question,
  questionType,
  tip,
}: QuestionCardProps) {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-[#2A2A3C] bg-[#13131A] p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="neutral">{role}</Badge>
        <Badge variant={typeVariant(questionType ?? interviewType)}>
          {(questionType ?? interviewType) || "interview"}
        </Badge>
        <Badge variant="default">
          {difficultyLabel[difficulty] ?? difficulty}
        </Badge>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm text-[#9492A4]">
          <span>
            Question {questionNumber} of {totalQuestions}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="rounded-lg border border-[#2A2A3C] bg-[#1C1C27] p-5">
        <p className="text-xs uppercase tracking-wider text-[#9492A4]">
          Question
        </p>
        <p className="mt-2 font-display text-2xl leading-snug text-[#F1F0EE]">
          {question}
        </p>
      </div>

      {tip && (
        <div className="flex gap-2.5 rounded-lg bg-amber-500/5 p-4 text-sm text-amber-200/90">
          <Lightbulb className="h-5 w-5 shrink-0 text-amber-400" />
          <p>{tip}</p>
        </div>
      )}
    </div>
  );
}
