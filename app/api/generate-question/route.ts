import { NextRequest, NextResponse } from "next/server";
import { getAnthropic, MODEL, parseModelJson } from "@/lib/anthropic";
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

    const message = await getAnthropic().messages.create({
      model: MODEL,
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = parseModelJson<GeneratedQuestion>(text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Question generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}
