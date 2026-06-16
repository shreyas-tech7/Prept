import { NextRequest, NextResponse } from "next/server";
import { getAnthropic, MODEL, parseModelJson } from "@/lib/anthropic";
import { buildEvaluationPrompt } from "@/lib/prompts";
import { createServerClient } from "@/lib/supabase/server";
import type { FeedbackResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const {
      role,
      question,
      questionType,
      difficulty,
      answer,
      sessionId,
      questionNumber,
    } = await req.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Missing question or answer" },
        { status: 400 }
      );
    }

    const prompt = buildEvaluationPrompt({
      role,
      question,
      questionType,
      difficulty,
      answer,
    });

    const message = await getAnthropic().messages.create({
      model: MODEL,
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const feedback = parseModelJson<FeedbackResult>(text);

    // Persist the response (best-effort — never block feedback on a DB error).
    try {
      const supabase = createServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && sessionId) {
        await supabase.from("responses").insert({
          session_id: sessionId,
          user_id: user.id,
          question_number: questionNumber,
          question,
          question_type: questionType,
          user_answer: answer,
          score: feedback.score,
          strengths: feedback.strengths,
          improvements: feedback.improvements,
          model_answer: feedback.model_answer,
          star_breakdown: feedback.star_breakdown ?? null,
        });
      }
    } catch (dbError) {
      console.error("Failed to persist response:", dbError);
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate answer" },
      { status: 500 }
    );
  }
}
