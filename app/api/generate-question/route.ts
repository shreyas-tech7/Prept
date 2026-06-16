import { NextRequest, NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { buildQuestionPrompt } from "@/lib/prompts";
import type { GeneratedQuestion } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { role, interviewType, difficulty, jobDescription, previousQuestions } =
      await req.json();

    if (!role || !interviewType || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = buildQuestionPrompt({
      role,
      interviewType,
      difficulty,
      jobDescription,
      previousQuestions: previousQuestions ?? [],
    });

    const parsed = await generateJson<GeneratedQuestion>(prompt, 500);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Question generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}
